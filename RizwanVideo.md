# RizwanVideo.md — মাস্টার প্ল্যান (Remotion + GitHub Actions)

> **কীভাবে ব্যবহার করবেন:** টোকেন শেষ হলে নতুন চ্যাটে এই ফাইলটি দিন আর লিখুন:
> *"RizwanVideo.md পড়ো। প্রথম যে ধাপ `[ ]` আছে সেটা করো, শেষে `[x]` দিয়ে ফাইল আপডেট করে দাও।"*
> প্রতিটি ধাপ স্বয়ংসম্পূর্ণ — আগের চ্যাট মনে রাখার দরকার নেই।

---

## ০. প্রজেক্ট সারাংশ (Source of Truth)

| বিষয় | মান |
|---|---|
| মালিক | **Rizwan Chowdhury** — App & Website Developer |
| থিম/হুক | **"Looking for introvert App & Developer"** → শেষে **"Please don't DM Now."** |
| দৈর্ঘ্য | **30 সেকেন্ড** = 900 ফ্রেম @ 30 fps |
| অনুপাত | **16:9** (মূল) এবং **9:16** (ভার্টিক্যাল/রিলস, শুধু HD) |
| আউটপুট | **16:9:** HD 1920×1080 এবং 4K 3840×2160 (দুটোই) • **9:16:** শুধু **HD 1080×1920** (4K নেই) |
| মূল রঙ | **Teal** (নিচে প্যালেট) |
| বাংলা ফন্ট | **Anek Bangla** (Google Fonts CDN, `@remotion/google-fonts/AnekBangla`) |
| ইংরেজি ফন্ট | প্রতিটি টেক্সটে **আলাদা ইউনিক ফন্ট** (নিচে তালিকা) |
| মিউজিক | `background.mp3` (আপনি রিপোতে আপলোড করবেন) |
| টুল | React + Remotion + GitHub Actions (শুধু মোবাইল ব্রাউজার দিয়ে চলবে) |
| ফোল্ডার নিয়ম | **কোনো সাব-ফোল্ডার নেই — সবকিছু রিপোর রুটে** |

> ⚠️ **একমাত্র ব্যতিক্রম:** GitHub Actions কাজ করার জন্য ফাইলটি অবশ্যই `.github/workflows/render.yml` পথে থাকতে হবে — এটা GitHub-এর বাধ্যবাধকতা, এড়ানো যায় না। বাকি সব রুটে।

### Reference ভিডিও বিশ্লেষণ (18.6s, 6 দৃশ্য)
| # | Reference-এ কী আছে | আপনার ভিডিওতে রূপান্তর |
|---|---|---|
| 1 | হলুদ BG, "Looking for / **Content Creator**" blur→sharp | Teal BG, "Looking for / **Introvert App & Developer**" |
| 2 | গোল ছবি + "Hello, I'm **Akash**" + ছোট পিল ব্যাজ | কার্টুন পোর্ট্রেট গোল ফ্রেমে + "Hello, I'm **Rizwan**" |
| 3 | ছবি বড় হয়, ফ্লোটিং ব্যাজ ("AI Powered"), রোল লাইন, কালো CTA বাটন | "App & Website Developer", ফ্লোটিং ব্যাজ, "See My Work →" |
| 4 | "Video Projects / Reel Edits" — ফোন-কার্ড মকআপ স্লাইড | **Apps** — ৭টি অ্যাপ কার্ড |
| 5 | (একই ধরন) | **Websites** — ৩টি ফোন মকআপ |
| 6 | হলুদ BG "Let's…" ট্রানজিশন → সাদা "DM NOW" + নাম + রোল | Teal ট্রানজিশন → **"Please don't DM Now."** + নাম + রোল |

---

## ১. ডিজাইন সিস্টেম

