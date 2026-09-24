// Curated safety + planning content. Authoritative sources linked; nothing invented.
export interface EmergencyContact { label: string; number: string; note?: string; }
export const EMERGENCY: EmergencyContact[] = [
  { label: 'Unified emergency (Makkah, Riyadh, Eastern)', number: '911', note: 'Police, medical, fire - one number in the holy cities' },
  { label: 'Ambulance (Saudi Red Crescent)', number: '997' },
  { label: 'Police', number: '999' },
  { label: 'Civil Defence', number: '998' },
  { label: 'British Consulate, Jeddah', number: '+966 12 622 5550', note: '24/7 for British nationals in distress' },
  { label: 'FCDO in London (urgent)', number: '+44 20 7008 5000', note: 'If you cannot reach the consulate' },
];

export interface SafetyGuide { id: string; title: string; icon: string; points: string[]; source?: string; }
export const SAFETY_GUIDES: SafetyGuide[] = [
  {
    id: 'crowds', title: 'Crowd safety at the Haram', icon: 'crowd',
    points: [
      'The Mataf (tawaf area) is densest between Maghrib and Isha, all of Friday, and the last 10 nights of Ramadan - pick off-peak hours for tawaf with elderly family.',
      'Agree a fixed meeting point outside the mosque (e.g. a specific gate number) before entering - phones often have no signal in the crush.',
      'In a moving crowd, keep your arms up in front of your chest and move with the flow diagonally toward the edge - never against it.',
      'If someone falls, help them up immediately and keep moving; stopping creates the danger.',
      'Upper floors of the mosque are calmer for prayer; wheelchairs are available for tawaf and sa\u2019i.',
    ],
    source: 'Saudi Civil Defence & pilgrim welfare guidance',
  },
  {
    id: 'heat', title: 'Heat & hydration', icon: 'heat',
    points: [
      'Makkah regularly exceeds 40\u00B0C Apr-Oct; heatstroke is the biggest medical risk to pilgrims.',
      'Do outdoor rituals (tawaf, sa\u2019i, ziyarat) before 9am or after Maghrib in hot months.',
      'Zamzam water points are throughout both mosques - drink at every one you pass, even if not thirsty.',
      'Signs of heat exhaustion: headache, dizziness, nausea, confusion. Move to shade, cool the neck and wrists, seek the Red Crescent posts in the mosque.',
      'Elderly pilgrims and children: indoor prayer areas during 10:00-16:00 in summer.',
    ],
  },
  {
    id: 'scams', title: 'Scams that target pilgrims', icon: 'shield',
    points: [
      'Only book packages with ATOL-protected UK travel firms - check the ATOL database before paying anything. Fake "cheap Umrah package" sellers cost UK pilgrims thousands every year.',
      'Inside the cities: ignore unofficial "guides" offering paid shortcuts, special access, or "closed-area" tours.',
      'Never hand your passport to anyone but uniformed officials; keep a photo of it on your phone.',
      'Book Rawdah permits only in the official Nusuk app - they are free. Anyone selling a permit is scamming you.',
      'Card skimming happens at tourist-area ATMs - use ATMs inside banks or your hotel.',
    ],
    source: 'City of London Police & FCDO pilgrim scam warnings',
  },
  {
    id: 'health', title: 'Health requirements', icon: 'health',
    points: [
      'Meningococcal ACWY vaccination is required for the Umrah visa - certificate valid 3 years (polysaccharide) or 5 years (conjugate), issued at least 10 days before arrival.',
      'Seasonal flu and COVID vaccination are recommended, especially for over-65s and chronic conditions.',
      'Bring prescription medicines in original packaging with a doctor\u2019s letter; some common UK medicines are controlled in Saudi Arabia - check before you fly.',
      'Travel insurance that covers pre-existing conditions and medical evacuation is strongly advised - FCDO warns insurance may be invalid if you travel against its advice.',
    ],
    source: 'Saudi Ministry of Health & FCDO',
  },
  {
    id: 'women', title: 'Women travelling for Umrah', icon: 'women',
    points: [
      'Women can now perform Umrah without a mahram (male guardian) under Saudi rules - many travel in organised women\u2019s groups.',
      'Both mosques have dedicated women\u2019s entrances, prayer halls, and facilities - ask staff; they are well signed in Arabic and English.',
      'A women-only taxi app and women-staffed security desks operate at the Haramain; hotel female-only floors are common in the Clock Tower complex.',
      'Modest dress is required; an abaya is customary but any loose, full-coverage clothing is acceptable. No need to cover the face.',
      'Solo women: share your live location with family, use hotel-arranged transport at night, and keep the consulate number saved.',
    ],
    source: 'Saudi Ministry of Hajj & Umrah guidance, FCDO',
  },
  {
    id: 'regional', title: 'Regional events & getting home', icon: 'globe',
    points: [
      'Regional tensions can change airspace and advice quickly - the app pulls the FCDO page live; check it again the week you fly.',
      'Save your airline\u2019s app and turn on notifications; in disruption, rebooking in-app beats the airport queue.',
      'Keep £200-300 in SAR cash separate from your wallet for emergencies.',
      'Register your trip with the FCDO\u2019s email alert service for Saudi Arabia before you travel (link on the FCDO page).',
    ],
  },
];

