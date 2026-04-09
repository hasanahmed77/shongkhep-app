import { Platform } from "react-native";
import { Category, Language, NewsCard } from "../types";

const ENDPOINTS: Record<Language, string> = {
  en: "/news/en",
  bn: "/news/bn",
};

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  (Platform.OS === "android"
    ? "http://10.0.2.2:8000/api/v1"
    : "http://127.0.0.1:8000/api/v1");

type FeedArticle = {
  id: string;
  cursor: string;
  category: string;
  image_url: string | null;
  source_name: string;
  source_url: string;
  title: string;
  summary: string;
  article_body: string;
  published_at: string | null;
};

type FeedResponse = {
  language: Language;
  updated_at: string;
  has_more: boolean;
  next_cursor: string | null;
  articles: FeedArticle[];
};

type FeedUpdatesResponse = {
  language: Language;
  has_new: boolean;
  new_count: number;
  latest_cursor: string | null;
};

type FetchFeedOptions = {
  limit?: number;
  before?: string | null;
  after?: string | null;
};

export async function syncNewsFeed(
  language: Language,
  category: Category,
): Promise<void> {
  const params = new URLSearchParams({
    language,
  });
  if (category !== "All") {
    params.set("category", category);
  }
  const url = `${API_BASE_URL}/news/sync-now?${params.toString()}`;
  const response = await fetch(url, { method: "POST" });
  if (!response.ok) {
    throw new Error(`Sync request failed with status ${response.status}`);
  }
}

export async function fetchNewsFeed(
  language: Language,
  category: Category,
  options: FetchFeedOptions = {},
): Promise<{
  articles: NewsCard[];
  endpointLabel: string;
  fallback: boolean;
  hasMore: boolean;
  nextCursor: string | null;
}> {
  const params = new URLSearchParams();
  if (category !== "All") {
    params.set("category", category);
  }
  params.set("limit", String(options.limit ?? 10));
  if (options.before) {
    params.set("before", options.before);
  }
  if (options.after) {
    params.set("after", options.after);
  }
  const query = `?${params.toString()}`;
  const url = `${API_BASE_URL}${ENDPOINTS[language]}${query}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Feed request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as FeedResponse;
  return {
    articles: payload.articles.map(mapFeedArticle),
    endpointLabel: `${ENDPOINTS[language]}${query}`,
    fallback: false,
    hasMore: payload.has_more,
    nextCursor: payload.next_cursor,
  };
}

export async function fetchFeedUpdates(
  language: Language,
  category: Category,
  after: string,
): Promise<{ hasNew: boolean; newCount: number; latestCursor: string | null }> {
  const params = new URLSearchParams({ after });
  if (category !== "All") {
    params.set("category", category);
  }
  const url = `${API_BASE_URL}${ENDPOINTS[language]}/updates?${params.toString()}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Updates request failed with status ${response.status}`);
  }
  const payload = (await response.json()) as FeedUpdatesResponse;
  return {
    hasNew: payload.has_new,
    newCount: payload.new_count,
    latestCursor: payload.latest_cursor,
  };
}

function mapFeedArticle(article: FeedArticle): NewsCard {
  return {
    id: article.id,
    cursor: article.cursor,
    category: normalizeCategory(article.category),
    imageUrl:
      article.image_url ??
      "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=80",
    sourceName: article.source_name,
    sourceUrl: article.source_url,
    title: article.title,
    summary: article.summary,
    articleBody: article.article_body,
    publishedAt: article.published_at,
  };
}

function normalizeCategory(category: string): NewsCard["category"] {
  const allowed = new Set(["World", "Politics", "Business", "Technology", "Sports"]);
  return allowed.has(category) ? (category as NewsCard["category"]) : "World";
}
