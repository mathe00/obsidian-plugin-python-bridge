@echo off
REM ══════════════════════════════════════════════════════════════════════════════
REM 🐍 Obsidian Python Bridge — Windows CMD/PowerShell Launcher
REM https://github.com/mathe00/obsidian-plugin-python-bridge
REM
REM This batch file:
REM   1. Downloads the install.ps1 PowerShell script from GitHub
REM   2. Runs it with PowerShell 5.1+ (built-in on all modern Windows)
REM   3. Cleans up after itself
REM
REM Usage (from CMD or double-click):
REM   install.bat
REM
REM One-liner from CMD:
REM   curl -fsSL https://raw.githubusercontent.com/mathe00/obsidian-plugin-python-bridge/main/install.bat | cmd
REM
REM Or from PowerShell:
REM   irm https://raw.githubusercontent.com/mathe00/obsidian-plugin-python-bridge/main/install.ps1 | iex
REM
REM License: MIT
REM ══════════════════════════════════════════════════════════════════════════════

setlocal enabledelayedexpansion

set "SCRIPT_URL=https://raw.githubusercontent.com/mathe00/obsidian-plugin-python-bridge/main/install.ps1"
set "TEMP_PS1=%TEMP%\obsidian-python-bridge-install-%RANDOM%.ps1"

echo.
echo   ---------------------------------------------------------------
echo    Obsidian Python Bridge - Windows Installer Launcher
echo    https://github.com/mathe00/obsidian-plugin-python-bridge
echo   ---------------------------------------------------------------
echo.

REM ── Check if PowerShell is available ───────────────────────────────────────
where powershell >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo   [ERROR] PowerShell is not available on this system.
    echo   This installer requires PowerShell 5.1+ which is built-in on
    echo   Windows 7 SP1+ and all newer versions.
    echo.
    echo   Please install PowerShell or use the manual installation method
    echo   described at: https://github.com/mathe00/obsidian-plugin-python-bridge
    echo.
    goto :fail
)

echo   [INFO] PowerShell found. Downloading installer script...
echo.

REM ── Download install.ps1 using PowerShell ──────────────────────────────────
REM We use a tiny PowerShell snippet to download the full installer script.
REM This works even without curl (Windows 7/8 don't have curl built-in).

powershell -NoProfile -NonInteractive -ExecutionPolicy Bypass -Command ^
    "try { Invoke-WebRequest -Uri '%SCRIPT_URL%' -OutFile '%TEMP_PS1%' -UseBasicParsing -TimeoutSec 30; exit 0 } catch { Write-Host '  [ERROR] Failed to download installer:' $_.Exception.Message; exit 1 }"

if %ERRORLEVEL% neq 0 (
    echo.
    echo   [ERROR] Could not download the installer script.
    echo   Please check your internet connection and try again.
    echo.
    echo   You can also download manually from:
    echo   %SCRIPT_URL%
    echo.
    echo   Then run: powershell -ExecutionPolicy Bypass -File install.ps1
    echo.
    goto :fail
)

echo   [OK] Installer downloaded. Launching interactive setup...
echo.

REM ── Run the PowerShell installer interactively ─────────────────────────────
REM -NoProfile: faster startup, no profile side-effects
REM -ExecutionPolicy Bypass: allow the downloaded script to run
REM We keep the window interactive so the user can answer prompts

powershell -NoProfile -ExecutionPolicy Bypass -File "%TEMP_PS1%"

set "INSTALL_RESULT=%ERRORLEVEL%"

REM ── Clean up downloaded script ─────────────────────────────────────────────
if exist "%TEMP_PS1%" del /f /q "%TEMP_PS1%" >nul 2>&1

if %INSTALL_RESULT% equ 0 (
    goto :end
) else (
    goto :fail
)

:fail
echo.
echo   Installation did not complete successfully.
echo   For help, visit: https://github.com/mathe00/obsidian-plugin-python-bridge/issues
echo.
pause
exit /b 1

:end
exit /b 0
