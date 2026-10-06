@echo off
title Obsidian + VS Code + Claude installer
echo Installing the latest Obsidian, Visual Studio Code and Claude...
echo.
powershell -NoProfile -ExecutionPolicy Bypass -Command "[Net.ServicePointManager]::SecurityProtocol = 'Tls12'; irm https://raw.githubusercontent.com/nadavglassberg/claude-workspace-installer/main/install.ps1 | iex"
echo.
pause
