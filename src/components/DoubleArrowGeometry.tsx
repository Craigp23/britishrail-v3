import { useState } from 'react';
import { RefreshCw } from 'lucide-react';

interface ColourStop {
  id: string;
  name: string;
  value: string;
}

const COLOUR_STOPS: ColourStop[] = [
  { id: 'flame-red', name: 'Flame Red', value: '#DC241F' },
  { id: 'rail-blue', name: 'Rail Blue', value: '#002F6C' },
  { id: 'electric-teal', name: 'Electric Teal', value: '#0d9488' },
  { id: 'silver', name: 'Silver', value: '#CBD5E1' },
  { id: 'white', name: 'White', value: '#FFFFFF' },
  { id: 'black', name: 'Black', value: '#000000' }
];

export default function DoubleArrowGeometry() {
  const [strokeWidth, setStrokeWidth] = useState<number>(6);
  const [gapOffset, setGapOffset] = useState<number>(15); // Arrow head horizontal offset
  const [foregroundColourIndex, setForegroundColourIndex] = useState<number>(0); // Flame Red
  const [backgroundColourIndex, setBackgroundColourIndex] = useState<number>(5); // Black

  const foregroundColour = COLOUR_STOPS[foregroundColourIndex].value;
  const backgroundColour = COLOUR_STOPS[backgroundColourIndex].value;

  const handleReset = () => {
    setStrokeWidth(6);
    setGapOffset(15);
    setForegroundColourIndex(0);
    setBackgroundColourIndex(5);
  };

  // Base coordinates mapping to represent the official 62x39 grid
  const X_mid = 31;
  const Y_mid = 19.5;
  const dy_half = 7.1; // Baseline offset for the horizontal tracks from central Y_mid (19.5)

  // Derived vertical track levels
  const y_top_track = Y_mid - dy_half;     // 12.4
  const y_bottom_track = Y_mid + dy_half;  // 26.6

  // Horizontal coordinates for arrow joints/bends based on gapOffset
  const X_left_bend = X_mid - gapOffset;   // Standard: 16 (when gapOffset is 15)
  const X_right_bend = X_mid + gapOffset;  // Standard: 46 (when gapOffset is 15)

  // Mathematically derived outer points of the parallel diagonals (using the exact 1.5x height split ratio)
  const X_outer_left = X_mid - 2 * gapOffset;   // Standard: 1 (when gapOffset is 15)
  const X_outer_right = X_mid + 2 * gapOffset;  // Standard: 61 (when gapOffset is 15)

  // Y-coordinates of the out-of-bounds ends of the parallel diagonals (reaching y=0 and y=39 clipping borders)
  const Y_outer_top = y_top_track - 1.5 * (y_bottom_track - y_top_track);    // -8.9
  const Y_outer_bottom = y_bottom_track + 1.5 * (y_bottom_track - y_top_track); // 47.9

  // Stroke thicknesses, keeping horizontal slightly wider (1.0667x) for design visual balance
  const diagonal_stroke = strokeWidth;
  const horizontal_stroke = strokeWidth * (6.4 / 6.0);

  const isDarkBg = ['black', 'rail-blue', 'electric-teal'].includes(COLOUR_STOPS[backgroundColourIndex].id);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 lg:p-8" id="double-arrow-geometry-section">
      
      {/* Title block styled with grid to align with controls section below */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start lg:items-center mb-6">
        <div className="lg:col-span-8 flex justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-display font-bold text-rail-blue tracking-tight">
              Geometry of the double arrow icon (Gerry Barney, 1965)
            </h3>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Understand how mathematical symmetry and grid lines forged an iconic railway symbol.
            </p>
          </div>
          <button
            onClick={handleReset}
            className="text-slate-500 hover:text-rail-blue p-2 hover:bg-slate-100 rounded-full transition cursor-pointer flex-shrink-0 animate-fade-in self-center"
            title="Reset Geometry"
            id="btn-reset-geometry"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        <div className="lg:col-span-4 w-full">
          {/* Colour collision warning (preserves layout and aligns perfectly with the controls below) */}
          <div 
            className={`p-2 bg-amber-50 border border-amber-200 rounded-lg text-[10px] text-amber-800 font-sans transition-all duration-200 text-center w-full ${
              foregroundColourIndex === backgroundColourIndex 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-95 pointer-events-none'
            }`} 
            id="contrast-warning"
          >
            Foreground and background colours match.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* SVG Drawing Canvas (8 cols) */}
        <div 
          className={`lg:col-span-8 rounded-xl p-4 sm:p-6 shadow-inner relative flex justify-center items-center aspect-[4/3] max-w-lg mx-auto w-full overflow-hidden transition-all duration-300 ${
            COLOUR_STOPS[backgroundColourIndex].id === 'white' ? 'border border-slate-200' : ''
          }`}
          style={{ backgroundColor: backgroundColour }}
          id="drawing-canvas-container"
        >
          
          {/* Double Arrow Symbol Render */}
          <svg 
            viewBox="0 0 62 39" 
            className="w-full max-h-52 select-none relative z-10 overflow-hidden"
            fill="none" 
            stroke="none"
            style={{ overflow: 'hidden' }}
          >
            {/* Brand geometry paths styled exactly per official guidelines */}
            <g strokeLinecap="butt" strokeLinejoin="miter" fill="none">
              {/* Top and Bottom track stems */}
              <path 
                d={`M 0,${y_top_track} H 62 M 62,${y_bottom_track} H 0`} 
                className="transition-all duration-150"
                stroke={foregroundColour} 
                strokeWidth={horizontal_stroke} 
              />
              {/* Parallel outer diagonals and intersecting inner branch (zigzag) */}
              <path 
                d={`M ${X_outer_left},${Y_outer_top} L ${X_right_bend},${y_top_track} L ${X_left_bend},${y_bottom_track} L ${X_outer_right},${Y_outer_bottom}`} 
                className="transition-all duration-150"
                stroke={foregroundColour} 
                strokeWidth={diagonal_stroke} 
              />
            </g>
          </svg>

          {/* Floating blueprint spec metrics */}
          <div className={`absolute bottom-3 left-4 text-[10px] font-mono flex space-x-4 transition-colors duration-300 ${
            isDarkBg ? 'text-slate-400' : 'text-slate-600'
          }`}>
            <span>GRID: 24x40 BLUEPRINT</span>
            <span>ANGLE: 32.7° STANDARD</span>
            <span>RATIO: 1.667 (5:3)</span>
          </div>

        </div>

        {/* Sliders and Controls (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Foreground Colour Slider */}
          <div id="foreground-colour-control">
            <div className="flex justify-between items-center text-xs font-mono font-medium text-slate-500 uppercase tracking-wider mb-2">
              <span>Foreground Colour</span>
              <span className="text-slate-700 font-sans font-semibold">{COLOUR_STOPS[foregroundColourIndex].name}</span>
            </div>
            <div className="relative pt-1 px-1">
              <input
                type="range"
                min="0"
                max="5"
                step="1"
                value={foregroundColourIndex}
                onChange={(e) => setForegroundColourIndex(Number(e.target.value))}
                className="w-full accent-rail-red cursor-pointer"
              />
              {/* Tick marks with magnetic behavior for key values */}
              <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-2 px-0.5">
                {COLOUR_STOPS.map((stop, idx) => (
                  <button
                    key={`fg-stop-${stop.id}`}
                    type="button"
                    onClick={() => setForegroundColourIndex(idx)}
                    className={`flex flex-col items-center group cursor-pointer ${
                      foregroundColourIndex === idx ? 'text-slate-800 font-bold' : 'hover:text-slate-600'
                    }`}
                  >
                    <span 
                      className={`w-3 h-3 rounded-full mb-1 transition-transform border border-slate-300 ${
                        foregroundColourIndex === idx ? 'scale-125 border-slate-600 ring-2 ring-slate-100' : 'group-hover:scale-110'
                      }`} 
                      style={{ backgroundColor: stop.value }} 
                    />
                    <span className="hidden sm:inline text-[8px] whitespace-nowrap">{stop.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Background Colour Slider */}
          <div id="background-colour-control">
            <div className="flex justify-between items-center text-xs font-mono font-medium text-slate-500 uppercase tracking-wider mb-2">
              <span>Background Colour</span>
              <span className="text-slate-700 font-sans font-semibold">{COLOUR_STOPS[backgroundColourIndex].name}</span>
            </div>
            <div className="relative pt-1 px-1">
              <input
                type="range"
                min="0"
                max="5"
                step="1"
                value={backgroundColourIndex}
                onChange={(e) => setBackgroundColourIndex(Number(e.target.value))}
                className="w-full accent-rail-red cursor-pointer"
              />
              {/* Tick marks with magnetic behavior for key values */}
              <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-2 px-0.5">
                {COLOUR_STOPS.map((stop, idx) => (
                  <button
                    key={`bg-stop-${stop.id}`}
                    type="button"
                    onClick={() => setBackgroundColourIndex(idx)}
                    className={`flex flex-col items-center group cursor-pointer ${
                      backgroundColourIndex === idx ? 'text-slate-800 font-bold' : 'hover:text-slate-600'
                    }`}
                  >
                    <span 
                      className={`w-3 h-3 rounded-full mb-1 transition-transform border border-slate-300 ${
                        backgroundColourIndex === idx ? 'scale-125 border-slate-600 ring-2 ring-slate-100' : 'group-hover:scale-110'
                      }`} 
                      style={{ backgroundColor: stop.value }} 
                    />
                    <span className="hidden sm:inline text-[8px] whitespace-nowrap">{stop.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stroke Slider */}
          <div id="stroke-thickness-control">
            <div className="flex justify-between items-center text-xs font-mono font-medium text-slate-500 uppercase tracking-wider mb-2">
              <span>Stroke Thickness</span>
              <span className="text-slate-700 font-semibold">{strokeWidth}px</span>
            </div>
            <input
              type="range"
              min="3"
              max="14"
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(Number(e.target.value))}
              className="w-full accent-rail-red cursor-pointer"
            />
          </div>

          {/* Offset Slider */}
          <div id="arrow-separation-control">
            <div className="flex justify-between items-center text-xs font-mono font-medium text-slate-500 uppercase tracking-wider mb-2">
              <span>Arrow Separation</span>
              <span className="text-slate-700 font-semibold">{gapOffset}px</span>
            </div>
            <input
              type="range"
              min="5"
              max="28"
              value={gapOffset}
              onChange={(e) => setGapOffset(Number(e.target.value))}
              className="w-full accent-rail-red cursor-pointer"
            />
          </div>

        </div>

      </div>

    </div>
  );
}
