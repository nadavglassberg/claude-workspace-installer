---
name: refresh-my-data
description: Re-reads the company's Notion and the client config sheet and brings my vault up to date with what changed, my clients, who the team lead and campaigner of every client is, new and departed clients, new and departed teammates, changed roles and managers, changed targets and accounts, and my tasks, then tells me exactly what changed. Triggers on "/refresh-my-data", "refresh my clients", "update my vault from Notion", "sync my data", "did anything change in Notion", "I got a new client", "the team lead changed", "who runs <client> now", "תרענן את הנתונים", "תעדכן את הלקוחות שלי", "קיבלתי לקוח חדש", "השתנה ראש צוות", "מי מטפל ב", "מה השתנה".
---

# /refresh-my-data

Keeps the vault true to the company's systems. People change clients, team leads change, clients come and go: the vault follows. "I" and "me" mean the user. Reply in Hebrew, short.

## Steps
1. Read wiki/work/ppg/software/notion.md and config-sheet.md. They hold what was learned about the two sources at setup: where they are, what the fields mean, the reading traps. Trust them, but if a field they name is gone, re-read the schema and update the page.
2. Notion:
   - My own team profile, and each client page it links to.
   - The team roster: every person, with role, manager and whether they are active.
   - Prefer fetch over database queries: queries can have a usage limit the whole company shares. At most 2 queries in a run. A "limit reached" answer is not retried.
3. Config sheet: read it once and keep ALL the rows, not only mine. Every row gives a client, its team lead and its campaigner, and that one read is the cheapest picture of the whole company.
4. Compare with the vault and apply.
   My clients:
   - A client that is newly mine: create its page from the template, the way setup did, and add it to the index, the entity registry and the routing words.
   - A client that is no longer mine: do NOT delete the page. Move it to the "Other clients" table, and write on the page the date and who has it now.
   - A changed fact (status, team lead, campaigner, target, budget, account ID, channel, report link): update the page, and keep the old value on a dated line under "History" on that page.
   Everyone else's clients (the "Other clients" table in the clients index):
   - A client whose campaigner or team lead changed: update its line.
   - A client that is new to the company: add a line.
   - A client that left or went inactive: remove the line, and note it in today's calendar note.
   The team:
   - A new teammate: add the page. A teammate who left: mark the page as no longer active. Never delete a person page.
   - A changed role, manager or list of clients: update the person's page, with the old value on a dated line under "History".
   - If MY team lead or MY manager changed, update my own page, and put that first in the report.
   My tasks: run the sync part of /my-tasks.
5. When the two sources disagree about who owns a client, follow the rule written in wiki/work/ppg/_rules.md, and list the disagreement for me. Do not pick silently.
6. Tell me what changed, in three short groups, and leave out a group that is empty:
   - אצלי: my clients, my team lead, my tasks.
   - בצוות: people who joined, left, or changed role or manager.
   - בחברה: clients that changed hands, new clients, clients that left.
   Each line is old value, then new value. If nothing changed at all, one line.
7. Add a line to today's calendar note with the date of this refresh, and make a local git commit: "data refresh".

## Rules
- Read only in Notion and the sheet. This skill never writes to them.
- A change in the sources is a fact to record, not something to act on. Do not message anyone about it, and do not open tasks from it unless I ask.
- Never overwrite something I told you with something from a source without telling me. If my note and the source disagree, keep both and ask.
- Never copy a password column, or a teammate's private details.
- Run it whenever I ask, and offer it when a client or a person comes up that the vault does not know, or when what I say contradicts what the vault holds about who runs a client.
