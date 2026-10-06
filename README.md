# Obsidian + VS Code + Claude installer

One click installs the latest version of:

- **Obsidian**
- **Visual Studio Code**
- **Claude** (desktop app)
- **Claude Code** (the VS Code extension)

Already have one of them? It gets updated to the newest version instead.

## Windows

[![Download the installer](https://img.shields.io/badge/Download_the_installer-Windows-2ea44f?style=for-the-badge&logo=windows)](https://github.com/nadavglassberg/claude-workspace-installer/releases/latest/download/install.bat)

1. Click the green button. A file called `install.bat` downloads.
2. Double-click it.
3. If Windows shows "Windows protected your PC", click **More info**, then **Run anyway**.
4. Wait until the window says **Done**. It takes a few minutes.

Prefer the terminal? Paste this into PowerShell instead:

```powershell
irm https://raw.githubusercontent.com/nadavglassberg/claude-workspace-installer/main/install.ps1 | iex
```

## Mac

Needs [Homebrew](https://brew.sh). Paste this into Terminal:

```bash
brew install --cask obsidian visual-studio-code claude && code --install-extension anthropic.claude-code
```

## What it does

It runs [install.ps1](install.ps1), which asks `winget` (the app installer built into Windows 10 and 11) for the newest release of each app, straight from the official publishers. Nothing else is installed and nothing is sent anywhere.
