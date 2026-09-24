import React, { useState } from 'react';
import { ViewState, TripPlanInput, TripPackage, SelectedTrip, ChecklistItem } from './types';
import { VoicePlanner } from './views/VoicePlanner';
import { PackageList } from './views/PackageList';
import { TripHome } from './views/TripHome';
import { generateTripPackages } from './services/geminiService';

// Default checklists (in a real app, these would come from Gemini too)
const DEFAULT_PRE_TRAVEL: ChecklistItem[] = [
  { id: '1', text: 'Check passport validity (6 months)', completed: false },
  { id: '2', text: 'Book Meningitis ACWY vaccination', completed: false },
  { id: '3', text: 'Install Nusuk app for Rawdah permit', completed: false },
  { id: '4', text: 'Buy Ihram clothing', completed: false },
];

const DEFAULT_PACKING: ChecklistItem[] = [
  { id: 'p1', text: 'Ihram (2 sets for men)', completed: false },
  { id: 'p2', text: 'Unscented soap & toiletries', completed: false },
  { id: 'p3', text: 'Comfortable walking sandals', completed: false },
  { id: 'p4', text: 'Power bank & travel adapter', completed: false },
  { id: 'p5', text: 'Small Quran & Dua book', completed: false },
];

export default function App() {
  const [view, setView] = useState<ViewState>('voice-planner');
  const [tripInput, setTripInput] = useState<TripPlanInput | null>(null);
  const [packages, setPackages] = useState<TripPackage[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<SelectedTrip | null>(null);
  const [loadingPackages, setLoadingPackages] = useState(false);

  const handleVoicePlanComplete = async (data: TripPlanInput) => {
    setTripInput(data);
    setView('packages');
    setLoadingPackages(true);
    
    // Call Gemini to generate the full packages based on the voice input
    const results = await generateTripPackages(data);
    setPackages(results);
    setLoadingPackages(false);
  };

  const handleSelectPackage = (pkg: TripPackage) => {
    // Enhance the package with checklists to create the "SelectedTrip" state
    const fullTrip: SelectedTrip = {
      ...pkg,
      startDate: tripInput?.startDate || new Date().toISOString().split('T')[0],
      preTravelChecklist: DEFAULT_PRE_TRAVEL,
      packingChecklist: DEFAULT_PACKING
    };
    setSelectedTrip(fullTrip);
    setView('trip-home');
  };

  const handleBackToPlanner = () => {
    setView('voice-planner');
    setTripInput(null);
    setPackages([]);
  };

  const handleBackToPackages = () => {
    setView('packages');
  };

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-0 md:p-4 font-sans text-stone-900">
      
      {/* View Router */}
      {view === 'voice-planner' && (
        <VoicePlanner onComplete={handleVoicePlanComplete} />
      )}

      {view === 'packages' && (
        <PackageList 
          packages={packages} 
          isLoading={loadingPackages} 
          onSelect={handleSelectPackage}
          onBack={handleBackToPlanner}
        />
      )}

      {view === 'trip-home' && selectedTrip && (
        <TripHome 
          trip={selectedTrip} 
          onBack={handleBackToPackages}
        />
      )}
    </div>
  );
}