### রঙ (Teal)
```
--teal-900: #04302E   (গাঢ় টেক্সট)
--teal-700: #0B6E6A
--teal-500: #0FA3A0   (প্রধান ব্র্যান্ড)
--teal-300: #5EEAD4   (হাইলাইট/ব্যাজ)
--teal-100: #D7F5F1   (হালকা BG)
--ink:      #0A1F1E   (CTA বাটন)
--paper:    #F4FFFD   (সাদাটে BG)
```
দৃশ্য ১ ও ৬: পূর্ণ Teal-500 গ্রেডিয়েন্ট BG (Reference-এর হলুদ দৃশ্যের মতো)। দৃশ্য ২–৫: `--paper` BG + হালকা গ্রিড।

### ফন্ট বরাদ্দ (প্রতিটি ইংরেজি টেক্সট = আলাদা ফন্ট)
| টেক্সট | ফন্ট (`@remotion/google-fonts/...`) |
|---|---|
| "Looking for" | `SpaceGrotesk` |
| "Introvert App & Developer" | `Unbounded` |
| "Hello, I'm" | `Syne` |
| "Rizwan" (নাম হাইলাইট) | `Fraunces` (italic) |
| রোল লাইন "App & Website Developer" | `BricolageGrotesque` |
| ব্যাজ টেক্সট | `JetBrainsMono` |
| "See My Work" | `Outfit` |
| সেকশন টাইটেল "Apps" | `PlayfairDisplay` |
| সেকশন টাইটেল "Websites" | `Sora` |
| "Don't DM Now." | `Bebas Neue` / `Anton` |
| "Rizwan Chowdhury" | `Cormorant Garamond` |
| শেষ ট্যাগলাইন | `Manrope` |
| **সব বাংলা টেক্সট** | **`AnekBangla`** |

> ফন্ট লোড: Remotion-এর `loadFont()` সরাসরি Google Fonts CDN থেকে আনে। রেন্ডারের সময় রানারের ইন্টারনেট লাগে — GitHub Actions-এ আছে।

---

## ২. টাইমলাইন (30s / 900 ফ্রেম @30fps)

| দৃশ্য | সময় | ফ্রেম | বিষয়বস্তু |
|---|---|---|---|
| S1 Hook | 0.0–3.5s | 0–105 | Teal BG • "Looking for" → "Introvert App & Developer" (শব্দ ধরে blur-in) |
| S2+S3 Intro (এক টানা দৃশ্য) | 3.6–12.2s | 108–366 | Reference-এর মতো **একই ফ্রেমে**: ছবি স্লাইড-ইন • "Hello, I'm **Rizwan**" + পিল "Introvert by choice" → নাম দেখানোর পর **ছবিতে ফোকাস (জুম)** → ছবির চারপাশে পপ-আপ ব্যাজ ভেসে ওঠে (Android Apps, Websites, IslamiPedia AI) → নিচে "App & Website Developer" + "See My Work →" |
| ~~S3 Role~~ | — | — | **S2-র সঙ্গে মিশিয়ে ফেলা হয়েছে** (আলাদা দৃশ্য ও আলাদা ট্রানজিশন নেই) |
| S4 Apps | 11.5–19.0s | 345–570 | "Apps" টাইটেল • ৭ অ্যাপ কার্ড দুই সারিতে স্লাইড/স্ট্যাগার |
| S5 Websites | 19.0–24.5s | 570–735 | "Websites" টাইটেল • ৩টি ফোন মকআপ (ছবি স্ক্রল করে) |
| S6 Outro | 25.7–30.0s | 770–900 | Teal wipe • **"Please" (ছোট) + "Don't DM Now." (বড় স্ট্যাম্প)** • "(I'll reply when I'm ready 🙂)" • নাম • রোল লাইন • সিগনেচার আন্ডারলাইন |

ট্রানজিশন: প্রতি দৃশ্যের মাঝে ১০–১২ ফ্রেম ক্রসফেড/স্লাইড (`@remotion/transitions`)।
অডিও: ০–১s fade-in, শেষ ১.৫s fade-out; ভলিউম ০.৮।

---

## ৩. রিপো ফাইল লেআউট (সব রুটে, ফ্ল্যাট)

