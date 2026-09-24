
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'glass';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  onClick,
  ...props 
}) => {
  const baseStyles = "relative overflow-hidden inline-flex items-center justify-center font-medium transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98]";
  
  const variants = {
    primary: "bg-gradient-to-br from-amber-900 via-amber-800 to-amber-950 text-white shadow-[0_8px_20px_-6px_rgba(120,53,15,0.4)] hover:shadow-[0_12px_25px_-8px_rgba(120,53,15,0.5)] border border-white/10 hover:brightness-110",
    secondary: "bg-white text-amber-950 shadow-[0_4px_15px_-4px_rgba(0,0,0,0.05)] border border-stone-200 hover:border-amber-200 hover:bg-amber-50/50",
    outline: "border-2 border-stone-300 text-stone-600 hover:border-amber-800 hover:text-amber-900 bg-transparent",
    glass: "bg-white/40 backdrop-blur-md border border-white/60 text-stone-800 hover:bg-white/60 shadow-sm"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3.5 text-base",
    lg: "px-8 py-4 text-lg w-full"
  };

  const handlePress = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (navigator.vibrate) navigator.vibrate(10);
    if (onClick) onClick(e);
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={handlePress}
      {...props}
    >
      {/* Shine effect for primary buttons */}
      {variant === 'primary' && (
        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent z-0 pointer-events-none" />
      )}
      <span className="relative z-10 flex items-center">{children}</span>
    </button>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ 
  children, 
  className = '', 
  onClick 
}) => {
  const handlePress = () => {
    if (onClick) {
      if (navigator.vibrate) navigator.vibrate(5);
      onClick();
    }
  };

  return (
    <div 
      onClick={handlePress}
      className={`
        bg-white rounded-[2rem] p-6 
        shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] 
        border border-white/60 
        relative overflow-hidden
        ${onClick ? 'cursor-pointer hover:translate-y-[-4px] hover:shadow-[0_20px_50px_-12px_rgba(180,83,9,0.15)] transition-all duration-500 ease-out' : ''} 
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export const InputGroup: React.FC<{ label: string; icon?: React.ReactNode; children: React.ReactNode }> = ({ 
  label, 
  icon, 
  children 
}) => {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-xs font-bold text-stone-400 uppercase tracking-widest">
        {icon && <span className="text-amber-600">{icon}</span>}
        {label}
      </label>
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-100 to-orange-50 rounded-lg blur opacity-0 group-hover:opacity-50 transition duration-500"></div>
        <div className="relative">
          {children}
        </div>
      </div>
    </div>
  );
};

export const ScreenContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = "" 
}) => {
  return (
    <div className="relative min-h-screen w-full flex justify-center bg-[#EBE8E3]">
       {/* Background Noise Texture */}
      <div className="fixed inset-0 bg-noise pointer-events-none z-0"></div>
      
      {/* Main App Shell */}
      <div className={`
        relative z-10 w-full max-w-[430px] bg-[#FDFBF7] 
        min-h-screen shadow-2xl overflow-hidden flex flex-col font-sans text-stone-800
        ${className}
      `}>
        {children}
      </div>
    </div>
  );
};
