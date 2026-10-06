# ORBIT: a fan passport app

A clickable, bilingual (English / Thai) prototype of a fan-club app for a recording artist. Fans earn **Stardust** by showing up (attending events, scanning in, completing missions, inviting friends), climb six levels, and spend it on drops, rooms and experiences. Stardust can only be earned: it is never sold, bought or converted to cash.

> **Portfolio copy.** The artist ("Kai Rivera"), platform ("Fanframe"), songs, venues, merch and fans are all fictional.

## What's in it

- **Passport & levels:** Spark → Glow → Beam → Radiant → Luminary → Constellation, unlocked by lifetime Stardust so spending never drops your level.
- **20+ screens:** feed, news, events and check-in scanning, missions, shop and product drops, live stream, rooms, community, invites and referrals, premium tier, and an artist "twin" chat.
- **Full EN/TH localisation:** every string ships in both languages, with Noto Sans Thai typography.
- **Compliance by design:** a vocabulary guardrail keeps money and gambling language out of fan-facing copy, enforced by an automated audit.

## Run it

Open `index.html` in a browser. No build step, no install, no server.

## Checks

```bash
bash tools/check.sh          # compliance, i18n coverage, content-pack sync, route test
npm install && node tools/browser-suite.js   # Playwright end-to-end suite
```

## Stack

Vanilla HTML/CSS/JS single-file app · hash routing · localStorage state · Node audit scripts · Playwright

Built by [Isaac Ho](https://github.com/isaacsplash18).
