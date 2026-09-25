export type View = 'welcome' | 'safety' | 'planner' | 'chat' | 'packages' | 'trip';
export interface PlanInput {
  origin: string; travelers: number;
  month: string; // e.g. "December 2026"
  nights: number; budget: number; // per person GBP
  route: 'makkah-first' | 'madinah-first';
}
export interface Pkg {
  id: string; title: string; tag: string;
  makkahHotel: string; madinahHotel: string;
  makkahNights: number; madinahNights: number;
  priceLow: number; priceHigh: number; // per person GBP
  walkNote: string; features: string[];
}