```
package.json            tsconfig.json         remotion.config.ts
index.ts                Root.tsx              Video.tsx
theme.ts                fonts.ts              Scenes.tsx   (S1–S6 একসাথে বা আলাদা ফাইল)
ScenesVertical.tsx      VideoVertical.tsx     (৯:১৬ ভার্সনের দৃশ্য ও ভিডিও — Components/Audio/SFX/ফন্ট একই)
Components.tsx          (BlurText, Badge, PhoneMock, AppCard, CTA, GridBG)
mypicture.jpg           background.mp3   sfx-whoosh.wav sfx-pop.wav sfx-thud.wav sfx-ding.wav   SfxTrack.tsx
app-islami-bishwakosh-s2.jpg   app-islami-bishwakosh.jpg   app-shohidullah.jpg
app-osman-goni.jpg      app-tablig.jpg   app-usila.jpg   app-rizwantask.png
web-islami-bishwakosh-s2.jpg   web-islamipedia-ai.jpg   web-rizwantask.jpg
.github/workflows/render.yml     ← একমাত্র ব্যতিক্রম
RizwanVideo.md          README.md
```
**ফাইল রিনেম (স্পেস/অ্যাসিআই সমস্যা এড়াতে):**
| আপনার ফাইল | রিপোতে নাম |
|---|---|
| islamiencyclopedias2.jpg | app-islami-bishwakosh-s2.jpg |
| islamiencyclopedia.jpg | app-islami-bishwakosh.jpg |
| sohidullahbahadur.jpg | app-shohidullah.jpg |
| osmanGoni.jpg | app-osman-goni.jpg |
| islamiTablig.jpg | app-tablig.jpg |
| usilaOistigasa.jpg | app-usila.jpg |
| rizwantask.png | app-rizwantask.png |
| islamiencyclopediaS2 website.jpg | web-islami-bishwakosh-s2.jpg |
| islamipediaAI.jpg | web-islamipedia-ai.jpg |
| RizwanTask.jpg | web-rizwantask.jpg |

> **সাব-ফোল্ডার ছাড়া অ্যাসেট (সংশোধিত):** রুটকে public dir করলে Remotion পুরো `node_modules` কপি করত — তাই `setPublicDir` বাদ। বদলে সরাসরি import: `import me from './mypicture.jpg'`, `import bgm from './background.mp3'` (টাইপ ঘোষণা `assets.d.ts`-এ)। `staticFile()` ব্যবহার হবে না।

---

## ৪. ধাপসমূহ (চেকলিস্ট)

> চিহ্ন: `[ ]` বাকি • `[~]` চলছে • `[x]` শেষ

### ধাপ A — প্রস্তুতি (আপনার দিক)
- [ ] **A1.** নতুন GitHub রিপো খুলুন (যেমন `rizwan-intro-video`), Public রাখুন (ফ্রি রানার মিনিট বেশি)।
- [ ] **A2.** রুটে আপলোড করুন: `mypicture.jpg`, `background.mp3`, এবং উপরের রিনেম করা ১০টি ছবি।
- [ ] **A3.** `RizwanVideo.md` রিপোতে রাখুন।
- [ ] **A4.** Settings → Actions → General → *Workflow permissions* = **Read and write** (আর্টিফ্যাক্ট/রিলিজ আপলোডের জন্য)।

### ধাপ B — প্রজেক্ট স্ক্যাফোল্ড
- [x] **B1.** `package.json` (remotion, @remotion/cli, @remotion/google-fonts, @remotion/transitions, @remotion/media-utils, react, react-dom, typescript সঠিক সংস্করণ লক করা)।
- [x] **B2.** `tsconfig.json`, `remotion.config.ts` (JPEG ফ্রেম, h264), `assets.d.ts`, `.gitignore`। **public dir ব্যবহার হচ্ছে না** (নিচের নোট দেখুন)।
- [x] **B3.** `index.ts` (`registerRoot`) + `Root.tsx` — **একটিই Composition `Intro` (1920×1080)।** HD = scale 1, 4K = `--scale=2` — লেআউট একবারই লিখতে হয়।
- [x] **B4.** `theme.ts` (রঙ, spacing, easing) ও `fonts.ts` (সব ফন্ট লোড + এক্সপোর্ট)।