export interface ChecklistItem { id: string; text: string; link?: string; linkLabel?: string; }
export const PRE_TRAVEL: ChecklistItem[] = [
  { id: 'p1', text: 'Passport valid 6+ months from arrival' },
  { id: 'p2', text: 'Umrah visa or Saudi eVisa arranged', link: 'https://www.visitsaudi.com', linkLabel: 'Visit Saudi' },
  { id: 'p3', text: 'Meningitis ACWY certificate (10+ days before travel)' },
  { id: 'p4', text: 'Install Nusuk app & book Rawdah permit', link: 'https://www.nusuk.sa', linkLabel: 'Nusuk' },
  { id: 'p5', text: 'Travel insurance covering medical evacuation' },
  { id: 'p6', text: 'Register for FCDO Saudi Arabia email alerts', link: 'https://www.gov.uk/foreign-travel-advice/saudi-arabia/email-signup', linkLabel: 'FCDO alerts' },
  { id: 'p7', text: 'Save emergency numbers & consulate offline' },
  { id: 'p8', text: 'Buy ihram & unscented toiletries' },
];
export const PACKING: ChecklistItem[] = [
  { id: 'k1', text: 'Ihram (two sets)' },
  { id: 'k2', text: 'Comfortable broken-in sandals + mosque shoe bag' },
  { id: 'k3', text: 'Unscented soap, deodorant & wipes' },
  { id: 'k4', text: 'Reusable water bottle' },
  { id: 'k5', text: 'Power bank & UK-to-Saudi adapter (Type G fits)' },
  { id: 'k6', text: 'Medication + prescriptions + doctor\u2019s letter' },
  { id: 'k7', text: 'Small dua book or app (offline)' },
  { id: 'k8', text: 'Light abaya/thobe layers for air-conditioned mosques' },
];

// Seasonal crowd guide driven by the live Hijri month.
export const crowdLevel = (hijriMonthEn: string): { level: 'quiet' | 'moderate' | 'busy' | 'peak'; note: string } => {
  const m = hijriMonthEn.toLowerCase();
  if (m.includes('ramadan')) return { level: 'peak', note: 'Ramadan is the busiest Umrah season of the year - the Haram fills at iftar and taraweeh. Book everything early; keep rituals to late night or mid-morning.' };
  if (m.includes('dhul-hijjah') || m.includes('dhu al-hijjah')) return { level: 'peak', note: 'Hajj season - Umrah permits pause around Hajj and the cities are at maximum capacity. Check Nusuk for permit availability.' };
  if (m.includes('shawwal') || m.includes('dhu al-qa')) return { level: 'busy', note: 'Post-Hajj and school-holiday weeks stay busy. Book Rawdah permits as soon as they release.' };
  if (m.includes('rajab') || m.includes('sha')) return { level: 'moderate', note: 'Steady crowds building toward Ramadan. Good availability on hotels and permits.' };
  return { level: 'quiet', note: 'One of the calmer windows of the year - easier tawaf, better hotel rates, more permit availability.' };
};
