---
name: setup-vault
description: Builds a complete "second brain" from scratch in the current VS Code project, an Obsidian vault with Claude Code as its main writer (folder structure, CLAUDE.md router, _rules.md rulebook, templates, five core skills, agent specs, vault-first hook), and teaches the system while building it. Run ONCE in a fresh, empty project folder. Triggers on "/setup-vault", "set up my vault", "build my second brain", "build the vault", "start the vault setup".
---

# /setup-vault

Run this once, in a new empty project folder opened in VS Code. It interviews the user, then builds the whole vault system. Everything below is written in the user's voice: "I" and "me" mean the user, "you" means Claude.

If the folder already holds a vault (a CLAUDE.md at the root plus a folder containing _rules.md and wiki/), stop and say so. Do not rebuild over an existing vault.

You are building my "second brain": an Obsidian vault that lives inside this VS Code project, with you (Claude Code) as its main writer. Build the structure literally. Do not simplify it and do not skip a file because it looks small.

## 0. How to work on this build
- Open with a numbered checkbox list of the sections below and tick each one as it completes.
- Ask me the questions in section 1 in ONE message and wait for my answers before creating anything.
- After each section, tell me in 2-3 lines what you built and why it exists. I am learning the system, not only receiving it.
- Never invent facts about me, my clients or my team. An empty section is fine, a made-up one is not.
- Never write a password, token or API key into any file.
- Detect my operating system and use the right shell syntax.

## 1. Ask me first
1. My full name, my role, and the company I work for. Everywhere below, <me> means my first name in lowercase and <company> means the company name in lowercase-kebab-case.
2. Vault folder name (default: <me>_vault). Everywhere below, <vault> means this name.
3. Which domains I want. Default: Work (my job) and Personal. Optional: Business (a company I own), Academic.
4. For each domain, the words that signal it (client names, people, topics). These become the routing table.
5. Whether I work on more than one computer (decides section 11).
6. Reply style: short answers by default (recommended), and which language.

## 2. The idea (explain this back to me before building)
- The project root is the folder open in VS Code. It holds CLAUDE.md, the .claude folder, the vault, and any code folders.
- The vault is a SUBFOLDER of the project root. VS Code opens the parent, Obsidian opens only the vault subfolder ("Open folder as vault"). Same files, two windows: you write, I read and browse in Obsidian.
- The vault is the source of truth. Chat is not memory. Any durable fact I give you is written into the right vault file in the same turn.
- Four layers: raw (inputs not processed yet), wiki (knowledge, split by domain), calendar (what happened, by date), components (the machinery: skills, agents, templates).
- Every folder has _index.md (navigation only) and, when needed, _rules.md (how to work in that folder). Never merge the two. You reach a file by jumping index to index on the shortest path, never by scanning the vault.
- Domains are isolated. Work notes are never written into personal folders, and the other way around.

## 3. Folder structure (create exactly this)

<project root>/                     open THIS folder in VS Code
  CLAUDE.md                         auto-loaded every session. A byte-identical MIRROR of <vault>/CLAUDE.md. Never edited directly.
  .gitignore
  .claude/
    settings.local.json             hook + permissions. Gitignored.
    skills/<name>/SKILL.md          ACTIVE skill copies. Always flat, no category folders.
    agents/<name>.md                active subagent definitions
  visuals/                          throwaway HTML outputs. Gitignored.
  <vault>/                          open THIS folder in Obsidian
    CLAUDE.md                       the canonical copy. Edit only this one.
    _index.md                       vault map: links to every top folder and meta file
    _rules.md                       the rulebook (section 6)
    _goals.md                       why the vault exists, priorities per domain
    _active.md                      resume pointer for the next session
    _tasks.md                       the single cross-domain task hub
    _log.md                         processing history, newest on top
    raw/
      inbox/                        I drop files here
      processed/                    originals moved here after extraction
      skipped/                      files that failed and need me
    calendar/
      _index.md
      YYYY-MM/
        _index.md
        YYYY-MM-DD.md               one note per day
    components/
      skills/
        _index.md                   one table per category, every skill listed
        <category>/<name>/SKILL.md  CANONICAL skill copies. Categories: vault, dev, work, ui, general
      agents/
        _index.md
        _rules.md
        <category>/<name>.md        one spec per subagent
      templates/
        _index.md
        <category>/<type>.md        categories: shared, ops, crm, work, personal, life-admin
    wiki/
      _index.md                     table of namespaces
      work/
        _index.md
        _rules.md
        <company>/
          _index.md
          _rules.md                 isolation rule, entry-path table, entity registry
          <company>.md              the company page
          team/  clients/           create these two now (I will fill them first)
      personal/
        _index.md
        _rules.md
      shared/
        _index.md
        _rules.md

