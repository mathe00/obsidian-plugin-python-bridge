#!/usr/bin/env bun
/**
 * bump-version.ts - Auto-increment patch version on commits to main only
 *
 * This script is called by the Husky pre-commit hook AFTER validation passes.
 * It reads the current version from package.json, increments the patch
 * number (e.g., 2.0.0 → 2.0.1), writes the new version to package.json,
 * manifest.json, and versions.json, synchronizes bun.lock, and stages all
 * files with `git add`.
 *
 * IMPORTANT: This script only runs when the current branch is `main`.
 * On feature branches, it exits silently (exit 0) to avoid version conflicts
 * that cause merge conflicts when merging back into main.
 *
 * Usage:
 *   bun run bump-version
 *
 * Exit codes:
 *   0 - Version bumped successfully (or skipped on non-main branch)
 *   1 - Error (version format invalid, file read/write failed, etc.)
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { $ } from 'bun';

// ============================================================================
// Branch guard - only bump version on main
// ============================================================================

/**
 * Check if the current branch is `main`.
 * During a merge, git rev-parse --abbrev-ref HEAD returns the target branch
 * (e.g., "main"), so merge commits into main are correctly handled.
 */
async function isMainBranch(): Promise<boolean> {
  try {
    const branch = await $`git rev-parse --abbrev-ref HEAD`.text();
    return branch.trim() === 'main';
  } catch {
    // In edge cases (detached HEAD, etc.), skip the bump to be safe
    return false;
  }
}

// ============================================================================
// Configuration
// ============================================================================

/** Path to the project root (where package.json lives) */
const PROJECT_ROOT = resolve(import.meta.dir, '..');

/** Paths to version files that need updates */
const PKG_PATH = resolve(PROJECT_ROOT, 'package.json');
const MANIFEST_PATH = resolve(PROJECT_ROOT, 'manifest.json');
const VERSIONS_PATH = resolve(PROJECT_ROOT, 'versions.json');

// ============================================================================
// Version utilities
// ============================================================================

/**
 * Parse a semver version string into its components.
 * Expected format: "X.Y.Z" where X, Y, Z are non-negative integers.
 *
 * @param version - Version string to parse (e.g., "2.0.0")
 * @returns Tuple of [major, minor, patch]
 * @throws Error if version format is invalid
 */
function parseVersion(version: string): [number, number, number] {
  const parts = version.trim().split('.');
  if (parts.length !== 3) {
    throw new Error(`Invalid version format: "${version}". Expected "X.Y.Z".`);
  }
  const [majorStr, minorStr, patchStr] = parts;
  const major = parseInt(majorStr, 10);
  const minor = parseInt(minorStr, 10);
  const patch = parseInt(patchStr, 10);

  if ([major, minor, patch].some((n) => Number.isNaN(n) || n < 0)) {
    throw new Error(
      `Invalid version numbers in: "${version}". All parts must be non-negative integers.`
    );
  }

  return [major, minor, patch];
}

/**
 * Increment the patch version number by 1.
 *
 * @param version - Current version string (e.g., "2.0.0")
 * @returns New version string with patch incremented (e.g., "2.0.1")
 */
function incrementPatch(version: string): string {
  const [major, minor, patch] = parseVersion(version);
  return `${major}.${minor}.${patch + 1}`;
}

// ============================================================================
// File operations
// ============================================================================

/**
 * Read and parse a JSON file.
 *
 * @param filePath - Absolute path to the JSON file
 * @returns Parsed JSON content
 */
function readJson(filePath: string): Record<string, unknown> {
  try {
    const rawText = readFileSync(filePath, 'utf-8');
    return JSON.parse(rawText) as Record<string, unknown>;
  } catch (error) {
    throw new Error(`Failed to read JSON at "${filePath}": ${error}`);
  }
}

/**
 * Write a JSON file with the updated content.
 * Uses 2-space indentation and trailing newline.
 *
 * @param filePath - Absolute path to the JSON file
 * @param content - Updated content object
 */
function writeJson(filePath: string, content: Record<string, unknown>): void {
  try {
    const json = JSON.stringify(content, null, 2) + '\n';
    writeFileSync(filePath, json, 'utf-8');
  } catch (error) {
    throw new Error(`Failed to write JSON at "${filePath}": ${error}`);
  }
}

// ============================================================================
// Signal handling - cleanup on abort/kill
// ============================================================================

/** Store original file contents for restoration on interruption */
const originalContents: Record<string, string | null> = {
  package: null,
  manifest: null,
  versions: null,
};

