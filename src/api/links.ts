// --- src/api/links.ts ---
// Retrieves outgoing links from notes.

import { normalizePath } from 'obsidian';
import type ObsidianPythonBridge from '../main';

/**
 * Retrieves outgoing links (including embeds) from a note's metadata cache.
 * @param plugin The ObsidianPythonBridge plugin instance.
 * @param relativePath Vault-relative path of the note.
 * @returns A list of outgoing link strings.
 * @throws Error if the note is not found or metadata cannot be retrieved.
 */
export function getLinks(plugin: ObsidianPythonBridge, relativePath: string): string[] {
  const normalizedPath = normalizePath(relativePath);
  plugin.logDebug(`Attempting to get outgoing links for: ${normalizedPath}`);
  const metadata = plugin.app.metadataCache.getCache(normalizedPath);
  if (!metadata) {
    const fileExists = !!plugin.app.vault.getAbstractFileByPath(normalizedPath);
    if (!fileExists)
      throw new Error(`Cannot get links: File not found at path "${normalizedPath}"`);
    else {
      plugin.logWarn(`No metadata cache found for file "${normalizedPath}" to get links.`);
      return [];
    }
  }
  const outgoingLinks: string[] = [];
  if (metadata.links) metadata.links.forEach(link => outgoingLinks.push(link.link));
  if (metadata.embeds) metadata.embeds.forEach(embed => outgoingLinks.push(embed.link));
  const uniqueLinks = Array.from(new Set(outgoingLinks));
  plugin.logDebug(
    `Found ${uniqueLinks.length} unique outgoing links/embeds for ${normalizedPath}.`
  );
  return uniqueLinks;
}
