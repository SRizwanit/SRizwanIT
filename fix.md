# fix.md - SRizwanIT Video Fix Plan

নিয়ম: আগে এই ফাইল, তারপর তুমি "করো" বললে ধাপে ধাপে কাজ হবে। প্রতিটি ধাপ আলাদা মেসেজে হবে (টোকেন বাঁচাতে)। যেটা শেষ হবে সেটায় [x] পড়বে।
সব বিদ্যমান details অপরিবর্তিত থাকবে (CONTACT, SCENE timing, SAFE area, 3 format: 16:9, 9:16, 4:5)। শুধু vector icon, কোনো emoji নয়।

---

## ধাপ 0 - প্রস্তুতি (কোড পরিবর্তন নেই)
- [ ] 0.1 SRizwanIT-main-fix.zip খুলে ফাইল তালিকা দেখা
- [ ] 0.2 যে ফাইলগুলোতে কাজ হবে তার নাম চূড়ান্ত করা (theme.ts, Components.tsx, scene ফাইল, SfxTrack, Root/Thumbnail ফাইল)
- [ ] 0.3 theme.ts-এর বর্তমান C রঙ ও SCENE timing নোট করা (ব্যাকআপ হিসেবে অপরিবর্তিত কপি)

## ধাপ 1 - কালার পরিবর্তন (theme.ts) - সম্পন্ন
পরিবর্তিত ফাইল: theme.ts (4টি রঙ), Components.tsx (2টি navy shadow -> plum)। Scenes/Cover ফাইল C টোকেন ব্যবহার করে, তাই নিজে থেকেই নতুন রঙ নেবে।
- [x] 1.1 "Introducing" শব্দের বর্তমান কালার (teal900 #2A1B8F, indigoLight #6D5BFF) বদলানো
- [x] 1.2 নতুন প্যালেট ঠিক করা: raspberry #8E0E3A -> coral #FF6A5C (Introducing), plum #2A0A1E / #6B2147 (বাকি সব), সাথে সাদা ও গোল্ড অপরিবর্তিত
- [x] 1.3 slate / slateSoft (অন্য সব গাঢ় টেক্সট ও আইকন) নতুন প্যালেটের সাথে মানানসই করা
- [x] 1.4 একই রকম রঙের অন্য সব জায়গা খুঁজে বের করা (grep) ও একসাথে বদলানো
- [x] 1.5 FILL_BG ব্যাকগ্রাউন্ড: teal ই রাখা হয়েছে (নতুন plum/raspberry এর সাথে কন্ট্রাস্ট ভালো), কোড অপরিবর্তিত
- [x] 1.6 কন্ট্রাস্ট চেক: plum টেক্সট teal-এর উপর 5.8:1, raspberry বড় হুক টেক্সটে 3.0:1 (বড় লেখার জন্য ঠিক)

## ধাপ 2 - প্রতিটি টেক্সটে Animation (Components.tsx) - সম্পন্ন
পরিবর্তিত ফাইল: Components.tsx (exitAt প্রপ + contact আইকনে পালস), Scenes.tsx, ScenesVertical.tsx, ScenesFeed.tsx।
নোট: তোমার Components.tsx-এ BlurText আগে থেকেই 7টি মোড (blur/chars/mask/flip/zoom/drop + shine/float) সহ ছিল, তাই AnimatedText আলাদা না বানিয়ে সেটাই ব্যবহার হয়েছে।
ব্যবহৃত মোড: Introducing = chars+shine, মূল হেডলাইন = flip+shine, Hello/Chowdhury/Please = mask, Rizwan = chars+gradient, শিরোনাম (Apps/Websites/Skills) = chars+shine, বাংলা টেক্সট = blur (chars নয়, যুক্তাক্ষর ভাঙবে বলে)।
- [x] 2.1 একটি পুনঃব্যবহারযোগ্য AnimatedText কম্পোনেন্ট বানানো (spring, stagger, blur-in, mask reveal)
- [x] 2.2 Scene 1 Hook: "Introducing" অক্ষর-ধরে স্প্রিং পপ + গ্রেডিয়েন্ট শাইন সুইপ
- [x] 2.3 Scene 1: "introvert - App & Website Developer" শব্দ-ধরে স্লাইড-আপ + মাস্ক রিভিল
- [x] 2.4 Scene 2 Intro: "Hello I'm Rizwan" টাইপিং/স্কেল-ইন, রোল ও CTA টেক্সটে স্ট্যাগার
- [x] 2.5 Scene 3-4 Apps / Websites: শিরোনাম ও কার্ড লেবেলে স্ট্যাগার এন্ট্রি (APP_FIRST, APP_STAGGER ঠিক রেখে)
- [x] 2.6 Scene 5 Skills: স্কিল নাম পপ-ইন (SKILL_FIRST, SKILL_STAGGER ঠিক রেখে)
- [x] 2.7 Scene 6 Outro: "Don't DM Now." ও contact row (mail) এ ফেড+স্লাইড এবং হালকা পালস
- [x] 2.8 প্রতিটি টেক্সটের exit animation (ঢোকার মতো মসৃণ বের হওয়া)

## ধাপ 3 - মাথার উপরে ঘুরন্ত স্কিল (Orbit) - সম্পন্ন
পরিবর্তিত ফাইল: Scenes.tsx (16:9), ScenesVertical.tsx (9:16), ScenesFeed.tsx (4:5)। Components.tsx অপরিবর্তিত (SkillOrbit আগে থেকেই ছিল)।
- ছবির wrapper-এ zIndex 10, orbit-এর পিছনের অর্ধেক পিছনে (z 1), সামনের অর্ধেক সামনে (z 20) থেকে ঘোরে।
- 5টি স্কিল (React Native, Flutter, Kotlin, Java, React) vector আইকনসহ, frame 34 থেকে ফেড-ইন, ফোকাস জুমের সাথে orbit ছবির সাথে উপরে সরে ও বড় হয়।
- "Android & iOS Apps" ব্যাজ orbit-এর পথ থেকে সরানো হয়েছে; সব ব্যাজে zIndex 30 যাতে ছবির উপরে থাকে।
- [x] 3.1 ছবির (মাথার) অবস্থান ও আকার নির্ধারণ (16:9, 9:16, 4:5 প্রতিটির জন্য)
- [x] 3.2 OrbitSkills কম্পোনেন্ট: উপবৃত্তাকার পথে ঘোরা (frame-ভিত্তিক কোণ)
- [x] 3.3 স্কিল আইটেম: React Native, Flutter, Kotlin, Java, React (vector icon + নাম)
- [x] 3.4 গভীরতার প্রভাব: পিছনে গেলে ছোট ও ঝাপসা, সামনে এলে বড় ও উজ্জ্বল
- [x] 3.5 ছবির পিছনে/সামনে z-index ঠিক করা যাতে মাথার উপর দিয়ে ঘুরছে মনে হয়
- [x] 3.6 এন্ট্রি animation (একে একে উড়ে এসে কক্ষপথে বসা) ও ধীর-দ্রুত স্পিড কার্ভ
- [x] 3.7 তিন ফরম্যাটে SAFE area মেনে অবস্থান সমন্বয়

## ধাপ 4 - প্রফেশনাল মানের অতিরিক্ত Animation - সম্পন্ন
পরিবর্তিত ফাইল: Components.tsx (Camera, Particles, GridBG glow, 3D card, phone float, SkillOrbit fly-in+speed curve), Transitions.tsx (নতুন), Video*.tsx, Scenes*.tsx, SfxTrack.tsx। ScenesFeed/Vertical-এর mode=\"blur\" সিনট্যাক্স বাগ ঠিক করা হয়েছে।
- [x] 4.1 Scene transition: slide/wipe/zoom-blur (TRANSITION = 12 ফ্রেম অপরিবর্তিত)
- [x] 4.2 ব্যাকগ্রাউন্ডে ভাসমান পার্টিকল ও নরম গ্লো
- [x] 4.3 ধীর ক্যামেরা পুশ-ইন / প্যারালাক্স
- [x] 4.4 কার্ডে 3D টিল্ট, শ্যাডো ও শাইন হাইলাইট
- [x] 4.5 ফোন মকআপে হালকা ফ্লোটিং মোশন
- [x] 4.6 Easing একরকম রাখা (spring/bezier, লিনিয়ার নয়)
- [x] 4.7 SfxTrack এর "pop" সাউন্ড নতুন animation টাইমিং-এর সাথে মেলানো

## ধাপ 5 - Thumbnail (প্রফেশনাল মান)
- [ ] 5.1 Thumbnail কম্পোজিশন বানানো (1920x1080, ছবি + বড় টাইটেল + গ্রেডিয়েন্ট)
- [ ] 5.2 মাথার উপরে স্কিল-ঘোরা লুক স্ট্যাটিক ফ্রেমে (orbit আইকন বসানো)
- [ ] 5.3 নতুন কালার প্যালেট ও পড়ার যোগ্য বড় ফন্ট
- [ ] 5.4 Facebook/Instagram এর জন্য 4:5 ও 9:16 কভার ভ্যারিয়েন্ট (ঐচ্ছিক)
- [ ] 5.5 renderStill কমান্ড যোগ করা

## ধাপ 6 - Keep all details যাচাই
- [ ] 6.1 CONTACT (rizwanit0102@gmail.com) সব ফরম্যাটে আছে কিনা
- [ ] 6.2 DURATION / SCENE timing ঠিক আছে কিনা (1038 ফ্রেম, বদলালে সূত্র মিলিয়ে)
- [ ] 6.3 SAFE area ও 3 ফরম্যাট (16:9, 9:16, 4:5) অক্ষত
- [ ] 6.4 কোনো পুরোনো ফিচার/ফাইল মুছে যায়নি

## ধাপ 7 - পরীক্ষা ও ডেলিভারি
- [ ] 7.1 টাইপ/বিল্ড এরর চেক
- [ ] 7.2 প্রতিটি scene-এর একটি করে still render করে দেখা
- [ ] 7.3 পরিবর্তিত ফাইলগুলো একত্র করে (zip বা আলাদা ফাইল) দেওয়া
- [ ] 7.4 ছোট change-log (কী কী বদলেছে)

---

প্রস্তাবিত ক্রম: 0 -> 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7
পরের মেসেজে "ধাপ 1 করো" বা "ধাপ 0 করো" লিখলেই সেই ধাপ শুরু হবে।
