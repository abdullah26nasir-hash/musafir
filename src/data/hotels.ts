// Curated, real hotels near the Haramain. Distances are widely-published walking
// estimates; nightly rates are typical bands, refreshed manually - labelled as such.
export interface Hotel {
  name: string; city: 'Makkah' | 'Madinah'; stars: number;
  walkMin: number;            // typical walking minutes to the Haram
  nightlyGBP: [number, number]; // low-high band
  note: string;
}
export const HOTELS: Hotel[] = [
  { name: 'Fairmont Makkah Clock Royal Tower', city: 'Makkah', stars: 5, walkMin: 2, nightlyGBP: [220, 420], note: 'Inside the Clock Tower complex, steps from the Haram' },
  { name: 'Swissotel Makkah', city: 'Makkah', stars: 5, walkMin: 3, nightlyGBP: [160, 300], note: 'Direct access to the Haram via the Ajyad entrance' },
  { name: 'Pullman ZamZam Makkah', city: 'Makkah', stars: 5, walkMin: 4, nightlyGBP: [140, 260], note: 'Zamzam tower, facing the King Abdulaziz Gate' },
  { name: 'Conrad Makkah', city: 'Makkah', stars: 5, walkMin: 8, nightlyGBP: [120, 220], note: 'Jabal Omar development, modern and calm' },
  { name: 'Movenpick Hajar Tower', city: 'Makkah', stars: 5, walkMin: 5, nightlyGBP: [110, 200], note: 'Reliable, good family rooms' },
  { name: 'Elaf Kinda Hotel', city: 'Makkah', stars: 4, walkMin: 6, nightlyGBP: [70, 130], note: 'Solid value close to the Haram' },
  { name: 'voco Makkah', city: 'Makkah', stars: 4, walkMin: 12, nightlyGBP: [55, 100], note: 'Shuttle to the Haram; quieter and cheaper' },
  { name: 'The Oberoi, Madina', city: 'Madinah', stars: 5, walkMin: 4, nightlyGBP: [180, 340], note: 'Facing the Prophet\u2019s Mosque, women\u2019s gate nearby' },
  { name: 'Pullman Zamzam Madina', city: 'Madinah', stars: 5, walkMin: 3, nightlyGBP: [130, 240], note: 'Very close to the ladies\u2019 entrance' },
  { name: 'Anwar Al Madinah Movenpick', city: 'Madinah', stars: 5, walkMin: 5, nightlyGBP: [100, 190], note: 'Largest hotel in Madinah, family-friendly' },
  { name: 'Shaza Al Madina', city: 'Madinah', stars: 5, walkMin: 6, nightlyGBP: [90, 170], note: 'Boutique feel, excellent service' },
  { name: 'Saja Al Madinah', city: 'Madinah', stars: 4, walkMin: 8, nightlyGBP: [55, 110], note: 'Good value, short walk to the northern courtyard' },
];
export const FLIGHT_BAND_GBP: [number, number] = [420, 720]; // typical London-Jeddah return band
export const HARAMAIN_TRAIN_GBP = 45; // Makkah-Madinah high-speed train, approx economy fare