/** Restore original file contents (cleanup on signal/interrupt) */
function restoreOriginals(): void {
  const files: [string, string | null][] = [
    [PKG_PATH, originalContents.package],
    [MANIFEST_PATH, originalContents.manifest],
    [VERSIONS_PATH, originalContents.versions],
  ];
  for (const [path, content] of files) {
    if (content) {
      try {
        writeFileSync(path, content, 'utf-8');
        console.warn(`🔄 Restored original ${path.split('/').pop()}`);
      } catch {
        // ignore
      }
    }
  }
}

/** Register cleanup handlers for graceful restoration on interruption */
let cleanupRegistered = false;
function registerCleanup(): void {
  if (cleanupRegistered) return;
  cleanupRegistered = true;

  process.on('SIGINT', () => {
    console.warn('\n⚠️  Interrupted - restoring original files');
    restoreOriginals();
    process.exit(130); // 128 + SIGINT(2)
  });

  process.on('SIGTERM', () => {
    console.warn('\n⚠️  Terminated - restoring original files');
    restoreOriginals();
    process.exit(143); // 128 + SIGTERM(15)
  });

  process.on('uncaughtException', (err) => {
    console.error('\n❌ Uncaught exception - restoring original files:', err);
    restoreOriginals();
    process.exit(1);
  });
}

// ============================================================================
// Main logic
// ============================================================================

async function main(): Promise<void> {
  registerCleanup();

  // 0. Only bump version on main branch — skip silently on feature branches
  if (!(await isMainBranch())) {
    return;
  }

  // 1. Read current version from package.json (source of truth)
  const pkg = readJson(PKG_PATH);
  const currentVersion = pkg.version as string;

  if (!currentVersion) {
    console.error('❌ No "version" field found in package.json');
    process.exit(1);
  }

  // 2. Increment patch version
  const newVersion = incrementPatch(currentVersion);

  // 3. Save originals for cleanup on interrupt
  originalContents.package = readFileSync(PKG_PATH, 'utf-8');
  originalContents.manifest = readFileSync(MANIFEST_PATH, 'utf-8');
  originalContents.versions = readFileSync(VERSIONS_PATH, 'utf-8');

  // 4. Update package.json
  pkg.version = newVersion;
  writeJson(PKG_PATH, pkg);

  // 5. Update manifest.json (version only, preserve other fields)
  const manifest = readJson(MANIFEST_PATH);
  manifest.version = newVersion;
  // manifest.json uses tab indentation for Obsidian compatibility
  writeFileSync(
    MANIFEST_PATH,
    JSON.stringify(manifest, null, '\t') + '\n',
    'utf-8'
  );

  // 6. Update versions.json (add new version entry if not already present)
  const versions = readJson(VERSIONS_PATH);
  const minAppVersion = manifest.minAppVersion as string;
  if (!Object.values(versions).includes(minAppVersion)) {
    versions[newVersion] = minAppVersion;
    writeJson(VERSIONS_PATH, versions);
  }

  // 7. Format package.json with prettier to match validate's formatting
  //    manifest.json and versions.json use custom indentation, skip them
  try {
    await $`bunx prettier --write ${PKG_PATH}`.quiet();
  } catch (error) {
    console.warn('⚠️  Failed to format package.json with prettier:', error);
    // Continue anyway - file is still valid JSON
  }

  // 8. Synchronize bun.lock to reflect the new version
  try {
    await $`bun install`.quiet();
  } catch (error) {
    console.error('❌ Failed to synchronize bun.lock:', error);
    console.warn(
      '⚠️  bun.lock may be out of sync. Run `bun install` manually.'
    );
    process.exit(1);
  }

  // 9. Stage all version files for the current commit
  try {
    await $`git add package.json manifest.json versions.json bun.lock`
      .cwd(PROJECT_ROOT)
      .quiet();
  } catch (error) {
    console.error('❌ Failed to stage version files:', error);
    console.warn(
      '⚠️  Version files were modified but not staged. The commit may not include the bump.'
    );
    process.exit(1);
  }

  // 10. Verify that files are actually staged (defensive check)
  try {
    const stagedFiles = await $`git diff --cached --name-only`
      .cwd(PROJECT_ROOT)
      .text();
    const required = ['package.json', 'manifest.json'];
    const missing = required.filter((f) => !stagedFiles.includes(f));
    if (missing.length > 0) {
      console.error('❌ Version files were not properly staged:', missing);
      console.warn(
        '⚠️  Run `git add package.json manifest.json versions.json bun.lock` manually.'
      );
      process.exit(1);
    }
  } catch {
    console.warn('⚠️  Could not verify staging status, continuing anyway');
  }

  // 11. Print result (this goes to git commit output, keep it concise)
  console.log(`📦 Version bumped: ${currentVersion} → ${newVersion}`);
}

// Run
main();
