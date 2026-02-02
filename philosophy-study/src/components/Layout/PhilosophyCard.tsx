import React from "react";

interface PhilosophyCardProps {
  children: React.ReactNode;
  className?: string;
}

export const PhilosophyCard: React.FC<PhilosophyCardProps> = ({ 
  children, 
  className = "" 
}) => {
  return (
    <div 
      className={`bg-white rounded-xl shadow-lg border border-gray-200 p-6 ${className}`}
    >
      {children}
    </div>
  );
};