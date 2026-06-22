import React, { useState, ChangeEvent, CSSProperties, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Lucide from 'lucide-react';
import { DraftingTriangleIcon } from './DraftingTriangleIcon';

// @ts-ignore
import brsignFontUrl from '../assets/fonts/Brsign-Black.woff2';

interface DirectionConfig {
  key: string;
  name: string;
  angle: number;
}

const DIRECTIONS: Record<string, DirectionConfig> = {
  'N': { key: 'N', name: 'Up', angle: 0 },
  'NE': { key: 'NE', name: 'Down-Left', angle: 45 },
  'E': { key: 'E', name: 'Right', angle: 90 },
  'SE': { key: 'SE', name: 'Down-Right', angle: 135 },
  'S': { key: 'S', name: 'Down', angle: 180 },
  'SW': { key: 'SW', name: 'Up-Right', angle: 225 },
  'W': { key: 'W', name: 'Left', angle: 270 },
  'NW': { key: 'NW', name: 'Up-Left', angle: 315 },
};

const DIRECTION_CHAR_CODES: Record<string, number> = {
  'W': 192,
  'E': 193,
  'SW': 194,
  'NE': 195,
  'S': 196,
  'N': 197,
  'SE': 198,
  'NW': 199,
};

const PICTOGRAM_GLYPHS = [
  { code: 201, name: "Gentlemen" },
  { code: 202, name: "Ladies" },
  { code: 203, name: "Telephones" },
  { code: 204, name: "Restaurant" },
  { code: 205, name: "Buffet" },
  { code: 206, name: "Bar" },
  { code: 207, name: "Way Out" },
  { code: 208, name: "Way In" },
  { code: 209, name: "First Aid" },
  { code: 210, name: "Baggage Registration" },
  { code: 211, name: "Information" },
  { code: 212, name: "Taxis" },
  { code: 213, name: "Ships" },
  { code: 214, name: "Buses" },
  { code: 216, name: "Underground" },
  { code: 217, name: "Left Luggage" },
  { code: 218, name: "Luggage Lockers" },
  { code: 219, name: "Tickets" },
  { code: 220, name: "Waiting Room" },
  { code: 221, name: "Lost Property" },
  { code: 222, name: "Hairdresser" }
];

const GLYPH_MAP: Record<string, number> = {
  'exit': 207,
  'telephones': 203,
  'toilet': 201,
  'taxi': 212,
  'lift': 201,
  'info': 211,
  'catering': 204,
  'luggage': 217,
  'firstaid': 209,
};

// Beautiful native vector way out icon per client architectural spec
export const WayOutIcon = ({ 
  className = "w-[28px] h-[28px] flex-shrink-0 animate-fade-in", 
  color = "currentColor",
  style
}: { 
  className?: string; 
  color?: string; 
  style?: CSSProperties 
}) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 100 100" 
    className={className}
    aria-label="Way Out Symbol"
    style={{ fill: color, overflow: 'visible', ...style }}
  >
    {/* The stark, blocky architectural frame enclosure */}
    <path 
      d="M75 15 H20 V85 H75 V68 H60 V70 H35 V30 H60 V32 H75 Z" 
    />
    {/* The legendary sharp-angled directional arrow */}
    <path 
      d="M48 38 L62 50 L48 62 V54 H8 V46 H48 V38 Z" 
    />
  </svg>
);

// Precise mathematical reproduction of the British Rail Gerry Barney 1965 Double Arrow
const DoubleArrowLogo = ({ type, textSize = 52 }: { type: string; textSize?: number }) => {
  if (type === 'none') return null;

  const symbolColor = type === 'white-reversed-on-red' ? '#FFFFFF' : '#FF3300';

  // Using the authentic BR double arrow (character 200) in the signage builder
  const symbolElement = (
    <span 
      style={{
        fontFamily: "'Brsign', 'Geist', sans-serif",
        fontSize: `${textSize * 1.3}px`,
        lineHeight: 1,
        color: symbolColor,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'normal'
      }}
      className="select-none h-full self-center"
    >
      {String.fromCharCode(200)}
    </span>
  );

  const paddingStyle = {
    paddingLeft: `${textSize * 0.6}px`,
    paddingRight: `${textSize * 0.6}px`,
    aspectRatio: '1.75'
  };

  switch (type) {
    case 'red-on-white':
      return (
        <div className="flex items-center justify-center bg-white border-r border-[#CBD5E1] h-full flex-shrink-0 animate-fade-in" style={paddingStyle}>
          {symbolElement}
        </div>
      );
    case 'white-reversed-on-red':
      return (
        <div className="flex items-center justify-center bg-[#FF3300] h-full flex-shrink-0 animate-fade-in" style={paddingStyle}>
          {symbolElement}
        </div>
      );
    case 'red-ruled-red':
      return (
        <div className="flex items-center justify-center bg-white border-[3px] border-[#FF3300] h-full flex-shrink-0 animate-fade-in" style={paddingStyle}>
          {symbolElement}
        </div>
      );
    case 'red-ruled-black':
      return (
        <div className="flex items-center justify-center bg-white border-[3px] border-black h-full flex-shrink-0 animate-fade-in" style={paddingStyle}>
          {symbolElement}
        </div>
      );
    default:
      return null;
  }
};

// Beautiful transport-style solid arrow renderer utilizing authentic custom font woff2 asset
const DirectionArrow = ({ direction, show, color, sizePx }: { direction: string; show: boolean; color?: string; sizePx?: number }) => {
  if (!show) return null;

  const charCode = DIRECTION_CHAR_CODES[direction];
  if (charCode) {
    return (
      <div className="flex items-center justify-center px-5 flex-shrink-0 h-full animate-fade-in">
        <span 
          style={{ 
            fontFamily: "'Brsign', 'Geist', sans-serif",
            fontSize: sizePx ? `${sizePx}px` : '2.3em',
            color: color || "#009CCA",
            lineHeight: 1,
            display: 'inline-block',
            fontWeight: 'normal'
          }}
          className="select-none"
        >
          {String.fromCharCode(charCode)}
        </span>
      </div>
    );
  }

  // Fallback to beautiful SVG in case mapping is missing
  const angle = DIRECTIONS[direction]?.angle ?? 0;
  return (
    <div className="flex items-center justify-center px-5 flex-shrink-0 h-full animate-fade-in">
      <svg 
        viewBox="0 0 100 100" 
        className="h-[2.3em] w-auto transition-transform duration-200"
        style={{ transform: `rotate(${angle}deg)`, overflow: 'visible' }}
      >
        <path 
          d="M 50,15 L 15,50 L 30,35 V 85 H 70 V 35 L 85,50 Z" 
          fill={color || "#009CCA"}
        />
      </svg>
    </div>
  );
};

// Renders the stylized station pictograms including WayOutIcon natively
const Pictogram = ({ type, color, textSize = 52 }: { type: string; color: string; textSize?: number }) => {
  if (type === 'none') return null;

  // Render authentic BR custom font glyphs first if available
  let charCode: number | null = null;
  if (/^\d+$/.test(type)) {
    charCode = parseInt(type, 10);
  } else if (GLYPH_MAP[type] !== undefined) {
    charCode = GLYPH_MAP[type];
  }

  if (charCode !== null) {
    return (
      <div 
        className="flex items-center justify-center flex-shrink-0 h-full animate-fade-in"
      >
        <span 
          style={{ 
            fontFamily: "'Brsign', 'Geist', sans-serif",
            fontSize: `${textSize * 1.6}px`, // Increased preview size for spaciousness
            lineHeight: 1,
            color: color,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'normal'
          }}
          className="select-none h-full self-center"
        >
          {String.fromCharCode(charCode)}
        </span>
      </div>
    );
  }

  const iconSize = Math.round(textSize * 1.54); 
  const iconProps = {
    color: color,
    size: iconSize,
    strokeWidth: 2.2,
    className: "flex-shrink-0 animate-fade-in"
  };

  return (
    <div 
      className="flex items-center justify-center flex-shrink-0 h-full"
    >
      {type === 'exit' && (
        <WayOutIcon 
          color={color} 
          className="flex-shrink-0 animate-fade-in" 
          style={{ width: `${iconSize}px`, height: `${iconSize}px` }}
        />
      )}
      {type === 'telephones' && <Lucide.Phone {...iconProps} />}
      {type === 'taxi' && <Lucide.Car {...iconProps} />}
      {type === 'toilet' && <Lucide.Users {...iconProps} />}
      {type === 'lift' && <Lucide.ArrowUpDown {...iconProps} />}
      {type === 'info' && <Lucide.Info {...iconProps} />}
      {type === 'catering' && <Lucide.Coffee {...iconProps} />}
      {type === 'luggage' && <Lucide.Luggage {...iconProps} />}
      {type === 'firstaid' && <Lucide.BriefcaseMedical {...iconProps} />}
    </div>
  );
};

// Renders an authentic vertical dividing line centered and sized appropriately with minHeight to prevent collapsing
const VerticalSeparator = ({ show, isDarkClass, textSize = 52 }: { show: boolean; isDarkClass: boolean; textSize?: number }) => {
  if (!show) return null;
  const colorClass = isDarkClass ? 'bg-white' : 'bg-black';
  const sepHeight = Math.round(textSize * 2.375); 
  const sepWidth = Math.max(4, Math.round(textSize * 0.10)); 
  const horizontalMargin = Math.max(12, Math.round(textSize * 0.35));
  return (
    <div 
      className={`${colorClass} self-center flex-shrink-0 opacity-100`}
      style={{ 
        height: `${sepHeight}px`,
        width: `${sepWidth}px`,
        marginLeft: `${horizontalMargin}px`,
        marginRight: `${horizontalMargin}px`
      }}
    />
  );
};

interface SignageStyleSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  defaultValue: number;
  displayValue: string;
  onChange: (val: number) => void;
}

function SignageStyleSlider({
  label,
  value,
  min,
  max,
  step = 1,
  defaultValue,
  displayValue,
  onChange
}: SignageStyleSliderProps) {
  const pctCurrent = ((value - min) / (max - min)) * 100;
  const pctDefault = ((defaultValue - min) / (max - min)) * 100;

  return (
    <div className="w-full select-none">
      <div className="flex justify-between items-center text-[10px] font-mono font-medium text-slate-400 uppercase tracking-wider mb-1">
        <span>{label}</span>
        <span className="text-slate-600 font-bold text-xs">{displayValue}</span>
      </div>
      
      <div className="relative w-full h-6 flex items-center group">
        {/* Base track (exactly h-[7px] line weight styling) */}
        <div className="absolute left-0 right-0 h-[7px] bg-slate-200/80 rounded-full" />
        
        {/* Highlight track (Rail Red, exactly h-[7px] up to current value) */}
        <div 
          className="absolute left-0 h-[7px] bg-[#a8081b] rounded-full transition-all duration-75"
          style={{ width: `${pctCurrent}%` }}
        />

        {/* Snap Halo Ring at default position */}
        <div 
          className="absolute -translate-x-1/2 w-[27px] h-[27px] rounded-full border-[4px] border-[#a8081b] bg-transparent pointer-events-none z-10 flex items-center justify-center"
          style={{ left: `${pctDefault}%` }}
        />

        {/* Custom Thumb */}
        <div 
          className="absolute -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[#a8081b] border border-[#a8081b] shadow-sm pointer-events-none z-20 group-hover:scale-125 transition-transform duration-75"
          style={{ left: `${pctCurrent}%` }}
        />

        {/* Invisible native slider control overlay to capture events */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-35"
        />
      </div>
    </div>
  );
}

const PRESETS = [
  // 1. Trains & Wayfinding
  {
    category: "Trains & Wayfinding",
    name: "Trains",
    text: "Trains",
    theme: "white",
    arrowDir: "E",
    arrowPos: "right",
    logoType: "none",
    logoPos: "left",
    picType: "none",
    picPos: "left",
    showSeparator: false,
    textSize: 52,
    letterSpacing: 0.00,
    textAlign: "left"
  },
  {
    category: "Trains & Wayfinding",
    name: "Information",
    text: "Information",
    theme: "white",
    arrowDir: "E",
    arrowPos: "right",
    logoType: "none",
    logoPos: "left",
    picType: "info",
    picPos: "left",
    showSeparator: true,
    textSize: 52,
    letterSpacing: 0.00,
    textAlign: "left"
  },
  {
    category: "Trains & Wayfinding",
    name: "Telephones",
    text: "Telephones",
    theme: "white",
    arrowDir: "E",
    arrowPos: "right",
    logoType: "none",
    logoPos: "left",
    picType: "telephones",
    picPos: "left",
    showSeparator: true,
    textSize: 52,
    letterSpacing: 0.00,
    textAlign: "left"
  },
  {
    category: "Trains & Wayfinding",
    name: "Way out",
    text: "Way out",
    theme: "white",
    arrowDir: "E",
    arrowPos: "right",
    logoType: "none",
    logoPos: "left",
    picType: "exit",
    picPos: "left",
    showSeparator: true,
    textSize: 52,
    letterSpacing: 0.00,
    textAlign: "right"
  },
  // 2. Transportation
  {
    category: "Transportation",
    name: "Taxis",
    text: "Taxis",
    theme: "white",
    arrowDir: "E",
    arrowPos: "right",
    logoType: "none",
    logoPos: "left",
    picType: "taxi",
    picPos: "left",
    showSeparator: true,
    textSize: 52,
    letterSpacing: 0.00,
    textAlign: "left"
  },
  {
    category: "Transportation",
    name: "Buses",
    text: "Buses",
    theme: "white",
    arrowDir: "E",
    arrowPos: "right",
    logoType: "none",
    logoPos: "left",
    picType: "214",
    picPos: "left",
    showSeparator: true,
    textSize: 52,
    letterSpacing: 0.00,
    textAlign: "left"
  },
  {
    category: "Transportation",
    name: "Underground",
    text: "Underground",
    theme: "white",
    arrowDir: "E",
    arrowPos: "right",
    logoType: "none",
    logoPos: "left",
    picType: "none",
    picPos: "left",
    showSeparator: false,
    textSize: 52,
    letterSpacing: 0.00,
    textAlign: "left"
  },
  // 3. Station Facilities
  {
    category: "Station Facilities",
    name: "Toilets",
    text: "Toilets",
    theme: "white",
    arrowDir: "E",
    arrowPos: "right",
    logoType: "none",
    logoPos: "left",
    picType: "toilet",
    picPos: "left",
    showSeparator: true,
    textSize: 52,
    letterSpacing: 0.00,
    textAlign: "left"
  },
  {
    category: "Station Facilities",
    name: "Ladies",
    text: "Ladies",
    theme: "white",
    arrowDir: "E",
    arrowPos: "right",
    logoType: "none",
    logoPos: "left",
    picType: "202",
    picPos: "left",
    showSeparator: true,
    textSize: 52,
    letterSpacing: 0.00,
    textAlign: "left"
  },
  {
    category: "Station Facilities",
    name: "Gentlemen",
    text: "Gentlemen",
    theme: "white",
    arrowDir: "W",
    arrowPos: "left",
    logoType: "none",
    logoPos: "left",
    picType: "201",
    picPos: "right",
    showSeparator: true,
    textSize: 52,
    letterSpacing: 0.00,
    textAlign: "left"
  },
  // 4. Food & Drink
  {
    category: "Food & Drink",
    name: "Bar",
    text: "Bar",
    theme: "white",
    arrowDir: "none",
    arrowPos: "none",
    logoType: "none",
    logoPos: "left",
    picType: "206",
    picPos: "left",
    showSeparator: true,
    textSize: 52,
    letterSpacing: 0.00,
    textAlign: "left"
  },
  {
    category: "Food & Drink",
    name: "Buffet",
    text: "Buffet",
    theme: "white",
    arrowDir: "none",
    arrowPos: "none",
    logoType: "none",
    logoPos: "left",
    picType: "205",
    picPos: "left",
    showSeparator: true,
    textSize: 52,
    letterSpacing: 0.00,
    textAlign: "left"
  },
  {
    category: "Food & Drink",
    name: "Refreshments",
    text: "Refreshments",
    theme: "white",
    arrowDir: "none",
    arrowPos: "none",
    logoType: "none",
    logoPos: "left",
    picType: "205",
    picPos: "left",
    showSeparator: true,
    textSize: 52,
    letterSpacing: 0.00,
    textAlign: "left"
  },
  {
    category: "Food & Drink",
    name: "Restaurant",
    text: "Restaurant",
    theme: "white",
    arrowDir: "none",
    arrowPos: "none",
    logoType: "red-on-white",
    logoPos: "left",
    picType: "catering",
    picPos: "left",
    showSeparator: true,
    textSize: 52,
    letterSpacing: 0.00,
    textAlign: "left"
  },
  // 5. Waiting & Luggage
  {
    category: "Waiting & Luggage",
    name: "Waiting room",
    text: "Waiting room",
    theme: "white",
    arrowDir: "none",
    arrowPos: "none",
    logoType: "none",
    logoPos: "left",
    picType: "220",
    picPos: "left",
    showSeparator: true,
    textSize: 52,
    letterSpacing: 0.00,
    textAlign: "left"
  },
  {
    category: "Waiting & Luggage",
    name: "Left luggage",
    text: "Left luggage",
    theme: "white",
    arrowDir: "none",
    arrowPos: "none",
    logoType: "none",
    logoPos: "left",
    picType: "luggage",
    picPos: "left",
    showSeparator: true,
    textSize: 52,
    letterSpacing: 0.00,
    textAlign: "left"
  },
  // 6. Postal & Communications
  {
    category: "Postal & Communications",
    name: "Parcels",
    text: "Parcels",
    theme: "white",
    arrowDir: "none",
    arrowPos: "none",
    logoType: "none",
    logoPos: "left",
    picType: "none",
    picPos: "left",
    showSeparator: false,
    textSize: 52,
    letterSpacing: 0.00,
    textAlign: "left"
  },
  {
    category: "Postal & Communications",
    name: "Post Office",
    text: "Post Office",
    theme: "white",
    arrowDir: "none",
    arrowPos: "none",
    logoType: "none",
    logoPos: "left",
    picType: "none",
    picPos: "left",
    showSeparator: false,
    textSize: 52,
    letterSpacing: 0.00,
    textAlign: "left"
  },
  {
    category: "Postal & Communications",
    name: "Telegrams",
    text: "Telegrams",
    theme: "white",
    arrowDir: "none",
    arrowPos: "none",
    logoType: "none",
    logoPos: "left",
    picType: "none",
    picPos: "left",
    showSeparator: false,
    textSize: 52,
    letterSpacing: 0.00,
    textAlign: "left"
  },
  // 7. Ticketing
  {
    category: "Ticketing",
    name: "Reservations",
    text: "Reservations",
    theme: "white",
    arrowDir: "none",
    arrowPos: "none",
    logoType: "none",
    logoPos: "left",
    picType: "none",
    picPos: "left",
    showSeparator: false,
    textSize: 52,
    letterSpacing: 0.00,
    textAlign: "left"
  },
  {
    category: "Ticketing",
    name: "Ticket office",
    text: "Ticket office",
    theme: "white",
    arrowDir: "none",
    arrowPos: "none",
    logoType: "none",
    logoPos: "left",
    picType: "219",
    picPos: "left",
    showSeparator: true,
    textSize: 52,
    letterSpacing: 0.00,
    textAlign: "left"
  },
  {
    category: "Ticketing",
    name: "Tickets",
    text: "Tickets",
    theme: "white",
    arrowDir: "E",
    arrowPos: "right",
    logoType: "none",
    logoPos: "left",
    picType: "219",
    picPos: "left",
    showSeparator: true,
    textSize: 52,
    letterSpacing: 0.00,
    textAlign: "left"
  },
  // 8. Emergency & Restrictions
  {
    category: "Emergency & Restrictions",
    name: "First aid",
    text: "First aid",
    theme: "green",
    arrowDir: "none",
    arrowPos: "none",
    logoType: "none",
    logoPos: "left",
    picType: "firstaid",
    picPos: "left",
    showSeparator: true,
    textSize: 52,
    letterSpacing: 0.00,
    textAlign: "left"
  },
  {
    category: "Emergency & Restrictions",
    name: "Fire exit",
    text: "Fire exit",
    theme: "green",
    arrowDir: "NW",
    arrowPos: "left",
    logoType: "none",
    logoPos: "left",
    picType: "none",
    picPos: "left",
    showSeparator: false,
    textSize: 52,
    letterSpacing: 0.00,
    textAlign: "left"
  },
  {
    category: "Emergency & Restrictions",
    name: "No entry",
    text: "No entry",
    theme: "red",
    arrowDir: "none",
    arrowPos: "none",
    logoType: "none",
    logoPos: "left",
    picType: "none",
    picPos: "left",
    showSeparator: false,
    textSize: 52,
    letterSpacing: 0.00,
    textAlign: "center"
  },
  {
    category: "Emergency & Restrictions",
    name: "No smoking",
    text: "No smoking",
    theme: "red",
    arrowDir: "none",
    arrowPos: "none",
    logoType: "none",
    logoPos: "left",
    picType: "none",
    picPos: "left",
    showSeparator: false,
    textSize: 52,
    letterSpacing: 0.00,
    textAlign: "center"
  },
  {
    category: "Emergency & Restrictions",
    name: "Private",
    text: "Private",
    theme: "black",
    arrowDir: "none",
    arrowPos: "none",
    logoType: "none",
    logoPos: "left",
    picType: "none",
    picPos: "left",
    showSeparator: false,
    textSize: 52,
    letterSpacing: 0.00,
    textAlign: "left"
  },
  {
    category: "Emergency & Restrictions",
    name: "Staff only",
    text: "Staff only",
    theme: "black",
    arrowDir: "none",
    arrowPos: "none",
    logoType: "none",
    logoPos: "left",
    picType: "none",
    picPos: "left",
    showSeparator: false,
    textSize: 52,
    letterSpacing: 0.00,
    textAlign: "left"
  }
];

const LOGO_TYPES = [
  { id: 'none', label: 'None' },
  { id: 'red-on-white', label: 'Red on white' },
  { id: 'white-reversed-on-red', label: 'White on red' },
  { id: 'red-ruled-red', label: 'Red on white, red border' },
  { id: 'red-ruled-black', label: 'Red on white, black border' },
  { id: 'custom-geometry', label: 'Custom Geometry' }
];

const COLOUR_STOPS_GEOMETRY = [
  { id: 'flame-red', name: 'Flame Red', value: '#FF3300' },
  { id: 'rail-blue', name: 'Rail Blue', value: '#00a9cc' },
  { id: 'electric-teal', name: 'Electric Teal', value: '#007f99' },
  { id: 'rail-grey', name: 'Rail Grey', value: '#C0C2B5' },
  { id: 'white', name: 'White', value: '#FFFFFF' },
  { id: 'black', name: 'Black', value: '#000000' }
];

const estimateTextWidth = (text: string, fontSize: number, letterSpacingEm: number) => {
  let totalWidth = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    let w = 0.42; // default fallback
    
    // Proportional widths for standard alphanumeric chars in Rail Alphabet style (medium bold):
    if (char === ' ') {
      w = 0.28;
    } else if (/[Iil1]/.test(char)) {
      w = 0.14;
    } else if (/[fjrt]/.test(char)) {
      w = 0.26;
    } else if (/[cs]/.test(char)) {
      w = 0.38;
    } else if (/[mw]/.test(char)) {
      w = 0.56;
    } else if (/[MW]/.test(char)) {
      w = 0.60;
    } else if (/[EFJL]/.test(char)) {
      w = 0.44;
    } else if (/[AGOQ]/.test(char)) {
      w = 0.52;
    } else if (/[A-Z]/.test(char)) {
      w = 0.48;
    } else if (/[0-9]/.test(char)) {
      w = 0.42;
    } else if (/[abcdeghkmnopqrsuvwxyz]/.test(char)) {
      w = 0.42;
    } else {
      w = 0.40;
    }
    
    totalWidth += w * fontSize;
    if (i < text.length - 1) {
      totalWidth += letterSpacingEm * fontSize;
    }
  }
  return totalWidth;
};

