export type Language = "en" | "bn";

export type Category =
  | "All"
  | "World"
  | "Politics"
  | "Business"
  | "Technology"
  | "Sports";

export type NewsCard = {
  id: string;
  cursor: string;
  category: Exclude<Category, "All">;
  imageUrl: string;
  sourceName: string;
  sourceUrl: string;
  title: string;
  summary: string;
  articleBody: string;
  publishedAt: string | null;
};
