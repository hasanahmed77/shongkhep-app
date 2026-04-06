import { NewsCard, Language } from "../types";

export const ENDPOINTS: Record<Language, string> = {
  en: "/news/en",
  bn: "/news/bn",
};

export const newsByLanguage: Record<Language, NewsCard[]> = {
  en: [
    {
      id: "en-1",
      category: "World",
      imageUrl:
        "https://images.unsplash.com/photo-1541872705-1f73c6400ec9?auto=format&fit=crop&w=1200&q=80",
      sourceName: "Global Dispatch",
      sourceUrl: "https://example.com/world-energy-transition",
      title: "Nations accelerate clean energy deals before winter demand rises - Static News",
      summary:
        "Several governments are locking in new solar, LNG, and grid-upgrade agreements as utilities prepare for a tighter winter supply cycle. Markets responded calmly, but analysts say price volatility could return if shipping routes tighten.",
      articleBody:
        "Energy ministers across Europe and Asia entered a new round of talks this week to secure supply stability before peak winter demand. Officials said the latest agreements balance short-term fuel needs with long-term renewable investment, with several packages combining solar procurement, transmission upgrades, and LNG reserves.\n\nAnalysts say the strategy reflects a broader policy shift: reduce exposure to external supply shocks without abandoning clean-energy targets. Utility executives welcomed the faster approvals but warned that shipping disruption or severe weather could still pressure spot prices.\n\nFor consumers, the immediate effect may be limited. Regulators in several markets are maintaining caps and subsidies while infrastructure projects move ahead.",
    },
    {
      id: "en-2",
      category: "Technology",
      imageUrl:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
      sourceName: "Circuit Weekly",
      sourceUrl: "https://example.com/ai-phone-rollout",
      title: "AI-first phones push offline translation and summarization to the edge - Static News",
      summary:
        "Manufacturers are shifting premium mobile features from cloud-only workflows to on-device models. The change improves latency, reduces recurring API spend, and gives publishers new ways to personalize multilingual news feeds.",
      articleBody:
        "Phone makers are racing to move translation, summarization, and search workflows from the cloud to the device itself. The goal is straightforward: faster responses, lower operating cost, and more privacy for users who do not want sensitive content leaving the handset.\n\nFor publishers, the shift opens up a strong product opportunity. News cards can now adapt their summaries, language, and reading level nearly instantly while preserving a premium scrolling experience.\n\nThe tradeoff remains model size and battery efficiency, but the latest chipsets are narrowing that gap quickly.",
    },
    {
      id: "en-3",
      category: "Politics",
      imageUrl:
        "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1200&q=80",
      sourceName: "Capitol Brief",
      sourceUrl: "https://example.com/policy-debate",
      title: "Budget talks intensify as coalition leaders trade tax and welfare demands - Static News",
      summary:
        "Coalition partners are negotiating late into the week over how to balance social spending promises with pressure to hold down the fiscal deficit. Both sides say a deal is possible, but neither wants to look soft before regional votes.",
      articleBody:
        "Negotiators resumed closed-door budget meetings after a tense public exchange over tax reform and welfare funding. Senior officials said progress had been made on infrastructure allocations, but disagreements remain over subsidy design and deficit targets.\n\nPolitical advisers close to the talks said each bloc wants to preserve room for campaign messaging ahead of local elections. That has made compromise slower, even as party leaders privately acknowledge the need for a joint package.\n\nIf talks extend further, markets may begin pricing in delays to planned reforms.",
    },
    {
      id: "en-4",
      category: "Business",
      imageUrl:
        "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
      sourceName: "Market Ledger",
      sourceUrl: "https://example.com/retail-earnings",
      title: "Retail earnings stay resilient as premium buyers keep spending - Static News",
      summary:
        "Large retailers beat expectations after stronger sales in travel, beauty, and high-margin private labels. Executives warned that value-seeking households remain cautious, keeping discounting pressure in entry-level categories.",
      articleBody:
        "Quarterly results from major retailers pointed to a split consumer environment. Higher-income households continued to spend on discretionary categories including travel accessories, beauty, and premium own-brand products, helping margins outperform guidance.\n\nExecutives noted that entry-level shoppers remain selective and highly promotion-driven. That dynamic is forcing chains to protect premium inventory while competing aggressively on basic goods.\n\nThe result is a healthier headline picture than many analysts expected, but not a fully broad-based recovery.",
    },
    {
      id: "en-5",
      category: "Sports",
      imageUrl:
        "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80",
      sourceName: "Match Bulletin",
      sourceUrl: "https://example.com/final-preview",
      title: "Final showdown set after late comeback stuns title favorite - Static News",
      summary:
        "A dramatic second-half turnaround flipped the semifinal and sent the underdog into the championship match. Coaches credited disciplined defending and sharper transitions after halftime.",
      articleBody:
        "The semifinal turned on a sequence of tactical adjustments after the break. The eventual winner narrowed defensive spacing, pressed higher in transition, and took control of midfield territory that had been lost in the opening period.\n\nSupporters had nearly given up after an early setback, but the equalizer shifted momentum. From there, the favorite struggled to recover composure.\n\nCoaches after the match said belief and discipline were the difference, especially in the final twenty minutes.",
    },
  ],
  bn: [
    {
      id: "bn-1",
      category: "World",
      imageUrl:
        "https://images.unsplash.com/photo-1541872705-1f73c6400ec9?auto=format&fit=crop&w=1200&q=80",
      sourceName: "গ্লোবাল ডিসপ্যাচ",
      sourceUrl: "https://example.com/world-energy-transition-bn",
      title: "শীতের আগে জ্বালানি চুক্তি দ্রুত বাড়াচ্ছে বিভিন্ন দেশ - Static News",
      summary:
        "সম্ভাব্য চাহিদা বৃদ্ধির আগে একাধিক দেশ সৌরবিদ্যুৎ, এলএনজি এবং গ্রিড উন্নয়নের নতুন চুক্তি করছে। বাজার আপাতত স্থিতিশীল থাকলেও সরবরাহপথে চাপ তৈরি হলে দামে আবার অস্থিরতা দেখা দিতে পারে বলে বিশ্লেষকদের ধারণা।",
      articleBody:
        "শীতকালীন চাহিদা বাড়ার আগে জ্বালানি সরবরাহ নিশ্চিত করতে ইউরোপ ও এশিয়ার একাধিক দেশ নতুন চুক্তি আলোচনায় বসেছে। অনেক ক্ষেত্রেই স্বল্পমেয়াদি জ্বালানি নিরাপত্তা ও দীর্ঘমেয়াদি নবায়নযোগ্য বিনিয়োগকে একই কাঠামোয় রাখা হচ্ছে.\n\nবিশ্লেষকদের মতে, এ কৌশলের উদ্দেশ্য হলো বৈশ্বিক সরবরাহ ঝুঁকি কমিয়ে পরিচ্ছন্ন জ্বালানির লক্ষ্য অক্ষুণ্ণ রাখা। তবে আবহাওয়া বা শিপিং ব্যাহত হলে দামে আবার চাপ তৈরি হতে পারে.\n\nসাধারণ ভোক্তার ওপর তাৎক্ষণিক প্রভাব সীমিত থাকতে পারে, কারণ কয়েকটি বাজারে এখনও ভর্তুকি ও মূল্যনিয়ন্ত্রণ চালু আছে.",
    },
    {
      id: "bn-2",
      category: "Technology",
      imageUrl:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
      sourceName: "সার্কিট উইকলি",
      sourceUrl: "https://example.com/ai-phone-rollout-bn",
      title: "অফলাইন অনুবাদ ও সারাংশে এগিয়ে যাচ্ছে এআই-ভিত্তিক স্মার্টফোন - Static News",
      summary:
        "প্রিমিয়াম ডিভাইস নির্মাতারা ক্লাউডনির্ভর ফিচারের বদলে অন-ডিভাইস মডেলের দিকে ঝুঁকছে। এতে গতি বাড়ছে, ব্যয় কমছে এবং বহু ভাষার নিউজ ফিডে ব্যক্তিগতকরণ সহজ হচ্ছে।",
      articleBody:
        "নতুন প্রজন্মের স্মার্টফোনে অনুবাদ, সারাংশ তৈরি এবং অনুসন্ধানের মতো ফিচার ধীরে ধীরে ক্লাউডের বাইরে ডিভাইসের ভেতরেই চালানো হচ্ছে। এতে প্রতিক্রিয়া দ্রুত হয়, পরিচালন ব্যয় কমে এবং ব্যক্তিগত তথ্য সুরক্ষিত রাখা সহজ হয়.\n\nসংবাদমাধ্যমের জন্য এটি বড় সুযোগ। একটি নিউজ অ্যাপ একই কনটেন্টকে দ্রুত বিভিন্ন ভাষা ও পাঠকের ধরনে মানিয়ে দিতে পারে, তাও প্রিমিয়াম অভিজ্ঞতা বজায় রেখে.\n\nচ্যালেঞ্জ এখনও আছে, বিশেষ করে ব্যাটারি ও মডেলের আকার নিয়ে। তবে নতুন চিপসেট দ্রুত এই সীমাবদ্ধতা কমিয়ে আনছে.",
    },
    {
      id: "bn-3",
      category: "Politics",
      imageUrl:
        "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1200&q=80",
      sourceName: "ক্যাপিটল ব্রিফ",
      sourceUrl: "https://example.com/policy-debate-bn",
      title: "কর ও সামাজিক ব্যয় নিয়ে জোটের বাজেট আলোচনা আরও জোরালো - Static News",
      summary:
        "সরকারি ব্যয়, করনীতি এবং ঘাটতি নিয়ন্ত্রণ নিয়ে জোটের ভেতরে টানাপোড়েন বাড়ছে। দুই পক্ষই সমঝোতার ইঙ্গিত দিলেও আঞ্চলিক ভোটের আগে কেউই রাজনৈতিকভাবে দুর্বল দেখাতে চায় না।",
      articleBody:
        "বাজেট নিয়ে টানা আলোচনার পরও কর সংস্কার ও সামাজিক সুরক্ষা ব্যয়ের কাঠামোতে ঐকমত্য হয়নি। সংশ্লিষ্ট কর্মকর্তারা বলছেন, অবকাঠামো খাতে কিছু অগ্রগতি হলেও ভর্তুকি ও ঘাটতির সীমা নিয়ে মতপার্থক্য রয়ে গেছে.\n\nস্থানীয় নির্বাচনের আগে প্রতিটি পক্ষই নিজেদের অবস্থান শক্ত রাখতে চাইছে। ফলে আপসের প্রয়োজন স্বীকার করেও আলোচনায় সময় বাড়ছে.\n\nআলোচনা দীর্ঘ হলে সংস্কার বাস্তবায়নেও দেরি হতে পারে বলে বিশ্লেষকদের আশঙ্কা.",
    },
    {
      id: "bn-4",
      category: "Business",
      imageUrl:
        "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
      sourceName: "মার্কেট লেজার",
      sourceUrl: "https://example.com/retail-earnings-bn",
      title: "প্রিমিয়াম ক্রেতাদের ব্যয়ে খুচরা আয় প্রত্যাশার চেয়ে ভালো - Static News",
      summary:
        "ভ্রমণ, বিউটি এবং উচ্চ মুনাফার নিজস্ব ব্র্যান্ডে ভালো বিক্রির কারণে বড় খুচরা প্রতিষ্ঠানগুলো প্রত্যাশার চেয়ে ভালো ফল দিয়েছে। তবে স্বল্প আয়ের ক্রেতাদের মধ্যে মূল্যসংবেদনশীলতা এখনও বেশি।",
      articleBody:
        "বড় খুচরা প্রতিষ্ঠানগুলোর সাম্প্রতিক আয় প্রতিবেদনে দেখা গেছে, উচ্চ আয়ের ক্রেতারা এখনও ভ্রমণ, বিউটি ও প্রিমিয়াম পণ্যে ব্যয় ধরে রেখেছেন। এতে প্রতিষ্ঠানের মুনাফা প্রত্যাশার চেয়ে ভালো হয়েছে.\n\nঅন্যদিকে নিম্ন ও মধ্যম আয়ের ক্রেতাদের মধ্যে ছাড়নির্ভর কেনাকাটার প্রবণতা স্পষ্ট। ফলে প্রতিষ্ঠানগুলোকে একদিকে প্রিমিয়াম পণ্যের মার্জিন ধরে রাখতে হচ্ছে, অন্যদিকে মৌলিক পণ্যে প্রতিযোগিতামূলক মূল্যও দিতে হচ্ছে.\n\nসামগ্রিক ছবি আগের আশঙ্কার তুলনায় ভালো হলেও পুনরুদ্ধার এখনও সব স্তরে সমান নয়.",
    },
    {
      id: "bn-5",
      category: "Sports",
      imageUrl:
        "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80",
      sourceName: "ম্যাচ বুলেটিন",
      sourceUrl: "https://example.com/final-preview-bn",
      title: "রোমাঞ্চকর প্রত্যাবর্তনে ফাইনালে জায়গা করে নিল আন্ডারডগ দল - Static News",
      summary:
        "দ্বিতীয়ার্ধের নাটকীয় পরিবর্তনে সেমিফাইনালের চিত্র বদলে যায় এবং ফেভারিট দলকে হারিয়ে ফাইনালে ওঠে আন্ডারডগরা। কোচরা বিরতির পর রক্ষণ ও ট্রানজিশন উন্নতিকেই সাফল্যের মূল কারণ বলেছেন।",
      articleBody:
        "সেমিফাইনালের মোড় ঘুরে যায় বিরতির পর কয়েকটি কৌশলগত পরিবর্তনে। জয়ী দলটি রক্ষণ আরও গুছিয়ে আনে, মাঝমাঠে চাপ বাড়ায় এবং দ্রুত ট্রানজিশনে প্রতিপক্ষকে চাপে ফেলে.\n\nসমতায় ফেরার পর ম্যাচের গতি পুরোপুরি বদলে যায়। ফেভারিট দলটি এরপর আর ছন্দে ফিরতে পারেনি.\n\nকোচদের মতে, শেষ বিশ মিনিটে আত্মবিশ্বাস ও শৃঙ্খলাই পার্থক্য গড়ে দিয়েছে.",
    },
  ],
};