export default function RailAlphabetTypewriter() {
  const [typedText, setTypedText] = useState('Way out');
  const [boardTheme, setBoardTheme] = useState<'white' | 'green' | 'red' | 'black'>('white');
  const [direction, setDirection] = useState<string>('E'); 
  const [arrowPosition, setArrowPosition] = useState<'left' | 'right' | 'none'>('right');
  const [arrowColor, setArrowColor] = useState<'teal' | 'black'>('teal'); 
  const [logoType, setLogoType] = useState<string>('none');
  const [logoPosition, setLogoPosition] = useState<'left' | 'right'>('left');
  const [picType, setPicType] = useState<string>('exit');
  const [picPosition, setPicPosition] = useState<'left' | 'right'>('left');
  const [showSeparator, setShowSeparator] = useState<boolean>(true);
  
  const [letterSpacing, setLetterSpacing] = useState<number>(0.00); 
  const [textSize, setTextSize] = useState<number>(52);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('right');
  const [selectedPresetName, setSelectedPresetName] = useState<string>('Way out');
  const [lastPresetInfo, setLastPresetInfo] = useState<{ name: string; category: string }>({
    name: 'Way out',
    category: 'Trains & Wayfinding'
  });

  const [isCustomLayoutOpen, setIsCustomLayoutOpen] = useState(false);

  const [isMobile, setIsMobile] = useState<boolean>(typeof window !== 'undefined' && window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Plank Margin, Padding, Offset, and Size controls for Pictograms, Arrows, and Text (Developer Tuning)
  const [plankPicLeft, setPlankPicLeft] = useState<number>(11.5);
  const [plankPicRight, setPlankPicRight] = useState<number>(11.5);
  const [plankPicY, setPlankPicY] = useState<number>(11.5); // vertical/top-bot offset
  const [plankPicSize, setPlankPicSize] = useState<number>(16.12);

  const [plankArrowLeft, setPlankArrowLeft] = useState<number>(12);
  const [plankArrowRight, setPlankArrowRight] = useState<number>(12);
  const [plankArrowY, setPlankArrowY] = useState<number>(11.5); // vertical/top-bot offset
  const [plankArrowSize, setPlankArrowSize] = useState<number>(18.5);

  const [plankTextLeft, setPlankTextLeft] = useState<number>(28); // L padding when alone
  const [plankTextRight, setPlankTextRight] = useState<number>(28); // R padding when alone
  const [plankTextWithElementLeft, setPlankTextWithElementLeft] = useState<number>(27); // L margin when shared
  const [plankTextWithElementRight, setPlankTextWithElementRight] = useState<number>(27); // R margin when shared
  const [plankTextWithBothLeft, setPlankTextWithBothLeft] = useState<number>(27); // L margin when both pic & arrow present
  const [plankTextWithBothRight, setPlankTextWithBothRight] = useState<number>(27); // R margin when both pic & arrow present
  const [plankTextWithPicLeft, setPlankTextWithPicLeft] = useState<number>(28); // L margin when pic only
  const [plankTextWithPicRight, setPlankTextWithPicRight] = useState<number>(28); // R margin when pic only
  const [plankTextYFirstLine, setPlankTextYFirstLine] = useState<number>(12); // vertical coordinate for first line
  const [plankTextYSecondLine, setPlankTextYSecondLine] = useState<number>(12); // vertical coordinate for second line
  const [plankTextSize, setPlankTextSize] = useState<number>(17.1);

  // Double Arrow Symbol (DAS) custom tuning states
  const [dasBaseSize, setDasBaseSize] = useState<number>(18.5);
  const [dasRedOnWhiteScale, setDasRedOnWhiteScale] = useState<number>(1.3);
  const [dasSpacingMultiplier, setDasSpacingMultiplier] = useState<number>(0.48);
  const [dasRightSpacingOffset, setDasRightSpacingOffset] = useState<number>(16.0);
  const [dasRightPadding, setDasRightPadding] = useState<number>(9.0);
  const [dasLeftSpacingOffset, setDasLeftSpacingOffset] = useState<number>(2.5);
  const [dasLeftPadding, setDasLeftPadding] = useState<number>(5.0);
  const [dasVerticalOffset, setDasVerticalOffset] = useState<number>(0.0);

  // Smoothly animated plank width based on 7-tile (168) or 8-tile (192) rule
  const hasArrowOrPic = arrowPosition !== 'none' || picType !== 'none';
  const computedTargetW = hasArrowOrPic ? 192 : 168; // 7-tile or 8-tile long, DAS does not change this
  const targetW = computedTargetW;

  // Smoothly animated DAS states matching the fluid transitions of the plank width
  const fsForDas = plankTextSize * (textSize / 52);
  const currentDasSpacing = dasSpacingMultiplier * fsForDas;

  const targetDasSize = dasBaseSize;
  const targetDasSpacingLeft = currentDasSpacing + dasLeftSpacingOffset;
  const targetDasSpacingRight = currentDasSpacing + dasRightSpacingOffset;
  const targetDasLeftPadding = dasLeftPadding;
  const targetDasRightPadding = dasRightPadding;
  const targetDasVerticalOffset = dasVerticalOffset;
  const targetLogoScale = logoType === 'none' ? 0.0 : 1.0;

  const [smoothDasSize, setSmoothDasSize] = useState(targetDasSize);
  const [smoothDasSpacingLeft, setSmoothDasSpacingLeft] = useState(targetDasSpacingLeft);
  const [smoothDasSpacingRight, setSmoothDasSpacingRight] = useState(targetDasSpacingRight);
  const [smoothDasLeftPadding, setSmoothDasLeftPadding] = useState(targetDasLeftPadding);
  const [smoothDasRightPadding, setSmoothDasRightPadding] = useState(targetDasRightPadding);
  const [smoothDasVerticalOffset, setSmoothDasVerticalOffset] = useState(targetDasVerticalOffset);
  const [smoothLogoScale, setSmoothLogoScale] = useState(targetLogoScale);

  const [smoothW, setSmoothW] = useState(targetW);
  const smoothWRef = useRef(targetW);

  useEffect(() => {
    smoothWRef.current = smoothW;
  }, [smoothW]);

  // Unified high-performance animation manager for smooth transitions in perfect sync
  useEffect(() => {
    let animationFrameId: number;
    const startTime = performance.now();
    const duration = 280; // Smooth 280ms duration transitions for premium fluidity

    // Capture starting frame state snapshots
    const startValue = smoothWRef.current;
    const startDasSize = smoothDasSize;
    const startSpacingLeft = smoothDasSpacingLeft;
    const startSpacingRight = smoothDasSpacingRight;
    const startLeftPadding = smoothDasLeftPadding;
    const startRightPadding = smoothDasRightPadding;
    const startVerticalOffset = smoothDasVerticalOffset;
    const startLogoScale = smoothLogoScale;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      if (elapsed >= duration) {
        smoothWRef.current = targetW;
        setSmoothW(targetW);
        setSmoothDasSize(targetDasSize);
        setSmoothDasSpacingLeft(targetDasSpacingLeft);
        setSmoothDasSpacingRight(targetDasSpacingRight);
        setSmoothDasLeftPadding(targetDasLeftPadding);
        setSmoothDasRightPadding(targetDasRightPadding);
        setSmoothDasVerticalOffset(targetDasVerticalOffset);
        setSmoothLogoScale(targetLogoScale);
      } else {
        const progress = elapsed / duration;
        // Cubic easing out for ultra-smooth easing
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        
        const currentValue = startValue + (targetW - startValue) * easeOutCubic;
        smoothWRef.current = currentValue;
        setSmoothW(currentValue);

        setSmoothDasSize(startDasSize + (targetDasSize - startDasSize) * easeOutCubic);
        setSmoothDasSpacingLeft(startSpacingLeft + (targetDasSpacingLeft - startSpacingLeft) * easeOutCubic);
        setSmoothDasSpacingRight(startSpacingRight + (targetDasSpacingRight - startSpacingRight) * easeOutCubic);
        setSmoothDasLeftPadding(startLeftPadding + (targetDasLeftPadding - startLeftPadding) * easeOutCubic);
        setSmoothDasRightPadding(startRightPadding + (targetDasRightPadding - startRightPadding) * easeOutCubic);
        setSmoothDasVerticalOffset(startVerticalOffset + (targetDasVerticalOffset - startVerticalOffset) * easeOutCubic);
        setSmoothLogoScale(startLogoScale + (targetLogoScale - startLogoScale) * easeOutCubic);

        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [
    targetW,
    targetDasSize,
    targetDasSpacingLeft,
    targetDasSpacingRight,
    targetDasLeftPadding,
    targetDasRightPadding,
    targetDasVerticalOffset,
    targetLogoScale
  ]);

  // Helper to adjust DAS sizing and spacing presets atomically when logoType or logoPosition changes
  const updateDasPresets = (type: string, position: 'left' | 'right', paramsOverride?: typeof customDasParams) => {
    if (type === 'red-on-white') {
      setDasBaseSize(18.5);
      setDasSpacingMultiplier(0.48);
      setDasRedOnWhiteScale(1.3);
      setDasVerticalOffset(0.0);
      if (position === 'right') {
        setDasRightSpacingOffset(16.0);
        setDasRightPadding(9.0);
      } else {
        setDasLeftSpacingOffset(2.5);
        setDasLeftPadding(5.0);
      }
    } else if (type === 'custom-geometry') {
      const activeParams = paramsOverride !== undefined ? paramsOverride : customDasParams;
      const backIndex = activeParams?.backgroundColourIndex ?? 4;
      const bgVal = COLOUR_STOPS_GEOMETRY[backIndex]?.value ?? "#FFFFFF";
      const isWhiteBg = bgVal.toLowerCase() === '#ffffff';

      if (isWhiteBg) {
        setDasBaseSize(18.5);
        setDasSpacingMultiplier(0.48);
        setDasRedOnWhiteScale(1.3);
        setDasVerticalOffset(0.0);
        if (position === 'right') {
          setDasRightSpacingOffset(16.0);
          setDasRightPadding(9.0);
        } else {
          setDasLeftSpacingOffset(2.5);
          setDasLeftPadding(5.0);
        }
      } else {
        setDasBaseSize(18.0);
        setDasSpacingMultiplier(0.48);
        setDasRedOnWhiteScale(1.0);
        setDasVerticalOffset(0.0);
        if (position === 'right') {
          setDasRightSpacingOffset(20.5);
          setDasRightPadding(13.0);
        } else {
          setDasLeftSpacingOffset(7.5);
          setDasLeftPadding(5.0);
        }
      }
    } else if (type !== 'none') {
      setDasBaseSize(18.0);
      setDasSpacingMultiplier(0.48);
      setDasVerticalOffset(0.4);
      if (position === 'right') {
        setDasRightSpacingOffset(20.5);
        setDasRightPadding(13.0);
      } else {
        setDasLeftSpacingOffset(7.5);
        setDasLeftPadding(5.0);
      }
    }
  };

  // Dynamic Spacing / Carousel Developer controls with smart responsive default states:
  const [cardWidth, setCardWidth] = useState<number>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      return Math.max(280, window.innerWidth - 80);
    }
    return 360;
  });
  const [containerPadding, setContainerPadding] = useState<number>(57);
  const [chevronOffset, setChevronOffset] = useState<number>(16);

  const [miniChevronOffset, setMiniChevronOffset] = useState<number>(18);
  const [arrowCarouselWidth, setArrowCarouselWidth] = useState<number>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      return Math.max(210, window.innerWidth - 150);
    }
    return 290;
  });
  const [picCarouselWidth, setPicCarouselWidth] = useState<number>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      return Math.max(210, window.innerWidth - 150);
    }
    return 290;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => {
      if (window.innerWidth < 640) {
        const widthVal = Math.max(280, window.innerWidth - 80);
        setCardWidth(widthVal);
        setArrowCarouselWidth(Math.max(210, window.innerWidth - 150));
        setPicCarouselWidth(Math.max(210, window.innerWidth - 150));
      } else {
        setCardWidth(360);
        setArrowCarouselWidth(290);
        setPicCarouselWidth(290);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Signage reset button position controls
  const [signageResetTop, setSignageResetTop] = useState<number>(12);
  const [signageResetRight, setSignageResetRight] = useState<number>(12);



  // Custom DAS Parameters loaded dynamically in real-time from the Geometry applet
  const [customDasParams, setCustomDasParams] = useState<{
    strokeWidth: number;
    gapOffset: number;
    foregroundColourIndex: number;
    backgroundColourIndex: number;
    taperAngle: number;
  } | null>(() => {
    try {
      const data = localStorage.getItem('rail-alphabet-custom-das-geometry');
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  useEffect(() => {
    const handleUpdate = () => {
      try {
        const data = localStorage.getItem('rail-alphabet-custom-das-geometry');
        if (data) {
          const parsed = JSON.parse(data);
          setCustomDasParams(parsed);
          if (logoType === 'custom-geometry') {
            updateDasPresets('custom-geometry', logoPosition, parsed);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener('custom-das-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('custom-das-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [logoType, logoPosition]);





  // Ref declarations:

  const carouselRef = useRef<HTMLDivElement>(null);
  const arrowCarouselRef = useRef<HTMLDivElement>(null);
  const picCarouselRef = useRef<HTMLDivElement>(null);

  const scrollArrowCarousel = (dir: 'left' | 'right') => {
    if (arrowCarouselRef.current) {
      arrowCarouselRef.current.scrollBy({
        left: dir === 'left' ? -88 : 88,
        behavior: 'smooth'
      });
    }
  };

  const scrollPicCarousel = (dir: 'left' | 'right') => {
    if (picCarouselRef.current) {
      picCarouselRef.current.scrollBy({
        left: dir === 'left' ? -88 : 88,
        behavior: 'smooth'
      });
    }
  };

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const exportPresetsToCSV = () => {
    const headers = [
      "Category",
      "Name",
      "Text",
      "Theme",
      "ArrowDirection",
      "ArrowPosition",
      "LogoType",
      "LogoPosition",
      "PictogramType",
      "PictogramPosition",
      "ShowSeparator",
      "TextSize",
      "LetterSpacing",
      "TextAlign"
    ];
    
    const category = lastPresetInfo.category || "General";
    const presetName = lastPresetInfo.name;

    const rows = [
      [
        category,
        presetName,
        typedText,
        boardTheme,
        direction,
        arrowPosition,
        logoType,
        logoPosition,
        picType,
        picPosition,
        showSeparator ? "true" : "false",
        textSize.toString(),
        letterSpacing.toString(),
        textAlign
      ]
    ];
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(","))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    const safeName = presetName.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `rail_alphabet_${safeName || 'custom'}_design.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const filteredVal = rawVal.split('').filter(char => {
      const code = char.charCodeAt(0);
      return (code === 32) || 
             (code >= 33 && code <= 126) || 
             (code >= 161 && code <= 191) || 
             (code === 215) || 
             (code === 223) || 
             (code === 247);
    }).join('');
    setTypedText(filteredVal);
    setSelectedPresetName('custom');
  };

  const handleReset = () => {
    setTypedText('Way out');
    setBoardTheme('white');
    setDirection('E');
    setArrowPosition('right');
    setArrowColor('teal');
    setLogoType('none');
    setLogoPosition('left');
    updateDasPresets('none', 'left');
    setPicType('exit');
    setPicPosition('left');
    setShowSeparator(true);
    setLetterSpacing(0.00);
    setTextSize(52);
    setTextAlign('right');
    setSelectedPresetName('Way out');
    setLastPresetInfo({
      name: 'Way out',
      category: 'Trains & Wayfinding'
    });
    setSignageResetTop(12);
    setSignageResetRight(12);
  };

  const handleDownloadCSV = () => {
    const headers = [
      "Category", "Name", "Text", "Theme", "ArrowDirection", "ArrowPosition", "ArrowColor",
      "LogoType", "LogoPosition", "PictogramType", "PictogramPosition",
      "ShowSeparator", "TextSize", "LetterSpacing", "TextAlign"
    ];

    const escapeCSV = (str: string) => {
      if (typeof str !== 'string') return str;
      const escaped = str.replace(/"/g, '""');
      return `"${escaped}"`;
    };

    const row = [
      escapeCSV(lastPresetInfo.category || "Custom"),
      escapeCSV(lastPresetInfo.name || "Custom"),
      escapeCSV(typedText),
      escapeCSV(boardTheme),
      escapeCSV(direction),
      escapeCSV(arrowPosition),
      escapeCSV(arrowColor),
      escapeCSV(logoType),
      escapeCSV(logoPosition),
      escapeCSV(picType),
      escapeCSV(picPosition),
      escapeCSV(showSeparator ? "true" : "false"),
      escapeCSV(textSize.toString()),
      escapeCSV(letterSpacing.toString()),
      escapeCSV(textAlign)
    ];

    const csvContent = [headers.join(','), row.join(',')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `sign_parameters_${(lastPresetInfo.name || "custom").toLowerCase().replace(/[^a-z0-9]+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const loadPreset = (preset: typeof PRESETS[number]) => {
    setTypedText(preset.text);
    setBoardTheme(preset.theme as 'white' | 'green' | 'red' | 'black');
    if (preset.arrowDir === 'none') {
      setArrowPosition('none');
    } else {
      setDirection(preset.arrowDir);
      setArrowPosition(preset.arrowPos as 'left' | 'right' | 'none');
    }
    setLogoType(preset.logoType);
    setLogoPosition(preset.logoPos as 'left' | 'right');
    updateDasPresets(preset.logoType, preset.logoPos as 'left' | 'right');
    setPicType(preset.picType);
    setPicPosition(preset.picPos as 'left' | 'right');
    setShowSeparator(preset.showSeparator);
    setTextSize(preset.textSize);
    setLetterSpacing(preset.letterSpacing);
    setTextAlign(preset.textAlign as 'left' | 'center' | 'right');
    setSelectedPresetName(preset.name);
    setLastPresetInfo({
      name: preset.name,
      category: preset.category || 'General'
    });
  };

  const toSentenceCase = (str: string) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const getThemeData = () => {
    switch (boardTheme) {
      case 'green':
        return {
          bgClass: 'bg-[#00994c]',
          borderClass: 'border-[#005c36]',
          textColorHex: '#FFFFFF',
          picColor: '#FFFFFF',
          isDarkTheme: true
        };
      case 'red':
        return {
          bgClass: 'bg-[#FF3300]',
          borderClass: 'border-[#9c0010]',
          textColorHex: '#FFFFFF',
          picColor: '#FFFFFF',
          isDarkTheme: true
        };
      case 'black':
        return {
          bgClass: 'bg-[#111111]',
          borderClass: 'border-black',
          textColorHex: '#FFFFFF',
          picColor: '#FFFFFF',
          isDarkTheme: true
        };
      case 'white':
      default:
        return {
          bgClass: 'bg-white',
          borderClass: 'border-slate-300 shadow-[0_4px_12px_rgba(0,0,0,0.05)]',
          textColorHex: '#000000',
          picColor: '#000000',
          isDarkTheme: false
        };
    }
  };

  const selectArrowPosition = (pos: 'left' | 'right' | 'none') => {
    setArrowPosition(pos);
    setSelectedPresetName('custom');
  };

  const selectDirection = (dirStr: string) => {
    setDirection(dirStr);
    setSelectedPresetName('custom');
  };

  const getPlankLines = (text: string): string[] => {
    if (!text) return ['Way out'];
    if (text.length <= 14) {
      return [text];
    }
    const words = text.split(/\s+/);
    if (words.length === 1) {
      const mid = Math.ceil(text.length / 2);
      return [text.slice(0, mid), text.slice(mid)];
    }
    let bestDiff = Infinity;
    let bestSplit = Math.ceil(words.length / 2);
    for (let i = 1; i < words.length; i++) {
      const l1 = words.slice(0, i).join(' ');
      const l2 = words.slice(i).join(' ');
      const diff = Math.abs(l1.length - l2.length);
      if (diff < bestDiff) {
        bestDiff = diff;
        bestSplit = i;
      }
    }
    return [words.slice(0, bestSplit).join(' '), words.slice(bestSplit).join(' ')];
  };

  const renderPlankSvg = (textLine: string, isSecondPlank: boolean) => {
    const W = smoothW; // Use smoothly animated plank width to prevent zoom jumping and enable gorgeous end gliding

    const isLeftArrow = arrowPosition === 'left';
    const isRightArrow = arrowPosition === 'right';
    const isLeftPic = picType !== 'none' && picPosition === 'left';
    const isRightPic = picType !== 'none' && picPosition === 'right';
    const isLeftLogo = logoPosition === 'left' && (logoType !== 'none' || smoothLogoScale > 0.005);
    const isRightLogo = logoPosition === 'right' && (logoType !== 'none' || smoothLogoScale > 0.005);

    const fs = plankTextSize * (textSize / 52);
    const spaceWidth = 0.35 * fs;
    const dasSpacing = dasSpacingMultiplier * fs; // customizable spacing width ('o' width default)
    
    const activeDasSize = smoothDasSize * smoothLogoScale;
    const plateWidth = activeDasSize * 1.6;
    const plateHeight = activeDasSize * 1.05;

    const activeDasSpacingRight = smoothDasSpacingRight * smoothLogoScale;
    const activeDasRightPadding = smoothDasRightPadding * smoothLogoScale;

    const activeDasSpacingLeft = smoothDasSpacingLeft * smoothLogoScale;
    const activeDasLeftPadding = smoothDasLeftPadding * smoothLogoScale;

    // 1. Calculate boundaries where text is allowed
    const hasLeftElement = isLeftPic || isLeftArrow || isLeftLogo;
    let baseTextBoundLeft = plankTextLeft;
    if (hasLeftElement) {
      let leftElementPresenceFactor = 0;
      if (isLeftPic || isLeftArrow) {
        leftElementPresenceFactor = 1.0;
      } else if (isLeftLogo) {
        leftElementPresenceFactor = smoothLogoScale;
      }
      baseTextBoundLeft = plankTextLeft + (plankTextWithElementLeft - plankTextLeft) * leftElementPresenceFactor;
    }
    let textBoundLeft = baseTextBoundLeft;

    const picBoundaryLeft = isLeftPic 
      ? (showSeparator ? (plankPicLeft * 2) : (plankPicLeft + (plankPicSize / 2)))
      : 0;

    let spaceNeededLeft = 0;
    if (isLeftPic) {
      spaceNeededLeft = picBoundaryLeft + 6.0;
    }
    if (isLeftArrow) {
      if (isLeftPic) {
        spaceNeededLeft = picBoundaryLeft + plankArrowLeft + (plankArrowSize / 2) + 6.0;
      } else {
        spaceNeededLeft = Math.max(spaceNeededLeft, plankArrowLeft + (plankArrowSize / 2) + 6.0);
      }
    }

    // Logo Minimum Left Edge (outermost boundary where logo's left edge can be situated)
    let logoMinLeftEdge = activeDasLeftPadding;
    if (isLeftPic) {
      if (showSeparator) {
        logoMinLeftEdge = (plankPicLeft * 2) + activeDasLeftPadding;
      } else {
        logoMinLeftEdge = plankPicLeft + (plankPicSize / 2) + activeDasLeftPadding;
      }
    }
    if (isLeftArrow) {
      if (isLeftPic) {
        logoMinLeftEdge = Math.max(logoMinLeftEdge, picBoundaryLeft + plankArrowLeft + (plankArrowSize / 2) + activeDasLeftPadding);
      } else {
        logoMinLeftEdge = Math.max(logoMinLeftEdge, plankArrowLeft + (plankArrowSize / 2) + activeDasLeftPadding);
      }
    }

    if (isLeftLogo) {
      const spaceForLogo = logoMinLeftEdge + plateWidth + activeDasSpacingLeft;
      spaceNeededLeft = Math.max(spaceNeededLeft, spaceForLogo);
    }
    if (spaceNeededLeft > 0) {
      textBoundLeft = Math.max(baseTextBoundLeft, spaceNeededLeft);
    }

    const hasRightElement = isRightPic || isRightArrow || isRightLogo;
    let baseTextBoundRight = W - plankTextRight;
    if (hasRightElement) {
      let rightElementPresenceFactor = 0;
      if (isRightPic || isRightArrow) {
        rightElementPresenceFactor = 1.0;
      } else if (isRightLogo) {
        rightElementPresenceFactor = smoothLogoScale;
      }
      baseTextBoundRight = (W - plankTextRight) - (plankTextWithElementRight - plankTextRight) * rightElementPresenceFactor;
    }
    let textBoundRight = baseTextBoundRight;

    const picBoundaryRight = isRightPic
      ? (showSeparator ? (plankPicRight * 2) : (plankPicRight + (plankPicSize / 2)))
      : 0;

    let spaceNeededRight = 0;
    if (isRightPic) {
      spaceNeededRight = picBoundaryRight + 6.0;
    }
    if (isRightArrow) {
      if (isRightPic) {
        spaceNeededRight = picBoundaryRight + plankArrowRight + (plankArrowSize / 2) + 6.0;
      } else {
        spaceNeededRight = Math.max(spaceNeededRight, plankArrowRight + (plankArrowSize / 2) + 6.0);
      }
    }

    // Logo Maximum Right Edge (outermost boundary where logo's right edge can be situated)
    let logoMaxRightEdge = W - activeDasRightPadding;
    if (isRightPic) {
      if (showSeparator) {
        logoMaxRightEdge = W - (plankPicRight * 2) - activeDasRightPadding;
      } else {
        logoMaxRightEdge = W - plankPicRight - (plankPicSize / 2) - activeDasRightPadding;
      }
    }
    if (isRightArrow) {
      if (isRightPic) {
        logoMaxRightEdge = Math.min(logoMaxRightEdge, W - picBoundaryRight - plankArrowRight - (plankArrowSize / 2) - activeDasRightPadding);
      } else {
        logoMaxRightEdge = Math.min(logoMaxRightEdge, W - plankArrowRight - (plankArrowSize / 2) - activeDasRightPadding);
      }
    }

    if (isRightLogo) {
      const spaceForLogo = W - (logoMaxRightEdge - plateWidth - activeDasSpacingRight);
      spaceNeededRight = Math.max(spaceNeededRight, spaceForLogo);
    }
    if (spaceNeededRight > 0) {
      textBoundRight = Math.min(baseTextBoundRight, W - spaceNeededRight);
    }

    // 2. Measure actual text width & exact position
    const textWidth = estimateTextWidth(toSentenceCase(textLine), fs, letterSpacing);
    
    let textLeftEdge = 0;
    let textRightEdge = 0;
    let textX = 0;
    let textAnchor = "start";

    if (textAlign === 'left') {
      textLeftEdge = textBoundLeft;
      textRightEdge = textBoundLeft + textWidth;
      textX = textLeftEdge;
      textAnchor = "start";
    } else if (textAlign === 'right') {
      textRightEdge = textBoundRight;
      textLeftEdge = textBoundRight - textWidth;
      textX = textRightEdge;
      textAnchor = "end";
    } else {
      const ctr = (textBoundLeft + textBoundRight) / 2;
      textLeftEdge = ctr - textWidth / 2;
      textRightEdge = ctr + textWidth / 2;
      textX = ctr;
      textAnchor = "middle";
    }

    // 3. Position the double arrow symbol (DAS) plates
    let finalLeftLogoX = 0;
    if (isLeftLogo) {
      const targetCenter = textLeftEdge - activeDasSpacingLeft - (plateWidth / 2);
      finalLeftLogoX = Math.max(targetCenter, logoMinLeftEdge + (plateWidth / 2));
    }

    let finalRightLogoX = 0;
    if (isRightLogo) {
      const targetCenter = textRightEdge + activeDasSpacingRight + (plateWidth / 2);
      finalRightLogoX = Math.min(targetCenter, logoMaxRightEdge - (plateWidth / 2));
    }

    // Other element positions
    const finalLeftPicX = plankPicLeft;
    const finalRightPicX = W - plankPicRight;
    let finalLeftArrowOrLogoX = plankArrowLeft;
    if (isLeftPic && isLeftArrow) {
      finalLeftArrowOrLogoX = picBoundaryLeft + plankArrowLeft;
    }
    const minSafeLeft = (plankArrowSize / 2) + 2.5;
    if (finalLeftArrowOrLogoX < minSafeLeft) {
      finalLeftArrowOrLogoX = minSafeLeft;
    }

    let finalRightArrowOrLogoX = W - plankArrowRight;
    if (isRightPic && isRightArrow) {
      finalRightArrowOrLogoX = W - picBoundaryRight - plankArrowRight;
    }
    const maxSafeRight = W - (plankArrowSize / 2) - 2.5;
    if (finalRightArrowOrLogoX > maxSafeRight) {
      finalRightArrowOrLogoX = maxSafeRight;
    }

    let plankBg = "#FFFFFF";
    let borderStroke = "#000000";
    let contentColor = "#000000";
    let activeArrowColor = arrowColor === 'teal' ? '#007f99' : '#000000';

    if (boardTheme === 'green') {
      plankBg = "#00994c";
      borderStroke = "#005c36";
      contentColor = "#FFFFFF";
      activeArrowColor = "#FFFFFF";
    } else if (boardTheme === 'red') {
      plankBg = "#FF3300";
      borderStroke = "#9c0010";
      contentColor = "#FFFFFF";
      activeArrowColor = "#FFFFFF";
    } else if (boardTheme === 'black') {
      plankBg = "#111111";
      borderStroke = "#000000";
      contentColor = "#FFFFFF";
      activeArrowColor = "#FFFFFF";
    }

    const textY = isSecondPlank ? plankTextYSecondLine : plankTextYFirstLine;

    // Helper to draw the double arrow symbol plates with the correct visual styles
    const renderDasLogo = (cx: number, cy: number, size: number, key: string) => {
      const activeSize = logoType === 'custom-geometry' ? size * 0.95 : size;
      const pW = activeSize * 1.6;
      const pH = activeSize * 1.05;
      const px = cx - pW / 2;
      const py = cy - pH / 2;
      const textFontSize = activeSize * 0.72;
      
      let bgFill = "#FFFFFF";
      let strokeColor = "none";
      let textFill = "#FF3300";
      
      if (logoType === 'white-reversed-on-red') {
        bgFill = "#FF3300";
        textFill = "#FFFFFF";
      } else if (logoType === 'red-ruled-red') {
        bgFill = "#FFFFFF";
        strokeColor = "#FF3300";
        textFill = "#FF3300";
      } else if (logoType === 'red-ruled-black') {
        bgFill = "#FFFFFF";
        strokeColor = "#000000";
        textFill = "#FF3300";
      } else if (logoType === 'red-on-white') {
        bgFill = "transparent";
        textFill = "#FF3300";
      } else if (logoType === 'custom-geometry') {
        const foreIndex = customDasParams?.foregroundColourIndex ?? 0;
        const backIndex = customDasParams?.backgroundColourIndex ?? 4;
        textFill = COLOUR_STOPS_GEOMETRY[foreIndex]?.value ?? "#FF3300";
        bgFill = COLOUR_STOPS_GEOMETRY[backIndex]?.value ?? "#FFFFFF";
        if (bgFill.toLowerCase() === '#ffffff') {
          bgFill = "transparent";
          strokeColor = "none";
        }
      } else {
        return null;
      }
      
      if (logoType === 'custom-geometry') {
        const sw = customDasParams?.strokeWidth ?? 13;
        const go = customDasParams?.gapOffset ?? 15.5;
        const ta = customDasParams?.taperAngle ?? 2.3;

        const y_top_track_center = 25.5;
        const y_bottom_track_center = 53.5;

        const y_top_track_top = y_top_track_center - sw / 2;
        const y_top_track_bottom = y_top_track_center + sw / 2;
        const y_bottom_track_top = y_bottom_track_center - sw / 2;
        const y_bottom_track_bottom = y_bottom_track_center + sw / 2;

        const X_left_bend = 65 - go;
        const X_right_bend = 65 + go;

        const tip_center_top = X_right_bend - 2.645 * go;
        const tip_center_bottom = X_left_bend + 2.645 * go;

        const arm_dx_top = tip_center_top - X_right_bend;
        const arm_dy_top = 0 - y_top_track_top;
        const arm_len_top = Math.sqrt(arm_dx_top * arm_dx_top + arm_dy_top * arm_dy_top);

        const arm_dx_bottom = tip_center_bottom - X_left_bend;
        const arm_dy_bottom = 78 - y_bottom_track_bottom;
        const arm_len_bottom = Math.sqrt(arm_dx_bottom * arm_dx_bottom + arm_dy_bottom * arm_dy_bottom);

        const crossover_L = 2 * go;
        const crossover_H = Math.max(1, y_bottom_track_top - y_top_track_bottom);
        const multiplier_crossover = Math.sqrt(crossover_H * crossover_H + crossover_L * crossover_L) / crossover_H;
        const multiplier_crossover_default = 2.29589;
        const half_W_h_crossover = (sw * 13.5 / 13) * (multiplier_crossover / multiplier_crossover_default);

        const arm_L_top = 2.645 * go;
        const arm_H_top = Math.max(1, y_top_track_top);
        const multiplier_arm_top = Math.sqrt(arm_H_top * arm_H_top + arm_L_top * arm_L_top) / arm_H_top;
        const multiplier_arm_top_default = 2.3782;
        const half_W_h_arm_top = (sw * 13.5 / 13) * (multiplier_arm_top / multiplier_arm_top_default);

        const arm_L_bottom = 2.645 * go;
        const arm_H_bottom = Math.max(1, 78 - y_bottom_track_bottom);
        const multiplier_arm_bottom = Math.sqrt(arm_H_bottom * arm_H_bottom + arm_L_bottom * arm_L_bottom) / arm_H_bottom;
        const multiplier_arm_bottom_default = 2.4875;
        const half_W_h_arm_bottom = (sw * 13.5 / 13) * (multiplier_arm_bottom / multiplier_arm_bottom_default);

        const activeTaperWidth_top_base = (sw * 28 / 13) + (arm_len_top * Math.tan((ta * Math.PI) / 180) * 1.65);
        const activeTaperWidth_bottom_base = (sw * 27 / 13) + (arm_len_bottom * Math.tan((ta * Math.PI) / 180) * 2.22);

        const activeTaperWidth_top = activeTaperWidth_top_base * (multiplier_arm_top / multiplier_arm_top_default);
        const activeTaperWidth_bottom = activeTaperWidth_bottom_base * (multiplier_arm_bottom / multiplier_arm_bottom_default);

        return (
          <g key={key}>
            {strokeColor !== "none" ? (
              <rect
                x={px}
                y={py}
                width={pW}
                height={pH}
                fill={bgFill}
                stroke={strokeColor}
                strokeWidth="0.6"
              />
            ) : (
              bgFill !== "transparent" && bgFill !== "none" && (
                <rect
                  x={px}
                  y={py}
                  width={pW}
                  height={pH}
                  fill={bgFill}
                />
              )
            )}
            <svg
              x={px + pW * 0.1}
              y={py + pH * 0.12}
              width={pW * 0.8}
              height={pH * 0.76}
              viewBox="0 0 130 78"
            >
              <g>
                <polygon points={`0,${y_top_track_top} 130,${y_top_track_top} 130,${y_top_track_bottom} 0,${y_top_track_bottom}`} fill={textFill} />
                <polygon points={`0,${y_bottom_track_top} 130,${y_bottom_track_top} 130,${y_bottom_track_bottom} 0,${y_bottom_track_bottom}`} fill={textFill} />
                <polygon points={`${X_left_bend - half_W_h_crossover},${y_bottom_track_top + 0.35} ${X_right_bend - half_W_h_crossover},${y_top_track_bottom - 0.35} ${X_right_bend + half_W_h_crossover},${y_top_track_bottom - 0.35} ${X_left_bend + half_W_h_crossover},${y_bottom_track_top + 0.35}`} fill={textFill} />
                <polygon points={`${tip_center_top - activeTaperWidth_top / 2},0 ${tip_center_top + activeTaperWidth_top / 2},0 ${X_right_bend + half_W_h_arm_top},${y_top_track_top + 0.35} ${X_right_bend - half_W_h_arm_top},${y_top_track_top + 0.35}`} fill={textFill} />
                <polygon points={`${X_left_bend - half_W_h_arm_bottom},${y_bottom_track_bottom - 0.35} ${tip_center_bottom - activeTaperWidth_bottom / 2},78 ${tip_center_bottom + activeTaperWidth_bottom / 2},78 ${X_left_bend + half_W_h_arm_bottom},${y_bottom_track_bottom - 0.35}`} fill={textFill} />
              </g>
            </svg>
          </g>
        );
      }

      return (
        <g key={key}>
          {strokeColor !== "none" ? (
            <rect
              x={px}
              y={py}
              width={pW}
              height={pH}
              fill={bgFill}
              stroke={strokeColor}
              strokeWidth="0.6"
            />
          ) : (
            bgFill !== "transparent" && bgFill !== "none" && (
              <rect
                x={px}
                y={py}
                width={pW}
                height={pH}
                fill={bgFill}
              />
            )
          )}
          <text
            x={cx}
            y={cy}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={textFontSize}
            style={{
              fontFamily: "'Brsign', 'Geist', sans-serif",
              fontWeight: 'normal',
              fill: textFill
            }}
            className="select-none"
          >
            {String.fromCharCode(200)}
          </text>
        </g>
      );
    };

    return (
      <svg
        key={isSecondPlank ? "second" : "first"}
        viewBox={`0 0 ${W} 24`}
        className="w-full h-auto border-0 select-all"
        style={{
          aspectRatio: `${W} / 24`,
          backgroundColor: plankBg,
          color: contentColor,
        }}
      >
        <rect
          x="0.5"
          y="0.5"
          width={W - 1}
          height="23"
          fill="none"
          stroke={borderStroke}
          strokeWidth="0.5"
        />

        {isLeftPic && (
          <>
            <text
              x={finalLeftPicX}
              y={plankPicY}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={plankPicSize}
              style={{
                fontFamily: "'Brsign', 'Geist', sans-serif",
                fontWeight: 'normal',
                fill: contentColor
              }}
              className="select-none"
            >
              {String.fromCharCode(
                /^\d+$/.test(picType) ? parseInt(picType) : (GLYPH_MAP[picType] || 201)
              )}
            </text>
            {showSeparator && (
              <line
                x1={plankPicLeft * 2}
                y1="0.5"
                x2={plankPicLeft * 2}
                y2="23.5"
                stroke={borderStroke}
                strokeWidth="1"
              />
            )}
          </>
        )}

        {isRightPic && (
          <>
            <text
              x={finalRightPicX}
              y={plankPicY}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={plankPicSize}
              style={{
                fontFamily: "'Brsign', 'Geist', sans-serif",
                fontWeight: 'normal',
                fill: contentColor
              }}
              className="select-none"
            >
              {String.fromCharCode(
                /^\d+$/.test(picType) ? parseInt(picType) : (GLYPH_MAP[picType] || 201)
              )}
            </text>
            {showSeparator && (
              <line
                x1={W - plankPicRight * 2}
                y1="0.5"
                x2={W - plankPicRight * 2}
                y2="23.5"
                stroke={borderStroke}
                strokeWidth="1"
              />
            )}
          </>
        )}

        {isLeftLogo && renderDasLogo(finalLeftLogoX, plankArrowY + smoothDasVerticalOffset, activeDasSize, "left-das")}
        {isRightLogo && renderDasLogo(finalRightLogoX, plankArrowY + smoothDasVerticalOffset, activeDasSize, "right-das")}

        {isLeftArrow && (
          <text
            x={finalLeftArrowOrLogoX}
            y={plankArrowY}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={plankArrowSize}
            style={{
              fontFamily: "'Brsign', sans-serif",
              fontWeight: 'normal',
              fill: activeArrowColor
            }}
            className="select-none"
          >
            {String.fromCharCode(DIRECTION_CHAR_CODES[direction] || 194)}
          </text>
        )}

        {isRightArrow && (
          <text
            x={finalRightArrowOrLogoX}
            y={plankArrowY}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={plankArrowSize}
            style={{
              fontFamily: "'Brsign', sans-serif",
              fontWeight: 'normal',
              fill: activeArrowColor
            }}
            className="select-none"
          >
            {String.fromCharCode(DIRECTION_CHAR_CODES[direction] || 194)}
          </text>
        )}

        <text
          x={textX}
          y={textY}
          textAnchor={textAnchor}
          dominantBaseline="central"
          fontSize={plankTextSize * (textSize / 52)}
          style={{
            fontFamily: "'Brsign', 'Geist', sans-serif",
            fontWeight: 700,
            letterSpacing: `${letterSpacing}em`,
            fill: contentColor,
          }}
        >
          {toSentenceCase(textLine)}
        </text>
      </svg>
    );
  };

  const lines = getPlankLines(typedText);
  const { bgClass, borderClass } = getThemeData();

  const updateScrollButtons = () => {
    const el = carouselRef.current;
    if (el) {
      setCanScrollLeft(el.scrollLeft > 10);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
    }
  };

  const handleScroll = (dir: 'left' | 'right') => {
    const el = carouselRef.current;
    if (el) {
      const card = el.firstElementChild;
      const gap = window.innerWidth >= 640 ? 20 : 16;
      const scrollAmount = card ? card.getBoundingClientRect().width + gap : (cardWidth + gap);
      el.scrollBy({
        left: dir === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const el = carouselRef.current;
    if (el && isCustomLayoutOpen) {
      el.addEventListener('scroll', updateScrollButtons);
      const timer = setTimeout(() => {
        updateScrollButtons();
      }, 150);
      return () => {
        el.removeEventListener('scroll', updateScrollButtons);
        clearTimeout(timer);
      };
    }
  }, [isCustomLayoutOpen]);

  const downloadSignPNG = async () => {
    // Try to load the Brsign font and convert to base64 for embedding
    let base64Font = '';
    try {
      const response = await fetch(brsignFontUrl);
      const fontBlob = await response.blob();
      base64Font = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(fontBlob);
      });
    } catch (err) {
      console.error("Failed to load and embed font in SVG:", err);
    }

    const hasArrowOrPic = arrowPosition !== 'none' || picType !== 'none';
    const computedW = hasArrowOrPic ? 192 : 168; // 7-tile or 8-tile long, DAS does not change this
    const W = computedW;

    const totalLines = lines.length;
    const plankHeight = 24;
    const plankGapCount = totalLines - 1;
    const plankGapHeight = 0.5; // proportional gap in SVG units
    const H = totalLines * plankHeight + (plankGapCount > 0 ? plankGapCount * plankGapHeight : 0);

    let plankBg = "#FFFFFF";
    let borderStroke = "#000000";
    let contentColor = "#000000";
    let activeArrowColor = arrowColor === 'teal' ? '#007f99' : '#000000';

    if (boardTheme === 'green') {
      plankBg = "#00994c";
      borderStroke = "#005c36";
      contentColor = "#FFFFFF";
      activeArrowColor = "#FFFFFF";
    } else if (boardTheme === 'red') {
      plankBg = "#FF3300";
      borderStroke = "#9c0010";
      contentColor = "#FFFFFF";
      activeArrowColor = "#FFFFFF";
    } else if (boardTheme === 'black') {
      plankBg = "#111111";
      borderStroke = "#000000";
      contentColor = "#FFFFFF";
      activeArrowColor = "#FFFFFF";
    }

    const isLeftArrow = arrowPosition === 'left';
    const isRightArrow = arrowPosition === 'right';
    const isLeftPic = picType !== 'none' && picPosition === 'left';
    const isRightPic = picType !== 'none' && picPosition === 'right';
    const isLeftLogo = logoType !== 'none' && logoPosition === 'left';
    const isRightLogo = logoType !== 'none' && logoPosition === 'right';

    // Helper to generate a single plank's SVG group content
    const generatePlankGroup = (textLine: string, yOffset: number, isSecondLine: boolean) => {
      const fs = plankTextSize * (textSize / 52);
      const spaceWidth = 0.35 * fs;
      const dasSpacing = dasSpacingMultiplier * fs; // customizable spacing width ('o' width default)
      
      const activeDasSize = dasBaseSize;
      const plateWidth = activeDasSize * 1.6;
      const plateHeight = activeDasSize * 1.05;

      const activeDasSpacingRight = dasSpacing + dasRightSpacingOffset;
      const activeDasRightPadding = dasRightPadding;

      const activeDasSpacingLeft = dasSpacing + dasLeftSpacingOffset;
      const activeDasLeftPadding = dasLeftPadding;

      // 1. Calculate boundaries where text is allowed
      const hasLeftElement = isLeftPic || isLeftArrow || isLeftLogo;
      let baseTextBoundLeft = plankTextLeft;
      if (hasLeftElement) {
        baseTextBoundLeft = plankTextWithElementLeft;
      }
      let textBoundLeft = baseTextBoundLeft;

      const picBoundaryLeft = isLeftPic 
        ? (showSeparator ? (plankPicLeft * 2) : (plankPicLeft + (plankPicSize / 2)))
        : 0;

      let spaceNeededLeft = 0;
      if (isLeftPic) {
        spaceNeededLeft = picBoundaryLeft + 6.0;
      }
      if (isLeftArrow) {
        if (isLeftPic) {
          spaceNeededLeft = picBoundaryLeft + plankArrowLeft + (plankArrowSize / 2) + 6.0;
        } else {
          spaceNeededLeft = Math.max(spaceNeededLeft, plankArrowLeft + (plankArrowSize / 2) + 6.0);
        }
      }

      // Logo Minimum Left Edge (outermost boundary where logo's left edge can be situated)
      let logoMinLeftEdge = activeDasLeftPadding;
      if (isLeftPic) {
        if (showSeparator) {
          logoMinLeftEdge = (plankPicLeft * 2) + activeDasLeftPadding;
        } else {
          logoMinLeftEdge = plankPicLeft + (plankPicSize / 2) + activeDasLeftPadding;
        }
      }
      if (isLeftArrow) {
        if (isLeftPic) {
          logoMinLeftEdge = Math.max(logoMinLeftEdge, picBoundaryLeft + plankArrowLeft + (plankArrowSize / 2) + activeDasLeftPadding);
        } else {
          logoMinLeftEdge = Math.max(logoMinLeftEdge, plankArrowLeft + (plankArrowSize / 2) + activeDasLeftPadding);
        }
      }

      if (isLeftLogo) {
        const spaceForLogo = logoMinLeftEdge + plateWidth + activeDasSpacingLeft;
        spaceNeededLeft = Math.max(spaceNeededLeft, spaceForLogo);
      }
      if (spaceNeededLeft > 0) {
        textBoundLeft = Math.max(baseTextBoundLeft, spaceNeededLeft);
      }

      const hasRightElement = isRightPic || isRightArrow || isRightLogo;
      let baseTextBoundRight = W - plankTextRight;
      if (hasRightElement) {
        baseTextBoundRight = W - plankTextWithElementRight;
      }
      let textBoundRight = baseTextBoundRight;

      const picBoundaryRight = isRightPic
        ? (showSeparator ? (plankPicRight * 2) : (plankPicRight + (plankPicSize / 2)))
        : 0;

      let spaceNeededRight = 0;
      if (isRightPic) {
        spaceNeededRight = picBoundaryRight + 6.0;
      }
      if (isRightArrow) {
        if (isRightPic) {
          spaceNeededRight = picBoundaryRight + plankArrowRight + (plankArrowSize / 2) + 6.0;
        } else {
          spaceNeededRight = Math.max(spaceNeededRight, plankArrowRight + (plankArrowSize / 2) + 6.0);
        }
      }

      // Logo Maximum Right Edge (outermost boundary where logo's right edge can be situated)
      let logoMaxRightEdge = W - activeDasRightPadding;
      if (isRightPic) {
        if (showSeparator) {
          logoMaxRightEdge = W - (plankPicRight * 2) - activeDasRightPadding;
        } else {
          logoMaxRightEdge = W - plankPicRight - (plankPicSize / 2) - activeDasRightPadding;
        }
      }
      if (isRightArrow) {
        if (isRightPic) {
          logoMaxRightEdge = Math.min(logoMaxRightEdge, W - picBoundaryRight - plankArrowRight - (plankArrowSize / 2) - activeDasRightPadding);
        } else {
          logoMaxRightEdge = Math.min(logoMaxRightEdge, plankArrowRight + (plankArrowSize / 2) - activeDasRightPadding);
        }
      }

      if (isRightLogo) {
        const spaceForLogo = W - (logoMaxRightEdge - plateWidth - activeDasSpacingRight);
        spaceNeededRight = Math.max(spaceNeededRight, spaceForLogo);
      }
      if (spaceNeededRight > 0) {
        textBoundRight = Math.min(baseTextBoundRight, W - spaceNeededRight);
      }

      // 2. Measure actual text width & exact position
      const textWidth = estimateTextWidth(toSentenceCase(textLine), fs, letterSpacing);
      
      let textLeftEdge = 0;
      let textRightEdge = 0;
      let textX = 0;
      let textAnchor = "start";

      if (textAlign === 'left') {
        textLeftEdge = textBoundLeft;
        textRightEdge = textBoundLeft + textWidth;
        textX = textLeftEdge;
        textAnchor = "start";
      } else if (textAlign === 'right') {
        textRightEdge = textBoundRight;
        textLeftEdge = textBoundRight - textWidth;
        textX = textRightEdge;
        textAnchor = "end";
      } else {
        const ctr = (textBoundLeft + textBoundRight) / 2;
        textLeftEdge = ctr - textWidth / 2;
        textRightEdge = ctr + textWidth / 2;
        textX = ctr;
        textAnchor = "middle";
      }

      // 3. Position the double arrow symbol (DAS) plates
      let finalLeftLogoX = 0;
      if (isLeftLogo) {
        const targetCenter = textLeftEdge - activeDasSpacingLeft - (plateWidth / 2);
        finalLeftLogoX = Math.max(targetCenter, logoMinLeftEdge + (plateWidth / 2));
      }

      let finalRightLogoX = 0;
      if (isRightLogo) {
        const targetCenter = textRightEdge + activeDasSpacingRight + (plateWidth / 2);
        finalRightLogoX = Math.min(targetCenter, logoMaxRightEdge - (plateWidth / 2));
      }

      const finalLeftPicX = plankPicLeft;
      const finalRightPicX = W - plankPicRight;
      let finalLeftArrowOrLogoX = plankArrowLeft;
      if (isLeftPic && isLeftArrow) {
        finalLeftArrowOrLogoX = picBoundaryLeft + plankArrowLeft;
      }
      const minSafeLeft = (plankArrowSize / 2) + 2.5;
      if (finalLeftArrowOrLogoX < minSafeLeft) {
        finalLeftArrowOrLogoX = minSafeLeft;
      }

      let finalRightArrowOrLogoX = W - plankArrowRight;
      if (isRightPic && isRightArrow) {
        finalRightArrowOrLogoX = W - picBoundaryRight - plankArrowRight;
      }
      const maxSafeRight = W - (plankArrowSize / 2) - 2.5;
      if (finalRightArrowOrLogoX > maxSafeRight) {
        finalRightArrowOrLogoX = maxSafeRight;
      }

      const textY = isSecondLine ? plankTextYSecondLine : plankTextYFirstLine;

      let elementsSvg = "";
      
      if (isLeftPic) {
        const glyphCode = /^\d+$/.test(picType) ? parseInt(picType) : (GLYPH_MAP[picType] || 207);
        elementsSvg += `
          <text x="${finalLeftPicX}" y="${plankPicY}" text-anchor="middle" dominant-baseline="central" font-size="${plankPicSize}" font-family="'Brsign', 'Geist', sans-serif" fill="${contentColor}">${String.fromCharCode(glyphCode)}</text>
        `;
        if (showSeparator) {
          elementsSvg += `
            <line x1="${plankPicLeft * 2}" y1="0.5" x2="${plankPicLeft * 2}" y2="23.5" stroke="${borderStroke}" stroke-width="1" />
          `;
        }
      }

      if (isRightPic) {
        const glyphCode = /^\d+$/.test(picType) ? parseInt(picType) : (GLYPH_MAP[picType] || 207);
        elementsSvg += `
          <text x="${finalRightPicX}" y="${plankPicY}" text-anchor="middle" dominant-baseline="central" font-size="${plankPicSize}" font-family="'Brsign', 'Geist', sans-serif" fill="${contentColor}">${String.fromCharCode(glyphCode)}</text>
        `;
        if (showSeparator) {
          elementsSvg += `
            <line x1="${W - (plankPicRight * 2)}" y1="0.5" x2="${W - (plankPicRight * 2)}" y2="23.5" stroke="${borderStroke}" stroke-width="1" />
          `;
        }
      }

      const renderDasString = (cx: number, cy: number, size: number) => {
        const activeSize = logoType === 'custom-geometry' ? size * 0.95 : size;
        const pW = activeSize * 1.6;
        const pH = activeSize * 1.05;
        const px = cx - pW / 2;
        const py = cy - pH / 2;
        const textFontSize = activeSize * 0.72;
        
        let bgFill = "#FFFFFF";
        let strokeColor = "none";
        let textFill = "#FF3300";
        
        if (logoType === 'white-reversed-on-red') {
          bgFill = "#FF3300";
          textFill = "#FFFFFF";
        } else if (logoType === 'red-ruled-red') {
          bgFill = "#FFFFFF";
          strokeColor = "#FF3300";
          textFill = "#FF3300";
        } else if (logoType === 'red-ruled-black') {
          bgFill = "#FFFFFF";
          strokeColor = "#000000";
          textFill = "#FF3300";
        } else if (logoType === 'red-on-white') {
          bgFill = "none";
          textFill = "#FF3300";
        } else if (logoType === 'custom-geometry') {
          const foreIndex = customDasParams?.foregroundColourIndex ?? 0;
          const backIndex = customDasParams?.backgroundColourIndex ?? 4;
          textFill = COLOUR_STOPS_GEOMETRY[foreIndex]?.value ?? "#FF3300";
          bgFill = COLOUR_STOPS_GEOMETRY[backIndex]?.value ?? "#FFFFFF";
          if (bgFill.toLowerCase() === '#ffffff') {
            bgFill = "none";
            strokeColor = "none";
          }
        } else {
          return '';
        }
        
        if (logoType === 'custom-geometry') {
          const sw = customDasParams?.strokeWidth ?? 13;
          const go = customDasParams?.gapOffset ?? 15.5;
          const ta = customDasParams?.taperAngle ?? 2.3;

          const y_top_track_center = 25.5;
          const y_bottom_track_center = 53.5;

          const y_top_track_top = y_top_track_center - sw / 2;
          const y_top_track_bottom = y_top_track_center + sw / 2;
          const y_bottom_track_top = y_bottom_track_center - sw / 2;
          const y_bottom_track_bottom = y_bottom_track_center + sw / 2;

          const X_left_bend = 65 - go;
          const X_right_bend = 65 + go;

          const tip_center_top = X_right_bend - 2.645 * go;
          const tip_center_bottom = X_left_bend + 2.645 * go;

          const arm_dx_top = tip_center_top - X_right_bend;
          const arm_dy_top = 0 - y_top_track_top;
          const arm_len_top = Math.sqrt(arm_dx_top * arm_dx_top + arm_dy_top * arm_dy_top);

          const arm_dx_bottom = tip_center_bottom - X_left_bend;
          const arm_dy_bottom = 78 - y_bottom_track_bottom;
          const arm_len_bottom = Math.sqrt(arm_dx_bottom * arm_dx_bottom + arm_dy_bottom * arm_dy_bottom);

          const crossover_L = 2 * go;
          const crossover_H = Math.max(1, y_bottom_track_top - y_top_track_bottom);
          const multiplier_crossover = Math.sqrt(crossover_H * crossover_H + crossover_L * crossover_L) / crossover_H;
          const multiplier_crossover_default = 2.29589;
          const half_W_h_crossover = (sw * 13.5 / 13) * (multiplier_crossover / multiplier_crossover_default);

          const arm_L_top = 2.645 * go;
          const arm_H_top = Math.max(1, y_top_track_top);
          const multiplier_arm_top = Math.sqrt(arm_H_top * arm_H_top + arm_L_top * arm_L_top) / arm_H_top;
          const multiplier_arm_top_default = 2.3782;
          const half_W_h_arm_top = (sw * 13.5 / 13) * (multiplier_arm_top / multiplier_arm_top_default);

          const arm_L_bottom = 2.645 * go;
          const arm_H_bottom = Math.max(1, 78 - y_bottom_track_bottom);
          const multiplier_arm_bottom = Math.sqrt(arm_H_bottom * arm_H_bottom + arm_L_bottom * arm_L_bottom) / arm_H_bottom;
          const multiplier_arm_bottom_default = 2.4875;
          const half_W_h_arm_bottom = (sw * 13.5 / 13) * (multiplier_arm_bottom / multiplier_arm_bottom_default);

          const activeTaperWidth_top_base = (sw * 28 / 13) + (arm_len_top * Math.tan((ta * Math.PI) / 180) * 1.65);
          const activeTaperWidth_bottom_base = (sw * 27 / 13) + (arm_len_bottom * Math.tan((ta * Math.PI) / 180) * 2.22);

          const activeTaperWidth_top = activeTaperWidth_top_base * (multiplier_arm_top / multiplier_arm_top_default);
          const activeTaperWidth_bottom = activeTaperWidth_bottom_base * (multiplier_arm_bottom / multiplier_arm_bottom_default);

          const strokeAttr = strokeColor !== "none" ? `stroke="${strokeColor}" stroke-width="0.6"` : '';
          const rectSvg = (strokeColor !== "none" || (bgFill !== "none" && bgFill !== "transparent"))
            ? `<rect x="${px}" y="${py}" width="${pW}" height="${pH}" fill="${bgFill}" ${strokeAttr} />`
            : '';
          return `
            ${rectSvg}
            <svg x="${px + pW * 0.1}" y="${py + pH * 0.12}" width="${pW * 0.8}" height="${pH * 0.76}" viewBox="0 0 130 78">
              <polygon points="0,${y_top_track_top} 130,${y_top_track_top} 130,${y_top_track_bottom} 0,${y_top_track_bottom}" fill="${textFill}" />
              <polygon points="0,${y_bottom_track_top} 130,${y_bottom_track_top} 130,${y_bottom_track_bottom} 0,${y_bottom_track_bottom}" fill="${textFill}" />
              <polygon points="${X_left_bend - half_W_h_crossover},${y_bottom_track_top + 0.35} ${X_right_bend - half_W_h_crossover},${y_top_track_bottom - 0.35} ${X_right_bend + half_W_h_crossover},${y_top_track_bottom - 0.35} ${X_left_bend + half_W_h_crossover},${y_bottom_track_top + 0.35}" fill="${textFill}" />
              <polygon points="${tip_center_top - activeTaperWidth_top / 2},0 ${tip_center_top + activeTaperWidth_top / 2},0 ${X_right_bend + half_W_h_arm_top},${y_top_track_top + 0.35} ${X_right_bend - half_W_h_arm_top},${y_top_track_top + 0.35}" fill="${textFill}" />
              <polygon points="${X_left_bend - half_W_h_arm_bottom},${y_bottom_track_bottom - 0.35} ${tip_center_bottom - activeTaperWidth_bottom / 2},78 ${tip_center_bottom + activeTaperWidth_bottom / 2},78 ${X_left_bend + half_W_h_arm_bottom},${y_bottom_track_bottom - 0.35}" fill="${textFill}" />
            </svg>
          `;
        }
        
        const strokeAttr = strokeColor !== "none" ? `stroke="${strokeColor}" stroke-width="0.6"` : '';
        const rectSvg = (strokeColor !== "none" || (bgFill !== "none" && bgFill !== "transparent"))
          ? `<rect x="${px}" y="${py}" width="${pW}" height="${pH}" fill="${bgFill}" ${strokeAttr} />`
          : '';
        return `
          ${rectSvg}
          <text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="central" font-size="${textFontSize}" font-family="'Brsign', 'Geist', sans-serif" fill="${textFill}">${String.fromCharCode(200)}</text>
        `;
      };

      if (isLeftLogo) {
        elementsSvg += renderDasString(finalLeftLogoX, plankArrowY + dasVerticalOffset, activeDasSize);
      }
      if (isRightLogo) {
        elementsSvg += renderDasString(finalRightLogoX, plankArrowY + dasVerticalOffset, activeDasSize);
      }

      if (isLeftArrow) {
        elementsSvg += `
          <text x="${finalLeftArrowOrLogoX}" y="${plankArrowY}" text-anchor="middle" dominant-baseline="central" font-size="${plankArrowSize}" font-family="'Brsign', sans-serif" fill="${activeArrowColor}">${String.fromCharCode(DIRECTION_CHAR_CODES[direction] || 194)}</text>
        `;
      }

      if (isRightArrow) {
        elementsSvg += `
          <text x="${finalRightArrowOrLogoX}" y="${plankArrowY}" text-anchor="middle" dominant-baseline="central" font-size="${plankArrowSize}" font-family="'Brsign', sans-serif" fill="${activeArrowColor}">${String.fromCharCode(DIRECTION_CHAR_CODES[direction] || 194)}</text>
        `;
      }

      return `
        <g transform="translate(0, ${yOffset})">
          <!-- Background and Border -->
          <rect x="0.5" y="0.5" width="${W - 1}" height="23" fill="${plankBg}" stroke="${borderStroke}" stroke-width="0.5" />
          
          ${elementsSvg}

          <!-- Text -->
          <text x="${textX}" y="${textY}" text-anchor="${textAnchor}" dominant-baseline="central" font-size="${plankTextSize * (textSize / 52)}" font-family="'Brsign', 'Geist', sans-serif" font-weight="700" letter-spacing="${letterSpacing}em" fill="${contentColor}">${toSentenceCase(textLine)}</text>
        </g>
      `;
    };

    const xmlChildNodes = lines.map((line, idx) => generatePlankGroup(line, idx * (plankHeight + plankGapHeight), idx === 1)).join('\n');

    const fontStyleSource = base64Font 
      ? `url('${base64Font}') format('woff2')`
      : `url('${window.location.origin}/assets/fonts/Brsign-Black.woff2') format('woff2')`;

    const fullSvgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" style="background-color: transparent;">
      <defs>
        <style type="text/css">
          @font-face {
            font-family: 'Brsign';
            src: ${fontStyleSource};
            font-weight: normal;
            font-style: normal;
          }
        </style>
      </defs>
      ${xmlChildNodes}
    </svg>`;

    const img = new Image();
    const blob = new Blob([fullSvgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const scaleFactor = 6;
      canvas.width = W * scaleFactor;
      canvas.height = H * scaleFactor;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "transparent";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        try {
          const pngUrl = canvas.toDataURL("image/png");
          const link = document.createElement("a");
          const safeName = lastPresetInfo.name.toLowerCase().replace(/[^a-z0-9]+/g, '_');
          link.href = pngUrl;
          link.download = `rail_alphabet_${safeName || 'custom'}_sign.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (e) {
          console.error("Canvas export failed:", e);
        }
      }
      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  const W = hasArrowOrPic ? 192 : 168; // 7-tile or 8-tile long, DAS does not change this

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 lg:p-8 pb-6 lg:pb-8 max-w-5xl mx-auto my-6 transition-all relative" id="rail-alphabet-typography-section">
      
      {/* Title block celebrating Kinneir and Calvert */}
      <div className="mb-6">
        <h3 className="text-lg font-display font-bold text-rail-blue tracking-tight">
          The Art of Clear Signage and Typography
        </h3>
        <p className="text-xs text-slate-500 font-sans mt-0.5">
          Create your own station signage to the design style crafted in 1965 by Margaret Calvert and Jock Kinneir.
        </p>
      </div>

      {/* Main Stacked Layout with Plank hanging proudly on top inside its frame */}
      <div className="space-y-3 sm:space-y-6">
        
        {/* Full Length Plank Preview Container (with balanced proportional scaling width aligner) */}
        <div className="bg-slate-50 border border-slate-100 p-3 sm:p-8 rounded-2xl flex flex-col items-center justify-center min-h-[110px] sm:min-h-[160px] relative overflow-hidden shadow-inner w-full">
          {/* Reset button placed top right inside the preview div without occupying extra vertical space */}
          <button
            onClick={handleReset}
            style={{
              top: `${(isMobile ? 3 : 12) + (signageResetTop - 12)}px`,
              right: `${(isMobile ? 3 : 12) + (signageResetRight - 12)}px`
            }}
            className="absolute z-20 text-slate-400 hover:text-rail-blue hover:bg-slate-100 p-2 rounded-xl transition-all cursor-pointer border border-transparent hover:border-slate-200/60 shadow-xs"
            title="Reset"
            aria-label="Reset"
            id="btn-reset-sign"
          >
            <Lucide.RefreshCw className="w-4 h-4 text-slate-500" />
          </button>

          <div 
            className="flex flex-col gap-[3px] shadow-lg select-all"
            style={{ 
              width: `${(smoothW / 192) * 100}%`,
              maxWidth: `${smoothW * 4.5}px`
            }}
          >
            {lines.map((line, idx) => renderPlankSvg(line, idx === 1))}
          </div>
        </div>

        {/* Scrolling Cards Carousel */}
        <AnimatePresence initial={false}>
          {isCustomLayoutOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ 
                height: "auto", 
                opacity: 1,
                transition: {
                  height: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] },
                  opacity: { duration: 0.25, delay: 0.05 }
                }
              }}
              exit={{ 
                height: 0, 
                opacity: 0,
                transition: {
                  height: { duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] },
                  opacity: { duration: 0.15 }
                }
              }}
              style={{ overflow: 'hidden' }}
              className="relative w-full"
            >
              <div 
                className="pt-2 pb-1 -mx-6 lg:-mx-8 overflow-hidden relative px-0 sm:px-[var(--container-padding)]"
                style={{
                  ['--container-padding' as any]: `${containerPadding}px`,
                  ['--card-width-custom' as any]: `${cardWidth}px`,
                  ['--arrow-carousel-width-custom' as any]: `${arrowCarouselWidth}px`,
                  ['--pic-carousel-width-custom' as any]: `${picCarouselWidth}px`,
                  ['--mini-chevron-offset' as any]: `${miniChevronOffset}px`
                }}
              >
            
            {/* Scroll Navigation Chevrons (inspired by modern timelines, only render when navigable) */}
            <button
              id="scroll-left-chevron"
              type="button"
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              className="hidden sm:flex absolute top-1/2 -translate-y-1/2 z-30 items-center justify-center w-10 h-10 bg-transparent text-slate-600 hover:text-[#a8081b] hover:scale-115 transition-all focus:outline-none cursor-pointer disabled:opacity-0 disabled:pointer-events-none"
              style={{ left: `${chevronOffset}px` }}
              title="Scroll Left"
            >
              <Lucide.ChevronLeft className="w-6 h-6 shrink-0" />
            </button>

            <button
              id="scroll-right-chevron"
              type="button"
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              className="hidden sm:flex absolute top-1/2 -translate-y-1/2 z-30 items-center justify-center w-10 h-10 bg-transparent text-slate-600 hover:text-[#a8081b] hover:scale-115 transition-all focus:outline-none cursor-pointer disabled:opacity-0 disabled:pointer-events-none"
              style={{ right: `${chevronOffset}px` }}
              title="Scroll Right"
            >
              <Lucide.ChevronRight className="w-6 h-6 shrink-0" />
            </button>

            {/* Horizontal Track Wrapper */}
            <div 
              ref={carouselRef}
              onScroll={updateScrollButtons}
              id="carousel-container"
              className="flex gap-4 sm:gap-5 overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory pb-4 select-none scrollbar-none sm:px-0"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                paddingLeft: 'var(--track-padding-left, calc((100vw - var(--card-final-width)) / 2))',
                paddingRight: 'var(--track-padding-right, calc((100vw - var(--card-final-width)) / 2))',
              }}
            >
              
              {/* Card 1: Core Configuration (Presets, Custom Text, Board Themes - as requested!) */}
              <div 
                id="control-card" 
                className="min-h-[245px] sm:min-h-[250px] flex-shrink-0 snap-center bg-slate-50/70 border border-slate-200/25 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between font-sans"
                style={{ width: 'var(--card-final-width)' }}
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-200/50 pb-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-[#a8081b] bg-red-100/80 px-1.5 py-0.5 rounded leading-none text-xs">01</span>
                      <span className="font-mono font-bold text-[#012169] tracking-wide uppercase text-xs">Preset & Type</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4 sm:space-y-5">
                    {/* Presets Select */}
                    <div>
                      <label className="block text-[10px] font-mono font-medium text-slate-400 uppercase tracking-wider mb-1">
                        SIGN PRESETS
                      </label>
                      <select
                        id="select-preset-signage"
                        value={selectedPresetName === 'custom' ? 'custom' : PRESETS.findIndex(p => p.name === selectedPresetName)}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val !== 'custom') {
                            const idx = Number(val);
                            loadPreset(PRESETS[idx]);
                          } else {
                            setSelectedPresetName('custom');
                          }
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:ring-1 focus:ring-rail-blue outline-none text-slate-700 h-9 cursor-pointer"
                      >
                        <option value="custom" disabled>Custom Design</option>
                        {(() => {
                          const elements: React.ReactNode[] = [];
                          let prevCategory = PRESETS[0]?.category;
                          PRESETS.forEach((preset, idx) => {
                            if (idx > 0 && preset.category !== prevCategory) {
                              elements.push(
                                <option key={`sep-${idx}`} disabled className="text-slate-300 select-none py-0 font-light">
                                  ────────────
                                </option>
                              );
                              prevCategory = preset.category;
                            }
                            elements.push(
                              <option key={idx} value={idx}>
                                {preset.name}
                              </option>
                            );
                          });
                          return elements;
                        })()}
                      </select>
                    </div>

                    {/* Text Input */}
                    <div>
                      <label className="block text-[10px] font-mono font-medium text-slate-400 uppercase tracking-wider mb-1">
                        SIGN TEXT
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={typedText}
                          onChange={handleInputChange}
                          maxLength={30}
                          placeholder="Way out"
                          className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:ring-1 focus:ring-rail-blue outline-none text-slate-850 transition-all font-sans tracking-wide h-9"
                        />
                        {typedText && (
                          <button
                            type="button"
                            onClick={() => {
                              setTypedText('');
                              setSelectedPresetName('custom');
                            }}
                            className="absolute right-2.5 top-2.5 text-slate-400 hover:text-rose-500 transition cursor-pointer"
                          >
                            <Lucide.Trash2 className="w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Integrated Background Colour Selector to remove large blank gap */}
                    <div className="pt-2 border-t border-slate-200/50">
                      <span className="block text-[10px] font-mono font-medium text-slate-400 uppercase tracking-wider mb-1">
                        Background Colour
                      </span>
                      <div className="grid grid-cols-4 gap-1 bg-white border border-slate-200/60 rounded-xl p-0.5">
                        <button
                          type="button"
                          onClick={() => {
                            setBoardTheme('white');
                            setSelectedPresetName('custom');
                          }}
                          className={`h-8.5 text-[11px] font-bold uppercase rounded-lg cursor-pointer transition flex items-center justify-center px-2 ${
                            boardTheme === 'white' 
                              ? 'bg-white text-slate-900 border-2 border-[#012169] shadow-md font-black scale-102' 
                              : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 hover:text-slate-800'
                          }`}
                        >
                          White
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setBoardTheme('green');
                            setSelectedPresetName('custom');
                          }}
                          className={`h-8.5 text-[11px] font-bold uppercase rounded-lg cursor-pointer transition flex items-center justify-center px-2 ${
                            boardTheme === 'green' 
                              ? 'bg-[#00994c] text-white border-2 border-[#012169] ring-2 ring-[#012169]/30 font-black shadow-md scale-102' 
                              : 'bg-[#00994c] text-white opacity-80 hover:opacity-100 font-semibold'
                          }`}
                        >
                          Green
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setBoardTheme('red');
                            setSelectedPresetName('custom');
                          }}
                          className={`h-8.5 text-[11px] font-bold uppercase rounded-lg cursor-pointer transition flex items-center justify-center px-2 ${
                            boardTheme === 'red' 
                              ? 'bg-[#FF3300] text-white border-2 border-[#012169] ring-2 ring-[#012169]/30 font-black shadow-md scale-102' 
                              : 'bg-[#FF3300] text-white opacity-80 hover:opacity-100 font-semibold'
                          }`}
                        >
                          Red
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setBoardTheme('black');
                            setSelectedPresetName('custom');
                          }}
                          className={`h-8.5 text-[11px] font-bold uppercase rounded-lg cursor-pointer transition flex items-center justify-center px-2 ${
                            boardTheme === 'black' 
                              ? 'bg-[#111111] text-white border-2 border-white/60 ring-2 ring-white/10 font-black shadow-md scale-102' 
                              : 'bg-[#111111] text-white opacity-80 hover:opacity-100 font-semibold'
                          }`}
                        >
                          Black
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Spacing & Typography Details */}
              <div 
                id="typography-settings-card" 
                className="min-h-[245px] sm:min-h-[250px] flex-shrink-0 snap-center bg-slate-50/70 border border-slate-200/25 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between font-sans"
                style={{ width: 'var(--card-final-width)' }}
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-200/50 pb-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-[#a8081b] bg-red-100/80 px-1.5 py-0.5 rounded leading-none text-xs">02</span>
                      <span className="font-mono font-bold text-[#012169] tracking-wide uppercase text-xs">Text Size & Alignment</span>
                    </div>
                  </div>

                  <div className="space-y-4 sm:space-y-5">
                    <SignageStyleSlider
                      label="Text Size"
                      value={textSize}
                      min={24}
                      max={80}
                      defaultValue={52}
                      displayValue={`${textSize}px`}
                      onChange={(val) => {
                        setTextSize(val);
                        setSelectedPresetName('custom');
                      }}
                    />

                    <SignageStyleSlider
                      label="Letter Spacing"
                      value={letterSpacing}
                      min={-0.20}
                      max={0.20}
                      step={0.01}
                      defaultValue={0.00}
                      displayValue={`${letterSpacing.toFixed(2)}em`}
                      onChange={(val) => {
                        setLetterSpacing(val);
                        setSelectedPresetName('custom');
                      }}
                    />

                    {/* Text Alignment */}
                    <div>
                      <span className="block text-[10px] font-mono font-medium text-slate-400 uppercase tracking-wider mb-1">
                        Text Alignment
                      </span>
                      <div className="grid grid-cols-3 gap-1 bg-white border border-slate-200/60 rounded-xl p-0.5">
                        <button
                          type="button"
                          onClick={() => {
                            setTextAlign('left');
                            setSelectedPresetName('custom');
                          }}
                          className={`h-8.5 text-[11px] font-bold uppercase rounded-lg cursor-pointer transition flex items-center justify-center ${
                            textAlign === 'left'
                              ? 'bg-[#012169] text-white font-bold shadow-sm'
                              : 'bg-transparent text-slate-500 hover:bg-slate-100/60'
                          }`}
                        >
                          Left
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setTextAlign('center');
                            setSelectedPresetName('custom');
                          }}
                          className={`h-8.5 text-[11px] font-bold uppercase rounded-lg cursor-pointer transition flex items-center justify-center ${
                            textAlign === 'center'
                              ? 'bg-[#012169] text-white font-bold shadow-sm'
                              : 'bg-transparent text-slate-500 hover:bg-slate-100/60'
                          }`}
                        >
                          Center
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setTextAlign('right');
                            setSelectedPresetName('custom');
                          }}
                          className={`h-8.5 text-[11px] font-bold uppercase rounded-lg cursor-pointer transition flex items-center justify-center ${
                            textAlign === 'right'
                              ? 'bg-[#012169] text-white font-bold shadow-sm'
                              : 'bg-transparent text-slate-550 hover:bg-slate-100/60'
                          }`}
                        >
                          Right
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Double Arrow Symbol Column / Position */}
              <div 
                id="double-arrow-card" 
                className="min-h-[245px] sm:min-h-[250px] flex-shrink-0 snap-center bg-slate-50/70 border border-slate-200/25 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between font-sans"
                style={{ width: 'var(--card-final-width)' }}
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-200/50 pb-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-[#a8081b] bg-red-100/80 px-1.5 py-0.5 rounded leading-none text-xs">03</span>
                      <span className="font-mono font-bold text-[#012169] tracking-wide uppercase text-xs">Double Arrow Symbol</span>
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    {/* Selection of 1965 Gerry Barney Symbol */}
                    <div>
                      {/* Grid of Double Arrow Logos (using glyph 200) */}
                      <div className="grid grid-cols-3 gap-2 bg-white border border-slate-200/60 rounded-xl p-2 h-auto items-center">
                        {(() => {
                          const itemsToRender = [
                            LOGO_TYPES[0], // ID: 'none'
                            LOGO_TYPES[1], // ID: 'red-on-white' (Type A)
                            LOGO_TYPES[2], // ID: 'white-reversed-on-red' (Type B)
                            LOGO_TYPES[5], // ID: 'custom-geometry' (Type Custom)
                            LOGO_TYPES[3], // ID: 'red-ruled-red' (Type C)
                            LOGO_TYPES[4]  // ID: 'red-ruled-black' (Type D)
                          ];

                          return itemsToRender.map((type, idx) => {
                            const isActive = logoType === type.id;
                            let btnContent = null;

                            if (type.id === 'none') {
                              btnContent = (
                                <div className="flex items-center justify-center w-full h-full">
                                  <span className={`text-[11px] font-sans font-bold uppercase tracking-wider select-none ${isActive ? 'text-slate-700' : 'text-slate-500'}`}>
                                    None
                                  </span>
                                </div>
                              );
                            } else if (type.id === 'red-on-white') {
                              btnContent = (
                                <svg 
                                  viewBox="0 0 22.5 14" 
                                  style={{
                                    width: '67.5px',
                                    height: '42px',
                                    display: 'block',
                                    backgroundColor: '#FFFFFF',
                                  }}
                                  className="shadow-sm border border-slate-100"
                                >
                                  <text 
                                    x="11.25" 
                                    y="7" 
                                    textAnchor="middle" 
                                    dominantBaseline="central" 
                                    fontSize="8.8" 
                                    style={{
                                      fontFamily: "'Brsign', 'Geist', sans-serif",
                                      fontWeight: 'normal',
                                    }}
                                    fill="#FF3300"
                                    className="select-none"
                                  >
                                    {String.fromCharCode(200)}
                                  </text>
                                </svg>
                              );
                            } else if (type.id === 'white-reversed-on-red') {
                              btnContent = (
                                <svg 
                                  viewBox="0 0 22.5 14" 
                                  style={{
                                    width: '67.5px',
                                    height: '42px',
                                    display: 'block',
                                    backgroundColor: '#FF3300',
                                  }}
                                  className="shadow-sm"
                                >
                                  <text 
                                    x="11.25" 
                                    y="7" 
                                    textAnchor="middle" 
                                    dominantBaseline="central" 
                                    fontSize="8.8" 
                                    style={{
                                      fontFamily: "'Brsign', 'Geist', sans-serif",
                                      fontWeight: 'normal',
                                    }}
                                    fill="#FFFFFF"
                                    className="select-none"
                                  >
                                    {String.fromCharCode(200)}
                                  </text>
                                </svg>
                              );
                            } else if (type.id === 'red-ruled-red') {
                              btnContent = (
                                <svg 
                                  viewBox="0 0 22.5 14" 
                                  style={{
                                    width: '67.5px',
                                    height: '42px',
                                    display: 'block',
                                    backgroundColor: '#FFFFFF',
                                  }}
                                  className="shadow-sm"
                                >
                                  <rect 
                                    x="0.25" 
                                    y="0.25" 
                                    width="22.0" 
                                    height="13.5" 
                                    fill="none" 
                                    stroke="#FF3300" 
                                    strokeWidth="0.5" 
                                  />
                                  <text 
                                    x="11.25" 
                                    y="7" 
                                    textAnchor="middle" 
                                    dominantBaseline="central" 
                                    fontSize="8.8" 
                                    style={{
                                      fontFamily: "'Brsign', 'Geist', sans-serif",
                                      fontWeight: 'normal',
                                    }}
                                    fill="#FF3300"
                                    className="select-none"
                                  >
                                    {String.fromCharCode(200)}
                                  </text>
                                </svg>
                              );
                            } else if (type.id === 'red-ruled-black') {
                              btnContent = (
                                <svg 
                                  viewBox="0 0 22.5 14" 
                                  style={{
                                    width: '67.5px',
                                    height: '42px',
                                    display: 'block',
                                    backgroundColor: '#FFFFFF',
                                  }}
                                  className="shadow-sm"
                                >
                                  <rect 
                                    x="0.25" 
                                    y="0.25" 
                                    width="22.0" 
                                    height="13.5" 
                                    fill="none" 
                                    stroke="#000000" 
                                    strokeWidth="0.5" 
                                  />
                                  <text 
                                    x="11.25" 
                                    y="7" 
                                    textAnchor="middle" 
                                    dominantBaseline="central" 
                                    fontSize="8.8" 
                                    style={{
                                      fontFamily: "'Brsign', 'Geist', sans-serif",
                                      fontWeight: 'normal',
                                    }}
                                    fill="#FF3300"
                                    className="select-none"
                                  >
                                    {String.fromCharCode(200)}
                                  </text>
                                </svg>
                              );
                            } else if (type.id === 'custom-geometry') {
                              btnContent = (
                                <div className="flex flex-col items-center justify-center gap-1 w-full h-full">
                                  <DraftingTriangleIcon className="w-5 h-5 text-rail-red" />
                                  <span className={`text-[11px] font-sans font-bold uppercase tracking-wider select-none ${isActive ? 'text-[#012169]' : 'text-slate-500'}`}>
                                    Custom
                                  </span>
                                </div>
                              );
                            }

                            return (
                              <button
                                key={`logo-select-btn-${type.id}`}
                                type="button"
                                onClick={() => {
                                  setLogoType(type.id);
                                  setSelectedPresetName('custom');
                                  updateDasPresets(type.id, logoPosition);
                                }}
                                className={`relative h-14 sm:h-16 w-full flex items-center justify-center rounded-[12px] cursor-pointer p-0.5 transition-all ${
                                  isActive
                                    ? type.id === 'none'
                                      ? 'border-2 border-slate-400 bg-slate-100/60 shadow-xs'
                                      : 'border-2 border-[#012169] ring-2 ring-[#012169]/20 bg-white'
                                    : 'border border-slate-300 bg-white hover:bg-slate-50 hover:border-slate-400'
                                }`}
                                title={type.label}
                              >
                                <div className="w-full h-full flex items-center justify-center overflow-hidden rounded-[10px]">
                                  {btnContent}
                                </div>
                              </button>
                            );
                          });
                        })()}
                      </div>
                    </div>

                    {/* Logo Placement Button matches text alignment sizing style */}
                    {logoType !== 'none' && (
                      <div className="animate-fade-in mt-2">
                        <span className="block text-[10px] font-mono font-medium text-slate-400 uppercase tracking-wider mb-1">
                          Position
                        </span>
                        <div className="grid grid-cols-2 gap-1 bg-white border border-slate-200/60 rounded-xl p-0.5">
                          <button
                            type="button"
                            onClick={() => {
                              setLogoPosition('left');
                              setSelectedPresetName('custom');
                              updateDasPresets(logoType, 'left');
                            }}
                            className={`h-8.5 text-[11px] font-bold uppercase rounded-lg cursor-pointer transition flex items-center justify-center ${
                              logoPosition === 'left'
                                ? 'bg-[#012169] text-white shadow-sm font-bold'
                                : 'bg-transparent text-slate-500 hover:bg-slate-100/60'
                            }`}
                          >
                            Left
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setLogoPosition('right');
                              setSelectedPresetName('custom');
                              updateDasPresets(logoType, 'right');
                            }}
                            className={`h-8.5 text-[11px] font-bold uppercase rounded-lg cursor-pointer transition flex items-center justify-center ${
                              logoPosition === 'right'
                                ? 'bg-[#012169] text-white shadow-sm font-bold'
                                : 'bg-transparent text-slate-500 hover:bg-slate-100/60'
                            }`}
                          >
                            Right
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Card 4: Directional Arrow pad */}
              <div 
                id="arrow-control-pad-card" 
                className="min-h-[245px] sm:min-h-[250px] flex-shrink-0 snap-center bg-slate-50/70 border border-slate-200/25 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between font-sans"
                style={{ 
                  width: 'var(--card-final-width)',
                  ['--arrow-carousel-width-custom' as any]: `${arrowCarouselWidth}px`,
                  ['--mini-chevron-offset' as any]: `${miniChevronOffset}px`
                }}
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-200/50 pb-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-[#a8081b] bg-red-100/80 px-1.5 py-0.5 rounded leading-none text-xs">04</span>
                      <span className="font-mono font-bold text-[#012169] tracking-wide uppercase text-xs">Direction Arrow</span>
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    {/* Compass Pad Horizontal Scroll Wrapper */}
                    <div className="flex items-center justify-center w-full relative animate-fade-in select-none">
                      {/* Left Chevron */}
                      <button
                        type="button"
                        onClick={() => scrollArrowCarousel('left')}
                        className="absolute left-0 text-slate-500 hover:text-[#a8081b] transition-all focus:outline-none cursor-pointer h-10 w-10 flex items-center justify-center shrink-0 disabled:opacity-20 group"
                        style={{ transform: `translateX(-${miniChevronOffset}px)`, zIndex: 10 }}
                        title="Scroll Left"
                      >
                        <Lucide.ChevronLeft className="w-6 h-6 shrink-0 transition-transform duration-200 group-hover:scale-125 group-active:scale-110 group-disabled:scale-100" />
                      </button>

                      {/* Carousel wrapper */}
                      <div 
                        ref={arrowCarouselRef}
                        className="flex items-center gap-2 overflow-x-auto overflow-y-hidden py-1.5 snap-x scrollbar-none scroll-smooth bg-white border border-slate-200/60 rounded-xl px-2.5 mx-auto"
                        style={{ 
                          scrollbarWidth: 'none', 
                          msOverflowStyle: 'none',
                          width: 'var(--arrow-carousel-width, 223px)',
                          maxWidth: '100%'
                        }}
                      >
                        {Object.entries(DIRECTIONS).map(([key, config]) => {
                          const isActive = direction === key && arrowPosition !== 'none';
                          const charCode = DIRECTION_CHAR_CODES[key];
                          return (
                            <button
                              key={`dir-btn-${key}`}
                              type="button"
                              onClick={() => {
                                selectDirection(key);
                              }}
                              className={`h-10 w-10 shrink-0 snap-start flex items-center justify-center rounded-xl border transition cursor-pointer ${
                                isActive 
                                  ? 'bg-[#012169] border-[#012169] text-white shadow-sm font-bold' 
                                  : 'bg-slate-50 hover:bg-slate-100 border-slate-100/50 text-slate-800'
                              }`}
                              title={config.name}
                            >
                              {charCode ? (
                                <span 
                                  style={{ 
                                    fontFamily: "'Brsign', sans-serif", 
                                    fontSize: '28px',
                                    lineHeight: 1,
                                    fontWeight: 'normal'
                                  }}
                                  className="direction-arrow-glyph select-none transition-transform duration-100 active:scale-90"
                                >
                                  {String.fromCharCode(charCode)}
                                </span>
                              ) : (
                                <span style={{ transform: `rotate(${config.angle - 90}deg)`, display: 'inline-block', fontSize: '18px' }}>
                                  ➔
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                       {/* Right Chevron */}
                      <button
                        type="button"
                        onClick={() => scrollArrowCarousel('right')}
                        className="absolute right-0 text-slate-500 hover:text-[#a8081b] transition-all focus:outline-none cursor-pointer h-10 w-10 flex items-center justify-center shrink-0 disabled:opacity-20 group"
                        style={{ transform: `translateX(${miniChevronOffset}px)`, zIndex: 10 }}
                        title="Scroll Right"
                      >
                        <Lucide.ChevronRight className="w-6 h-6 shrink-0 transition-transform duration-200 group-hover:scale-125 group-active:scale-110 group-disabled:scale-100" />
                      </button>
                    </div>

                    {/* Arrow Placement & Colour stacked */}
                    <div className="space-y-3">
                      <div>
                        <span className="block text-[10px] font-mono font-medium text-slate-400 uppercase tracking-wider mb-1">
                          Placement
                        </span>
                        <div className="grid grid-cols-3 gap-0.5 bg-white border border-slate-200/60 rounded-xl p-0.5">
                          <button
                            type="button"
                            onClick={() => selectArrowPosition('left')}
                            className={`h-8 text-[10.5px] font-bold uppercase rounded-lg cursor-pointer transition flex items-center justify-center ${
                              arrowPosition === 'left'
                                ? 'bg-[#012169] text-white font-bold shadow-sm'
                                : 'bg-transparent text-slate-500 hover:bg-slate-100/60'
                            }`}
                          >
                            Left
                          </button>
                          <button
                            type="button"
                            onClick={() => selectArrowPosition('none')}
                            className={`h-8 text-[10.5px] font-bold uppercase rounded-lg cursor-pointer transition flex items-center justify-center ${
                              arrowPosition === 'none'
                                ? 'bg-slate-900 text-white font-bold shadow-sm'
                                : 'bg-transparent text-slate-500 hover:bg-slate-100/60'
                            }`}
                          >
                            None
                          </button>
                          <button
                            type="button"
                            onClick={() => selectArrowPosition('right')}
                            className={`h-8 text-[10.5px] font-bold uppercase rounded-lg cursor-pointer transition flex items-center justify-center ${
                              arrowPosition === 'right'
                                ? 'bg-[#012169] text-white font-bold shadow-sm'
                                : 'bg-transparent text-slate-500 hover:bg-slate-100/60'
                            }`}
                          >
                            Right
                          </button>
                        </div>
                      </div>

                      <div>
                        <span className="block text-[10px] font-mono font-medium text-slate-400 uppercase tracking-wider mb-1">
                          Colour
                        </span>
                        <div className="grid grid-cols-2 gap-0.5 bg-white border border-slate-200/60 rounded-xl p-0.5">
                          <button
                            type="button"
                            onClick={() => {
                              setArrowColor('teal');
                              setSelectedPresetName('custom');
                            }}
                            className={`h-8 text-[10.5px] font-bold uppercase rounded-lg cursor-pointer transition flex items-center justify-center ${
                              arrowColor === 'teal'
                                ? 'bg-[#012169] text-white font-bold shadow-sm'
                                : 'bg-transparent text-slate-500 hover:bg-slate-100/60'
                            }`}
                          >
                            TEAL
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setArrowColor('black');
                              setSelectedPresetName('custom');
                            }}
                            className={`h-8 text-[10.5px] font-bold uppercase rounded-lg cursor-pointer transition flex items-center justify-center ${
                              arrowColor === 'black'
                                ? 'bg-slate-900 text-white font-bold shadow-sm'
                                : 'bg-transparent text-slate-500 hover:bg-slate-100/60'
                            }`}
                          >
                            Black
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 5: Pictograms */}
              <div 
                id="pictogram-card" 
                className="min-h-[245px] sm:min-h-[250px] flex-shrink-0 snap-center bg-slate-50/70 border border-slate-200/25 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between font-sans"
                style={{ 
                  width: 'var(--card-final-width)',
                  ['--pic-carousel-width-custom' as any]: `${picCarouselWidth}px`,
                  ['--mini-chevron-offset' as any]: `${miniChevronOffset}px`
                }}
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-200/50 pb-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-[#a8081b] bg-red-100/80 px-1.5 py-0.5 rounded leading-none text-xs">05</span>
                      <span className="font-mono font-bold text-[#012169] tracking-wide uppercase text-xs">Pictograms</span>
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    {/* Generous scrolling pictogram picker with Chevrons */}
                    <div className="flex items-center justify-center w-full relative animate-fade-in select-none">
                      {/* Left Chevron */}
                      <button
                        type="button"
                        onClick={() => scrollPicCarousel('left')}
                        className="absolute left-0 text-slate-500 hover:text-[#a8081b] transition-all focus:outline-none cursor-pointer h-10 w-10 flex items-center justify-center shrink-0 disabled:opacity-20 group"
                        style={{ transform: `translateX(-${miniChevronOffset}px)`, zIndex: 10 }}
                        title="Scroll Left"
                      >
                        <Lucide.ChevronLeft className="w-6 h-6 shrink-0 transition-transform duration-200 group-hover:scale-125 group-active:scale-110 group-disabled:scale-100" />
                      </button>

                      {/* Carousel wrapper */}
                      <div 
                        ref={picCarouselRef}
                        className="flex items-center gap-2 overflow-x-auto overflow-y-hidden py-1.5 snap-x scrollbar-none scroll-smooth bg-white border border-slate-200/60 rounded-xl px-2.5 mx-auto"
                        style={{ 
                          scrollbarWidth: 'none', 
                          msOverflowStyle: 'none',
                          width: 'var(--pic-carousel-width, 223px)',
                          maxWidth: '100%'
                        }}
                      >
                        {PICTOGRAM_GLYPHS.map((glyph) => {
                          const codeStr = String(glyph.code);
                          const isActive = picType === codeStr || GLYPH_MAP[picType] === glyph.code;
                          return (
                            <button
                              key={`glyph-btn-${glyph.code}`}
                              type="button"
                              onClick={() => {
                                setPicType(codeStr);
                                setSelectedPresetName('custom');
                              }}
                              className={`h-10 w-10 shrink-0 snap-start flex items-center justify-center rounded-xl border transition-all cursor-pointer ${
                                isActive
                                  ? 'bg-[#012169] border-[#012169] text-white shadow-sm'
                                  : 'bg-slate-50 hover:bg-slate-100 border-slate-100/50 text-slate-800'
                              }`}
                              title={glyph.name}
                            >
                              <span 
                                style={{ fontFamily: "'Brsign', sans-serif", fontSize: '28.8px', lineHeight: 1 }}
                                className="select-none font-normal"
                              >
                                {String.fromCharCode(glyph.code)}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Right Chevron */}
                      <button
                        type="button"
                        onClick={() => scrollPicCarousel('right')}
                        className="absolute right-0 text-slate-500 hover:text-[#a8081b] transition-all focus:outline-none cursor-pointer h-10 w-10 flex items-center justify-center shrink-0 disabled:opacity-20 group"
                        style={{ transform: `translateX(${miniChevronOffset}px)`, zIndex: 10 }}
                        title="Scroll Right"
                      >
                        <Lucide.ChevronRight className="w-6 h-6 shrink-0 transition-transform duration-200 group-hover:scale-125 group-active:scale-110 group-disabled:scale-100" />
                      </button>
                    </div>

                    {/* Pictogram Placement and Plank Separator stacked */}
                    <div className="space-y-3">
                      <div>
                        <span className="block text-[10px] font-mono font-medium text-slate-400 uppercase tracking-wider mb-1">
                          Placement
                        </span>
                        <div className="grid grid-cols-3 gap-0.5 bg-white border border-slate-200/60 rounded-xl p-0.5">
                          <button
                            type="button"
                            onClick={() => {
                              setPicPosition('left');
                              if (picType === 'none') setPicType('exit');
                              setSelectedPresetName('custom');
                            }}
                            className={`h-8 text-[10.5px] font-bold uppercase rounded-lg cursor-pointer transition flex items-center justify-center ${
                              picType !== 'none' && picPosition === 'left'
                                ? 'bg-[#012169] text-white font-bold shadow-sm'
                                : 'bg-transparent text-slate-500 hover:bg-slate-100/60'
                            }`}
                          >
                            Left
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setPicType('none');
                              setSelectedPresetName('custom');
                            }}
                            className={`h-8 text-[10.5px] font-bold uppercase rounded-lg cursor-pointer transition flex items-center justify-center ${
                              picType === 'none'
                                ? 'bg-slate-900 text-white font-bold shadow-sm'
                                : 'bg-transparent text-slate-500 hover:bg-slate-100/60'
                            }`}
                          >
                            None
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setPicPosition('right');
                              if (picType === 'none') setPicType('exit');
                              setSelectedPresetName('custom');
                            }}
                            className={`h-8 text-[10.5px] font-bold uppercase rounded-lg cursor-pointer transition flex items-center justify-center ${
                              picType !== 'none' && picPosition === 'right'
                                ? 'bg-[#012169] text-white font-bold shadow-sm'
                                : 'bg-transparent text-slate-500 hover:bg-slate-100/60'
                            }`}
                          >
                            Right
                          </button>
                        </div>
                      </div>

                      <div>
                        <span className="block text-[10px] font-mono font-medium text-slate-400 uppercase tracking-wider mb-1">
                          Separator
                        </span>
                        <div className="grid grid-cols-2 gap-0.5 bg-white border border-slate-200/60 rounded-xl p-0.5 font-sans">
                          <button
                            type="button"
                            onClick={() => {
                              setShowSeparator(true);
                              setSelectedPresetName('custom');
                            }}
                            className={`h-8 text-[10.5px] font-bold uppercase rounded-lg cursor-pointer transition flex items-center justify-center ${
                              showSeparator
                                ? 'bg-[#012169] text-white font-bold shadow-sm'
                                : 'bg-transparent text-slate-500 hover:bg-slate-100/60'
                            }`}
                          >
                            ON
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowSeparator(false);
                              setSelectedPresetName('custom');
                            }}
                            className={`h-8 text-[10.5px] font-bold uppercase rounded-lg cursor-pointer transition flex items-center justify-center ${
                              !showSeparator
                                ? 'bg-slate-900 text-white font-bold shadow-sm'
                                : 'bg-transparent text-slate-500 hover:bg-slate-100/60'
                            }`}
                          >
                            OFF
                          </button>
                        </div>
                      </div>


                    </div>
                  </div>
                </div>
              </div>
 
              {/* Card 6: Developer Layout Tuning */}
              <div 
                id="developer-layout-tuning-card" 
                className="min-h-[245px] sm:min-h-[250px] flex-shrink-0 snap-center bg-slate-900 text-slate-100 border border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between font-sans"
                style={{ width: 'var(--card-final-width)' }}
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded leading-none text-xs">06</span>
                      <span className="font-mono font-bold text-rose-400 tracking-wide uppercase text-xs">Developer Tuning</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 text-xs">
                    <div>
                      <label className="block text-[9px] font-mono text-slate-400 uppercase mb-0.5">Card Width ({cardWidth}px)</label>
                      <input 
                        type="range" 
                        min="250" 
                        max="450" 
                        value={cardWidth} 
                        onChange={(e) => setCardWidth(Number(e.target.value))}
                        className="w-full accent-rose-500 cursor-pointer h-1 bg-slate-800 rounded-lg appearance-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-mono text-slate-400 uppercase mb-0.5">Container Pad ({containerPadding}px)</label>
                      <input 
                        type="range" 
                        min="0" 
                        max="120" 
                        value={containerPadding} 
                        onChange={(e) => setContainerPadding(Number(e.target.value))}
                        className="w-full accent-rose-500 cursor-pointer h-1 bg-slate-800 rounded-lg appearance-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-mono text-slate-400 uppercase mb-0.5">Chevron Off ({chevronOffset}px)</label>
                      <input 
                        type="range" 
                        min="0" 
                        max="80" 
                        value={chevronOffset} 
                        onChange={(e) => setChevronOffset(Number(e.target.value))}
                        className="w-full accent-rose-500 cursor-pointer h-1 bg-slate-800 rounded-lg appearance-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-mono text-slate-400 uppercase mb-0.5">Mini Chev Off ({miniChevronOffset}px)</label>
                      <input 
                        type="range" 
                        min="-40" 
                        max="60" 
                        value={miniChevronOffset} 
                        onChange={(e) => setMiniChevronOffset(Number(e.target.value))}
                        className="w-full accent-rose-500 cursor-pointer h-1 bg-slate-800 rounded-lg appearance-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-mono text-slate-400 uppercase mb-0.5">Arrow Carousel ({arrowCarouselWidth}px)</label>
                      <input 
                        type="range" 
                        min="150" 
                        max="390" 
                        value={arrowCarouselWidth} 
                        onChange={(e) => setArrowCarouselWidth(Number(e.target.value))}
                        className="w-full accent-rose-500 cursor-pointer h-1 bg-slate-800 rounded-lg appearance-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-mono text-slate-400 uppercase mb-0.5">Pic Carousel ({picCarouselWidth}px)</label>
                      <input 
                        type="range" 
                        min="150" 
                        max="390" 
                        value={picCarouselWidth} 
                        onChange={(e) => setPicCarouselWidth(Number(e.target.value))}
                        className="w-full accent-rose-500 cursor-pointer h-1 bg-slate-800 rounded-lg appearance-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 mt-2 flex flex-col gap-2">
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                    <span>General viewport scale</span>
                    <button 
                      type="button"
                      onClick={() => {
                        const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
                        setCardWidth(isMobile ? 280 : 360);
                        setContainerPadding(isMobile ? 22 : 57);
                        setChevronOffset(16);
                        setMiniChevronOffset(18);
                        setArrowCarouselWidth(isMobile ? 210 : 290);
                        setPicCarouselWidth(isMobile ? 210 : 290);
                      }}
                      className="text-rose-400 hover:text-rose-300 font-bold uppercase underline cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleDownloadCSV}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-mono font-bold text-[10px] uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                    title="Export current sign configurations to a CSV spreadsheet"
                  >
                    <Lucide.Download className="w-3.5 h-3.5" />
                    Download CSV
                  </button>
                </div>
              </div>

              {/* Card 7: Plank Details & Position Tuning */}
              <div 
                id="plank-details-tuning-card" 
                className="min-h-[245px] sm:min-h-[250px] flex-shrink-0 snap-center bg-slate-900 text-slate-100 border border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between font-sans overflow-y-auto"
                style={{ width: 'var(--card-final-width)' }}
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded leading-none text-xs">07</span>
                      <span className="font-mono font-bold text-emerald-400 tracking-wide uppercase text-xs">Plank advanced positioning</span>
                    </div>
                  </div>

                  <div className="space-y-3 max-h-[145px] pr-1 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                    {/* Pictograms Section */}
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wilder mb-1 px-1 border-l-2 border-emerald-500">Pictograms</div>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                        <div>
                          <label className="block text-[8px] font-mono text-slate-550 uppercase">Left Inset ({plankPicLeft}px)</label>
                          <input 
                            type="range" min="2" max="30" step="0.5" value={plankPicLeft} 
                            onChange={(e) => setPlankPicLeft(Number(e.target.value))}
                            className="w-full accent-emerald-500 h-1 bg-slate-800 rounded appearance-none cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-mono text-slate-550 uppercase">Right Inset ({plankPicRight}px)</label>
                          <input 
                            type="range" min="2" max="30" step="0.5" value={plankPicRight} 
                            onChange={(e) => setPlankPicRight(Number(e.target.value))}
                            className="w-full accent-emerald-500 h-1 bg-slate-800 rounded appearance-none cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-mono text-slate-550 uppercase">Top/Bot Y ({plankPicY}px)</label>
                          <input 
                            type="range" min="4" max="20" step="0.5" value={plankPicY} 
                            onChange={(e) => setPlankPicY(Number(e.target.value))}
                            className="w-full accent-emerald-500 h-1 bg-slate-800 rounded appearance-none cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-mono text-slate-550 uppercase">Size ({plankPicSize}px)</label>
                          <input 
                            type="range" min="8" max="24" step="0.1" value={plankPicSize} 
                            onChange={(e) => setPlankPicSize(Number(e.target.value))}
                            className="w-full accent-emerald-500 h-1 bg-slate-800 rounded appearance-none cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Arrows & Logos Section */}
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wilder mb-1 px-1 border-l-2 border-emerald-500">Arrows & Logos</div>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                        <div>
                          <label className="block text-[8px] font-mono text-slate-550 uppercase">Left Inset ({plankArrowLeft}px)</label>
                          <input 
                            type="range" min="2" max="30" step="0.5" value={plankArrowLeft} 
                            onChange={(e) => setPlankArrowLeft(Number(e.target.value))}
                            className="w-full accent-emerald-500 h-1 bg-slate-800 rounded appearance-none cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-mono text-slate-550 uppercase">Right Inset ({plankArrowRight}px)</label>
                          <input 
                            type="range" min="2" max="30" step="0.5" value={plankArrowRight} 
                            onChange={(e) => setPlankArrowRight(Number(e.target.value))}
                            className="w-full accent-emerald-500 h-1 bg-slate-800 rounded appearance-none cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-mono text-slate-550 uppercase">Top/Bot Y ({plankArrowY}px)</label>
                          <input 
                            type="range" min="4" max="20" step="0.5" value={plankArrowY} 
                            onChange={(e) => setPlankArrowY(Number(e.target.value))}
                            className="w-full accent-emerald-500 h-1 bg-slate-800 rounded appearance-none cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-mono text-slate-550 uppercase">Size ({plankArrowSize}px)</label>
                          <input 
                            type="range" min="8" max="24" step="0.1" value={plankArrowSize} 
                            onChange={(e) => setPlankArrowSize(Number(e.target.value))}
                            className="w-full accent-emerald-500 h-1 bg-slate-800 rounded appearance-none cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Text Placement Section */}
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wilder mb-1 px-1 border-l-2 border-emerald-500">Text Placement</div>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                        <div>
                          <label className="block text-[8px] font-mono text-slate-550 uppercase">Solo Left ({plankTextLeft}px)</label>
                          <input 
                            type="range" min="0" max="30" step="0.5" value={plankTextLeft} 
                            onChange={(e) => setPlankTextLeft(Number(e.target.value))}
                            className="w-full accent-emerald-500 h-1 bg-slate-800 rounded appearance-none cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-mono text-slate-550 uppercase">Solo Right ({plankTextRight}px)</label>
                          <input 
                            type="range" min="0" max="350" step="1" value={plankTextRight} 
                            onChange={(e) => setPlankTextRight(Number(e.target.value))}
                            className="w-full accent-emerald-500 h-1 bg-slate-800 rounded appearance-none cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-mono text-slate-550 uppercase">With Icon L ({plankTextWithElementLeft}px)</label>
                          <input 
                            type="range" min="10" max="60" step="0.5" value={plankTextWithElementLeft} 
                            onChange={(e) => setPlankTextWithElementLeft(Number(e.target.value))}
                            className="w-full accent-emerald-500 h-1 bg-slate-800 rounded appearance-none cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-mono text-slate-550 uppercase">With Icon R ({plankTextWithElementRight}px)</label>
                          <input 
                            type="range" min="10" max="350" step="1" value={plankTextWithElementRight} 
                            onChange={(e) => setPlankTextWithElementRight(Number(e.target.value))}
                            className="w-full accent-emerald-500 h-1 bg-slate-800 rounded appearance-none cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-mono text-slate-550 uppercase">With Pic L ({plankTextWithPicLeft}px)</label>
                          <input 
                            type="range" min="0" max="60" step="0.5" value={plankTextWithPicLeft} 
                            onChange={(e) => setPlankTextWithPicLeft(Number(e.target.value))}
                            className="w-full accent-emerald-500 h-1 bg-slate-800 rounded appearance-none cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-mono text-slate-550 uppercase">With Pic R ({plankTextWithPicRight}px)</label>
                          <input 
                            type="range" min="0" max="350" step="1" value={plankTextWithPicRight} 
                            onChange={(e) => setPlankTextWithPicRight(Number(e.target.value))}
                            className="w-full accent-emerald-500 h-1 bg-slate-800 rounded appearance-none cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-mono text-slate-550 uppercase">Both Pic/Arrow L ({plankTextWithBothLeft}px)</label>
                          <input 
                            type="range" min="0" max="60" step="0.5" value={plankTextWithBothLeft} 
                            onChange={(e) => setPlankTextWithBothLeft(Number(e.target.value))}
                            className="w-full accent-emerald-500 h-1 bg-slate-800 rounded appearance-none cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-mono text-slate-550 uppercase">Both Pic/Arrow R ({plankTextWithBothRight}px)</label>
                          <input 
                            type="range" min="0" max="350" step="1" value={plankTextWithBothRight} 
                            onChange={(e) => setPlankTextWithBothRight(Number(e.target.value))}
                            className="w-full accent-emerald-500 h-1 bg-slate-800 rounded appearance-none cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-mono text-slate-550 uppercase">Line 1 Y ({plankTextYFirstLine}px)</label>
                          <input 
                            type="range" min="4" max="23" step="0.5" value={plankTextYFirstLine} 
                            onChange={(e) => setPlankTextYFirstLine(Number(e.target.value))}
                            className="w-full accent-emerald-500 h-1 bg-slate-800 rounded appearance-none cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-mono text-slate-550 uppercase">Line 2 Y ({plankTextYSecondLine}px)</label>
                          <input 
                            type="range" min="4" max="23" step="0.5" value={plankTextYSecondLine} 
                            onChange={(e) => setPlankTextYSecondLine(Number(e.target.value))}
                            className="w-full accent-emerald-500 h-1 bg-slate-800 rounded appearance-none cursor-pointer"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-[8px] font-mono text-slate-550 uppercase">Text Font Size ({plankTextSize}px)</label>
                          <input 
                            type="range" min="8" max="24" step="0.1" value={plankTextSize} 
                            onChange={(e) => setPlankTextSize(Number(e.target.value))}
                            className="w-full accent-emerald-500 h-1 bg-slate-800 rounded appearance-none cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Reset Button Position Section */}
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wilder mb-1 px-1 border-l-2 border-emerald-500">Reset Button Position</div>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                        <div>
                          <label className="block text-[8px] font-mono text-slate-550 uppercase">Top Offset ({signageResetTop}px)</label>
                          <input 
                            type="range" min="0" max="100" step="1" value={signageResetTop} 
                            onChange={(e) => setSignageResetTop(Number(e.target.value))}
                            className="w-full accent-emerald-500 h-1 bg-slate-800 rounded appearance-none cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-mono text-slate-550 uppercase">Right Offset ({signageResetRight}px)</label>
                          <input 
                            type="range" min="0" max="100" step="1" value={signageResetRight} 
                            onChange={(e) => setSignageResetRight(Number(e.target.value))}
                            className="w-full accent-emerald-500 h-1 bg-slate-800 rounded appearance-none cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                <div className="pt-1.5 border-t border-slate-800 mt-1.5 flex justify-between items-center text-[10px] font-mono text-slate-400">
                  <span>Plank details tuner</span>
                  <button 
                    type="button"
                    onClick={() => {
                      setPlankPicLeft(11.5);
                      setPlankPicRight(11.5);
                      setPlankPicY(11.5);
                      setPlankPicSize(16.12);
                      setPlankArrowLeft(12);
                      setPlankArrowRight(12);
                      setPlankArrowY(11.5);
                      setPlankArrowSize(18.5);
                      setPlankTextLeft(28);
                      setPlankTextRight(28);
                      setPlankTextWithElementLeft(27);
                      setPlankTextWithElementRight(27);
                      setPlankTextWithBothLeft(27);
                      setPlankTextWithBothRight(27);
                      setPlankTextWithPicLeft(28);
                      setPlankTextWithPicRight(28);
                      setPlankTextYFirstLine(12);
                      setPlankTextYSecondLine(12);
                      setPlankTextSize(17.1);
                      setSignageResetTop(12);
                      setSignageResetRight(12);
                    }}
                    className="text-emerald-400 hover:text-emerald-300 font-bold uppercase underline cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Card 8: DAS Custom Tuning & Dev Tools */}
              <div 
                id="das-custom-tuning-dev-card" 
                className="min-h-[245px] sm:min-h-[250px] flex-shrink-0 snap-center bg-slate-900 text-slate-100 border border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between font-sans overflow-y-auto"
                style={{ width: 'var(--card-final-width)' }}
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-rose-550 bg-rose-500/10 px-1.5 py-0.5 rounded leading-none text-xs">08</span>
                      <span className="font-mono font-bold text-rose-400 tracking-wide uppercase text-xs">DAS Custom Tuning & Dev Tools</span>
                    </div>
                  </div>

                  <div className="space-y-3 max-h-[155px] pr-1 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                    
                    {/* Size and Red-on-White scaling */}
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-1 border-l-2 border-rose-500">Sizing Controls</div>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                        <div>
                          <label className="block text-[8px] font-mono text-slate-400 uppercase">DAS Base Size ({dasBaseSize}px)</label>
                          <input 
                            type="range" min="8" max="32" step="0.5" value={dasBaseSize} 
                            onChange={(e) => setDasBaseSize(Number(e.target.value))}
                            className="w-full accent-rose-500 h-1 bg-slate-800 rounded appearance-none cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-mono text-slate-400 uppercase">Red-on-White Scale ({dasRedOnWhiteScale}x)</label>
                          <input 
                            type="range" min="0.8" max="2.5" step="0.05" value={dasRedOnWhiteScale} 
                            onChange={(e) => setDasRedOnWhiteScale(Number(e.target.value))}
                            className="w-full accent-rose-500 h-1 bg-slate-800 rounded appearance-none cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Vertical Alignment control */}
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-1 border-l-2 border-rose-500">Vertical Alignment</div>
                      <div>
                        <label className="block text-[8px] font-mono text-slate-400 uppercase">DAS Vertical Offset ({dasVerticalOffset > 0 ? `+${dasVerticalOffset}` : dasVerticalOffset}px)</label>
                        <input 
                          type="range" min="-10" max="10" step="0.1" value={dasVerticalOffset} 
                          onChange={(e) => setDasVerticalOffset(Number(e.target.value))}
                          className="w-full accent-rose-500 h-1 bg-slate-800 rounded appearance-none cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Left Alignment controls */}
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-1 border-l-2 border-rose-500">Left Alignment Tuning</div>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                        <div>
                          <label className="block text-[8px] font-mono text-slate-400 uppercase">L Spacing Offset ({dasLeftSpacingOffset}px)</label>
                          <input 
                            type="range" min="-50" max="100" step="0.5" value={dasLeftSpacingOffset} 
                            onChange={(e) => setDasLeftSpacingOffset(Number(e.target.value))}
                            className="w-full accent-rose-500 h-1 bg-slate-800 rounded appearance-none cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-mono text-slate-400 uppercase">L Outer Padding ({dasLeftPadding}px)</label>
                          <input 
                            type="range" min="0" max="50" step="0.5" value={dasLeftPadding} 
                            onChange={(e) => setDasLeftPadding(Number(e.target.value))}
                            className="w-full accent-rose-500 h-1 bg-slate-800 rounded appearance-none cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Spacing & Margin params (Right Side) */}
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-1 border-l-2 border-rose-500">Right Alignment Tuning</div>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                        <div>
                          <label className="block text-[8px] font-mono text-slate-400 uppercase">Spacing Mult. ({dasSpacingMultiplier}x)</label>
                          <input 
                            type="range" min="0.1" max="2.0" step="0.02" value={dasSpacingMultiplier} 
                            onChange={(e) => setDasSpacingMultiplier(Number(e.target.value))}
                            className="w-full accent-rose-500 h-1 bg-slate-800 rounded appearance-none cursor-pointer"
                          />
                          <span className="text-[7px] text-slate-500 font-mono block mt-0.5 leading-none">0.48x fits letter 'o' width</span>
                        </div>
                        <div>
                          <label className="block text-[8px] font-mono text-slate-400 uppercase">R Spacing Offset ({dasRightSpacingOffset}px)</label>
                          <input 
                            type="range" min="0" max="100" step="0.5" value={dasRightSpacingOffset} 
                            onChange={(e) => setDasRightSpacingOffset(Number(e.target.value))}
                            className="w-full accent-rose-500 h-1 bg-slate-800 rounded appearance-none cursor-pointer"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-[8px] font-mono text-slate-400 uppercase">R Outer Padding ({dasRightPadding}px)</label>
                          <input 
                            type="range" min="0" max="100" step="0.5" value={dasRightPadding} 
                            onChange={(e) => setDasRightPadding(Number(e.target.value))}
                            className="w-full accent-rose-500 h-1 bg-slate-800 rounded appearance-none cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Active DAS Positioning Quick Toggle */}
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-1 border-l-2 border-rose-500">DAS Placement Position</div>
                      <div className="flex gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => {
                            setLogoPosition('left');
                            updateDasPresets(logoType, 'left');
                          }}
                          className={`flex-grow py-1 rounded border font-mono font-bold text-[9px] uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                            logoPosition === 'left' ? 'bg-rose-550 border-rose-550 text-white animate-none' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                          }`}
                        >
                          Left of Text
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setLogoPosition('right');
                            updateDasPresets(logoType, 'right');
                          }}
                          className={`flex-grow py-1 rounded border font-mono font-bold text-[9px] uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                            logoPosition === 'right' ? 'bg-rose-550 border-rose-550 text-white animate-none' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-755'
                          }`}
                        >
                          Right of Text
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

                <div className="pt-1.5 border-t border-slate-800 mt-1.5 flex justify-between items-center text-[10px] font-mono text-slate-400">
                  <span>DAS details tuner</span>
                  <button 
                    type="button"
                    onClick={() => {
                      updateDasPresets(logoType, logoPosition);
                    }}
                    className="text-rose-450 hover:text-rose-400 font-bold uppercase underline cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              </div>

            </div>

            {/* Scroll indicator with interactive chevrons for mobile portrait screens */}
            <div className="sm:hidden flex items-center justify-center gap-1 select-none pb-2 pt-1">
              <button
                type="button"
                onClick={() => handleScroll('left')}
                disabled={!canScrollLeft}
                className="flex items-center justify-center w-8 h-8 bg-transparent text-slate-600 hover:text-[#a8081b] hover:scale-115 active:text-[#a8081b] active:scale-110 transition-all focus:outline-none cursor-pointer disabled:opacity-20 disabled:pointer-events-none"
                title="Scroll Left"
              >
                <Lucide.ChevronLeft className="w-5 h-5 shrink-0" />
              </button>

              <span className="text-[10px] font-mono font-bold tracking-wider text-[#012169]/75 select-none animate-pulse">
                &nbsp;&nbsp;
              </span>

              <button
                type="button"
                onClick={() => handleScroll('right')}
                disabled={!canScrollRight}
                className="flex items-center justify-center w-8 h-8 bg-transparent text-slate-600 hover:text-[#a8081b] hover:scale-115 active:text-[#a8081b] active:scale-110 transition-all focus:outline-none cursor-pointer disabled:opacity-20 disabled:pointer-events-none"
                title="Scroll Right"
              >
                <Lucide.ChevronRight className="w-5 h-5 shrink-0" />
              </button>
            </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Custom Layout Drawer Handle & Download Sign Button placed elegantly below the control cards */}
        <div className="pt-1 mt-1 flex justify-center gap-2 pb-1 max-w-[480px] mx-auto w-full items-center">
          <button
            type="button"
            onClick={() => setIsCustomLayoutOpen(!isCustomLayoutOpen)}
            className="flex-grow h-10 flex items-center justify-between px-3.5 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 border border-slate-200/60 rounded-lg focus:outline-none cursor-pointer group shadow-sm hover:shadow transition-all duration-300 min-w-0"
          >
            <div className="flex items-center gap-1.5 min-w-0 flex-grow">
              <Lucide.Sliders className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#012169] transition-colors shrink-0" />
              <span className="text-[10px] font-mono font-black text-slate-400 group-hover:text-[#012169] uppercase tracking-wider transition-colors shrink-0">
                CUSTOM LAYOUT
              </span>
              <span className="text-slate-300 shrink-0 hidden sm:inline">|</span>
              <span className="text-xs text-slate-500 font-sans font-semibold group-hover:text-slate-800 transition-colors truncate hidden sm:inline">
                {isCustomLayoutOpen ? "Close drawer" : "Adjust spacing & alignment"}
              </span>
            </div>
            <Lucide.ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 shrink-0 ml-3 ${isCustomLayoutOpen ? 'rotate-180 text-[#012169]' : ''}`} />
          </button>

          <button
            type="button"
            onClick={downloadSignPNG}
            className="flex items-center justify-center w-10 h-10 bg-[#012169] hover:bg-[#a8081b] text-white border border-transparent rounded-lg focus:outline-none cursor-pointer shadow-sm hover:shadow hover:scale-105 active:scale-95 transition-all duration-300 shrink-0"
            title="Download Sign (PNG)"
            id="btn-download-sign"
          >
            <motion.div
              animate={{
                y: [0, 2, 0, -1, 0]
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
                repeatDelay: 1.5
              }}
              className="flex items-center justify-center shrink-0"
            >
              <Lucide.Download className="w-5 h-5 shrink-0" />
            </motion.div>
          </button>
        </div>

      </div>

    </div>
  );
}
