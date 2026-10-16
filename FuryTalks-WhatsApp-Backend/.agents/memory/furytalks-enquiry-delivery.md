---
name: FuryTalks enquiry delivery
description: Durable rule for how the FuryTalks website hands inquiries to WhatsApp.
---

FuryTalks forms use browser-side WhatsApp click-to-chat. Visitors review the prefilled message and press Send themselves. Do not use the WhatsApp Business Cloud API or store inquiries in a database.

**Why:** The user explicitly chose manual sending and prohibited an API or database for this site.

**How to apply:** Preserve this handoff on both Register Interest and Apply to Speak forms unless the user changes the project rule.
