import React from 'react';

interface TapeProps {
  className?: string;
  color?: string;
  rotation?: string;
}

export const Tape: React.FC<TapeProps> = ({ 
  className = "", 
  color = "bg-rose-200", 
  rotation = "-rotate-2" 
}) => {
  return (
    <div 
      className={`absolute h-8 w-32 ${color} opacity-80 shadow-sm z-10 ${rotation} ${className}`}
      style={{
        maskImage: 'url("data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCAwIGwxMDAgMHYxMDBIMHoiIGZpbGw9ImJsYWNrIi8+PC9zdmc+")', // Placeholder for complex mask
        clipPath: 'polygon(2% 0%, 98% 0%, 100% 100%, 0% 100%)', // Rough cut look
        boxShadow: '1px 1px 2px rgba(0,0,0,0.1)'
      }}
    >
        {/* Subtle texture for the tape */}
        <div className="w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/noise-lines.png')]"></div>
    </div>
  );
};
