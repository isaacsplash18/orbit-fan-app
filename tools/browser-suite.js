#!/usr/bin/env node
/* Full-journey browser suite: every PRD §7 feature end to end, plus the
   editorial surfaces adopted from the Velocity Black study and the trust,
   emotion and parity fixes from the Aug 2026 critique pass.
   Run:  node tools/browser-suite.js
   Needs playwright or playwright-core (npm i -D playwright installs a browser).
   Env overrides: CHROMIUM_PATH (executable), BROWSER_PROXY (proxy server URL).
   Static checks (tools/check.sh) do not replace this; this does not replace
   clicking through the page yourself. */
const path = require('path');

let chromium;
try { ({ chromium } = require('playwright')); }
catch (e) {
  try { ({ chromium } = require('playwright-core')); }
  catch (e2) { console.error('Install playwright first: npm i -D playwright'); process.exit(2); }
}

const results = [];
function check(name, ok, detail = '') {
  results.push({ name, ok });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`);
}

(async () => {
  const launch = {};
  if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
  if (process.env.BROWSER_PROXY) launch.proxy = { server: process.env.BROWSER_PROXY };
  const browser = await chromium.launch(launch);
  const page = await browser.newPage({ viewport: { width: 400, height: 860 }, ignoreHTTPSErrors: true });
  const consoleErrors = [];
  page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('pageerror', e => consoleErrors.push('pageerror: ' + e.message));

  const indexPath = path.resolve(__dirname, '..', 'index.html');
  await page.goto('file://' + indexPath);
  await page.waitForTimeout(800);

  const st = async () => page.evaluate(() => ({ ...STATE }));

  // P1 sign-in
  check('signin visible first', await page.locator('#page-signin').isVisible());
  await page.click('text=Continue with Google');
  // The welcome grant fires at 420ms and its figure lives for 1500ms, so the
  // presentation is sampled inside that window before the state checks.
  await page.waitForTimeout(700);
  // --- celebration rationing (Aug 2026) ----------------------------------
  // The welcome grant lands in place: the meter pulses, a small figure rises
  // out of it, and the full-screen burst never opens.
  const welcome = await page.evaluate(() => ({
    burstOpen: document.querySelector('#burst').classList.contains('on'),
    pulsing: document.querySelector('#meterBtn').classList.contains('pulse'),
    rise: (document.querySelector('.earn-rise') || {}).textContent || '',
    inMeter: !!document.querySelector('#meterBtn .earn-rise'),
    toast: (document.querySelector('.toast') || {}).textContent || ''
  }));
  check('the welcome grant does not take the screen',
    welcome.burstOpen === false, JSON.stringify(welcome));
  check('the welcome grant rises in place, out of the meter it changes',
    welcome.pulsing && welcome.inMeter && /^\+10$/.test(welcome.rise.trim()),
    JSON.stringify(welcome));
  check('the words arrive as a toast, not as a takeover',
    /Welcome in/i.test(welcome.toast) && /Orbiter/i.test(welcome.toast), welcome.toast);
  await page.waitForTimeout(1600);
  check('the risen figure clears itself', await page.locator('.earn-rise').count() === 0);
  check('feed after sign-in', await page.locator('#page-feed').isVisible());
  let s = await st();
  // The state math is unchanged by the quieter presentation.
  check('welcome grant in ledger', s.ledger.some(l => l.kind === 'earn'), `balance=${s.balance} lifetime=${s.lifetime}`);
  check('the welcome grant is still exactly +10, spendable and lifetime',
    s.balance === 35 && s.lifetime === 260, `balance=${s.balance} lifetime=${s.lifetime}`);
  const startBal = s.balance;
  check('feed renders 12+ items', await page.locator('#feedList > *').count() >= 12);

  // --- the editorial rebuild (Aug 2026) -----------------------------------
  // The feed is an edition, not a card stack: no feed item carries a card's
  // border or radius, whether or not it has a photograph.
  const boxed = await page.evaluate(() => [...document.querySelectorAll('#feedList .feed-item')]
    .filter(el => {
      const cs = getComputedStyle(el);
      return cs.borderTopWidth !== '0px' || cs.borderTopLeftRadius !== '0px' ||
             !['rgba(0, 0, 0, 0)', 'transparent'].includes(cs.backgroundColor);
    }).length);
  check('no feed item is a card (no border, radius or panel fill)', boxed === 0, `boxed=${boxed}`);

  // Media-wired items render full-bleed with an on-photo title and one mono line
  const edUnits = await page.locator('#feedList .fi-ed-media').count();
  check('media feed items render as full-bleed editorial units', edUnits >= 2, `${edUnits} units`);
  check('editorial units carry the on-photo voice plus one mono line',
    await page.locator('#feedList .fi-ed-cap .on-photo').count() === edUnits &&
    await page.locator('#feedList .fi-ed-cap .on-photo-m').count() === edUnits);
  const bleed = await page.evaluate(() => {
    const r = document.querySelector('#feedList .fi-ed-media .slot').getBoundingClientRect();
    const stage = document.querySelector('.device').getBoundingClientRect();
    return Math.round(r.width - stage.width);
  });
  check('editorial units run the full width of the stage', bleed === 0, `delta=${bleed}px`);

  // Every default MEDIA key is wired and actually paints an <img>
  const wired = await page.evaluate(() => Object.keys(MEDIA_DEFAULTS)
    .map(k => [k, MEDIA[k]]).filter(([, v]) => !v).map(([k]) => k));
  check('all five MEDIA defaults are wired', wired.length === 0, wired.join(','));
  check('a wired key paints a real image, not a slot frame',
    await page.locator('#feedList .slot-shot').count() >= 2 &&
    await page.locator('#feedList .slot-empty').count() === 0);
  // ...and it is decoded on arrival, not one frame late (preload + sync decode)
  const undecoded = await page.evaluate(() =>
    [...document.querySelectorAll('.slot-shot')].filter(i => !i.complete || !i.naturalWidth).length);
  check('wired images are decoded before paint, no empty-slot blink', undecoded === 0, `undecoded=${undecoded}`);
  // ...and unfilled keys still collapse without a trace
  check('unfilled media keys still collapse', await page.evaluate(() => {
    const empty = Object.keys(MEDIA).filter(k => !MEDIA[k]);
    return empty.length > 5 && document.querySelectorAll('#feedList .slot-empty').length === 0;
  }));
  // a filled fan-facing photograph never offers an editing control
  check('no clear-slot control outside artist mode',
    await page.locator('#feedList .slot-clear').count() === 0);

  // free item opens fully
  await page.evaluate(() => { const f = CONTENT.feed.find(x => x.access === 'free'); location.hash = '#/item/' + f.id; });
  await page.waitForTimeout(400);
  check('free item detail opens', await page.locator('#page-item').isVisible() && (await page.locator('#itemView').innerText()).length > 40);

  // song story unlock end to end
  await page.evaluate(() => { const f = CONTENT.feed.find(x => x.access === 'stardust'); window.__unlockId = f.id; location.hash = '#/item/' + f.id; });
  await page.waitForTimeout(400);
  await page.evaluate(() => askUnlock(window.__unlockId));
  await page.waitForTimeout(300);
  await page.locator('#sheetBox button.btn-primary').first().click();
  await page.waitForTimeout(1300);
  s = await st();
  check('unlock deducts 5 Stardust', s.balance === startBal - 5, `balance ${startBal}→${s.balance}`);
  check('unlock is permanent in state', s.unlocked.includes(await page.evaluate(() => window.__unlockId)));
  check('level unchanged by spend', s.lifetime >= 260, `lifetime=${s.lifetime}`);
  check('unlocked story visible', (await page.locator('#itemView').innerText()).length > 60);
  check('spend entry in ledger', s.ledger.some(l => l.kind === 'spend'));

  // P3 stardust passport
  await page.click('#meterBtn');
  await page.waitForTimeout(500);
  check('stardust passport opens', await page.locator('#page-stardust').isVisible());
  // Five badges since the Circle shipped: three already earned, the showcase
  // one earned live by scanning in, and the Circle contest one, which is
  // locked until a contest win is ratified.
  check('badge case shows 5 badges', await page.locator('#badgeGrid > *').count() === 5);
  check('ledger list non-empty', await page.locator('#ledgerList > *').count() >= 3);

  // P4 scan
  await page.click('a[data-tab="scan"]');
  await page.waitForTimeout(400);
  // Cool Rim's one lane: the scan page is the only place it belongs, and the
  // only place it was missing before the Aug 2026 fix pass.
  const coolRim = await page.evaluate(() => {
    const cs = getComputedStyle(document.querySelector('.scan-corner'));
    const line = getComputedStyle(document.querySelector('.scan-line'));
    return { corner: cs.borderTopColor, sweep: line.backgroundImage };
  });
  check('scan viewfinder carries Cool Rim brackets and sweep',
    coolRim.corner === 'rgb(132, 185, 198)' && coolRim.sweep.includes('132, 185, 198'),
    coolRim.corner);
  check('no QR is shown to the fan; the plate is a viewfinder',
    await page.locator('#page-scan .scan-qr').count() === 0 &&
    await page.locator('#page-scan .scan-dark').count() === 1);
  check('one primary action, code field as the fallback below it',
    await page.locator('#page-scan .btn-primary').count() === 1 &&
    await page.locator('#page-scan .code-in input').count() === 1);
  // the demo shortcut is a chip, not a second primary button
  check('simulate scan hides behind a demo affordance',
    await page.locator('#page-scan .scan-demo').count() === 1 &&
    !/simulate/i.test(await page.locator('#page-scan .btn-primary').innerText()));
  // pre-claim copy promises without naming the price of the night
  const scanTxt = await page.locator('#page-scan').innerText();
  check('pre-claim scan copy promises without pricing',
    /code at the door/i.test(scanTxt) && !/\bworth\b/i.test(scanTxt) && !/\d+\s*Stardust/i.test(scanTxt),
    scanTxt.replace(/\n/g, ' | ').slice(0, 160));
  const preScan = (await st()).balance;
  await page.fill('#codeIn', 'FANFRAME-DEMO-2026');
  await page.click('button:has-text("Check in")');
  await page.waitForTimeout(1600);
  s = await st();
  check('scan grants +25', s.balance === preScan + 25, `${preScan}→${s.balance}`);
  const liveBadge = await page.evaluate(() => CONTENT.events.find(e => e.status === 'live').badgeId);
  check('event badge awarded', s.badges.includes(liveBadge));
  await page.evaluate(() => { try { closeBurst(); closeSheet(); } catch (e) {} });
  await page.waitForTimeout(400);
  // The code field is gone once the night is claimed, so the dupe guard is
  // driven straight at submitCode() rather than through a field that has
  // correctly stopped asking.
  await page.evaluate(() => { document.querySelector('#codeIn').value = 'FANFRAME-DEMO-2026'; submitCode(); });
  await page.waitForTimeout(900);
  s = await st();
  check('no double award on rescan', s.balance === preScan + 25, `balance=${s.balance}`);
  await page.evaluate(() => { try { closeBurst(); } catch (e) {} });
  await page.waitForTimeout(300);
  const afterScanTxt = await page.locator('#page-scan').innerText();
  check('after claiming, the page swaps state and the stale reward line is gone',
    /checked in/i.test(afterScanTxt) && !/code at the door/i.test(afterScanTxt) &&
    await page.locator('#page-scan .btn-primary').isHidden(),
    afterScanTxt.replace(/\n/g, ' | ').slice(0, 140));
  // The peak of the pitch does not end on an empty lens. The badge that was
  // just earned is on the screen that earned it, at badge-case scale, the
  // camera caption is gone, and two doors lead out of the moment.
  check('the claimed viewfinder shows the earned badge at badge-case scale',
    await page.locator('#scanClaim').isVisible() &&
    await page.locator('#scanClaim .bic .bsvg').count() === 1 &&
    await page.evaluate(() => {
      const a = getComputedStyle(document.querySelector('#scanClaim .bic')).width;
      document.querySelector('#page-stardust');
      return a === '52px';
    }) &&
    (await page.locator('#scanClaimN').innerText()).length > 2);
  check('the camera-preview caption leaves with the camera',
    await page.locator('#scanHint').isHidden() &&
    !/camera preview/i.test(afterScanTxt));
  check('the claimed scan offers the passport and the feed',
    await page.locator('#scanNext a[href="#/stardust"]').isVisible() &&
    await page.locator('#scanNext a[href="#/feed"]').isVisible());
  // ...and the 400px of dead viewfinder is gone with it
  const claimedH = await page.evaluate(() =>
    Math.round(document.querySelector('#scanFrame').getBoundingClientRect().height));
  check('the claimed plate is not 400px of nothing', claimedH < 240, `${claimedH}px`);

  // P5 referral
  await page.evaluate(() => go('invite'));
  await page.waitForTimeout(400);
  check('member card renders', (await page.locator('#passCard').innerText()).length > 10);
  const preRef = s.balance;
  await page.evaluate(() => simulateFriend());
  await page.waitForTimeout(1400);
  s = await st();
  check('referral grants +15', s.balance === preRef + 15, `${preRef}→${s.balance}`);
  check('no wallet wording on invite page', !(await page.locator('#page-invite').innerText()).toLowerCase().includes('wallet'));

  // P6 artist upload
  await page.evaluate(() => { try { closeBurst(); } catch (e) {} });
  await page.click('#artistToggle');
  await page.waitForTimeout(500);
  check('artist mode opens', await page.locator('#page-artist').isVisible());
  const postsBefore = await page.evaluate(() => STATE.posts.length);
  await page.fill('#capIn', 'Soundcheck, then you. Tonight.');
  await page.evaluate(() => setTag('exclusive'));
  await page.click('text=Post to the feed');
  await page.waitForTimeout(900);
  check('artist post created', await page.evaluate(() => STATE.posts.length) === postsBefore + 1);
  await page.click('text=See it in the feed');
  await page.waitForTimeout(600);
  const firstCard = await page.locator('#feedList > *').first().innerText();
  check('post appears atop feed, locked', firstCard.includes('Soundcheck') && /premium|member|exclusive/i.test(firstCard));

  // P7 shop
  await page.click('a[data-tab="shop"]');
  await page.waitForTimeout(400);
  check('shop grid 6 items', await page.locator('#shopGrid > *').count() === 6);
  check('level-gate copy present', /level 3/i.test(await page.locator('#page-shop').innerText()));
  // The Earned Light Rule: a price is money, and money is never gold.
  const priceColors = await page.evaluate(() =>
    [...document.querySelectorAll('#shopGrid .sp-p')].map(el => getComputedStyle(el).color));
  check('shop prices render in ember, never gold',
    priceColors.length === 6 && priceColors.every(c => c === 'rgb(232, 112, 95)'),
    priceColors[0]);
  // One display currency across the app: baht, at the render layer, with the
  // pack still carrying plain sample numbers.
  const cur = await page.evaluate(() => ({
    shop: [...document.querySelectorAll('#shopGrid .sp-p')].map(e => e.textContent),
    sym: DISPLAY_CUR
  }));
  check('shop prices display in THB placeholder, no SGD left',
    cur.sym === '\u0e3f' && cur.shop.every(p => p.includes('\u0e3f')) &&
    !cur.shop.some(p => /S\$|SGD/.test(p)), cur.shop.join(' '));
  await page.evaluate(() => { location.hash = '#/product/' + CONTENT.shop[0].id; });
  await page.waitForTimeout(400);
  await page.evaluate(() => openCheckout(CONTENT.shop[0].id));
  await page.waitForTimeout(400);
  const sheetTxt = await page.locator('#sheetBox').innerText();
  check('checkout asks name+shipping (progressive capture)', /name/i.test(sheetTxt) && /(ship|address)/i.test(sheetTxt));
  // Ceremony: an order reads as an order before it reads as a form.
  check('checkout shows item, price, shipping, total, delivery and the demo line',
    /item/i.test(sheetTxt) && /shipping/i.test(sheetTxt) && /total/i.test(sheetTxt) &&
    /working days/i.test(sheetTxt) && /demo checkout, no payment taken/i.test(sheetTxt),
    sheetTxt.replace(/\n/g, ' | ').slice(0, 220));
  check('checkout total is item plus shipping, and the button names it', await page.evaluate(() => {
    const s = CONTENT.shop[0];
    const box = document.querySelector('#sheetBox').innerText;
    return box.includes(money(s.price + SHIP_FLAT)) && /demo/i.test(box);
  }));
  // A money action is ember, a Stardust action is gold — never the other way round
  check('money actions are ember, Stardust actions are gold',
    await page.locator('#sheetBox .btn-ember').count() === 1 &&
    await page.locator('#sheetBox .btn-primary').count() === 0);
  // A sheet is never a trap. On the smallest phone in circulation, and with
  // the keyboard's worst case simulated by a focused field, the box scrolls
  // inside itself and the Pay button rides the bottom as a sticky footer.
  await page.setViewportSize({ width: 320, height: 568 });
  await page.waitForTimeout(300);
  const trap = await page.evaluate(() => {
    const box = document.querySelector('#sheetBox');
    const cs = getComputedStyle(box);
    const btn = box.querySelector('.btn-ember');
    const seen = () => { const r = btn.getBoundingClientRect();
      return r.top >= 0 && r.bottom <= window.innerHeight + 1; };
    const before = seen();
    document.querySelector('#ckName').focus();
    box.scrollTop = box.scrollHeight;
    return { scrolls: box.scrollHeight > box.clientHeight,
             chains: cs.overscrollBehaviorY !== 'contain',
             sticky: getComputedStyle(box.querySelector('.sheet-actions')).position === 'sticky',
             before, after: seen() };
  });
  check('the checkout sheet scrolls and keeps Pay on screen at 320x568',
    trap.scrolls && !trap.chains && trap.sticky && trap.before && trap.after,
    JSON.stringify(trap));
  await page.setViewportSize({ width: 400, height: 860 });
  await page.waitForTimeout(300);
  const preBuy = (await st()).balance;
  // The order is actually placed, name and shipping and all, so everything
  // downstream of a real purchase (the Ordered chip, the Orders list) is
  // exercised rather than assumed.
  await page.fill('#ckName', 'Ploy S');
  await page.fill('#ckAddr', '14 Charoen Krung Soi 30');
  await page.evaluate(() => payNow(CONTENT.shop[0].id));
  await page.waitForTimeout(800);
  s = await st();
  check('purchase grants zero Stardust', s.balance === preBuy, `balance=${s.balance}`);
  check('the order is recorded, not just toasted',
    s.orders.includes(await page.evaluate(() => CONTENT.shop[0].id)) &&
    s.orderLog.length === 1 && s.orderLog[0].total > 0 && !!s.orderLog[0].date,
    JSON.stringify(s.orderLog));
  await page.evaluate(() => { try { closeSheet(); closeBurst(); } catch (e) {} });

  // P8 events
  await page.click('a[data-tab="events"]');
  await page.waitForTimeout(400);
  check('3 events listed', await page.locator('#eventList .ev').count() >= 3);
  // Future first; what already happened sinks under a rule and reads dimmer.
  const evOrder = await page.evaluate(() => [...document.querySelectorAll('#eventList .ev')]
    .map(el => el.classList.contains('ev-past')));
  check('future events sort above past ones',
    evOrder.indexOf(true) === -1 || evOrder.slice(evOrder.indexOf(true)).every(Boolean),
    evOrder.join(','));
  check('past events sink below a rule and render dimmed',
    await page.locator('#eventList .ev-past-head').count() === 1 &&
    Number(await page.evaluate(() => getComputedStyle(document.querySelector('.ev-past')).opacity)) < 1);
  // A night already claimed stops asking to be claimed.
  const liveRow = await page.evaluate(() => {
    const live = CONTENT.events.find(e => e.status === 'live');
    const row = [...document.querySelectorAll('#eventList .ev')]
      .find(el => el.innerText.toLowerCase().includes(live.name.en.toLowerCase()));
    return { scanned: STATE.scanned.indexOf(live.scanCode) !== -1,
             text: row ? row.innerText.replace(/\n/g, ' | ') : null };
  });
  check('a checked-in event states the check-in instead of offering it again',
    liveRow.scanned && liveRow.text && !/scan in/i.test(liveRow.text) && /checked in/i.test(liveRow.text),
    JSON.stringify(liveRow).slice(0, 200));

  // P8b event detail — the adopted detail body grammar, end to end.
  // Tested on an event with no photograph: where a hero exists the picture
  // carries the eyebrow and the title, by design (editorial rebuild, Aug 2026).
  await page.evaluate(() => {
    location.hash = '#/event/' + CONTENT.events.find(e => !MEDIA[e.id]).id;
  });
  await page.waitForTimeout(400);
  check('event detail body grammar (eyebrow, line, lead-ins, closer)',
    await page.locator('#eventView .d-eyebrow').count() === 1 &&
    await page.locator('#eventView .d-line').count() === 1 &&
    await page.locator('#eventView .d-lead').count() >= 2 &&
    await page.locator('#eventView .d-closer').count() === 1);

  // the event that does have one renders as a full-bleed hero on both surfaces
  await page.evaluate(() => { location.hash = '#/event/event-02'; });
  await page.waitForTimeout(500);
  check('media event detail is a full-bleed hero with an on-photo title',
    await page.locator('#eventView .detail-media.dm-hero .slot-shot').count() === 1 &&
    await page.locator('#eventView .dm-hero-cap .on-photo').count() === 1 &&
    await page.locator('#eventView .dm-hero-cap .on-photo-m').count() === 1);
  await page.evaluate(() => go('events'));
  await page.waitForTimeout(500);
  check('media event list card is full-bleed, not a card',
    await page.locator('#eventList .fi-ed-media .slot-shot').count() === 1 &&
    await page.evaluate(() => {
      const el = document.querySelector('#eventList .fi-ed-media .slot');
      const cs = getComputedStyle(el);
      return cs.borderTopWidth === '0px' && cs.borderTopLeftRadius === '0px';
    }));

  // long-form story layout: subheads, no card chrome, empty slots collapse
  await page.evaluate(() => {
    const f = CONTENT.feed.find(x => x.story && x.story.length);
    if (!STATE.unlocked.includes(f.id)) STATE.unlocked.push(f.id);
    save(); location.hash = '#/item/' + f.id;
  });
  await page.waitForTimeout(400);
  check('story layout renders subhead blocks with no card chrome',
    await page.locator('#itemView .story-h').count() >= 3 &&
    await page.locator('#itemView .story-block .card').count() === 0);
  check('unfilled story media slots collapse', await page.locator('#itemView .story-media').count() === 0);

  // An unfilled slot leaves no trace outside artist mode, its label included.
  const pendingSeen = await page.evaluate(async () => {
    const seen = [];
    const ids = CONTENT.feed.map(f => f.id);
    for (const id of ids) {
      if (!STATE.unlocked.includes(id)) STATE.unlocked.push(id);
    }
    STATE.premium = true; save();
    for (const id of ids) {
      location.hash = '#/item/' + id;
      await new Promise(r => setTimeout(r, 60));
      const txt = document.querySelector('#itemView').innerText;
      if (/photo to come|ภาพจะตามมา/i.test(txt)) seen.push(id);
    }
    location.hash = '#/shop';
    await new Promise(r => setTimeout(r, 80));
    for (const s of CONTENT.shop) {
      location.hash = '#/product/' + s.id;
      await new Promise(r => setTimeout(r, 60));
      if (/photo to come/i.test(document.querySelector('#productView').innerText)) seen.push(s.id);
    }
    return seen;
  });
  check('no "photo to come" tag anywhere in the fan view', pendingSeen.length === 0, pendingSeen.join(','));
  check('no placeholder tag element survives on a fan surface',
    await page.locator('#itemView .placeholder-tag, #productView .placeholder-tag').count() === 0);

  // An unlocked reading with no photograph pays out in type, not in nothing.
  await page.evaluate(() => {
    const f = CONTENT.feed.find(x => x.story && x.story.length);
    location.hash = '#/item/' + f.id;
  });
  await page.waitForTimeout(400);
  check('a reading with no photograph is set generously, with a pull-quote and an end mark',
    await page.locator('#itemView .story.reading').count() === 1 &&
    await page.locator('#itemView .d-pull').count() === 1 &&
    await page.locator('#itemView .d-end').count() === 1);
  // ...and a video whose footage has not landed closes on a plate, not nothing
  await page.evaluate(() => {
    const f = CONTENT.feed.find(x => x.type === 'video' && !MEDIA[x.mediaKey]);
    location.hash = '#/item/' + f.id;
  });
  await page.waitForTimeout(400);
  check('a video with no media opens on a quiet watching plate',
    await page.locator('#itemView .plate .plate-t').count() === 1 &&
    await page.locator('#itemView .plate .plate-m').count() === 1);
  // The plate takes the photograph's job, so it also takes its rule: the
  // title is stated once, on the plate, and never repeated below it.
  check('the watching plate states the title once, like a hero would',
    await page.locator('#itemView h1.title').count() === 0 &&
    await page.locator('#itemView .d-eyebrow').count() === 0 &&
    await page.evaluate(() => {
      const f = CONTENT.feed.find(x => x.type === 'video' && !MEDIA[x.mediaKey]);
      const txt = document.querySelector('#itemView').innerText;
      const name = f.title.en;
      return txt.toLowerCase().split(name.toLowerCase()).length - 1 === 1;
    }));
  const plateBleed = await page.evaluate(() => Math.round(
    document.querySelector('#itemView .plate').getBoundingClientRect().width -
    document.querySelector('.device').getBoundingClientRect().width));
  check('the plate runs the full width of the stage, framed by it', plateBleed === 0, `delta=${plateBleed}px`);

  // Empty rail tiles say the name once, on the tile, never twice
  await page.evaluate(() => { location.hash = '#/feed'; });
  await page.waitForTimeout(500);
  const railDupes = await page.evaluate(() => [...document.querySelectorAll('.rail-card')]
    .filter(c => c.querySelector('.rail-tile') && c.querySelector('.rail-n')).length);
  check('an unlit rail tile prints its title once, not twice', railDupes === 0, `dupes=${railDupes}`);

  // one editorial takeover in the feed, and only one
  await page.evaluate(() => { location.hash = '#/feed'; });
  await page.waitForTimeout(400);
  check('one editorial takeover in the feed', await page.locator('#feedList .takeover').count() === 1);

  // rail sizes: 66% standard, 88% on the one hero rail
  const railW = await page.evaluate(() =>
    Math.round(document.querySelector('.rail:not(.rail-hero) .rail-card').getBoundingClientRect().width));
  await page.evaluate(() => { location.hash = '#/premium'; });
  await page.waitForTimeout(500);
  const heroW = await page.evaluate(() =>
    Math.round(document.querySelector('#premRail .rail-hero .rail-card').getBoundingClientRect().width));
  check('rails size 66% standard / 88% hero', railW === 264 && heroW === 352, `${railW} / ${heroW}`);

  // a detail entered from a rail dismisses downward instead of stepping back
  await page.evaluate(() => { location.hash = '#/feed'; });
  await page.waitForTimeout(400);
  await page.locator('.rail a[href^="#/product/"]').first().click();
  await page.waitForTimeout(500);
  check('rail entry swaps the back link for a dismiss',
    await page.locator('#page-product .dismiss').isVisible() &&
    !(await page.locator('#productBack').isVisible()));
  await page.locator('#page-product .dismiss').click();
  await page.waitForTimeout(500);
  check('dismiss returns to the rail it came from', await page.locator('#page-feed').isVisible());

  // --- P8c the Circle (community, Sep 2026; rooms since 9 Sep) ------------
  // The belonging layer, converted from boards-and-threads to chat rooms on
  // Isaac's direction ("the community chat should be more of a chat than a
  // forum"). Four things are load-bearing and are read here rather than
  // assumed: the Circle costs the tab bar nothing, a room reads as a live
  // room (presence, a preview of the last line, a chat log the fan can speak
  // into), a community event is never mistaken for an official one, and
  // contest Stardust is earned once and can never be earned twice.
  await page.evaluate(() => { location.hash = '#/more'; });
  await page.waitForTimeout(400);
  check('the Circle is listed in the top run of More',
    await page.locator('#moreList .more-grp').first().locator('a[href="#/community"]').count() === 1);
  await page.locator('#moreList a[href="#/community"]').click();
  await page.waitForTimeout(450);
  check('the Circle opens from More', await page.locator('#page-community').isVisible());
  check('the tab bar is still five tabs and More is the one lit',
    await page.locator('#tabs .tab').count() === 5 &&
    await page.locator('.tab[data-tab="more"][aria-current="page"]').count() === 1);

  // the quiet entry from the feed, which is a link and not a sixth tab
  await page.evaluate(() => { location.hash = '#/feed'; });
  await page.waitForTimeout(450);
  check('the feed carries one quiet entry to the Circle',
    await page.locator('#feedList a[href="#/community"]').count() === 1);
  await page.locator('#feedList a[href="#/community"]').click();
  await page.waitForTimeout(450);
  check('the feed entry reaches the Circle', await page.locator('#page-community').isVisible());

  // seeded: three rooms with three seeded logs, listed as rooms and not as
  // boards of threads
  const cmSeed = await page.evaluate(() => ({
    rooms: CONTENT.community.rooms.length,
    logs: STATE.rooms.map(r => r.log.length).join(','),
    entries: document.querySelectorAll('#communityView .cm-room').length,
    ids: CONTENT.community.rooms.map(r => r.id).join(',')
  }));
  check('the Circle is seeded with 3 rooms and their chat logs',
    cmSeed.rooms === 3 && cmSeed.logs === '10,9,7' &&
    cmSeed.ids === 'rm-tonight,rm-projects,rm-newcomers', JSON.stringify(cmSeed));
  check('every room is one entry in the room list, linking to its own route',
    cmSeed.entries === 3 &&
    await page.locator('#communityView a[href^="#/room/"]').count() === 3);
  // the forum is gone: no thread route, no thread list entry, no new-thread
  // control anywhere in the app
  check('the forum constructs are retired — no thread route survives',
    await page.locator('a[href^="#/thread/"]').count() === 0 &&
    await page.locator('#page-thread').count() === 0 &&
    await page.evaluate(() => typeof askNewThread === 'undefined' &&
                              typeof renderThread === 'undefined' &&
                              typeof STATE.threads === 'undefined'));
  // each entry carries the three things a room list is for: the name, one
  // line of the last thing said with the handle in front of it, and the
  // quiet mono presence figure with a time beside it
  const cmRoomLine = await page.evaluate(() => {
    const a = document.querySelector('#communityView .cm-room');
    return {
      name: a.querySelector('.cm-room-t').innerText.trim(),
      prev: a.querySelector('.cm-room-x').innerText.trim(),
      meta: a.querySelector('.cm-room-m').innerText.trim(),
      mono: getComputedStyle(a.querySelector('.cm-room-m')).fontFamily,
      gold: getComputedStyle(a.querySelector('.cm-room-m')).color
    };
  });
  check('a room entry names the room, previews the last line with its handle, and counts who is here',
    /Tonight/i.test(cmRoomLine.name) &&
    /^Orbiter pim-1183: You saved my week\.$/.test(cmRoomLine.prev) &&
    // the mono line is uppercased by the counting voice, so it is read
    // case-insensitively here rather than asserting the transform's output
    /128 orbiters here/i.test(cmRoomLine.meta) && /\d\d:\d\d/.test(cmRoomLine.meta),
    JSON.stringify(cmRoomLine));
  check('the presence figure is quiet mono and never gold, and says once that it is invented',
    /Spline Sans Mono/.test(cmRoomLine.mono) && !/240, 195, 107/.test(cmRoomLine.gold) &&
    await page.locator('#communityView .demo-line').filter({ hasText: /invented for this demo/i }).count() === 1,
    cmRoomLine.mono + ' / ' + cmRoomLine.gold);
  const cmBoxed = await page.evaluate(() => [...document.querySelectorAll('#communityView .cm-room, #communityView .cm-item')]
    .filter(el => {
      const cs = getComputedStyle(el);
      return cs.borderTopWidth !== '0px' || cs.borderTopLeftRadius !== '0px' ||
             !['rgba(0, 0, 0, 0)', 'transparent'].includes(cs.backgroundColor);
    }).length);
  check('the room list is a run of entries, not a stack of cards', cmBoxed === 0, `boxed=${cmBoxed}`);
  // the moderation line stays on the room list, where the rule of the room
  // is stated
  check('the moderation line still sits at the foot of the room list',
    await page.locator('#communityView .note').filter({ hasText: /community guidelines/i }).count() === 1 &&
    /Kai's management team/.test(await page.locator('#communityView').innerText()));

  // --- community events are never mistaken for official ones ---------------
  const cmEvTxt = await page.locator('#communityView').innerText();
  check('every community meetup carries the community-run chip',
    await page.locator('#communityView .cm-item .chip').filter({ hasText: /Community run/i }).count() === 2,
    cmEvTxt.slice(0, 40));
  check('the Circle cross-links to the official events page',
    await page.locator('#communityView a[href="#/events"]').count() === 1 &&
    /events page/i.test(cmEvTxt));
  const officialEvents = await page.evaluate(() => CONTENT.events.map(e => e.id));
  check('the events page stays official — no community meetup leaked into it',
    officialEvents.every(id => !/^ce-/.test(id)), officialEvents.join(','));

  // --- registering for a meetup grants nothing -----------------------------
  const cmEcon = () => page.evaluate(() => [STATE.balance, STATE.lifetime, STATE.badges.length,
                                            STATE.ledger.length, STATE.marks.length]);
  const beforeRsvp = await cmEcon();
  await page.evaluate(() => askCmRsvp('ce-01'));
  await page.waitForTimeout(300);
  check('the register sheet says plainly that it grants nothing',
    /grants no Stardust/i.test(await page.locator('#sheetBox').innerText()));
  await page.evaluate(() => doCmRsvp('ce-01'));
  await page.waitForTimeout(400);
  check('registering for a community meetup grants nothing at all',
    JSON.stringify(await cmEcon()) === JSON.stringify(beforeRsvp) &&
    await page.evaluate(() => STATE.cmRsvp.includes('ce-01')),
    JSON.stringify(await cmEcon()));

  // --- a room reads as a live room, and what the fan says persists ---------
  await page.locator('#communityView a[href="#/room/rm-tonight"]').click();
  await page.waitForTimeout(450);
  check('a room opens on its own route from the room list',
    await page.locator('#page-room').isVisible() &&
    await page.evaluate(() => location.hash) === '#/room/rm-tonight');
  const rmOpen = await page.evaluate(() => ({
    bubbles: document.querySelectorAll('#roomLog .bubble').length,
    them: document.querySelectorAll('#roomLog .bubble.them').length,
    groups: document.querySelectorAll('#roomLog .rm-grp').length,
    days: document.querySelectorAll('#roomLog .rm-day').length,
    plate: document.querySelector('#page-room .note').innerText
  }));
  check('a room reads as a chat log — bubbles, grouped runs, a day marker',
    rmOpen.bubbles === 10 && rmOpen.them === 10 &&
    // 10 lines from 3 handles in runs of 2 = 5 groups, split across 2 days
    rmOpen.groups === 5 && rmOpen.days === 2, JSON.stringify(rmOpen));
  check('the room says in the Companion\'s register that it is scripted',
    /Scripted room/i.test(rmOpen.plate) && /written in advance, not generated/i.test(rmOpen.plate) &&
    /once per room/i.test(rmOpen.plate), rmOpen.plate.slice(0, 90));
  check('consecutive lines from one handle sit under one mono header, with the time on it',
    await page.evaluate(() => {
      const g = document.querySelectorAll('#roomLog .rm-grp')[0];
      return g.querySelectorAll('.rm-who').length === 1 &&
             g.querySelectorAll('.rm-row').length === 2 &&
             /nan-2207/i.test(g.querySelector('.rm-who').innerText) &&
             /^\d\d:\d\d$/.test(g.querySelector('.rm-when').innerText.trim());
    }));
  // the composer is docked at the foot of the stage directly above the tab
  // bar, pinned the way the tab bar is, and the log is not a second scroll
  // pane — the page scrolls, the log does not
  check('the composer is docked above the tab bar, and the log is not a second scroll pane',
    await page.evaluate(() => {
      const dock = document.querySelector('#page-room .rm-dock');
      const log = document.querySelector('#roomLog');
      const tabs = document.querySelector('#tabs');
      const d = dock.getBoundingClientRect(), tb = tabs.getBoundingClientRect();
      return getComputedStyle(dock).position === 'fixed' &&
             Math.abs(d.bottom - tb.top) < 2 && Math.round(d.width) === Math.round(tb.width) &&
             getComputedStyle(log).overflowY === 'visible' &&
             log.scrollHeight <= log.clientHeight + 1;
    }));
  // and the newest line never ends up underneath it
  check('the newest line in the log clears the docked composer at the foot of the room',
    await page.evaluate(async () => {
      window.scrollTo(0, document.documentElement.scrollHeight);
      await new Promise(r => setTimeout(r, 120));
      const rows = document.querySelectorAll('#roomLog .rm-row');
      const last = rows[rows.length - 1].getBoundingClientRect();
      const dock = document.querySelector('#page-room .rm-dock').getBoundingClientRect();
      return last.bottom <= dock.top;
    }));
  // the first-use hint carries the moderation line at the point of doubt
  check('the composer carries the first-use hint before the fan has said anything',
    await page.locator('#page-room .rm-first').count() === 1 &&
    /community guidelines/i.test(await page.locator('#page-room .rm-first').innerText()));
  await page.fill('#cmIn', 'I was in the second row and I still missed it.');
  await page.click('#page-room .rm-dock .btn');
  await page.waitForTimeout(200);
  check('sending appends the line immediately and persists it in state',
    await page.locator('#roomLog .bubble.me').count() === 1 &&
    /I was in the second row/.test(await page.locator('#roomLog .bubble.me').innerText()) &&
    await page.evaluate(() => STATE.rooms.find(r => r.id === 'rm-tonight').log.length) === 11 &&
    await page.evaluate(() => STATE.rooms.find(r => r.id === 'rm-tonight').log.slice(-1)[0].mine) === true);
  check("the fan's own line takes the Companion's raised ground on the right, and no gold",
    await page.evaluate(() => {
      const b = document.querySelector('#roomLog .bubble.me');
      const cs = getComputedStyle(b);
      const grp = b.closest('.rm-grp');
      return cs.backgroundColor === 'rgb(28, 24, 36)' &&
             !/240, 195, 107/.test(cs.borderTopColor) &&
             getComputedStyle(grp.querySelector('.rm-row')).justifyContent === 'flex-end' &&
             getComputedStyle(document.querySelector('#roomLog .bubble.them')).backgroundColor === 'rgb(21, 18, 27)';
    }));
  check('the first-use hint goes once the fan has spoken',
    await page.locator('#page-room .rm-first').count() === 0);
  // the scripted answer: a typing indicator first, then one written line from
  // the room's own pool, once per room and not on every message
  check('a typing indicator stands in for the answer while it composes',
    await page.locator('#roomLog .bubble.them.typing').count() === 1 &&
    await page.evaluate(() => document.querySelectorAll('#roomLog .typing i').length) === 3);
  await page.waitForTimeout(1100);
  const rmReply = await page.evaluate(() => {
    const log = STATE.rooms.find(r => r.id === 'rm-tonight').log;
    const last = log[log.length - 1];
    return { n: log.length, by: last.by, mine: !!last.mine, en: last.text.en,
             pool: CONTENT.community.rooms[0].replies.map(r => r.text.en),
             replied: STATE.roomReplied.slice() };
  });
  check('one seeded handle answers from the room\'s own written pool, after the typing pause',
    rmReply.n === 12 && rmReply.mine === false && rmReply.pool.includes(rmReply.en) &&
    /^(mook-7731|pim-1183|nan-2207)$/.test(rmReply.by) &&
    await page.locator('#roomLog .bubble.them.typing').count() === 0,
    JSON.stringify(rmReply).slice(0, 160));
  await page.fill('#cmIn', 'Second thing I have said in here.');
  await page.click('#page-room .rm-dock .btn');
  await page.waitForTimeout(1200);
  check('the scripted answer arrives once per room, never on every message',
    await page.evaluate(() => STATE.rooms.find(r => r.id === 'rm-tonight').log.length) === 13 &&
    await page.evaluate(() => STATE.rooms.find(r => r.id === 'rm-tonight').log.slice(-1)[0].mine) === true &&
    JSON.stringify(rmReply.replied) === '["rm-tonight"]');
  // saying something is not an earn: nothing in the room touches the economy
  const preSay = await page.evaluate(() => [STATE.balance, STATE.lifetime, STATE.badges.length, STATE.ledger.length]);
  await page.fill('#cmIn', 'And a third.');
  await page.click('#page-room .rm-dock .btn');
  await page.waitForTimeout(300);
  check('saying something in a room grants nothing at all',
    JSON.stringify(await page.evaluate(() => [STATE.balance, STATE.lifetime, STATE.badges.length, STATE.ledger.length]))
      === JSON.stringify(preSay));
  // what the fan said survives a reload, and the room list follows it
  await page.reload();
  await page.waitForTimeout(700);
  check('what the fan said survives a reload, in the room and in the log',
    await page.locator('#page-room').isVisible() &&
    await page.evaluate(() => STATE.rooms.find(r => r.id === 'rm-tonight').log.length) === 14 &&
    /And a third\./.test(await page.locator('#roomLog').innerText()));
  await page.evaluate(() => go('community'));
  await page.waitForTimeout(400);
  check('the room list preview follows the last thing said in the room',
    /^You: And a third\.$/.test(
      await page.locator('#communityView a[href="#/room/rm-tonight"] .cm-room-x').innerText()),
    await page.locator('#communityView a[href="#/room/rm-tonight"] .cm-room-x').innerText());
  check('a quiet room reads quietly — the other two are untouched',
    await page.evaluate(() => STATE.rooms.filter(r => r.log.some(m => m.mine)).length) === 1);

  // --- contests: earned, once, and nowhere near the money ------------------
  const ledgerFor = () => page.evaluate(() =>
    STATE.ledger.filter(l => /Contest entry/i.test((l.label && l.label.en) || '')).length);
  const preContest = await page.evaluate(() => [STATE.balance, STATE.lifetime]);
  check('the contests section states the earned-only rule above the first prize',
    /Contest Stardust is earned by taking part/i.test(await page.locator('#communityView').innerText()));
  check('no contest control spends money — the run carries no ember button',
    await page.evaluate(() => [...document.querySelectorAll('#communityView .cm-item .btn')]
      .filter(b => b.className.includes('btn-ember')).length) === 0);
  await page.evaluate(() => askContest('ct-01'));
  await page.waitForTimeout(300);
  const entrySheet = await page.locator('#sheetBox').innerText();
  check('the entry sheet is a stub and says so, and names the placeholder Stardust',
    /Demo entry/i.test(entrySheet) && /placeholder/i.test(entrySheet) &&
    await page.locator('#ctIn').count() === 1);
  await page.click('#sheetBox .btn-primary');
  await page.waitForTimeout(700);
  const afterEntry = await page.evaluate(() => [STATE.balance, STATE.lifetime]);
  check('entering a contest earns its placeholder Stardust, spendable and lifetime',
    afterEntry[0] === preContest[0] + 5 && afterEntry[1] === preContest[1] + 5,
    `${preContest} -> ${afterEntry}`);
  check('the entry shows up in the ledger, through the real earn path',
    await ledgerFor() === 1);
  // the second attempt, twice over: through the sheet, and by calling the
  // grant directly. Neither may move a number.
  await page.evaluate(() => { askContest('ct-01'); enterContest('ct-01'); enterContest('ct-01'); });
  await page.waitForTimeout(500);
  check('a second entry never double-awards',
    JSON.stringify(await page.evaluate(() => [STATE.balance, STATE.lifetime])) === JSON.stringify(afterEntry) &&
    await ledgerFor() === 1 &&
    await page.evaluate(() => STATE.contestEntries.filter(i => i === 'ct-01').length) === 1);
  await page.evaluate(() => closeSheet());
  await page.waitForTimeout(200);

  // --- the winner's path: a badge, and a mark that outlives a membership ---
  const badgesBefore = await page.evaluate(() => STATE.badges.length);
  await page.evaluate(() => demoContestWin('ct-01'));
  await page.waitForTimeout(500);
  check('winning a contest awards a badge through the badge system',
    await page.evaluate(() => STATE.badges.includes('badge-circle-contest')) &&
    await page.evaluate(() => STATE.badges.length) === badgesBefore + 1);
  check('the winner chip replaces nothing else on the entry',
    await page.locator('#communityView .chip').filter({ hasText: /Winner \(demo\)/i }).count() === 1);
  const wasMemberCm = await page.evaluate(() => STATE.premium);
  await page.evaluate(() => { STATE.premium = false; STATE.contestEntries.push('ct-02'); save(); demoContestWin('ct-02'); });
  await page.waitForTimeout(400);
  check('a won mark is open to a non-member, because it was won and not bought',
    await page.evaluate(() => STATE.marks.includes('stage')) &&
    await page.evaluate(() => avatarOpen(avatarById('stage'))) === true);
  check('winning grants no Stardust — the prize is the badge or the mark, never points',
    JSON.stringify(await page.evaluate(() => [STATE.balance, STATE.lifetime])) === JSON.stringify(afterEntry));
  // Put the fixture back: the demo fan did not really win anything, and the
  // membership gating of the card marks is checked further down on a fan who
  // has won nothing. The won-mark door is the assertion just above.
  await page.evaluate(m => { STATE.premium = m; STATE.marks = []; save(); }, wasMemberCm);

  // --- Thai, whole surface -------------------------------------------------
  await page.evaluate(() => { setLang('th'); go('community'); });
  await page.waitForTimeout(400);
  const cmThai = await page.locator('#page-community').innerText();
  check('the Circle renders in Thai, rooms, meetups and contests alike',
    /[฀-๿]/.test(cmThai) && /แฟนคลับจัดเอง/.test(cmThai) && /ตัวเลขชั่วคราว/.test(cmThai) &&
    /มี Orbiters อยู่ 128 คน/.test(cmThai), cmThai.slice(0, 90).replace(/\n/g, ' '));
  await page.evaluate(() => go('room/rm-tonight'));
  await page.waitForTimeout(350);
  const rmThai = await page.locator('#page-room').innerText();
  check('a seeded room re-reads in Thai, while the fan keeps their own words',
    /[฀-๿]/.test(await page.locator('#roomLog .bubble.them').first().innerText()) &&
    /ห้องนี้เป็นบทที่เขียนไว้/.test(rmThai) &&
    /I was in the second row/.test(rmThai));
  check('the scripted answer re-reads in Thai too, because it stores the written pair',
    /[฀-๿]/.test(await page.evaluate(() => {
      const log = STATE.rooms.find(r => r.id === 'rm-tonight').log;
      return log.filter(m => !m.mine).slice(-1)[0].text.th;
    })));
  await page.evaluate(() => setLang('en'));
  await page.waitForTimeout(300);

  // (the Circle's own reset behaviour is checked with the other reset
  //  assertions further down, where resetDemo() is already called once)

  // P9 the Companion — a working scripted chat (Sep 2026)
  // The allowance depends on member state, so the free path is tested from a
  // known non-member footing and the member reading is checked after it.
  const wasMember = await page.evaluate(() => STATE.premium);
  await page.evaluate(() => { STATE.premium = false; save(); go('twin'); });
  await page.waitForTimeout(400);
  const twinTxt = await page.locator('#page-twin').innerText();
  // The honesty line rides the top of the thread, before the fan types: this
  // is a scripted preview, the real thing trains on Kai's own words with his
  // approval, and voice follows after.
  check('the thread opens on the scripted-preview honesty line',
    /scripted preview/i.test(twinTxt) && /written in advance, not generated/i.test(twinTxt) &&
    /Kai's own words/i.test(twinTxt) && /voice follows/i.test(twinTxt),
    twinTxt.slice(0, 140).replace(/\n/g, ' '));
  // Kai is marked by a drawing in the badge stroke language, never a photo
  // and never a fill portrait — a produced likeness waits on licensing.
  check('Kai is marked by a monoline glyph, not a photo or a fill portrait',
    await page.evaluate(() => {
      const svgs = [...document.querySelectorAll('#page-twin .kai-mark svg')];
      if (!svgs.length) return false;
      return svgs.every(s => {
        const cs = getComputedStyle(s);
        const w = parseFloat(cs.strokeWidth);
        return cs.fill === 'none' && w >= 1.4 && w <= 1.8 &&
               cs.strokeLinecap === 'round' && !s.querySelector('image');
      });
    }));
  check('the drawn mark heads the page as well as the messages',
    await page.locator('#twinAvatar svg').count() === 1);
  check('the composer is enabled',
    !(await page.locator('#twinIn').isDisabled()) && !(await page.locator('#twinSend').isDisabled()));
  // Voice is the one thing still unbuilt, so it stays disabled and says why.
  check('voice is still disabled and still says why',
    await page.locator('#twinMic').isDisabled() &&
    (await page.locator('.twin-wait').innerText()).length > 10);

  const msgBefore = await page.evaluate(() => STATE.msgUsed);
  await page.fill('#twinIn', 'when is the next tour');
  await page.click('#twinSend');
  await page.waitForTimeout(180);
  check('a quiet typing indicator stands in while the reply composes',
    await page.locator('#page-twin .typing').count() === 1);
  await page.waitForTimeout(900);
  check('a scripted reply arrives, routed off the fan\'s own words',
    await page.locator('#page-twin .bubble.kai').count() >= 2 &&
    /events page/i.test(await page.locator('#page-twin .bubble.kai').last().innerText()),
    (await page.locator('#page-twin .bubble.kai').last().innerText()).slice(0, 80));
  check('the typing indicator clears once the reply lands',
    await page.locator('#page-twin .typing').count() === 0);
  // Velvet and hairline, both sides. No borrowed gold on a message nobody
  // earned, and no chat-app blue, which this palette does not contain.
  check('bubbles speak velvet and hairline only', await page.evaluate(() => {
    const me = document.querySelector('#page-twin .bubble.me');
    const mk = document.querySelector('#page-twin .bubble.kai');
    if (!me || !mk) return false;
    return getComputedStyle(me).backgroundColor === 'rgb(28, 24, 36)' &&
           getComputedStyle(mk).backgroundColor === 'rgb(21, 18, 27)';
  }));
  check('the allowance meter counts down, and it counts messages',
    /\b199 of 200 free messages\b/i.test(await page.locator('#twinMeter').innerText()),
    await page.locator('#twinMeter').innerText());
  check('one message sent spends exactly one message',
    await page.evaluate(() => STATE.msgUsed) === msgBefore + 1);
  check('the thread is in state, not in a variable',
    await page.evaluate(() => STATE.twinThread.length) === 2);

  // The demo affordance: the meter is itself the control, quietly, so the
  // exhausted state is reachable inside a 3-minute walkthrough.
  await page.click('#twinMeter');
  await page.waitForTimeout(250);
  check('the meter doubles as the demo affordance, named in its accessible name',
    /1 of 200 free messages/i.test(await page.locator('#twinMeter').innerText()) &&
    /demo/i.test(await page.getAttribute('#twinMeter', 'aria-label')),
    await page.locator('#twinMeter').innerText());
  await page.fill('#twinIn', 'one last thing before I go');
  await page.click('#twinSend');
  await page.waitForTimeout(950);
  check('the last message still gets its answer, then the meter reads spent',
    await page.evaluate(() => msgLeft()) === 0 &&
    /no messages left/i.test(await page.locator('#twinMeter').innerText()),
    await page.locator('#twinMeter').innerText());
  // Out of messages is a sheet, not a dead Send.
  await page.fill('#twinIn', 'hello again');
  await page.click('#twinSend');
  await page.waitForTimeout(350);
  const packTxt = await page.locator('#sheetBox').innerText();
  check('an exhausted allowance opens the message pack sheet',
    await page.locator('#sheet.open').count() === 1 && /more messages/i.test(packTxt));
  check('the pack sheet names the price, the placeholder, the member allowance and the demo checkout',
    /฿59/.test(packTxt) && /placeholder/i.test(packTxt) &&
    /Inner Circle includes 500 messages/i.test(packTxt) &&
    /demo checkout, no payment taken/i.test(packTxt),
    packTxt.replace(/\n/g, ' ').slice(0, 200));
  // The compliance line: the two streams never cross, and the sheet says so.
  check('the pack sheet keeps money and Stardust in separate streams, out loud',
    /Money buys messages only/i.test(packTxt) &&
    /Stardust is earned and never buys messages/i.test(packTxt) &&
    /messages never buy Stardust, a level or a badge/i.test(packTxt));
  check('the buying button is ember, never gold', await page.evaluate(() => {
    const b = [...document.querySelectorAll('#sheetBox .btn')].find(x => /buy/i.test(x.textContent));
    return !!b && b.classList.contains('btn-ember') && !b.classList.contains('btn-primary');
  }));
  const econBefore = await page.evaluate(() => [STATE.balance, STATE.lifetime, STATE.badges.length]);
  await page.evaluate(() => { closeSheet(); buyMessagePack(); });
  await page.waitForTimeout(400);
  check('a pack buys messages and touches nothing else',
    await page.evaluate(() => msgLeft()) === 100 &&
    JSON.stringify(await page.evaluate(() => [STATE.balance, STATE.lifetime, STATE.badges.length]))
      === JSON.stringify(econBefore));

  // Thai renders the whole surface, meter and sheet included.
  await page.evaluate(() => setLang('th'));
  await page.waitForTimeout(350);
  const thTwin = await page.locator('#page-twin').innerText();
  check('the companion renders in Thai, thread and meter both',
    /[฀-๿]/.test(thTwin) && /ข้อความ/.test(await page.locator('#twinMeter').innerText()) &&
    /[฀-๿]/.test(await page.locator('#page-twin .bubble.kai').first().innerText()));
  await page.evaluate(() => { STATE.msgBought = 0; STATE.msgUsed = 2; save(); renderTwin(); askMessagePack(); });
  await page.waitForTimeout(300);
  check('the pack sheet renders in Thai and still names the demo checkout',
    /[฀-๿]/.test(await page.locator('#sheetBox').innerText()) &&
    /ไม่มีการตัดเงินจริง/.test(await page.locator('#sheetBox').innerText()));
  await page.evaluate(() => { closeSheet(); setLang('en'); });
  await page.waitForTimeout(300);
  // Member state is reflected rather than ignored: the same meter, a larger
  // monthly allowance, and the word "free" drops out of it.
  await page.evaluate(() => { STATE.premium = true; STATE.msgUsed = 13; save(); renderTwin(); });
  await page.waitForTimeout(250);
  check('a member reads a monthly allowance on the same meter',
    /487 of 500 monthly messages/i.test(await page.locator('#twinMeter').innerText()) &&
    !/free/i.test(await page.locator('#twinMeter').innerText()),
    await page.locator('#twinMeter').innerText());
  await page.evaluate(m => { STATE.premium = m; STATE.msgUsed = 0; save(); renderTwin(); }, wasMember);
  await page.waitForTimeout(200);

  // --- P7b collector's editions and the Exchange (Sep 2026) ---------------
  // Objects sold for money to members only. The whole point of the section is
  // that none of it can move a level, so the economy is read before and after
  // every purchase and has to be byte-identical.
  const edWasMember = await page.evaluate(() => STATE.premium);
  const edEcon = () => page.evaluate(() => [STATE.balance, STATE.lifetime, STATE.badges.length]);

  // (a) a non-member sees the section, the gate, and nothing to press
  await page.evaluate(() => { STATE.premium = false; save(); go('shop'); });
  await page.waitForTimeout(350);
  const edNon = await page.locator('#editionsSec').innerText();
  check('the editions section is visible to a non-member',
    /collector's editions/i.test(edNon) && (await page.locator('#editionsSec .ed-item').count()) === 3,
    edNon.slice(0, 60));
  check('a non-member meets the Inner Circle gate, in the app\'s gate grammar',
    await page.locator('#editionsSec .d-gate.gate-prem').count() === 1 &&
    /inner circle only/i.test(edNon) &&
    await page.locator('#editionsSec a.btn-ember[href="#/premium"]').count() === 1);
  check('a gated editions run offers no control at all, live or dead',
    await page.locator('#editionsSec button').count() === 0);
  check('every edition states its number and its provenance',
    await page.locator('#editionsSec .ed-no').count() === 3 &&
    await page.locator('#editionsSec .ed-prov').count() === 3 &&
    /Edition 02 of 03/i.test(edNon) && /recorded to your name/i.test(edNon), edNon.slice(0, 80));
  // The rework (Sep 2026): every edition is an object used or worn on a named
  // night, so the provenance line names that night and its date.
  check('every edition names the night the object was used or worn on',
    /Riverside Fan Meet, Bangkok, 12 July 2026/i.test(edNon) &&
    /Fanframe Pilot Showcase, Bangkok, 24 August 2026/i.test(edNon) &&
    /Neon Tide Tour, Bangkok, 30 May 2026/i.test(edNon), edNon.slice(0, 120));
  check('the arrangement is explained once, in one plain line',
    /Buy the edition, receive its artwork, wear its mark\./i.test(edNon) &&
    (edNon.match(/receive its artwork, wear its mark/gi) || []).length === 1);
  check('edition prices are placeholder baht, labelled as sample figures',
    /฿12,000/.test(edNon) && /sample figures/i.test(edNon));

  // (b) a member gets the buy, and the gate goes
  await page.evaluate(() => { STATE.premium = true; save(); go('shop'); });
  await page.waitForTimeout(350);
  check('a member loses the gate and gains the buy',
    await page.locator('#editionsSec .d-gate.gate-prem').count() === 0 &&
    await page.locator('#editionsSec .ed-act .btn-ember').count() === 3);

  // (c) buying an edition: ceremony, provenance, and zero Stardust
  const beforeEd = await edEcon();
  await page.evaluate(() => askEdition('ed-01'));
  await page.waitForTimeout(300);
  const edSheet = await page.locator('#sheetBox').innerText();
  check('the edition checkout is the order ceremony, with the number in it',
    /Edition\b/i.test(edSheet) && /Edition 02 of 03/i.test(edSheet) &&
    /Total/i.test(edSheet) && /recorded to your name/i.test(edSheet) &&
    /demo checkout, no payment taken/i.test(edSheet), edSheet.slice(0, 120));
  check('the edition sheet says money buys an object, never Stardust or a level',
    /never Stardust/i.test(edSheet) && /no level/i.test(edSheet));
  await page.fill('#ckName', 'Ploy Suwannee');
  await page.fill('#ckAddr', '18 Soi Ari 4');
  await page.evaluate(() => payEdition('ed-01'));
  await page.waitForTimeout(400);
  const afterEd = await edEcon();
  check('buying an edition grants zero Stardust, zero lifetime and zero badges',
    JSON.stringify(beforeEd) === JSON.stringify(afterEd),
    JSON.stringify(beforeEd) + ' -> ' + JSON.stringify(afterEd));
  const owned = await page.evaluate(() => STATE.editions);
  check('the edition is recorded with its owner and its number',
    owned.length === 1 && owned[0].id === 'ed-01' && owned[0].no === 2, JSON.stringify(owned));
  const edShelf = await page.locator('#editionsSec .ed-mine').innerText();
  check('"Your editions" repeats the number and the provenance line',
    /Edition 02 of 03/i.test(edShelf) && /Numbered by hand and recorded to your name/i.test(edShelf),
    edShelf.slice(0, 90));
  check('an owned edition is said once: it leaves the run it now sits above',
    await page.locator('#editionsSec .ed-item').count() === 2);

  // (d) the Exchange: seeded listings, royalty maths, the compliance line
  await page.evaluate(() => go('exchange'));
  await page.waitForTimeout(400);
  const xc = await page.locator('#page-exchange').innerText();
  check('the Exchange is reachable from the editions area and seeds a market',
    await page.locator('#page-exchange').isVisible() &&
    await page.locator('#exchangeView .xc-item').count() === 3, xc.slice(0, 60));
  check('every listing names a seller, an edition number and an asking price',
    await page.locator('#exchangeView .xc-seller').count() === 3 &&
    await page.locator('#exchangeView .ed-no').count() === 3 &&
    await page.locator('#exchangeView .xc-money').count() === 3 &&
    /Edition 01 of 03/i.test(xc) && /฿14,500/.test(xc), xc.slice(0, 120));
  check('the royalty rule is stated once and each listing carries its own figure',
    /10% of every resale goes to Kai \(placeholder\)/i.test(xc) &&
    /Royalty to Kai ฿1,450 \(placeholder\)/i.test(xc) &&
    (xc.match(/10% of every resale/gi) || []).length === 1, xc.slice(0, 160));
  check('the compliance line sits where a fan would doubt it',
    /Only an edition you already own can be resold here/i.test(xc) &&
    /Stardust, levels and badges are earned, never sold, by anyone/i.test(xc));

  // (e) listing an owned edition: the royalty ceremony
  await page.evaluate(() => askList());
  await page.waitForTimeout(250);
  await page.fill('#lsPrice', '15500');
  await page.waitForTimeout(200);
  const lsSheet = await page.locator('#sheetBox').innerText();
  check('the listing sheet names the object, then splits the price',
    /Riverside Fan Meet Microphone/.test(lsSheet) && /Edition 02 of 03/i.test(lsSheet) &&
    /฿15,500/.test(lsSheet) && /฿1,550/.test(lsSheet) && /฿13,950/.test(lsSheet),
    lsSheet.replace(/\n/g, ' | ').slice(0, 160));
  check('the listing sheet admits it is a demo and repeats the rule',
    /Demo listing, nothing is sold/i.test(lsSheet) &&
    /Only an edition you already own/i.test(lsSheet));
  await page.evaluate(() => confirmListing());
  await page.waitForTimeout(400);
  const mineListing = await page.evaluate(() => STATE.listings.filter(l => l.mine));
  check('listing an owned edition puts it on the market as the fan\'s own',
    mineListing.length === 1 && mineListing[0].price === 15500 && mineListing[0].no === 2,
    JSON.stringify(mineListing));
  check('the fan\'s own listing is marked as theirs and offers no buy button',
    /your listing/i.test(await page.locator('#exchangeView').innerText()) &&
    await page.locator('#exchangeView .xc-item').count() === 4 &&
    await page.locator('#exchangeView .xc-item .btn-ember').count() === 3);
  // nothing a fan does not own can reach the market
  const strayListing = await page.evaluate(() => {
    const before = STATE.listings.length;
    listDraft = { key: 'ed-02#99', price: 5000 };
    confirmListing();
    return [before, STATE.listings.length];
  });
  check('an edition the fan does not own can never be listed',
    strayListing[0] === strayListing[1], JSON.stringify(strayListing));

  // (f) buying a listing: royalty shown, and still zero Stardust
  const beforeXc = await edEcon();
  await page.evaluate(() => askListing('lx-03'));
  await page.waitForTimeout(300);
  const xcBuy = await page.locator('#sheetBox').innerText();
  check('buying a listing shows the split before it shows the button',
    /To Kai/i.test(xcBuy) && /฿340/.test(xcBuy) && /To seller/i.test(xcBuy) &&
    /฿3,060/.test(xcBuy) && /You pay/i.test(xcBuy) && /฿3,400/.test(xcBuy),
    xcBuy.replace(/\n/g, ' | ').slice(0, 160));
  check('the resale purchase carries the demo line and the compliance line',
    /demo checkout, no payment taken/i.test(xcBuy) &&
    /Only an edition you already own/i.test(xcBuy));
  await page.fill('#ckName', 'Ploy Suwannee');
  await page.fill('#ckAddr', '18 Soi Ari 4');
  await page.evaluate(() => buyListing('lx-03'));
  await page.waitForTimeout(400);
  check('buying a resale grants zero Stardust, zero lifetime and zero badges',
    JSON.stringify(beforeXc) === JSON.stringify(await edEcon()),
    JSON.stringify(beforeXc) + ' -> ' + JSON.stringify(await edEcon()));
  check('a bought listing leaves the market and lands on the fan\'s shelf',
    await page.evaluate(() => !STATE.listings.some(l => l.id === 'lx-03')) &&
    await page.evaluate(() => STATE.editions.some(o => o.id === 'ed-03' && o.no === 9)));

  // (g) the non-member Exchange: the same gate, no live control
  await page.evaluate(() => { STATE.premium = false; save(); go('exchange'); });
  await page.waitForTimeout(350);
  check('a non-member sees the Exchange behind the same gate, with no control',
    await page.locator('#exchangeView .d-gate.gate-prem').count() === 1 &&
    await page.locator('#exchangeView button').count() === 0 &&
    await page.locator('#exchangeView .xc-item').count() >= 3 &&
    /Only an edition you already own/i.test(await page.locator('#exchangeView').innerText()));

  // (h) Thai renders both surfaces
  await page.evaluate(() => { STATE.premium = true; save(); setLang('th'); go('shop'); });
  await page.waitForTimeout(450);
  const thEd = await page.locator('#editionsSec').innerText();
  check('the editions section renders in Thai, numbers and provenance included',
    /[฀-๿]/.test(thEd) && /อิดิชัน 04 จาก 06/.test(thEd) && /฿6,400/.test(thEd), thEd.slice(0, 90));
  await page.evaluate(() => go('exchange'));
  await page.waitForTimeout(350);
  const thXc = await page.locator('#page-exchange').innerText();
  check('the Exchange renders in Thai, royalty line and compliance line included',
    /[฀-๿]/.test(thXc) && /ค่าลิขสิทธิ์ให้ไค/.test(thXc) &&
    /ต้องสะสมเอง ไม่มีใครซื้อขายได้/.test(thXc), thXc.slice(0, 90));
  await page.evaluate(() => setLang('en'));
  await page.waitForTimeout(250);

  // --- the Orbiter card mark (Sep 2026) -------------------------------------
  // Cosmetic, gated for the exclusive three, and it never touches the economy.
  // Sep 2026: the set grew to seven, on three doors — free, membership, and
  // the artwork that came with an edition. The editions are cleared first so
  // the base state is every gated mark actually gated.
  await page.evaluate(() => { STATE.premium = false; STATE.editions = []; save(); go('invite'); });
  await page.waitForTimeout(400);
  check('the card mark picker offers seven marks, one of them free',
    await page.locator('#avatarPicker .av-pick').count() === 7 &&
    await page.evaluate(() => !document.querySelectorAll('#avatarPicker .av-pick')[0].disabled));
  check('the exclusive marks are gated for a non-member, and say why',
    await page.evaluate(() => [...document.querySelectorAll('#avatarPicker .av-pick')]
      .slice(1, 4).every(b => b.disabled)) &&
    await page.locator('#avatarPicker .d-gate.gate-prem').count() === 1);
  // The edition marks have their own door and therefore their own line: a
  // membership does not open them, so the picker does not offer one.
  check('the edition marks are gated by their editions, not by a membership',
    await page.evaluate(() => [...document.querySelectorAll('#avatarPicker .av-pick')]
      .slice(4).every(b => b.disabled)) &&
    /Buy the edition, receive its artwork, wear its mark/i
      .test(await page.locator('#avatarPicker').innerText()));
  check('the picker states that a mark is cosmetic',
    /never changes your level/i.test(await page.locator('#avatarPicker').innerText()));
  const beforeAv = await edEcon();
  await page.evaluate(() => setAvatar('star'));
  await page.waitForTimeout(250);
  check('a non-member cannot take an exclusive mark by calling for it',
    await page.evaluate(() => STATE.avatar) === 'ring');
  await page.evaluate(() => { STATE.premium = true; save(); go('invite'); setAvatar('star'); });
  await page.waitForTimeout(300);
  check('a member can choose an exclusive mark, and it grants no Stardust',
    await page.evaluate(() => STATE.avatar) === 'star' &&
    JSON.stringify(beforeAv) === JSON.stringify(await edEcon()),
    JSON.stringify(beforeAv) + ' -> ' + JSON.stringify(await edEcon()));
  check('the chosen mark renders on the Orbiter card face, in bone and not gold',
    await page.locator('#passCard .pass-mark svg').count() === 1 &&
    await page.evaluate(() => {
      const c = getComputedStyle(document.querySelector('#passCard .pass-mark')).color;
      const bone = getComputedStyle(document.documentElement).getPropertyValue('--bone').trim();
      const stardust = getComputedStyle(document.documentElement).getPropertyValue('--stardust').trim();
      return c !== stardust && c.length > 0 && bone.length > 0;
    }));
  await page.reload();
  await page.waitForTimeout(800);
  await page.evaluate(() => go('invite'));
  await page.waitForTimeout(350);
  check('the chosen mark survives a reload',
    await page.evaluate(() => STATE.avatar) === 'star' &&
    await page.locator('#passCard .pass-mark svg').count() === 1);
  check('a mark the fan can no longer use falls back to the free one',
    await page.evaluate(() => { STATE.premium = false; save(); renderInvite(); return myAvatar().id; }) === 'ring');

  // --- the edition artwork, and the mark it opens (Sep 2026) --------------
  // Buy the edition, receive its artwork, wear its mark. The artwork is a
  // drawing on a velvet plate, never a photograph, and the mark it opens is a
  // third door into avatarOpen() beside the free mark and the membership.
  await page.evaluate(() => {
    STATE.premium = true; STATE.editions = []; STATE.listings = seedListings();
    STATE.avatar = 'ring'; save(); go('shop');
  });
  await page.waitForTimeout(350);
  const artBefore = await edEcon();
  await page.evaluate(() => askEdition('ed-01'));
  await page.waitForTimeout(250);
  const artSheet = await page.locator('#sheetBox').innerText();
  check('the checkout names the artwork that comes with the object',
    /The Riverside Microphone/i.test(artSheet) &&
    /opens its mark for your Orbiter card/i.test(artSheet), artSheet.slice(0, 100));
  await page.fill('#ckName', 'Ploy Suwannee');
  await page.fill('#ckAddr', '18 Soi Ari 4');
  await page.evaluate(() => payEdition('ed-01'));
  await page.waitForTimeout(400);
  const artTxt = await page.locator('#editionsSec .art-plate').innerText();
  check('an owned edition renders its artwork on a velvet plate, with the provenance line',
    await page.locator('#editionsSec .art-plate').count() === 1 &&
    /The Riverside Microphone/i.test(artTxt) &&
    /Used on stage at the Riverside Fan Meet, Bangkok, 12 July 2026/i.test(artTxt),
    artTxt.replace(/\n/g, ' | ').slice(0, 140));
  check('the artwork is drawn, not photographed, and carries no likeness slot',
    await page.locator('#editionsSec .art-plate svg').count() === 1 &&
    await page.locator('#editionsSec .art-plate img').count() === 0 &&
    await page.locator('#editionsSec .art-plate .slot').count() === 0);
  check('the artwork is bone on velvet, never the earned gold',
    await page.evaluate(() => {
      const cs = getComputedStyle(document.querySelector('.art-plate .art-art'));
      const stardust = getComputedStyle(document.documentElement).getPropertyValue('--stardust').trim();
      return cs.color !== stardust && cs.color.length > 0;
    }));
  check('receiving the artwork grants zero Stardust, zero lifetime and zero badges',
    JSON.stringify(artBefore) === JSON.stringify(await edEcon()),
    JSON.stringify(artBefore) + ' -> ' + JSON.stringify(await edEcon()));

  // The third door: the object opened the mark, so a membership is not needed
  // and cancelling one does not close it.
  await page.evaluate(() => { STATE.premium = false; save(); go('invite'); });
  await page.waitForTimeout(400);
  check('owning an edition opens its mark, with no membership anywhere in it',
    await page.evaluate(() => !STATE.premium && avatarOpen(avatarById('mic'))) &&
    await page.evaluate(() => !document.querySelectorAll('#avatarPicker .av-pick')[4].disabled) &&
    await page.evaluate(() => [...document.querySelectorAll('#avatarPicker .av-pick')]
      .slice(5).every(b => b.disabled)));
  const beforeMark = await edEcon();
  await page.evaluate(() => setAvatar('mic'));
  await page.waitForTimeout(300);
  check('wearing an edition mark shows on the card and grants nothing',
    await page.evaluate(() => STATE.avatar) === 'mic' &&
    await page.locator('#passCard .pass-mark svg').count() === 1 &&
    JSON.stringify(beforeMark) === JSON.stringify(await edEcon()),
    JSON.stringify(beforeMark) + ' -> ' + JSON.stringify(await edEcon()));

  // The design travels with the edition: the seller loses it...
  await page.evaluate(() => { STATE.premium = true; save(); go('exchange'); });
  await page.waitForTimeout(300);
  await page.evaluate(() => askList());
  await page.waitForTimeout(250);
  await page.fill('#lsPrice', '15000');
  await page.waitForTimeout(150);
  await page.evaluate(() => confirmListing());
  await page.waitForTimeout(350);
  const xcTravel = await page.locator('#exchangeView').innerText();
  check('every listing says the artwork and the mark travel with the edition',
    /The artwork and its mark travel with the edition/i.test(xcTravel) &&
    /a buyer gains them and a seller loses them/i.test(xcTravel));
  const mineId = await page.evaluate(() => (STATE.listings.filter(l => l.mine)[0] || {}).id);
  await page.evaluate(id => askSell(id), mineId);
  await page.waitForTimeout(300);
  const sellSheet = await page.locator('#sheetBox').innerText();
  check('the demo sale shows the split and says what leaves with the object',
    /The Riverside Microphone/i.test(sellSheet) && /You receive/i.test(sellSheet) &&
    /฿13,500/.test(sellSheet) && /travel with the edition/i.test(sellSheet),
    sellSheet.replace(/\n/g, ' | ').slice(0, 160));
  const beforeSell = await edEcon();
  await page.evaluate(id => sellListing(id), mineId);
  await page.waitForTimeout(400);
  check('selling the edition takes its artwork and its mark with it',
    await page.evaluate(() => !STATE.editions.some(o => o.id === 'ed-01')) &&
    await page.evaluate(() => !avatarOpen(avatarById('mic'))) &&
    await page.locator('#editionsSec .art-plate').count() === 0);
  check('a mark that left with its edition falls back to the free one',
    await page.evaluate(() => { go('invite'); return myAvatar().id; }) === 'ring');
  check('a resale moves no Stardust in either direction',
    JSON.stringify(beforeSell) === JSON.stringify(await edEcon()),
    JSON.stringify(beforeSell) + ' -> ' + JSON.stringify(await edEcon()));

  // ...and the buyer gains it.
  await page.evaluate(() => {
    STATE.editions = []; STATE.listings = seedListings(); STATE.avatar = 'ring';
    save(); go('exchange');
  });
  await page.waitForTimeout(300);
  await page.evaluate(() => askListing('lx-02'));
  await page.waitForTimeout(250);
  await page.fill('#ckName', 'Ploy Suwannee');
  await page.fill('#ckAddr', '18 Soi Ari 4');
  await page.evaluate(() => buyListing('lx-02'));
  await page.waitForTimeout(400);
  check('buying a resale carries the artwork and its mark to the buyer',
    await page.evaluate(() => STATE.editions.some(o => o.id === 'ed-02' && o.no === 3)) &&
    await page.evaluate(() => avatarOpen(avatarById('jacket'))) &&
    await page.evaluate(() => !avatarOpen(avatarById('mic'))));

  // "Reset demo" restores the seeded market rather than emptying it.
  check('reset restores the seeded Exchange and clears what was owned',
    await page.evaluate(() => {
      const s = freshState();
      return s.listings.length === CONTENT.exchange.listings.length &&
        s.editions.length === 0 && s.avatar === 'ring';
    }));

  // Leave the app as the rest of the suite expects to find it.
  await page.evaluate((m) => {
    STATE.premium = m;
    STATE.editions = [];
    STATE.listings = seedListings();
    STATE.avatar = 'ring';
    STATE.orderLog = STATE.orderLog.filter(o => !/^ed-/.test(o.id));
    save(); go('feed');
  }, edWasMember);
  await page.waitForTimeout(300);


  // --- P7d · skins, the online half of merch (Sep 2026) -------------------
  // Merch that is worn in the app instead of posted. Money buys a decoration,
  // and the section says what that does and does not do before it says a price.
  await page.evaluate(() => { STATE.skins = []; STATE.skin = null; save(); go('invite'); });
  await page.waitForTimeout(350);
  const bareCard = await page.evaluate(() => ({
    cls: document.querySelector('#passCard').className,
    bg: getComputedStyle(document.querySelector('#passCard')).backgroundImage
  }));
  await page.evaluate(() => go('shop'));
  await page.waitForTimeout(400);
  const dg = await page.locator('#skinsSec').innerText();
  check('the shop carries a Digital run of four skins, each with a swatch and a price',
    await page.locator('#skinsSec .sk-item').count() === 4 &&
    await page.locator('#skinsSec .sk-tile').count() === 4 &&
    await page.locator('#skinsSec .sp-p').count() === 4 &&
    /Digital/i.test(dg) && /฿120/.test(dg) && /฿290/.test(dg), dg.slice(0, 60));
  check('the rule is read before the first price: a skin never changes your level',
    /A skin never changes your level/i.test(dg) &&
    dg.indexOf('never changes your level') < dg.indexOf('฿'));
  check('a skin is money and not membership, and the copy says so',
    /open to everyone whether or not you are a member/i.test(dg));
  check('the swatches are built, not photographed',
    await page.locator('#skinsSec img').count() === 0 &&
    await page.locator('#skinsSec .slot').count() === 0 &&
    await page.locator('#skinsSec .sk-tile').count() === 4);
  const skBefore = await edEcon();
  await page.evaluate(() => askSkin('sk-clay'));
  await page.waitForTimeout(300);
  const skSheet = await page.locator('#sheetBox').innerText();
  check('the skin checkout is the order ceremony, with nothing to post and nowhere to post it',
    /Clay Court/i.test(skSheet) && /Total/i.test(skSheet) && /฿220/.test(skSheet) &&
    !/Shipping/i.test(skSheet) && await page.locator('#sheetBox #ckAddr').count() === 0 &&
    /demo checkout, no payment taken/i.test(skSheet),
    skSheet.replace(/\n/g, ' | ').slice(0, 140));
  check('the skin sheet says money buys decoration, never Stardust and never a level',
    /never Stardust/i.test(skSheet) && /no level/i.test(skSheet));
  await page.evaluate(() => paySkin('sk-clay'));
  await page.waitForTimeout(400);
  check('buying a skin grants zero Stardust, zero lifetime and zero badges',
    JSON.stringify(skBefore) === JSON.stringify(await edEcon()),
    JSON.stringify(skBefore) + ' -> ' + JSON.stringify(await edEcon()));
  check('the skin is recorded and the offer stops being made',
    await page.evaluate(() => STATE.skins.length === 1 && STATE.skin === 'sk-clay') &&
    await page.locator('#skinsSec .ed-act, #skinsSec .sk-act .chip-ok').count() >= 1);
  await page.evaluate(() => go('invite'));
  await page.waitForTimeout(400);
  const wornCard = await page.evaluate(() => ({
    cls: document.querySelector('#passCard').className,
    bg: getComputedStyle(document.querySelector('#passCard')).backgroundImage,
    satin: getComputedStyle(document.querySelector('#passCard .pass-satin')).backgroundImage,
    ring: getComputedStyle(document.querySelector('#passCard .pass-ring')).borderTopColor
  }));
  check('a bought skin repaints the Orbiter card face',
    /skinned/.test(wornCard.cls) && /skin-clay/.test(wornCard.cls) &&
    wornCard.bg !== bareCard.bg && !/skinned/.test(bareCard.cls), wornCard.cls);
  check('a skin never lights the card gold: the level ring is still the only gold on it',
    !/240, ?195, ?107/.test(wornCard.bg) && !/240, ?195, ?107/.test(wornCard.satin) &&
    /240, ?195, ?107/.test(wornCard.ring), wornCard.ring);
  const skPick = await page.locator('#skinPicker').innerText();
  check('the picker offers only what the fan owns, so it carries no dead control',
    await page.locator('#skinPicker .sk-pick').count() === 2 &&
    await page.locator('#skinPicker .sk-pick[disabled]').count() === 0 &&
    /Skins in the shop/i.test(skPick), skPick.replace(/\n/g, ' | ').slice(0, 100));
  check('the picker states that a skin never changes your level',
    /never changes your level/i.test(skPick));
  await page.evaluate(() => setSkin(null));
  await page.waitForTimeout(300);
  check('the card can go back to no skin at all',
    await page.evaluate(() => STATE.skin) === null &&
    await page.evaluate(() => !/skinned/.test(document.querySelector('#passCard').className)));
  check('a skin the fan does not own can never be worn by calling for it',
    await page.evaluate(() => { setSkin('sk-carmine'); return STATE.skin; }) === null);
  check('reset clears what was bought and what was worn',
    await page.evaluate(() => {
      const f = freshState();
      return f.skins.length === 0 && f.skin === null;
    }));

  // --- P8e · livestreams (Sep 2026) ---------------------------------------
  // Three access models on one page, and one rule running under all three: a
  // ticket is money and buys the night, showing up is earned and pays Stardust.
  await page.evaluate(() => {
    STATE.premium = false; STATE.tickets = []; STATE.streamRsvp = [];
    STATE.streamAttended = []; save(); go('events');
  });
  await page.waitForTimeout(400);
  const strip = await page.locator('#liveStrip').innerText();
  check('the events page opens on a live strip that leads to the schedule',
    await page.locator('#liveStrip .ls-srow').count() === 2 &&
    await page.locator('#liveStrip a[href="#/live"]').count() === 1 &&
    /Live/i.test(strip), strip.replace(/\n/g, ' | ').slice(0, 110));
  check('More carries the same door',
    await page.evaluate(() => { go('more'); return document.querySelectorAll('#moreList a[href="#/live"]').length; }) === 1);
  await page.evaluate(() => go('live'));
  await page.waitForTimeout(400);
  const lv = await page.locator('#page-live').innerText();
  check('the schedule lists three streams on three access models',
    await page.locator('#liveView .ls-item').count() === 3 &&
    /Free to everyone/i.test(lv) && /฿149/.test(lv) && /Included with Inner Circle/i.test(lv),
    lv.replace(/\n/g, ' | ').slice(0, 110));
  check('the rule keeping a ticket and a level apart is read before the prices',
    /A ticket is money and buys the night/i.test(lv) && /Showing up is earned/i.test(lv) &&
    lv.indexOf('A ticket is money') < lv.indexOf('฿'));

  // (a) the members' stream: included, never priced
  await page.evaluate(() => go('stream/ls-03'));
  await page.waitForTimeout(400);
  const s3non = await page.locator('#page-stream').innerText();
  check('a members-only stream carries no price and offers the membership instead',
    !/฿/.test(s3non) && /Included with Inner Circle/i.test(s3non) &&
    await page.locator('#streamView .d-gate.gate-prem').count() === 1, s3non.slice(0, 80));
  check('a stream still to come stands on an unlit plate and says the player is not built',
    await page.locator('#streamView .wplate').count() === 1 &&
    await page.locator('#streamView .wplate.on').count() === 0 &&
    /The player arrives with the first real stream/i.test(s3non));
  check('the plate holds no player and no photograph',
    await page.locator('#streamView .wplate video').count() === 0 &&
    await page.locator('#streamView .wplate img').count() === 0 &&
    await page.locator('#streamView .wplate .slot').count() === 0);
  const countTxt = await page.locator('#streamView .ls-count').innerText();
  check('a stream still to come says how long is left, in the counting mono',
    (/\d\d\D+ \d\d\D+ \d\d\D+/.test(countTxt) || /Starting now/i.test(countTxt)) &&
    await page.evaluate(() => /Spline Sans Mono/
      .test(getComputedStyle(document.querySelector('#streamView .ls-count')).fontFamily)),
    countTxt);
  await page.evaluate(() => { STATE.premium = true; save(); go('stream/ls-03'); });
  await page.waitForTimeout(400);
  const s3mem = await page.locator('#page-stream').innerText();
  check('a member sees "included" where a price would be, and no gate',
    /Included with Inner Circle/i.test(s3mem) && !/฿/.test(s3mem) &&
    await page.locator('#streamView .d-gate.gate-prem').count() === 0 &&
    await page.locator('#streamView .chip-ok').count() >= 1);

  // (b) the ticketed stream: money, and nothing but the night
  await page.evaluate(() => { STATE.premium = false; save(); go('stream/ls-02'); });
  await page.waitForTimeout(400);
  const s2 = await page.locator('#page-stream').innerText();
  check('a ticketed stream shows its price and offers no way in until it is bought',
    /฿149/.test(s2) && await page.locator('#streamView .btn-ember').count() === 1 &&
    await page.locator('#streamView .btn-primary').count() === 0, s2.slice(0, 80));
  const tkBefore = await edEcon();
  await page.evaluate(() => askTicket('ls-02'));
  await page.waitForTimeout(300);
  const tkSheet = await page.locator('#sheetBox').innerText();
  check('the ticket checkout is the order ceremony, with nothing to post',
    /Soundcheck/i.test(tkSheet) && /Total/i.test(tkSheet) && /฿149/.test(tkSheet) &&
    !/Shipping/i.test(tkSheet) && await page.locator('#sheetBox #ckAddr').count() === 0 &&
    /demo checkout, no payment taken/i.test(tkSheet),
    tkSheet.replace(/\n/g, ' | ').slice(0, 140));
  check('the ticket sheet keeps the two currencies apart at the point of doubt',
    /never Stardust/i.test(tkSheet) && /no level/i.test(tkSheet) &&
    /Showing up is earned/i.test(tkSheet));
  await page.evaluate(() => payTicket('ls-02'));
  await page.waitForTimeout(400);
  check('buying a ticket grants zero Stardust, zero lifetime and zero badges',
    JSON.stringify(tkBefore) === JSON.stringify(await edEcon()),
    JSON.stringify(tkBefore) + ' -> ' + JSON.stringify(await edEcon()));
  check('the ticket is recorded and the price stops being offered',
    await page.evaluate(() => STATE.tickets.length === 1) &&
    /You have a ticket/i.test(await page.locator('#page-stream').innerText()) &&
    await page.locator('#streamView .btn-ember').count() === 0);

  // (c) the running stream: the live state, and the earn that is not a ticket
  await page.evaluate(() => go('stream/ls-01'));
  await page.waitForTimeout(400);
  const s1 = await page.locator('#page-stream').innerText();
  check('a running stream lifts the plate and carries the live chip and dot',
    await page.locator('#streamView .wplate.on').count() === 1 &&
    await page.locator('#streamView .wplate .chip-cool .livedot').count() === 1 &&
    /Live now/i.test(s1), s1.slice(0, 70));
  check('the viewer count is quiet, counted, and labelled a demo figure',
    /2,840 watching \(demo figure\)/i.test(s1) &&
    await page.locator('#streamView .wplate-v').count() === 1);
  check('the watch plate takes no cool rim: that light belongs to the scan lane',
    await page.evaluate(() => {
      const cool = 'rgb(132, 185, 198)';
      const cs = getComputedStyle(document.querySelector('#streamView .wplate'));
      return cs.borderTopColor !== cool && cs.borderLeftColor !== cool &&
             cs.outlineColor !== cool && cs.backgroundImage.indexOf('132, 185, 198') === -1;
    }));
  const atBefore = await st();
  await page.evaluate(() => attendStream('ls-01'));
  await page.waitForTimeout(1500);
  const atAfter = await st();
  check('showing up online earns Stardust through the ordinary path, into the ledger',
    atAfter.balance === atBefore.balance + 5 && atAfter.lifetime === atBefore.lifetime + 5 &&
    atAfter.ledger[0].kind === 'earn' &&
    /Showed up online: Paper Boats/i.test((atAfter.ledger[0].label || {}).en || ''),
    JSON.stringify(atAfter.ledger[0]));
  check('the attendance earn lands in place and never takes the screen',
    await page.evaluate(() => !document.querySelector('#burst').classList.contains('on')));
  await page.evaluate(() => attendStream('ls-01'));
  await page.waitForTimeout(700);
  const atTwice = await st();
  check('attendance pays once per stream, however it is reached again',
    atTwice.lifetime === atAfter.lifetime &&
    atTwice.ledger.filter(l => /Showed up online/i.test((l.label || {}).en || '')).length === 1);
  check('a stream that is not running can never pay for showing up',
    await page.evaluate(() => {
      const b = STATE.lifetime;
      attendStream('ls-02');
      return STATE.lifetime === b && STATE.streamAttended.indexOf('ls-02') === -1;
    }));
  check('a stream the fan cannot watch can never pay for showing up',
    await page.evaluate(() => {
      const b = STATE.lifetime;
      attendStream('ls-03');
      return STATE.lifetime === b && STATE.streamAttended.indexOf('ls-03') === -1;
    }));

  // (d) a reminder grants nothing, and says so before the button
  await page.evaluate(() => go('stream/ls-03'));
  await page.waitForTimeout(300);
  await page.evaluate(() => askRemind('ls-03'));
  await page.waitForTimeout(300);
  const rmSheet = await page.locator('#sheetBox').innerText();
  check('a reminder says it grants nothing before the button, not after it',
    /grants nothing/i.test(rmSheet) && /no Stardust/i.test(rmSheet) && /no level/i.test(rmSheet));
  const rmBefore = await edEcon();
  await page.evaluate(() => doRemind('ls-03'));
  await page.waitForTimeout(400);
  check('registering a reminder grants nothing at all',
    JSON.stringify(rmBefore) === JSON.stringify(await edEcon()) &&
    await page.evaluate(() => STATE.streamRsvp.indexOf('ls-03') !== -1));

  // (e) both new surfaces render in Thai
  await page.evaluate(() => { STATE.tickets = []; save(); setLang('th'); go('live'); });
  await page.waitForTimeout(450);
  const thLv = await page.locator('#page-live').innerText();
  check('the live schedule renders in Thai, access models and prices included',
    /[฀-๿]/.test(thLv) && /รวมอยู่ใน Inner Circle/i.test(thLv) && /฿149/.test(thLv),
    thLv.slice(0, 80));
  await page.evaluate(() => go('shop'));
  await page.waitForTimeout(450);
  const thDg = await page.locator('#skinsSec').innerText();
  check('the Digital run renders in Thai, rule and prices included',
    /[฀-๿]/.test(thDg) && /สกินไม่มีผลกับระดับของคุณ/.test(thDg) && /฿120/.test(thDg),
    thDg.slice(0, 80));
  await page.evaluate(() => setLang('en'));
  await page.waitForTimeout(250);

  // Leave the app as the rest of the suite expects to find it, the attendance
  // earn included: it was a real earn, so it is unwound rather than ignored.
  await page.evaluate(({ m, bal, life, led }) => {
    STATE.premium = m;
    STATE.skins = []; STATE.skin = null;
    STATE.tickets = []; STATE.streamRsvp = []; STATE.streamAttended = [];
    STATE.balance = bal; STATE.lifetime = life; STATE.ledger = led;
    STATE.editions = []; STATE.listings = seedListings(); STATE.avatar = 'ring';
    STATE.orderLog = STATE.orderLog.filter(o => !/^(sk-|ls-|ed-)/.test(o.id));
    save(); go('feed');
  }, { m: edWasMember, bal: atBefore.balance, life: atBefore.lifetime, led: atBefore.ledger });
  await page.waitForTimeout(300);

  // P10 premium unlocks exclusives
  await page.evaluate(() => go('premium'));
  await page.waitForTimeout(400);
  check('premium priced as placeholder', /placeholder/i.test(await page.locator('#page-premium').innerText()));
  check('premium leads with a full-bleed ember hero',
    await page.locator('#premHero .slot-shot').count() === 1 &&
    await page.locator('#premHero .prem-scrim').count() === 1 &&
    await page.locator('#premHero .prem-silk').count() === 1 &&
    await page.evaluate(() => {
      const r = document.querySelector('#premHero .slot').getBoundingClientRect();
      return Math.round(r.width - document.querySelector('.device').getBoundingClientRect().width) === 0;
    }));
  check('premium price is ember, not gold',
    await page.evaluate(() => getComputedStyle(document.querySelector('.prem-price')).color) === 'rgb(232, 112, 95)');
  // Trust: a recurring charge is never one tap away.
  await page.evaluate(() => { STATE.premium = false; save(); renderPremium(); });
  await page.waitForTimeout(300);
  await page.locator('#premCta .btn-ember').click();
  await page.waitForTimeout(400);
  const joinSheet = await page.locator('#sheetBox').innerText();
  check('premium join requires a confirm sheet, not one tap',
    await page.locator('#sheet').evaluate(el => el.classList.contains('open')) &&
    (await page.evaluate(() => STATE.premium)) === false);
  check('confirm sheet states tier, price, billing, renewal, cancel terms and demo payment',
    /membership/i.test(joinSheet) && /price/i.test(joinSheet) && /billing/i.test(joinSheet) &&
    /renews/i.test(joinSheet) && /cancel any time/i.test(joinSheet) &&
    /demo checkout, no payment taken/i.test(joinSheet), joinSheet.replace(/\n/g, ' | ').slice(0, 200));
  check('join confirm button spends money in ember, never gold',
    await page.locator('#sheetBox .btn-ember').count() === 1 &&
    await page.locator('#sheetBox .btn-primary').count() === 0);
  await page.locator('#sheetBox .btn-ember').click();
  await page.waitForTimeout(600);
  check('confirming the sheet is what joins', await page.evaluate(() => STATE.premium) === true);
  // ...and the cancel dialog never uses a bare "Cancel" as its dismiss
  await page.evaluate(() => askCancelPremium());
  await page.waitForTimeout(400);
  const cancelSheet = await page.locator('#sheetBox').innerText();
  check('cancel sheet labels both buttons by what they do',
    /keep membership/i.test(cancelSheet) && /cancel membership/i.test(cancelSheet) &&
    !/^\s*cancel\s*$/im.test(cancelSheet), cancelSheet.replace(/\n/g, ' | '));
  // Keep is the visual primary (filled neutral, no gold and no money light);
  // cancelling is a drawn ember, quieter than the thing it undoes.
  check('keep membership is the visual primary and cancelling is the quiet ember',
    await page.locator('#sheetBox .btn-neutral').count() === 1 &&
    await page.locator('#sheetBox .btn-ember-quiet').count() === 1 &&
    await page.locator('#sheetBox .btn-primary').count() === 0 &&
    await page.evaluate(() => {
      const keep = document.querySelector('#sheetBox .btn-neutral');
      const kill = document.querySelector('#sheetBox .btn-ember-quiet');
      const ks = getComputedStyle(keep), xs = getComputedStyle(kill);
      return ks.backgroundColor !== 'rgba(0, 0, 0, 0)' &&
             xs.backgroundColor === 'rgba(0, 0, 0, 0)' &&
             !/240, 195, 107/.test(ks.backgroundImage + ks.backgroundColor);
    }));
  // Both sheets make the same promise about when exclusives lock.
  check('join and cancel sheets agree on when exclusives lock',
    /to the end of the period/i.test(joinSheet) && /to the end of the period/i.test(cancelSheet),
    cancelSheet.replace(/\n/g, ' | '));
  await page.locator('#sheetBox .btn-neutral').click();
  await page.waitForTimeout(400);
  check('keep membership keeps the membership', await page.evaluate(() => STATE.premium) === true);
  await page.evaluate(() => { const f = CONTENT.feed.find(x => x.access === 'premium'); location.hash = '#/item/' + f.id; });
  await page.waitForTimeout(400);
  const exTxt = await page.locator('#itemView').innerText();
  check('premium exclusive opens once member', exTxt.length > 40 && !/premium required/i.test(exTxt));

  // --- the economy pass (9 Sep 2026) --------------------------------------
  // One sentence governs every check in this block: Inner Circle sits BESIDE
  // the Stardust ladder, never above it. Money buys access and things; rungs are
  // earned and nothing else opens them. Each check below is that sentence
  // asserted somewhere a fan could otherwise assume the opposite.

  // 1 · the annual plan, and the join ceremony it inherits
  await page.evaluate(() => {
    STATE.premium = false; STATE.premiumPlan = null; STATE.premiumSince = null;
    STATE.tenureYear = 1; save(); go('premium');
  });
  await page.waitForTimeout(400);
  const preJoin = await st();
  await page.locator('#premCta .btn-ember').click();
  await page.waitForTimeout(350);
  check('the join sheet offers a plan choice, and choosing a plan is not a purchase',
    await page.locator('#sheetBox .plan-opt').count() === 2 &&
    await page.locator('#sheetBox .btn-ember').count() === 1 &&
    await page.locator('#sheetBox .btn-primary').count() === 0);
  await page.locator('#sheetBox .plan-opt').nth(1).click();
  await page.waitForTimeout(350);
  const annualSheet = await page.locator('#sheetBox').innerText();
  check('the annual sheet keeps the whole ceremony: price, period, renewal, cancel terms, demo line',
    /1,490/.test(annualSheet) && /\/ year/i.test(annualSheet) && /once a year/i.test(annualSheet) &&
    /renews/i.test(annualSheet) && /cancel any time/i.test(annualSheet) &&
    /to the end of the period/i.test(annualSheet) &&
    /demo checkout, no payment taken/i.test(annualSheet),
    annualSheet.replace(/\n/g, ' | ').slice(0, 260));
  check('the annual sheet names the sign-up gifts the price is actually buying',
    /birthday card/i.test(annualSheet) && /Orbiter card/i.test(annualSheet));
  check('the join sheet states outright that a membership never moves a level',
    /alongside your level, never above it/i.test(annualSheet) &&
    /never changes your level/i.test(annualSheet) &&
    /rank perks are earned only/i.test(annualSheet));
  await page.locator('#sheetBox .btn-ember').click();
  await page.waitForTimeout(700);
  const sAnnual = await st();
  check('joining the annual plan grants the plan and nothing on the ladder',
    sAnnual.premium === true && sAnnual.premiumPlan === 'annual' &&
    sAnnual.lifetime === preJoin.lifetime && sAnnual.balance === preJoin.balance &&
    sAnnual.badges.length === preJoin.badges.length,
    `plan=${sAnnual.premiumPlan} lifetime ${preJoin.lifetime}→${sAnnual.lifetime}`);

  // 2 · "Your membership": the member's own record
  await page.evaluate(() => go('premium'));
  await page.waitForTimeout(400);
  const memPanel = await page.locator('#premMember').innerText();
  check('the membership panel states plan, renewal, tenure year and the year ahead',
    /plan/i.test(memPanel) && /annual/i.test(memPanel) && /renews/i.test(memPanel) &&
    /tenure/i.test(memPanel) && /year 1/i.test(memPanel) && /year 2 adds/i.test(memPanel),
    memPanel.replace(/\n/g, ' | ').slice(0, 240));
  check('the membership panel says the membership did not change the level',
    /alongside your level, never above it/i.test(memPanel) &&
    /rank perks are earned only/i.test(memPanel));

  // 3 · the tenure demo: a year of membership, and nothing else, moves
  const preTenure = await st();
  await page.locator('#premMember .cm-demo').click();
  await page.waitForTimeout(600);
  const postTenure = await st();
  check('the tenure demo advances a membership year and moves nothing on the ladder',
    postTenure.tenureYear === preTenure.tenureYear + 1 &&
    postTenure.lifetime === preTenure.lifetime && postTenure.balance === preTenure.balance &&
    postTenure.badges.length === preTenure.badges.length,
    `year ${preTenure.tenureYear}→${postTenure.tenureYear}`);
  check('year 2 previews year 3 rather than repeating the year it is in',
    /year 3 adds/i.test(await page.locator('#premMember').innerText()));

  // 4 · rank-gated content: earned only, and a membership is not a way in
  const rankItems = await page.evaluate(() =>
    CONTENT.feed.filter(f => f.access === 'rank').map(f => ({ id: f.id, rank: f.rank })));
  check('the pack carries rank-gated content, not only rank-gated merch',
    rankItems.length >= 2, JSON.stringify(rankItems));
  const myLvl = await page.evaluate(() => myLevelNo());
  const aboveMe = rankItems.filter(r => r.rank > myLvl)[0];
  const atOrBelow = rankItems.filter(r => r.rank <= myLvl)[0];
  await page.evaluate(id => { location.hash = '#/item/' + id; }, aboveMe.id);
  await page.waitForTimeout(400);
  const rankTxt = await page.locator('#itemView').innerText();
  check('a rank-gated reading stays shut for a paying member below the rung',
    await page.evaluate(() => STATE.premium) === true &&
    await page.locator('#itemView .d-gate.gate-rank').count() === 1 &&
    new RegExp('opens at level ' + aboveMe.rank, 'i').test(rankTxt),
    rankTxt.replace(/\n/g, ' | ').slice(0, 200));
  check('the rank gate says outright that Inner Circle does not open it',
    /Inner Circle does not open it/i.test(rankTxt) && /never above it/i.test(rankTxt));
  check('the rank gate offers no way to buy in: no ember, no route to the paywall',
    await page.locator('#itemView .d-gate.gate-rank .btn-ember').count() === 0 &&
    await page.locator('#itemView .d-gate.gate-rank a[href="#/premium"]').count() === 0);
  check('the earned gate is gold, the way an unlock is, and never money ember',
    await page.evaluate(() =>
      getComputedStyle(document.querySelector('#itemView .d-gate.gate-rank')).borderTopColor)
      === 'rgba(240, 195, 107, 0.4)');
  await page.evaluate(id => { location.hash = '#/item/' + id; }, atOrBelow.id);
  await page.waitForTimeout(400);
  check('a rung already earned opens, and says so in gold rather than in silence',
    await page.locator('#itemView .d-gate.gate-rank').count() === 0 &&
    /level \d+ · earned/i.test(await page.locator('#itemView').innerText()));
  // ...and climbing is what opens the one above, nothing else
  const preClimb = await st();
  await page.evaluate(r => { STATE.lifetime = CONTENT.levels[r - 1].threshold; save(); }, aboveMe.rank);
  await page.evaluate(id => { location.hash = '#/item/' + id; }, aboveMe.id);
  await page.waitForTimeout(400);
  check('the same reading opens once the rung is earned, and only then',
    await page.locator('#itemView .d-gate.gate-rank').count() === 0 &&
    (await page.locator('#itemView').innerText()).length > 200);
  await page.evaluate(l => { STATE.lifetime = l; save(); }, preClimb.lifetime);
  await page.evaluate(() => go('stardust'));
  await page.waitForTimeout(400);
  check('the ladder now says what each rung opens, and that a membership opens none of it',
    await page.locator('#levelLadder .lad-o').count() === 6 &&
    /Inner Circle sits alongside this ladder/i.test(await page.locator('#page-stardust').innerText()));

  // 5 · the dual unlock: two doors, one reading, neither of them a shortcut
  const dualItem = await page.evaluate(() => {
    const f = CONTENT.feed.filter(x => x.dual)[0];
    return f ? { id: f.id, access: f.access, stardustCost: f.stardustCost, cashPrice: f.cashPrice } : null;
  });
  check('one unlock carries two doors in the pack, and it is not the Stardust-only one',
    !!dualItem && dualItem.access === 'stardust' && dualItem.cashPrice > 0 &&
    dualItem.id !== (await page.evaluate(() => CONTENT.feed.filter(x => x.access === 'stardust')[0].id)),
    JSON.stringify(dualItem));
  await page.evaluate(() => { if (STATE.balance < 20) { STATE.balance = 20; save(); } });
  await page.evaluate(id => {
    STATE.unlocked = STATE.unlocked.filter(x => x !== id); save(); location.hash = '#/item/' + id;
  }, dualItem.id);
  await page.waitForTimeout(400);
  await page.evaluate(id => askUnlock(id), dualItem.id);
  await page.waitForTimeout(350);
  const dualSheet = await page.locator('#sheetBox').innerText();
  check('the dual sheet stands both doors up, gold above ember',
    await page.locator('#sheetBox .sheet-stack .btn-primary').count() === 1 &&
    await page.locator('#sheetBox .sheet-stack .btn-ember').count() === 1 &&
    new RegExp('unlock for ' + dualItem.stardustCost + ' stardust', 'i').test(dualSheet) &&
    /buy for/i.test(dualSheet) && /demo checkout, no payment taken/i.test(dualSheet),
    dualSheet.replace(/\n/g, ' | ').slice(0, 240));
  check('the dual sheet carries its own compliance line, at the point of doubt',
    /neither one moves your level/i.test(dualSheet) && /never standing/i.test(dualSheet));
  const preCashDoor = await st();
  await page.locator('#sheetBox .sheet-stack .btn-ember').click();
  await page.waitForTimeout(800);
  const postCashDoor = await st();
  check('the cash door grants the access and touches nothing on the ladder',
    postCashDoor.unlocked.indexOf(dualItem.id) !== -1 &&
    postCashDoor.balance === preCashDoor.balance && postCashDoor.lifetime === preCashDoor.lifetime &&
    postCashDoor.badges.length === preCashDoor.badges.length &&
    postCashDoor.ledger.length === preCashDoor.ledger.length,
    `balance ${preCashDoor.balance}→${postCashDoor.balance} lifetime ${preCashDoor.lifetime}→${postCashDoor.lifetime}`);
  check('the reading the cash door bought is the same reading',
    (await page.locator('#itemView').innerText()).length > 200);
  await page.evaluate(id => {
    STATE.unlocked = STATE.unlocked.filter(x => x !== id); save(); location.hash = '#/item/' + id;
  }, dualItem.id);
  await page.waitForTimeout(400);
  await page.evaluate(id => askUnlock(id), dualItem.id);
  await page.waitForTimeout(350);
  const preStardust = await st();
  await page.locator('#sheetBox .sheet-stack .btn-primary').click();
  await page.waitForTimeout(1200);
  const postStardust = await st();
  check('the Stardust door grants the same access, spends Stardust, and still never moves the level',
    postStardust.unlocked.indexOf(dualItem.id) !== -1 &&
    postStardust.balance === preStardust.balance - dualItem.stardustCost &&
    postStardust.lifetime === preStardust.lifetime,
    `balance ${preStardust.balance}→${postStardust.balance} lifetime ${preStardust.lifetime}→${postStardust.lifetime}`);

  // 6 · the referral bonus: Stardust, once ever, sized off the ladder itself
  await page.evaluate(() => { STATE.refJoins = []; STATE.refBonusPaid = false; save(); go('invite'); });
  await page.waitForTimeout(400);
  const bonusMath = await page.evaluate(() => ({
    bonus: referralBonusStardust(),
    glow: CONTENT.levels[1].threshold,
    beam: CONTENT.levels[2].threshold,
    reward: CONTENT.referral.reward,
    need: CONTENT.referral.bonusFriends
  }));
  check('the referral bonus is computed off the ladder rather than typed in, and clears the band',
    bonusMath.bonus === bonusMath.beam - bonusMath.glow &&
    bonusMath.glow + bonusMath.bonus >= bonusMath.beam,
    JSON.stringify(bonusMath));
  const bonusTxt = await page.locator('#inviteBonus').innerText();
  check('the referral page makes the promise in the ladder\'s own words, labelled placeholder',
    /Bring two Orbiters in two months/i.test(bonusTxt) && /Beam/.test(bonusTxt) &&
    /placeholder/i.test(bonusTxt) && new RegExp(String(bonusMath.bonus)).test(bonusTxt),
    bonusTxt.replace(/\n/g, ' | '));
  const preBonus = await st();
  await page.locator('#inviteBonus .cm-demo').click();
  await page.waitForTimeout(2000);
  const postBonus = await st();
  const bonusRows = postBonus.ledger.filter(l => /Referral bonus/i.test((l.label || {}).en || ''));
  check('the bonus lands through the real earn path, once, as a ledger entry',
    postBonus.refBonusPaid === true && bonusRows.length === 1 &&
    bonusRows[0].kind === 'earn' && bonusRows[0].amount === bonusMath.bonus,
    JSON.stringify(bonusRows));
  check('the bonus is Stardust the fan earned, so lifetime rises with it',
    postBonus.lifetime === preBonus.lifetime + bonusMath.bonus + bonusMath.need * bonusMath.reward,
    `lifetime ${preBonus.lifetime}→${postBonus.lifetime}`);
  await page.evaluate(() => simulateFriend());
  await page.waitForTimeout(1600);
  const postSecond = await st();
  check('the bonus is once ever, however it is reached again',
    postSecond.ledger.filter(l => /Referral bonus/i.test((l.label || {}).en || '')).length === 1);
  // The card page carries the card's own decoration pickers now, and both
  // point at the shop. The referral promise is everything else, and that is
  // the copy that must never mention money.
  const pickerTxt = (await page.locator('#avatarPicker').innerText()) + '\n' +
                    (await page.locator('#skinPicker').innerText());
  const refTxt = (await page.locator('#page-invite').innerText()).split('\n')
    .filter(l => l.trim() && pickerTxt.indexOf(l) === -1).join('\n');
  check('no cash anywhere in referral copy',
    !/฿/.test(refTxt) && !/\bbuy\b|\bprice\b|\bpayout\b|\bcash\b/i.test(refTxt),
    refTxt.replace(/\n/g, ' | ').slice(0, 200));
  await page.evaluate(() => { setLang('th'); go('invite'); });
  await page.waitForTimeout(400);
  const refTh = await page.locator('#page-invite').innerText();
  check('no cash anywhere in referral copy, Thai side, and the promise renders',
    !/฿/.test(refTh) && /Orbiters/.test(refTh) && refTh.length > 120);
  await page.evaluate(() => { setLang('en'); go('feed'); });
  await page.waitForTimeout(300);

  // 7 · the frame itself: beside the ladder, never on top of it
  let frameStrays = [];
  for (const r of ['premium', 'stardust', 'invite']) {
    await page.evaluate(rt => go(rt), r);
    await page.waitForTimeout(160);
    const seen = await page.evaluate(() => document.querySelector('#main').innerText);
    if (/on top of the (ranking|ladder)|above the ladder|above your ranking/i.test(seen)) frameStrays.push(r);
  }
  check('no surface ever says a membership sits on top of the ranking',
    frameStrays.length === 0, frameStrays.join(' | '));

  // P11 announcements
  await page.evaluate(() => { location.hash = '#/news'; });
  await page.waitForTimeout(400);
  check('2 announcements', await page.locator('#newsList > *').count() >= 2);
  // The date is a dateline under the title, not a gold kicker over it.
  check('announcement dates follow the title and carry no gold', await page.evaluate(() => {
    const a = document.querySelector('#newsList .ann');
    const t = a.querySelector('.ann-t'), d = a.querySelector('.ann-d');
    const titleFirst = !!(t.compareDocumentPosition(d) & Node.DOCUMENT_POSITION_FOLLOWING);
    return titleFirst && getComputedStyle(d).color !== 'rgb(240, 195, 107)';
  }));

  // Missions: a mission whose flow already works is not marked SOON.
  await page.evaluate(() => go('missions'));
  await page.waitForTimeout(400);
  check('Bring a Friend is live and links to the invite flow', await page.evaluate(() => {
    const row = [...document.querySelectorAll('#missionList .ms')]
      .find(el => el.innerText.includes('Bring a Friend'));
    if (!row) return false;
    const a = row.querySelector('a[href="#/invite"]');
    return !!a && !/soon/i.test(row.innerText);
  }));

  // More: three named groups, entries not cards, sign out and reset quieter
  await page.evaluate(() => go('more'));
  await page.waitForTimeout(400);
  check('More groups its rows into three labelled blocks',
    await page.locator('#moreList .more-grp').count() === 3 &&
    await page.locator('#moreList .more-k').count() === 3);
  // The group labels describe what is in them: navigation, account, prototype.
  const moreKeys = await page.evaluate(() =>
    [...document.querySelectorAll('#moreList .more-k')].map(e => e.textContent.trim()));
  check('More group labels describe their own contents',
    /where else to go/i.test(moreKeys[0]) && /your account/i.test(moreKeys[1]) &&
    /prototype/i.test(moreKeys[2]) && !/your passport/i.test(moreKeys.join(' ')),
    moreKeys.join(' | '));
  // A row that ends something does not wear the chevron that promises a
  // destination.
  const endRows = await page.evaluate(() => [...document.querySelectorAll('#moreList .rowlink')]
    .filter(el => /sign out|reset demo/i.test(el.innerText))
    .map(el => [el.innerText.split('\n')[0], !!el.querySelector('.rl-go')]));
  check('sign out and reset drop the leads-somewhere chevron',
    endRows.length === 2 && endRows.every(r => r[1] === false), JSON.stringify(endRows));
  const moreBoxed = await page.evaluate(() => [...document.querySelectorAll('#moreList .rowlink')]
    .filter(el => {
      const cs = getComputedStyle(el);
      return cs.borderTopWidth !== '0px' || cs.borderTopLeftRadius !== '0px' ||
             !['rgba(0, 0, 0, 0)', 'transparent'].includes(cs.backgroundColor);
    }).length);
  check('More rows are rule-separated entries, not bordered cards', moreBoxed === 0, `boxed=${moreBoxed}`);
  check('sign out and reset read quieter than content rows',
    await page.locator('#moreList .rowlink-quiet').count() === 3);
  // An order outlives its toast: the account run lists what was bought, what
  // it came to, and when.
  await page.evaluate(() => openOrders());
  await page.waitForTimeout(400);
  const ordersSheet = await page.locator('#sheetBox').innerText();
  check('placed orders survive the toast in an Orders list', await page.evaluate(() => {
    const s = CONTENT.shop[0];
    const box = document.querySelector('#sheetBox').innerText;
    return STATE.orderLog.length >= 1 && box.includes(s.name.en) &&
           box.includes(money(s.price + SHIP_FLAT));
  }) && /demo checkout, no payment taken/i.test(ordersSheet),
    ordersSheet.replace(/\n/g, ' | ').slice(0, 200));
  await page.evaluate(() => closeSheet());
  await page.waitForTimeout(300);
  // Signing out asks first, and neither button is a bare "Cancel".
  await page.evaluate(() => askSignOut());
  await page.waitForTimeout(400);
  const soSheet = await page.locator('#sheetBox').innerText();
  check('sign out asks first and both buttons name their action',
    await page.evaluate(() => STATE.signedIn) === true &&
    /stay signed in/i.test(soSheet) && /sign out/i.test(soSheet) &&
    !/^\s*cancel\s*$/im.test(soSheet), soSheet.replace(/\n/g, ' | '));
  await page.evaluate(() => closeSheet());
  await page.waitForTimeout(300);
  // No bare "Cancel" survives on the checkout or the reset sheet either.
  await page.evaluate(() => openCheckout(CONTENT.shop[1].id));
  await page.waitForTimeout(350);
  const ckDismiss = await page.locator('#sheetBox .btn-ghost').innerText();
  await page.evaluate(() => { closeSheet(); askReset(); });
  await page.waitForTimeout(350);
  const rsDismiss = await page.locator('#sheetBox .btn-ghost').innerText();
  check('checkout and reset name their dismiss instead of saying Cancel',
    /keep shopping/i.test(ckDismiss) && /not now/i.test(rsDismiss) &&
    !/^\s*cancel\s*$/i.test(ckDismiss.trim()) && !/^\s*cancel\s*$/i.test(rsDismiss.trim()),
    ckDismiss + ' / ' + rsDismiss);
  await page.evaluate(() => closeSheet());
  await page.waitForTimeout(300);
  await page.evaluate(() => go('more'));
  await page.waitForTimeout(300);

  // The 44px floor, in both languages
  const small = await page.evaluate(() => [...document.querySelectorAll('.btn')]
    .filter(el => el.offsetParent !== null)
    .filter(el => { const r = el.getBoundingClientRect(); return r.height < 44 || r.width < 88; })
    .map(el => `${el.textContent.trim().slice(0, 18)}:${Math.round(el.getBoundingClientRect().height)}x${Math.round(el.getBoundingClientRect().width)}`));
  check('every visible button clears the 44px target floor', small.length === 0, small.join(', '));
  const tapTargets = await page.evaluate(() => {
    const hit = el => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el, '::after');
      return Math.max(r.height, parseFloat(cs.height) || 0);
    };
    return {
      tabs: [...document.querySelectorAll('.tab')].map(hit),
      lang: [...document.querySelectorAll('.topbar .lang button')].map(hit),
      mode: [document.querySelector('.mode-btn')].map(hit)
    };
  });
  check('tabs, language segments and the artist chip reach a 44px target',
    tapTargets.tabs.every(h => h >= 44) && tapTargets.lang.every(h => h >= 44) &&
    tapTargets.mode.every(h => h >= 44), JSON.stringify(tapTargets));
  // ...and the target is a real box, not a pseudo-element another control
  // paints over. Probed with elementFromPoint at both edges of every one.
  const hitProbe = async () => page.evaluate(() => {
    const probe = sel => {
      const el = document.querySelector(sel);
      if (!el) return [sel, 'missing'];
      el.scrollIntoView({ block: 'center' });
      const r = el.getBoundingClientRect();
      const owns = (x, y) => { const h = document.elementFromPoint(x, y);
        return !!(h && (h === el || el.contains(h))); };
      const cx = r.left + r.width / 2;
      return [sel, Math.round(r.height), owns(cx, r.top + 2) && owns(cx, r.bottom - 2)];
    };
    return ['#artistToggle', '#langEn', '#langTh', '.feed-head .chip-link',
            '.tk-go', '#feedList .chip-link'].map(probe);
  });
  await page.evaluate(() => go('feed'));
  await page.waitForTimeout(400);
  const hits = await hitProbe();
  check('every header and feed action link owns its own 44px hit box',
    hits.every(h => h[1] >= 44 && h[2] === true), JSON.stringify(hits));

  // Sign-in carries the language toggle, so Thai is choosable at the door
  await page.evaluate(() => { STATE.signedIn = false; save(); go('signin'); });
  await page.waitForTimeout(400);
  check('sign-in masthead carries the EN/Thai toggle',
    await page.locator('#page-signin .signin-lang #langThIn').isVisible() &&
    await page.locator('#page-signin .signin-lang #langEnIn').isVisible());
  check('sign-in drops the Google glyph and keeps the wordmark',
    await page.locator('#page-signin .gmark').count() === 0 &&
    /continue with google/i.test(await page.locator('#page-signin').innerText()));
  await page.evaluate(() => { STATE.signedIn = true; save(); go('feed'); });
  await page.waitForTimeout(400);

  // Thai toggle
  await page.click('#langTh');
  await page.waitForTimeout(500);
  await page.evaluate(() => { location.hash = '#/feed'; });
  await page.waitForTimeout(400);
  check('Thai renders on feed', /[฀-๿]/.test(await page.locator('#main').innerText()));
  await page.evaluate(() => go('stardust'));
  await page.waitForTimeout(300);
  check('Thai renders on passport', /[฀-๿]/.test(await page.locator('#page-stardust').innerText()));
  // The lockup is a signature, so it does not transliterate in Thai.
  check('bilingual lockup is identical in Thai',
    (await page.locator('#page-stardust .lockup .lk-en').innerText()).trim() === 'KAI RIVERA' &&
    (await page.locator('#page-stardust .lockup .lk-cn').innerText()).trim() === '吴翊歌');
  // Latin words inside Thai titles sit in the UI face, not a serif mid-line.
  check('Latin inside Thai titles renders in the UI face',
    /Schibsted/.test(await page.evaluate(() =>
      getComputedStyle(document.querySelector('#page-stardust h2.sect')).fontFamily)));
  // The 44px floor has to hold for short Thai labels too
  const smallTh = await page.evaluate(() => { go('feed'); return null; });
  await page.waitForTimeout(400);
  const thSmall = await page.evaluate(() => [...document.querySelectorAll('.btn')]
    .filter(el => el.offsetParent !== null)
    .filter(el => { const r = el.getBoundingClientRect(); return r.height < 44 || r.width < 88; })
    .map(el => `${el.textContent.trim()}:${Math.round(el.getBoundingClientRect().width)}`));
  check('short Thai labels still get a real target', thSmall.length === 0, thSmall.join(', '));
  const thHits = await hitProbe();
  check('the same hit boxes hold when the label is two Thai glyphs',
    thHits.every(h => h[1] >= 44 && h[2] === true), JSON.stringify(thHits));
  await page.click('#langEn');
  await page.waitForTimeout(300);

  // The signature ring stays inside the earned family: no ember in the gold.
  check('the stardust ring gradient never lands on the paid colour', await page.evaluate(() => {
    const stops = [...document.querySelectorAll('#stardustGrad stop')].map(s => s.getAttribute('stop-color'));
    return stops[stops.length - 1].toUpperCase() === '#A9761F' && !stops.some(c => /E05545/i.test(c));
  }));

  // Toasts clear the title zone instead of landing on top of it
  await page.evaluate(() => { go('stardust'); toast('Test', 'Position check'); });
  await page.waitForTimeout(400);
  const clash = await page.evaluate(() => {
    const toastEl = document.querySelector('.toast');
    const title = document.querySelector('#page-stardust .lockup') ||
                  document.querySelector('#page-stardust h2.sect');
    const tabs = document.querySelector('.tabs');
    if (!toastEl || !title) return { overlap: true };
    const a = toastEl.getBoundingClientRect(), b = title.getBoundingClientRect();
    const c = tabs.getBoundingClientRect();
    return { overlap: !(a.bottom < b.top || a.top > b.bottom), aboveTabs: a.bottom <= c.top + 1 };
  });
  check('a toast never lands on the page title and clears the tab bar',
    !clash.overlap && clash.aboveTabs !== false, JSON.stringify(clash));
  await page.waitForTimeout(3600);

  // The topbar separates spendable balance from lifetime progress
  const meterSplit = await page.evaluate(() => {
    const bal = document.querySelector('.meter-bal');
    const nxt = document.querySelector('.meter-next');
    const lvl = document.querySelector('.meter-lvl');
    return {
      text: nxt.textContent,
      nested: nxt.parentElement === bal.parentElement && nxt.previousElementSibling === lvl,
      balSize: parseFloat(getComputedStyle(bal).fontSize),
      nxtSize: parseFloat(getComputedStyle(nxt).fontSize),
      nxtColour: getComputedStyle(nxt).color
    };
  });
  check('lifetime progress demotes under the level, below the balance',
    /more earned to/i.test(meterSplit.text) && meterSplit.nested &&
    meterSplit.nxtSize < meterSplit.balSize && meterSplit.nxtColour === 'rgb(135, 127, 140)',
    JSON.stringify(meterSplit));

  // The passport shows the whole ladder, with the current step marked
  await page.evaluate(() => go('stardust'));
  await page.waitForTimeout(400);
  check('the passport shows the six-step level ladder with the current level marked',
    await page.locator('#levelLadder .lad-s').count() === 6 &&
    await page.locator('#levelLadder .lad-s.on').count() === 1 &&
    /Spark/i.test(await page.locator('#levelLadder').innerText()) &&
    /Constellation/i.test(await page.locator('#levelLadder').innerText()));

  // A +25 earn has to read bigger than a +4 grant
  const burstSizes = await page.evaluate(async () => {
    const read = () => {
      const rings = document.querySelector('.burst-rings');
      return {
        h: rings.getBoundingClientRect().height,
        rings: document.querySelectorAll('.burst-rings i').length,
        hold: !!document.querySelector('.burst-hold')
      };
    };
    earnMoment({ amount: 4, label: { en: 'x', th: 'x' }, title: 'Small', sub: '' });
    await new Promise(r => setTimeout(r, 120));
    const small = read();
    closeBurst();
    await new Promise(r => setTimeout(r, 120));
    earnMoment({ amount: 25, label: { en: 'x', th: 'x' }, title: 'Big', sub: '', hold: 'Warehouse 3' });
    await new Promise(r => setTimeout(r, 120));
    const big = read();
    closeBurst();
    return { small, big };
  });
  check('a big earn bursts bigger, with an extra ring and a held name',
    burstSizes.big.h > burstSizes.small.h &&
    burstSizes.big.rings === burstSizes.small.rings + 1 &&
    burstSizes.big.hold && !burstSizes.small.hold, JSON.stringify(burstSizes));
  check('the badge drop carries no card in the burst moment', await page.evaluate(() => {
    earnMoment({ amount: 25, label: { en: 'x', th: 'x' }, title: 'Badge', sub: '',
                 badgeId: CONTENT.badges[0].id, badgeFresh: true });
    const cs = getComputedStyle(document.querySelector('.burst-badge'));
    const clean = cs.borderTopWidth === '0px' &&
      ['rgba(0, 0, 0, 0)', 'transparent'].includes(cs.backgroundColor);
    closeBurst();
    return clean;
  }));
  await page.evaluate(() => { STATE.balance = 35; STATE.lifetime = 260; save(); repaint(); });
  await page.waitForTimeout(300);

  // Artist mode reads enclosed: no fan meter, no fan tabs, its own exit
  await page.evaluate(() => go('artist'));
  await page.waitForTimeout(400);
  check('artist mode hides the fan Stardust meter and the fan tab bar',
    await page.locator('#meterBtn').isHidden() &&
    await page.locator('#tabs').isHidden() &&
    await page.locator('.artist-bar .chip').isVisible());
  await page.evaluate(() => exitArtistMode());
  await page.waitForTimeout(400);
  check('leaving artist mode brings the fan chrome back',
    await page.locator('#tabs').isVisible() && await page.locator('#meterBtn').isVisible());

  // structural
  const visiblePages = await page.evaluate(() =>
    [...document.querySelectorAll('section.page')].filter(el => getComputedStyle(el).display !== 'none').map(e => e.id));
  check('exactly one page visible (no router leak)', visiblePages.length === 1, visiblePages.join(','));
  const dupIds = await page.evaluate(() => {
    const ids = [...document.querySelectorAll('[id]')].map(e => e.id);
    return [...new Set(ids.filter((v, i, a) => a.indexOf(v) !== i))];
  });
  check('no duplicate runtime ids', dupIds.length === 0, dupIds.join(','));
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check('no horizontal overflow at 400px', overflow <= 0, `overflow=${overflow}px`);
  const balBefore = (await st()).balance;
  const threadBefore = await page.evaluate(() => STATE.twinThread.length);
  await page.reload();
  await page.waitForTimeout(800);
  check('state persists across reload', await page.evaluate(() => STATE.balance) === balBefore);
  // The companion thread is state, so it comes back with everything else, and
  // the stored reply ids re-read the pack rather than a frozen sentence.
  await page.evaluate(() => go('twin'));
  await page.waitForTimeout(400);
  check('the companion thread survives a reload',
    await page.evaluate(() => STATE.twinThread.length) === threadBefore && threadBefore > 0 &&
    await page.locator('#page-twin .bubble.kai').count() >= 2,
    `thread=${threadBefore}`);

  // --- Kai's DNA on screen ------------------------------------------------
  await page.evaluate(() => go('stardust'));
  await page.waitForTimeout(400);
  check('bilingual lockup on the passport',
    (await page.locator('#page-stardust .lockup .lk-cn').innerText()).trim() === '吴翊歌' &&
    /Noto Serif SC/.test(await page.evaluate(() =>
      getComputedStyle(document.querySelector('#page-stardust .lk-cn')).fontFamily)));

  // --- reset restores the placeholder edition, it does not blank it --------
  await page.evaluate(() => { MEDIA['signin-hero'] = null; MEDIA['event-02'] = null; resetDemo(); });
  await page.waitForTimeout(900);
  const afterReset = await page.evaluate(() =>
    Object.keys(MEDIA_DEFAULTS).filter(k => MEDIA[k] !== MEDIA_DEFAULTS[k]));
  check('reset restores the MEDIA defaults rather than nulling them',
    afterReset.length === 0, afterReset.join(','));
  // "Reset demo" clears the companion thread and puts the allowance back.
  check('reset clears the companion thread and restores the message allowance',
    await page.evaluate(() => STATE.twinThread.length) === 0 &&
    await page.evaluate(() => [STATE.msgUsed, STATE.msgBought].join(',')) === '0,0' &&
    await page.evaluate(() => msgLeft()) === 200);
  // The Circle's rooms are seeded, so a reset restores them rather than
  // emptying them — the fan's own lines and the scripted answer they pulled
  // go, the Orbiters' logs come back at their seeded lengths, and everything a
  // contest granted is gone with them.
  check('reset restores the seeded Circle rooms rather than emptying them',
    await page.evaluate(() => STATE.rooms.length) === 3 &&
    await page.evaluate(() => STATE.rooms.map(r => r.log.length).join(',')) === '10,9,7' &&
    await page.evaluate(() => STATE.rooms.every(r => r.log.every(m => !m.mine))) &&
    await page.evaluate(() => STATE.roomReplied.length) === 0 &&
    await page.evaluate(() => STATE.contestEntries.length + STATE.contestWins.length +
                              STATE.cmRsvp.length + STATE.marks.length) === 0);
  check('reset lands on a sign-in that still has its photograph',
    await page.locator('#page-signin').isVisible() &&
    await page.locator('#page-signin .signin-hero .slot-shot').count() === 1);
  check('bilingual lockup on the sign-in masthead',
    (await page.locator('#page-signin .lockup .lk-cn').innerText()).trim() === '吴翊歌');

  // --- the rebrand: ORBIT, powered by Fanframe (Isaac, 27 Aug 2026) -------
  // The product the fan sees is ORBIT. Fanframe is credited, quietly, and
  // "Fan Passport" is gone from every fan-facing string in the chrome.
  check('the sign-in masthead carries the ORBIT mark and the Fanframe credit',
    (await page.locator('#page-signin .signin-mark .m1').innerText()).trim() === 'ORBIT' &&
    /powered by Fanframe/i.test(await page.locator('#page-signin .signin-mark .m2').innerText()));
  check('the document title names the product and the artist',
    await page.title() === 'ORBIT — Kai Rivera', await page.title());
  check('the sign-in promise names the fandom',
    /\bOrbiters\b/.test(await page.locator('#page-signin .lede').innerText()));

  await page.click('text=Continue with Google');
  await page.waitForTimeout(900);
  check('the topbar brand mark is ORBIT, standing alone',
    (await page.locator('.topbar .brand').innerText()).trim() === 'ORBIT' &&
    await page.locator('.topbar .brand .sb').count() === 0);
  // Per-page title suffixes still resolve off the route.
  await page.evaluate(() => go('shop'));
  await page.waitForTimeout(300);
  check('per-page title suffixes still work', /^ORBIT — .+/.test(await page.title()) &&
    await page.title() !== 'ORBIT — Kai Rivera', await page.title());

  await page.evaluate(() => go('invite'));
  await page.waitForTimeout(400);
  check('the invite card is the Orbiter card, in both the title and the card face',
    /Orbiter card/i.test(await page.locator('#page-invite .title').innerText()) &&
    /ORBIT/.test(await page.locator('#passCard .pass-brand').innerText()) &&
    /Orbiter card/i.test(await page.locator('#passCard .pass-artist').innerText()));
  check('referral copy welcomes a new Orbiter',
    /Orbiters? /i.test(await page.locator('#inviteCount').innerText()));

  await page.evaluate(() => go('more'));
  await page.waitForTimeout(400);
  check('More carries the quiet platform credit',
    /powered by Fanframe/i.test(await page.locator('#page-more .brand-credit').innerText()) &&
    /ORBIT/.test(await page.locator('#page-more .brand-credit .bc-mk').innerText()));
  check('the terms sheet names the product and its platform', await page.evaluate(() => {
    openLegal();
    const txt = document.querySelector('.sheet-box .brand-credit').textContent;
    closeSheet();
    return /ORBIT/.test(txt) && /powered by Fanframe/i.test(txt);
  }));
  // "Fan Passport" is retired from the chrome dictionaries, en and th alike.
  const stale = await page.evaluate(() => {
    const hits = [];
    ['en', 'th'].forEach(l => Object.entries(I18N[l]).forEach(([k, v]) => {
      if (/fan passport/i.test(v) || /แฟนพาสปอร์ต/.test(v)) hits.push(l + ':' + k);
    }));
    return hits;
  });
  check('"Fan Passport" is retired from the en and th UI dictionaries',
    stale.length === 0, stale.join(','));

  // --- the type scale (Aug 2026 consolidation) ----------------------------
  // One scale, nine steps, every rule in the stylesheet on one of them.
  const SCALE = [11, 13, 15, 17, 20, 24, 30, 38, 47];
  const cssSizes = await page.evaluate(() => {
    const css = [...document.querySelectorAll('style')].map(s => s.textContent).join('\n');
    return [...new Set([...css.matchAll(/font-size:\s*([0-9.]+)px/g)].map(m => parseFloat(m[1])))].sort((a, b) => a - b);
  });
  check('the stylesheet holds at most nine font sizes',
    cssSizes.length <= 9, cssSizes.join(','));
  check('every stylesheet size is a step on the shared scale',
    cssSizes.every(v => SCALE.includes(v)), cssSizes.filter(v => !SCALE.includes(v)).join(',') || 'all on scale');

  // Two weights per family, and no webfont downloaded for a weight we never set.
  const weights = await page.evaluate(() => {
    const css = [...document.querySelectorAll('style')].map(s => s.textContent).join('\n');
    return [...new Set([...css.matchAll(/font-weight:\s*([0-9]+)/g)].map(m => m[1]))].sort();
  });
  check('no weight heavier than 600 is set anywhere',
    !weights.includes('700') && !weights.includes('800'), weights.join(','));

  // --- the label floor ----------------------------------------------------
  // 11px is the floor for anything a fan reads, in both languages and in the
  // tab bar too. Measured on rendered text, not on the rules, so an inherited
  // or overridden size cannot slip under it.
  const floorProbe = async () => page.evaluate(() => {
    const bad = [];
    document.querySelectorAll('body *').forEach(el => {
      if (!el.offsetParent && el.tagName !== 'BODY') return;
      const own = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
      if (!own) return;
      const fs = parseFloat(getComputedStyle(el).fontSize);
      if (fs < 11) bad.push((el.className || el.tagName) + '@' + fs + 'px');
    });
    return [...new Set(bad)];
  });
  const routes = ['feed', 'stardust', 'scan', 'shop', 'events', 'premium', 'invite', 'more', 'missions', 'news', 'twin'];
  let underFloor = [];
  for (const lang of ['en', 'th']) {
    await page.evaluate(l => setLang(l), lang);
    for (const r of routes) {
      await page.evaluate(rt => go(rt), r);
      await page.waitForTimeout(120);
      underFloor = underFloor.concat((await floorProbe()).map(s => lang + '/' + r + ' ' + s));
    }
  }
  await page.evaluate(() => setLang('en'));
  check('no rendered text sits under the 11px floor, en or th',
    underFloor.length === 0, underFloor.slice(0, 5).join(' | '));
  await page.evaluate(() => go('signin'));
  await page.waitForTimeout(200);
  check('the tab bar labels clear the floor too', await page.evaluate(() => {
    go('feed');
    return [...document.querySelectorAll('.tab .tl')]
      .every(el => parseFloat(getComputedStyle(el).fontSize) >= 11);
  }));

  // --- the motion system (Aug 2026) ---------------------------------------
  // One pressed-state anatomy, declared once, answering on every tappable
  // thing rather than component by component.
  await page.evaluate(() => go('feed'));
  await page.waitForTimeout(300);
  const pressed = await page.evaluate(() => {
    const sels = ['.btn', '.tab', '.chip-link', '.rowlink', '.lang button',
                  '.mode-btn', '.meter', '.rail-card', '.tk-go', '.back'];
    const seen = [], bad = [];
    for (const s of sels) {
      const el = document.querySelector(s);
      if (!el) continue;
      seen.push(s);
      const cs = getComputedStyle(el);
      const dur = parseFloat(cs.transitionDuration) * 1000;
      const props = cs.transitionProperty;
      if (dur < 120 || dur > 200) bad.push(s + ' dur=' + dur);
      if (!/transform/.test(props)) bad.push(s + ' props=' + props);
    }
    return { seen, bad };
  });
  check('every tappable surface carries the one pressed-state transition',
    pressed.seen.length >= 8 && pressed.bad.length === 0,
    pressed.bad.join(' | ') || pressed.seen.length + ' surfaces');
  check('the pressed state is scale(.97) and comes from one declaration',
    await page.evaluate(() => {
      const css = [...document.querySelectorAll('style')].map(s => s.textContent).join('\n');
      const decls = [...css.matchAll(/transform:\s*scale\(\.9[0-9]*\)/g)].map(m => m[0]);
      return /--press:\s*scale\(\.97\)/.test(css) &&
             /:active\{\s*transform:var\(--press\)/.test(css.replace(/\s+/g, ' ').replace(/ \{/g, '{')) &&
             decls.length === 0;
    }));
  // Transitions move transform and opacity only, on one curve, in 120-200ms.
  // The two ring-fill transitions belong to the reward system and are named
  // as such in the stylesheet.
  const transitions = await page.evaluate(() => {
    const css = [...document.querySelectorAll('style')].map(s => s.textContent).join('\n');
    return [...css.matchAll(/transition:\s*([^;}]+)/g)].map(m => m[1].trim())
      .filter(v => v !== 'none' && !/stroke-dasharray/.test(v));
  });
  check('every interaction transition is transform/opacity on the one curve',
    transitions.length > 0 &&
    transitions.every(v => /var\(--ease\)/.test(v) &&
      /var\(--t-[123]\)/.test(v) &&
      !/(background|border|color|width|height|margin|padding|top|left)/.test(v)),
    transitions.filter(v => !/var\(--ease\)/.test(v)).join(' | ') || transitions.length + ' transitions');
  check('the reduced-motion block stills the travel and keeps the feedback',
    await page.evaluate(() => {
      const css = [...document.querySelectorAll('style')].map(s => s.textContent).join('\n');
      const block = css.slice(css.indexOf('prefers-reduced-motion'));
      return /button, a\[href\], \[role="button"\]/.test(block) && /transition:none/.test(block);
    }));

  // --- elevation: two tokens, pure black, never tinted ---------------------
  const shadows = await page.evaluate(() => {
    const css = [...document.querySelectorAll('style')].map(s => s.textContent).join('\n');
    // strip the :root block where the tokens themselves are defined
    const body = css.slice(css.indexOf('}', css.indexOf(':root{')) + 1);
    const uses = [...body.matchAll(/box-shadow:\s*([^;}]+)/g)].map(m => m[1].trim())
      .filter(v => v !== 'none' && !/^0 0 0 0 /.test(v));
    return {
      defined: (css.match(/--shadow-(raised|overlay):/g) || []).sort(),
      uses,
      // anything left that is neither a token nor one of the three glows
      strays: uses.filter(v => !/var\(--shadow-(raised|overlay)\)/.test(v))
    };
  });
  check('exactly two elevation tokens exist',
    shadows.defined.length === 2, shadows.defined.join(','));
  const REWARD_GLOW = /rgba\(240,195,107|rgba\(132,185,198/;   // burst core, scan sweep
  check('every elevation shadow routes through a token, and the only shadows that do not are the reward glows',
    shadows.strays.every(v => REWARD_GLOW.test(v)),
    shadows.strays.filter(v => !REWARD_GLOW.test(v)).join(' | ') || 'clean');
  check('no elevation token is tinted', await page.evaluate(() => {
    const cs = getComputedStyle(document.documentElement);
    return ['--shadow-raised', '--shadow-overlay'].every(t => {
      const v = cs.getPropertyValue(t);
      return /rgba\(0, ?0, ?0/.test(v) && !/rgba\((?!0, ?0, ?0)/.test(v);
    });
  }));
  check('the gold glow appears on the reward surfaces only', await page.evaluate(() => {
    const css = [...document.querySelectorAll('style')].map(s => s.textContent).join('\n');
    const body = css.slice(css.indexOf('}', css.indexOf(':root{')) + 1);
    const gold = [...body.matchAll(/[^;{}\n]*box-shadow:[^;}]*rgba\(240,195,107[^;}]*/g)].map(m => m[0]);
    // one only: the earn burst's core. The stardust rings use filter:drop-shadow.
    return gold.length === 1;
  }));

  // --- the scrim standard -------------------------------------------------
  // One recipe, black, sized to the text zone rather than to the picture, on
  // every caption that sits over a photograph.
  // The recipe is black at .55 AND its fade is confined to the 66px lead-in:
  // a fade that runs the whole caption box leaves the title's first line on
  // whatever alpha its position happens to earn, which is the geometry that
  // broke AA over the rooftop's sky. Both halves are asserted, because either
  // one alone can be true while the words are still unreadable.
  check('one scrim recipe is defined, pure black, and fades only across the lead-in',
    await page.evaluate(() => {
      const cs = getComputedStyle(document.documentElement);
      const a = cs.getPropertyValue('--scrim'), b = cs.getPropertyValue('--scrim-top');
      const flat = s => /calc\(100% ?- ?66px\)/.test(s);
      return /to top, ?rgba\(0, ?0, ?0, ?\.?0?\.55\)/.test(a.replace(/\s+/g, ' ')) &&
             /to bottom, ?rgba\(0, ?0, ?0, ?\.?0?\.55\)/.test(b.replace(/\s+/g, ' ')) &&
             /transparent/.test(a) && /transparent/.test(b) && flat(a) && flat(b);
    }));
  // No caption may set a lead-in shorter than that fade, or the fade runs off
  // the top of the box and the first line lands on partial alpha again.
  check('no on-photo caption sets a lead-in shorter than the 66px fade',
    await page.evaluate(() => {
      const css = [...document.querySelectorAll('style')].map(s => s.textContent).join('\n');
      return ['.fi-ed-cap', '.dm-hero-cap', '.prem-cap'].every(sel => {
        const rule = (css.match(new RegExp('\\' + sel + '\\{[^}]*\\}')) ||
                      css.match(new RegExp('\\' + sel + '\\s*\\{[^}]*\\}')) || [''])[0];
        const pad = (rule.match(/padding:\s*(\d+)px/) || [, '0'])[1];
        return parseInt(pad, 10) >= 66;
      });
    }));
  const onPhoto = await page.evaluate(async () => {
    const out = [];
    for (const [route, sel] of [['feed', '.fi-ed-cap'], ['events', '.fi-ed-cap'],
                                ['premium', '.prem-cap']]) {
      go(route);
      await new Promise(r => setTimeout(r, 150));
      document.querySelectorAll(sel).forEach(el => {
        const bg = getComputedStyle(el).backgroundImage;
        out.push([route + ' ' + sel, /rgba\(0, ?0, ?0, ?0?\.55\)/.test(bg) && /to top/.test(bg)]);
      });
    }
    return out;
  });
  check('every on-photo caption carries the one scrim, on its own text zone',
    onPhoto.length >= 3 && onPhoto.every(([, ok]) => ok),
    onPhoto.filter(([, ok]) => !ok).map(([n]) => n).join(',') || onPhoto.length + ' captions');
  // Measured against the brightest placeholder in the set: the clay court.
  await page.evaluate(() => go('feed'));
  await page.waitForTimeout(400);
  const clay = await page.evaluate(() => {
    const img = [...document.querySelectorAll('#feedList .fi-ed-media img')]
      .find(e => /clay/i.test(e.src));
    if (!img) return null;
    const cap = img.closest('.fi-ed-media').querySelector('.fi-ed-cap');
    const r = cap.getBoundingClientRect(), ri = img.getBoundingClientRect();
    return { scrimmed: /to top/.test(getComputedStyle(cap).backgroundImage),
             // the scrim covers the words and not the photograph
             share: Math.round((r.height / ri.height) * 100) };
  });
  check('the brightest placeholder gets the scrim on its words, not on its picture',
    clay && clay.scrimmed && clay.share <= 45, JSON.stringify(clay));

  // The Scrim Standard's acceptance test is MEASURED, not asserted, and it is
  // measured on its NAMED WORST CASE. The clay court used to be the benchmark
  // and it was the wrong one: it passed while the rooftop golden-hour unit sat
  // at 2.15:1, because the rooftop puts a blown-out sky and white rooftops
  // directly behind the title's first line — the thinnest part of any caption
  // scrim. Hide the caption's own type, photograph the exact rect the title
  // occupied, and take the BRIGHTEST composited pixel in it: the worst ground
  // a white title can land on. Both languages and both surfaces that carry the
  // recipe (the 4:5 feed unit and the detail hero), because Thai sets the
  // title at a different size and so lands on a different part of the picture.
  const decodePage = await browser.newPage();
  async function brightestBehind(sel, hideSel) {
    const rect = await page.evaluate(({ sel, hideSel }) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      el.scrollIntoView({ block: 'center' });
      document.querySelectorAll(hideSel).forEach(n => n.style.visibility = 'hidden');
      const r = el.getBoundingClientRect();
      return { x: Math.round(r.x), y: Math.round(r.y),
               width: Math.round(r.width), height: Math.round(r.height) };
    }, { sel, hideSel });
    if (!rect || rect.width < 2 || rect.height < 2) return null;
    await page.waitForTimeout(120);
    const buf = await page.screenshot({ clip: rect });
    await page.evaluate(hs => document.querySelectorAll(hs)
      .forEach(n => n.style.visibility = ''), hideSel);
    return decodePage.evaluate(async src => {
      const img = new Image();
      await new Promise(r => { img.onload = r; img.src = src; });
      const c = document.createElement('canvas');
      c.width = img.width; c.height = img.height;
      const x = c.getContext('2d'); x.drawImage(img, 0, 0);
      const d = x.getImageData(0, 0, c.width, c.height).data;
      let best = [0, 0, 0], bl = -1;
      for (let i = 0; i < d.length; i += 4) {
        const l = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
        if (l > bl) { bl = l; best = [d[i], d[i + 1], d[i + 2]]; }
      }
      return best;
    }, 'data:image/png;base64,' + buf.toString('base64'));
  }
  const lin = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  const cr = (a, b) => (Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05);

  const worstCase = [];
  for (const lang of ['en', 'th']) {
    await page.evaluate(l => setLang(l), lang);
    await page.evaluate(() => go('feed'));
    await page.waitForTimeout(450);
    const id = await page.evaluate(() => {
      document.querySelectorAll('[data-worst]').forEach(n => n.removeAttribute('data-worst'));
      const m = [...document.querySelectorAll('#feedList .fi-ed-media')]
        .find(e => /rooftop/i.test((e.querySelector('img') || {}).src || ''));
      if (!m) return null;
      m.setAttribute('data-worst', '1');
      return (m.getAttribute('href') || '').replace(/^#\//, '');
    });
    if (!id) { worstCase.push(['feed/' + lang, 0]); continue; }
    const feedBg = await brightestBehind('[data-worst] .fi-ed-cap .on-photo',
      '[data-worst] .fi-ed-cap .on-photo, [data-worst] .fi-ed-cap .on-photo-m');
    worstCase.push(['feed/' + lang, feedBg ? cr([255, 255, 255], feedBg) : 0]);
    await page.evaluate(i => go(i), id);
    await page.waitForTimeout(500);
    const heroBg = await brightestBehind('.dm-hero-cap .on-photo',
      '.dm-hero-cap .on-photo, .dm-hero-cap .on-photo-m');
    worstCase.push(['detail/' + lang, heroBg ? cr([255, 255, 255], heroBg) : 0]);
    // --scrim-top, measured on the same worst case: the floating back link is
    // the only type the mirror carries over a photograph, and over the
    // rooftop's sky it failed the same way the title did (4.07:1) until the
    // fade was pulled back out of the text zone. Its colour is translucent, so
    // it composites over the very ground it is measured against.
    const backBg = await brightestBehind('.back.float', '.back.float');
    worstCase.push(['back/' + lang, backBg
      ? cr(backBg.map(c => 0.86 * 255 + 0.14 * c), backBg) : 0]);
  }
  await page.evaluate(() => setLang('en'));
  check('the rooftop unit — the named worst case — clears AA on its worst composited pixel',
    worstCase.length === 6 && worstCase.every(([, v]) => v >= 4.5),
    worstCase.map(([n, v]) => n + ' ' + v.toFixed(2)).join(' · '));

  // --- the film pass (L'Officiel reference, Aug 2026) ----------------------
  // 1 · One photography grade, on the one choke point every photograph passes
  // through. It desaturates and never tints: a hue-rotate or a sepia would
  // walk a picture toward gold, ember or cool, and those are meanings.
  const grade = await page.evaluate(() => {
    const css = [...document.querySelectorAll('style')].map(s => s.textContent).join('\n');
    const rules = [...css.matchAll(/\.slot-shot\s*\{([^}]*)\}/g)].map(m => m[1]);
    const shots = [...document.querySelectorAll('.slot-shot')];
    return {
      declared: rules.filter(r => /filter:/.test(r)).length,
      applied: shots.length && shots.every(s => /grayscale/.test(getComputedStyle(s).filter)),
      value: shots.length ? getComputedStyle(shots[0]).filter : '',
      count: shots.length
    };
  });
  check('one photography grade, declared once on the slot-shot choke point',
    grade.declared === 1 && grade.applied && grade.count > 0,
    grade.count + ' shots · ' + grade.value);
  check('the grade desaturates and never tints toward an accent',
    /grayscale/.test(grade.value) && /saturate/.test(grade.value) &&
    !/hue-rotate|sepia|invert/.test(grade.value), grade.value);

  // The grade belongs to photographs. UI chrome and the stardust ring family are
  // untouched: the only other filters on the page are the rings' drop-shadows.
  const filtered = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('*').forEach(el => {
      const f = getComputedStyle(el).filter;
      if (!f || f === 'none') return;
      if (el.classList.contains('slot-shot')) return;
      if (/drop-shadow/.test(f)) return;     // the stardust ring family, unchanged
      // A locked badge greys its own icon out. That is a state saying "not
      // yours yet", declared long before the film pass — one flat grayscale,
      // not a grade, and it lives on the badge and nowhere else.
      if (el.classList.contains('bic') && el.closest('.badge.locked') &&
          f.trim() === 'grayscale(1)') return;
      const c = el.className;
      out.push((typeof c === 'string' ? c : c.baseVal) + '|' + f);
    });
    return [...new Set(out)];
  });
  check('the grade touches photographs only, never UI chrome or the stardust rings',
    filtered.length === 0, filtered.slice(0, 4).join(' | '));

  // 2 · The glass streak: the third member of the .pass-satin / .prem-silk
  // family. Static, warm-white, and always UNDER the scrim that carries the
  // words — never between the reader and the contrast the caption relies on.
  const silk = await page.evaluate(() => {
    const css = [...document.querySelectorAll('style')].map(s => s.textContent).join('\n');
    const rule = (css.match(/\.hero-silk\s*\{([^}]*)\}/) || [, ''])[1];
    const el = document.querySelector('.signin-hero .hero-silk');
    const cs = el && getComputedStyle(el);
    return {
      onSignin: !!el,
      visible: !!cs && cs.display !== 'none',
      still: !/animation|transition/.test(rule),
      noGlow: !/box-shadow|drop-shadow/.test(rule),
      angle: (rule.match(/linear-gradient\(\s*(\d+)deg/) || [])[1],
      bg: cs ? cs.backgroundImage : ''
    };
  });
  check('the glass streak is on the sign-in hero', silk.onSignin && silk.visible);
  check('the glass streak is static and does not glow', silk.still && silk.noGlow);
  check('the glass streak uses the existing satin recipe (112-115deg, warm white)',
    +silk.angle >= 112 && +silk.angle <= 115 && !/240, ?195|224, ?85|132, ?185/.test(silk.bg),
    silk.angle + 'deg');
  // Order is the contrast guarantee: slot, then silk, then the caption.
  const silkOrder = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('.fi-ed-media, .dm-hero, .signin-hero').forEach(m => {
      const k = [...m.children].map(c => c.className.split(' ')[0]);
      const si = k.indexOf('hero-silk');
      if (si === -1) return;
      const cap = k.findIndex(c => /fi-ed-cap|dm-hero-cap|signin-fade/.test(c));
      out.push(cap === -1 || si < cap);
    });
    return out;
  });
  check('the glass streak layers under every scrim and caption',
    silkOrder.length > 0 && silkOrder.every(Boolean),
    silkOrder.length + ' heroes');

  // 3 · The premium ember drench, re-verified against the Scrim Standard's own
  // acceptance test: the caption's own black scrim still does the legibility
  // work, and it is still sized to the words.
  const prem = await page.evaluate(() => {
    const css = [...document.querySelectorAll('style')].map(s => s.textContent).join('\n');
    const rule = (css.match(/\.prem-scrim\s*\{[^}]*\}/) || [''])[0];
    return { deepened: /rgba\(20, ?7, ?6, ?\.16\)/.test(rule) && /rgba\(28, ?8, ?6, ?\.50\)/.test(rule) };
  });
  check('the premium ember drench is deepened to .16 / .50', prem.deepened);
  await page.evaluate(() => go('premium'));
  await page.waitForTimeout(400);
  const premCap = await page.evaluate(() => {
    const cap = document.querySelector('.prem-cap');
    const hero = document.querySelector('#premHero .slot');
    if (!cap || !hero) return null;
    return {
      scrimmed: /to top/.test(getComputedStyle(cap).backgroundImage),
      share: Math.round(cap.getBoundingClientRect().height / hero.getBoundingClientRect().height * 100)
    };
  });
  check('the premium caption still carries the one black scrim, sized to its words',
    premCap && premCap.scrimmed && premCap.share <= 62, JSON.stringify(premCap));

  // The acceptance test is measured, not asserted: hide the caption's own
  // type, photograph the exact rect it occupied, and take the BRIGHTEST
  // composited pixel in it — the worst ground the white name and the ember
  // price can land on. The photography grade and the deepened drench both
  // move this number, so it is re-measured rather than trusted.
  // Same measurement as the Scrim Standard's own worst-case test above —
  // one implementation, reused, so the two acceptance tests cannot drift.
  const HIDE = '.prem-cap .prem-name, .prem-cap .prem-price';
  const nameBg = await brightestBehind('.prem-name', HIDE);
  const priceBg = await brightestBehind('.prem-price', HIDE);
  const nameCr = nameBg ? cr([255, 255, 255], nameBg) : 0;
  const priceCr = priceBg ? cr([232, 112, 95], priceBg) : 0;
  check('premium caption type clears AA on its worst composited pixel',
    nameCr >= 4.5 && priceCr >= 4.5,
    'name ' + nameCr.toFixed(2) + ' · price ' + priceCr.toFixed(2));
  await decodePage.close();

  // 4 · Media reveal — the third named motion exception. Opacity only, one
  // pass, and it can never leave a photograph invisible: the keyframe has no
  // fill mode, so the element's own resting opacity of 1 is the fallback.
  const reveal = await page.evaluate(() => {
    const css = [...document.querySelectorAll('style')].map(s => s.textContent).join('\n');
    const kf = (css.match(/@keyframes\s+mediaReveal\s*\{([^@]*?)\}\s*\n/) || [, ''])[1];
    const shot = document.querySelector('.prem-hero .slot-shot') ||
                 document.querySelector('.slot-shot');
    const cs = shot && getComputedStyle(shot);
    return {
      exists: /@keyframes\s+mediaReveal/.test(css),
      opacityOnly: /opacity/.test(kf) && !/transform|scale|translate|filter|blur/.test(kf),
      name: cs ? cs.animationName : '',
      dur: cs ? cs.animationDuration : '',
      fill: cs ? cs.animationFillMode : '',
      iter: cs ? cs.animationIterationCount : '',
      resting: cs ? cs.opacity : ''
    };
  });
  check('the media reveal exists and is opacity only',
    reveal.exists && reveal.opacityOnly && reveal.name === 'mediaReveal', JSON.stringify(reveal));
  check('the media reveal runs once, ~400ms, and never holds a photograph hidden',
    reveal.dur === '0.4s' && reveal.iter === '1' && reveal.fill === 'none' &&
    reveal.resting === '1', JSON.stringify(reveal));
  // Reduced motion: the dissolve goes, the grade stays — a grade is not motion.
  const rmPage = await browser.newPage({ viewport: { width: 400, height: 860 },
                                         reducedMotion: 'reduce' });
  await rmPage.goto('file://' + indexPath);
  await rmPage.waitForTimeout(700);
  const rm = await rmPage.evaluate(() => {
    const s = document.querySelector('.signin-hero .slot-shot');
    if (!s) return null;
    const cs = getComputedStyle(s);
    return { anim: cs.animationName, filter: cs.filter, opacity: cs.opacity };
  });
  await rmPage.close();
  check('under reduced motion the dissolve stops and the photograph is simply there',
    rm && rm.anim === 'none' && rm.opacity === '1', JSON.stringify(rm));
  check('reduced motion does not disturb the grade — a grade is not motion',
    rm && /grayscale/.test(rm.filter), rm && rm.filter);
  await page.evaluate(() => go('feed'));
  await page.waitForTimeout(300);

  // --- radius: one base, three derived steps -----------------------------
  const radii = await page.evaluate(() => {
    const cs = getComputedStyle(document.documentElement);
    const css = [...document.querySelectorAll('style')].map(s => s.textContent).join('\n');
    const body = css.slice(css.indexOf('}', css.indexOf(':root{')) + 1);
    const literals = [...body.matchAll(/border-radius:\s*([^;}]+)/g)].map(m => m[1].trim())
      // 0 is a full-bleed edge, 50% is a circle, 1px/2px are stroke caps on
      // hairline bars — none of them are steps on the radius scale.
      .filter(v => !/var\(--r-|^0$|^50%$|^1px$|^2px$/.test(v));
    return {
      base: cs.getPropertyValue('--radius').trim(),
      s: cs.getPropertyValue('--r-s').trim(),
      m: cs.getPropertyValue('--r-m').trim(),
      l: cs.getPropertyValue('--r-l').trim(),
      pill: cs.getPropertyValue('--r-pill').trim(),
      derived: /var\(--radius\)/.test(css.match(/--r-m:[^;]+/)[0]) &&
               /var\(--radius\)/.test(css.match(/--r-l:[^;]+/)[0]),
      literals
    };
  });
  check('every radius derives from one base token',
    radii.base === '9px' && radii.derived && radii.pill === '999px', JSON.stringify(radii));
  check('the derived values still land on 9 / 13 / 18', await page.evaluate(() => {
    const probe = document.createElement('div');
    document.body.appendChild(probe);
    const read = v => { probe.style.borderRadius = v; return getComputedStyle(probe).borderTopLeftRadius; };
    const got = [read('var(--r-s)'), read('var(--r-m)'), read('var(--r-l)')];
    probe.remove();
    return got.join(',') === '9px,13px,18px';
  }));
  check('no loose radius literal is left in the stylesheet',
    radii.literals.length === 0, radii.literals.join(' | '));

  // --- colour semantics ---------------------------------------------------
  // Gold is earned and the primary action, ember is money, cool is the scan.
  // Measured on rendered pixels, not on rule names.
  const COOL = 'rgb(132, 185, 198)';
  let coolStrays = [];
  for (const r of ['feed', 'events', 'shop', 'exchange', 'premium', 'stardust', 'invite',
                   'more', 'missions', 'news', 'twin', 'artist',
                   'live', 'stream/ls-01', 'stream/ls-02']) {
    await page.evaluate(rt => go(rt), r);
    await page.waitForTimeout(140);
    coolStrays = coolStrays.concat(await page.evaluate(({ route, cool }) => {
      const bad = [];
      document.querySelectorAll('#main *, .tabs *').forEach(el => {
        if (!el.offsetParent) return;
        const cs = getComputedStyle(el);
        const hit = cs.color === cool || cs.borderTopColor === cool ||
                    cs.backgroundColor === cool;
        if (!hit) return;
        // Cool Rim is allowed in the scan lane, and on the one chip that says
        // a room is open right now.
        if (el.closest('#page-scan')) return;
        if (el.classList.contains('chip-cool') || el.classList.contains('livedot')) return;
        if (el.closest('.chip-cool')) return;
        bad.push(route + ' ' + (el.className || el.tagName));
      });
      return [...new Set(bad)];
    }, { route: r, cool: COOL }));
  }
  check('Cool Rim appears only in the scan lane and on a live room',
    coolStrays.length === 0, coolStrays.slice(0, 5).join(' | '));

  // Cool no longer marks a plain date or an upcoming night.
  await page.evaluate(() => go('events'));
  await page.waitForTimeout(300);
  check('an upcoming night is a date, not a scan light', await page.evaluate(() => {
    const chips = [...document.querySelectorAll('#eventsList .chip-cool')];
    // every remaining cool chip must be the live one
    return chips.every(c => c.querySelector('.livedot'));
  }));

  // Ember is money. Every rule that reaches for the carmine hue is either a
  // money surface or the error/destructive family, which shares the hue
  // because inventing a fifth light would be worse.
  const emberRules = await page.evaluate(() => {
    const css = [...document.querySelectorAll('style')].map(s => s.textContent).join('\n');
    const body = css.slice(css.indexOf('}', css.indexOf(':root{')) + 1);
    const MONEY = /(ember|prem|money|ord-|sp-p|gate-prem|member-badge|locked-prem|checkout|pay)/i;
    const ALARM = /(invalid|wrong|\.bad|reset:hover)/i;
    return [...body.matchAll(/([^{}\n;][^{}\n]*)\{[^}]*(?:--ember|224,85,69)[^}]*\}/g)]
      .map(m => m[1].trim())
      .filter(sel => !MONEY.test(sel) && !ALARM.test(sel));
  });
  check('the carmine hue is money, or the error family, and nothing else',
    emberRules.length === 0, emberRules.join(' | '));

  // No fifth light: the palette is the documented set and nothing new.
  check('no accent outside the documented palette', await page.evaluate(() => {
    const cs = getComputedStyle(document.documentElement);
    const named = ['--stardust', '--stardust-2', '--stardust-deep', '--ember', '--ember-t',
                   '--cool', '--ok', '--clay', '--clay-t'].map(t => cs.getPropertyValue(t).trim());
    return named.join(',') === '#F0C36B,#FFE1A6,#A9761F,#E05545,#E8705F,#84B9C6,#93C08A,#C2724E,#D08C63';
  }));
  await page.evaluate(() => go('feed'));

  // --- the metering vocabulary (Sep 2026) ---------------------------------
  // Fan-facing metering is always "messages". The retired economy words never
  // appear on a rendered surface, in either language, sheets included. The
  // static audit greps the source; this reads what the fan actually sees.
  const BANNED_VOCAB = /\b(tokens?|coins?|nft|blockchain|crypto|wallet|mint)\b/i;
  let vocabStrays = [];
  for (const lang of ['en', 'th']) {
    await page.evaluate(l => setLang(l), lang);
    for (const r of ['feed', 'stardust', 'scan', 'shop', 'exchange', 'events', 'premium', 'invite',
                     'more', 'missions', 'news', 'twin', 'community', 'room/rm-tonight',
                     'live', 'stream/ls-01', 'stream/ls-02', 'stream/ls-03']) {
      await page.evaluate(rt => go(rt), r);
      await page.waitForTimeout(110);
      const seen = await page.evaluate(() => document.querySelector('#main').innerText);
      if (BANNED_VOCAB.test(seen)) vocabStrays.push(lang + '/' + r + ': ' + seen.match(BANNED_VOCAB)[0]);
    }
    await page.evaluate(() => { go('twin'); askMessagePack(); });
    await page.waitForTimeout(220);
    const sheetSeen = await page.evaluate(() => document.querySelector('#sheetBox').innerText);
    if (BANNED_VOCAB.test(sheetSeen)) vocabStrays.push(lang + '/pack sheet');
    if (!/message|ข้อความ/i.test(sheetSeen)) vocabStrays.push(lang + '/pack sheet says nothing about messages');
    await page.evaluate(() => closeSheet());
  }
  await page.evaluate(() => setLang('en'));
  check('nothing a fan reads uses the retired economy vocabulary, en or th',
    vocabStrays.length === 0, vocabStrays.slice(0, 4).join(' | '));

  const realErrors = consoleErrors.filter(e => !e.includes('Failed to load resource'));
  check('no console errors', realErrors.length === 0, realErrors.slice(0, 3).join(' | '));

  await browser.close();
  const fails = results.filter(r => !r.ok);
  console.log(`\n${results.length - fails.length}/${results.length} passed`);
  process.exit(fails.length ? 1 : 0);
})().catch(e => { console.error('SUITE ERROR', e); process.exit(2); });
