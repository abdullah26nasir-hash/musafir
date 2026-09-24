export type ViewState = 'voice-planner' | 'packages' | 'trip-home';

export interface TripPlanInput {
  originCity: string;
  travelers: number;
  startDate: string; // YYYY-MM-DD
  durationNights: number;
  budgetPerPerson: number;
  routePreference: 'jeddah-first' | 'madinah-first' | 'makkah-only';
}

export interface ItineraryDay {
  day: number;
  city: string;
  activity: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface TripPackage {
  id: string;
  title: string;
  tag: string; // e.g. "Best Value", "Luxury"
  pricePerPerson: number;
  currency: string;
  hotelRating: number;
  distanceToHaram: string; // e.g. "10 min walk"
  transportType: string; // e.g. "Haramain Train"
  nightsDistribution: {
    makkah: number;
    madinah: number;
    jeddah?: number;
  };
  features: string[];
  itinerary: ItineraryDay[];
}

export interface SelectedTrip extends TripPackage {
  preTravelChecklist: ChecklistItem[];
  packingChecklist: ChecklistItem[];
  startDate: string;
}