### ধাপ C — শেয়ার্ড কম্পোনেন্ট (`Components.tsx`)
- [x] **C1.** `GridBG` — হালকা Teal গ্রিড/ডট BG + নিচে সফট গ্রেডিয়েন্ট।
- [x] **C2.** `BlurText` — শব্দ ধরে blur→sharp + translateY (Reference দৃশ্য ১-এর মতো)।
- [x] **C3.** `Badge` — গ্লাস/Teal ব্যাজ ("+ আইকন + টেক্সট"), ফ্লোটিং ববিং অ্যানিমেশন।
- [x] **C4.** `PhoneMock` — গোল কোণ + ছায়া + ভেতরে ছবি স্ক্রল (ওয়েবসাইট স্ক্রিনশট 720×1370 লম্বা, তাই স্ক্রল ইফেক্ট দারুণ মানাবে)।
- [x] **C5.** `AppCard` — বর্গাকার আইকন কার্ড + নাম ক্যাপশন (বাংলা = Anek Bangla)।
- [x] **C6.** `CTA` — কালো পিল বাটন + তীর, প্রেস/পালস অ্যানিমেশন।
- [x] **C7.** `AudioTrack.tsx` (আলাদা ফাইল, যাতে mp3 আপলোডের আগে বাকি কোড না ভাঙে) — `<Audio src={bgm}>` (`import bgm from './background.mp3'`) + `interpolate` ফেড ইন/আউট।

### ধাপ D — দৃশ্য নির্মাণ (প্রতিটি আলাদা ধাপ; ছোট ছোট কমিটে)
- [x] **D1. S1 Hook** — Teal গ্রেডিয়েন্ট; "Looking for" (SpaceGrotesk) ছোট, নিচে "Introvert App & Developer" (Unbounded) BlurText।
- [x] **D2. S2 Intro** — (এখন D3-র সঙ্গে এক দৃশ্য) আগের বিবরণ: গোল ফ্রেমে `mypicture.jpg` (Teal-300 বৃত্তের ওপর), বাম থেকে স্লাইড; "Hello, I'm" + *Rizwan* ডানে; পিল "Introvert by choice"। **বাস্তবায়ন:** গোলকোণ কার্ড।
- [x] **D3. S3 Role** — (এখন S2-র ভেতরেই) নাম দেখানোর পর ছবি জুম-ইন (ফোকাস) + গ্লো; ব্যাজ "+ Android Apps", "+ Websites", "+ IslamiPedia AI" ছবির চারপাশে ভেসে ওঠে; নামের নিচে রোল লাইন "App & Website Developer" + বাংলা লাইন; CTA "See My Work →"। কোড: `SceneIntro` (`Scenes.tsx`), `FOCUS = 105` ফ্রেমে ফোকাস শুরু।
- [x] **D4. S4 Apps** — "Apps" টাইটেল (Playfair) + আন্ডারলাইন; ৭ কার্ড (৪+৩) স্ট্যাগার-ইন, হালকা ববিং।
- [x] **D5. S5 Websites** — "Websites" টাইটেল (Sora); ৩ ফোন মকআপ, মাঝেরটি বড়; ভেতরে ধীর স্ক্রল; নিচে সাইটের নাম।
- [x] **D6. S6 Outro** — Teal wipe; **"Please" (Bebas, ছোট, উপরে) + "Don't DM Now." (Bebas, বড় স্ট্যাম্প)** = পুরো লেখা "Please don't DM Now."; তার নিচে ছোট "(I'll reply when I'm ready" + `<Smile/>` + ")" (ফন্ট: `tagline`); নিচে "Rizwan Chowdhury" (Cormorant) + "App & Website Developer" (Manrope); ছোট আন্ডারলাইন স্ট্রোক।
- [x] **D7.** `Video.tsx` — `TransitionSeries` দিয়ে **৫ দৃশ্য** জোড়া (S2+S3 মিলিয়ে; হিসাব: ১২০+২৫৮+২৫৫+১৮৫+১৩০ − ৪×১২ = **৯০০ ফ্রেম**); `theme.ts` ভুল হলে নিজেই error দেয়।

