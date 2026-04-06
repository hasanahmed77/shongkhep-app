import { Platform } from "react-native";
import { ENDPOINTS, newsByLanguage } from "../data/news";
import { Category, Language, NewsCard } from "../types";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  (Platform.OS === "android"
    ? "http://10.0.2.2:8000/api/v1"
    : "http://127.0.0.1:8000/api/v1");

type FeedArticle = {
  id: string;
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
  articles: FeedArticle[];
};

export async function fetchNewsFeed(
  language: Language,
  category: Category,
): Promise<{ articles: NewsCard[]; endpointLabel: string; fallback: boolean }> {
  const query = category === "All" ? "" : `?category=${encodeURIComponent(category)}`;
  const url = `${API_BASE_URL}${ENDPOINTS[language]}${query}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Feed request failed with status ${response.status}`);
    }

    const payload = (await response.json()) as FeedResponse;
    return {
      articles: payload.articles.map(mapFeedArticle),
      endpointLabel: `${ENDPOINTS[language]}${query}`,
      fallback: false,
    };
  } catch (error) {
    console.warn(`Failed to fetch feed from ${url}`, error);
    const fallbackArticles = newsByLanguage[language].filter((item) =>
      category === "All" ? true : item.category === category,
    );
    return {
      articles: fallbackArticles,
      endpointLabel: `${ENDPOINTS[language]} (fallback)`,
      fallback: true,
    };
  }
}

function mapFeedArticle(article: FeedArticle): NewsCard {
  return {
    id: article.id,
    category: normalizeCategory(article.category),
    imageUrl:
      article.image_url ??
      "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=80",
    sourceName: article.source_name,
    sourceUrl: article.source_url,
    title: article.title,
    summary: article.summary,
    articleBody: article.article_body,
  };
}

function normalizeCategory(category: string): NewsCard["category"] {
  const allowed = new Set(["World", "Politics", "Business", "Technology", "Sports"]);
  return allowed.has(category) ? (category as NewsCard["category"]) : "World";
}
