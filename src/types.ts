export type Language = "en" | "bn";
export type Vertical = "news" | "tech" | "science" | "gaming";

export type NewsCategory =
  | "All"
  | "World"
  | "Politics"
  | "Business"
  | "Technology"
  | "Sports";

export type TechCategory = "All" | "AI" | "Startups" | "Devices" | "Platforms";
export type ScienceCategory = "All" | "Space" | "Research" | "Health" | "Climate";
export type GamingCategory = "All" | "Releases" | "Sales" | "Platform News" | "Reviews";

export type Category = NewsCategory | TechCategory | ScienceCategory | GamingCategory;

export type NewsCard = {
  id: string;
  cursor: string;
  vertical: Vertical;
  category: string;
  imageUrl: string;
  sourceName: string;
  sourceUrl: string;
  title: string;
  summary: string;
  articleBody: string;
  publishedAt: string | null;
};
