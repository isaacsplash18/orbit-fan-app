// ORBIT — clickable prototype dummy content pack (powered by Fanframe)
// Pilot artist: Kai Rivera (fictional singer/actor). ALL content below is invented
// for demo purposes only: song titles, venues, merch, bios, quiz answers.
// Do not treat any of it as fact about a real person.
//
// Vocabulary guardrail (PRD §6, CLAUDE.md): only Stardust, points, badges, level
// in fan-facing copy — none of the terms this repo's compliance rules retire.
// Fans never earn money; Stardust is earned only and is never sold, bought, or
// converted to cash.
// No mascot content anywhere in this pack.

const CONTENT = {
  platform: {
    fans: 118240,
    stardustEarned: 4152000,
  },

  // Level is derived from lifetime Stardust earned. Spending Stardust never lowers it,
  // so thresholds are checked against lifetime Stardust, not spendable balance.
  //
  // `opens` is what each rung actually gives, said in one short line, so the
  // ladder on the passport answers "why climb" instead of only "where am I".
  // Every one of these is opened by showing up and by nothing else: no
  // membership, no purchase and no Stardust balance reaches a rung. Inner Circle
  // sits beside this ladder, never above it (PRODUCT.md, Revenue model).
  levels: [
    {
      level: 1, threshold: 0,
      name: { en: "Spark", th: "ประกายแรก" },
      opens: { en: "The feed, the badges, the whole free run", th: "ฟีด แบดจ์ และทุกอย่างที่เปิดให้ฟรี" },
    },
    {
      level: 2, threshold: 100,
      name: { en: "Glow", th: "แสงอุ่น" },
      opens: { en: "Event registration opens to you first", th: "ลงทะเบียนงานได้ก่อนใคร" },
    },
    {
      level: 3, threshold: 250,
      name: { en: "Beam", th: "ลำแสง" },
      opens: { en: "Merch made for this rung, and drops early", th: "เมิร์ชเฉพาะระดับนี้ และดรอปก่อนใคร" },
    },
    {
      level: 4, threshold: 600,
      name: { en: "Radiant", th: "รัศมี" },
      opens: { en: "Content written for Orbiters who kept showing up", th: "คอนเทนต์ที่ทำให้ Orbiters ที่มาตลอด" },
    },
    {
      level: 5, threshold: 1200,
      name: { en: "Luminary", th: "ดาวเด่น" },
      opens: { en: "A seat held at the small rooms", th: "ที่นั่งที่กันไว้ให้ในงานเล็กๆ" },
    },
    {
      level: 6, threshold: 2500,
      name: { en: "Constellation", th: "กลุ่มดาว" },
      opens: { en: "Your name in the record of the year", th: "ชื่อของคุณในบันทึกประจำปี" },
    },
  ],

  // 14 items. Not sorted by date at render time (allFeed() just concatenates
  // array order onto STATE.posts), so array order IS display order — which
  // means the rhythm below is authored twice: once in the sequence of items,
  // once in their dates, and the two have to agree (dates still fall in the
  // same descending order the array uses). The rhythm itself is deliberately
  // uneven: a three-post weekend at the top (led by a photograph), a gap
  // right after it, a quick voice-note-then-text pair, then irregular gaps
  // the rest of the way down. 9 free (2 video, 2 photoset, 1 voice, 1 text,
  // 2 songstory, 1 exclusive), 2 access:"stardust" songstory unlocks (5 Stardust
  // each, one of them dual-path), 1 access:"premium" exclusive, and 2
  // access:"rank" items opened by level alone.
  feed: [
    {
      id: "feed-05",
      type: "photoset",
      access: "free",
      title: { en: "Golden Hour, Rooftop, Bangkok", th: "ช่วงเวลาแสงทอง บนดาดฟ้ากลางกรุงเทพฯ" },
      body: {
        en: "Quick set from yesterday's shoot before the light gave out and the crew started packing lights around me. More angles inside.",
        th: "ภาพชุดสั้นๆ จากกองถ่ายเมื่อวานก่อนแสงจะหมด แล้วทีมงานเริ่มเก็บไฟรอบตัวพี่เลย มีมุมอื่นๆ ให้ดูข้างในด้วยครับ",
      },
      mediaKey: "feed-photoset-1",
      date: "2026-08-23",
    },
    {
      id: "feed-02",
      type: "video",
      access: "free",
      title: { en: "Back in the Booth", th: "กลับมาอยู่ในห้องอัดอีกครั้ง" },
      body: {
        en: "Two hours, one coffee gone cold, and a chorus that finally clicked around midnight. Here's a peek from tonight's session.",
        th: "สองชั่วโมง กาแฟที่เย็นไปแล้วหนึ่งแก้ว กับท่อนฮุคที่มาลงตัวเอาตอนใกล้เที่ยงคืน นี่คือช่วงหนึ่งจากเซสชันคืนนี้ครับ",
      },
      mediaKey: "feed-video-1",
      date: "2026-08-22",
    },
    {
      id: "feed-03",
      type: "songstory",
      access: "stardust",
      stardustCost: 5,
      title: { en: "The Song I Wrote Stuck in Traffic", th: "เพลงที่พี่แต่งตอนรถติดอยู่กับที่" },
      locked: {
        en: "Written after a very specific 4am drive home that went nowhere for twenty minutes. Unlock to hear why.",
        th: "เพลงนี้เขียนขึ้นหลังขับรถกลับบ้านตอนตี 4 คืนหนึ่งที่รถติดอยู่กับที่นานยี่สิบนาที ปลดล็อกเพื่อฟังว่าทำไมครับ",
      },
      unlocked: {
        en: "Neon Tide began in a car that wasn't moving, at four in the morning, on the way home from a show, with the air conditioning making a noise I decided to ignore.",
        th: "Neon Tide เริ่มต้นขึ้นในรถที่จอดนิ่งอยู่กับที่ ตอนตี 4 ระหว่างทางกลับบ้านหลังโชว์จบ พร้อมเสียงแอร์ที่ดังแปลกๆ ซึ่งพี่ตัดสินใจทำเป็นไม่ได้ยินครับ",
      },
      // Long-form editorial layout: subhead, paragraph, then an optional
      // full-bleed media slot. Empty MEDIA keys collapse without a trace.
      story: [
        {
          head: { en: "Four in the morning on Rama IV", th: "ตี 4 บนถนนพระราม 4" },
          body: {
            en: "The show ended at eleven and I was still wide awake at four, parked behind a truck that hadn't moved in twenty minutes. Window down, because the air conditioning was making a noise I wasn't ready to think about yet.",
            th: "โชว์จบตั้งแต่ห้าทุ่ม แต่ตี 4 พี่ยังตาสว่างอยู่เลย จอดติดอยู่หลังรถบรรทุกที่ไม่ขยับมายี่สิบนาทีแล้ว เปิดกระจกลงไว้ เพราะแอร์ทำเสียงแปลกๆ ที่พี่ยังไม่พร้อมจะคิดถึงมันตอนนั้นครับ",
          },
          mediaKey: "story-neon-1",
        },
        {
          head: { en: "Three chords and a voice memo", th: "คอร์ดสามตัวกับเสียงที่อัดเก็บไว้" },
          body: {
            en: "I knocked out the first three chords on my knee against the steering wheel. The chorus arrived almost finished, which never happens to me, so I voice-memoed it before the traffic moved and stole it back.",
            th: "พี่เคาะคอร์ดสามตัวแรกบนเข่าที่พาดอยู่กับพวงมาลัย ท่อนฮุคมาแบบเกือบสมบูรณ์เลย ซึ่งไม่เคยเกิดขึ้นกับพี่มาก่อน เลยรีบอัดเสียงเก็บไว้ก่อนรถจะเคลื่อนแล้วแย่งมันคืนไปครับ",
          },
        },
        {
          head: { en: "Where the tide comes from", th: "คำว่า tide มาจากไหน" },
          body: {
            en: "The title's from the sound of a city that never fully quiets down. The hum keeps rolling back in all night, whether anyone's awake to hear it or not.",
            th: "ชื่อเพลงมาจากเสียงของเมืองที่ไม่เคยเงียบสนิท เสียงหึ่งๆ นั้นไหลกลับเข้ามาทั้งคืน ไม่ว่าจะมีใครตื่นอยู่ฟังมันหรือเปล่าก็ตามครับ",
          },
          mediaKey: "story-neon-2",
        },
      ],
      closer: {
        en: "Written in a car on Rama IV, Bangkok, February 2026.",
        th: "เขียนในรถบนถนนพระราม 4 กรุงเทพฯ กุมภาพันธ์ 2026",
      },
      mediaKey: "feed-songstory-1",
      date: "2026-08-21",
    },
    {
      id: "feed-06",
      type: "voice",
      access: "free",
      duration: "0:47",
      title: { en: "Can't Sleep, So Here's a Voice Note", th: "นอนไม่หลับ เลยอัดเสียงมาฝาก" },
      body: {
        en: "Couldn't sleep, so I'm talking to my phone instead of counting sheep. Rehearsals ran long today but good long. More soon.",
        th: "นอนไม่หลับ เลยคุยกับมือถือแทนการนับแกะครับ วันนี้ซ้อมกันยาวมาก แต่เป็นความยาวที่ดีนะ เดี๋ยวมาอัปเดตเพิ่มครับ",
      },
      mediaKey: "feed-voice-1",
      date: "2026-08-15",
    },
    {
      id: "feed-04",
      type: "text",
      access: "free",
      title: { en: "Before Neon Tide Drops", th: "ก่อน Neon Tide จะปล่อยออกมา" },
      body: {
        en: "Sat on this one for months. Almost ready to let it go.",
        th: "เก็บเพลงนี้ไว้นานหลายเดือน ใกล้จะปล่อยมันออกไปแล้วครับ",
      },
      mediaKey: "feed-text-1",
      date: "2026-08-14",
    },
    // Rank-gated content (9 Sep 2026). `access: "rank"` opens at a level and
    // at nothing else: not a membership, not a payment, not a Stardust balance.
    // The demo fan is Level 3, so feed-13 shows the locked read and feed-14
    // the open one, which is the first time in this build the pull of
    // levelling is actually visible on a screen.
    {
      id: "feed-13",
      type: "songstory",
      access: "rank",
      rank: 4,
      title: { en: "The Take We Kept Instead", th: "เทกที่เราเลือกเก็บไว้แทน" },
      locked: {
        en: "The version of Neon Tide that nearly shipped, and the argument in the control room that stopped it. This one is for Orbiters who have shown up.",
        th: "เวอร์ชันของ Neon Tide ที่เกือบได้ปล่อยจริง กับการเถียงกันในห้องคอนโทรลที่ทำให้มันไม่ได้ปล่อย อันนี้สำหรับ Orbiters ที่มาตลอดครับ",
      },
      unlocked: {
        en: "We had a mix that was cleaner, louder and completely wrong, and it took our engineer eleven minutes and one very quiet sentence to talk all four of us out of it.",
        th: "ตอนนั้นเรามีมิกซ์ที่สะอาดกว่า ดังกว่า และผิดทางโดยสิ้นเชิง ซาวด์เอนจิเนียร์ของเราใช้เวลาสิบเอ็ดนาทีกับประโยคเบาๆ ประโยคเดียว พูดให้เราทั้งสี่คนเลิกคิดจะปล่อยมันครับ",
      },
      story: [
        {
          head: { en: "Eleven minutes in the control room", th: "สิบเอ็ดนาทีในห้องคอนโทรล" },
          body: {
            en: "It was two in the morning and the loud mix sounded like a hit, which is exactly the problem with two in the morning. Our engineer let it play all the way through twice before she said anything at all.",
            th: "ตอนนั้นตีสอง มิกซ์ที่ดังกว่าฟังแล้วเหมือนเพลงฮิต ซึ่งนั่นแหละคือปัญหาของเวลาตีสอง ซาวด์เอนจิเนียร์ของเราปล่อยให้มันเล่นจนจบสองรอบก่อนจะพูดอะไรสักคำครับ",
          },
        },
        {
          head: { en: "One very quiet sentence", th: "ประโยคเบาๆ ประโยคเดียว" },
          body: {
            en: "She asked which of the two mixes we would still want to play in a year. Nobody answered, which was the answer. We kept the take with the room noise in it and I have never regretted a single second of that hiss.",
            th: "เธอถามว่ามิกซ์ไหนที่อีกหนึ่งปีเราจะยังอยากเล่นอยู่ ไม่มีใครตอบ ซึ่งนั่นแหละคือคำตอบ เราเก็บเทกที่มีเสียงห้องติดมาด้วย และพี่ไม่เคยเสียดายเสียงซ่านั้นแม้แต่วินาทีเดียวครับ",
          },
        },
      ],
      closer: {
        en: "You waited long enough to hear this one. That is the whole reason it is here.",
        th: "คุณรอนานพอที่จะได้ฟังเพลงนี้ นั่นแหละคือเหตุผลทั้งหมดที่มันอยู่ตรงนี้ครับ",
      },
      date: "2026-08-11",
    },
    {
      id: "feed-09",
      type: "exclusive",
      access: "free",
      title: { en: "The Cut You Didn't See", th: "ฉากที่คุณไม่เคยเห็น" },
      body: {
        en: "The music video had a whole alternate ending we shot, argued about for a week, and eventually cut. Here's what almost made it in.",
        th: "มิวสิกวิดีโอมีตอนจบอีกเวอร์ชันที่ถ่ายไว้ เถียงกันอยู่เป็นอาทิตย์ แล้วสุดท้ายก็ตัดออกไป นี่คือสิ่งที่เกือบได้ใช้จริงครับ",
      },
      mediaKey: "feed-exclusive-2",
      date: "2026-08-09",
      line: {
        en: "The ending that got cut, and the argument about cutting it that I still haven't fully let go of.",
        th: "ตอนจบที่ถูกตัดออก และการเถียงกันเรื่องตัดตอนจบนั้นที่พี่ยังปล่อยวางไม่ได้เต็มร้อยครับ",
      },
      detail: [
        {
          lead: { en: "What almost happened:", th: "สิ่งที่เกือบเกิดขึ้น:" },
          body: {
            en: "Eleven minutes of the alternate ending, shot on the last morning when everyone was too tired to perform and started telling the truth instead.",
            th: "ตอนจบอีกเวอร์ชันความยาวสิบเอ็ดนาที ถ่ายเช้าวันสุดท้ายตอนที่ทุกคนเหนื่อยเกินกว่าจะเล่นแล้ว เลยพูดกันตรงๆ แทนครับ",
          },
        },
        {
          lead: { en: "What to watch for:", th: "จุดที่ควรจับตาดู:" },
          body: {
            en: "The take at 6:40 is the one the director wanted. I argued for the other one all afternoon and, watching it back now, I think she was right.",
            th: "เทกที่นาทีที่ 6:40 คือเทกที่ผู้กำกับอยากได้ พี่เถียงขออีกเทกหนึ่งอยู่ทั้งบ่าย แต่พอกลับมาดูตอนนี้ พี่ว่าเธอถูกครับ",
          },
        },
      ],
      closer: {
        en: "The full eleven minutes live in Inner Circle, if you're curious who was right.",
        th: "เวอร์ชันเต็มสิบเอ็ดนาทีอยู่ใน Inner Circle ถ้าอยากรู้ว่าใครถูกกันแน่ครับ",
      },
    },
    {
      id: "feed-14",
      type: "photoset",
      access: "rank",
      rank: 3,
      title: { en: "Rehearsal Room, Between Two Songs", th: "ห้องซ้อม ระหว่างสองเพลง" },
      locked: {
        en: "Twenty frames from the fortnight nobody photographs, opened at Beam.",
        th: "ยี่สิบเฟรมจากสองสัปดาห์ที่ไม่มีใครถ่ายเก็บไว้ เปิดที่ระดับลำแสง",
      },
      unlocked: {
        en: "Twenty frames from the fortnight nobody photographs: cables, a whiteboard nobody erased, and four people learning a song in the wrong key on purpose.",
        th: "ยี่สิบเฟรมจากสองสัปดาห์ที่ไม่มีใครถ่ายเก็บไว้ สายไฟ ไวท์บอร์ดที่ไม่มีใครลบ กับสี่คนที่กำลังหัดเพลงในคีย์ผิดแบบตั้งใจครับ",
      },
      date: "2026-08-08",
    },
    {
      id: "feed-07",
      type: "songstory",
      access: "stardust",
      stardustCost: 5,
      // Dual unlock (9 Sep 2026). Two doors to the same reading: 5 Stardust, or
      // the cash price below. Both grant identical access and neither touches
      // balance-as-lifetime, level or badges — the cash door spends no Stardust
      // and grants none, so nothing about it can move a rung. Placeholder
      // price (PRD §12), labelled in the sheet.
      dual: true,
      cashPrice: 39,
      title: { en: "Okay, Paper Boats Is About Lampang", th: "เอาจริงๆ Paper Boats พูดถึงลำปางนี่แหละ" },
      locked: {
        en: "A childhood memory, a flooded soi, and a promise I made at nine years old that I somehow kept. Unlock to hear it.",
        th: "ความทรงจำวัยเด็ก ซอยที่น้ำท่วม กับคำสัญญาที่ให้ไว้ตอนอายุเก้าขวบ ซึ่งพี่ทำตามได้จริงๆ ปลดล็อกเพื่อฟังเรื่องราวทั้งหมดครับ",
      },
      unlocked: {
        en: "Paper Boats is about the rainy-season floods on my street growing up in Lampang. My cousin and I raced paper boats down the soi and swore we'd leave town and do something big one day. The song is that promise, grown up and slightly embarrassed about it.",
        th: "Paper Boats พูดถึงหน้าฝนตอนน้ำท่วมซอยบ้านพี่สมัยเด็กที่ลำปาง พี่กับลูกพี่ลูกน้องเอาเรือกระดาษมาแข่งกันลอยไปตามซอย แล้วสาบานกันว่าสักวันจะออกไปทำอะไรที่ยิ่งใหญ่ เพลงนี้คือคำสัญญานั้นที่โตขึ้นมาเป็นเพลง แถมยังอายนิดๆ กับตัวเองตอนเด็กด้วยครับ",
      },
      mediaKey: "feed-songstory-2",
      date: "2026-08-07",
    },
    {
      id: "feed-08",
      type: "video",
      access: "free",
      title: { en: "Fifteen Minutes Before Doors", th: "อีก 15 นาทีก่อนเปิดประตู" },
      body: {
        en: "Vocal warmups, jokes that land about half the time, and enough nervous energy to power the venue. This is what backstage actually looks like.",
        th: "วอร์มเสียง มุกที่ฮาสักครึ่งหนึ่ง กับพลังตื่นเต้นที่พอจะปั่นไฟทั้งฮอลล์ได้เลย นี่แหละบรรยากาศหลังเวทีตัวจริงครับ",
      },
      mediaKey: "feed-video-2",
      date: "2026-08-02",
    },
    {
      id: "feed-01",
      type: "exclusive",
      access: "premium",
      title: { en: "A Demo Nobody's Heard Yet", th: "เดโมที่ยังไม่มีใครได้ฟัง" },
      body: {
        en: "Thirty seconds of a melody I've been humming at soundcheck, badly, into a phone I keep forgetting to clean. I recorded it three different times before landing a take where the wrong note actually sounded intentional. Still barely dressed, still full of gaps I haven't decided how to fill, and I go back and forth daily on whether it should ever leave this stage. For now it stays right here, only for the people patient enough to hear something unfinished.",
        th: "อีกสามสิบวินาทีของทำนองที่พี่ฮัมเล่นตอนซาวด์เช็ค ฮัมแบบเพี้ยนๆ ด้วยนะ ใส่ลงมือถือเครื่องที่ลืมเช็ดหน้าจอมาตลอด พี่อัดมันสามรอบกว่าจะได้เทกที่โน้ตผิดฟังดูเหมือนตั้งใจเล่นจริงๆ มันยังดิบอยู่มาก ยังมีช่องโหว่ที่พี่ยังไม่ตัดสินใจว่าจะเติมยังไง แล้วก็ยังลังเลอยู่ทุกวันว่าจะปล่อยออกจากเวทีนี้ดีไหม ตอนนี้ขอเก็บมันไว้ตรงนี้ก่อน สำหรับคนที่ใจเย็นพอจะฟังอะไรที่ยังไม่เสร็จแบบนี้ครับ",
      },
      mediaKey: "feed-exclusive-1",
      date: "2026-07-31",
      // Detail-page body grammar: an italic positioning line, then lead-in
      // paragraphs, then an italic closer naming where and when.
      line: {
        en: "Thirty seconds that haven't left the rehearsal room, and honestly shouldn't have to defend themselves yet.",
        th: "สามสิบวินาทีที่ยังไม่เคยออกจากห้องซ้อม และก็ยังไม่ต้องมาอธิบายตัวเองให้ใครฟังครับ",
      },
      detail: [
        {
          lead: { en: "What you'll hear:", th: "สิ่งที่คุณจะได้ฟัง:" },
          body: {
            en: "A melody hummed over a click track, one wrong chord I left in on purpose, and me telling the room to hold on a second because I lost the thread.",
            th: "ทำนองที่ฮัมทับเสียงคลิก คอร์ดผิดหนึ่งตัวที่พี่ตั้งใจเก็บไว้ กับเสียงพี่ที่บอกให้ทุกคนรอแป๊บนึงเพราะจำทำนองต่อไม่ได้ครับ",
          },
        },
        {
          lead: { en: "Why it lands here first:", th: "ทำไมถึงมาลงที่นี่ก่อน:" },
          body: {
            en: "Demos get rewritten until they're unrecognizable. This one might never sound this rough again, so Inner Circle gets it exactly as embarrassing as it actually was.",
            th: "เดโมมักถูกเขียนใหม่จนจำเวอร์ชันแรกไม่ได้เลย เพลงนี้อาจไม่มีวันฟังดิบขนาดนี้อีกแล้ว สมาชิก Inner Circle เลยได้ฟังในเวอร์ชันที่หลุดๆ เท่าที่มันเคยเป็นจริงๆ ครับ",
          },
        },
      ],
      closer: {
        en: "Recorded at the Sukhumvit rehearsal room, July 2026.",
        th: "บันทึกที่ห้องซ้อมย่านสุขุมวิท กรกฎาคม 2026",
      },
    },
    {
      id: "feed-10",
      type: "songstory",
      access: "free",
      title: { en: "I Wrote the Chorus Backwards From a Train I Missed", th: "พี่แต่งท่อนฮุคย้อนกลับจากรถไฟขบวนที่พลาดไป" },
      body: {
        en: "I wrote Wrong Platform after actually sprinting to the wrong platform trying to catch someone before they left. By the time I found the right one, the train was gone and so was my dignity. The song is what I would have said if I'd made it in time.",
        th: "พี่แต่งเพลง Wrong Platform หลังจากวิ่งสุดแรงไปผิดชานชาลาจริงๆ ตอนพยายามไปเจอใครสักคนก่อนที่เขาจะจากไป พอไปถึงชานชาลาที่ถูกต้อง รถไฟก็ออกไปแล้ว ศักดิ์ศรีของพี่ก็หายไปด้วย เพลงนี้เลยเป็นสิ่งที่พี่อยากพูดถ้าไปทันจริงๆ ครับ",
      },
      mediaKey: "feed-songstory-3",
      date: "2026-07-27",
    },
    {
      id: "feed-11",
      type: "photoset",
      access: "free",
      title: { en: "Clay Court Mornings", th: "เช้าวันคอร์ตดิน" },
      body: {
        en: "Up early to beat the heat on the clay court, cream fit and all, because some habits just refuse to quit. My second serve is still a disaster, but that quiet hour before sessions clears my head completely.",
        th: "พี่ตื่นแต่เช้าไปตีคอร์ตดินก่อนแดดจะแรง ใส่ชุดครีมทั้งชุดเหมือนเดิม เพราะบางนิสัยมันเลิกไม่ได้จริงๆ เสิร์ฟที่สองของพี่ยังพังอยู่เลย แต่ชั่วโมงเงียบๆ บนคอร์ตก่อนเข้าเซสชันช่วยให้หัวโล่งขึ้นมากครับ",
      },
      mediaKey: "feed-photoset-2",
      date: "2026-07-24",
    },
    {
      id: "feed-12",
      type: "songstory",
      access: "free",
      title: { en: "Slow Static Is Just an Empty Venue, Recorded", th: "Slow Static ก็แค่เสียงฮอลล์ที่ว่างเปล่า อัดไว้เฉยๆ" },
      body: {
        en: "Slow Static is about the twenty minutes after a show when the venue empties out and it's just me, the crew, and the sound system humming itself to sleep. It's my favorite kind of quiet, and I wanted a song that actually sounded like that hum.",
        th: "Slow Static พูดถึงยี่สิบนาทีหลังโชว์จบ ตอนที่คนดูเดินออกจากฮอลล์กันหมดแล้ว เหลือแค่พี่กับทีมงาน และเสียงเครื่องเสียงที่ค่อยๆ ปิดตัวเองลงไปช้าๆ มันคือความเงียบแบบที่พี่ชอบที่สุด เลยอยากทำเพลงที่ฟังแล้วรู้สึกเหมือนเสียงหึ่งนั้นจริงๆ ครับ",
      },
      mediaKey: "feed-songstory-4",
      date: "2026-07-17",
    },
  ],

  // 6 merch items, cash checkout only. 1 carries a level-gated early-access label.
  shop: [
    {
      id: "shop-01",
      name: { en: "Neon Tide Tour Tee", th: "เสื้อทัวร์ Neon Tide" },
      desc: {
        en: "Heavyweight cotton, tour graphic across the back, cut generous enough to survive a whole festival season.",
        th: "ผ้าคอตตอนหนา พิมพ์ลายทัวร์เต็มแผ่นหลัง ทรงใส่สบาย ผ่านฤดูเทศกาลได้สบายๆ ทั้งซีซัน",
      },
      price: 890,
      currency: "SGD",
      mediaKey: "shop-item-1",
    },
    {
      id: "shop-02",
      name: { en: "Constellation Enamel Pin", th: "เข็มกลัดอีนาเมล กลุ่มดาว" },
      desc: {
        en: "A small enamel pin for the jacket, the tote, or wherever else you're running out of room to pin things.",
        th: "เข็มกลัดอีนาเมลชิ้นเล็ก ติดแจ็กเก็ต กระเป๋าผ้า หรือตรงไหนก็ได้ที่พื้นที่ติดเข็มกลัดของคุณเริ่มไม่พอแล้ว",
      },
      price: 350,
      currency: "SGD",
      mediaKey: "shop-item-2",
    },
    {
      id: "shop-03",
      name: { en: "Tour Poster Print (A2)", th: "โปสเตอร์ทัวร์ ขนาด A2" },
      desc: {
        en: "Matte A2 print of the tour key art. Looks better framed than it did leaning against my studio wall for three months.",
        th: "โปสเตอร์ขนาด A2 กระดาษด้าน พิมพ์ลายคีย์อาร์ตของทัวร์ ใส่กรอบแล้วสวยกว่าตอนที่มันพิงกำแพงสตูดิโอพี่มาสามเดือนเยอะเลย",
      },
      price: 590,
      currency: "SGD",
      mediaKey: "shop-item-3",
    },
    {
      id: "shop-04",
      name: { en: "Acoustic Session Vinyl (Limited)", th: "แผ่นเสียงอะคูสติกเซสชัน (จำนวนจำกัด)" },
      desc: {
        en: "A stripped-down acoustic set, pressed on limited vinyl in one afternoon that ran long, the way they always do.",
        th: "เซสชันอะคูสติกแบบเรียบง่าย อัดลงแผ่นเสียงจำนวนจำกัด ใช้เวลาบันทึกแค่บ่ายเดียว แต่ก็ยืดยาวเกินแผนเหมือนเดิม",
      },
      price: 1590,
      currency: "SGD",
      mediaKey: "shop-item-4",
      // A long neutral spec list: plain bullets are right here. The stardust-ring
      // glyph stays reserved for membership and Stardust benefit lists.
      specs: [
        { en: "180g black vinyl, single LP", th: "แผ่นไวนิลสีดำ 180 กรัม แผ่นเดียวจบ" },
        { en: "Eight songs recorded live in one room", th: "แปดเพลง บันทึกสดในห้องเดียว" },
        { en: "Printed inner sleeve with handwritten notes", th: "ซองในพิมพ์ลาย พร้อมโน้ตลายมือ" },
        { en: "Numbered run of 500", th: "ผลิต 500 แผ่น มีเลขกำกับทุกแผ่น" },
      ],
      // Copy handoff: the last line of a list hands the reader to the button.
      handoff: {
        en: "If the number on the sleeve matters to you, don't sit on this too long.",
        th: "ถ้าเลขบนซองมีความหมายกับคุณ อย่ารอนานเกินไปนะครับ",
      },
      gate: {
        level: 3,
        label: { en: "Level 3 sees this first", th: "ระดับ 3 เห็นก่อนใคร" },
      },
    },
    {
      id: "shop-05",
      name: { en: "Varsity Jacket", th: "แจ็กเก็ตวาร์ซิตี้" },
      desc: {
        en: "Wool-blend varsity jacket, patches embroidered from the tour. Warmer than it has any business being for how good it looks.",
        th: "แจ็กเก็ตวาร์ซิตี้เนื้อผ้าวูลผสม ปักแพตช์ลายจากทัวร์ อุ่นเกินหน้าตาที่หล่อขนาดนี้ไปมาก",
      },
      price: 2590,
      currency: "SGD",
      mediaKey: "shop-item-5",
      specs: [
        { en: "Wool-blend body, leather sleeves", th: "ตัวเสื้อผ้าวูลผสม แขนหนัง" },
        { en: "Chain-stitched tour dates across the back", th: "ปักโซ่ลายวันที่ทัวร์เต็มแผ่นหลัง" },
        { en: "Satin lining in the tour red", th: "ซับในผ้าซาตินสีแดงประจำทัวร์" },
        { en: "Sizes XS to XXL, unisex cut", th: "ไซซ์ XS ถึง XXL ทรงยูนิเซ็กซ์" },
      ],
      handoff: {
        en: "Runs a little large on purpose, the way I like mine, so size down if you want it neat.",
        th: "ทรงเผื่อไว้ใหญ่นิดหน่อยตั้งใจ แบบที่พี่ชอบใส่เอง ถ้าอยากได้ทรงพอดี ลดไซซ์ลงหนึ่งขนาดได้เลยครับ",
      },
    },
    {
      id: "shop-06",
      name: { en: "Photocard Set: Rooftop Era", th: "ชุดโฟโต้การ์ด: ยุคดาดฟ้า" },
      desc: {
        en: "5 photocards from the rooftop shoot, packed in a resealable sleeve so they survive your backpack better than I survived that shoot.",
        th: "โฟโต้การ์ด 5 ใบจากกองถ่ายดาดฟ้า บรรจุในซองปิดผนึกซ้ำได้ ทนกระเป๋าเป้ของคุณได้ดีกว่าที่พี่ทนกองถ่ายวันนั้นซะอีก",
      },
      price: 450,
      currency: "SGD",
      mediaKey: "shop-item-6",
    },
  ],

  // Skins — the online half of merch (9 Sep 2026).
  //
  // Four invented treatments for the Orbiter card face and the profile mark.
  // Nothing here is posted, so nothing here asks for an address: a skin is
  // bought with money and worn in the app. It is decoration and the copy says
  // so in one line the fan reads before the prices: a skin never changes your
  // level. No skin path touches Stardust, lifetime, level or badges.
  //
  // They are drawn in CSS out of the app's own world — velvet, bone, clay and
  // carmine taken to velvet depth — and none of them lights the card gold.
  // Gold on the Orbiter card is the level ring, which was earned.
  //
  // Prices are placeholder figures (PRD §12), labelled as placeholders in the
  // UI exactly like every other price in this pack.
  skins: [
    {
      id: "sk-velvet",
      name: { en: "Velvet Room", th: "ห้องกำมะหยี่" },
      desc: {
        en: "The house ground, deepened: the card as it looks from the back of a room where somebody has just turned the lights down.",
        th: "พื้นหลังประจำบ้านในโทนเข้มขึ้น เหมือนมองบัตรจากหลังห้องตอนที่มีคนเพิ่งหรี่ไฟลง",
      },
      price: 190,
    },
    {
      id: "sk-chalk",
      name: { en: "Chalk Film Stock", th: "ฟิล์มขาวชอล์ก" },
      desc: {
        en: "Bone and silver, with the tooth of a film stock pushed one stop. The quietest of the four and the only one that reads pale.",
        th: "โทนกระดูกกับเงิน พร้อมเนื้อฟิล์มที่ดันขึ้นหนึ่งสต็อป เงียบที่สุดในสี่แบบ และเป็นแบบเดียวที่อ่านออกมาเป็นโทนสว่าง",
      },
      price: 120,
    },
    {
      id: "sk-clay",
      name: { en: "Clay Court", th: "คอร์ตดิน" },
      desc: {
        en: "Terracotta ground and a line of court dust across the face, out of the clay-court shoot. Warm, and the only skin with any earth in it.",
        th: "พื้นสีดินเผากับเส้นฝุ่นคอร์ตพาดหน้าบัตร มาจากกองถ่ายคอร์ตดิน โทนอุ่น และเป็นสกินเดียวที่มีกลิ่นดิน",
      },
      price: 220,
    },
    {
      id: "sk-carmine",
      name: { en: "Midnight Carmine", th: "คาร์ไมน์เที่ยงคืน" },
      desc: {
        en: "Carmine taken down to velvet depth, so it sits under the type rather than on top of it. The darkest card face in the set.",
        th: "โทนคาร์ไมน์ที่ลดลงไปจนลึกเท่ากำมะหยี่ จึงอยู่ใต้ตัวอักษรแทนที่จะทับตัวอักษร เป็นหน้าบัตรที่มืดที่สุดในชุด",
      },
      price: 290,
    },
  ],

  // 3 events: 1 past (badge already earned), 1 live this week (scanned live
  // in the demo), 1 future (register interest).
  // `tier` is the capacity/admission chip on event cards. It never names a
  // price, so it renders as a neutral chip: ember belongs to money only.
  events: [
    {
      id: "event-01",
      name: { en: "Riverside Fan Meet", th: "งานพบปะแฟนคลับริมแม่น้ำ" },
      venue: { en: "Warehouse 3, Klong San Pier", th: "โกดัง 3 ท่าเรือคลองสาน" },
      city: "Bangkok",
      date: "2026-07-12",
      status: "past",
      badgeId: "badge-riverside",
      tier: { en: "Standing room, 200 in", th: "ยืนชมทั้งงาน รับ 200 คน" },
      line: {
        en: "One warehouse, two hundred people, and a set list nobody had seen, including me until about ten minutes before.",
        th: "โกดังหนึ่งหลัง คนสองร้อยคน กับเซ็ตลิสต์ที่ไม่มีใครเคยเห็น รวมถึงตัวพี่เองด้วย จนถึงสักสิบนาทีก่อนขึ้นเวที",
      },
      detail: [
        {
          lead: { en: "What happened:", th: "คืนนั้นเป็นอย่างไร:" },
          body: {
            en: "I played six songs on a borrowed acoustic because mine was stuck in traffic somewhere, then stayed until the last person in the room had said hello. The pier smelled like rain and fried garlic all night.",
            th: "พี่เล่นหกเพลงด้วยกีตาร์โปร่งที่ยืมมา เพราะกีตาร์ตัวเองติดรถอยู่ที่ไหนสักแห่ง แล้วอยู่ต่อจนคนสุดท้ายในห้องได้ทักทายครบ ท่าเรือคืนนั้นมีกลิ่นฝนปนกลิ่นกระเทียมเจียวอยู่ทั้งคืนครับ",
          },
        },
        {
          lead: { en: "What you took home:", th: "สิ่งที่ได้กลับบ้าน:" },
          body: {
            en: "Everyone who scanned in that night earned the Riverside Circle badge. It's still in your badge case whether or not you can remember the set list I could barely remember myself.",
            th: "ทุกคนที่สแกนเข้างานคืนนั้นได้แบดจ์วงในริมน้ำไปครอง มันยังอยู่ในตู้แบดจ์ของคุณ ไม่ว่าจะจำเซ็ตลิสต์ได้อยู่หรือเปล่า ซึ่งตัวพี่เองก็แทบจำไม่ได้เหมือนกันครับ",
          },
        },
      ],
    },
    {
      id: "event-02",
      name: { en: "Fanframe Pilot Showcase", th: "โชว์เคสนำร่อง Fanframe" },
      venue: { en: "The Grand Hall, EM District", th: "เดอะแกรนด์ฮอลล์ ย่านเอ็ม ดิสตริกต์" },
      city: "Bangkok",
      date: "2026-08-24",
      status: "live",
      badgeId: "badge-showcase-2026",
      scanCode: "FANFRAME-DEMO-2026",
      scanReward: 25,
      tier: { en: "Seated, 300 capacity", th: "ที่นั่ง รับ 300 คน" },
      line: {
        en: "The first night ORBIT does anything at all, so please be gentle with it.",
        th: "คืนแรกที่ ORBIT ได้ทำงานจริง เพราะงั้นใจดีกับมันหน่อยนะครับ",
      },
      detail: [
        {
          lead: { en: "What you'll love:", th: "สิ่งที่คุณจะชอบ:" },
          body: {
            en: "A full band, a room small enough to see faces from the stage, and the first live scan ORBIT has ever run, live, in front of all of you, no pressure.",
            th: "วงเต็มวง ห้องที่เล็กพอจะมองเห็นหน้าคนดูจากบนเวที และการสแกนสดครั้งแรกที่ ORBIT เคยทำ สดๆ ต่อหน้าทุกคนเลย ไม่กดดันอะไรครับ",
          },
        },
        {
          lead: { en: "What to bring:", th: "สิ่งที่ควรพกมา:" },
          body: {
            en: "Your phone at half brightness, a friend who hasn't signed up yet, and a little patience at the door while we put the code through its first real night and hope nothing catches fire.",
            th: "มือถือที่หรี่แสงลงครึ่งหนึ่ง เพื่อนสักคนที่ยังไม่ได้สมัคร และความใจเย็นนิดหน่อยตรงหน้าประตู ระหว่างที่เราให้ระบบโค้ดได้ลองสนามจริงคืนแรก แล้วก็ภาวนาให้ไม่มีอะไรพังครับ",
          },
        },
      ],
    },
    {
      id: "event-03",
      name: { en: "Autumn Acoustic Night", th: "ค่ำคืนอะคูสติกสายลมหนาว" },
      venue: { en: "Riverside Amphitheatre", th: "อัฒจันทร์ริมแม่น้ำ" },
      city: "Bangkok",
      date: "2026-09-18",
      status: "future",
      badgeId: "badge-acoustic-night",
      tier: { en: "Lawn seating, open capacity", th: "นั่งบนสนามหญ้า ไม่จำกัดจำนวน" },
      line: {
        en: "Acoustic, outdoors, and cold enough that I'm already threatening to bring a jacket onstage.",
        th: "อะคูสติก กลางแจ้ง และหนาวพอที่พี่กำลังคิดจะแอบพกแจ็กเก็ตขึ้นเวทีด้วยซ้ำ",
      },
      detail: [
        {
          lead: { en: "What you'll love:", th: "สิ่งที่คุณจะชอบ:" },
          body: {
            en: "Six songs stripped back to one voice and one guitar, on the river, after dark, with the boats still going past behind the stage like they don't know there's a show on.",
            th: "หกเพลงที่เหลือแค่เสียงร้องกับกีตาร์ตัวเดียว ริมแม่น้ำ หลังพระอาทิตย์ตก โดยมีเรือแล่นผ่านอยู่หลังเวทีไปเรื่อยๆ เหมือนไม่รู้ด้วยซ้ำว่ามีโชว์อยู่ครับ",
          },
        },
        {
          lead: { en: "What to bring:", th: "สิ่งที่ควรพกมา:" },
          body: {
            en: "Something warm. The amphitheatre is wide open to the water and the wind picks a fight with everyone after nine.",
            th: "อะไรที่ใส่แล้วอุ่นสักชิ้น อัฒจันทร์เปิดโล่งรับลมจากแม่น้ำ และหลังสามทุ่มลมจะเริ่มแรงจนเหมือนอยากท้าตีกับทุกคนเลยครับ",
          },
        },
      ],
    },
  ],

  // Livestreams (9 Sep 2026) — the third revenue stream, and the first one
  // where the fan pays for a night rather than for an object.
  //
  // Three invented streams, one on each access model, so the whole model is
  // visible in one screen: one free to everyone, one ticketed, one included
  // with Inner Circle. Nothing here is a real broadcast, no player is built,
  // and the detail page says so in the fan's own words rather than showing a
  // dead play button.
  //
  // The two currencies never cross, and this section is where a fan would most
  // reasonably assume otherwise. A ticket is money and grants nothing but the
  // night: no Stardust, no lifetime, no level, no badge. Showing up to a stream
  // that is running is earned, so it pays a small placeholder amount of Stardust
  // through the same grant path a venue check-in uses, once per stream, and no
  // amount of money reaches that path.
  //
  // `viewers` is an invented demo figure on the stream that is running, and it
  // is labelled as a demo figure wherever it renders. Prices and the attendance
  // Stardust are placeholder figures (PRD §12).
  streams: {
    attendStardust: 5,
    items: [
      {
        id: "ls-01",
        name: { en: "Paper Boats, Listening Party", th: "ปาร์ตี้ฟังเพลง Paper Boats" },
        when: "2026-09-09T20:00:00",
        status: "live",
        access: "free",
        viewers: 2840,
        how: {
          en: "Free to every Orbiter. It plays on this page, and there is nothing to book.",
          th: "ฟรีสำหรับ Orbiters ทุกคน เล่นอยู่บนหน้านี้ ไม่ต้องจองอะไรทั้งนั้น",
        },
        line: {
          en: "The whole single, start to finish, with me talking over the parts I should probably leave alone.",
          th: "ฟังซิงเกิลทั้งเพลงตั้งแต่ต้นจนจบ โดยมีพี่พูดแทรกในท่อนที่จริงๆ ควรปล่อยไว้เฉยๆ ครับ",
        },
        detail: [
          {
            lead: { en: "What it is:", th: "นี่คืออะไร:" },
            body: {
              en: "Paper Boats played through twice: once without me saying a word, then once with the story of what the second verse used to be before it got cut in the room.",
              th: "เปิด Paper Boats สองรอบ รอบแรกพี่ไม่พูดอะไรเลย รอบสองเล่าเรื่องว่าท่อนสองเคยเป็นยังไงก่อนโดนตัดในห้องอัดครับ",
            },
          },
          {
            lead: { en: "Who it is for:", th: "ใครดูได้บ้าง:" },
            body: {
              en: "Open this page while it is running. Nothing to buy, nothing to enter, and no membership in the way.",
              th: "เปิดหน้านี้ระหว่างที่ไลฟ์อยู่ ไม่ต้องซื้อ ไม่ต้องกรอกอะไร และไม่ต้องเป็นสมาชิกครับ",
            },
          },
        ],
      },
      {
        id: "ls-02",
        name: { en: "Soundcheck, Riverside Amphitheatre", th: "ซาวด์เช็ก อัฒจันทร์ริมแม่น้ำ" },
        when: "2026-09-18T17:30:00",
        status: "soon",
        access: "ticket",
        price: 149,
        how: {
          en: "One ticket, one stream. It opens on this page thirty minutes before the soundcheck starts.",
          th: "หนึ่งตั๋วต่อหนึ่งไลฟ์ เปิดบนหน้านี้ก่อนเริ่มซาวด์เช็ก 30 นาที",
        },
        line: {
          en: "The two hours before Autumn Acoustic Night, when the room is empty and everything still sounds wrong.",
          th: "สองชั่วโมงก่อนค่ำคืนอะคูสติกสายลมหนาว ตอนที่ห้องยังว่างเปล่าและทุกอย่างยังฟังดูผิดไปหมดครับ",
        },
        detail: [
          {
            lead: { en: "What it is:", th: "นี่คืออะไร:" },
            body: {
              en: "One camera at the back of the amphitheatre while we work out why the guitar is louder on the left, and six songs run at half attention until it stops being a problem.",
              th: "กล้องตัวเดียวตั้งอยู่หลังอัฒจันทร์ ระหว่างที่เราหาสาเหตุว่าทำไมกีตาร์ดังกว่าทางซ้าย แล้วซ้อมหกเพลงแบบครึ่งใจไปเรื่อยๆ จนกว่าจะหายเป็นปัญหาครับ",
            },
          },
          {
            lead: { en: "What a ticket is:", th: "ตั๋วคืออะไร:" },
            body: {
              en: "A ticket buys this one stream and nothing else. It is not a membership, it does not carry over to the next one, and it changes nothing about your level.",
              th: "ตั๋วซื้อไลฟ์ครั้งนี้ครั้งเดียว ไม่ใช่การเป็นสมาชิก ไม่ต่อยอดไปครั้งหน้า และไม่มีผลกับระดับของคุณเลย",
            },
          },
        ],
      },
      {
        id: "ls-03",
        name: { en: "Inner Circle Q&A, Late Session", th: "ถาม-ตอบอินเนอร์เซอร์เคิล รอบดึก" },
        when: "2026-09-24T21:00:00",
        status: "soon",
        access: "member",
        how: {
          en: "Included with Inner Circle. Members open this page and it plays; there is no ticket for it.",
          th: "รวมอยู่ในอินเนอร์เซอร์เคิลแล้ว สมาชิกเปิดหน้านี้ก็ดูได้เลย ไม่มีตั๋วขายสำหรับรอบนี้",
        },
        line: {
          en: "An hour of questions, answered badly and honestly, which is the only way I know how to do it.",
          th: "หนึ่งชั่วโมงของคำถาม ที่ตอบได้ไม่ค่อยดีแต่ตอบตามจริง ซึ่งเป็นวิธีเดียวที่พี่ทำเป็นครับ",
        },
        detail: [
          {
            lead: { en: "What it is:", th: "นี่คืออะไร:" },
            body: {
              en: "Questions collected in the Circle during the week, read out in the order they arrived, until either the questions or I run out.",
              th: "คำถามที่รวบรวมจาก The Circle ตลอดสัปดาห์ อ่านเรียงตามลำดับที่ส่งเข้ามา จนกว่าคำถามจะหมดหรือพี่จะหมดแรงก่อนครับ",
            },
          },
          {
            lead: { en: "What the membership opens:", th: "การเป็นสมาชิกเปิดอะไรให้:" },
            body: {
              en: "It comes with the membership, so a member never sees a price on it. A membership opens the room and nothing else: it moves no level and it earns no Stardust.",
              th: "รอบนี้มากับการเป็นสมาชิก สมาชิกจึงไม่เห็นราคาเลย การเป็นสมาชิกเปิดแค่ห้องนี้เท่านั้น ไม่ขยับระดับ และไม่ได้ Stardust",
            },
          },
        ],
      },
    ],
  },

  // 4 missions: 1 completable now (a 3-question quiz), 3 available.
  missions: [
    {
      id: "mission-01",
      title: { en: "Quick Quiz: How Well Do You Know Kai?", th: "แบบทดสอบสั้นๆ: คุณรู้จักไคดีแค่ไหน?" },
      desc: {
        en: "Three quick questions about me. Get them right and there's a Stardust bonus waiting.",
        th: "แค่ 3 คำถามสั้นๆ เกี่ยวกับพี่เอง ตอบถูกมีโบนัส Stardust รอคุณอยู่ครับ",
      },
      reward: 20,
      status: "completable",
      questions: [
        {
          q: {
            en: "According to his fan lore, which city does Kai call home growing up?",
            th: "ตามเรื่องราวที่แฟนคลับรู้กัน ไคเติบโตมาจากเมืองไหน?",
          },
          options: [
            { en: "Lampang", th: "ลำปาง" },
            { en: "Phuket", th: "ภูเก็ต" },
            { en: "Khon Kaen", th: "ขอนแก่น" },
          ],
          answer: 0,
        },
        {
          q: {
            en: "What's the title of the new single that just dropped?",
            th: "เพลงใหม่ที่เพิ่งปล่อยออกมาชื่อว่าอะไร?",
          },
          options: [
            { en: "Neon Tide", th: "Neon Tide" },
            { en: "Paper Boats", th: "Paper Boats" },
            { en: "Wrong Platform", th: "Wrong Platform" },
          ],
          answer: 0,
        },
        {
          q: {
            en: "In the Paper Boats story, what did young Kai race down a flooded soi?",
            th: "ในเรื่องราวเบื้องหลังเพลง Paper Boats ไคเอาอะไรมาแข่งกันตอนน้ำท่วมซอย?",
          },
          options: [
            { en: "Paper boats", th: "เรือกระดาษ" },
            { en: "Bicycles", th: "จักรยาน" },
            { en: "Toy cars", th: "รถของเล่น" },
          ],
          answer: 0,
        },
      ],
    },
    {
      id: "mission-02",
      title: { en: "Stream Neon Tide", th: "สตรีมเพลง Neon Tide" },
      desc: {
        en: "Give the new single a listen wherever you stream, headphones on if you can.",
        th: "ลองฟังเพลงใหม่บนแพลตฟอร์มที่คุณใช้ประจำ ใส่หูฟังฟังด้วยยิ่งดีครับ",
      },
      reward: 10,
      status: "available",
    },
    {
      id: "mission-03",
      title: { en: "Join the Live Session", th: "เข้าร่วมไลฟ์เซสชัน" },
      desc: {
        en: "Show up for the next livestream Q&A and say hi in the chat, I actually read it.",
        th: "มาร่วมไลฟ์ถาม-ตอบครั้งถัดไป แล้วมาทักทายกันในแชท พี่อ่านจริงๆ นะครับ",
      },
      reward: 15,
      status: "available",
    },
    {
      id: "mission-04",
      title: { en: "Bring a Friend", th: "ชวนเพื่อนมาด้วยกัน" },
      desc: {
        en: "Invite a friend to join the Orbiters. Stardust lands in both your accounts, no catch.",
        th: "ชวนเพื่อนมาเป็น Orbiters ด้วยกัน Stardust จะเข้าบัญชีทั้งสองฝั่งเลย ไม่มีเงื่อนไขซ่อนไว้ครับ",
      },
      reward: 15,
      status: "available",
    },
  ],

  // 5 badges: 3 already earned, 1 tied to the live event's badgeId — earned
  // live in the demo by scanning in — and 1 tied to winning a community
  // contest in the Circle, which is awarded through the same awardBadge()
  // path and never bought.
  badges: [
    {
      id: "badge-riverside",
      name: { en: "Riverside Circle", th: "วงในริมน้ำ" },
      desc: {
        en: "Earned by attending the Riverside Fan Meet.",
        th: "ได้รับจากการเข้าร่วมงานพบปะแฟนคลับริมแม่น้ำ",
      },
      earned: true,
      icon: "wave",
    },
    {
      id: "badge-early-riser",
      name: { en: "Early Riser", th: "ตื่นไวใจถึง" },
      desc: {
        en: "Earned for showing up in the first wave, back when this all started.",
        th: "ได้รับจากการเป็นหนึ่งในแฟนคลับกลุ่มแรกที่เข้าร่วมตั้งแต่วันแรกๆ",
      },
      earned: true,
      icon: "sunrise",
    },
    {
      id: "badge-story-collector",
      name: { en: "Song Story Collector", th: "นักสะสมเรื่องราวเพลง" },
      desc: {
        en: "Earned for unlocking every song story so far.",
        th: "ได้รับจากการปลดล็อกเรื่องราวเบื้องหลังเพลงครบทุกเพลง",
      },
      earned: true,
      icon: "headphones",
    },
    {
      id: "badge-showcase-2026",
      name: { en: "Showcase 2026", th: "โชว์เคส 2026" },
      desc: {
        en: "Earned by scanning in at the Fanframe Pilot Showcase.",
        th: "ได้รับจากการสแกนเข้าร่วมงานโชว์เคสนำร่อง Fanframe",
      },
      earned: false,
      icon: "spark",
    },
    {
      // Won, not bought: the Circle's contests are judged by the Orbiters who
      // set them and ratified by the artist's team, and the badge arrives
      // through awardBadge() like every other one.
      id: "badge-circle-contest",
      name: { en: "Circle Contest", th: "ผู้ชนะประกวด The Circle" },
      desc: {
        en: "Earned by winning a community contest in the Circle.",
        th: "ได้รับจากการชนะการประกวดของชุมชนใน The Circle",
      },
      earned: false,
      icon: "circle",
    },
  ],

  // One editorial takeover, threaded into the feed under the first card. The
  // dek is set in the display face at poster size, not in the mono rail voice,
  // so it reads as a campaign and never as another section header. Line breaks
  // are authored: they are the typesetting.
  takeover: {
    dek: {
      en: "Neon Tide\nis out now\nthe story's right here",
      th: "Neon Tide\nปล่อยแล้ว\nเรื่องราวเบื้องหลังอยู่ตรงนี้",
    },
    sub: {
      en: "The single's live everywhere. The story behind it, still a little raw, landed here first.",
      th: "เพลงปล่อยแล้วทุกแพลตฟอร์ม ส่วนเรื่องราวเบื้องหลังที่ยังดิบๆ อยู่นิดหน่อย มาลงที่นี่ก่อนที่อื่นครับ",
    },
    cta: { en: "Hear the story", th: "ฟังเรื่องราวเบื้องหลัง" },
    href: "#/item/feed-03",
  },

  announcements: [
    {
      id: "ann-02",
      title: { en: "Neon Tide Is Out", th: "Neon Tide ปล่อยแล้ว" },
      body: {
        en: "The new single is out now, right on time for once. Thanks for waiting with me while I kept moving the finish line.",
        th: "เพลงใหม่ปล่อยแล้ววันนี้ ตรงเวลาซะทีในชีวิต ขอบคุณที่รอพี่มาตลอด ทั้งที่พี่เลื่อนเส้นชัยไปเรื่อยๆ เองครับ",
      },
      date: "2026-08-21",
    },
    {
      id: "ann-01",
      title: { en: "Meetup This Saturday", th: "นัดเจอกันวันเสาร์นี้" },
      body: {
        en: "Meetup this Saturday. Scan there for double Stardust, and bring water, that warehouse gets warm fast.",
        th: "นัดเจอกันวันเสาร์นี้ สแกนที่งานรับ Stardust ได้เป็นสองเท่าเลย พกน้ำมาด้วยนะ โกดังนั้นร้อนไวมากครับ",
      },
      date: "2026-08-21",
    },
  ],

  // Single paid tier, on two plans. Pricing is a placeholder pending PRD §12
  // open decision on premium pricing per market.
  //
  // THE GOVERNING FRAME (Isaac, 9 Sep 2026): Inner Circle sits BESIDE the
  // Stardust ladder, never above it. A membership opens access and things — the
  // top exclusive tier, editions, the Exchange, the sign-up gifts and the
  // tenure gifts below. It never moves a rung and it never opens a
  // rank-gated thing. Copy in this section says "alongside" and "beside",
  // and never "on top of" the ranking.
  premium: {
    name: { en: "Inner Circle", th: "อินเนอร์เซอร์เคิล" },
    priceLabel: { en: "฿149/mo (placeholder)", th: "฿149/เดือน (ราคาชั่วคราว)" },

    // Two plans, one tier. The annual plan is the same membership paid once a
    // year; it adds gifts, never standing. All figures placeholder (PRD §12).
    plans: [
      {
        id: "monthly",
        price: 149,
        name: { en: "Monthly", th: "รายเดือน" },
        priceLabel: { en: "฿149/mo (placeholder)", th: "฿149/เดือน (ราคาชั่วคราว)" },
        billing: { en: "Billed every month", th: "เรียกเก็บทุกเดือน" },
      },
      {
        id: "annual",
        price: 1490,
        name: { en: "Annual", th: "รายปี" },
        priceLabel: { en: "฿1,490/yr (placeholder)", th: "฿1,490/ปี (ราคาชั่วคราว)" },
        billing: { en: "Billed once a year", th: "เรียกเก็บปีละครั้ง" },
        note: {
          en: "Two months lighter than paying monthly, and the gifts below arrive because you signed up for a year.",
          th: "ถูกกว่าจ่ายรายเดือนประมาณสองเดือน แล้วของขวัญด้านล่างจะมาถึงเพราะคุณสมัครแบบรายปีครับ",
        },
      },
    ],

    // Sign-up gifts on the annual plan. Things and post, never points.
    annualGifts: [
      {
        en: "A birthday card from Kai, posted, with your name actually written on it",
        th: "การ์ดวันเกิดจากพี่ไค ส่งทางไปรษณีย์ มีชื่อคุณเขียนอยู่บนนั้นจริงๆ",
      },
      {
        en: "A physical Orbiter card, printed with your name and your Orbiter number",
        th: "การ์ด Orbiter ตัวจริง พิมพ์ชื่อคุณกับเลขประจำตัว Orbiter ของคุณ",
      },
      {
        en: "The member mark on your card the day you join, no waiting",
        th: "เครื่องหมายสมาชิกบนการ์ดของคุณตั้งแต่วันแรกที่สมัคร ไม่ต้องรอ",
      },
    ],

    // Tenure escalation: staying a year adds things, never rungs. Year 1 is
    // the plan itself, so only years 2 and 3 are listed here.
    tenure: [
      {
        year: 2,
        perks: [
          { en: "A printed frame from the year's shows, numbered and posted once a year", th: "ภาพพิมพ์จากโชว์ตลอดปี ใส่เลขกำกับ ส่งให้ปีละครั้ง" },
          { en: "The early-access window opens a day wider on everything he posts", th: "ช่วงเวลาดูก่อนใครขยายออกอีกหนึ่งวันสำหรับทุกอย่างที่เขาโพสต์" },
        ],
      },
      {
        year: 3,
        perks: [
          { en: "Your name in the thanks at the back of the tour book", th: "ชื่อคุณอยู่ในหน้าขอบคุณท้ายเล่มทัวร์บุ๊ก" },
          { en: "First call on the small rooms before registration opens to members", th: "ได้รับการติดต่อก่อนสำหรับงานเล็กๆ ก่อนเปิดลงทะเบียนให้สมาชิกทั่วไป" },
        ],
      },
    ],

    perks: [
      { en: "Early access to everything I post, before it's tidied up for anyone else", th: "ดูคอนเทนต์ของพี่ได้ก่อนใคร ก่อนที่พี่จะเรียบเรียงให้ดูดีสำหรับคนอื่น" },
      { en: "Every exclusive, unlocked automatically, no counting Stardust", th: "ปลดล็อกคอนเทนต์เอ็กซ์คลูซีฟทั้งหมดอัตโนมัติ ไม่ต้องมานั่งนับ Stardust" },
      { en: "A member badge on your profile, quietly bragging for you", th: "แบดจ์สมาชิกพิเศษติดโปรไฟล์ อวดแทนคุณแบบเงียบๆ" },
      { en: "A direct line into future meetups with other Orbiters, the ones that actually happen in a room", th: "โอกาสเข้าร่วมงานพบปะกับ Orbiters คนอื่นๆ ในอนาคต งานที่เกิดขึ้นจริงในห้องจริงๆ" },
    ],
    // Copy handoff: the warm line that walks the reader from the perk list
    // into the button underneath it.
    handoff: {
      en: "One tap, and everything locked in your feed quietly opens, the way a good door should.",
      th: "แตะครั้งเดียว สิ่งที่ล็อกอยู่ในฟีดของคุณก็จะเปิดขึ้นมาเงียบๆ เหมือนประตูที่ดีควรจะเป็นครับ",
    },
  },

  // The Companion — scripted preview pool (9 Sep 2026).
  //
  // Every line below is invented and written in advance. Nothing here is
  // generated, and none of it is a real statement by a real person. The
  // shipping Companion is planned as a retrieval model over Kai's own
  // approved material, with his sign-off and a kill switch (PRODUCT.md,
  // PRD §11); this pool is the placeholder register until then, and the UI
  // says so at the top of the thread.
  //
  // Economics are placeholder figures (PRD §12): the free allowance, the
  // member allowance and the pack price are all open decisions. Fan-facing
  // metering is always "messages". Money buys messages; Stardust never buys
  // messages, and messages never buy Stardust, a level or a badge.
  companion: {
    freeMessages: 200,
    memberMessages: 500,
    pack: { messages: 100, price: 59 },

    // Kai opens the thread. Rendered, never stored, so a reset returns here.
    opener: {
      en: "You made it. Ask me something. I answer faster here than I do in the group chat, which is a low bar, I know.",
      th: "มาถึงจนได้ ถามอะไรพี่ก็ได้เลย ตรงนี้พี่ตอบไวกว่าในกลุ่มแชทเยอะ ซึ่งก็ไม่ได้ยากอะไรหรอกนะครับ",
    },

    // Keyword routing, first match wins, matched case-insensitively against
    // the fan's own words in either language.
    replies: [
      {
        id: "greeting",
        match: ["hi", "hello", "hey", "morning", "good night", "สวัสดี", "หวัดดี", "ดีครับ", "ดีค่ะ"],
        text: {
          en: "Hey. Good to see your name come up. What is on your mind today?",
          th: "เฮ้ ดีใจที่เห็นชื่อคุณเด้งขึ้นมา วันนี้มีอะไรในใจบ้างครับ",
        },
      },
      {
        id: "song",
        match: ["song", "music", "sing", "album", "lyric", "write", "เพลง", "ร้อง", "อัลบั้ม", "เนื้อเพลง", "แต่งเพลง"],
        text: {
          en: "Most of them start at two in the morning and get fixed at noon, once I can hear how dramatic I was being. Neon Tide took four tries. The fourth one is the one you have.",
          th: "เพลงส่วนใหญ่เริ่มตอนตีสอง แล้วมาแก้ตอนเที่ยง ตอนที่พี่ได้ยินว่าตัวเองดราม่าแค่ไหน Neon Tide ทำไปสี่รอบ รอบที่สี่คือรอบที่คุณได้ฟังครับ",
        },
      },
      {
        id: "tour",
        match: ["tour", "show", "concert", "event", "meetup", "stage", "ticket", "ทัวร์", "คอนเสิร์ต", "งาน", "เวที", "บัตร"],
        text: {
          en: "Dates land on the events page before they land anywhere else, so keep an eye there. Scan the code when you are in the room and I will know you came.",
          th: "รอบต่างๆ จะขึ้นในหน้ากิจกรรมก่อนที่อื่นเสมอ คอยดูไว้นะครับ ถ้ามาถึงงานแล้วก็สแกนโค้ดไว้ แล้วพี่จะรู้ว่าคุณมา",
        },
      },
      {
        id: "smalltalk",
        match: ["eat", "food", "coffee", "sleep", "tired", "dinner", "breakfast", "กิน", "อาหาร", "กาแฟ", "นอน", "เหนื่อย", "ข้าว"],
        text: {
          en: "Coffee, then a proper meal around four, then a promise that tonight I sleep early. I have kept that promise maybe twice. How about you?",
          th: "กาแฟก่อน แล้วค่อยกินข้าวจริงจังตอนสี่โมง แล้วก็สัญญากับตัวเองว่าคืนนี้จะนอนเร็ว สัญญานี้พี่ทำได้จริงประมาณสองครั้งมั้งครับ แล้วคุณล่ะ",
        },
      },
    ],

    // Where the pool runs out. It says so rather than inventing an answer.
    fallback: {
      en: "I do not have a good answer to that one yet. Write it down anyway. When the real Companion opens, questions like yours are what it gets trained to hold.",
      th: "คำถามนี้พี่ยังตอบได้ไม่ดีพอ แต่พิมพ์ทิ้งไว้เลยครับ พอคู่หูตัวจริงเปิดใช้งาน คำถามแบบของคุณนี่แหละที่มันจะถูกฝึกให้รับไหว",
    },
  },

  // Collector's editions — the Inner Circle shop section (9 Sep 2026,
  // reworked 9 Sep 2026 to concert-worn objects).
  //
  // Three invented objects that Kai used or wore on a named night. Nothing
  // below is a fact about a real person, a real garment or a real show: the
  // nights themselves are the invented ones this pack already carries, so the
  // app reads as one world. Every object is one of a short numbered run of
  // pieces from that same night: `editionOf` is the size of the run and
  // `offered` is the number the demo fan is handed at checkout, so the
  // walkthrough shows the same edition number every time.
  //
  // `artwork` is what the holder receives alongside the object: a drawn
  // monoline illustration of the object, named in the fan's words, and the
  // `mark` it opens on the Orbiter card. The drawing lives in index.html beside
  // the badge icons, because it is an icon in the same stroke language and not
  // a photograph — there is no photography here and no likeness of anyone.
  //
  // Vocabulary is binding here and audited: edition, artwork, mark,
  // provenance, numbered, collector. The retired economy words stay retired,
  // in the copy and in these comments. An edition is an object bought with
  // money; it grants no Stardust, no level and no badge, and the checkout
  // deliberately touches none of them. The artwork and the mark travel with
  // the object when it is resold, because they belong to the object.
  //
  // Prices are placeholder figures (PRD §12), labelled as placeholders in the
  // UI exactly like unlock pricing and the membership price.
  editions: [
    {
      id: "ed-01",
      name: { en: "Riverside Fan Meet Microphone", th: "ไมโครโฟนจากงานพบปะแฟนคลับริมแม่น้ำ" },
      desc: {
        en: "One of the three handhelds passed around the stage at the Riverside Fan Meet, still wearing the coloured tape the crew wrapped round the shaft to tell them apart.",
        th: "หนึ่งในสามไมค์มือถือที่ส่งกันไปมาบนเวทีในงานพบปะแฟนคลับริมแม่น้ำ ยังมีเทปสีที่ทีมงานพันไว้ที่ด้ามเพื่อแยกไมค์ติดอยู่",
      },
      // The provenance line: which night the object was used on, what is
      // recorded, and against whose name. It is said here once and repeated
      // verbatim wherever the fan sees the edition again.
      provenance: {
        en: "Used on stage at the Riverside Fan Meet, Bangkok, 12 July 2026. Numbered by hand and recorded to your name.",
        th: "ใช้งานจริงบนเวทีงานพบปะแฟนคลับริมแม่น้ำ กรุงเทพฯ 12 กรกฎาคม 2026 เขียนเลขกำกับด้วยมือ และบันทึกไว้ในชื่อของคุณ",
      },
      artwork: {
        name: { en: "The Riverside Microphone", th: "ภาพไมโครโฟนริมแม่น้ำ" },
        mark: "mic",
      },
      price: 12000,
      editionOf: 3,
      offered: 2,
    },
    {
      id: "ed-02",
      name: { en: "Fanframe Pilot Showcase Jacket", th: "แจ็กเก็ตจากโชว์เคสนำร่อง Fanframe" },
      desc: {
        en: "One of the six stage jackets worn across the changes at the Fanframe Pilot Showcase, wool blend, tour patch on the sleeve, hem still pinned where wardrobe ran out of night.",
        th: "หนึ่งในหกแจ็กเก็ตเวทีที่ใส่สลับกันตลอดงานโชว์เคสนำร่อง Fanframe ผ้าวูลผสม ปักแพตช์ทัวร์ที่แขน ชายเสื้อยังกลัดเข็มหมุดไว้ตรงที่ทีมเสื้อผ้าทำไม่ทัน",
      },
      provenance: {
        en: "Worn on stage at the Fanframe Pilot Showcase, Bangkok, 24 August 2026. Numbered on the inside placket and recorded to your name.",
        th: "สวมใส่จริงบนเวทีงานโชว์เคสนำร่อง Fanframe กรุงเทพฯ 24 สิงหาคม 2026 เลขกำกับอยู่ด้านในสาบเสื้อ และบันทึกไว้ในชื่อของคุณ",
      },
      artwork: {
        name: { en: "The Showcase Jacket", th: "ภาพแจ็กเก็ตโชว์เคส" },
        mark: "jacket",
      },
      price: 6400,
      editionOf: 6,
      offered: 4,
    },
    {
      id: "ed-03",
      name: { en: "Neon Tide Tour Setlist Sheet", th: "แผ่นเซ็ตลิสต์จากทัวร์ Neon Tide" },
      desc: {
        en: "One of the twenty-four setlist sheets taped across the stage and the monitor desk on the last night of the Neon Tide Tour, running order changed twice in pen before the doors opened.",
        th: "หนึ่งในยี่สิบสี่แผ่นเซ็ตลิสต์ที่ติดเทปไว้ทั่วเวทีและโต๊ะมอนิเตอร์ในคืนสุดท้ายของทัวร์ Neon Tide ลำดับเพลงถูกแก้ด้วยปากกาสองรอบก่อนเปิดประตู",
      },
      provenance: {
        en: "Taped to the stage on the last night of the Neon Tide Tour, Bangkok, 30 May 2026. Numbered in the margin and recorded to your name.",
        th: "ติดเทปไว้บนเวทีในคืนสุดท้ายของทัวร์ Neon Tide กรุงเทพฯ 30 พฤษภาคม 2026 เลขกำกับอยู่ที่ขอบกระดาษ และบันทึกไว้ในชื่อของคุณ",
      },
      artwork: {
        name: { en: "The Neon Tide Setlist", th: "ภาพเซ็ตลิสต์ Neon Tide" },
        mark: "setlist",
      },
      price: 2900,
      editionOf: 24,
      offered: 11,
    },
  ],

  // The Exchange — the resale market for editions (9 Sep 2026).
  //
  // Seeded with three invented listings. The seller handles are invented in
  // the same shape as the demo fan's own referral handle and belong to no
  // real person. Every resale pays the artist a royalty, and the percentage
  // is a placeholder figure (PRD §12) labelled as one wherever it renders.
  //
  // The standing rule the UI states at the point of doubt: only an edition a
  // fan already owns can be listed. Stardust, levels and badges are earned and
  // are never sold, by anyone, anywhere in this app.
  //
  // The artwork and the mark it opens travel with the object: the buyer gains
  // both and the seller loses both, because they belong to the edition and
  // never to the person. Every listed number is a different piece of the same
  // night from the one the shop is still offering.
  exchange: {
    royaltyPct: 10,
    listings: [
      { id: "lx-01", editionId: "ed-01", no: 1, price: 14500, seller: "nan-2207" },
      { id: "lx-02", editionId: "ed-02", no: 3, price: 7200, seller: "beam-0416" },
      { id: "lx-03", editionId: "ed-03", no: 9, price: 3400, seller: "mook-7731" },
    ],
  },

  // The Circle — the community space (9 Sep 2026).
  //
  // Converted from boards-and-threads to chat rooms on 9 Sep 2026 (Isaac:
  // "the community chat should be more of a chat than a forum"). A board was
  // an archive the fan read; a room is a conversation the fan walks into, and
  // belonging reads as presence rather than as a back catalogue. The three
  // boards became the three rooms below, and the five seeded threads were
  // retuned into three continuous logs: same five handles, same voices, same
  // events, lines cut to the length people actually type.
  //
  // Everything below is invented: the rooms, the logs, the meetups and the
  // contests. The Orbiter handles are written in the same shape as the
  // Exchange's sellers and three of them are the same handles, so the app
  // reads as one world with the same people in it. None of them is a real
  // person, no line is a real statement by anyone, and nothing here is a fact
  // about a real venue, a real show or a real competition.
  //
  // Community events are run by fans and are marked as such wherever they
  // appear. Official dates stay on the events page, and the Circle links to
  // it rather than restating a single one of them.
  //
  // Contests are inside the earned-only rule and nowhere near the money.
  // Entering grants a small placeholder amount of Stardust, once per contest,
  // through the same grant path every other earn uses, so it lands in the
  // ledger and can never be awarded twice. Winning grants a badge, a mark for
  // the Orbiter card, or a merch edition arranged off-app; no contest path
  // touches a price, and no purchase path touches a contest.
  community: {
    // Contest Stardust, in one place. A placeholder figure (PRD §12), labelled as
    // one everywhere it renders.
    entryStardust: 5,

    // The three rooms. Each carries its seeded log, an invented presence
    // figure, and its own small pool of scripted answers.
    //
    // `here` is DEMO ONLY. Nobody is in these rooms: the figure is invented,
    // it never moves, and the room list carries one quiet mono note saying
    // so. It exists because a room with no sense of who is in it reads as an
    // archive, which is the thing this conversion moved away from.
    //
    // `replies` is DEMO ONLY as well, and is the same honesty the Companion
    // keeps: written in advance, never generated. One of these lines answers
    // the fan the first time they say something in a room, after a typing
    // pause, and never again in that room. The room page says so in its own
    // words before the fan types.
    rooms: [
      {
        id: "rm-tonight",
        name: { en: "Tonight's show", th: "โชว์คืนนี้" },
        sub: {
          en: "Before, during and after. What the room actually felt like.",
          th: "ก่อน ระหว่าง และหลังจบงาน บรรยากาศในห้องนั้นเป็นยังไงบ้าง",
        },
        here: 128,
        log: [
          {
            by: "nan-2207",
            ts: "2026-09-07T23:40:00",
            text: {
              en: "Got here four songs in. What was the opener?",
              th: "มาถึงตอนเล่นไปสี่เพลงแล้ว เปิดด้วยเพลงอะไรเหรอ",
            },
          },
          {
            by: "nan-2207",
            ts: "2026-09-07T23:41:00",
            text: {
              en: "I am going to lose sleep over this one.",
              th: "เรื่องนี้คงทำให้นอนไม่หลับแน่",
            },
          },
          {
            by: "mook-7731",
            ts: "2026-09-08T00:12:00",
            text: {
              en: "Slow Static. The slow half of it, on the keys alone.",
              th: "Slow Static ท่อนช้า เล่นคีย์บอร์ดอย่างเดียว",
            },
          },
          {
            by: "mook-7731",
            ts: "2026-09-08T00:13:00",
            text: {
              en: "Nobody sang along for the first minute. Nobody recognised it.",
              th: "นาทีแรกไม่มีใครร้องตามเลย จำกันไม่ได้",
            },
          },
          {
            by: "nan-2207",
            ts: "2026-09-08T07:05:00",
            text: {
              en: "That explains every video shot from the front.",
              th: "มิน่าคลิปที่ถ่ายจากด้านหน้าถึงเงียบกันหมด",
            },
          },
          {
            by: "nan-2207",
            ts: "2026-09-08T07:06:00",
            text: {
              en: "Thank you. I can sleep.",
              th: "ขอบคุณมาก คืนนี้นอนหลับแล้ว",
            },
          },
          {
            by: "mook-7731",
            ts: "2026-09-08T21:15:00",
            text: {
              en: "Separate thing. Grey knitted scarf, left on the barrier, stage left.",
              th: "อีกเรื่องนึง ผ้าพันคอไหมพรมสีเทา ตกไว้บนแผงกั้นฝั่งซ้ายเวที",
            },
          },
          {
            by: "mook-7731",
            ts: "2026-09-08T21:16:00",
            text: {
              en: "I handed it in at the venue desk. Ask for it there.",
              th: "เอาไปฝากไว้ที่เคาน์เตอร์หน้างานแล้ว ไปถามที่นั่นได้เลย",
            },
          },
          {
            by: "pim-1183",
            ts: "2026-09-08T22:02:00",
            text: {
              en: "That is mine. Going tomorrow after work.",
              th: "ของเราเอง พรุ่งนี้เลิกงานแล้วจะไปรับ",
            },
          },
          {
            by: "pim-1183",
            ts: "2026-09-08T22:03:00",
            text: {
              en: "You saved my week.",
              th: "ช่วยชีวิตทั้งสัปดาห์เลย",
            },
          },
        ],
        replies: [
          {
            by: "mook-7731",
            text: {
              en: "Somebody always has that on video. Give it an hour.",
              th: "เดี๋ยวก็มีคนเอาคลิปมาลง รอสักชั่วโมงนึง",
            },
          },
          {
            by: "pim-1183",
            text: {
              en: "Same here. I only worked it out on the way home.",
              th: "เหมือนกันเลย เพิ่งมานึกออกตอนขากลับ",
            },
          },
          {
            by: "nan-2207",
            text: {
              en: "Was that the night the keys came in late? I was too far back.",
              th: "คืนนั้นคีย์บอร์ดเข้าช้าใช่ไหม เรายืนไกลไปเลยไม่แน่ใจ",
            },
          },
        ],
      },
      {
        id: "rm-projects",
        name: { en: "Fan projects", th: "โปรเจกต์ของแฟนคลับ" },
        sub: {
          en: "Banners, subtitles, birthday plans. Bring people in.",
          th: "แบนเนอร์ ซับไตเติล แผนวันเกิด ชวนคนอื่นมาช่วยกันได้เลย",
        },
        here: 74,
        log: [
          {
            by: "beam-0416",
            ts: "2026-09-05T19:30:00",
            text: {
              en: "Two of us are doing Thai into English on the behind the scenes clips.",
              th: "ตอนนี้มีสองคนช่วยกันแปลไทยเป็นอังกฤษในคลิปเบื้องหลัง",
            },
          },
          {
            by: "beam-0416",
            ts: "2026-09-05T19:31:00",
            text: {
              en: "We need one more on timing, and someone who can check the Chinese.",
              th: "ขอเพิ่มอีกคนมาช่วยจับเวลา กับใครสักคนที่ตรวจภาษาจีนได้",
            },
          },
          {
            by: "ohm-5540",
            ts: "2026-09-05T20:48:00",
            text: {
              en: "Timing at weekends, I can do. I am slow, but I do not miss lines.",
              th: "เสาร์อาทิตย์ช่วยจับเวลาได้ ทำช้าหน่อยแต่ไม่พลาดบรรทัด",
            },
          },
          {
            by: "beam-0416",
            ts: "2026-09-05T21:16:00",
            text: {
              en: "Slow and complete beats fast and half done. You are in.",
              th: "ช้าแต่ครบ ดีกว่าไวแล้วขาด รับเข้าทีมเลย",
            },
          },
          {
            by: "ohm-5540",
            ts: "2026-09-06T12:05:00",
            text: {
              en: "Separate thing. Banner for the next Bangkok night.",
              th: "อีกเรื่องนึง แบนเนอร์สำหรับงานกรุงเทพรอบหน้า",
            },
          },
          {
            by: "ohm-5540",
            ts: "2026-09-06T12:06:00",
            text: {
              en: "One long one instead of twenty small ones, so it reads from the back.",
              th: "ทำผืนยาวผืนเดียว แทนที่จะทำเล็กๆ ยี่สิบผืน จะได้อ่านออกจากหลังห้อง",
            },
          },
          {
            by: "ohm-5540",
            ts: "2026-09-06T12:07:00",
            text: {
              en: "Anyone who can sew a hem, speak up.",
              th: "ใครเย็บริมผ้าเป็นบ้าง ยกมือหน่อย",
            },
          },
          {
            by: "nan-2207",
            ts: "2026-09-06T13:40:00",
            text: {
              en: "My mother sews. I am volunteering her now and telling her later.",
              th: "แม่เราเย็บผ้าเป็น ขออาสาแทนแม่ไปก่อน เดี๋ยวค่อยไปบอกทีหลัง",
            },
          },
          {
            by: "beam-0416",
            ts: "2026-09-06T13:52:00",
            text: {
              en: "Then her name goes on the back of it.",
              th: "งั้นเขียนชื่อแม่ไว้หลังผืนด้วย",
            },
          },
        ],
        replies: [
          {
            by: "beam-0416",
            text: {
              en: "Noted. Put your name down and I will pair you with someone.",
              th: "รับทราบ ลงชื่อไว้ เดี๋ยวจับคู่ให้",
            },
          },
          {
            by: "ohm-5540",
            text: {
              en: "I can take that on if nobody else has.",
              th: "ถ้ายังไม่มีใครทำ เดี๋ยวรับไปเอง",
            },
          },
          {
            by: "nan-2207",
            text: {
              en: "Say the word and I will bring the scissors.",
              th: "บอกมาได้เลย เดี๋ยวหอบกรรไกรไปให้",
            },
          },
        ],
      },
      {
        id: "rm-newcomers",
        name: { en: "Newcomers", th: "หน้าใหม่" },
        sub: {
          en: "New here, say hello. Been here a while, say it back.",
          th: "เพิ่งเข้ามาก็ทักทายได้เลย อยู่มานานแล้วก็ทักกลับด้วยนะ",
        },
        here: 41,
        log: [
          {
            by: "pim-1183",
            ts: "2026-09-02T09:20:00",
            text: {
              en: "Four years in and I have never met another Orbiter in Lampang.",
              th: "ตามมาสี่ปีแล้ว ยังไม่เคยเจอ Orbiter คนอื่นในลำปางเลย",
            },
          },
          {
            by: "pim-1183",
            ts: "2026-09-02T09:21:00",
            text: {
              en: "Surely I am not the only one up here.",
              th: "ไม่น่าจะมีเราคนเดียวใช่ไหม",
            },
          },
          {
            by: "mook-7731",
            ts: "2026-09-02T10:04:00",
            text: {
              en: "Not the only one. Six of us were on the bus down for Riverside.",
              th: "ไม่ได้มีคนเดียวแน่นอน ตอนนั่งรถลงไปงานริมน้ำ นับได้หกคน",
            },
          },
          {
            by: "pim-1183",
            ts: "2026-09-02T10:31:00",
            text: {
              en: "Six is a meetup. Someone pick a cafe.",
              th: "หกคนนี่ตั้งวงได้แล้ว ใครเลือกร้านกาแฟหน่อย",
            },
          },
          {
            by: "ohm-5540",
            ts: "2026-09-02T10:44:00",
            text: {
              en: "I have been reading here for a year. First time saying anything.",
              th: "อ่านอยู่ในนี้มาปีนึงแล้ว นี่เป็นครั้งแรกที่พิมพ์",
            },
          },
          {
            by: "beam-0416",
            ts: "2026-09-02T10:52:00",
            text: {
              en: "Then the hello is done. Welcome in.",
              th: "งั้นถือว่าทักทายเรียบร้อย ยินดีต้อนรับ",
            },
          },
          {
            by: "nan-2207",
            ts: "2026-09-02T11:10:00",
            text: {
              en: "Everyone here read first and spoke later. Nobody minds.",
              th: "ทุกคนในนี้ก็อ่านก่อนแล้วค่อยพิมพ์ทั้งนั้น ไม่มีใครว่าหรอก",
            },
          },
        ],
        replies: [
          {
            by: "pim-1183",
            text: {
              en: "Welcome in. Say which city you are in and someone will be near.",
              th: "ยินดีต้อนรับ บอกมาว่าอยู่เมืองไหน เดี๋ยวมีคนอยู่แถวนั้นแน่",
            },
          },
          {
            by: "beam-0416",
            text: {
              en: "Good to have you. Nobody here started any differently.",
              th: "ดีใจที่เข้ามา ทุกคนในนี้ก็เริ่มแบบเดียวกันทั้งนั้น",
            },
          },
        ],
      },
    ],

    // 2 community-run meetups. These are not official dates: the app marks
    // them community-run wherever they appear and points at the events page
    // for the nights the artist's side runs.
    events: [
      {
        id: "ce-01",
        by: "nan-2207",
        name: { en: "Fan cafe listening afternoon", th: "บ่ายฟังเพลงที่คาเฟ่แฟนคลับ" },
        date: "2026-09-20",
        city: "Bangkok",
        venue: { en: "Baan Klang cafe, Ari", th: "คาเฟ่บ้านกลาง อารีย์" },
        line: {
          en: "Two hours of the back catalogue on the house speakers, ordered by whoever gets there first.",
          th: "สองชั่วโมงกับเพลงเก่าทั้งหมดผ่านลำโพงร้าน ใครถึงก่อนได้เลือกก่อน",
        },
      },
      {
        id: "ce-02",
        by: "beam-0416",
        name: { en: "Banner making, the afternoon before", th: "ทำแบนเนอร์ ช่วงบ่ายก่อนงาน" },
        date: "2026-10-03",
        city: "Bangkok",
        venue: { en: "A borrowed room in Ratchathewi", th: "ห้องที่ยืมมาแถวราชเทวี" },
        line: {
          en: "Bring scissors, bring fabric paint, or bring nothing at all. There is enough to share.",
          th: "จะหอบกรรไกรมา เอาสีเพนต์ผ้ามา หรือมามือเปล่าก็ได้ ของมีพอแบ่งกันใช้",
        },
      },
    ],

    // 3 community-run contests. `prize` names which of the app's own things
    // the winner receives: a badge, a mark for the Orbiter card, or a merch
    // edition arranged off-app. Entering earns the placeholder Stardust above,
    // once, whichever contest it is.
    contests: [
      {
        id: "ct-01",
        by: "beam-0416",
        name: { en: "Cover art for the next single", th: "ออกแบบปกซิงเกิลถัดไป" },
        closes: "2026-09-30",
        brief: {
          en: "Draw it, paint it, or build it out of paper. One entry each, any medium, nothing traced off a photograph.",
          th: "จะวาด จะระบายสี หรือจะตัดกระดาษทำก็ได้ คนละหนึ่งชิ้น สื่ออะไรก็ได้ แต่ห้ามลอกจากภาพถ่าย",
        },
        prize: "badge",
        badgeId: "badge-circle-contest",
        prizeLine: {
          en: "The winning piece runs with the announcement, and the winner earns the Circle Contest badge.",
          th: "ผลงานที่ชนะจะขึ้นคู่กับประกาศเปิดตัว และผู้ชนะจะได้แบดจ์ผู้ชนะประกวด The Circle",
        },
      },
      {
        id: "ct-02",
        by: "mook-7731",
        name: { en: "Cover video challenge", th: "ชาเลนจ์คัฟเวอร์วิดีโอ" },
        closes: "2026-10-12",
        brief: {
          en: "Sixty seconds of any song off the last two records. Sing it, play it, or dance to it.",
          th: "หกสิบวินาที จากเพลงไหนก็ได้ในสองอัลบั้มหลัง จะร้อง จะเล่น หรือจะเต้นก็ได้",
        },
        prize: "mark",
        markId: "stage",
        prizeLine: {
          en: "The winner keeps the stage light mark on their Orbiter card, whether or not they are a member.",
          th: "ผู้ชนะจะได้มาร์กไฟเวทีไว้บน Orbiter card ไม่ว่าจะเป็นสมาชิกอยู่หรือไม่ก็ตาม",
        },
      },
      {
        id: "ct-03",
        by: "ohm-5540",
        name: { en: "Banner design for the Bangkok night", th: "ออกแบบแบนเนอร์สำหรับงานกรุงเทพ" },
        closes: "2026-09-26",
        brief: {
          en: "One line of text, big enough to read from the back. Thai or English, not both.",
          th: "ข้อความบรรทัดเดียว ตัวใหญ่พอให้อ่านออกจากหลังห้อง จะไทยหรืออังกฤษก็ได้ แต่เลือกอย่างเดียว",
        },
        prize: "merch",
        prizeLine: {
          en: "The winning design is printed as a small merch edition and sent out by Kai's team.",
          th: "แบบที่ชนะจะถูกพิมพ์เป็นสินค้ารุ่นเล็กๆ และจัดส่งโดยทีมงานของไค",
        },
      },
    ],
  },

  // Stardust only, both sides. No cash reward, no cash-out.
  //
  // The bonus (9 Sep 2026): bring two Orbiters inside two months and a one-time
  // Stardust grant lands, once ever, through the same earn path a venue check-in
  // uses. Its SIZE IS NOT A ROUND NUMBER SOMEONE LIKED — it is computed from
  // the ladder itself, in referralBonusStardust():
  //
  //     bonus = levels[2].threshold - levels[1].threshold
  //           = Beam(250) - Glow(100)
  //           = 150 Stardust
  //
  // That is the full width of the Glow band, so a fan standing ANYWHERE in
  // Glow — at its floor or just under its top — crosses into Beam. A fan at
  // Glow's floor (100) lands exactly on Beam's floor (250); a fan near its
  // top lands comfortably inside. The figure moves on its own if the ladder
  // is ever retuned, because nothing here hard-codes 150.
  //
  // It is Stardust, not money: the whole grant runs through grantStardust(), lands in
  // the ledger as "Referral bonus", and no cash appears anywhere in referral
  // copy in either language.
  referral: {
    reward: 15,
    friendReward: 15,
    // Placeholder terms (PRD §12): how many friends, and the window in days.
    bonusFriends: 2,
    bonusWindowDays: 60,
    blurb: {
      en: "Share your link. When a friend joins the Orbiters, you both get Stardust.",
      th: "แชร์ลิงก์ของคุณ พอเพื่อนสมัครเข้ามาเป็น Orbiters ด้วยกัน ทั้งคุณและเพื่อนจะได้ Stardust ไปด้วยกัน",
    },
  },

  demo: {
    startingStardust: 35,
    startingLifetime: 260,
  },
};
