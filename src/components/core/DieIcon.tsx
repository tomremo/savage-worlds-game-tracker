'use client';

import React from 'react';

export type DieType = 4 | 6 | 8 | 10 | 12;

interface DieIconProps {
  type: DieType;
  className?: string;
  isActive?: boolean;
}

export default function DieIcon({ type, className = "", isActive = true }: DieIconProps) {
  const size = 24;
  
  const getShape = () => {
    // isActive: filled with currentColor, white text. !isActive: outlined currentColor, black text.
    const fill = isActive ? "currentColor" : "white";
    const stroke = "currentColor";
    const textFill = isActive ? "white" : "currentColor";

    switch (type) {
      case 4:
        return <path d="M12 2L22 20H2L12 2Z" fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" />;
      case 6:
        return <rect x="3" y="3" width="18" height="18" rx="1" fill={fill} stroke={stroke} strokeWidth="1.5" />;
      case 8:
        return <path d="M12 2L21 12L12 22L3 12L12 2Z" fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" />;
      case 10:
        return <path d="M12 2L20 8L12 22L4 8L12 2Z" fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" />;
      case 12:
        return <path d="M12 2L21 8.5L17.5 19H6.5L3 8.5L12 2Z" fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" />;
      default:
        return null;
    }
  };

  const textFill = isActive ? "white" : "black";

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox={`0 0 24 24`} 
      className={`inline-block select-none ${className}`}
      aria-label={`d${type}`}
    >
      {getShape()}
      <text 
        x="12" 
        y="13" 
        fontSize="10" 
        fontWeight="bold" 
        textAnchor="middle" 
        fill={textFill}
        className="pointer-events-none"
        style={{ dominantBaseline: 'middle', fontFamily: 'system-ui, sans-serif' }}
      >
        {type}
      </text>
    </svg>
  );
}