### ধাপ E — লোকাল-ছাড়া ভিজ্যুয়াল চেক (মোবাইল-ফ্রেন্ডলি)
- [x] **E1.** Actions-এ `still` জব: গুরুত্বপূর্ণ ফ্রেম (0, 60, 150, 300, 450, 650, 800, 890) PNG রেন্ডার → আর্টিফ্যাক্ট। পুরো রেন্ডারের আগে এগুলো দেখে নিন (সময়/ক্রেডিট বাঁচে)।
- [ ] **E2.** সমস্যা থাকলে শুধু ওই দৃশ্য ঠিক করে আবার still দেখুন।

### ধাপ F — GitHub Actions ওয়ার্কফ্লো (`.github/workflows/render.yml`)
- [x] **F1.** ট্রিগার: `workflow_dispatch` (ইনপুট: `quality` = hd | 4k | both | stills)।
- [x] **F2.** স্টেপ: checkout → Node 20 → `npm install` (মোবাইলে `package-lock.json` বানানো যায় না, তাই `npm ci` নয়) → Chrome ডিপেন্ডেন্সি (`npx remotion browser ensure`) → রেন্ডার।
- [x] **F3.** ম্যাট্রিক্স জব: HD ও 4K আলাদা মেশিনে সমান্তরালে (4K ধীর, তাই আলাদা)।
- [x] **F4.** রেন্ডার কমান্ড:
  - HD: `npx remotion render index.ts Intro Rizwan-HD.mp4 --codec=h264 --crf=16`
  - 4K: `npx remotion render index.ts Intro Rizwan-4K.mp4 --codec=h264 --crf=17 --scale=2`
- [x] **F5.** `actions/upload-artifact` + ঐচ্ছিক GitHub **Release**-এ ফাইল সংযুক্ত (মোবাইল থেকে সরাসরি ডাউনলোড সহজ)।
- [x] **F6.** `timeout-minutes: 60`, `--concurrency` রানার কোর অনুযায়ী।

### ধাপ G — ফাইনাল রেন্ডার ও ডেলিভারি
- [ ] **G1.** Actions ট্যাবে *Run workflow* → `both`।
- [ ] **G2.** আর্টিফ্যাক্ট/Release থেকে `Rizwan-HD.mp4` ও `Rizwan-4K.mp4` ডাউনলোড।
- [ ] **G3.** চেক: দৈর্ঘ্য 30.0s, অডিও ফেড, বাংলা যুক্তাক্ষর (ক্ষ, ত্র, ঙ্গ ইত্যাদি) ঠিক, ছবি ঝাপসা নয়।
- [x] **G4.** (ঐচ্ছিক) ৯:১৬ রিলস ভার্সন আলাদা Composition হিসেবে। → **হয়ে গেছে, ধাপ H দেখুন।**

---

### ধাপ H — ৯:১৬ ভার্টিক্যাল ভার্সন (শুধু HD 1080×1920)
> একই গল্প, একই ৩০s/৯০০ ফ্রেম, **একই মিউজিক ও SFX** (`AudioTrack.tsx`, `SfxTrack.tsx` অপরিবর্তিত)। শুধু লেআউট ভিন্ন। 4K নেই।

- [x] **H1.** `theme.ts`-এ `V_WIDTH=1080`, `V_HEIGHT=1920`; `Root.tsx`-এ দ্বিতীয় Composition `IntroVertical` (প্রথমটি `Intro` অপরিবর্তিত)।
- [x] **H2. `ScenesVertical.tsx`** (৫ দৃশ্য, ১৬:৯-এর সঙ্গে হুবহু একই কনটেন্ট):
  - **Hook:** "Looking for" + "Introvert App & Developer" (৪টি শব্দ ৩ লাইনে ভাঙে, blur-in)।
  - **Intro (এক টানা):** ছবি **উপর থেকে** নামে (মাঝখানে, 620px) → "Hello, I'm Rizwan" নিচে মাঝবরাবর → ছবিতে ফোকাস (জুম + গ্লো) → ৩টি পপ-আপ (Android Apps, Websites, IslamiPedia AI) ভেসে ওঠে → "App & Website Developer" + বাংলা লাইন + "See My Work →"।
  - **Apps:** ৭ কার্ড **৩+৩+১** গ্রিডে (১৬:৯-এ ছিল ৪+৩), একই স্ট্যাগার সময়।
  - **Websites:** মাঝে বড় ফোন (IslamiPedia AI), দুই পাশে ছোট দুই ফোন (একটু ওভারল্যাপ, মাঝেরটি উপরে)।
  - **Outro:** "Please" (ছোট) → **"Don't DM" / "Now."** দুই লাইনের বড় স্ট্যাম্প (১০৮০ চওড়ায় এক লাইনে ধরে না) → "(I'll reply when I'm ready 🙂)" → নাম → রোল → আন্ডারলাইন।
