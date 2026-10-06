# Second brain starter: Obsidian + VS Code + Claude

Everything you need to get an Obsidian vault that Claude Code writes for you. One line installs the apps and the setup skill, then Claude builds the vault with you.

## Before you start: a paid Claude plan

The apps install without an account, but Claude Code will not work until you sign in with a paid plan. Do this first:

1. Go to [claude.ai](https://claude.ai) and create an account, or sign in.
2. Subscribe to **Pro** or **Max** (or ask your company for a seat on its Team or Enterprise plan). The free plan does not include Claude Code.
3. Remember which email you used. You sign in with it in Step 2.

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
| Claude Code extension for VS Code | Same check, same rule. |
| Your workspace folder | Creates `C:\Users\<you>\claude-workspace` and downloads the `/setup-vault` skill into it. Files that already exist are never overwritten. |
| VS Code | Opens on that folder when everything is done. |

<details>
<summary>Alternative: download a file and double-click it</summary>

[![Download the installer](https://img.shields.io/badge/Download_the_installer-Windows-2ea44f?style=for-the-badge&logo=windows)](https://github.com/nadavglassberg/claude-workspace-installer/releases/latest/download/install.bat)

Download `install.bat` and double-click it. It runs the same line as above.

- "Windows protected your PC": click **More info**, then **Run anyway**.
- "Smart App Control blocked a file": this cannot be bypassed on that computer. Use the copy-paste line above instead.

</details>

## Step 2. Let Claude build the vault (20 to 30 minutes)

1. VS Code is open on `claude-workspace`. Click the Claude icon in the sidebar and sign in with the account from "Before you start".
2. Type `/setup-vault` and press Enter. If the command does not show up, close and reopen VS Code, or type "run the setup-vault skill".
3. Claude asks you a few questions (your name, your company, your vault name, which domains you want). Answer them in one message.
4. Claude builds everything and explains each part as it goes.
5. At the end Claude re-reads the skill, compares it to what it built, and fixes any gap. Everyone ends with the same structure.

## Step 3. The vault opens in Obsidian

Claude's last action is to open the new vault in Obsidian, already configured. It may ask you to close Obsidian first.

If it does not open by itself:

1. Open Obsidian.
2. Choose **Open folder as vault**.
3. Pick the vault folder INSIDE the workspace: `C:\Users\<you>\claude-workspace\<your vault name>`. Not the `claude-workspace` folder itself.

Two windows, same files: VS Code opens the workspace and Claude writes there. Obsidian opens only the vault subfolder, and you read and browse there.

## Step 4. Obsidian Sync (optional, for a second computer or your phone)

Obsidian Sync is a paid add-on from Obsidian. It keeps the vault folder identical on all your devices.

On the first computer:

1. Create an account at [obsidian.md](https://obsidian.md) and buy Sync.
2. In Obsidian: Settings, Core plugins, turn on **Sync**.
3. Settings, Sync, **Log in**.
4. Next to "Remote vault" click **Choose**, then **Create new vault**. Give it a name and set an encryption password. Save that password, it cannot be recovered.
5. Click **Connect** and wait for the first upload to finish.
6. In Settings, Sync, turn on syncing for **all other file types**, so HTML and other non-note files travel too.

On every other device:

1. Install Obsidian and create a new EMPTY vault (on a second computer: run Step 1 there first, then make the empty vault folder inside `claude-workspace`, with the same vault name).
2. Settings, Core plugins, turn on **Sync**. Log in.
3. **Choose**, pick the remote vault you created, enter the encryption password, **Connect**.

Good to know:

- Sync covers the vault folder only. The rest of the workspace (`CLAUDE.md`, `.claude/`, code) does not travel with it. For those, ask Claude to "set up the private GitHub sync" (it builds a `/sync-github` skill and a private repo for the whole workspace).
- Do not also keep the vault inside OneDrive, Dropbox or Google Drive. Two sync tools on one folder create conflicted copies.

## What you get

```
claude-workspace/               open THIS folder in VS Code
  CLAUDE.md                     the rules Claude loads on every session
  .claude/skills/               the skills you run with /name
  <your vault>/                 open THIS folder in Obsidian
    _rules.md  _tasks.md  _active.md  _goals.md
    raw/                        drop files here
    wiki/                       your knowledge, split by domain (work, personal)
    calendar/                   one note per day
    components/                 skills, agent specs, templates
```

The full structure and every rule is in the skill itself: [starter/.claude/skills/setup-vault/SKILL.md](starter/.claude/skills/setup-vault/SKILL.md).

## Daily loop

1. Tell Claude facts as they happen. It writes them into the right vault file.
2. Drop files into `raw/inbox` and type `/process-vault`.
3. Type `/end-of-session` before you close VS Code.

## Mac

The button is Windows only. On a Mac, with [Homebrew](https://brew.sh) installed, paste this into Terminal:

```bash
brew install --cask obsidian visual-studio-code claude \
  && code --install-extension anthropic.claude-code \
  && mkdir -p ~/claude-workspace/.claude/skills/setup-vault \
  && curl -fsSL https://raw.githubusercontent.com/nadavglassberg/claude-workspace-installer/main/starter/.claude/skills/setup-vault/SKILL.md \
       -o ~/claude-workspace/.claude/skills/setup-vault/SKILL.md \
  && code ~/claude-workspace
```

Then continue from Step 2.
