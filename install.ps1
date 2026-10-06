# Installs the latest Obsidian, Visual Studio Code and Claude, plus the Claude Code
# extension for VS Code. Windows 10/11, uses winget.
#
# Each app is checked first: missing -> installed, already there -> updated only if a
# newer version exists, already current -> left alone.
#
# Then it creates the workspace folder (%USERPROFILE%\claude-workspace, or $env:WORKSPACE_DIR),
# downloads the /setup-vault skill into it and opens it in VS Code.
#
# Run it by double-clicking install.bat, or paste this into PowerShell:
#   irm https://raw.githubusercontent.com/nadavglassberg/claude-workspace-installer/main/install.ps1 | iex
#
# Set $env:WORKSPACE_INSTALLER_DRYRUN = '1' first to run the checks without installing anything.

function Install-Workspace {
    $dryRun = $env:WORKSPACE_INSTALLER_DRYRUN -eq '1'

    $apps = @(
        @{ Name = 'Obsidian';           Id = 'Obsidian.Obsidian' },
        @{ Name = 'Visual Studio Code'; Id = 'Microsoft.VisualStudioCode' },
        @{ Name = 'Claude';             Id = 'Anthropic.Claude' }
    )
    $extension = 'anthropic.claude-code'

    # winget exit code for "no newer version available"
    $noUpdate = -1978335189

    if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
        Write-Host 'winget is missing on this computer.' -ForegroundColor Red
        Write-Host 'Install "App Installer" from the Microsoft Store (opening it now), then run this again.'
        Start-Process 'ms-windows-store://pdp/?productid=9NBLGGH4NNS1'
        return
    }

    $results = @()

    foreach ($app in $apps) {
        Write-Host ''
        Write-Host "== $($app.Name) ==" -ForegroundColor Cyan

        winget list --id $app.Id --exact --accept-source-agreements --disable-interactivity | Out-Null
        $installed = $LASTEXITCODE -eq 0

        if ($installed) {
            Write-Host 'Already installed. Checking for a newer version...'
            $action = 'upgrade'
        } else {
            Write-Host 'Not installed. Downloading the latest version...'
            $action = 'install'
        }

        if ($dryRun) {
            Write-Host "[dry run] winget $action --id $($app.Id)"
            $before = if ($installed) { 'already installed' } else { 'not installed' }
            $results += [pscustomobject]@{ App = $app.Name; Result = "$before, dry run" }
            continue
        }

        winget $action --id $app.Id --exact --source winget --silent `
            --accept-package-agreements --accept-source-agreements --disable-interactivity
        $code = $LASTEXITCODE

        if ($code -eq $noUpdate) {
            $status = 'already installed, up to date'
        } elseif ($code -ne 0) {
            $status = "FAILED (winget exit code $code)"
        } elseif ($installed) {
            $status = 'already installed, updated to latest'
        } else {
            $status = 'installed'
        }
        $results += [pscustomobject]@{ App = $app.Name; Result = $status }
    }

    Write-Host ''
    Write-Host '== Claude Code extension for VS Code ==' -ForegroundColor Cyan

    # A fresh VS Code install is not on PATH yet in this window, so look in the install folders too.
    $codeCmd = @(
        (Get-Command code.cmd -ErrorAction SilentlyContinue).Source,
        "$env:LOCALAPPDATA\Programs\Microsoft VS Code\bin\code.cmd",
        "$env:ProgramFiles\Microsoft VS Code\bin\code.cmd"
    ) | Where-Object { $_ -and (Test-Path $_) } | Select-Object -First 1

    if (-not $codeCmd) {
        $status = if ($dryRun) { 'VS Code not found, dry run' } else { 'SKIPPED (VS Code not found). Open VS Code, Extensions, search "Claude Code"' }
    } else {
        $hasExtension = (& $codeCmd --list-extensions) -contains $extension
        if ($hasExtension) {
            Write-Host 'Already installed. Checking for a newer version...'
        } else {
            Write-Host 'Not installed. Downloading the latest version...'
        }

        if ($dryRun) {
            Write-Host "[dry run] code --install-extension $extension"
            $before = if ($hasExtension) { 'already installed' } else { 'not installed' }
            $status = "$before, dry run"
        } else {
            # --force makes VS Code update the extension when it is already there
            & $codeCmd --install-extension $extension --force
            if ($LASTEXITCODE -ne 0) {
                $status = "FAILED (exit code $LASTEXITCODE)"
            } elseif ($hasExtension) {
                $status = 'already installed, checked for update'
            } else {
                $status = 'installed'
            }
        }
    }
    $results += [pscustomobject]@{ App = 'Claude Code extension'; Result = $status }

    Write-Host ''
    Write-Host '== Summary ==' -ForegroundColor Green
    $results | Format-Table -AutoSize | Out-String | Write-Host

    if ($results.Result -match 'FAILED') {
        Write-Host 'Something failed. Run it again, and if it fails twice send a screenshot of this window.' -ForegroundColor Yellow
    }

    if (-not $dryRun) { Install-Starter -CodeCmd $codeCmd }
}

# Creates the workspace folder, downloads the starter files into it and opens it in VS Code.
# Existing files are left alone, so running the installer twice never overwrites someone's work.
function Install-Starter {
    param([string]$CodeCmd)

    $repoRaw = 'https://raw.githubusercontent.com/nadavglassberg/claude-workspace-installer/main/starter'
    $files = @(
        '.claude/settings.json',   # Opus 5.5 at high effort for this workspace
        '.claude/skills/setup-vault/SKILL.md'
    )
    $dir = if ($env:WORKSPACE_DIR) { $env:WORKSPACE_DIR } else { Join-Path $env:USERPROFILE 'claude-workspace' }

    Write-Host ''
    Write-Host '== Workspace folder ==' -ForegroundColor Cyan

    foreach ($file in $files) {
        $target = Join-Path $dir $file
        if (Test-Path $target) {
            Write-Host "Already there, kept: $target"
            continue
        }
        New-Item -ItemType Directory -Force -Path (Split-Path $target) | Out-Null
        Invoke-WebRequest -Uri "$repoRaw/$file" -OutFile $target -UseBasicParsing
        Write-Host "Downloaded: $target"
    }

    Write-Host ''
    Write-Host "Done. Your workspace is $dir" -ForegroundColor Green
    Write-Host 'Next: in VS Code, open Claude Code and type  /setup-vault'

    if ($CodeCmd) { & $CodeCmd $dir }
}

Install-Workspace