Planned work sub-areas, listed in wiki/work/<company>/_rules.md as an entry-path table but created only when the first real file arrives: campaigns, software, reporting, automation, operations, code, data-ops, agents. Same for personal: goals, health, finance, travel, routines, home, social. Rule: a folder is created on demand, and a folder whose _index.md only says "empty" gets deleted. If I chose Business or Academic, add wiki/business/<company>/ and wiki/academic/ the same way.

## 4. Root meta files
- _goals.md: one section per domain with Primary / Secondary purpose, plus the meta-rule "the vault must always be self-contained, chat history is not a backup". Fill it from my answers.
- _active.md: a resume pointer, NOT a session log. Only three block types: "UNFINISHED - RESUME HERE" (exact steps, IDs and paths to resume cold), "NEXT SESSION - START HERE" (ordered checklist), "ALSO OPEN" (items not yet in _tasks.md). A session that finished cleanly leaves it untouched.
- _tasks.md: "## Open" holds one table per domain (### Work, ### Personal) with columns ID | Task | Who | Time | Impact | Prio | Notes. IDs are unique across the whole file. Impact and Prio are plain numbers 1-10, Time is a real unit (15m, 2h), Who is <me> / claude / <me>+claude. Sub-steps go in the cell as ☐ / ☑. "## Done" is a compact table Task | Owner | Domain | Completed, newest on top. Closing a task = delete the row from Open, add it to the top of Done. First line of the file is "_Updated: <date> (<what changed>)_".
- _log.md: one dated block per /process-vault run, listing each file and where it went.
- _index.md files: a short frontmatter, then a list or table of links with one line each. Nothing else.
- Frontmatter on EVERY note: type, topic, domain, date, tags. "type" matches a template name. "topic" is a full descriptive line, because that is what search matches on.

## 5. CLAUDE.md (write it in <vault>/CLAUDE.md, then mirror to the project root)
This file is a ROUTER, not a rulebook. Keep it under about 60 lines. Sections:

A. "STOP - read the vault first": before any task that touches a domain, read <vault>/CLAUDE.md and <vault>/_rules.md.

B. "Always-on" (rules that must fire on every reply live here, because this is the only auto-loaded file):
- Any new fact I give you goes into the correct vault file in the same turn. If no file exists, create one from a template and link it from the folder's _index.md.
- A new task goes into <vault>/_tasks.md in the same turn. Never leave a task in chat only.
- End every reply that touched a file with a "Files changed:" block, one markdown link per file with a few words on what changed. Read but not changed: link it under "File:". This is the last thing in the message.
- Never send me to go read a vault file. Put the usable content in the chat.
- When you can do a step yourself, do it. Hand off only what is impossible for you (my credentials, physical actions).
- Short answers: the answer in 1-5 lines or one small table. No recap, no reasoning unless I ask. Long work goes in the file, the chat gets the result and the link.
- Long or multi-step task: open with a numbered checkbox list and tick as you go.
- Skills: vault first, then mirror (section 8). Agents: vault spec first (section 9).
- Editing CLAUDE.md: vault copy only, then run /sync-claude-md in the same turn. Never touch the root copy.
- All persistent content lives in <vault>/. Never create durable folders at the project root.
- Never write to Claude Code's auto-memory folder (~/.claude/projects/.../memory/). It is machine-local. Every durable fact goes to the vault.
- "Weekend" means Friday-Saturday.
- New behavior rules go to <vault>/_rules.md, section "Response behavior". Only every-reply rules are added here.

C. "Domain routing": the line "Detect domain first. Read only that domain's files. Never cross boundaries." then a table: Signal | Domain | First file to read. One row per domain using my signal words, pointing at that domain's _rules.md (Work: <vault>/wiki/work/<company>/_rules.md). Last row: Unclear, ask me which domain. Add: tool names (Meta Ads, Google Ads, email) are NOT routing signals, and wiki/shared/** is cross-domain only when a domain file explicitly links to it.

## 6. <vault>/_rules.md (the rulebook, loaded on demand)
Write these sections, each as short actionable bullets:
- Navigation: shortest path through _index.md files, stop reading once answered, read a folder's _rules.md before working in it, ask if the target is not obvious.
- Writing notes: facts and bullets, no narrative. First mention of a date links to [[calendar/YYYY-MM/YYYY-MM-DD]]. No file without a template (create the template first if it is missing). Every person gets their own file, ask me before creating one.
- Wiki-linking: the first body mention of anything that has a vault page is a [[wiki-link]], later mentions are not. Each domain _rules.md keeps an "Entity registry" table (name, target page) to check against before saving. Placeholder links inside templates are wrapped in backticks so Obsidian does not create empty notes. Link a folder through its _index.
- No empty pages: no placeholders in filenames, no 0-byte files, a stub must say what is coming and why.
- Task hub: the _tasks.md format from section 4, plus "grep the whole file for an ID before using it".
- Index hygiene: every create, move, rename or delete updates the _index.md of every folder it touches. A new folder gets its own _index.md.
- Domain write isolation: Work writes only to wiki/work/<company>/**, Personal only to wiki/personal/**.
- Processing: raw files are never deleted by hand, /process-vault handles them.
- Rejects: when I reject an approach or correct you, write the correction into the most relevant _rules.md in that same turn.
- Response behavior: starts empty, grows from my corrections. Each rule carries the date and the reason.
- Data accuracy: real units, 1-10 scales instead of low/medium/high, exact figures, "~" only for true estimates, a wrong fact is fixed in every file in one pass, dates are read from the environment and never guessed.
- Folder and file conventions: _index.md plus _rules.md shape, folders on demand, lowercase-kebab-case filenames.
- Skills, Subagents, CLAUDE.md: the rules from sections 8, 9 and 5.

## 7. Templates (<vault>/components/templates/)
Every note is created from a template. Each template is a .md file with frontmatter and bracketed placeholder sections. Create these and list them all in templates/_index.md, grouped by category with the "type" each one produces:
- shared/index.md and shared/rules.md: the two structural files. The rules template has: When this folder is the target / rules per task / DO NOT do these / Templates and references.
- life-admin/calendar.md: frontmatter (type calendar, date, domain, topic), then "## Processed" and "## Session Summary - YYYY-MM-DD" with Built / changed, Do's / Don'ts, Open questions, Next steps.
- crm/person.md (Role, Background, Notes) and crm/company.md.
- work/client.md, work/campaign.md, work/software.md (a tool we use: what it is for, SOPs, access notes without credentials).
- ops/agent-spec.md (section 9), ops/checklist.md, ops/runbook.md (symptom, triage, fix, escalation).
- personal/journal-entry.md.
A convention agreed for a file type is written into BOTH the template and that folder's _rules.md.

## 8. Skills
A skill is a folder with a SKILL.md whose frontmatter has "name" and "description" (the description is what makes Claude pick it, so write real trigger phrases in it). I run one by typing /<name>.
Two copies, always: canonical in <vault>/components/skills/<category>/<name>/ and active in .claude/skills/<name>/ (flat). Creating a skill is 3 steps in one turn, in this order: (1) write the vault copy with all its assets, (2) add a row to components/skills/_index.md, (3) mirror the whole folder to .claude/skills/<name>/. Editing: vault first, then mirror. Never edit only the active copy. Scripts and HTML a skill uses live inside the skill folder.
Build these five now, in category "vault". A sixth, /setup-vault (this skill), already sits in .claude/skills/setup-vault/: copy it to <vault>/components/skills/vault/setup-vault/ and add its row to the index, so it follows the two-copies rule too.
1. /end-of-session: (a) reconcile _tasks.md against the conversation both ways, closing what finished and adding what was started and not finished, (b) append a "## Session Summary" to calendar/YYYY-MM/YYYY-MM-DD.md from the calendar template, appending and never overwriting an existing note, (c) append each reusable do / don't to the highest _rules.md where it applies, (d) update _active.md under the rules in section 4, (e) if git sync is on, commit and push last.
2. /process-vault: read _goals.md and _rules.md, scan raw/inbox/, and for each file detect the domain, pick or create the template, extract EVERY distinct piece of information (ask me when one has no clear home), write the notes with frontmatter and wiki-links, update every _index.md touched, add to today's calendar note, append to _log.md. Hand-typed .md / .txt notes are deleted only after everything is extracted. PDFs, images and spreadsheets move to raw/processed/. Failures go to raw/skipped/.
3. /sync-claude-md: read both CLAUDE.md files, and if they differ show me the diff, then overwrite the root copy with the vault copy (vault wins). If the root copy holds something the vault copy lacks, merge it into the vault copy first.
4. /vault-skills-sync: inventory both skill locations. Vault-only skills are copied to active, active-only skills are written into the vault and the index, and skills in both are diffed across the whole folder. On a difference show me and ask, never auto-overwrite, never delete.
5. /deep-process-vault: whole-vault audit. Finds dead links, orphan notes, files missing from an _index.md, empty files and frontmatter gaps. Auto-fixes the safe ones, lists the risky ones for me, writes a report.

## 9. Subagents
No subagent without a spec. Before any Agent call that introduces a new agent type: check <vault>/components/agents/_index.md, and if it is not listed, write <vault>/components/agents/<category>/<name>.md from the agent-spec template, add it to the index, and only then use it. The spec has: frontmatter (type agent-spec, agent, model, domain), Purpose (one sentence), Vault context to load (subagents cannot see the vault, so the parent reads those files and pastes them into the prompt), Prompt template with {{PLACEHOLDERS}}, Output destination (a vault path). The parent saves the agent's output to that path and gives me a link plus a one-line headline, never a pasted dump. Write these rules into components/agents/_rules.md. Create no agents yet.
While I am learning: whenever a subagent is a realistic option, say so before acting, name the model you would use (Haiku for mechanical work, Sonnet for reasoning) and why in one sentence, then proceed.

## 10. Hook, settings, Obsidian
- In .claude/settings.local.json add a UserPromptSubmit hook of type "command" that prints this JSON to stdout on every prompt (use my OS's shell): {"hookSpecificOutput":{"hookEventName":"UserPromptSubmit","additionalContext":"VAULT-FIRST REMINDER: Before responding, if the request touches any vault domain (per CLAUDE.md), you MUST read <vault>/_rules.md and follow its shortest-path navigation to the target _index.md / _rules.md before answering or asking clarifying questions. The vault is the source of truth. Do not ask me questions whose answers live in the vault."}} Explain to me what a hook is and why this one exists.
- Permission rules: never put a token or an absolute machine path into an allow rule, and never allowlist an interpreter or package runner.
- .gitignore: visuals/, .claude/settings.local.json, .env, .env.local, .env.*.local, node_modules/, __pycache__/, *.pyc, <vault>/.obsidian/workspace.json, *Conflicted copy*
- Obsidian settings, written by you BEFORE Obsidian first opens the vault, so every vault built from this skill is configured the same. Create <vault>/.obsidian/ with exactly these two files:
  - app.json: {"showUnsupportedFiles":true}
  - core-plugins.json: {"file-explorer":true,"global-search":true,"switcher":true,"graph":true,"backlink":true,"canvas":true,"outgoing-link":true,"tag-pane":true,"footnotes":false,"properties":true,"page-preview":true,"daily-notes":true,"templates":true,"note-composer":true,"command-palette":true,"slash-command":false,"editor-status":true,"bookmarks":true,"markdown-importer":false,"zk-prefixer":false,"random-note":false,"outline":true,"word-count":true,"slides":false,"audio-recorder":false,"workspaces":false,"file-recovery":true,"publish":false,"sync":false,"bases":true,"webviewer":false}
  No community plugins are needed.
- Open the vault in Obsidian for me. This is the LAST action of the whole build (section 12, step 7), not now. Obsidian only opens folders it has registered, so:
  1. Find Obsidian's registry file: %APPDATA%\obsidian\obsidian.json on Windows, ~/Library/Application Support/obsidian/obsidian.json on Mac. If it does not exist, Obsidian has never been started: start it once, close it, look again.
  2. If Obsidian is running, ask me to close it and wait for my answer. Never edit the registry while it is running.
  3. Copy the registry file to obsidian.json.bak next to it. Then add one entry under "vaults", keeping every existing entry untouched: key = 16 random lowercase hex characters, value = {"path":"<absolute path of <vault>>","ts":<current time in milliseconds>,"open":true}.
  4. Start Obsidian. Confirm with me that the vault opened.
  5. If anything in steps 1-4 fails or looks different from what is described here, restore the .bak file and fall back to walking me through it by hand: open Obsidian, "Open folder as vault", pick <vault> (the vault subfolder, not the project root).
  Then show me the graph view and how to click a [[link]].

## 11. Sync (only if I said I use more than one computer)
- Vault between devices: Obsidian Sync (paid). It covers only <vault>/, not the code or .claude folders.
- Whole project: a PRIVATE GitHub repo, pull in the morning and push at night, built as a /sync-github skill. It must sweep for credentials between commit and push, never force-push, list staged deletions before committing, and stop and ask on a merge conflict.
- Commit vault edits during a session, not only at the end. A sync tool can roll a file back, and uncommitted work is the only kind that cannot be recovered.
If I use one computer, run git init anyway and make local commits, so every change has history.

## 12. Finish
1. Run /sync-claude-md and /vault-skills-sync and show me that both copies match.
2. Structure check. Everyone who runs this skill must end with the exact same structure. Re-read this whole skill from the top, then list what is actually on disk and compare it line by line against the tree in section 3 and the files named in sections 4-10 (every folder, every _index.md and _rules.md, every template, all six skills in BOTH locations, the hook, .gitignore, the two .obsidian files). Create whatever is missing and fix whatever differs. Repeat until a full pass finds nothing. Then print the final tree with a one-line result: "matches the skill" or the list of differences I chose myself (vault name, optional domains).
3. Write today's calendar note describing the build.
4. Create my own person page and my company page by interviewing me with at most 6 questions.
5. Add 3 starter tasks to _tasks.md: fill the first client page, drop one real file into raw/inbox and run /process-vault, run /end-of-session at the end of today.
6. Give me a one-screen cheat sheet. Daily loop: tell Claude facts as they happen, drop files into raw/inbox and run /process-vault, type /end-of-session before closing. Plus the five skills and what each one does.
7. Open the vault in Obsidian (section 10).
