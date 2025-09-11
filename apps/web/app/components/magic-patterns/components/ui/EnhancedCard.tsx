import React from 'react';
import { cn } from '@kit/ui/utils';

interface EnhancedCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: 'lift' | 'glow' | 'scale' | 'tilt' | 'slide';
  shadowLevel?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'default' | 'glass' | 'neon' | 'gradient';
  onClick?: () => void;
  disabled?: boolean;
}

export const EnhancedCard = ({ 
  children, 
  className, 
  hoverEffect = 'lift',
  shadowLevel = 'lg',
  variant = 'default',
  onClick,
  disabled = false
}: EnhancedCardProps) => {
  const baseClasses = "relative overflow-hidden transition-all duration-300 ease-out";
  
  const hoverEffects = {
    lift: "hover:-translate-y-2 hover:shadow-2xl",
    glow: "hover:shadow-2xl hover:shadow-blue-500/25 hover:ring-2 hover:ring-blue-500/20",
    scale: "hover:scale-105 hover:shadow-2xl",
    tilt: "hover:rotate-1 hover:scale-105 hover:shadow-2xl",
    slide: "hover:translate-x-2 hover:translate-y-1 hover:shadow-2xl"
  };

  const shadowLevels = {
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
    '2xl': "shadow-2xl"
  };

  const variants = {
    default: "bg-white border border-gray-200",
    glass: "bg-white/80 backdrop-blur-sm border border-white/20",
    neon: "bg-white border border-blue-200 shadow-blue-500/10",
    gradient: "bg-gradient-to-br from-white to-gray-50 border border-gray-200"
  };

  const interactiveClasses = onClick && !disabled 
    ? "cursor-pointer active:scale-95" 
    : "";

  const disabledClasses = disabled 
    ? "opacity-50 cursor-not-allowed" 
    : "";

  return (
    <div
      className={cn(
        baseClasses,
        hoverEffects[hoverEffect],
        shadowLevels[shadowLevel],
        variants[variant],
        interactiveClasses,
        disabledClasses,
        className
      )}
      onClick={onClick}
    >
      {/* Subtle inner glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

// Specialized card variants for different content types
export const EventCard = ({ children, className, ...props }: Omit<EnhancedCardProps, 'variant'>) => (
  <EnhancedCard 
    variant="gradient" 
    hoverEffect="lift" 
    shadowLevel="lg"
    className={cn("rounded-xl", className)}
    {...props}
  >
    {children}
  </EnhancedCard>
);

export const PerformerCard = ({ children, className, ...props }: Omit<EnhancedCardProps, 'variant'>) => (
  <EnhancedCard 
    variant="neon" 
    hoverEffect="glow" 
    shadowLevel="xl"
    className={cn("rounded-2xl", className)}
    {...props}
  >
    {children}
  </EnhancedCard>
);

export const VenueCard = ({ children, className, ...props }: Omit<EnhancedCardProps, 'variant'>) => (
  <EnhancedCard 
    variant="glass" 
    hoverEffect="scale" 
    shadowLevel="lg"
    className={cn("rounded-lg", className)}
    {...props}
  >
    {children}
  </EnhancedCard>
);

export const ShopCard = ({ children, className, ...props }: Omit<EnhancedCardProps, 'variant'>) => (
  <EnhancedCard 
    variant="default" 
    hoverEffect="tilt" 
    shadowLevel="md"
    className={cn("rounded-xl", className)}
    {...props}
  >
    {children}
  </EnhancedCard>
);

export const CommunityCard = ({ children, className, ...props }: Omit<EnhancedCardProps, 'variant'>) => (
  <EnhancedCard 
    variant="gradient" 
    hoverEffect="slide" 
    shadowLevel="xl"
    className={cn("rounded-2xl", className)}
    {...props}
  >
    {children}
  </EnhancedCard>
);

export const CalendarCard = ({ children, className, ...props }: Omit<EnhancedCardProps, 'variant'>) => (
  <EnhancedCard 
    variant="neon" 
    hoverEffect="glow" 
    shadowLevel="lg"
    className={cn("rounded-xl", className)}
    {...props}
  >
    {children}
  </EnhancedCard>
);
