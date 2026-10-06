---
name: client-brief
description: Everything about one client on one screen before a meeting or a decision, the account facts, what is open, what was said recently in Slack and email, what the last meetings decided, and what I should raise. Triggers on "/client-brief", "brief me on <client>", "prepare me for the meeting with <client>", "what's going on with <client>", "status of <client>", "תכין אותי לפגישה עם", "מה המצב עם", "תן לי תמונת מצב על".
---

# /client-brief

Prepares me on one client. "I" and "me" mean the user. Reply in Hebrew, short.

## Which client
The one I named. Match it to a page in wiki/work/ppg/clients/. If I named none and the conversation is about one, use that. If it is not one of my clients, there is no page: tell me who runs it (from the "Other clients" table) and ask if I still want a brief built from Notion.

## Gather
1. The client page in my vault: facts, targets, budget, people, what I have told you about them over time.
2. Notion: the client's page, its open tasks, and the last 3 meetings with their summaries. Fetch pages, do not run queries when a fetch will do.
3. Slack: the client's channel, last 14 days. Decisions, open questions, anything tense.
4. Email: the last 14 days with the client's contacts. Subjects and what they asked.
5. Numbers: if a Toffu connector for this client is connected, ask it for this month so far against the monthly target, and the last 7 days against the 7 before. If it is not connected, do not invent numbers: say "no live numbers" and point me to the client's report link.

## Give me
One screen:
1. Who they are, in two lines: what they sell, who we talk to, who the team lead is.
2. Where the account stands: the numbers if you have them, against the target.
3. Open with us: tasks, oldest and stuck first.
4. What they asked for recently and whether it was answered.
5. What was decided last time and whether it happened.
6. "Raise in the meeting": 3 to 5 points, the uncomfortable ones included.

## After
- Save the brief as wiki/work/ppg/clients/<client>-brief-YYYY-MM-DD.md and link it from the client page.
- Anything new and durable you learned about the client goes into the client page itself, not only into the brief.
- Offer to turn "Raise in the meeting" into tasks.

## Rules
- Read only, in every tool.
- Every claim about what someone said carries a link to where they said it.
- If two sources disagree (a target in the sheet, another in Notion), show both and say which is newer.
