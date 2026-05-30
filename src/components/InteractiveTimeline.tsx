import { useState } from 'react';
import { TIMELINE_EVENTS } from '../data/railData';
import { TimelineEvent } from '../types';
import { ArrowLeft, ArrowRight, Train, Milestone, Sparkles, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function InteractiveTimeline() {
  const [activeIndex, setActiveIndex] = useState<number>(2); // Default to Gerry Barney's 1965 Rebrand

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : TIMELINE_EVENTS.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < TIMELINE_EVENTS.length - 1 ? prev + 1 : 0));
  };

  const activeEvent: TimelineEvent = TIMELINE_EVENTS[activeIndex];

  // Map category to aesthetic badge colors
  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case 'design':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'engineering':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'heritage':
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  // 4-Aspect Signal light dynamic states (Red, Yellow 1, Green, Yellow 2)
  let isRedOn = false;
  let isYellow1On = false;
  let isGreenOn = false;
  let isYellow2On = false;

  if (activeIndex === 0 || activeIndex === 5) {
    isRedOn = true;
  } else if (activeIndex === 1) {
    isYellow1On = true;
  } else if (activeIndex === 2) {
    isYellow1On = true;
    isYellow2On = true;
  } else if (activeIndex === 3 || activeIndex === 4) {
    isGreenOn = true;
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 lg:p-8 max-w-4xl mx-auto my-4 transition-all">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 mb-6 gap-2">
        <div>
          <h3 className="font-display font-bold text-lg text-rail-blue tracking-tight flex items-center space-x-2">
            <Milestone className="w-5 h-5 text-rail-red" />
            <span>Interactive Timeline</span>
          </h3>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Browse highlights in UK railway history using our interactive timeline.
          </p>
        </div>
        
        {/* Signal state lights indicator */}
        <div className="flex items-center space-x-2 bg-slate-950 px-4 py-2 rounded-full border border-slate-800 shadow-inner">
          <span 
            className={`h-3 w-3 rounded-full transition-all duration-300 ${
              isRedOn 
                ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.9)] animate-pulse' 
                : 'bg-red-950/60'
            }`} 
            title="Danger Red Stop" 
          />
          <span 
            className={`h-3 w-3 rounded-full transition-all duration-300 ${
              isYellow1On 
                ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)] animate-pulse' 
                : 'bg-amber-950/60'
            }`} 
            title="Preliminary Caution Yellow" 
          />
          <span 
            className={`h-3 w-3 rounded-full transition-all duration-300 ${
              isGreenOn 
                ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.9)] animate-pulse' 
                : 'bg-emerald-950/60'
            }`} 
            title="Clear Green Proceed" 
          />
          <span 
            className={`h-3 w-3 rounded-full transition-all duration-300 ${
              isYellow2On 
                ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)] animate-pulse' 
                : 'bg-amber-950/60'
            }`} 
            title="Caution Yellow" 
          />
        </div>
      </div>

      {/* 1. COMPACT HORIZONTAL RAILWAY TRACK STEPPER */}
      <div className="relative mb-8 pt-4">
        {/* The Track Line perfectly centered at nodes height */}
        <div className="absolute top-[44px] left-10 right-10 h-1 bg-slate-200 rounded-full" />
        
        {/* Active Train Indicator Track overlay aligned perfectly */}
        <div 
          className="absolute top-[44px] left-10 h-1 bg-rail-red rounded-full transition-all duration-300"
          style={{ width: `calc(${(activeIndex / (TIMELINE_EVENTS.length - 1))} * (100% - 5rem))` }}
        />

        {/* Track Stops (Buttons) */}
        <div className="flex justify-between items-start relative z-10 px-0">
          {TIMELINE_EVENTS.map((evt, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={evt.year}
                onClick={() => setActiveIndex(idx)}
                className="flex flex-col items-center focus:outline-none group cursor-pointer w-full max-w-[120px]"
              >
                {/* Year Label in fixed-height block to guarantee perfect horizontal alignment across nodes */}
                <div className="h-6 flex items-end justify-center mb-1">
                  <span className={`text-xs sm:text-sm font-mono font-bold transition-all duration-200 ${
                    isActive ? 'text-[#a8081b] scale-110 font-black' : 'text-slate-400 group-hover:text-slate-600'
                  }`}>
                    {evt.year}
                  </span>
                </div>

                {/* Circular Node / Railway Signal Bulb in fixed vertical alignment containing container */}
                <div className="h-8 flex items-center justify-center relative">
                  <div className={`w-6 h-6 rounded-full border-4 flex items-center justify-center transition-all duration-200 shadow-md ${
                    isActive 
                      ? 'bg-[#a8081b] border-white ring-2 ring-red-500 scale-117' 
                      : 'bg-white border-slate-300 hover:border-slate-400 group-hover:scale-105'
                  }`}>
                    {isActive && <Circle className="w-1.5 h-1.5 fill-white text-white" />}
                  </div>
                </div>

                {/* Event text wrapped fully without truncation inside a stable layout container */}
                <div className="h-16 flex items-start justify-center px-1 overflow-visible">
                  <span className={`text-[10px] sm:text-[11px] font-sans font-semibold text-center mt-2 leading-snug transition-all max-w-[90px] sm:max-w-[110px] ${
                    isActive ? 'text-slate-800 font-bold' : 'text-slate-400 opacity-85 group-hover:text-slate-600'
                  }`}>
                    {evt.title}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. DYNAMIC ACTIVE CHRONOLOGY CABINET (CLICK & ACCORDION PREVIEW) */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 md:p-6 shadow-inner relative overflow-hidden min-h-[190px]">
        {/* Abstract vintage blueprint grids for look */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-35 pointer-events-none" />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="relative z-10"
          >
            {/* Header info bar inside card */}
            <div className="flex flex-wrap justify-between items-baseline gap-2 border-b border-slate-200 pb-2.5 mb-3.5">
              <div className="flex items-center space-x-2">
                <span className="text-xl md:text-2xl font-display font-black text-rail-blue">
                  {activeEvent.year}
                </span>
                <span className="text-slate-350">|</span>
                <span className="text-xs font-mono text-[#a8081b] font-extrabold uppercase tracking-wide">
                  {activeEvent.subtitle}
                </span>
              </div>
              
              <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold uppercase border ${getCategoryTheme(activeEvent.category)}`}>
                {activeEvent.category} Section
              </span>
            </div>

            {/* Title & Long description details */}
            <div>
              <h4 className="font-display font-bold text-slate-900 text-base md:text-lg tracking-tight mb-2">
                {activeEvent.title}
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed font-sans md:text-base">
                {activeEvent.description}
              </p>
            </div>

            {/* Interactive metadata footer */}
            <div className="mt-4 pt-3 border-t border-slate-200/50 flex justify-between items-center text-[10px] text-slate-400 font-mono">
              <span className="flex items-center space-x-1">
                <Train className="w-3 h-3 text-slate-400" />
                <span>Modernisation Stage {activeIndex + 1} of {TIMELINE_EVENTS.length}</span>
              </span>
              <span className="hidden sm:inline-block">ARCHIVE REFERENCE ID: #BR-LGCY-{activeEvent.year}</span>
            </div>

          </motion.div>
        </AnimatePresence>
      </div>

      {/* 3. CONSOLE BUTTON CONTROLS */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePrev}
          className="inline-flex items-center justify-center space-x-1 px-3 py-1.5 border border-slate-205 text-slate-600 hover:text-rail-blue hover:bg-slate-50 rounded-lg text-xs font-semibold cursor-pointer transition select-none"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Previous Era</span>
        </button>

        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest hidden sm:inline-block">
          Consolidation Track Selector
        </span>

        <button
          onClick={handleNext}
          className="inline-flex items-center justify-center space-x-1 px-3 py-1.5 border border-slate-205 text-slate-600 hover:text-rail-blue hover:bg-slate-50 rounded-lg text-xs font-semibold cursor-pointer transition select-none"
        >
          <span>Next Era</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