- [x] **H3. `VideoVertical.tsx`** — ১৬:৯-এর মতোই `TransitionSeries` (১২০+২৫৮+২৫৫+১৮৫+১৩০ − ৪×১২ = ৯০০); ট্রানজিশন একই (fade, fade, slide-from-bottom, wipe)।
- [x] **H4. `render.yml`** — নতুন `mode`: `vertical-stills` (৮টি ফ্রেম PNG, নাম `still-IntroVertical-NNN.png`) ও `vertical` (আউটপুট **`Rizwan-Vertical-HD.mp4`**, 1080×1920, crf 16)। preflight এখন `ScenesVertical.tsx`/`VideoVertical.tsx`-ও যাচাই করে। `package.json`-এ `render:vertical` স্ক্রিপ্ট।
- [ ] **H5. (আপনি)** Actions → Run workflow → `vertical-stills` → ছবি দেখুন → ঠিক থাকলে `vertical`।
  - আগে চেক করুন ফ্রেম **320** (ব্যাজ/ছবি/লেখা ওভারল্যাপ?), **520** (৩+৩+১ গ্রিড), **720** (ফোন ও ক্যাপশন), **890** (Don't DM Now. পর্দায় ধরে কি না)।

---

## ৫. ঝুঁকি ও সমাধান

| ঝুঁকি | সমাধান |
|---|---|
| অ্যাপ আইকন/ছবি 720px, 4K-তে বড় দেখালে ঝাপসা | কার্ড ছোট রাখা (≈ 280–340px @1080 ডিজাইন); ব্যাকগ্রাউন্ডে বড় করে ব্লার-ফিল; কখনো ফুলস্ক্রিন নয় |
| `mypicture.jpg` ~715px | গোল ফ্রেম ≤ 520px (@1080) রাখলে 4K-তেও গ্রহণযোগ্য; কোণের "Rizwan" সিগনেচার ক্রপে কাটা পড়বে (বৃত্ত ক্রপ + `object-position`) |
| 4K রেন্ডারে মেমরি/সময় | `--scale=2` + কম কম্পোনেন্ট `box-shadow` ব্লার; `--concurrency=2`; দরকারে 4K আলাদা জব |
| ফন্ট না লোড (নেটওয়ার্ক) | `loadFont` + `delayRender` Remotion নিজেই সামলায়; ব্যর্থ হলে রি-রান |
| বাংলা টেক্সট Remotion-এ ভাঙা | Anek Bangla-তে `font-feature-settings` ডিফল্ট রাখা; `letter-spacing: 0` বাংলায় |
| ফাইলনামে স্পেস | ধাপ A-র রিনেম তালিকা মানা |
| ফ্রি Actions মিনিট | Public রিপো = আনলিমিটেড; stills দিয়ে আগে যাচাই |

---

## ৬. খোলা সিদ্ধান্ত (ডিফল্ট ধরে এগোব; বদলাতে চাইলে জানান)

1. **S2-এর ছোট পিল:** "Introvert by choice" ✔ ডিফল্ট — অন্য লেখা চাইলে বলুন।
2. **S3 ব্যাজ:** "Android Apps" ও "Websites" ✔ ডিফল্ট (আপনার সঠিক টেক-স্ট্যাক জানালে ব্যাজ নিখুঁত হবে — যেমন React Native/Flutter/React)।
3. **S6 ট্যাগলাইন:** ✔ **চূড়ান্ত:** "Please don't DM Now." (দুই লাইন: Please ছোট, Don't DM Now. বড়) + নিচে ছোট করে "(I'll reply when I'm ready 🙂)" — 🙂 টেক্সট ইমোজি নয়, `Smile` SVG কম্পোনেন্ট (রানারে ইমোজি ফন্ট নাও থাকতে পারে)।
4. **যোগাযোগ লিংক:** ভিডিওতে কোনো ইমেইল/লিংক দেখাব না (আপনার "Don't DM" থিম অনুযায়ী) — চাইলে দৃশ্য ৬-এ ওয়েবসাইট লিংক যোগ হবে।
5. **ইসলামী অ্যাপের বাংলা নাম:** কার্ডে ক্যাপশন হিসেবে ছবির লেখার মতোই ব্যবহার হবে।

---

## ৭. Resume প্রম্পট (কপি-পেস্ট)

```
আমি Rizwan Chowdhury। সঙ্গে RizwanVideo.md আছে। এটি সম্পূর্ণ পড়ো।
প্রথম যে ধাপ [ ] আছে সেটি সম্পন্ন করো (সব ফাইল রুটে, সাব-ফোল্ডার নয়,
শুধু .github/workflows ব্যতিক্রম)। শেষ হলে সেই ধাপ [x] করে আপডেট করা
RizwanVideo.md ফেরত দাও এবং পরের ধাপের এক লাইন সারাংশ দাও।
```

---

## ৮. অগ্রগতি লগ
| তারিখ | ধাপ | নোট |
|---|---|---|
| 2026-10-30 | প্ল্যান তৈরি | RizwanVideo.md প্রথম সংস্করণ |
| 2026-10-30 | কালার গ্রেড + ভেক্টর অ্যারো + কন্টিনিউইটি + পুরো নাম | **(১) ColorGrade:** `Components.tsx`-এ `ColorGrade` (teal soft-light টিন্ট + হালকা ভিনিয়েট) + `Video`/`VideoVertical`-এ `saturate(1.06) contrast(1.03)` — সব দৃশ্য একই গ্রেডে, দুই ভার্সনেই। **(২) অ্যারো:** CTA-র `→` ফন্ট-গ্লিফ বাদ, এখন SVG ভেক্টর (গোল প্রান্ত, ২.৮ স্ট্রোক) — HD/4K-তে সমান ধারালো। **(৩) ফ্রেম-ধারাবাহিকতা:** `GridBG` এখন দৃশ্যের শুরুর *অ্যাবসোলিউট ফ্রেম* (`theme.ts` `START`) ধরে চলে, তাই দৃশ্য বদলের সময় গ্রিড লাফায় না; Apps ও Websites-এর শিরোনাম একই জায়গা/সাইজে (১৬:৯ ও ৯:১৬ দুটোতেই)। **(৪) পুরো নাম:** ইন্ট্রোতে "Rizwan" (বড়) + নিচে "Chowdhury" (italic) = Rizwan Chowdhury; আউট্রোতে আগে থেকেই পুরো নাম আছে। ১৬:৯ ইন্ট্রোর লেখার ব্লক উপরে (top 150) ও ফন্ট একটু ছোট করা হয়েছে যাতে নিচে না কাটে। |
| 2026-10-30 | ধাপ H ✔ (৯:১৬ HD) | নতুন: `ScenesVertical.tsx`, `VideoVertical.tsx`। বদলেছে: `Root.tsx` (+`IntroVertical`), `theme.ts` (+`V_WIDTH/V_HEIGHT`), `package.json` (+`render:vertical`), `render.yml` (+`vertical-stills`, `vertical`, preflight)। বাকি সব অপরিবর্তিত। **লেআউট চোখে দেখা বাকি** (H5)। |
| 2026-10-30 | S2+S3 একত্র, "Please" | Reference-এর মতো নাম → ছবিতে ফোকাস → পপ-আপ একই দৃশ্যে (`Scenes.tsx` `SceneIntro`; `SceneRole` মুছে ফেলা)। `theme.ts` `SCENE` থেকে `role` বাদ, `intro: 258`, টাইমলাইন-চেক ডায়নামিক। `Video.tsx` থেকে একটি Sequence+Transition কমেছে। `SfxTrack.tsx` পুনর্বিন্যাস (ফোকাসে হালকা whoosh, ৩টি পপ-আপে pop, CTA-তে ding)। আউট্রো: "Please don't DM Now."। **অন্য সব আগের মতোই; মোট এখনো ৯০০ ফ্রেম।** |
| 2026-10-30 | SFX | মিউজিক ভলিউম 0.8→0.3 (`AudioTrack.tsx`-এর `MUSIC_VOLUME`)। নতুন `SfxTrack.tsx` + ৪টি WAV (`sfx-whoosh/pop/thud/ding.wav`, কোডে সিনথেসাইজ করা, কপিরাইট-মুক্ত) রুটে আপলোড করতে হবে। `Video.tsx`, `assets.d.ts`, `render.yml` (preflight) আপডেট। সাউন্ডের ফ্রেম বদলাতে `SfxTrack.tsx`-এর `hits` তালিকা। |
| 2026-10-30 | অডিও লুপ | `AudioTrack.tsx`-এ `loop` যোগ: mp3 ভিডিওর (৩০s) চেয়ে ছোট হলে নিজে থেকে রিপিট হয়, বড় হলে ৩০sএ কাটা পড়ে। `render.yml` বদলাতে হয়নি। |
| 2026-10-30 | F সংশোধন | `render.yml`-এ "Auto-fix Remotion versions" স্টেপ: package.json-এর সংস্করণ npm-এ থাকলে রাখে, না থাকলে সর্বশেষ **4.x** বসায় (5.x নয়)। `--legacy-peer-deps` যোগ, `--concurrency` সরানো (রানারের কোর অনুযায়ী অটো)। স্ক্রিপ্ট লোকালি পরীক্ষিত। **E2 ও G আপনার রানের অপেক্ষায়** — এই পরিবেশ থেকে আপনার GitHub-এ Actions চালানো যায় না। |
| 2026-10-30 | ধাপ E+F ✔ | `.github/workflows/render.yml` (jobs: preflight → stills / render(HD,4K সমান্তরাল) → release) + `README.md`। preflight জব রিপোতে ১০টি ছবি/mp3/কোড ফাইল আছে কি না আগে যাচাই করে। **চালানো বাকি** → E2 ও G। |
| 2026-10-30 | ধাপ D ✔ | `Scenes.tsx` (৬ দৃশ্য) + `Video.tsx` (TransitionSeries, ৯০০ ফ্রেম) + `Components.tsx` আপডেট (AppCard-এ fontFamily, চওড়া ক্যাপশন)। ছবি পোর্ট্রেট **গোল নয়, গোলকোণ কার্ড** — কারণ সিগনেচার "Rizwan" গোল ক্রপে বিশ্রীভাবে কাটা পড়ত; কার্টুনের নিজস্ব সাদা BG ও সিগনেচার অক্ষত থাকে। TS সিনট্যাক্স চেক পাস; রেন্ডার যাচাই বাকি (ধাপ E)। |
| 2026-10-30 | ধাপ C ✔ | `Components.tsx` (GridBG, BlurText, Badge, PhoneMock, AppCard, CTA, Squiggle, Smile) + `AudioTrack.tsx`। S6-এ reply লাইন চূড়ান্ত। যাচাই এখনো বাকি (npm ব্লক)। |
| 2026-10-30 | ধাপ B ✔ | স্ক্যাফোল্ড লেখা হয়েছে। **যাচাই বাকি:** এই পরিবেশে npm ব্লক ছিল, তাই `npm install`/Remotion চালিয়ে দেখা যায়নি। প্যাকেজ সংস্করণ `4.0.250` পিন করা; ফেইল করলে সংস্করণ বদলাতে হতে পারে (সব remotion প্যাকেজ একই সংস্করণ হওয়া চাই)। |
