---
name: start-day
description: My morning brief on one screen, what is due today, what is overdue or stuck, who is waiting for my answer in Slack and email, and which client meetings I have, ending with a suggested order for the day. Triggers on "/start-day", "start my day", "good morning", "what's my day", "plan my day", "morning brief", "בוקר טוב", "מה יש לי היום", "תתחיל לי את היום", "תכנן לי את היום".
---

# /start-day

One screen that tells me what today is. "I" and "me" mean the user. Reply in Hebrew, short.

## Gather
1. Read _active.md first. If the last session left an "UNFINISHED" block, that is line one of the brief.
2. Tasks: run the reading part of /my-tasks. Keep overdue, due today, stuck and escalated.
3. Slack: run /slack-catchup for the time since my last catch-up, and keep only its "Waiting for me" part.
4. Email: unread messages from the last working day that come from a client contact (the contacts are on my client pages) or from my manager. Sender, subject, one line. Do not open anything else.
5. Meetings: if a calendar tool is connected, today's meetings. If not, today's client meetings from the meetings database in Notion. For each meeting with a client, one line on the last thing that was decided with them.

## Give me
Exactly this, and nothing longer than one screen:
1. Today in one sentence.
2. "Must happen today": at most 5 items, each with its client and a link.
3. "Waiting for my answer": people, oldest first.
4. "Meetings": time, client, the one line.
5. "Suggested order": a numbered list for the day, the hardest or most blocking thing first.
Then ask one question: which of these should I start for you now.

## Rules
- Read only. This skill changes nothing in Notion, Slack or email. The only writes are the vault sync that /my-tasks does and today's calendar note.
- If a tool is not connected, skip its part and say which part is missing, in one line at the end.
- The first working day after a weekend looks back to the last working day, not 24 hours. The weekend is Friday and Saturday.
- Do not pad. An empty section is left out.
