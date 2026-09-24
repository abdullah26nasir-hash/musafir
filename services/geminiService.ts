
import { GoogleGenAI } from "@google/genai";
import { TripPlanInput, TripPackage } from "../types";

// Mock data fallback in case of API failure or missing key
const MOCK_PACKAGES: TripPackage[] = [
  {
    id: "pkg_1",
    title: "Essential Umrah",
    tag: "Best Value",
    pricePerPerson: 1250,
    currency: "GBP",
    hotelRating: 4,
    distanceToHaram: "15 min walk",
    transportType: "Private Coach",
    nightsDistribution: { makkah: 5, madinah: 5 },
    features: ["Breakfast included", "Guided Ziyarat", "Visa processing"],
    itinerary: [
        { day: 1, city: "Jeddah", activity: "Arrival at KAIA Airport & Transfer to Makkah" },
        { day: 2, city: "Makkah", activity: "Perform Umrah & Rest" },
        { day: 3, city: "Makkah", activity: "Jumu'ah Prayer at Haram" },
        { day: 4, city: "Makkah", activity: "Ziyarat: Jabal Al-Nour & Arafat" },
        { day: 5, city: "Makkah", activity: "Free worship time" },
        { day: 6, city: "Madinah", activity: "Transfer to Madinah via Coach" },
        { day: 7, city: "Madinah", activity: "Rawdah Visit (Appointment needed)" },
        { day: 8, city: "Madinah", activity: "Quba Mosque & Uhud" },
        { day: 9, city: "Madinah", activity: "Shopping & Dates Market" },
        { day: 10, city: "Madinah", activity: "Departure from Prince Mohammad Bin Abdulaziz Airport" }
    ]
  },
  {
    id: "pkg_2",
    title: "Comfort Plus",
    tag: "Recommended",
    pricePerPerson: 1650,
    currency: "GBP",
    hotelRating: 5,
    distanceToHaram: "5 min walk",
    transportType: "Haramain High Speed Train",
    nightsDistribution: { makkah: 5, madinah: 5 },
    features: ["Haram view rooms", "Haramain Train Tickets", "Buffet Breakfast"],
    itinerary: [
        { day: 1, city: "Jeddah", activity: "Arrival & VIP Transfer to Makkah" },
        { day: 2, city: "Makkah", activity: "Perform Umrah with Guide" },
        { day: 3, city: "Makkah", activity: "Daily prayers in Mataf" },
        { day: 4, city: "Makkah", activity: "Historical Makkah Tour" },
        { day: 5, city: "Makkah", activity: "Free day for Ibadah" },
        { day: 6, city: "Madinah", activity: "Haramain Train to Madinah" },
        { day: 7, city: "Madinah", activity: "Salam Greetings to Prophet (PBUH)" },
        { day: 8, city: "Madinah", activity: "Ziyarat of 7 Mosques" },
        { day: 9, city: "Madinah", activity: "Free time near Green Dome" },
        { day: 10, city: "Jeddah", activity: "Train to Jeddah & Departure" }
    ]
  },
   {
    id: "pkg_3",
    title: "Premium Proximity",
    tag: "Luxury",
    pricePerPerson: 2200,
    currency: "GBP",
    hotelRating: 5,
    distanceToHaram: "Clock Tower / Steps away",
    transportType: "Private SUV & Train",
    nightsDistribution: { makkah: 6, madinah: 4 },
    features: ["Clock Tower Hotel", "Full Board", "Private Transfers"],
    itinerary: [
        { day: 1, city: "Jeddah", activity: "Arrival & Private SUV to Makkah" },
        { day: 2, city: "Makkah", activity: "Guided Umrah & Rituals" },
        { day: 3, city: "Makkah", activity: "Jumu'ah at King Fahd Gate" },
        { day: 4, city: "Makkah", activity: "Private Ziyarat Tour" },
        { day: 5, city: "Makkah", activity: "Museum of the Two Holy Mosques" },
        { day: 6, city: "Makkah", activity: "Free Ibadah" },
        { day: 7, city: "Madinah", activity: "First Class Train to Madinah" },
        { day: 8, city: "Madinah", activity: "Prophet's Mosque & Jannat al-Baqi" },
        { day: 9, city: "Madinah", activity: "Quba Mosque (walkable via Sunnah path)" },
        { day: 10, city: "Madinah", activity: "Private Transfer to Airport" }
    ]
  }
];

export const generateTripPackages = async (input: TripPlanInput): Promise<TripPackage[]> => {
  if (!process.env.API_KEY) {
    console.warn("No API Key found, using mock data.");
    return new Promise(resolve => setTimeout(() => resolve(MOCK_PACKAGES), 800)); // Faster mock response
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Optimized prompt for speed: asking for conciseness and strict format
    const prompt = `
      Generate 3 distinct Umrah trip packages: "Best Value", "Recommended", "Luxury".
      
      Details:
      Origin: ${input.originCity}, Travelers: ${input.travelers}, ${input.durationNights} nights, Budget: ~${input.budgetPerPerson} GBP.
      Route: ${input.routePreference}.

      Requirement:
      - Concise strings (short titles, short descriptions) for speed.
      - Use Google Maps to verify real hotels/distances.
      - Output strictly valid JSON array (no markdown).

      JSON Structure:
      [
        {
          "id": "string",
          "title": "string",
          "tag": "string",
          "pricePerPerson": 1000,
          "currency": "GBP",
          "hotelRating": 4,
          "distanceToHaram": "string",
          "transportType": "string",
          "nightsDistribution": { "makkah": 5, "madinah": 5, "jeddah": 0 },
          "features": ["string"],
          "itinerary": [{ "day": 1, "city": "string", "activity": "string" }]
        }
      ]
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }] 
      },
    });

    let text = response.text || "[]";
    if (text.trim().startsWith("```")) {
      text = text.replace(/^```json\s?/, "").replace(/^```\s?/, "").replace(/```$/, "").trim();
    }

    const data = JSON.parse(text);
    return data;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return MOCK_PACKAGES;
  }
};
