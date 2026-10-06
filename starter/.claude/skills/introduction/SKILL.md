---
name: introduction
description: Opens the workspace guide, nine short presentations in Hebrew that explain this whole system to someone who is not technical (setting up the vault, how the vault works, the connections, what to check, daily work, all the skills, adding a task, adding a personal domain, sharing a skill). Use when I ask for the guide, ask how something here works, or need help getting started. Triggers on "/introduction", "open the guide", "show me the guide", "how does this work", "explain the skills", "מדריך", "תפתח את המדריך", "איך זה עובד", "תסביר לי", "איך מתחילים".
---

# /introduction

The guide is a set of finished pages inside this skill's folder. Do not rebuild them and do not rewrite them: open them. "I" and "me" mean the user. Reply in Hebrew, short.

## Steps
1. Open `.claude/skills/introduction/index.html` in my default browser, using its absolute path. Windows: `Start-Process "<path>"`. Mac: `open "<path>"`.
2. Tell me in one line that the guide is open, and that someone new starts with topic 1.
3. If I asked about one specific thing, open that topic's page instead of the menu, and name it:

| Page | Topic |
|---|---|
| `setup.html` | Setting up the vault: Obsidian on the right folder, Claude Code enabled, the connections, running /setup-vault |
| `vault.html` | How the vault works: the four layers, how Claude finds things, what I do |
| `connections.html` | The connections: Notion, Slack, Gmail, Google Drive, Toffu, and how to connect them |
| `checklist.html` | What to check, and what to do when something does not work |
| `daily.html` | A working day: what to say, how to check Claude, habits |
| `skills.html` | All the skills, and when to use each one |
| `add-task.html` | Adding a task to Notion in one sentence |
| `personal.html` | Adding a personal domain next to work |
| `share-skill.html` | Making my own skill and sharing it with the team |

## The guide is also your reference
When I ask how something in this workspace works and the vault does not answer it, read the matching page here before you answer, so that what you tell me matches what the guide shows.

## Rules
- Never edit these pages in order to answer a question.
- If I ask to change the guide for myself, treat it like any skill: edit the vault copy first, then mirror it.
- The pages work without internet, apart from the fonts. If a page opens with no styling, the files next to it are missing: tell me to paste the installer line again.
