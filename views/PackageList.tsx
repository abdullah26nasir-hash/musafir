
import React, { useState, useEffect } from 'react';
import { ScreenContainer, Button } from '../components/UI';
import { Icons, MosqueSilhouette } from '../components/Icons';
import { TripPackage } from '../types';

interface Props {
  packages: TripPackage[];
  isLoading: boolean;
  onSelect: (pkg: TripPackage) => void;
  onBack: () => void;
}

const LoadingState = () => {
  const [step, setStep] = useState(0);
  const steps = [
    "Analyzing your preferences...",
    "Connecting with travel partners...",
    "Finding best hotels near Haram...",
    "Checking transport availability...",
    "Curating spiritual itineraries...",
    "Finalizing your journey..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(s => (s < steps.length - 1 ? s + 1 : s));
    }, 800); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full px-8 text-center relative overflow-hidden">
      {/* Background Pulse */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-100/40 rounded-full blur-[80px] animate-pulse"></div>
      
      {/* Icon Animation */}
      <div className="relative mb-10">
        <div className="w-24 h-24 bg-white/80 backdrop-blur-xl rounded-full shadow-[0_15px_40px_-10px_rgba(217,119,6,0.2)] border border-white flex items-center justify-center relative z-10">
           <Icons.Sparkles className="w-10 h-10 text-amber-500 animate-spin-slow" />
        </div>
        <div className="absolute inset-0 border-2 border-amber-200/50 rounded-full animate-ping opacity-20 duration-1000"></div>
      </div>

      {/* Text Cycle */}
      <h3 className="text-2xl font-serif text-stone-800 mb-3 relative z-10 transition-all duration-300">
        {steps[step]}
      </h3>
      <p className="text-stone-400 text-sm font-medium tracking-wide relative z-10">Please wait a moment</p>

      {/* Progress Bar */}
      <div className="w-56 h-1.5 bg-stone-100 rounded-full mt-10 overflow-hidden relative z-10 shadow-inner">
        <div 
          className="h-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(245,158,11,0.5)]"
          style={{ width: `${((step + 1) / steps.length) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export const PackageList: React.FC<Props> = ({ packages, isLoading, onSelect, onBack }) => {
  const [activePackage, setActivePackage] = useState<TripPackage | null>(null);

  // Detail View Component
  if (activePackage) {
    return (
      <ScreenContainer className="bg-white">
        {/* Header Image/Gradient */}
        <div className="relative h-72 bg-stone-900 overflow-hidden shrink-0">
           {/* Dynamic Background based on tag */}
          <div className={`absolute inset-0 z-0 bg-gradient-to-br ${
             activePackage.tag.includes('Luxury') ? 'from-slate-900 via-slate-800 to-amber-950' : 'from-amber-900 via-orange-950 to-stone-900'
          }`}></div>
          
          {/* Decorative Pattern */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-20 mix-blend-overlay scale-110"></div>
          
          <div className="absolute top-6 left-6 z-20">
            <button 
              onClick={() => setActivePackage(null)} 
              className="p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors text-white border border-white/20 shadow-lg"
            >
              <Icons.ChevronLeft className="w-6 h-6" />
            </button>
          </div>
          
          <div className="absolute bottom-10 left-8 z-20 text-white w-full pr-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[10px] font-bold uppercase tracking-widest border border-white/20 text-amber-100 shadow-sm">
                {activePackage.tag}
              </span>
              <div className="flex text-amber-300 drop-shadow-md">
                {[...Array(activePackage.hotelRating)].map((_, i) => (
                  <Icons.Sparkles key={i} size={14} fill="currentColor" />
                ))}
              </div>
            </div>
            <h2 className="text-4xl font-serif font-medium leading-tight mb-2 drop-shadow-lg">{activePackage.title}</h2>
            <p className="text-white/80 text-sm flex items-center gap-2 font-medium">
              <Icons.MapPin size={16} className="text-amber-400" />
              {activePackage.distanceToHaram}
            </p>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-8 py-8 no-scrollbar pb-36 -mt-8 relative z-30 bg-white rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
          
          {/* Price & Summary */}
          <div className="flex justify-between items-end mb-12 pb-8 border-b border-stone-100">
            <div>
              <p className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-2">Total Package</p>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-serif text-amber-950">£{activePackage.pricePerPerson}</span>
                <span className="text-stone-400 font-medium ml-1">/ person</span>
              </div>
            </div>
            
            <div className="flex gap-4">
               <div className="flex flex-col items-center bg-stone-50 p-4 rounded-2xl min-w-[76px] border border-stone-100 shadow-sm">
                 <span className="text-2xl font-serif text-amber-900">{activePackage.nightsDistribution.makkah}</span>
                 <span className="text-[9px] text-stone-400 uppercase font-bold tracking-widest mt-1">Makkah</span>
               </div>
               <div className="flex flex-col items-center bg-stone-50 p-4 rounded-2xl min-w-[76px] border border-stone-100 shadow-sm">
                 <span className="text-2xl font-serif text-stone-600">{activePackage.nightsDistribution.madinah}</span>
                 <span className="text-[9px] text-stone-400 uppercase font-bold tracking-widest mt-1">Madinah</span>
               </div>
            </div>
          </div>

          {/* Key Features Grid */}
          <h3 className="font-serif text-xl text-stone-900 mb-6">Package Highlights</h3>
          <div className="grid grid-cols-1 gap-4 mb-12">
             {activePackage.features.map((feat, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-stone-50 rounded-2xl border border-stone-100/50 hover:border-amber-100 transition-colors">
                  <div className="flex-shrink-0 text-amber-600 bg-amber-100/50 p-2 rounded-full">
                    <Icons.CheckCircle2 size={16} />
                  </div>
                  <span className="text-sm font-medium text-stone-700 leading-snug">{feat}</span>
                </div>
              ))}
          </div>

          {/* Details */}
          <div className="space-y-4 mb-12">
            <div className="flex items-center gap-5 p-5 bg-white border border-stone-100 rounded-3xl shadow-[0_5px_20px_-5px_rgba(0,0,0,0.03)]">
               <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                 <Icons.Train size={24} />
               </div>
               <div>
                 <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Transport</p>
                 <p className="text-stone-800 font-medium text-lg">{activePackage.transportType}</p>
               </div>
            </div>
             <div className="flex items-center gap-5 p-5 bg-white border border-stone-100 rounded-3xl shadow-[0_5px_20px_-5px_rgba(0,0,0,0.03)]">
               <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                 <Icons.Hotel size={24} />
               </div>
               <div>
                 <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Accommodation</p>
                 <p className="text-stone-800 font-medium text-lg">{activePackage.hotelRating} Star Rating</p>
               </div>
            </div>
          </div>

          {/* Itinerary Preview */}
          <div className="mb-8">
            <h3 className="font-serif text-2xl text-stone-900 mb-8">Your Journey</h3>
            <div className="space-y-0 pl-4 border-l-2 border-dashed border-amber-200 ml-2">
              {activePackage.itinerary.map((day, i) => (
                <div key={i} className="relative pl-10 pb-10 last:pb-0 group">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-4 border-amber-400 shadow-sm group-hover:scale-110 transition-transform"></div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-bold text-amber-900 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">Day {day.day}</span>
                      <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">• {day.city}</span>
                    </div>
                    <p className="text-stone-700 text-sm font-medium leading-relaxed">{day.activity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Sticky Action Footer */}
        <div className="absolute bottom-0 left-0 w-full p-6 pb-8 bg-white/90 backdrop-blur-lg border-t border-stone-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-40">
          <Button 
            onClick={() => onSelect(activePackage)}
            size="lg"
            className="w-full text-lg py-5 rounded-2xl shadow-xl shadow-amber-900/20"
          >
            Select This Package
            <Icons.ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </ScreenContainer>
    );
  }

  // Main List View
  return (
    <ScreenContainer className="bg-[#FDFBF7]">
       {/* Header */}
      <div className="relative bg-[#FDFBF7] pb-4 pt-12 px-8 shrink-0 z-10">
        <button onClick={onBack} className="absolute top-8 left-6 p-2 rounded-full hover:bg-stone-100 transition-colors">
          <Icons.ChevronLeft className="text-stone-400 w-6 h-6" />
        </button>
        <div className="flex justify-between items-end mt-4 border-b border-stone-200/60 pb-8">
           <div>
             <span className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-2 block">Available Options</span>
             <h2 className="text-4xl font-serif text-stone-900">Select Package</h2>
           </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 no-scrollbar space-y-8 pb-12">
        
        {isLoading ? (
          <LoadingState />
        ) : (
          packages.map((pkg, index) => (
            <div 
              key={pkg.id} 
              onClick={() => setActivePackage(pkg)} 
              className="group cursor-pointer animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-forwards opacity-0"
              style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}
            >
              {/* Card Container */}
              <div className="relative bg-white rounded-[2rem] p-0 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.08)] group-hover:shadow-[0_25px_50px_-12px_rgba(180,83,9,0.2)] border border-white transition-all duration-500 overflow-hidden transform group-hover:-translate-y-2">
                
                {/* Visual Strip - Ticket Header */}
                <div className={`h-40 relative flex flex-col justify-between p-7 overflow-hidden ${
                   pkg.tag.includes('Value') ? 'bg-gradient-to-br from-emerald-50 to-emerald-100/80' : 
                   pkg.tag.includes('Luxury') ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-gradient-to-br from-amber-50 to-orange-100/80'
                }`}>
                   {/* Pattern Overlay */}
                   <div className="absolute inset-0 opacity-[0.07] bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
                   
                   {/* Tag */}
                   <div className="flex justify-between items-start relative z-10">
                      <span className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase backdrop-blur-sm shadow-sm ${
                        pkg.tag.includes('Value') ? 'bg-white/60 text-emerald-900' : 
                        pkg.tag.includes('Luxury') ? 'bg-white/10 text-amber-100 border border-white/10' : 'bg-white/60 text-amber-900'
                      }`}>
                        {pkg.tag}
                      </span>
                      {pkg.tag.includes('Luxury') && <Icons.Sparkles className="text-amber-200 w-5 h-5 animate-pulse" />}
                   </div>

                   {/* Main Title in Header */}
                   <div className="relative z-10">
                     <h3 className={`font-serif text-3xl leading-none mb-2 ${pkg.tag.includes('Luxury') ? 'text-white' : 'text-stone-800'}`}>{pkg.title}</h3>
                     <p className={`text-xs font-bold uppercase tracking-widest opacity-70 ${pkg.tag.includes('Luxury') ? 'text-white' : 'text-stone-600'}`}>{pkg.nightsDistribution.makkah + pkg.nightsDistribution.madinah} Nights Journey</p>
                   </div>
                </div>

                {/* Perforated Line (Visual Trick) */}
                <div className="relative h-4 bg-white -mt-2">
                   <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#FDFBF7] -ml-2 box-content border-r border-black/5"></div>
                   <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#FDFBF7] -mr-2 box-content border-l border-black/5"></div>
                   <div className="absolute left-3 right-3 top-1/2 border-t-2 border-dashed border-stone-100"></div>
                </div>

                {/* Content Body */}
                <div className="p-7 pt-2">
                  {/* Route Visual */}
                  <div className="flex items-center justify-between mb-8 px-1">
                     <div className="flex flex-col items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-stone-300 ring-4 ring-stone-100"></div>
                        <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Start</span>
                     </div>
                     <div className="flex-1 h-[2px] bg-stone-100 mx-2 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-white px-2 text-stone-300">
                          <Icons.Plane size={14} />
                        </div>
                     </div>
                     <div className="flex flex-col items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-lg shadow-amber-200 ring-4 ring-amber-50"></div>
                        <span className="text-[10px] text-amber-900 font-bold uppercase tracking-wider">Makkah</span>
                     </div>
                     <div className="flex-1 h-[2px] bg-stone-100 mx-2"></div>
                     <div className="flex flex-col items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-stone-300 ring-4 ring-stone-100"></div>
                        <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Madinah</span>
                     </div>
                  </div>

                  <div className="flex justify-between items-end">
                     <div className="space-y-2">
                       <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Includes</p>
                       <div className="flex gap-2">
                         <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-50 border border-stone-100 rounded-lg text-[10px] font-bold text-stone-600 uppercase">
                           <Icons.Hotel size={12} className="text-amber-600"/> {pkg.hotelRating} Star
                         </span>
                         <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-50 border border-stone-100 rounded-lg text-[10px] font-bold text-stone-600 uppercase">
                           <Icons.Train size={12} className="text-amber-600"/> Transfer
                         </span>
                       </div>
                     </div>
                     <div className="text-right">
                       <span className="block text-4xl font-serif text-amber-950 tracking-tight">£{pkg.pricePerPerson}</span>
                       <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">per person</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ))
        )}
      </div>
    </ScreenContainer>
  );
};
