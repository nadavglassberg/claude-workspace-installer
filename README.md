# Second brain starter: Obsidian + VS Code + Claude

Everything you need to get an Obsidian vault that Claude Code writes for you. One line installs the apps, the skills and a guide. The guide then walks you through the rest, step by step, in Hebrew.

## Before you start: join the team on Claude

**You do not need to buy a subscription.** Do not sign up for Pro or Max.

1. You will get an invitation from us by email to the team's Claude plan.
2. Open it and join the team.
3. Remember which email the invitation came to. You sign in to Claude Code with that account.

The apps install without an account, but Claude Code only works once you have joined.

Obsidian and VS Code are free and need no account.

## Step 1. Run the installer (5 minutes)

1. Copy this line (hover over it and click the copy button on the right):

```powershell
irm https://raw.githubusercontent.com/nadavglassberg/claude-workspace-installer/main/install.ps1 | iex
```

2. Press the **Windows key**, type `powershell`, press **Enter**.
3. Paste the line (right-click or Ctrl+V) and press **Enter**.
4. Wait until it says **Done**.

What it does:

| | |
|---|---|
| Obsidian, Visual Studio Code, Claude (desktop app) | Checks if each one is already installed. Missing: installs the latest version. Installed: updates it only if a newer version exists. |
| Claude Code extension for VS Code | Same check, same rule. Enabled as soon as it is installed. |
| Claude Code RTL Support extension | Same check, same rule. Makes Hebrew read right-to-left in the Claude chat. |
| Your workspace folder | Creates `C:\Users\<you>\claude-workspace` with an empty `vault` folder, all the skills and the guide. Files that already exist are never overwritten. |
| Model | Sets Claude Code in that folder to **Opus 5.5** at **high effort**. |
| VS Code and the guide | Opens VS Code on the folder, and opens the guide in your browser. |

<details>
<summary>Alternative: download a file and double-click it</summary>

[![Download the installer](https://img.shields.io/badge/Download_the_installer-Windows-2ea44f?style=for-the-badge&logo=windows)](https://github.com/nadavglassberg/claude-workspace-installer/releases/latest/download/install.bat)

Download `install.bat` and double-click it. It runs the same line as above.

- "Windows protected your PC": click **More info**, then **Run anyway**.
- "Smart App Control blocked a file": this cannot be bypassed on that computer. Use the copy-paste line above instead.

</details>

## Step 2. Follow the guide

The guide opens in your browser when the installer finishes. It is twelve short presentations. You move forward only when you click.

**Start with topic 1, "Setting up the vault".** It walks you through four steps:

1. Open Obsidian on your vault folder. The guide shows the exact path on your computer, with a copy button.
2. Make sure Claude Code is enabled in VS Code, and open a new chat.
3. Connect Notion, Slack, Gmail and Google Drive.
4. Type `/setup-vault`. Claude asks your name, builds the vault, fills it from your own Notion and client config sheet, and gives you a short tour.

No company data is stored in this repo. Claude reads it live from your own accounts, and it stays on your computer.

To open the guide again later, type `/introduction` in Claude Code, or open `claude-workspace\.claude\skills\introduction\index.html`.

## The guide's topics

| | Topic |
|---|---|
| 1 | Setting up the vault |
| 2 | How the vault works |
| 3 | The connections |
| 4 | What to check, and what to do when something does not work |
| 5 | Working with it day to day |
| 6 | All the skills |
| 7 | Adding a task |
| 8 | Adding a personal domain |
| 9 | Sharing a skill with everyone |
| 10 | What MCP is |
| 11 | What an agent is, and when to split work between agents |
| 12 | MCP, CLI and API: the difference, and skill versus connection |

## Skills you get

Type the name in Claude Code, or just say what you want in Hebrew or English.

| Skill | What it does |
|---|---|
| `/introduction` | Opens the guide |
| `/setup-vault` | The one-time setup. Safe to run again, it continues where it stopped |
| `/start-day` | Morning brief: due today, overdue, who is waiting for you in Slack and email, today's meetings, a suggested order |
| `/add-task` | Say what needs doing. It opens the task in Notion on the right client, assigned to you |
| `/my-tasks` | Your open tasks from Notion, most urgent first. Close, postpone or mark stuck by saying so |
| `/slack-catchup` | Reads your client channels, DMs and mentions since you last looked. One digest, with what needs your answer |
| `/client-brief` | One client on one screen before a meeting: facts, open tasks, recent messages, last decisions, what to raise |
| `/draft-update` | Drafts an email or Slack message to a client. Never sends, you do |
| `/refresh-my-data` | Re-reads Notion and the config sheet and updates your vault. Tells you what changed |
| `/process-vault`, `/end-of-session` and 3 more | The vault's own upkeep. Built during setup |

**New skills:** paste the installer line from Step 1 again. It downloads what you do not have yet and never overwrites your own files. Then type `/vault-skills-sync`.

**Make one yours:** tell Claude what to change ("in /start-day, show meetings first"). It edits your copy.

## What you get

```
claude-workspace/               open THIS folder in VS Code
  CLAUDE.md                     the rules Claude loads on every session
  .claude/skills/               the skills you run with /name, and the guide
  vault/                        open THIS folder in Obsidian
    _rules.md  _tasks.md  _active.md  _goals.md
    raw/                        drop files here
    wiki/                       your knowledge (clients, team, tools, processes)
    calendar/                   one note per day
    components/                 skills, agent specs, templates
```

## Mac

The installer line is Windows only. On a Mac, with [Homebrew](https://brew.sh) installed, paste this into Terminal:

```bash
brew install --cask obsidian visual-studio-code claude \
  && code --install-extension anthropic.claude-code \
  && code --install-extension yechielby.claude-code-rtl \
  && B=https://raw.githubusercontent.com/nadavglassberg/claude-workspace-installer/main/starter \
  && curl -fsSL $B/files.txt | grep -v '^#' | while read -r f; do [ -z "$f" ] && continue; \
       t=~/claude-workspace/$f; mkdir -p "$(dirname "$t")"; [ -e "$t" ] || curl -fsSL "$B/$f" -o "$t"; done \
  && code ~/claude-workspace \
  && open ~/claude-workspace/.claude/skills/introduction/index.html
```

Then continue from Step 2.
