---
name: slack-catchup
description: Reads everything that happened in my Slack since I last looked (my client channels, my direct messages, every mention of me) and gives me one short digest per client with what needs my answer, then saves the facts and tasks it found. Triggers on "/slack-catchup", "catch me up on Slack", "what did I miss", "read my Slack", "anything new in Slack", "what's waiting for me", "מה פספסתי", "תעדכן אותי בסלאק", "מה חדש בסלאק", "מי מחכה לי".
---

# /slack-catchup

Reads my Slack so I do not have to scroll it. "I" and "me" mean the user. Reply in Hebrew, short.

## What to read
1. The window: from the time of my last catch-up, which is written in wiki/work/ppg/operations/slack-catchup-log.md. No log yet means the last 24 hours. If I gave a window ("since Thursday", "today"), use mine. Never go back more than 14 days in one run: say so and offer to continue.
2. The places, in this order:
   - Every mention of me, anywhere.
   - My direct messages and group messages.
   - The channel of each of my clients. The channel IDs are on my client pages in wiki/work/ppg/clients/. A client page with no channel: search Slack for a channel named after the client, and write the ID into the page once found.
   - Company-wide channels I am in, only for messages that name me or one of my clients.
3. Read whole threads, not just the first message. A reply inside a thread is where decisions usually are.
4. Slack is large. Read my mentions and direct messages completely. For channels, read what falls inside the window, and if a channel has more than about 200 messages in it, read the newest and tell me that the older part was skipped.

## What to give me
One digest, in this order, nothing else:
1. "Waiting for me": every message that asks me something or needs my action and that I have not answered. Who, where, what they need, a link. Oldest first.
2. Per client, only clients where something happened: 2-4 lines of what happened and what was decided, with links.
3. "Good to know": at most 5 lines of things that do not need action.
If nothing happened, say that in one line.

## What to save
- A decision, a number, a date, a change of plan about a client: write it into that client's page, with the date and a link to the message.
- Something I now need to do: offer the list as tasks, and create the ones I approve with /add-task. Do not create tasks without asking, a catch-up can produce many.
- Update slack-catchup-log.md: the time this run covered up to, and one line per client touched.

## Rules
- Read only. Never send, react, edit, or mark anything as read.
- If I ask for a reply, write a draft and show it to me. Send only after I say "send", and only that exact text.
- Quote people accurately. If a message is unclear, say it is unclear, do not interpret it.
- Private conversations stay private: do not copy the content of a direct message into a client page unless it is about that client's work.
