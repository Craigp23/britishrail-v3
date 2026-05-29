import { useState, ChangeEvent } from 'react';
import { Type, ArrowLeft, ArrowRight, CornerDownRight, Award, Trash2 } from 'lucide-react';

export default function RailAlphabetTypewriter() {
  const [typedText, setTypedText] = useState('PLATFORM 53');
  const [boardTheme, setBoardTheme] = useState<'blue' | 'light' | 'red'>('blue');
  const [railcarIcon, setRailcarIcon] = useState<'none' | 'left-arrow' | 'right-arrow' | 'wayout' | 'double'>('right-arrow');
  const [letterSpacing, setLetterSpacing] = useState<'normal' | 'wide' | 'widest'>('wide');
  const [textSize, setTextSize] = useState<number>(28); // Text size slider state

  // Text validation: upper-case mimic
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTypedText(e.target.value.toUpperCase());
  };

  // Sign styling based on chosen theme - updated Danger Red to authentic #a8081b
  const getThemeClass = () => {
    switch (boardTheme) {
      case 'light':
        return 'bg-white text-slate-900 border-2 border-slate-300 shadow-sm';
      case 'red':
        return 'bg-[#a8081b] text-white border-2 border-red-900 shadow-lg';
      case 'blue':
      default:
        return 'bg-[#002F6C] text-white border-2 border-blue-900 shadow-lg';
    }
  };

  const getSpacingClass = () => {
    if (letterSpacing === 'wide') return 'tracking-widest';
    if (letterSpacing === 'widest') return 'tracking-[0.25em]';
    return 'tracking-wide';
  };

  const currentIcon = () => {
    switch (railcarIcon) {
      case 'left-arrow':
        return <ArrowLeft className="w-6 h-6 sm:w-8 sm:h-8" />;
      case 'right-arrow':
        return <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8" />;
      case 'wayout':
        return <CornerDownRight className="w-6 h-6 sm:w-8 sm:h-8 text-amber-300" />;
      case 'double':
        return (
          <svg viewBox="0 0 100 60" className="w-9 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="square">
            <path d="M 40 12 L 15 12 L 35 27 L 85 27" />
            <path d="M 60 48 L 85 48 L 65 33 L 15 33" />
            <path d="M 35 27 L 15 12 M 65 33 L 85 48" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 lg:p-8">
      
      {/* Title block */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-display font-bold text-rail-blue tracking-tight">
            Rail Alphabet Typographic Typewriter
          </h3>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Margaret Calvert’s 1965 signage typography was crafted for maximum legibility in crowded public halls. Type below to generate instant station signageboards.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* Interactive Signboard Rendering */}
        <div className="bg-slate-100 p-6 sm:p-10 rounded-xl border border-slate-200 flex flex-col items-center justify-center min-h-[170px]">
          
          {/* Signboard Container */}
          <div 
            className={`w-full max-w-2xl px-6 py-4 rounded-md font-display font-bold uppercase transition-all duration-300 flex items-center justify-between ${getThemeClass()} ${getSpacingClass()}`}
          >
            {/* Left aligned icon if wayout or left arrow */}
            {(railcarIcon === 'left-arrow' || railcarIcon === 'double') && (
              <div className="mr-4 flex-shrink-0">
                {currentIcon()}
              </div>
            )}

            {/* Main Typographic Text - Dynamic Text Size */}
            <span 
              className="text-center select-all overflow-hidden text-ellipsis whitespace-nowrap flex-grow"
              style={{ fontSize: `${textSize}px`, lineHeight: 1 }}
            >
              {typedText || 'ENTER STATION WORD'}
            </span>

            {/* Right aligned icon if wayout or right arrow */}
            {(railcarIcon === 'right-arrow' || railcarIcon === 'wayout') && (
              <div className="ml-4 flex-shrink-0">
                {currentIcon()}
              </div>
            )}
          </div>

          <p className="text-[10px] font-mono text-slate-400 mt-4 uppercase tracking-widest">
            Station Signboard Preview (1:1 Ratio Mimic)
          </p>
        </div>

        {/* Form Controls Row 1: Custom Text, Text Size, and Character Tracking Slider */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
          
          {/* Text input */}
          <div>
            <label className="block text-xs font-mono font-medium text-slate-500 uppercase tracking-wider mb-2">
              Write Custom Board Text
            </label>
            <div className="relative">
              <input
                type="text"
                value={typedText}
                onChange={handleInputChange}
                maxLength={40}
                placeholder="E.G. GENTLEMEN"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold uppercase focus:ring-2 focus:ring-rail-blue outline-none text-slate-800 transition-all font-display tracking-wider font-bold"
              />
              {typedText && (
                <button
                  onClick={() => setTypedText('')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-rose-500 transition"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              )}
            </div>
          </div>

          {/* Text Size Selection Slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-mono font-medium text-slate-500 uppercase tracking-wider mb-2">
              <span>Text Size Selection</span>
              <span className="text-slate-700 font-bold">{textSize}px</span>
            </div>
            <div className="flex items-center h-12 px-1">
              <input
                type="range"
                min="12"
                max="56"
                value={textSize}
                onChange={(e) => setTextSize(Number(e.target.value))}
                className="w-full accent-[#002F6C]"
              />
            </div>
          </div>

          {/* Character Tracking Grid Slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-mono font-medium text-slate-500 uppercase tracking-wider mb-2">
              <span>Character Tracking Grid</span>
              <span className="text-slate-700 font-bold">
                {letterSpacing === 'normal' ? 'Normal' : letterSpacing === 'wide' ? 'Wide' : 'Extreme'}
              </span>
            </div>
            <div className="flex items-center h-12 px-1">
              <input
                type="range"
                min="1"
                max="3"
                value={letterSpacing === 'normal' ? 1 : letterSpacing === 'wide' ? 2 : 3}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setLetterSpacing(val === 1 ? 'normal' : val === 2 ? 'wide' : 'widest');
                }}
                className="w-full accent-[#002F6C]"
              />
            </div>
          </div>

        </div>

        {/* Form Controls Row 2: Wayfinding Icon and Standard Plate Theme */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Signboard Icons selection */}
          <div>
            <label className="block text-xs font-mono font-medium text-slate-500 uppercase tracking-wider mb-2">
              Accompanying Wayfinding Icon
            </label>
            <div className="flex items-center h-12">
              <select
                value={railcarIcon}
                onChange={(e) => setRailcarIcon(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-rail-blue font-bold"
              >
                <option value="none">No Icon (Text Only)</option>
                <option value="left-arrow">Left direction arrow ➔</option>
                <option value="right-arrow">Right direction arrow ➔</option>
                <option value="wayout">Way Out exit arrow </option>
                <option value="double">Corporate Double Arrow</option>
              </select>
            </div>
          </div>

          {/* Standard Plate Theme Switcher */}
          <div>
            <label className="block text-xs font-mono font-medium text-slate-500 uppercase tracking-wider mb-2">
              Standard Plate Theme
            </label>
            <div className="grid grid-cols-3 gap-2 h-12 items-center">
              <button
                onClick={() => setBoardTheme('blue')}
                className={`py-3 px-3 text-xs font-semibold rounded-xl border text-center transition cursor-pointer ${
                  boardTheme === 'blue'
                    ? 'bg-[#002F6C] text-white border-blue-900 shadow-sm font-bold'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                Rail Blue
              </button>
              <button
                onClick={() => setBoardTheme('light')}
                className={`py-3 px-3 text-xs font-semibold rounded-xl border text-center transition cursor-pointer ${
                  boardTheme === 'light'
                    ? 'bg-slate-100 text-slate-800 border-slate-300 shadow-sm font-bold'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                Board White
              </button>
              <button
                onClick={() => setBoardTheme('red')}
                className={`py-3 px-3 text-xs font-semibold rounded-xl border text-center transition cursor-pointer ${
                  boardTheme === 'red'
                    ? 'bg-[#a8081b] text-white border-red-900 shadow-sm font-bold'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
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
