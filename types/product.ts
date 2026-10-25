export type Product = {
  id: string | number;
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  emoji: string;
  image: string;
  price: number;
  minPrice: number;
  maxPrice: number;
  averagePrice: number;
  previousPrice?: number;
  unit: string;
  description: string;
  markets: MarketPrice[];
};

export type MarketPrice = {
  name: string;
  division: string;
  minPrice: number;
  maxPrice: number;
};

export type Category = {
  name: string;
  slug: string;
};
