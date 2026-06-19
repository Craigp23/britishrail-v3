import React, { useState } from 'react';
import { TIMELINE_EVENTS } from '../data/railData';
import { TimelineEvent } from '../types';
import { ChevronLeft, ChevronRight, Train, Milestone, Sparkles, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function InteractiveTimeline() {
  const [activeIndex, setActiveIndex] = useState<number>(2); // Default to Gerry Barney's 1965 Rebrand

  const totalEvents = TIMELINE_EVENTS.length;

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : TIMELINE_EVENTS.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < TIMELINE_EVENTS.length - 1 ? prev + 1 : 0));
  };

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;
    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
    setTouchStart(null);
    setTouchEnd(null);
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
      <div className="flex flex-row justify-between items-center border-b border-slate-100 pb-4 mb-2 gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-base sm:text-lg text-rail-blue tracking-tight flex items-center space-x-2">
            <Milestone className="w-5 h-5 text-rail-red flex-shrink-0" />
            <span className="truncate">Interactive Timeline (1948 - 1994)</span>
          </h3>
          <p className="text-[10px] sm:text-xs text-slate-500 font-sans mt-0.5 leading-snug">
            Browse highlights in UK railway history using our interactive timeline.
          </p>
        </div>
        
        {/* Signal state lights indicator */}
        <div className="flex-shrink-0 flex items-center space-x-1.5 sm:space-x-2.5 bg-slate-950 px-2 sm:px-3 py-[7px] sm:py-[11px] rounded-lg border-2 border-slate-800 shadow-xl">
          {/* 1. Red (Danger Stop) */}
          <div 
            className="w-[18px] h-[18px] sm:w-[26px] sm:h-[26px] rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shadow-[inset_0_1px_3px_rgba(0,0,0,0.8)]"
            title="Danger Red Stop"
          >
            {isRedOn ? (
              <motion.span 
                animate={{ opacity: [0.35, 1, 0.35] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                className="h-[14px] w-[14px] sm:h-5.5 sm:w-5.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.95)]"
              />
            ) : (
              <span className="h-[14px] w-[14px] sm:h-5.5 sm:w-5.5 rounded-full bg-red-950/40 transition-all duration-300" />
            )}
          </div>

          {/* 2. Yellow (Caution) */}
          <div 
            className="w-[18px] h-[18px] sm:w-[26px] sm:h-[26px] rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shadow-[inset_0_1px_3px_rgba(0,0,0,0.8)]"
            title="Caution Yellow"
          >
            {isYellow2On ? (
              <motion.span 
                animate={{ opacity: [0.35, 1, 0.35] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                className="h-[14px] w-[14px] sm:h-5.5 sm:w-5.5 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.95)]"
              />
            ) : (
              <span className="h-[14px] w-[14px] sm:h-5.5 sm:w-5.5 rounded-full bg-amber-950/40 transition-all duration-300" />
            )}
          </div>

          {/* 3. Green (Clear Proceed) */}
          <div 
            className="w-[18px] h-[18px] sm:w-[26px] sm:h-[26px] rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shadow-[inset_0_1px_3px_rgba(0,0,0,0.8)]"
            title="Clear Green Proceed"
          >
            {isGreenOn ? (
              <motion.span 
                animate={{ opacity: [0.35, 1, 0.35] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                className="h-[14px] w-[14px] sm:h-5.5 sm:w-5.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.95)]"
              />
            ) : (
              <span className="h-[14px] w-[14px] sm:h-5.5 sm:w-5.5 rounded-full bg-emerald-950/40 transition-all duration-300" />
            )}
          </div>

          {/* 4. Yellow (Preliminary Caution) */}
          <div 
            className="w-[18px] h-[18px] sm:w-[26px] sm:h-[26px] rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shadow-[inset_0_1px_3px_rgba(0,0,0,0.8)]"
            title="Preliminary Caution Yellow"
          >
            {isYellow1On ? (
              <motion.span 
                animate={{ opacity: [0.35, 1, 0.35] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                className="h-[14px] w-[14px] sm:h-5.5 sm:w-5.5 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.95)]"
              />
            ) : (
              <span className="h-[14px] w-[14px] sm:h-5.5 sm:w-5.5 rounded-full bg-amber-950/40 transition-all duration-300" />
            )}
          </div>
        </div>
      </div>

      {/* 1. COMPACT HORIZONTAL RAILWAY TRACK STEPPER */}
      <div className="relative mb-8 pt-2">
        {/* Base Track Line */}
        <div 
          className="absolute top-[33px] h-[7px] bg-slate-200 rounded-full z-10 pointer-events-none" 
          style={{ left: 'calc(8.333% - 25px)', right: 'calc(8.333% - 25px)' }}
        />
        
        {/* Highlight Track Line representing progress along the timeline in slider style */}
        <div 
          className="absolute top-[33px] h-[7px] bg-[#a8081b] rounded-full transition-all duration-300 z-10 pointer-events-none"
          style={{ 
            left: 'calc(8.333% - 25px)', 
            width: `calc(${activeIndex * 16.666}% + 50px)` 
          }}
        />

        {/* Track Stops */}
        <div className="grid grid-cols-6 w-full relative z-0 px-0 items-start">
          {TIMELINE_EVENTS.map((evt, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={evt.year}
                onClick={() => setActiveIndex(idx)}
                className="flex flex-col items-center focus:outline-none group cursor-pointer w-full min-w-0 transition-all duration-200 relative pb-2 pt-1 hover:bg-slate-50/50 rounded-xl"
              >
                {/* Transparent centered "halo" circle placed directly on the line */}
                <div className="h-12 flex items-center justify-center relative mb-3 translate-y-[0.5px]">
                  {isActive ? (
                    <div className="w-[26px] h-[26px] rounded-full border-[4px] border-[#a8081b] bg-transparent pointer-events-none transition-all duration-200 scale-110" />
                  ) : (
                    <div className="w-[26px] h-[26px] rounded-full border-[4px] border-slate-200 group-hover:border-slate-350 bg-transparent pointer-events-none transition-all duration-200 group-hover:scale-105" />
                  )}
                </div>

                {/* Sub-node Labels */}
                <div className="flex flex-col items-center justify-start text-center w-full px-1">
                  <span className={`text-[13px] sm:text-[15px] font-sans font-extrabold tracking-tight transition-all duration-200 ${
                    isActive ? 'text-[#012169] scale-105' : 'text-[#8EA2B9] group-hover:text-[#5C738E]'
                  }`}>
                    {evt.year}
                  </span>
                  <span className={`text-[9px] sm:text-[10px] font-sans font-medium text-center mt-1 leading-snug transition-all px-0.5 max-w-full break-words hyphens-auto ${
                    isActive ? 'text-[#1E293B] font-bold' : 'text-[#A0B0C4] group-hover:text-slate-500'
                  }`}>
                    {evt.title}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. DYNAMIC ACTIVE CHRONOLOGY CABINET (WITH SIDE NAV CHEVRONS OVERLAID) */}
      <div className="relative flex items-center">
        {/* Left Chevron */}
        <button
          onClick={handlePrev}
          className="hidden sm:flex absolute left-[-20px] z-20 items-center justify-center w-11 h-11 rounded-full bg-transparent text-slate-600 hover:text-rail-red hover:scale-110 active:scale-90 transition-all focus:outline-none cursor-pointer"
          title="Previous Era"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Details Cabinet div */}
        <div 
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-5 md:p-6 pb-6 md:pb-8 shadow-inner relative overflow-hidden min-h-[190px] mx-1 sm:mx-6 select-none"
        >
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

        {/* Right Chevron */}
        <button
          onClick={handleNext}
          className="hidden sm:flex absolute right-[-20px] z-20 items-center justify-center w-11 h-11 rounded-full bg-transparent text-slate-600 hover:text-rail-red hover:scale-110 active:scale-90 transition-all focus:outline-none cursor-pointer"
          title="Next Era"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

    </div>
  );
}
