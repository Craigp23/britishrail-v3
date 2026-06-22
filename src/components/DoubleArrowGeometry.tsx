import { useState, ChangeEvent, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { DraftingTriangleIcon } from './DraftingTriangleIcon';

interface ColourStop {
  id: string;
  name: string;
  value: string;
}

const COLOUR_STOPS: ColourStop[] = [
  { id: 'flame-red', name: 'Flame Red', value: '#FF3300' },
  { id: 'rail-blue', name: 'Rail Blue', value: '#00a9cc' },
  { id: 'electric-teal', name: 'Electric Teal', value: '#007f99' },
  { id: 'rail-grey', name: 'Rail Grey', value: '#C0C2B5' },
  { id: 'white', name: 'White', value: '#FFFFFF' },
  { id: 'black', name: 'Black', value: '#000000' }
];

const BUTTON_NAMES: Record<string, string> = {
  'flame-red': 'Red',
  'rail-blue': 'Blue',
  'electric-teal': 'Teal',
  'rail-grey': 'Grey',
  'white': 'White',
  'black': 'Black'
};

// Center points and base measurements corresponding to the new 130x78 grid
interface MagneticSliderProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  defaultValue: number;
  displayValue: string;
  onChange: (val: number) => void;
}

function MagneticSlider({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  defaultValue,
  displayValue,
  onChange
}: MagneticSliderProps) {
  // Compute percentages for absolute placement
  const pctCurrent = ((value - min) / (max - min)) * 100;
  const pctDefault = ((defaultValue - min) / (max - min)) * 100;

  const handleSliderChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  return (
    <div id={id} className="w-full select-none">
      <div className="flex justify-between items-center text-xs font-mono font-medium text-slate-500 uppercase tracking-wider mb-1">
        <span>{label}</span>
        <span className="text-slate-700 font-semibold text-xs">{displayValue}</span>
      </div>
      
      {/* Custom Slider Track and Custom Thumb Wrapper */}
      <div className="relative w-full h-6 flex items-center group">
        {/* Base track (light gray) */}
        <div className="absolute left-0 right-0 h-[7px] bg-slate-200/80 rounded-full" />
        
        {/* Highlight track (red, up to current value) */}
        <div 
          className="absolute left-0 h-[7px] bg-[#a8081b] rounded-full transition-all duration-75"
          style={{ width: `${pctCurrent}%` }}
        />

        {/* Snap Halo Ring at default position */}
        <div 
          className="absolute -translate-x-1/2 w-[26px] h-[26px] rounded-full border-[4px] border-[#a8081b] bg-transparent pointer-events-none z-10 flex items-center justify-center"
          style={{ left: `${pctDefault}%` }}
        />

        {/* Custom Thumb */}
        <div 
          className="absolute -translate-x-1/2 w-[12px] h-[12px] rounded-full bg-[#a8081b] border border-[#a8081b] shadow-sm pointer-events-none z-20 group-hover:scale-125 transition-transform duration-75"
          style={{ left: `${pctCurrent}%` }}
        />

        {/* Invisible native slider control overlay to capture events */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleSliderChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
        />
      </div>
    </div>
  );
}

export default function DoubleArrowGeometry() {
  const [strokeWidth, setStrokeWidth] = useState<number>(13);
  const [gapOffset, setGapOffset] = useState<number>(15.5); // Arrow head horizontal offset
  const [foregroundColourIndex, setForegroundColourIndex] = useState<number>(0); // Flame Red
  const [backgroundColourIndex, setBackgroundColourIndex] = useState<number>(4); // White
  const [gridOpacity, setGridOpacity] = useState<number>(45);
  const [taperAngle, setTaperAngle] = useState<number>(2.3); // In degrees. Standard: +2.3 deg (corresponds to authentic photoshop template)

  const [isMobile, setIsMobile] = useState<boolean>(typeof window !== 'undefined' && window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Save custom DAS parameters to localStorage so RailAlphabetTypewriter can consume them in real-time
  useEffect(() => {
    localStorage.setItem('rail-alphabet-custom-das-geometry', JSON.stringify({
      strokeWidth,
      gapOffset,
      foregroundColourIndex,
      backgroundColourIndex,
      taperAngle
    }));
    window.dispatchEvent(new Event('custom-das-updated'));
  }, [strokeWidth, gapOffset, foregroundColourIndex, backgroundColourIndex, taperAngle]);

  const foregroundColour = COLOUR_STOPS[foregroundColourIndex].value;
  const backgroundColour = COLOUR_STOPS[backgroundColourIndex].value;

  const handleReset = () => {
    setStrokeWidth(13);
    setGapOffset(15.5);
    setForegroundColourIndex(0);
    setBackgroundColourIndex(4);
    setGridOpacity(45);
    setTaperAngle(2.3);
  };

  // Track centerlines
  const y_top_track_center = 25.5;
  const y_bottom_track_center = 53.5;

  // Derived vertical track levels
  const y_top_track_top = y_top_track_center - strokeWidth / 2;
  const y_top_track_bottom = y_top_track_center + strokeWidth / 2;
  const y_bottom_track_top = y_bottom_track_center - strokeWidth / 2;
  const y_bottom_track_bottom = y_bottom_track_center + strokeWidth / 2;

  // Horizontal coordinates for arrow joints/bends based on gapOffset
  const X_left_bend = 65 - gapOffset;   // Standard: 49.5 (when gapOffset is 15.5)
  const X_right_bend = 65 + gapOffset;  // Standard: 80.5 (when gapOffset is 15.5)

  // Arm 1 (Upper-Left tip center) and Arm 5 (Lower-Right tip center)
  // These are dynamic with gapOffset
  const tip_center_top = X_right_bend - 2.645 * gapOffset; // Standard: 39.5
  const tip_center_bottom = X_left_bend + 2.645 * gapOffset; // Standard: 90.5

  // Lengths of the arms
  const arm_dx_top = tip_center_top - X_right_bend;
  const arm_dy_top = 0 - y_top_track_top;
  const arm_len_top = Math.sqrt(arm_dx_top * arm_dx_top + arm_dy_top * arm_dy_top);

  const arm_dx_bottom = tip_center_bottom - X_left_bend;
  const arm_dy_bottom = 78 - y_bottom_track_bottom;
  const arm_len_bottom = Math.sqrt(arm_dx_bottom * arm_dx_bottom + arm_dy_bottom * arm_dy_bottom);

  // Math to maintain visual (perpendicular) thickness of the diagonals at any Arrow Separation (gapOffset)
  // Base heights and default horizontal offsets at default gapOffset = 15.5, strokeWidth = 13:
  // Crossover segments
  const crossover_L = 2 * gapOffset;
  const crossover_H = Math.max(1, y_bottom_track_top - y_top_track_bottom);
  const multiplier_crossover = Math.sqrt(crossover_H * crossover_H + crossover_L * crossover_L) / crossover_H;
  const multiplier_crossover_default = 2.29589; // value when gapOffset = 15.5, strokeWidth = 13
  const half_W_h_crossover = (strokeWidth * 13.5 / 13) * (multiplier_crossover / multiplier_crossover_default);

  // Arm 1 (Upper-Left Wing)
  const arm_L_top = 2.645 * gapOffset;
  const arm_H_top = Math.max(1, y_top_track_top);
  const multiplier_arm_top = Math.sqrt(arm_H_top * arm_H_top + arm_L_top * arm_L_top) / arm_H_top;
  const multiplier_arm_top_default = 2.3782; // value when gapOffset = 15.5, strokeWidth = 13
  const half_W_h_arm_top = (strokeWidth * 13.5 / 13) * (multiplier_arm_top / multiplier_arm_top_default);

  // Arm 5 (Lower-Right Wing)
  const arm_L_bottom = 2.645 * gapOffset;
  const arm_H_bottom = Math.max(1, 78 - y_bottom_track_bottom);
  const multiplier_arm_bottom = Math.sqrt(arm_H_bottom * arm_H_bottom + arm_L_bottom * arm_L_bottom) / arm_H_bottom;
  const multiplier_arm_bottom_default = 2.4875; // value when gapOffset = 15.5, strokeWidth = 13
  const half_W_h_arm_bottom = (strokeWidth * 13.5 / 13) * (multiplier_arm_bottom / multiplier_arm_bottom_default);

  // Dynamic tip widths including taperAngle, scaled by the same slant multiplier to keep visual thickness identical at all separations
  const activeTaperWidth_top_base = (strokeWidth * 28 / 13) + (arm_len_top * Math.tan((taperAngle * Math.PI) / 180) * 1.65);
  const activeTaperWidth_bottom_base = (strokeWidth * 27 / 13) + (arm_len_bottom * Math.tan((taperAngle * Math.PI) / 180) * 2.22);

  const activeTaperWidth_top = activeTaperWidth_top_base * (multiplier_arm_top / multiplier_arm_top_default);
  const activeTaperWidth_bottom = activeTaperWidth_bottom_base * (multiplier_arm_bottom / multiplier_arm_bottom_default);

  const isDarkBg = ['black', 'rail-blue', 'electric-teal'].includes(COLOUR_STOPS[backgroundColourIndex].id);

  // Graph paper graticule colors with 100% saturation (25% increase from original 76-85%)
  const opacity = (gridOpacity * 1.23) / 100;
  const thinStrokeColor = isDarkBg
    ? `hsla(188, 100%, 53%, ${opacity * 0.7})`   // cyan-400 vivid glow
    : `hsla(175, 100%, 31%, ${opacity * 0.85})`;  // teal-600 vivid print
  const thickStrokeColor = isDarkBg
    ? `hsla(188, 100%, 53%, ${opacity * 1.0})`   // cyan-400 full solid bold graticule
    : `hsla(175, 100%, 24%, ${opacity * 1.0})`;   // teal-700 full solid bold graticule

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 lg:p-8 relative" id="double-arrow-geometry-section">
      
      {/* Title block styled with grid to align with controls section below */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-6 gap-y-2 items-start lg:items-center mb-3 sm:mb-4 lg:mb-6">
        <div className="lg:col-span-8 flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-display font-bold text-rail-blue tracking-tight flex items-center space-x-2">
              <DraftingTriangleIcon className="w-5 h-5 text-rail-red flex-shrink-0" />
              <span>Geometry of the double arrow icon (Gerry Barney, 1965)</span>
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500 font-sans mt-0.5">
              Create your own double arrow logo inspired by the iconic railway symbol forged over 60 years ago.
            </p>
          </div>
        </div>
        <div className="lg:col-span-4 w-full">
          {/* Colour collision warning (preserves layout and aligns perfectly with the controls below) */}
          <div 
            style={{ fontSize: '10pt' }}
            className={`p-1.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 font-sans transition-all duration-200 text-center w-full ${
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
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 lg:gap-6 items-center">
        
        {/* SVG Drawing Canvas (8 cols) */}
        <div 
          className={`lg:col-span-8 rounded-xl relative flex flex-col justify-between shadow-inner max-w-lg mx-auto w-full overflow-hidden transition-all duration-300 p-1 sm:p-4 pb-1 sm:pb-3 h-[205px] sm:h-[384px] ${
            COLOUR_STOPS[backgroundColourIndex].id === 'white' ? 'border border-slate-200' : ''
          }`}
          style={{ 
            backgroundColor: backgroundColour,
          }}
          id="drawing-canvas-container"
        >
          {/* Reset button absolutely positioned at top-right, visually aligned across viewports */}
          <button
            onClick={handleReset}
            style={{
              right: `${isMobile ? 2 : 7}px`,
              top: `${isMobile ? 2 : 7}px`
            }}
            className={`absolute z-20 p-1.5 rounded-[10px] transition-all cursor-pointer border border-transparent shadow-xs ${
              isDarkBg 
                ? 'text-white/60 hover:text-white hover:bg-white/10 hover:border-white/10' 
                : 'text-slate-500 hover:text-[#011F5B] hover:bg-black/5 hover:border-slate-200/40'
            }`}
            title="Reset"
            aria-label="Reset"
            id="btn-reset-geometry-canvas"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          {/* Centered Blueprint Canvas Wrapper to position the grid relative to the frame */}
          <div className="flex-1 flex items-center justify-center w-full min-h-0 pt-0 sm:pt-2">
            {/* Double Arrow Symbol Render with expanded viewBox to scale the grid beautifully larger */}
            <svg 
              viewBox="-10 -10.5 150 99" 
              className="h-full max-h-[155px] sm:max-h-none sm:w-[86%] w-auto aspect-[150/99] select-none relative z-10 overflow-hidden transition-all duration-300"
              style={{ 
                overflow: 'hidden',
                border: gridOpacity > 0 ? `1.5px solid ${thickStrokeColor}` : 'none',
              }}
              fill="none" 
              stroke="none"
            >
              <defs>
                <pattern 
                  id="graph-paper-grid" 
                  width="20" 
                  height="20" 
                  patternUnits="userSpaceOnUse"
                >
                  {/* 5 minor lines (6 squares) between major 20x20 gridlines */}
                  <path 
                    d="M 3.33 0 L 3.33 20 M 6.67 0 L 6.67 20 M 10 0 L 10 20 M 13.33 0 L 13.33 20 M 16.67 0 L 16.67 20 M 0 3.33 L 20 3.33 M 0 6.67 L 20 6.67 M 0 10 L 20 10 M 0 13.33 L 20 13.33 M 0 16.67 L 20 16.67" 
                    stroke={thinStrokeColor} 
                    strokeWidth="0.12" 
                  />
                  {/* 20x20 Bold Grid lines (Major Graticules) */}
                  <path 
                    d="M 20 0 L 20 20 M 0 20 L 20 20" 
                    stroke={thickStrokeColor} 
                    strokeWidth="0.30" 
                  />
                </pattern>
                <clipPath id="arrow-clip">
                  <rect x="0" y="0" width="130" height="78" />
                </clipPath>
              </defs>

              {/* Dynamic Real Graph Paper Background Cover extended to bounds */}
              {gridOpacity > 0 && (
                <rect x="-10" y="-10.5" width="150" height="99" fill="url(#graph-paper-grid)" />
              )}

              {/* Brand geometry paths styled exactly per official guidelines, floating in the center of the grid */}
              <g clipPath="url(#arrow-clip)">
                {/* Top track stem */}
                <polygon 
                  points={`0,${y_top_track_top} 130,${y_top_track_top} 130,${y_top_track_bottom} 0,${y_top_track_bottom}`}
                  fill={foregroundColour}
                  className="transition-all duration-150"
                />
                
                {/* Bottom track stem */}
                <polygon 
                  points={`0,${y_bottom_track_top} 130,${y_bottom_track_top} 130,${y_bottom_track_bottom} 0,${y_bottom_track_bottom}`}
                  fill={foregroundColour}
                  className="transition-all duration-150"
                />
                
                {/* Central Crossover canal */}
                <polygon 
                  points={`${X_left_bend - half_W_h_crossover},${y_bottom_track_top + 0.35} ${X_right_bend - half_W_h_crossover},${y_top_track_bottom - 0.35} ${X_right_bend + half_W_h_crossover},${y_top_track_bottom - 0.35} ${X_left_bend + half_W_h_crossover},${y_bottom_track_top + 0.35}`}
                  fill={foregroundColour}
                  className="transition-all duration-150"
                />

                {/* Tapered upper-left wing (Arm 1) */}
                <polygon 
                  points={`${tip_center_top - activeTaperWidth_top / 2},0 ${tip_center_top + activeTaperWidth_top / 2},0 ${X_right_bend + half_W_h_arm_top},${y_top_track_top + 0.35} ${X_right_bend - half_W_h_arm_top},${y_top_track_top + 0.35}`}
                  fill={foregroundColour}
                  className="transition-all duration-150"
                />

                {/* Tapered lower-right wing (Arm 5) */}
                <polygon 
                  points={`${X_left_bend - half_W_h_arm_bottom},${y_bottom_track_bottom - 0.35} ${tip_center_bottom - activeTaperWidth_bottom / 2},78 ${tip_center_bottom + activeTaperWidth_bottom / 2},78 ${X_left_bend + half_W_h_arm_bottom},${y_bottom_track_bottom - 0.35}`}
                  fill={foregroundColour}
                  className="transition-all duration-150"
                />
              </g>
            </svg>
          </div>

          {/* Bottom aligned Legend & Grid Indicator Row (Only visible on tablet & desktop layouts as requested) */}
          <div className="hidden sm:flex w-full items-end justify-between select-none px-1 sm:px-2 mt-4 z-20">
            {/* Wrap label in a container that matches the scaled heights to prevent vertical layout bleed/empty space inside the canvas */}
            <div className="h-[51px] w-[240px] relative">
              <div 
                className="absolute bottom-0 left-0 flex border-2 border-black bg-white shadow-md rounded-none select-none font-sans h-[64px] min-w-[300px] scale-[0.80] origin-bottom-left transition-all duration-150" 
                id="vintage-drafting-label"
              >
                {/* Left: Solid black block containing font glyph 200 from Brsign */}
                <div className="flex items-center justify-center bg-black text-white px-[18px] border-r-2 border-black min-w-[110px]">
                  <span 
                    style={{ fontFamily: "'Brsign', 'Geist', sans-serif" }} 
                    className="text-[42px] leading-none select-none font-normal"
                  >
                    {String.fromCharCode(200)}
                  </span>
                </div>
                
                {/* Right: Grid matching Jock Kinneir / Gerry Barney specifications */}
                <div className="flex flex-col min-w-[190px]">
                  {/* Row 1 */}
                  <div className="flex flex-1 border-b-2 border-black h-[32px]">
                    <div className="px-3.5 bg-white text-black flex items-center justify-start border-r-2 border-black min-w-[85px]">
                      <span className="text-[12px] font-sans font-extrabold tracking-tight lowercase">sheet no.</span>
                    </div>
                    <div className="px-4 bg-white text-black flex items-center justify-center font-sans font-extrabold text-[18px] flex-1">
                      1/04
                    </div>
                  </div>
                  {/* Row 2 */}
                  <div className="flex flex-1 h-[32px]">
                    <div className="px-3.5 bg-white text-black flex items-center justify-start border-r-2 border-black min-w-[85px]">
                      <span className="text-[12px] font-sans font-extrabold tracking-tight lowercase">issued</span>
                    </div>
                    <div className="px-4 bg-white text-black flex items-center justify-center font-sans font-extrabold text-[15px] whitespace-nowrap flex-1">
                      Apr 1965
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pill button aligned with metadata row, matching mockup */}
            <button
              onClick={() => setGridOpacity(gridOpacity > 0 ? 0 : 60)}
              className={`px-2.5 py-1 rounded text-[10px] font-bold font-mono tracking-wider transition-all duration-150 cursor-pointer select-none border whitespace-nowrap ${
                gridOpacity > 0 
                  ? (isDarkBg ? 'bg-white/10 text-white border-white/20 hover:bg-white/20 shadow-sm' : 'bg-black/5 text-slate-800 border border-black/10 hover:bg-black/10') 
                  : (isDarkBg ? 'bg-transparent text-slate-500 border-transparent hover:text-slate-300' : 'bg-transparent text-slate-400 border-transparent hover:text-slate-600')
              }`}
              title="Quick Toggle Grid Brightness"
            >
              GRID: {gridOpacity > 0 ? `${gridOpacity}%` : 'OFF'}
            </button>
          </div>

        </div>

        {/* Sliders and Controls (4 cols) */}
        <div className="lg:col-span-4">
          <div className="grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-1 gap-x-4 gap-y-[11px] sm:gap-y-[13px] lg:gap-5">
            
            {/* Foreground Colour Selection */}
            <div id="foreground-colour-control">
              <div className="flex justify-between items-center text-xs font-mono font-medium text-slate-500 uppercase tracking-wider mb-0.5 sm:mb-1.5">
                <span>Foreground Colour</span>
                <span className="text-slate-700 font-semibold text-xs">{COLOUR_STOPS[foregroundColourIndex].name}</span>
              </div>
              <div className="bg-slate-50/70 border border-slate-200/50 rounded-xl p-1 sm:p-2 flex justify-between gap-1 items-center">
                {COLOUR_STOPS.map((stop, idx) => (
                  <button
                    key={`fg-stop-${stop.id}`}
                    type="button"
                    onClick={() => setForegroundColourIndex(idx)}
                    className={`flex flex-col items-center group cursor-pointer flex-1 transition-all ${
                      foregroundColourIndex === idx ? 'text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <span 
                      className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full mb-0.5 sm:mb-1 transition-all border ${
                        foregroundColourIndex === idx 
                          ? 'scale-125 border-slate-900 ring-2 ring-white ring-offset-1' 
                          : 'border-slate-300 group-hover:scale-110 shadow-sm'
                      }`} 
                      style={{ backgroundColor: stop.value }} 
                    />
                    <span className="text-[11px] sm:text-[12.5px] font-sans tracking-tight font-medium select-none truncate max-w-full">
                      {BUTTON_NAMES[stop.id]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Background Colour Selection */}
            <div id="background-colour-control">
              <div className="flex justify-between items-center text-xs font-mono font-medium text-slate-500 uppercase tracking-wider mb-0.5 sm:mb-1.5">
                <span>Background Colour</span>
                <span className="text-slate-700 font-semibold text-xs">{COLOUR_STOPS[backgroundColourIndex].name}</span>
              </div>
              <div className="bg-slate-50/70 border border-slate-200/50 rounded-xl p-1 sm:p-2 flex justify-between gap-1 items-center">
                {COLOUR_STOPS.map((stop, idx) => (
                  <button
                    key={`bg-stop-${stop.id}`}
                    type="button"
                    onClick={() => setBackgroundColourIndex(idx)}
                    className={`flex flex-col items-center group cursor-pointer flex-1 transition-all ${
                      backgroundColourIndex === idx ? 'text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <span 
                      className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full mb-0.5 sm:mb-1 transition-all border ${
                        backgroundColourIndex === idx 
                          ? 'scale-125 border-slate-900 ring-2 ring-white ring-offset-1' 
                          : 'border-slate-300 group-hover:scale-110 shadow-sm'
                      }`} 
                      style={{ backgroundColor: stop.value }} 
                    />
                    <span className="text-[11px] sm:text-[12.5px] font-sans tracking-tight font-medium select-none truncate max-w-full">
                      {BUTTON_NAMES[stop.id]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Stroke Thickness Slider */}
            <MagneticSlider
              id="stroke-thickness-control"
              label="Stroke Thickness"
              value={strokeWidth}
              min={4}
              max={20}
              step={1}
              defaultValue={13}
              displayValue={`${strokeWidth}px`}
              onChange={setStrokeWidth}
            />

            {/* Arrow Separation Slider */}
            <MagneticSlider
              id="arrow-separation-control"
              label="Arrow Separation"
              value={gapOffset}
              min={4}
              max={30}
              step={0.5}
              defaultValue={15.5}
              displayValue={`${gapOffset.toFixed(1)}px`}
              onChange={setGapOffset}
            />

            {/* Arm Taper Slider */}
            <MagneticSlider
              id="arm-taper-control"
              label="Arm Taper"
              value={taperAngle}
              min={-6}
              max={8}
              step={0.1}
              defaultValue={2.3}
              displayValue={taperAngle === 0 ? 'PARALLEL' : `${taperAngle > 0 ? '+' : ''}${taperAngle.toFixed(1)}DEG.`}
              onChange={setTaperAngle}
            />

            {/* Grid Brightness Slider */}
            <MagneticSlider
              id="grid-toggle-control"
              label="Grid Brightness"
              value={gridOpacity}
              min={0}
              max={100}
              step={1}
              defaultValue={45}
              displayValue={gridOpacity === 0 ? 'OFF' : `${gridOpacity}%`}
              onChange={setGridOpacity}
            />



          </div>
        </div>

      </div>

    </div>
  );
}
