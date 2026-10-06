---
name: my-tasks
description: Shows my open tasks from the company's task database in Notion, grouped by client and sorted by what needs attention first, and updates or closes them when I say so. Triggers on "/my-tasks", "my tasks", "what do I have open", "what's on my plate", "check my tasks", "mark it done", "close the task", "המשימות שלי", "מה פתוח אצלי", "מה יש לי היום", "סגור את המשימה".
---

# /my-tasks

Reads my tasks from Notion and keeps my vault in step with them. "I" and "me" mean the user. Reply in Hebrew, short.

## Reading
1. Use the "Task field map" in wiki/work/ppg/software/notion.md. If it is missing, build it the way /add-task describes, then continue.
2. Get my open tasks: tasks that are not completed where I am the owner, plus open tasks on my clients that have no owner.
   - Database queries can have a usage limit shared by the whole company. Prefer the cheap road: fetch my team profile and each of my client pages, and follow their task links, newest first. Use one filtered query only if that road is not enough. If a query says the limit is reached, do not retry: use fetch, and say the list may be incomplete.
3. Show one table, most urgent first: overdue, then due today, then stuck or escalated, then due this week, then the rest. Columns: task, client, due, status, a few words of the latest update. Each task name is a link to its Notion page. Above the table, one line: how many open, how many overdue, how many stuck.
4. If I named a client ("my tasks for <client>"), show only that client.
5. Bring the vault in step: add tasks that are in Notion but not in _tasks.md, move to Done the ones Notion shows as completed, and refresh "Open tasks" on each client page touched. Report the changes in one line.

## Updating (only when I ask)
- "Done" / "close it": set the status to its completed option, and set the completion date if the database has such a field. Then move the row to Done in _tasks.md.
- "Stuck": set the stuck option and write my reason into the update field. If I said to escalate, set the escalation flag.
- "Push it to Sunday", "make it urgent", "update: ...": change the due date, the priority, or the update text.
- If "it" could be more than one task, ask which. Never close a task I did not clearly point at.
- After any change, one line: what changed, with the link.

## Rules
- Notion is the source of truth for company tasks. The vault copy follows it, never the other way round.
- Never delete a task. Closing means the completed status.
- Tasks that live only in my vault and were never in Notion are mine alone: list them under a separate short heading, and do not push them to Notion unless I ask.
