#!/usr/bin/env bash
# ══════════════════════════════════════════════════════════════════════════════
# 🐍 Obsidian Python Bridge — Interactive Installer
# https://github.com/mathe00/obsidian-plugin-python-bridge
#
# One-liner install (Linux / macOS):
#   curl -fsSL https://raw.githubusercontent.com/mathe00/obsidian-plugin-python-bridge/main/install.sh | bash
#
# Or: wget -qO- https://raw.githubusercontent.com/.../install.sh | bash
#
# License: MIT — Same as the project itself.
# ══════════════════════════════════════════════════════════════════════════════

set -euo pipefail

# ─── Color Definitions ────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
BOLD='\033[1m'
DIM='\033[2m'
UNDERLINE='\033[4m'
RESET='\033[0m'

# ─── Helper Functions ──────────────────────────────────────────────────────────

info()    { echo -e "${CYAN}  ℹ${RESET}  $*"; }
success() { echo -e "${GREEN}  ✔${RESET}  $*"; }
warn()    { echo -e "${YELLOW}  ⚠${RESET}  $*"; }
error()   { echo -e "${RED}  ✘${RESET}  $*"; }
step()    { echo -e "\n${BOLD}${BLUE}  ▸ Step $1:${RESET} ${BOLD}$2${RESET}"; }
ask()     { echo -ne "${MAGENTA}  ❯${RESET} $* "; }

# Print a separator line
sep() {
    echo -e "${DIM}  ─────────────────────────────────────────────────────────${RESET}"
}

# Check if a command exists
has_cmd() {
    command -v "$1" &>/dev/null
}

# Download a file — tries curl then wget
download() {
    local url="$1" dest="$2"
    if has_cmd curl; then
        curl -fsSL "$url" -o "$dest"
    elif has_cmd wget; then
        wget -qO "$dest" "$url"
    else
        error "Neither curl nor wget found. Please install one and retry."
        exit 1
    fi
}

# ─── Banner ───────────────────────────────────────────────────────────────────

print_banner() {
    echo ""
    echo -e "${BOLD}${CYAN}  ╔═══════════════════════════════════════════════════════════════╗${RESET}"
    echo -e "${BOLD}${CYAN}  ║${RESET}                                                               ${BOLD}${CYAN}║${RESET}"
    echo -e "${BOLD}${CYAN}  ║${RESET}   ${BOLD}${GREEN}🐍 Obsidian Python Bridge${RESET}  —  Interactive Installer       ${BOLD}${CYAN}║${RESET}"
    echo -e "${BOLD}${CYAN}  ║${RESET}                                                               ${BOLD}${CYAN}║${RESET}"
    echo -e "${BOLD}${CYAN}  ║${RESET}   ${DIM}Write Obsidian plugins in Python!${RESET}                          ${BOLD}${CYAN}║${RESET}"
    echo -e "${BOLD}${CYAN}  ║${RESET}   ${DIM}https://github.com/mathe00/obsidian-plugin-python-bridge${RESET}    ${BOLD}${CYAN}║${RESET}"
    echo -e "${BOLD}${CYAN}  ║${RESET}                                                               ${BOLD}${CYAN}║${RESET}"
    echo -e "${BOLD}${CYAN}  ╚═══════════════════════════════════════════════════════════════╝${RESET}"
    echo ""
}

# ─── Detect OS ────────────────────────────────────────────────────────────────

detect_os() {
    local uname_out
    uname_out="$(uname -s)"
    case "$uname_out" in
        Linux*)
            # Check for WSL
            if grep -qi microsoft /proc/version 2>/dev/null; then
                echo "wsl"
            else
                echo "linux"
            fi
            ;;
        Darwin*)  echo "macos" ;;
        MINGW*|MSYS*|CYGWIN*) echo "windows-git-bash" ;;
        *)        echo "unknown: $uname_out" ;;
    esac
}

# ─── Find Obsidian Vaults ─────────────────────────────────────────────────────

