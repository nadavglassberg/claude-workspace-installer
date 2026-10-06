# Installs the latest Obsidian, Visual Studio Code and Claude, plus the Claude Code
# extension for VS Code. Windows 10/11, uses winget.
#
# Each app is checked first: missing -> installed, already there -> updated only if a
# newer version exists, already current -> left alone.
#
# Then it creates the workspace folder (%USERPROFILE%\claude-workspace, or $env:WORKSPACE_DIR),
# puts an empty vault folder (with its Obsidian settings), the skills and the guide into it,
# opens it in VS Code, and opens the guide in the browser.
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
    # VS Code enables an extension as soon as it is installed. The RTL one also turns
    # itself on in the Claude chat the first time VS Code starts after the install.
    $extensions = @(
        @{ Name = 'Claude Code extension';   Id = 'anthropic.claude-code' },
        @{ Name = 'Claude Code RTL Support'; Id = 'yechielby.claude-code-rtl' }
    )

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

    # A fresh VS Code install is not on PATH yet in this window, so look in the install folders too.
    $codeCmd = @(
        (Get-Command code.cmd -ErrorAction SilentlyContinue).Source,
        "$env:LOCALAPPDATA\Programs\Microsoft VS Code\bin\code.cmd",
        "$env:ProgramFiles\Microsoft VS Code\bin\code.cmd"
    ) | Where-Object { $_ -and (Test-Path $_) } | Select-Object -First 1

    $installedExtensions = if ($codeCmd) { & $codeCmd --list-extensions } else { @() }

    foreach ($ext in $extensions) {
        Write-Host ''
        Write-Host "== $($ext.Name) (VS Code) ==" -ForegroundColor Cyan

        if (-not $codeCmd) {
            $status = if ($dryRun) { 'VS Code not found, dry run' } else { "SKIPPED (VS Code not found). Open VS Code, Extensions, search `"$($ext.Name)`"" }
        } else {
            $hasExtension = $installedExtensions -contains $ext.Id
            if ($hasExtension) {
                Write-Host 'Already installed. Checking for a newer version...'
            } else {
                Write-Host 'Not installed. Downloading the latest version...'
            }

            if ($dryRun) {
                Write-Host "[dry run] code --install-extension $($ext.Id)"
                $before = if ($hasExtension) { 'already installed' } else { 'not installed' }
                $status = "$before, dry run"
            } else {
                # --force makes VS Code update the extension when it is already there
                & $codeCmd --install-extension $ext.Id --force
                if ($LASTEXITCODE -ne 0) {
                    $status = "FAILED (exit code $LASTEXITCODE)"
                } elseif ($hasExtension) {
                    $status = 'already installed, checked for update'
                } else {
                    $status = 'installed and enabled'
                }
            }
        }
        $results += [pscustomobject]@{ App = $ext.Name; Result = $status }
    }

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
    # files.txt lists every starter file (settings, skills, the guide). Adding a skill = one new line there.
    $files = (Invoke-WebRequest -Uri "$repoRaw/files.txt" -UseBasicParsing).Content -split "`r?`n" |
        ForEach-Object { $_.Trim() } | Where-Object { $_ -and -not $_.StartsWith('#') }
    $dir = if ($env:WORKSPACE_DIR) { $env:WORKSPACE_DIR } else { Join-Path $env:USERPROFILE 'claude-workspace' }

    Write-Host ''
    Write-Host '== Workspace folder ==' -ForegroundColor Cyan

    # What this run installed is remembered (a hash per file), so the next run can tell a file the person
    # edited from one that is simply out of date:
    #   missing                        -> downloaded
    #   same as the current version    -> left alone
    #   untouched since it was installed, and a newer version exists -> updated
    #   edited by the person           -> kept
    #   a skill from before this record existed -> updated, the old one kept beside it as .bak
    # Lines in files.txt that start with "!" are ours alone (the setup skill, the guide): they always move
    # to the current version, and an old .md is kept beside the new one as .bak.
    $manifestPath = Join-Path $dir '.claude\installer-manifest.json'
    $manifest = @{}
    if (Test-Path $manifestPath) {
        try { (Get-Content $manifestPath -Raw | ConvertFrom-Json).PSObject.Properties | ForEach-Object { $manifest[$_.Name] = $_.Value } } catch {}
    }
    $tmp = Join-Path ([IO.Path]::GetTempPath()) ('ws-installer-' + [guid]::NewGuid().ToString('N'))
    New-Item -ItemType Directory -Force -Path $tmp | Out-Null
    $count = @{ Downloaded = 0; Updated = 0; Kept = 0; Current = 0 }

    foreach ($entry in $files) {
        $always = $entry.StartsWith('!')
        $file = $entry.TrimStart('!')
        $target = Join-Path $dir $file
        $fresh = Join-Path $tmp ($file -replace '[\\/]', '_')
        Invoke-WebRequest -Uri "$repoRaw/$file" -OutFile $fresh -UseBasicParsing
        $new = (Get-FileHash -LiteralPath $fresh -Algorithm SHA256).Hash

        if (-not (Test-Path -LiteralPath $target)) {
            New-Item -ItemType Directory -Force -Path (Split-Path $target) | Out-Null
            Copy-Item -LiteralPath $fresh -Destination $target -Force
            $manifest[$file] = $new
            $count.Downloaded++
            Write-Host "Downloaded: $file"
            continue
        }

        $current = (Get-FileHash -LiteralPath $target -Algorithm SHA256).Hash
        if ($current -eq $new) { $manifest[$file] = $new; $count.Current++; continue }

        $untouched = $manifest.ContainsKey($file) -and ($manifest[$file] -eq $current)
        # a skill installed before this record existed: we cannot tell if it was edited, so it is updated and the old one is kept as .bak
        $unknown = (-not $manifest.ContainsKey($file)) -and $file.StartsWith('.claude/skills/')
        if ($always -or $untouched -or $unknown) {
            if (-not $untouched -and $file.EndsWith('.md')) { Copy-Item -LiteralPath $target -Destination "$target.bak" -Force }
            Copy-Item -LiteralPath $fresh -Destination $target -Force
            $manifest[$file] = $new
            $count.Updated++
            Write-Host "Updated:    $file"
        } else {
            $count.Kept++
            Write-Host "Kept yours: $file"
        }
    }

    ($manifest | ConvertTo-Json) | Set-Content -LiteralPath $manifestPath -Encoding utf8
    Remove-Item -LiteralPath $tmp -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host ("{0} downloaded, {1} updated, {2} already current, {3} kept as you edited them" -f $count.Downloaded, $count.Updated, $count.Current, $count.Kept)

    Write-Host ''
    Write-Host "Done. Your workspace is $dir" -ForegroundColor Green
    Write-Host ''
    Write-Host 'IMPORTANT: VS Code will ask "Do you trust the authors of the files in this folder?"' -ForegroundColor Yellow
    Write-Host 'Click "Yes, I trust the authors". Without it VS Code keeps Claude Code and the RTL extension disabled.' -ForegroundColor Yellow
    Write-Host ''
    Write-Host 'Then follow the guide that opens in your browser. Topic 1 walks you through the rest.'
    Write-Host 'New skills and fixes are added over time. Run this same line again any day to get them. Files you edited are kept.'

    if ($CodeCmd) { & $CodeCmd $dir }

    # The guide teaches everything from here, including how to open a Claude chat, so it has to open without Claude.
    $guide = Join-Path $dir '.claude\skills\introduction\index.html'
    if (Test-Path $guide) { Start-Process $guide }
}

Install-Workspace
