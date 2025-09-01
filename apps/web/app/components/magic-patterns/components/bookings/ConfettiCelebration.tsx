import React, { useEffect, useState } from 'react';
import ReactConfetti from 'react-confetti';
export const ConfettiCelebration = () => {
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [confettiPieces, setConfettiPieces] = useState(200);
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    window.addEventListener('resize', handleResize);
    // Gradually reduce confetti pieces for a fade-out effect
    const interval = setInterval(() => {
      setConfettiPieces(prev => {
        const newValue = prev - 10;
        return newValue > 0 ? newValue : 0;
      });
    }, 500);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(interval);
    };
  }, []);
  return <div className="fixed inset-0 pointer-events-none z-50">
      <ReactConfetti width={windowDimensions.width} height={windowDimensions.height} numberOfPieces={confettiPieces} recycle={false} colors={['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']} />
    </div>;
};