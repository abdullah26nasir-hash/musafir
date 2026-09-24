import React from 'react';
import { 
  Plane, 
  MapPin, 
  Calendar, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  Hotel,
  Train,
  Briefcase,
  ChevronLeft,
  Share2,
  Moon,
  Mic,
  MicOff,
  Sparkles,
  PhoneOff
} from 'lucide-react';

export const MosqueSilhouette = ({ className = "" }: { className?: string }) => (
  <svg 
    viewBox="0 0 400 100" 
    fill="currentColor" 
    className={className}
    preserveAspectRatio="none"
  >
    <path d="M0,100 L400,100 L400,80 L380,80 L380,50 C380,45 375,45 375,50 L375,80 L360,80 L360,40 C360,30 350,30 350,40 L350,80 L330,80 L330,60 C330,50 320,50 320,60 L320,80 L280,80 L280,35 C280,15 250,15 250,35 L250,80 L230,80 L230,55 C230,48 220,48 220,55 L220,80 L200,80 L200,20 C200,5 170,5 170,20 L170,80 L150,80 L150,50 C150,42 140,42 140,50 L140,80 L110,80 L110,35 C110,20 80,20 80,35 L80,80 L60,80 L60,55 C60,48 50,48 50,55 L50,80 L30,80 L30,45 C30,35 20,35 20,45 L20,80 L0,80 Z" opacity="0.3" />
    <path d="M400,100 L0,100 L0,85 L25,85 L25,60 C25,55 35,55 35,60 L35,85 L65,85 L65,45 C65,35 95,35 95,45 L95,85 L125,85 L125,60 C125,55 135,55 135,60 L135,85 L155,85 L155,30 C155,15 185,15 185,30 L185,85 L205,85 L205,65 C205,60 215,60 215,65 L215,85 L235,85 L235,45 C235,35 265,35 265,45 L265,85 L295,85 L295,70 C295,65 305,65 305,70 L305,85 L325,85 L325,50 C325,40 345,40 345,50 L345,85 L400,85 Z" />
  </svg>
);

export const Icons = {
  Plane,
  MapPin,
  Calendar,
  Users,
  CheckCircle2,
  ArrowRight,
  Hotel,
  Train,
  Briefcase,
  ChevronLeft,
  Share: Share2,
  Kaaba: ({ className }: {className?: string}) => (
    <div className={`relative flex items-center justify-center ${className}`}>
        <div className="w-5 h-6 bg-stone-800 rounded-sm relative overflow-hidden shadow-sm">
            <div className="absolute top-1.5 w-full h-[2px] bg-amber-400"></div>
        </div>
    </div>
  ),
  Moon,
  Mic,
  MicOff,
  Sparkles,
  PhoneOff
};