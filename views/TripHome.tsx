
import React, { useState } from 'react';
import { Button, Card, ScreenContainer } from '../components/UI';
import { Icons, MosqueSilhouette } from '../components/Icons';
import { SelectedTrip, ChecklistItem } from '../types';

interface Props {
  trip: SelectedTrip;
  onBack: () => void;
}

export const TripHome: React.FC<Props> = ({ trip, onBack }) => {
  const [activeTab, setActiveTab] = useState<'itinerary' | 'checklist'>('itinerary');
  const [checklistTab, setChecklistTab] = useState<'pre-travel' | 'packing'>('pre-travel');

  // Simple countdown logic (mocked relative to today)
  const daysRemaining = 12; 

  const handleTabChange = (tab: 'itinerary' | 'checklist') => {
    if (navigator.vibrate) navigator.vibrate(5);
    setActiveTab(tab);
  };

  const handleChecklistTabChange = (tab: 'pre-travel' | 'packing') => {
    if (navigator.vibrate) navigator.vibrate(5);
    setChecklistTab(tab);
  };

  const handleCheck = () => {
    if (navigator.vibrate) navigator.vibrate(10);
  };

  return (
    <ScreenContainer>
      {/* Hero Card Area */}
      <div className="bg-white pb-6 rounded-b-[3rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] relative z-20 overflow-hidden">
        {/* Header Background */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#FDFBF7] via-amber-50 to-white z-0"></div>
        <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] z-0"></div>
        
        {/* Nav */}
        <div className="relative z-10 px-6 pt-12 flex justify-between items-start mb-6">
           <button onClick={onBack} className="p-3 rounded-full bg-white shadow-sm border border-stone-100 hover:bg-stone-50 transition-colors">
            <Icons.ChevronLeft className="text-stone-800 w-5 h-5" />
          </button>
          <button className="p-3 rounded-full bg-white shadow-sm border border-stone-100 hover:bg-stone-50 transition-colors">
            <Icons.Share className="text-stone-800 w-5 h-5" />
          </button>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 text-[10px] font-bold tracking-widest uppercase mb-6 shadow-sm">
            <Icons.CheckCircle2 size={12} />
            Trip Confirmed
          </div>
          <h1 className="text-4xl font-serif text-stone-900 mb-2 leading-tight">{trip.title}</h1>
          <p className="text-stone-500 font-medium">{trip.features[0]}</p>

          {/* Countdown Widget */}
          <div className="mt-8 bg-white rounded-3xl p-6 border border-stone-100 shadow-[0_10px_30px_-10px_rgba(217,119,6,0.15)] mx-auto max-w-[280px] relative overflow-hidden group hover:scale-105 transition-transform duration-300">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-300 to-amber-500"></div>
             <div className="text-6xl font-serif text-amber-900 tracking-tight mb-2">{daysRemaining}</div>
             <div className="text-xs uppercase tracking-[0.2em] text-stone-400 font-bold">Days Until Departure</div>
             <div className="mt-3 inline-block px-3 py-1 bg-amber-50 rounded text-[10px] font-serif italic text-amber-800">in shā' Allāh</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-8 mt-8 gap-8 border-b border-stone-200">
        <button 
          onClick={() => handleTabChange('itinerary')}
          className={`pb-4 font-bold text-sm tracking-wide transition-all relative ${activeTab === 'itinerary' ? 'text-amber-900' : 'text-stone-400 hover:text-stone-600'}`}
        >
          Daily Itinerary
          {activeTab === 'itinerary' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-800 rounded-full layout-id"></div>}
        </button>
        <button 
          onClick={() => handleTabChange('checklist')}
          className={`pb-4 font-bold text-sm tracking-wide transition-all relative ${activeTab === 'checklist' ? 'text-amber-900' : 'text-stone-400 hover:text-stone-600'}`}
        >
          Checklists
          {activeTab === 'checklist' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-800 rounded-full layout-id"></div>}
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-8 py-8 no-scrollbar pb-24">
        
        {activeTab === 'itinerary' ? (
          <div className="space-y-0 relative">
            {/* Timeline Line */}
            <div className="absolute left-[20px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-amber-200 via-stone-200 to-stone-100"></div>

            {trip.itinerary.map((item, idx) => (
              <div key={idx} className="relative pl-12 pb-10 last:pb-0">
                {/* Dot */}
                <div className={`absolute left-0 top-1 w-11 h-11 rounded-full flex items-center justify-center border-4 border-[#FDFBF7] z-10 shadow-md ${idx === 0 ? 'bg-amber-500 text-white shadow-amber-200' : 'bg-white text-stone-400 border-stone-100'}`}>
                   <span className="text-xs font-bold">{item.day}</span>
                </div>
                
                {/* Content */}
                <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.03)] border border-white hover:border-amber-100 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-2 py-1 rounded">{item.city}</span>
                  </div>
                  <p className="text-stone-700 font-medium leading-relaxed">{item.activity}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Sub Tabs for Checklist */}
            <div className="flex p-1.5 bg-white rounded-2xl mb-8 shadow-sm border border-stone-100">
              <button 
                onClick={() => handleChecklistTabChange('pre-travel')}
                className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${checklistTab === 'pre-travel' ? 'bg-stone-900 text-white shadow-lg' : 'text-stone-500 hover:bg-stone-50'}`}
              >
                Before Travel
              </button>
              <button 
                onClick={() => handleChecklistTabChange('packing')}
                className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${checklistTab === 'packing' ? 'bg-stone-900 text-white shadow-lg' : 'text-stone-500 hover:bg-stone-50'}`}
              >
                Packing List
              </button>
            </div>

            <div className="space-y-4">
              {(checklistTab === 'pre-travel' ? trip.preTravelChecklist : trip.packingChecklist).map((item) => (
                 <label key={item.id} className="group flex items-center p-5 bg-white rounded-2xl border border-stone-100 shadow-[0_4px_15px_-4px_rgba(0,0,0,0.03)] cursor-pointer hover:border-amber-200 hover:shadow-md transition-all">
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        className="peer appearance-none w-6 h-6 border-2 border-stone-300 rounded-lg checked:bg-amber-500 checked:border-amber-500 transition-all" 
                        defaultChecked={item.completed} 
                        onChange={handleCheck}
                      />
                      <Icons.CheckCircle2 className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity duration-200" />
                    </div>
                    <span className="ml-4 text-stone-700 font-medium group-hover:text-amber-900 transition-colors">{item.text}</span>
                 </label>
              ))}
            </div>
          </div>
        )}

      </div>
      
    </ScreenContainer>
  );
};
