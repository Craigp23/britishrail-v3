import { useState } from 'react';
import { Sliders, RefreshCw, Eye, EyeOff, Check, Sparkles } from 'lucide-react';

export default function DoubleArrowGeometry() {
  const [strokeWidth, setStrokeWidth] = useState<number>(7);
  const [gapOffset, setGapOffset] = useState<number>(15); // Arrow head horizontal offset
  const [logoColor, setLogoColor] = useState<string>('#dc241f'); // Default to British Standard BS381C 593 Flame Red
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showAnchorPoints, setShowAnchorPoints] = useState<boolean>(true);

  // Preset Colors
  const colors = [
    { label: 'Flame Red', value: '#dc241f', code: 'BS 381C No. 593' },
    { label: 'Rail Blue', value: '#002F6C', code: 'BS 381C No. 114' },
    { label: 'Slate Dark', value: '#0f172a', code: 'Modern Slate' },
    { label: 'Electric Teal', value: '#0d9488', code: 'Teal Accents' }
  ];

  const handleReset = () => {
    setStrokeWidth(7);
    setGapOffset(15);
    setLogoColor('#dc241f');
    setShowGrid(true);
    setShowAnchorPoints(true);
  };

  // Grid coordinates mapping
  const gridCells = Array.from({ length: 12 }, (_, i) => i * 10);

  // Math to derive authentic Double Arrow geometry from the user's separation offset slider
  const tipOffset = gapOffset * 1.33;
  const leftTipX = 50 - gapOffset - tipOffset;
  const rightTipX = 50 + gapOffset + tipOffset;
  const leftProngEndX = 50 - gapOffset;
  const rightProngEndX = 50 + gapOffset;

  // Horizontal track levels
  const y1 = 15;
  const y2 = 27;
  const y3 = 33;
  const y4 = 45;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 lg:p-8">
      
      {/* Title block */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-display font-bold text-rail-blue tracking-tight">
            The Geometry of Gerry Barney (1965)
          </h3>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Understand how mathematical symmetry and grid lines forged an everlasting corporate symbol.
          </p>
        </div>
        <button
          onClick={handleReset}
          className="text-slate-500 hover:text-rail-blue p-2 hover:bg-slate-100 rounded-full transition"
          title="Reset Geometry"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* SVG Drawing Canvas (8 cols) */}
        <div className="lg:col-span-8 bg-slate-950 rounded-xl p-4 sm:p-6 shadow-inner relative flex justify-center items-center aspect-[4/3] max-w-lg mx-auto w-full overflow-hidden">
          
          {/* Subtle Grid overlay */}
          {showGrid && (
            <div className="absolute inset-0 pointer-events-none grid grid-cols-10 grid-rows-10 border border-slate-800/20">
              {gridCells.map((val) => (
                <div key={`col-${val}`} className="absolute top-0 bottom-0 border-l border-slate-800/30" style={{ left: `${val}%` }} />
              ))}
              {gridCells.map((val) => (
                <div key={`row-${val}`} className="absolute left-0 right-0 border-t border-slate-800/30" style={{ top: `${val}%` }} />
              ))}
              {/* Central crosshair lines */}
              <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-slate-700/60" />
              <div className="absolute left-1/2 top-0 bottom-0 border-l border-dashed border-slate-700/60" />
            </div>
          )}

          {/* Double Arrow Symbol Render */}
          <svg 
            viewBox="0 0 100 60" 
            className="w-full max-h-52 select-none relative z-10 filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
            fill="none" 
            stroke={logoColor} 
            strokeWidth={strokeWidth} 
            strokeLinecap="square"
            strokeLinejoin="miter"
          >
            {/* Top track (Top horizontal stem, left parallel diagonal, middle-upper horizontal stem) */}
            <path 
              d={`M ${50 - (gapOffset / 1.5)} ${y1} L ${leftTipX} ${y1} L ${leftProngEndX} ${y2} L ${rightTipX} ${y2}`} 
              className="transition-all duration-150"
            />
            {/* Bottom track (Bottom horizontal stem, right parallel diagonal, middle-lower horizontal stem) */}
            <path 
              d={`M ${50 + (gapOffset / 1.5)} ${y4} L ${rightTipX} ${y4} L ${rightProngEndX} ${y3} L ${leftTipX} ${y3}`} 
              className="transition-all duration-150"
            />
            {/* Left side secondary diagonal reinforcement for clean vector joints */}
            <path 
              d={`M ${leftProngEndX} ${y2} L ${leftTipX} ${y1}`} 
              className="transition-all duration-150"
            />
            {/* Right side secondary diagonal reinforcement for clean vector joints */}
            <path 
              d={`M ${rightProngEndX} ${y3} L ${rightTipX} ${y4}`} 
              className="transition-all duration-150"
            />

            {/* Simulated blueprint vector anchor points */}
            {showAnchorPoints && (
              <g fill="#38bdf8" stroke="#ffffff" strokeWidth="1">
                {/* Left outer tip */}
                <circle cx={leftTipX} cy={y1} r="2.5" />
                {/* Right outer tip */}
                <circle cx={rightTipX} cy={y4} r="2.5" />
                {/* Inner track junctions */}
                <circle cx={leftProngEndX} cy={y2} r="2.5" />
                <circle cx={rightProngEndX} cy={y3} r="2.5" />
                {/* Center tracks terminations */}
                <circle cx={rightTipX} cy={y2} r="2.5" />
                <circle cx={leftTipX} cy={y3} r="2.5" />
                {/* Outer tracks terminations */}
                <circle cx={50 - gapOffset / 1.5} cy={y1} r="2.5" />
                <circle cx={50 + gapOffset / 1.5} cy={y4} r="2.5" />
              </g>
            )}
          </svg>

          {/* Floating blueprint spec metrics */}
          <div className="absolute bottom-3 left-4 text-[10px] text-slate-500 font-mono flex space-x-4">
            <span>GRID: 10x10</span>
            <span>ANGLE: 32° PRO_RATA</span>
            <span>RATIO: 1.667 (5:3)</span>
          </div>

        </div>

        {/* Sliders and Controls (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Preset Swatches */}
          <div>
            <label className="block text-xs font-mono font-medium text-slate-500 uppercase tracking-wider mb-2">
              Branding Color Paint
            </label>
            <div className="grid grid-cols-2 gap-2">
              {colors.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setLogoColor(c.value)}
                  className={`p-2 rounded-xl text-left border text-xs flex flex-col justify-between transition-all cursor-pointer ${
                    logoColor === c.value 
                      ? 'border-slate-800 bg-slate-50 ring-2 ring-slate-100' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="flex items-center space-x-1.5 font-sans font-medium">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.value }} />
                    <span className="text-slate-800">{c.label}</span>
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono mt-1">{c.code}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Stroke Slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-mono font-medium text-slate-500 uppercase tracking-wider mb-2">
              <span>Stroke Thickness</span>
              <span className="text-slate-700">{strokeWidth}px</span>
            </div>
            <input
              type="range"
              min="3"
              max="14"
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(Number(e.target.value))}
              className="w-full accent-rail-red"
            />
          </div>

          {/* Offset Slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-mono font-medium text-slate-500 uppercase tracking-wider mb-2">
              <span>Arrow Separation</span>
              <span className="text-slate-700">{gapOffset}px</span>
            </div>
            <input
              type="range"
              min="5"
              max="28"
              value={gapOffset}
              onChange={(e) => setGapOffset(Number(e.target.value))}
              className="w-full accent-rail-red"
            />
          </div>

          {/* Diagnostic Toggles */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            
            <button
              onClick={() => setShowGrid(!showGrid)}
              className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 text-xs font-sans font-medium text-slate-600 transition"
            >
              <span className="flex items-center space-x-2">
                {showGrid ? <Eye className="w-4 h-4 text-emerald-500" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
                <span>Technical Blueprint Grid</span>
              </span>
              <span className="font-mono text-[10px] font-bold text-slate-400">
                {showGrid ? 'ON' : 'OFF'}
              </span>
            </button>

            <button
              onClick={() => setShowAnchorPoints(!showAnchorPoints)}
              className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 text-xs font-sans font-medium text-slate-600 transition"
            >
              <span className="flex items-center space-x-2">
                {showAnchorPoints ? <Eye className="w-4 h-4 text-emerald-500" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
                <span>Vector Coordinate Nodes</span>
              </span>
              <span className="font-mono text-[10px] font-bold text-slate-400">
                {showAnchorPoints ? 'ON' : 'OFF'}
              </span>
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}
