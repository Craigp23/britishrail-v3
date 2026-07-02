import React from 'react';
import { ShieldCheck, Palette, Sparkles } from 'lucide-react';
// @ts-expect-error - image asset
import satisfiedTravellerImg from '../assets/images/satisfied_traveller_1780042943028.png';
// @ts-expect-error - image asset
import alasdairImg from '../assets/images/graphic designer_Alasdair.png';
// @ts-expect-error - image asset
import davidImg from '../assets/images/vintage_dining_car_David3.png';

interface ClairePanelProps {
  compact?: boolean;
  type?: 'home' | 'history' | 'smart';
  onNavigateToSplitter?: () => void;
  onNavigateToCalculator?: () => void;
  onNavigateToHistory?: () => void;
}

export default function ClairePanel({ 
  compact = false, 
  type = 'home',
  onNavigateToSplitter, 
  onNavigateToCalculator,
  onNavigateToHistory
}: ClairePanelProps) {

  // Resolve config based on the testimonial type
  const isHistory = type === 'history';
  const isSmart = type === 'smart';

  // Swap story content as requested:
  // - Alasdair (originally history) is now on the Smart Travel page (type === 'smart')
  // - Chloe is replaced by David from Inverness on the History & Design page (type === 'history')
  const isAlasdairStory = type === 'smart';
  const isDavidStory = type === 'history';

  const title = isAlasdairStory 
    ? "Alasdair, St Andrews" 
    : isDavidStory 
    ? "David from Inverness" 
    : "Jules from Cheltenham Spa";

  const subtitle = isAlasdairStory 
    ? "Graphic designer & West Coast commuter" 
    : isDavidStory 
    ? "Retired architect and lifelong railway enthusiast" 
    : "Frequent traveller on the Great Western route";

  const imgSrc = isAlasdairStory 
    ? alasdairImg 
    : isDavidStory 
    ? davidImg 
    : satisfiedTravellerImg;

  const imgAlt = isAlasdairStory 
    ? "Alasdair, a graphic designer from St Andrews, exploring British Rail typography and design systems" 
    : isDavidStory 
    ? "David, a retired architect from Inverness, in a vintage dining car appreciating classic British Rail design" 
    : "Satisfied British train passenger holding standard ticket whilst watching scenic countryside go by";

  const tag = isAlasdairStory 
    ? "DESIGN CLASSIC" 
    : isDavidStory 
    ? "HISTORY LOVER" 
    : "COMMUTER SAVINGS";

  const badgeText = isAlasdairStory 
    ? "DESIGN APP FAN" 
    : isDavidStory 
    ? "SAVINGS : 38%" 
    : "SAVINGS : 45%";

  const badgeBg = isAlasdairStory 
    ? "bg-[#012169]/5 text-[#012169] border-[#012169]/10" 
    : "bg-emerald-50 text-emerald-800 border-emerald-100";

  const footerLabel = isAlasdairStory 
    ? "British Rail Heritage" 
    : isDavidStory 
    ? "Interactive Exhibits" 
    : "Standard Single Savings";

  const footerStat = isAlasdairStory 
    ? "Coherent Design" 
    : isDavidStory 
    ? "Crafted to 1965 Standards" 
    : "Avg. £42/trip Saved";

  const actionLabel = isAlasdairStory 
    ? "Create a Sign >" 
    : isDavidStory 
    ? "Smart Travel Guide >" 
    : "Ticket Splitter >";

  const handleActionClick = (e: React.MouseEvent) => {
    if (isHistory) {
      if (onNavigateToHistory) {
        e.preventDefault();
        onNavigateToHistory();
      } else {
        const el = document.getElementById('rail-alphabet-typewriter-section');
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    } else if (isSmart) {
      if (onNavigateToHistory) {
        e.preventDefault();
        onNavigateToHistory();
      }
    } else {
      if (onNavigateToSplitter) {
        e.preventDefault();
        onNavigateToSplitter();
      }
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col h-full justify-between">
      
      {/* Passenger Image Block */}
      <div className={`relative ${compact ? 'aspect-[16/9]' : 'aspect-[4/3]'} bg-slate-100 border-b border-rose-100 overflow-hidden`}>
        <img 
          src={imgSrc} 
          alt={imgAlt} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        {/* Artistic Photo Overlay Tag */}
        <div className="absolute top-2.5 right-2.5 bg-emerald-500 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded shadow-md">
          {tag}
        </div>
        
        {/* Dynamic Photo Caption caption text */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-white">
          <p className="text-[10px] font-mono tracking-widest uppercase font-semibold text-amber-300">Visitor Journey</p>
          <p className="text-[11px] font-sans italic font-medium mt-0.5 opacity-90">
            {isAlasdairStory 
              ? '"A fascinating glimpse into a remarkable period of British railway design."' 
              : isDavidStory 
              ? '"The interactive exhibits kept me fascinated much longer than expected."' 
              : '"I booked 12 weeks early and used split ticketing to save over £50!"'}
          </p>
        </div>
      </div>

      {/* Quote details */}
      <div className="p-5 flex-grow space-y-4">
        <div className={`inline-flex items-center space-x-1.5 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${badgeBg}`}>
          {isAlasdairStory ? (
            <Sparkles className="w-3.5 h-3.5" />
          ) : (
            <ShieldCheck className="w-3.5 h-3.5" />
          )}
          <span>{badgeText}</span>
        </div>

        <div>
          <h5 className="font-display font-extrabold text-[#012169] text-sm uppercase tracking-tight">
            {title}
          </h5>
          <p className="text-xs text-slate-500 font-mono -mt-0.5">{subtitle}</p>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed font-sans">
          {isAlasdairStory ? (
            <>
              "I originally came here looking for ways to save money on my commute, but ended up spending ages exploring the History & Design page. The station sign creator is brilliant, and I'd never realised how carefully the famous Double Arrow symbol was designed. I loved seeing how the typography, spacing and the Double Arrow all work together as one coherent design system. It's a fascinating glimpse into a remarkable period of British railway design."
            </>
          ) : isDavidStory ? (
            <>
              "I intended to have a quick look at the History & Design page, a friend recommended, but the interactive exhibits kept me fascinated much longer than expected. Afterwards I clicked over to the{" "}
              {onNavigateToCalculator ? (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigateToCalculator();
                  }}
                  className="font-bold text-[#012169] hover:text-[#a8081b] underline cursor-pointer bg-transparent border-0 p-0 inline font-semibold transition-colors font-sans"
                >
                  Smart Travel Guide
                </button>
              ) : (
                <strong className="font-semibold text-[#012169]">Smart Travel Guide</strong>
              )}{" "}, found helpful advice and booked a cheap ticket for my next trip south :)"
            </>
          ) : (
            <>
              "I depend on travelling by train and tickets can sometimes be very expensive. By switching to using the{" "}
              {onNavigateToCalculator ? (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigateToCalculator();
                  }}
                  className="font-bold text-[#012169] hover:text-[#a8081b] underline cursor-pointer bg-transparent border-0 p-0 inline font-semibold transition-colors font-sans"
                >
                  12-Week Ticket Calculator
                </button>
              ) : (
                <strong className="font-semibold text-[#012169]">12-Week Ticket Calculator</strong>
              )}{" "}
              and searching for cheaper routes through this portal, my commute is now much more affordable. I love the design heritage page on this site too :)"
            </>
          )}
        </p>
      </div>

      {/* Call to travel action footer */}
      <div className="bg-slate-50 px-4 sm:px-5 py-4 border-t border-slate-150 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="flex flex-col">
          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-semibold">{footerLabel}</span>
          <span className="text-sm font-display font-extrabold text-emerald-600">{footerStat}</span>
        </div>
        <a 
          href={isHistory ? "#rail-alphabet-typewriter-section" : isSmart ? "#rail-alphabet-typewriter-section" : "#fare-finder-section"}
          onClick={handleActionClick}
          className="bg-[#012169] hover:bg-opacity-95 text-white font-sans font-semibold text-xs py-2.5 px-4 rounded-lg shadow-sm cursor-pointer transition text-center whitespace-nowrap"
        >
          {actionLabel}
        </a>
      </div>

    </div>
  );
}

