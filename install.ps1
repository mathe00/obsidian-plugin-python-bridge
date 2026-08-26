# ══════════════════════════════════════════════════════════════════════════════
# 🐍 Obsidian Python Bridge — Interactive PowerShell Installer
# https://github.com/mathe00/obsidian-plugin-python-bridge
#
# COMPATIBILITY: PowerShell 5.1+ (Windows 7/8/10/11 built-in)
#               Also works on PowerShell 7+ if available.
#
# One-liner install (Windows PowerShell / CMD):
#   powershell -Command "irm https://raw.githubusercontent.com/mathe00/obsidian-plugin-python-bridge/main/install.ps1 | iex"
#
# Or from within PowerShell:
#   irm https://raw.githubusercontent.com/mathe00/obsidian-plugin-python-bridge/main/install.ps1 | iex
#
# License: MIT — Same as the project itself.
# ══════════════════════════════════════════════════════════════════════════════

#Requires -Version 5.1

[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"

# ─── Color Helper Functions ────────────────────────────────────────────────────
# All use basic Write-Host which works on PS 5.1+

function Write-Info {
    param([string]$Msg)
    Write-Host "  " -NoNewline
    Write-Host "ℹ" -ForegroundColor Cyan -NoNewline
    Write-Host "  $Msg"
}

function Write-Success {
    param([string]$Msg)
    Write-Host "  " -NoNewline
    Write-Host "✔" -ForegroundColor Green -NoNewline
    Write-Host "  $Msg"
}

function Write-Warn {
    param([string]$Msg)
    Write-Host "  " -NoNewline
    Write-Host "⚠" -ForegroundColor Yellow -NoNewline
    Write-Host "  $Msg"
}

function Write-Err {
    param([string]$Msg)
    Write-Host "  " -NoNewline
    Write-Host "✘" -ForegroundColor Red -NoNewline
    Write-Host "  $Msg"
}

function Write-Step {
    param([int]$Num, [string]$Title)
    Write-Host ""
    Write-Host "  " -NoNewline
    Write-Host "▸ Step ${Num}: " -ForegroundColor Blue -NoNewline
    Write-Host $Title -ForegroundColor White
}

function Write-Sep {
    Write-Host "  ─────────────────────────────────────────────────────────" -ForegroundColor DarkGray
}

function Write-Ask {
    param([string]$Msg)
    Write-Host "  " -NoNewline
    Write-Host "❯ " -ForegroundColor Magenta -NoNewline
    Write-Host "$Msg " -NoNewline
    return Read-Host
}

# ─── Banner ────────────────────────────────────────────────────────────────────

function Print-Banner {
    Write-Host ""
    Write-Host "  ╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "  ║                                                               ║" -ForegroundColor Cyan
    Write-Host "  ║   " -ForegroundColor Cyan -NoNewline
    Write-Host "🐍 Obsidian Python Bridge" -ForegroundColor Green -NoNewline
    Write-Host "  —  Interactive Installer       ║" -ForegroundColor Cyan
    Write-Host "  ║                                                               ║" -ForegroundColor Cyan
    Write-Host "  ║   " -ForegroundColor Cyan -NoNewline
    Write-Host "Write Obsidian plugins in Python!" -ForegroundColor DarkGray -NoNewline
    Write-Host "                          ║" -ForegroundColor Cyan
    Write-Host "  ║   " -ForegroundColor Cyan -NoNewline
    Write-Host "https://github.com/mathe00/obsidian-plugin-python-bridge" -ForegroundColor DarkGray -NoNewline
    Write-Host "    ║" -ForegroundColor Cyan
    Write-Host "  ║                                                               ║" -ForegroundColor Cyan
    Write-Host "  ╚═══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
}

# ─── Find Obsidian Vaults ─────────────────────────────────────────────────────

function Find-Vaults {
    # PS 5.1 compatible list creation (avoid ::new() which is PS 5+ / .NET only)
    $candidates = New-Object System.Collections.ArrayList

    $searchDirs = @(
        $env:USERPROFILE
        "$env:USERPROFILE\Documents"
        "$env:USERPROFILE\Desktop"
        "$env:USERPROFILE\Obsidian"
        "$env:USERPROFILE\OneDrive\Documents"
        "$env:USERPROFILE\OneDrive"
    )

    # Also check Dropbox if present
    if (Test-Path "$env:USERPROFILE\Dropbox") {
        $searchDirs += "$env:USERPROFILE\Dropbox"
    }

    foreach ($searchDir in $searchDirs) {
        if (-not (Test-Path $searchDir)) { continue }

        try {
            # -Depth is not available in PS 5.1, use -Recurse with limited path depth check
            $obsDirs = Get-ChildItem -Path $searchDir -Directory -Recurse -Filter ".obsidian" -ErrorAction SilentlyContinue |
                Select-Object -First 10

            foreach ($obsDir in $obsDirs) {
                $vaultPath = Split-Path -Parent $obsDir.FullName
                # Skip paths inside .obsidian/plugins (those are nested plugin dirs)
                if ($vaultPath -match "\\.obsidian\\plugins") { continue }
                # Skip if too deep (more than 3 levels below search dir)
                $relativePath = $vaultPath.Substring($searchDir.Length).TrimStart("\")
                $depth = ($relativePath.Split("\").Count)
                if ($depth -gt 3) { continue }
                # Deduplicate
                if ($candidates -notcontains $vaultPath) {
                    [void]$candidates.Add($vaultPath)
                }
            }
        }
        catch {
            # Silently continue on permission errors
        }
    }

    return @($candidates)
}

# ─── Prompt for Vault Path ────────────────────────────────────────────────────

function Prompt-VaultPath {
    $vaults = Find-Vaults

    if ($vaults.Count -gt 0) {
        Write-Host ""
        Write-Host "  Obsidian vault(s) detected on your system:" -ForegroundColor White
        Write-Host ""

        $i = 1
        foreach ($v in $vaults) {
            Write-Host "  " -NoNewline
            Write-Host "[$i]" -ForegroundColor Cyan -NoNewline
            Write-Host "  $v"
            $i++
        }
        Write-Host "  " -NoNewline
        Write-Host "[0]" -ForegroundColor Cyan -NoNewline
        Write-Host "  Enter path manually"
        Write-Host ""

        $choice = Write-Ask "Choose a vault (0-$($vaults.Count)):"

        if ($choice -match '^\d+$' -and [int]$choice -ge 1 -and [int]$choice -le $vaults.Count) {
            $script:SelectedVault = $vaults[([int]$choice - 1)]
        }
        elseif ($choice -eq "0") {
            $script:SelectedVault = Write-Ask "Enter the full path to your Obsidian vault:"
        }
        else {
            Write-Err "Invalid choice."
            exit 1
        }
    }
    else {
        Write-Host ""
        Write-Host "  No Obsidian vaults auto-detected." -ForegroundColor DarkGray
        $script:SelectedVault = Write-Ask "Enter the full path to your Obsidian vault:"
    }

    # Validate
    if (-not (Test-Path $script:SelectedVault)) {
        Write-Err "Directory does not exist: $($script:SelectedVault)"
        $create = Write-Ask "Create it? (y/N):"
        if ($create -match '^[Yy]$') {
            New-Item -ItemType Directory -Path $script:SelectedVault -Force | Out-Null
            Write-Success "Created directory: $($script:SelectedVault)"
        }
        else {
            Write-Err "Cannot continue without a valid vault directory."
            exit 1
        }
    }

    # Verify it looks like a vault
    if (-not (Test-Path "$($script:SelectedVault)\.obsidian")) {
        Write-Warn "No .obsidian directory found at $($script:SelectedVault)"
        Write-Warn "This may not be a valid Obsidian vault."
        $cont = Write-Ask "Continue anyway? (y/N):"
        if ($cont -notmatch '^[Yy]$') { exit 0 }
    }

    # Expand to full path (works on PS 5.1)
    $script:SelectedVault = [System.IO.Path]::GetFullPath($script:SelectedVault)
    Write-Success "Vault path: $($script:SelectedVault)"
}

# ─── Safe Python Runner (PS 5.1 compatible) ───────────────────────────────────
# In PS 5.1, & cmd 2>$null can throw into catch even for non-zero exit codes.
# We wrap calls to handle this properly.

function Test-PythonModule {
    param([string]$ModuleName)
    try {
        $proc = Start-Process -FilePath $script:PythonCmd -ArgumentList "-c","import $ModuleName" -NoNewWindow -Wait -PassThru -RedirectStandardError "$($script:TmpDir)\err.tmp" -RedirectStandardOutput "$($script:TmpDir)\out.tmp"
        return ($proc.ExitCode -eq 0)
    }
    catch {
        return $false
    }
}

function Run-PythonPip {
    param([string]$Package, [string]$ExtraArgs)
    try {
        $argList = @("-m", "pip", "install")
        if ($ExtraArgs) { $argList += $ExtraArgs.Split(" ") }
        $argList += $Package
        $proc = Start-Process -FilePath $script:PythonCmd -ArgumentList $argList -NoNewWindow -Wait -PassThru -RedirectStandardError "$($script:TmpDir)\err.tmp" -RedirectStandardOutput "$($script:TmpDir)\out.tmp"
        return ($proc.ExitCode -eq 0)
    }
    catch {
        return $false
    }
}

# ─── Check Prerequisites ──────────────────────────────────────────────────────

function Check-Prerequisites {
    $script:PythonCmd = $null

    # Try py launcher first (standard on Windows), then python, then python3
    $cmdsToTry = @("py", "python", "python3")

    foreach ($cmd in $cmdsToTry) {
        try {
            # Use Get-Command to check existence (PS 5.1 compatible)
            $cmdInfo = Get-Command $cmd -ErrorAction SilentlyContinue
            if (-not $cmdInfo) { continue }

            # Check version
            $proc = Start-Process -FilePath $cmd -ArgumentList "--version" -NoNewWindow -Wait -PassThru -RedirectStandardError "$($script:TmpDir)\pyver_err.tmp" -RedirectStandardOutput "$($script:TmpDir)\pyver_out.tmp"
            if ($proc.ExitCode -eq 0) {
                $version = Get-Content "$($script:TmpDir)\pyver_out.tmp" -ErrorAction SilentlyContinue
                if ($version -match "Python 3") {
                    $script:PythonCmd = $cmd
                    $script:PythonVersion = $version.Trim()
                    break
                }
            }
        }
        catch {
            # Command not found, try next
        }
    }

    if (-not $script:PythonCmd) {
        Write-Err "Python 3 is not installed or not in PATH."
        Write-Host ""
        Write-Info "Install Python 3 from: https://www.python.org/downloads/"
        Write-Info "Make sure to check 'Add Python to PATH' during installation."
        exit 1
    }

    Write-Success "Python: $($script:PythonVersion)"
}

# ─── Get Latest Release Info ──────────────────────────────────────────────────

function Get-LatestRelease {
    Write-Info "Fetching latest release info from GitHub..."

    # PS 5.1 requires -UseBasicParsing when IE is not available/initialized
    try {
        $release = Invoke-RestMethod -Uri "https://api.github.com/repos/mathe00/obsidian-plugin-python-bridge/releases/latest" -TimeoutSec 30 -UseBasicParsing
    }
    catch {
        Write-Err "Failed to fetch release info from GitHub."
        Write-Err "Check your internet connection and try again."
        Write-Err "Error: $($_.Exception.Message)"
        exit 1
    }

    $script:ReleaseTag = $release.tag_name

    if (-not $script:ReleaseTag) {
        Write-Err "Could not determine latest release version."
        exit 1
    }

    # Extract asset URLs from the release object
    $script:ReleaseZipUrl = $null
    $script:MainJsUrl = $null
    $script:ManifestUrl = $null
    $script:PyLibUrl = $null

    foreach ($asset in $release.assets) {
        if ($asset.name -like "obsidian-python-bridge-*.zip" -and -not $script:ReleaseZipUrl) {
            $script:ReleaseZipUrl = $asset.browser_download_url
        }
        elseif ($asset.name -eq "main.js" -and -not $script:MainJsUrl) {
            $script:MainJsUrl = $asset.browser_download_url
        }
        elseif ($asset.name -eq "manifest.json" -and -not $script:ManifestUrl) {
            $script:ManifestUrl = $asset.browser_download_url
        }
        elseif ($asset.name -eq "ObsidianPluginDevPythonToJS.py" -and -not $script:PyLibUrl) {
            $script:PyLibUrl = $asset.browser_download_url
        }
    }

    $script:SourceTarballUrl = "https://api.github.com/repos/mathe00/obsidian-plugin-python-bridge/tarball/main"

    Write-Success "Latest release: v$($script:ReleaseTag)"
}

# ─── Download File ────────────────────────────────────────────────────────────

function Download-File {
    param(
        [string]$Url,
        [string]$Destination
    )
    try {
        # -UseBasicParsing is REQUIRED for PS 5.1 without IE first-run
        Invoke-WebRequest -Uri $Url -OutFile $Destination -TimeoutSec 120 -UseBasicParsing
    }
    catch {
        Write-Err "Failed to download from: $Url"
        Write-Err "Error: $($_.Exception.Message)"
        throw
    }
}

# ─── Install Plugin Files ─────────────────────────────────────────────────────

function Install-PluginFiles {
    param(
        [string]$PluginDir,
        [string]$Version
    )

    Write-Info "Downloading Obsidian Python Bridge v${Version}..."

    # ── Step A: Download the release ZIP ──
    if ($script:ReleaseZipUrl) {
        Write-Info "Downloading release archive..."
        $zipPath = Join-Path $script:TmpDir "release.zip"
        Download-File -Url $script:ReleaseZipUrl -Destination $zipPath

        Write-Info "Extracting plugin files (main.js, manifest.json, styles.css)..."
        # Expand-Archive is PS 5.0+ (available on Win10+ built-in)
        Expand-Archive -Path $zipPath -DestinationPath $PluginDir -Force
        Write-Success "Release archive extracted."
    }
    else {
        # Fallback: download individual files
        Write-Warn "No release ZIP found. Downloading individual files..."

        if ($script:MainJsUrl) {
            Write-Info "  Downloading main.js..."
            Download-File -Url $script:MainJsUrl -Destination (Join-Path $PluginDir "main.js")
        }
        else {
            Write-Err "  main.js not found in release assets!"
            exit 1
        }

        if ($script:ManifestUrl) {
            Write-Info "  Downloading manifest.json..."
            Download-File -Url $script:ManifestUrl -Destination (Join-Path $PluginDir "manifest.json")
        }
    }

    # ── Step B: Download the Python client library (shim) ──
    $pyLibDest = Join-Path $PluginDir "ObsidianPluginDevPythonToJS.py"
    if (-not (Test-Path $pyLibDest)) {
        if ($script:PyLibUrl) {
            Write-Info "Downloading Python client library (ObsidianPluginDevPythonToJS.py)..."
            Download-File -Url $script:PyLibUrl -Destination $pyLibDest
            Write-Success "Python client library downloaded."
        }
        else {
            Write-Warn "ObsidianPluginDevPythonToJS.py not found as a release asset."
            Write-Warn "Will attempt to get it from source..."
        }
    }

    # ── Step C: Download the obsidian_python_bridge package from source ──
    $bridgePkgDir = Join-Path $PluginDir "obsidian_python_bridge"
    if (-not (Test-Path $bridgePkgDir)) {
        Write-Info "Downloading Python bridge package (obsidian_python_bridge/) from source..."
        $tarballPath = Join-Path $script:TmpDir "source.tar.gz"
        Download-File -Url $script:SourceTarballUrl -Destination $tarballPath

        Write-Info "Extracting Python bridge package..."
        $extractDir = Join-Path $script:TmpDir "source-extract"
        if (-not (Test-Path $extractDir)) {
            New-Item -ItemType Directory -Path $extractDir -Force | Out-Null
        }

        # Extract tarball — Windows 10+ includes tar.exe
        # This works on PS 5.1 because tar.exe is a system binary
        $tarExe = "tar"
        $tarFound = $false
        try {
            Get-Command $tarExe -ErrorAction Stop | Out-Null
            $tarFound = $true
        }
        catch {
            $tarFound = $false
        }

        if ($tarFound) {
            try {
                # Use tar.exe directly — must use Process for reliable error handling in PS 5.1
                $proc = Start-Process -FilePath $tarExe -ArgumentList "xzf","`"$tarballPath`"","-C","`"$extractDir`"" -NoNewWindow -Wait -PassThru -RedirectStandardError "$($script:TmpDir)\tar_err.tmp" -RedirectStandardOutput "$($script:TmpDir)\tar_out.tmp"
                if ($proc.ExitCode -ne 0) {
                    throw "tar exit code $($proc.ExitCode)"
                }
            }
            catch {
                # Fallback: use Python to extract
                Write-Info "tar extraction failed, using Python fallback..."
                $pythonExtractScript = "import tarfile`nwith tarfile.open(r'$tarballPath', 'r:gz') as t:`n    t.extractall(r'$extractDir')"
                $scriptPath = Join-Path $script:TmpDir "extract.py"
                $pythonExtractScript | Set-Content -Path $scriptPath -Encoding UTF8
                $pProc = Start-Process -FilePath $script:PythonCmd -ArgumentList "`"$scriptPath`"" -NoNewWindow -Wait -PassThru
                if ($pProc.ExitCode -ne 0) {
                    Write-Warn "Could not extract source tarball."
                }
            }
        }
        else {
            # No tar.exe — use Python to extract
            Write-Info "tar not found, using Python to extract source..."
            $pythonExtractScript = "import tarfile`nwith tarfile.open(r'$tarballPath', 'r:gz') as t:`n    t.extractall(r'$extractDir')"
            $scriptPath = Join-Path $script:TmpDir "extract.py"
            $pythonExtractScript | Set-Content -Path $scriptPath -Encoding UTF8
            $pProc = Start-Process -FilePath $script:PythonCmd -ArgumentList "`"$scriptPath`"" -NoNewWindow -Wait -PassThru
            if ($pProc.ExitCode -ne 0) {
                Write-Warn "Could not extract source tarball."
            }
        }

        # Find extracted directory (GitHub tarballs have a prefix like mathe00-obsidian-plugin-python-bridge-abc1234)
        $sourceRoot = Get-ChildItem -Path $extractDir -Directory -ErrorAction SilentlyContinue | Select-Object -First 1

        if ($sourceRoot) {
            $srcBridge = Join-Path $sourceRoot.FullName "obsidian_python_bridge"
            if (Test-Path $srcBridge) {
                Copy-Item -Path $srcBridge -Destination $PluginDir -Recurse -Force
                Write-Success "Python bridge package installed."
            }
            else {
                Write-Warn "obsidian_python_bridge/ package not found in source tarball."
                Write-Warn "The plugin may still work with the standalone library file."
            }

            # Also get ObsidianPluginDevPythonToJS.py from source if we didn't get it from release
            if (-not (Test-Path $pyLibDest)) {
                $srcPyLib = Join-Path $sourceRoot.FullName "ObsidianPluginDevPythonToJS.py"
                if (Test-Path $srcPyLib) {
                    Copy-Item -Path $srcPyLib -Destination $PluginDir -Force
                    Write-Success "Python client library copied from source."
                }
            }

            # Also get styles.css from source if missing
            $stylesDest = Join-Path $PluginDir "styles.css"
            if (-not (Test-Path $stylesDest)) {
                $srcStyles = Join-Path $sourceRoot.FullName "styles.css"
                if (Test-Path $srcStyles) {
                    Copy-Item -Path $srcStyles -Destination $PluginDir -Force
                    Write-Success "styles.css copied from source."
                }
            }
        }

        # Clean up extracted source
        Remove-Item -Path $extractDir -Recurse -Force -ErrorAction SilentlyContinue
    }

    # ── Verify essential files ──
    $missingFiles = @()
    foreach ($f in @("main.js", "manifest.json")) {
        if (-not (Test-Path (Join-Path $PluginDir $f))) {
            $missingFiles += $f
        }
    }

    if ($missingFiles.Count -gt 0) {
        Write-Err "Essential files missing after download:"
        foreach ($f in $missingFiles) {
            Write-Host "    - $f" -ForegroundColor Red
        }
        Write-Err "Installation may be incomplete. Try re-running or install manually."
    }
}

# ─── Install Python Dependencies ──────────────────────────────────────────────

function Install-PythonDeps {
    Write-Info "Checking Python dependencies..."

    # ── requests (required) ──
    $hasRequests = Test-PythonModule -ModuleName "requests"

    if ($hasRequests) {
        Write-Success "requests: already installed"
    }
    else {
        Write-Info "Installing requests library (required for plugin communication)..."
        $installed = Run-PythonPip -Package "requests"
        if ($installed) {
            Write-Success "requests: installed"
        }
        else {
            # Try with --user flag (no admin needed)
            $installed = Run-PythonPip -Package "requests" -ExtraArgs "--user"
            if ($installed) {
                Write-Success "requests: installed (user scope)"
            }
            else {
                Write-Warn "Could not install 'requests' automatically."
                Write-Warn "Please install it manually: pip install requests"
            }
        }
    }

    # ── PyYAML (optional) ──
    $hasYaml = Test-PythonModule -ModuleName "yaml"

    if ($hasYaml) {
        Write-Success "PyYAML: already installed"
    }
    else {
        Write-Info "Installing PyYAML (optional — for frontmatter property management)..."
        $installed = Run-PythonPip -Package "PyYAML"
        if ($installed) {
            Write-Success "PyYAML: installed"
        }
        else {
            $installed = Run-PythonPip -Package "PyYAML" -ExtraArgs "--user"
            if ($installed) {
                Write-Success "PyYAML: installed (user scope)"
            }
            else {
                Write-Warn "Could not install 'PyYAML' automatically."
                Write-Warn "You can install it later: pip install PyYAML"
            }
        }
    }
}

# ─── Success Message ──────────────────────────────────────────────────────────

function Print-Success {
    param(
        [string]$PluginDir,
        [string]$Version
    )

    Write-Host ""
    Write-Host "  ╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "  ║                                                               ║" -ForegroundColor Green
    Write-Host "  ║   " -ForegroundColor Green -NoNewline
    Write-Host "Installation Complete!" -ForegroundColor White -NoNewline
    Write-Host "                                    ║" -ForegroundColor Green
    Write-Host "  ║                                                               ║" -ForegroundColor Green
    Write-Host "  ╚═══════════════════════════════════════════════════════════════╝" -ForegroundColor Green
    Write-Host ""
    Write-Host "  Plugin version:     v$Version"
    Write-Host "  Installed to:       $PluginDir"
    Write-Host ""
    Write-Sep
    Write-Host ""
    Write-Host "  Next Steps:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  1.  " -NoNewline; Write-Host "Restart Obsidian" -NoNewline; Write-Host " (if it's currently running)"
    Write-Host "  2.  Go to  " -NoNewline; Write-Host "Settings -> Community plugins"
    Write-Host "      If Safe Mode is on, turn it off."
    Write-Host "  3.  Find  " -NoNewline; Write-Host "Python Bridge" -NoNewline; Write-Host "  in the installed plugins list"
    Write-Host "  4.  Click the  " -NoNewline; Write-Host "toggle" -NoNewline; Write-Host "  to enable it"
    Write-Host "  5.  Click the  " -NoNewline; Write-Host "gear icon" -NoNewline; Write-Host "  to configure:"
    Write-Host "      - Set the path to your Python scripts folder"
    Write-Host "      - Review security settings"
    Write-Host "      - Enable/disable individual scripts"
    Write-Host ""
    Write-Host "  For detailed documentation, see:" -ForegroundColor DarkGray
    Write-Host "  https://github.com/mathe00/obsidian-plugin-python-bridge" -ForegroundColor DarkGray
    Write-Host ""
    Write-Host "  " -NoNewline; Write-Host "Important:" -ForegroundColor Yellow -NoNewline; Write-Host " Only run Python scripts you trust!"
    Write-Host ""
    Write-Sep
    Write-Host ""
}

# ─── Main ─────────────────────────────────────────────────────────────────────

function Main {
    # Create temp directory
    $script:TmpDir = Join-Path $env:TEMP "obsidian-python-bridge-install-$(Get-Random)"
    New-Item -ItemType Directory -Path $script:TmpDir -Force | Out-Null

    try {
        Print-Banner

        # ─── Step 1: Detect OS ─────────────────────────────────────────
        Write-Step 1 "Detecting your system"
        # PS 5.1 compatible OS detection (no RuntimeInformation)
        $osName = [Environment]::OSVersion.VersionString
        Write-Info "Operating System: $osName"
        Write-Info "PowerShell: $($PSVersionTable.PSVersion)"

        # ─── Step 2: Check prerequisites ──────────────────────────────
        Write-Step 2 "Checking prerequisites"
        Check-Prerequisites

        # ─── Step 3: Get latest release ────────────────────────────────
        Write-Step 3 "Fetching latest release info"
        Get-LatestRelease

        # ─── Step 4: Prompt for vault path ─────────────────────────────
        Write-Step 4 "Select your Obsidian vault"
        Prompt-VaultPath

        # ─── Step 5: Prepare plugin directory ──────────────────────────
        Write-Step 5 "Preparing plugin directory"
        $pluginDir = Join-Path $script:SelectedVault ".obsidian\plugins\obsidian-python-bridge"

        if (Test-Path $pluginDir) {
            Write-Warn "Plugin directory already exists: $pluginDir"
            if (Test-Path (Join-Path $pluginDir "data.json")) {
                Write-Info "Your existing settings (data.json) will be preserved."
            }
            $overwrite = Write-Ask "Overwrite plugin files with latest version? (Y/n):"
            if ($overwrite -match '^[Nn]$') {
                Write-Info "Installation cancelled by user."
                exit 0
            }
        }

        if (-not (Test-Path $pluginDir)) {
            New-Item -ItemType Directory -Path $pluginDir -Force | Out-Null
        }
        Write-Success "Plugin directory ready: $pluginDir"

        # ─── Step 6: Confirmation ──────────────────────────────────────
        Write-Step 6 "Confirm installation"
        Write-Host ""
        Write-Host "  Installation summary:" -ForegroundColor White
        Write-Host "    Plugin:         Obsidian Python Bridge v$($script:ReleaseTag)"
        Write-Host "    Install to:     $pluginDir"
        Write-Host "    Python:         $($script:PythonVersion)"
        Write-Host ""

        $confirm = Write-Ask "Proceed with installation? (Y/n):"
        if ($confirm -match '^[Nn]$') {
            Write-Info "Installation cancelled by user."
            exit 0
        }

        # ─── Step 7: Download and install ──────────────────────────────
        Write-Step 7 "Downloading and installing plugin files"
        Install-PluginFiles -PluginDir $pluginDir -Version $script:ReleaseTag

        # ─── Step 8: Install Python dependencies ───────────────────────
        Write-Step 8 "Installing Python dependencies"
        Install-PythonDeps

        # ─── Step 9: Success! ──────────────────────────────────────────
        Print-Success -PluginDir $pluginDir -Version $script:ReleaseTag
    }
    finally {
        # Clean up temp directory
        if ($script:TmpDir -and (Test-Path $script:TmpDir)) {
            Remove-Item -Path $script:TmpDir -Recurse -Force -ErrorAction SilentlyContinue
        }
    }
}

# Run main function
Main
