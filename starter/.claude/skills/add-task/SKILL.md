---
name: add-task
description: Adds a task to the company's task database in Notion, linked to the right client and assigned to me, and mirrors it in my vault. Use whenever I say something I or someone needs to do for a client. Triggers on "/add-task", "add a task", "open a task", "task for <client>", "remind me to", "I need to", "תוסיף משימה", "תפתח משימה", "משימה ל", "צריך לעשות".
---

# /add-task

Creates one task in the company task database in Notion, on the right client, owned by me. "I" and "me" mean the user. Reply in Hebrew, short.

## Before the first run (once)
The task database is described in my vault, in wiki/work/ppg/software/notion.md. If that page has no "Task field map" section yet, build it now:
1. Find the task database in Notion and fetch its schema.
2. Write a "Task field map" section into software/notion.md with: the database link, and which property is the title, the status (and its exact option names, including which one means "open"), the priority (and its options), the due date, the client link (and whether it takes one client or several), the owner as a link to a team profile, the owner as a person field, the role of the owner, a free-text update field, and an escalation flag. Note whether the database has a default page template.
3. Also record my own team profile page link and my Notion user ID, so later runs do not search for them.
Never guess a property name. Use only names you read from the schema. If the schema changed since the map was written and a write fails, re-fetch it, fix the map, and retry once.

## Each run
1. Understand the task from what I said and from the conversation so far:
   - Title: short, starts with a verb, in the language I used.
   - Client: the client I named. If I named none, use the client this conversation is about. Match against my client pages in wiki/work/ppg/clients/ and take that page's Notion link. If two clients fit, or none does, ask me one short question. Never attach a task to a guessed client. A task with no client at all (an internal task) is allowed when I say so.
   - Due date: only if I gave one ("tomorrow", "by Thursday", a date). Turn it into a real date from today's date. No date given means no date set.
   - Priority: only if I signalled it ("urgent", "when you have time"). Otherwise leave the database default, or the middle option if there is no default.
2. Fill the fields from the map: title, client link, status = the "open" option, owner = my team profile, owner person = me, role = my role, and due date and priority when known. Put any extra detail I gave into the page body, not into the title.
3. If the task is for someone else ("task for Dana to..."), set that person as owner instead: find their team profile and their Notion user. If I cannot be sure who is meant, ask.
4. Create it. If the database has a default template and the tool supports creating from a template, use it.
5. Mirror it in the vault: one row in _tasks.md under ### PPG with the client linked and the Notion link in Notes, and one line under "Open tasks" on the client page.
6. Answer with one line: the title, the client, the due date if any, and the link to the Notion page.

## Rules
- One task per thing to do. If I listed three things, create three tasks and show three links.
- Do not ask me to confirm a task that is clear. Ask only when the client or the owner is ambiguous.
- Before creating, check my open tasks on that client for the same thing. If it already exists, tell me and link it instead of creating a duplicate.
- If Notion is not connected, say so, write the task to _tasks.md only, and mark it "not in Notion yet".
