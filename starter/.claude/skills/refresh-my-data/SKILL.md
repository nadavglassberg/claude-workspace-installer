---
name: refresh-my-data
description: Re-reads the company's Notion and the client config sheet and brings my vault up to date, new clients, changed owners, changed targets and accounts, new teammates, closed and new tasks, and tells me exactly what changed. Triggers on "/refresh-my-data", "refresh my clients", "update my vault from Notion", "sync my data", "did anything change in Notion", "I got a new client", "תרענן את הנתונים", "תעדכן את הלקוחות שלי", "קיבלתי לקוח חדש".
---

# /refresh-my-data

Keeps the vault true to the company's systems. "I" and "me" mean the user. Reply in Hebrew, short.

## Steps
1. Read wiki/work/ppg/software/notion.md and config-sheet.md. They hold what was learned about the two sources at setup: where they are, what the fields mean, the reading traps. Trust them, but if a field they name is gone, re-read the schema and update the page.
2. Notion: fetch my team profile and each client page it links to. Then the team roster.
   - Prefer fetch over database queries: queries can have a usage limit the whole company shares. At most 2 queries in a run. A "limit reached" answer is not retried.
3. Config sheet: read it again and find my rows.
4. Compare with the vault and apply:
   - A client that is newly mine: create its page from the template, the way setup did, and add it to the index, the entity registry and the routing words.
   - A client that is no longer mine: do NOT delete the page. Move it to the "Other clients" table, and write on the page the date and who has it now.
   - A changed fact (status, team lead, target, budget, account ID, channel, report link): update the page, and keep the old value on a dated line under "History" on that page.
   - New or departed teammates: add the page, or mark the page as no longer active. Never delete a person page.
   - Tasks: run the sync part of /my-tasks.
5. Tell me what changed as a short list: added, changed (old value to new value), removed from me. If nothing changed, one line.
6. Add a line to today's calendar note, and make a local git commit: "data refresh".

## Rules
- Read only in Notion and the sheet. This skill never writes to them.
- Never overwrite something I told you with something from a source without telling me. If my note and the source disagree, keep both and ask.
- Never copy a password column, or a teammate's private details.
- Run it whenever I ask, and offer it when a client name comes up that the vault does not know.
