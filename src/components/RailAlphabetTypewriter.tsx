import { useState, ChangeEvent } from 'react';
import { Trash2 } from 'lucide-react';

interface DirectionConfig {
  key: string;
  name: string;
  angle: number;
}

const DIRECTIONS: Record<string, DirectionConfig> = {
  'SW': { key: 'SW', name: 'Down-Left', angle: 225 },
  'NW': { key: 'NW', name: 'Up-Left', angle: 315 },
  'W': { key: 'W', name: 'Left', angle: 270 },
  'N': { key: 'N', name: 'Up', angle: 0 },
  'S': { key: 'S', name: 'Down', angle: 180 },
  'E': { key: 'E', name: 'Right', angle: 90 },
  'NE': { key: 'NE', name: 'Up-Right', angle: 45 },
  'SE': { key: 'SE', name: 'Down-Right', angle: 135 },
};

// Official National Rail / British Rail double arrow renderer (uses currentColor)
const DoubleArrowSymbol = () => (
  <svg 
    viewBox="-4 -13 70 65" 
    className="h-[1.6em] w-auto transition-all duration-150" 
    fill="none" 
    stroke="currentColor"
    style={{ overflow: 'visible' }}
  >
    <g fill="none">
      <path d="M1,-8.9 L46,12.4 L16,26.6 L61,47.9" stroke="currentColor" strokeWidth="6" strokeLinecap="butt" strokeLinejoin="miter" />
      <path d="M0,12.4 H62 M62,26.6 H0" stroke="currentColor" strokeWidth="6.4" strokeLinecap="butt" strokeLinejoin="miter" />
    </g>
  </svg>
);

// High-fidelity Jock Kinneir / Calvert style wayfinding arrow renderer
const DirectionArrowSVG = ({ angle }: { angle: number }) => (
  <svg 
    viewBox="-4 -13 70 65" 
    className="h-[1.6em] w-auto transition-transform duration-200"
    style={{ transform: `rotate(${angle}deg)` }}
    fill="none" 
    stroke="currentColor"
    strokeWidth="6.2"
    strokeLinejoin="miter"
  >
    {/* Clean shaft ending exactly at the chevron's inner vertex to prevent any tip protrusion */}
    <path d="M31,45 L31,9.25" strokeLinecap="butt" />
    {/* Chevron with clean square ends and sharp mitered joint */}
    <path d="M14,22 L31,5 L48,22" strokeLinecap="square" />
  </svg>
);