find_vaults() {
    local candidates=()
    local search_dirs=()

    # Build list of directories to search
    # Home directory (depth 1 — common for single-vault setups)
    search_dirs+=("$HOME")
    # Standard locations
    for d in "$HOME/Obsidian" "$HOME/Documents/Obsidian" "$HOME/Documents" "$HOME/Desktop"; do
        [[ -d "$d" ]] && search_dirs+=("$d")
    done

    # On macOS, also check iCloud Drive path
    if [[ "$(detect_os)" == "macos" ]]; then
        local icloud="$HOME/Library/Mobile Documents/iCloud~md~obsidian/Documents"
        [[ -d "$icloud" ]] && search_dirs+=("$icloud")
    fi

    # Search for .obsidian directories (max depth 3, limit to 10 results)
    for search_dir in "${search_dirs[@]}"; do
        while IFS= read -r -d '' obs_dir; do
            local vault_path
            vault_path="$(dirname "$obs_dir")"
            # Skip the .obsidian plugins dir itself and the plugin's own .obsidian
            if [[ "$vault_path" == *"/.obsidian/plugins"* ]]; then
                continue
            fi
            # Deduplicate
            if [[ " ${candidates[*]} " != *" $vault_path "* ]]; then
                candidates+=("$vault_path")
            fi
            # Safety: stop at 10
            (( ${#candidates[@]} >= 10 )) && break 2
        done < <(find "$search_dir" -maxdepth 3 -name ".obsidian" -type d -print0 2>/dev/null)
    done

    printf '%s\n' "${candidates[@]}"
}

# ─── Prompt for Vault Path ────────────────────────────────────────────────────

prompt_vault_path() {
    local vaults
    vaults="$(find_vaults)"

    if [[ -n "$vaults" ]]; then
        echo -e "\n  ${BOLD}Obsidian vault(s) detected on your system:${RESET}\n"
        local i=1
        local vault_array=()
        while IFS= read -r v; do
            echo -e "  ${BOLD}${CYAN}  [$i]${RESET}  $v"
            vault_array+=("$v")
            ((i++))
        done <<< "$vaults"
        echo -e "  ${BOLD}${CYAN}  [0]${RESET}  Enter path manually"
        echo ""
        ask "Choose a vault (0-${#vault_array[@]}):"
        read -r choice

        # Validate choice
        if [[ "$choice" =~ ^[0-9]+$ ]] && (( choice >= 1 && choice <= ${#vault_array[@]} )); then
            SELECTED_VAULT="${vault_array[$((choice-1))]}"
        elif [[ "$choice" == "0" ]]; then
            ask "Enter the full path to your Obsidian vault:"
            read -r SELECTED_VAULT
        else
            error "Invalid choice."
            exit 1
        fi
    else
        echo -e "\n  ${DIM}No Obsidian vaults auto-detected.${RESET}"
        ask "Enter the full path to your Obsidian vault:"
        read -r SELECTED_VAULT
    fi

    # Validate the path
    if [[ ! -d "$SELECTED_VAULT" ]]; then
        error "Directory does not exist: $SELECTED_VAULT"
        ask "Create it? (y/N):"
        read -r create_choice
        if [[ "$create_choice" =~ ^[Yy]$ ]]; then
            mkdir -p "$SELECTED_VAULT"
            success "Created directory: $SELECTED_VAULT"
        else
            error "Cannot continue without a valid vault directory."
            exit 1
        fi
    fi

    # Verify it looks like an Obsidian vault (has or can have .obsidian dir)
    if [[ ! -d "$SELECTED_VAULT/.obsidian" ]]; then
        warn "No .obsidian directory found at $SELECTED_VAULT"
        warn "This may not be a valid Obsidian vault."
        ask "Continue anyway? (y/N):"
        read -r cont_choice
        if [[ ! "$cont_choice" =~ ^[Yy]$ ]]; then
            exit 0
        fi
    fi

    # Expand to absolute path
    SELECTED_VAULT="$(cd "$SELECTED_VAULT" && pwd)"
    success "Vault path: ${BOLD}$SELECTED_VAULT${RESET}"
}

# ─── Check Prerequisites ──────────────────────────────────────────────────────

check_prerequisites() {
    local missing=()

    # curl or wget
    if ! has_cmd curl && ! has_cmd wget; then
        missing+=("curl (or wget)")
    fi

    # unzip (for release zip) or tar (for source tarball)
    if ! has_cmd unzip; then
        # tar is usually always available on Unix, but check
        if ! has_cmd tar; then
            missing+=("unzip (or tar)")
        fi
    fi

    # Python 3
    local python_cmd=""
    if has_cmd python3; then
        python_cmd="python3"
    elif has_cmd python; then
        # Check if it's Python 3
        if python --version 2>&1 | grep -q "Python 3"; then
            python_cmd="python"
        fi
    fi

    if [[ -z "$python_cmd" ]]; then
        missing+=("Python 3")
    fi

    if [[ ${#missing[@]} -gt 0 ]]; then
        error "Missing prerequisites:"
        for m in "${missing[@]}"; do
            echo -e "    ${RED}• $m${RESET}"
        done
        echo ""
        info "Install them with your package manager, e.g.:"
        echo -e "    ${DIM}sudo apt install curl unzip python3   (Debian/Ubuntu)${RESET}"
        echo -e "    ${DIM}brew install curl unzip python3       (macOS/Homebrew)${RESET}"
        echo -e "    ${DIM}sudo dnf install curl unzip python3   (Fedora/RHEL)${RESET}"
        exit 1
    fi

    # Store the python command for later use
    PYTHON_CMD="$python_cmd"

    success "curl/wwget: found"
    success "unzip/tar: found"
    success "Python: $("$PYTHON_CMD" --version 2>&1 | head -1)"
}

# ─── Get Latest Release Info ──────────────────────────────────────────────────

get_latest_release() {
    info "Fetching latest release info from GitHub..."

    local release_json
    release_json="$(download "https://api.github.com/repos/mathe00/obsidian-plugin-python-bridge/releases/latest" "$TMPDIR/release.json" 2>/dev/null && cat "$TMPDIR/release.json")"

    if [[ -z "$release_json" ]]; then
        error "Failed to fetch release info from GitHub."
        error "Check your internet connection and try again."
        exit 1
    fi

    # Extract tag name (version)
    RELEASE_TAG="$(echo "$release_json" | grep -o '"tag_name":"[^"]*"' | head -1 | sed 's/"tag_name":"//;s/"//')"

    if [[ -z "$RELEASE_TAG" ]]; then
        error "Could not determine latest release version."
        exit 1
    fi

    # Extract the release ZIP URL (the .zip asset, not the source zipball)
    RELEASE_ZIP_URL="$(echo "$release_json" | grep -o '"browser_download_url":"[^"]*obsidian-python-bridge[^"]*\.zip"' | head -1 | sed 's/"browser_download_url":"//;s/"//')"

    # Extract individual asset URLs as fallbacks
    MAIN_JS_URL="$(echo "$release_json" | grep -o '"browser_download_url":"[^"]*main\.js"' | head -1 | sed 's/"browser_download_url":"//;s/"//')"
    MANIFEST_URL="$(echo "$release_json" | grep -o '"browser_download_url":"[^"]*manifest\.json"' | head -1 | sed 's/"browser_download_url":"//;s/"//')"
    PYLIB_URL="$(echo "$release_json" | grep -o '"browser_download_url":"[^"]*ObsidianPluginDevPythonToJS\.py"' | head -1 | sed 's/"browser_download_url":"//;s/"//')"

    # Source tarball URL (for Python library files that may not be in the release)
    SOURCE_TARBALL_URL="https://api.github.com/repos/mathe00/obsidian-plugin-python-bridge/tarball/main"

    success "Latest release: ${BOLD}v${RELEASE_TAG}${RESET}"
}

# ─── Download & Install Plugin Files ──────────────────────────────────────────

install_plugin_files() {
    local plugin_dir="$1"
    local version="$2"

    info "Downloading Obsidian Python Bridge v${version}..."

    # ── Step A: Download the release ZIP ──
    if [[ -n "$RELEASE_ZIP_URL" ]]; then
        info "Downloading release archive..."
        download "$RELEASE_ZIP_URL" "$TMPDIR/release.zip"

        info "Extracting plugin files (main.js, manifest.json, styles.css)..."
        if has_cmd unzip; then
            unzip -qo "$TMPDIR/release.zip" -d "$plugin_dir"
        else
            # Python fallback for extraction
            "$PYTHON_CMD" -c "
import zipfile, sys
with zipfile.ZipFile('$TMPDIR/release.zip', 'r') as z:
    z.extractall('$plugin_dir')
"
        fi
        success "Release archive extracted."
    else
        # Fallback: download individual files
        warn "No release ZIP found. Downloading individual files..."

        if [[ -n "$MAIN_JS_URL" ]]; then
            info "  Downloading main.js..."
            download "$MAIN_JS_URL" "$plugin_dir/main.js"
        else
            error "  main.js not found in release assets!"
            exit 1
        fi

        if [[ -n "$MANIFEST_URL" ]]; then
            info "  Downloading manifest.json..."
            download "$MANIFEST_URL" "$plugin_dir/manifest.json"
        fi
    fi

    # ── Step B: Download the Python client library (shim) ──
    if [[ ! -f "$plugin_dir/ObsidianPluginDevPythonToJS.py" ]]; then
        if [[ -n "$PYLIB_URL" ]]; then
            info "Downloading Python client library (ObsidianPluginDevPythonToJS.py)..."
            download "$PYLIB_URL" "$plugin_dir/ObsidianPluginDevPythonToJS.py"
            success "Python client library downloaded."
        else
            warn "ObsidianPluginDevPythonToJS.py not found as a release asset."
            warn "Will attempt to get it from source..."
        fi
    fi

    # ── Step C: Download the obsidian_python_bridge package from source ──
    if [[ ! -d "$plugin_dir/obsidian_python_bridge" ]]; then
        info "Downloading Python bridge package (obsidian_python_bridge/) from source..."
        download "$SOURCE_TARBALL_URL" "$TMPDIR/source.tar.gz"

        info "Extracting Python bridge package..."
        mkdir -p "$TMPDIR/source-extract"

        if has_cmd tar; then
            tar xzf "$TMPDIR/source.tar.gz" -C "$TMPDIR/source-extract"
        else
            # Python fallback for tar extraction
            "$PYTHON_CMD" -c "
import tarfile
with tarfile.open('$TMPDIR/source.tar.gz', 'r:gz') as t:
    t.extractall('$TMPDIR/source-extract')
"
        fi

        # Find the extracted directory (GitHub tarballs have a prefix like mathe00-obsidian-plugin-python-bridge-abc1234)
        local source_root
        source_root="$(find "$TMPDIR/source-extract" -maxdepth 1 -type d | tail -1)"

        if [[ -d "$source_root/obsidian_python_bridge" ]]; then
            cp -r "$source_root/obsidian_python_bridge" "$plugin_dir/"
            success "Python bridge package installed."
        else
            warn "obsidian_python_bridge/ package not found in source tarball."
            warn "The plugin may still work with the standalone library file."
        fi

        # Also get ObsidianPluginDevPythonToJS.py from source if we didn't get it from release
        if [[ ! -f "$plugin_dir/ObsidianPluginDevPythonToJS.py" ]] && [[ -f "$source_root/ObsidianPluginDevPythonToJS.py" ]]; then
            cp "$source_root/ObsidianPluginDevPythonToJS.py" "$plugin_dir/"
            success "Python client library copied from source."
        fi

        # Also get styles.css from source if it's missing from the release zip
        if [[ ! -f "$plugin_dir/styles.css" ]] && [[ -f "$source_root/styles.css" ]]; then
            cp "$source_root/styles.css" "$plugin_dir/"
            success "styles.css copied from source."
        fi

        # Clean up extracted source
        rm -rf "$TMPDIR/source-extract"
    fi

    # ── Verify essential files ──
    local missing_files=()
    for f in main.js manifest.json; do
        if [[ ! -f "$plugin_dir/$f" ]]; then
            missing_files+=("$f")
        fi
    done

    if [[ ${#missing_files[@]} -gt 0 ]]; then
        error "Essential files missing after download:"
        for f in "${missing_files[@]}"; do
            echo -e "    ${RED}• $f${RESET}"
        done
        error "Installation may be incomplete. Try re-running or install manually."
    fi
}

# ─── Install Python Dependencies ──────────────────────────────────────────────

install_python_deps() {
    info "Checking Python dependencies..."

    # Check for requests
    if "$PYTHON_CMD" -c "import requests" 2>/dev/null; then
        success "requests: already installed"
    else
        info "Installing requests library (required for plugin communication)..."
        if "$PYTHON_CMD" -m pip install requests 2>/dev/null; then
            success "requests: installed"
        elif has_cmd pip3 && pip3 install requests 2>/dev/null; then
            success "requests: installed via pip3"
        elif has_cmd pip && pip install requests 2>/dev/null; then
            success "requests: installed via pip"
        else
            warn "Could not install 'requests' automatically."
            warn "Please install it manually: ${BOLD}pip install requests${RESET}"
        fi
    fi

    # Check for PyYAML (optional but recommended)
    if "$PYTHON_CMD" -c "import yaml" 2>/dev/null; then
        success "PyYAML: already installed"
    else
        info "Installing PyYAML (optional — for frontmatter property management)..."
        if "$PYTHON_CMD" -m pip install PyYAML 2>/dev/null; then
            success "PyYAML: installed"
        elif has_cmd pip3 && pip3 install PyYAML 2>/dev/null; then
            success "PyYAML: installed via pip3"
        else
            warn "Could not install 'PyYAML' automatically."
            warn "You can install it later: ${BOLD}pip install PyYAML${RESET}"
        fi
    fi
}

# ─── Success Message ──────────────────────────────────────────────────────────

print_success() {
    local plugin_dir="$1"
    local version="$2"

    echo ""
    echo -e "${GREEN}${BOLD}  ╔═══════════════════════════════════════════════════════════════╗${RESET}"
    echo -e "${GREEN}${BOLD}  ║${RESET}                                                               ${GREEN}${BOLD}║${RESET}"
    echo -e "${GREEN}${BOLD}  ║${RESET}   ${BOLD}🎉 Installation Complete!${RESET}                                    ${GREEN}${BOLD}║${RESET}"
    echo -e "${GREEN}${BOLD}  ║${RESET}                                                               ${GREEN}${BOLD}║${RESET}"
    echo -e "${GREEN}${BOLD}  ╚═══════════════════════════════════════════════════════════════╝${RESET}"
    echo ""
    echo -e "  ${BOLD}Plugin version:${RESET}     v${version}"
    echo -e "  ${BOLD}Installed to:${RESET}       ${UNDERLINE}${plugin_dir}${RESET}"
    echo ""
    sep
    echo -e "\n  ${BOLD}${CYAN}Next Steps:${RESET}\n"
    echo -e "  ${BOLD}1.${RESET}  ${BOLD}Restart Obsidian${RESET} (if it's currently running)"
    echo -e "  ${BOLD}2.${RESET}  Go to  ${BOLD}Settings → Community plugins${RESET}"
    echo -e "      If Safe Mode is on, turn it off."
    echo -e "  ${BOLD}3.${RESET}  Find  ${BOLD}\"Python Bridge\"${RESET}  in the installed plugins list"
    echo -e "  ${BOLD}4.${RESET}  Click the  ${BOLD}toggle${RESET}  to enable it"
    echo -e "  ${BOLD}5.${RESET}  Click the  ${BOLD}gear icon ⚙️${RESET}  to configure:"
    echo -e "      • Set the path to your Python scripts folder"
    echo -e "      • Review security settings"
    echo -e "      • Enable/disable individual scripts"
    echo ""
    echo -e "  ${DIM}For detailed documentation, see:${RESET}"
    echo -e "  ${DIM}https://github.com/mathe00/obsidian-plugin-python-bridge${RESET}"
    echo ""
    echo -e "  ${YELLOW}⚠${RESET}  ${BOLD}Important:${RESET} Only run Python scripts you trust!"
    echo ""
    sep
    echo ""
}

# ─── Main ─────────────────────────────────────────────────────────────────────

main() {
    # Create temp directory for downloads (auto-cleaned on exit)
    TMPDIR="$(mktemp -d "${TMPDIR:-/tmp}/obsidian-python-bridge-install.XXXXXX")"
    # shellcheck disable=SC2064
    trap "rm -rf \"$TMPDIR\"" EXIT

    print_banner

    # ─── Step 1: Detect OS ─────────────────────────────────────────
    step "1" "Detecting your system"
    local os
    os="$(detect_os)"
    case "$os" in
        linux)  info "Operating System: ${BOLD}Linux${RESET}" ;;
        macos)  info "Operating System: ${BOLD}macOS${RESET}" ;;
        wsl)    info "Operating System: ${BOLD}Linux (WSL)${RESET}" ;;
        *)      warn "Operating System: ${BOLD}$os${RESET} (not officially tested)" ;;
    esac

    # ─── Step 2: Check prerequisites ──────────────────────────────
    step "2" "Checking prerequisites"
    check_prerequisites

    # ─── Step 3: Get latest release ────────────────────────────────
    step "3" "Fetching latest release info"
    get_latest_release

    # ─── Step 4: Prompt for vault path ─────────────────────────────
    step "4" "Select your Obsidian vault"
    local SELECTED_VAULT=""
    prompt_vault_path

    # ─── Step 5: Prepare plugin directory ──────────────────────────
    step "5" "Preparing plugin directory"
    local plugin_dir="$SELECTED_VAULT/.obsidian/plugins/obsidian-python-bridge"

    if [[ -d "$plugin_dir" ]]; then
        warn "Plugin directory already exists: $plugin_dir"
        if [[ -f "$plugin_dir/data.json" ]]; then
            info "Your existing settings (data.json) will be ${BOLD}preserved${RESET}."
        fi
        ask "Overwrite plugin files with latest version? (Y/n):"
        read -r overwrite_choice
        if [[ "$overwrite_choice" =~ ^[Nn]$ ]]; then
            info "Installation cancelled by user."
            exit 0
        fi
    fi

    mkdir -p "$plugin_dir"
    success "Plugin directory ready: $plugin_dir"

    # ─── Step 6: Confirmation ──────────────────────────────────────
    step "6" "Confirm installation"
    echo ""
    echo -e "  ${BOLD}Installation summary:${RESET}"
    echo -e "    Plugin:         Obsidian Python Bridge v${RELEASE_TAG}"
    echo -e "    Install to:     ${UNDERLINE}${plugin_dir}${RESET}"
    echo -e "    Python:         $("$PYTHON_CMD" --version 2>&1 | head -1)"
    echo ""
    ask "Proceed with installation? (Y/n):"
    read -r confirm
    if [[ "$confirm" =~ ^[Nn]$ ]]; then
        info "Installation cancelled by user."
        exit 0
    fi

    # ─── Step 7: Download and install ──────────────────────────────
    step "7" "Downloading and installing plugin files"
    install_plugin_files "$plugin_dir" "$RELEASE_TAG"

    # ─── Step 8: Install Python dependencies ───────────────────────
    step "8" "Installing Python dependencies"
    install_python_deps

    # ─── Step 9: Success! ──────────────────────────────────────────
    print_success "$plugin_dir" "$RELEASE_TAG"
}

# Run main function
main "$@"
