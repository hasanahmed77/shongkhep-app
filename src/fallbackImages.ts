import { NewsCard, Vertical } from "./types";

const FALLBACK_SIZE = "1200/800";

type Bucket = Record<string, readonly string[]>;

function buildBucket(query: string, baseLock: number): readonly string[] {
  return Array.from({ length: 5 }, (_, index) => {
    const lock = baseLock + index;
    return `https://loremflickr.com/${FALLBACK_SIZE}/${query}?lock=${lock}`;
  });
}

const fallbackImages: Record<Vertical, Bucket> = {
  news: {
    World: buildBucket("world,news,city", 100),
    Politics: buildBucket("politics,government,parliament", 110),
    Business: buildBucket("business,finance,city", 120),
    Technology: buildBucket("technology,computers,digital", 130),
    Sports: buildBucket("sports,stadium,competition", 140),
    All: buildBucket("headlines,newspaper,city", 150),
  },
  tech: {
    AI: buildBucket("artificial-intelligence,technology,robot", 200),
    Startups: buildBucket("startup,office,technology", 210),
    Devices: buildBucket("gadgets,smartphone,laptop", 220),
    Platforms: buildBucket("cloud,software,servers", 230),
    All: buildBucket("technology,innovation,digital", 240),
  },
  science: {
    Space: buildBucket("space,galaxy,stars", 300),
    Research: buildBucket("science,laboratory,research", 310),
    Health: buildBucket("health,medicine,hospital", 320),
    Climate: buildBucket("climate,earth,nature", 330),
    All: buildBucket("science,research,technology", 340),
  },
  gaming: {
    Releases: buildBucket("gaming,console,controller", 400),
    Sales: buildBucket("gaming,store,shopping", 410),
    "Platform News": buildBucket("xbox,playstation,gaming", 420),
    Reviews: buildBucket("gaming,review,setup", 430),
    All: buildBucket("video-games,neon,arcade", 440),
  },
};

function hashSeed(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

export function resolveFallbackImage(article: Pick<NewsCard, "vertical" | "category" | "id" | "title" | "sourceUrl">): string {
  const verticalBucket = fallbackImages[article.vertical] ?? fallbackImages.news;
  const categoryPool =
    verticalBucket[article.category] ??
    verticalBucket.All ??
    fallbackImages.news.All;
  const seed = hashSeed(`${article.id}|${article.title}|${article.sourceUrl}`);
  return categoryPool[seed % categoryPool.length];
}