export default function RailAlphabetTypewriter() {
  const [typedText, setTypedText] = useState('PLATFORM 9');
  const [boardTheme, setBoardTheme] = useState<'blue' | 'light' | 'teal' | 'red'>('blue');
  const [direction, setDirection] = useState<string>('E'); // Default to standard Right (E)
  const [arrowPosition, setArrowPosition] = useState<'left' | 'right'>('right');
  const [showDoubleArrow, setShowDoubleArrow] = useState<boolean>(false); // Starts OFF in mockup
  const [letterSpacing, setLetterSpacing] = useState<'narrow' | 'normal' | 'wide'>('normal');
  const [textSize, setTextSize] = useState<number>(36); // Set a strong visual default

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTypedText(e.target.value.toUpperCase());
  };

  const getThemeClass = () => {
    switch (boardTheme) {
      case 'light':
        return 'bg-white text-[#002F6C] border border-slate-200 shadow-[0_4px_16px_rgba(0,0,0,0.03)]';
      case 'teal':
        return 'bg-[#0d9488] text-white border border-[#0b7a70] shadow-md';
      case 'red':
        return 'bg-[#a8081b] text-white border border-red-900 shadow-md';
      case 'blue':
      default:
        return 'bg-[#002F6C] text-white border border-blue-950 shadow-md';
    }
  };

  const getSpacingClass = () => {
    if (letterSpacing === 'narrow') return 'tracking-wide';
    if (letterSpacing === 'normal') return 'tracking-[0.16em]';
    return 'tracking-[0.28em]';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 lg:p-8 max-w-4xl mx-auto my-4 transition-all">
      
      {/* Title block matching exact spelling "Typograpy" from prompt & mockup */}
      <div className="mb-6">
        <h3 className="text-lg font-display font-bold text-rail-blue tracking-tight">
          Rail Alphabet Typograpy (Jock Kinneir and Margaret Calvert, 1965)
        </h3>
        <p className="text-xs text-slate-500 font-sans mt-0.5">
          Signage typography crafted for maximum legibility in crowded public halls and platforms. Type below to create your own virtual classic signboard.
        </p>
      </div>

      <div className="space-y-6">
        
        {/* Signboard mockup-accurate ambient background */}
        <div className="bg-slate-50 border border-slate-100 p-6 sm:p-10 rounded-xl flex items-center justify-center min-h-[160px]">
          
          {/* Signboard Plate */}
          <div 
            className={`w-full max-w-xl px-1 sm:px-8 py-5 rounded-md font-display font-bold uppercase transition-all duration-300 flex items-center justify-between min-h-[90px] ${getThemeClass()} ${getSpacingClass()}`}
          >
            {/* Left side accessory container - scales dynamically with textSize */}
            <div className="flex items-center space-x-4 flex-shrink-0 pl-3" style={{ fontSize: `${textSize}px` }}>
              {showDoubleArrow && <DoubleArrowSymbol />}
              {direction !== 'none' && arrowPosition === 'left' && (
                <DirectionArrowSVG angle={DIRECTIONS[direction]?.angle ?? 0} />
              )}
            </div>

            {/* Main station text - dynamically sizes with slider */}
            <span 
              className="text-center select-all overflow-hidden text-ellipsis whitespace-nowrap flex-grow px-4 transition-all animate-fade-in"
              style={{ fontSize: `${textSize}px`, lineHeight: 1 }}
            >
              {typedText || 'PLATFORM 9'}
            </span>

            {/* Right side accessory container - scales dynamically with textSize */}
            <div className="flex items-center justify-end flex-shrink-0 pr-3" style={{ fontSize: `${textSize}px` }}>
              {direction !== 'none' && arrowPosition === 'right' && (
                <DirectionArrowSVG angle={DIRECTIONS[direction]?.angle ?? 0} />
              )}
            </div>
          </div>

        </div>

        {/* 3-Column Control Layout Row 1: BOARD TEXT, TEXT SIZE, LETTER SPACING */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Column 1: Board Text */}
          <div className="flex flex-col">
            <label className="text-xs font-mono font-medium text-slate-400 uppercase tracking-widest mb-2">
              Board Text
            </label>
            <div className="relative">
              <input
                type="text"
                value={typedText}
                onChange={handleInputChange}
                maxLength={30}
                placeholder="PLATFORM 9"
                className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold uppercase focus:ring-1 focus:ring-rail-blue outline-none text-slate-800 transition-all font-display tracking-wider font-bold h-10"
              />
              {typedText && (
                <button
                  type="button"
                  onClick={() => setTypedText('')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-rose-500 transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Column 2: Text Size Slider */}
          <div className="flex flex-col justify-between">
            <div className="flex justify-between items-center text-xs font-mono font-medium text-slate-400 uppercase tracking-widest mb-2">
              <span>Text Size</span>
              <span className="text-slate-600 font-bold">{textSize}px</span>
            </div>
            <div className="flex items-center h-10">
              <input
                type="range"
                min="16"
                max="56"
                value={textSize}
                onChange={(e) => setTextSize(Number(e.target.value))}
                className="w-full accent-rail-red cursor-pointer"
              />
            </div>
          </div>

          {/* Column 3: Letter Spacing Selector Slider (using Narrow, Normal, Wide) */}
          <div className="flex flex-col justify-between">
            <div className="flex justify-between items-center text-xs font-mono font-medium text-slate-400 uppercase tracking-widest mb-2">
              <span>Letter Spacing</span>
              <span className="text-slate-600 font-bold uppercase">{letterSpacing}</span>
            </div>
            <div className="flex items-center h-10">
              <input
                type="range"
                min="1"
                max="3"
                value={letterSpacing === 'narrow' ? 1 : letterSpacing === 'normal' ? 2 : 3}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setLetterSpacing(val === 1 ? 'narrow' : val === 2 ? 'normal' : 'wide');
                }}
                className="w-full accent-rail-red cursor-pointer"
              />
            </div>
          </div>

        </div>

        {/* 2-Column Controls Row 2: Directional arrows/logo & Theme layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          
          {/* Left Column: DIRECTIONAL ARROWS AND LOGO (takes 7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <label className="block text-xs font-mono font-medium text-slate-400 uppercase tracking-widest">
              Directional Arrows
            </label>
            
            {/* 8 horizontal arrows in a standardized grid */}
            <div className="grid grid-cols-8 gap-1.5 max-w-[362px] w-full">
              {Object.entries(DIRECTIONS).map(([key, config]) => {
                const isActive = direction === key;
                return (
                  <button
                    key={`dir-btn-${key}`}
                    type="button"
                    onClick={() => setDirection(key)}
                    className={`h-10 rounded-lg border flex items-center justify-center transition cursor-pointer text-sm font-bold font-sans ${
                      isActive 
                        ? 'bg-[#002F6C] text-white border-blue-900 shadow-sm' 
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                    }`}
                    title={config.name}
                  >
                    <span style={{ transform: `rotate(${config.angle - 90}deg)`, display: 'inline-block' }}>
                      ➔
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Row of sub buttons: LEFT, NO ARROW, RIGHT spanning exact same width of 362px */}
            <div className="grid grid-cols-3 gap-1.5 max-w-[362px] w-full">
              
              {/* LEFT Arrow position button */}
              <button
                type="button"
                onClick={() => {
                  setArrowPosition('left');
                  if (direction === 'none') {
                    setDirection('E'); // select default arrow if none was selected
                  }
                }}
                className={`text-[10px] font-sans font-bold uppercase tracking-wider h-10 rounded-lg border cursor-pointer transition flex items-center justify-center ${
                  arrowPosition === 'left' && direction !== 'none'
                    ? 'bg-[#002F6C] text-white border-blue-900 shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-500'
                }`}
              >
                Left
              </button>

              {/* NO ARROW Button */}
              <button
                type="button"
                onClick={() => setDirection('none')}
                className={`text-[10px] font-sans font-bold uppercase tracking-wider h-10 rounded-lg border cursor-pointer transition flex items-center justify-center ${
                  direction === 'none'
                    ? 'bg-[#002F6C] text-white border-blue-900 shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-500'
                }`}
              >
                No Arrow
              </button>

              {/* RIGHT Arrow position button */}
              <button
                type="button"
                onClick={() => {
                  setArrowPosition('right');
                  if (direction === 'none') {
                    setDirection('E'); // select default arrow if none was selected
                  }
                }}
                className={`text-[10px] font-sans font-bold uppercase tracking-wider h-10 rounded-lg border cursor-pointer transition flex items-center justify-center ${
                  arrowPosition === 'right' && direction !== 'none'
                    ? 'bg-[#002F6C] text-white border-blue-900 shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-500'
                }`}
              >
                Right
              </button>

            </div>

          </div>

          {/* Right Column: THEME (takes 5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <label className="block text-xs font-mono font-medium text-slate-400 uppercase tracking-widest">
              Theme
            </label>
            <div className="grid grid-cols-2 gap-2">
              
              {/* Theme Rail Blue */}
              <button
                type="button"
                onClick={() => setBoardTheme('blue')}
                className={`h-10 text-xs font-semibold rounded-lg font-display uppercase tracking-wider border flex items-center justify-center shadow-sm cursor-pointer transition duration-150 ${
                  boardTheme === 'blue'
                    ? 'bg-[#002F6C] text-white border-blue-900 font-bold'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-[#002F6C]'
                }`}
              >
                Rail Blue
              </button>

              {/* Theme Board White */}
              <button
                type="button"
                onClick={() => setBoardTheme('light')}
                className={`h-10 text-xs font-semibold rounded-lg font-display uppercase tracking-wider border flex items-center justify-center shadow-sm cursor-pointer transition duration-150 ${
                  boardTheme === 'light'
                    ? 'bg-white text-[#002F6C] border-[#002F6C] ring-2 ring-slate-100 font-bold'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                Board White
              </button>

              {/* Theme Electric Teal */}
              <button
                type="button"
                onClick={() => setBoardTheme('teal')}
                className={`h-10 text-xs font-semibold rounded-lg font-display uppercase tracking-wider border flex items-center justify-center shadow-sm cursor-pointer transition duration-150 ${
                  boardTheme === 'teal'
                    ? 'bg-[#0d9488] text-white border-[#0c8579] font-bold'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-[#0d9488]'
                }`}
              >
                Electric Teal
              </button>

              {/* Theme Danger Red */}
              <button
                type="button"
                onClick={() => setBoardTheme('red')}
                className={`h-10 text-xs font-semibold rounded-lg font-display uppercase tracking-wider border flex items-center justify-center shadow-sm cursor-pointer transition duration-150 ${
                  boardTheme === 'red'
                    ? 'bg-[#a8081b] text-white border-red-900 font-bold'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-[#a8081b]'
                }`}
              >
                Danger Red
              </button>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
