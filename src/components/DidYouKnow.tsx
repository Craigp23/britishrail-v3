import React, { useState } from 'react';
import { HelpCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ClairePanel from './ClairePanel';

interface ObscureFact {
  id: string;
  badge: string;
  badgeColor: string;
  title: string;
  text: string;
}

interface DidYouKnowProps {
  onNavigateToSplitter?: () => void;
  onNavigateToCalculator?: () => void;
}

export default function DidYouKnow({ onNavigateToSplitter, onNavigateToCalculator }: DidYouKnowProps) {
  const [activeFactId, setActiveFactId] = useState<string | null>(null);
  const [activeFactIndex, setActiveFactIndex] = useState(0);
  const [factTouchStart, setFactTouchStart] = useState<number | null>(null);
  const [factTouchEnd, setFactTouchEnd] = useState<number | null>(null);

  const handleFactTouchStart = (e: React.TouchEvent) => {
    setFactTouchStart(e.targetTouches[0].clientX);
  };

  const handleFactTouchMove = (e: React.TouchEvent) => {
    setFactTouchEnd(e.targetTouches[0].clientX);
  };

  const handleFactTouchEnd = () => {
    if (!factTouchStart || !factTouchEnd) return;
    const distance = factTouchStart - factTouchEnd;
    const minSwipeDistance = 50;
    if (distance > minSwipeDistance) {
      setActiveFactIndex((prev) => (prev === facts.length - 1 ? 0 : prev + 1));
    } else if (distance < -minSwipeDistance) {
      setActiveFactIndex((prev) => (prev === 0 ? facts.length - 1 : prev - 1));
    }
    setFactTouchStart(null);
    setFactTouchEnd(null);
  };

  const facts: ObscureFact[] = [
    {
      id: 'mail-rail',
      badge: 'Obscure Engineering',
      badgeColor: 'text-rose-600 bg-rose-50 border-rose-100',
      title: 'London’s Underground "Mail Rail"',
      text: 'Long before modern parcel networks, London ran a secret, completely driverless underground subway from 1927 until 2003. Built exclusively for the Post Office, specialized miniature trains zipped letters between sorting halls to bypass gridlocked street carriage traffic!'
    },
    {
      id: 'commute-sketch',
      badge: 'Design Genesis',
      badgeColor: 'text-amber-600 bg-amber-50 border-amber-100',
      title: 'Gerry’s Commuter Sketchpad',
      text: 'Gerry Barney famously sketched the legendary interlocking parallel "Double Arrow" logo on his actual morning train commute using just a graphite pencil and envelope back. The Design Research Unit approved it instantly, and it remains globally recognizable sixty years on.'
    },
    {
      id: 'mallard-record',
      badge: 'World Speed Record',
      badgeColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      title: 'Mallard’s Unbroken Steam Peak',
      text: 'On July 3, 1938, long before intercity electric rails, steam behemoth LNER Class A4 "Mallard" roared down England’s Stoke Bank at a colossal speed of 126 mph (202.8 km/h). This record for steam locomotive traction remains proudly unbroken to this very day.'
    },
    {
      id: 'flying-scotsman',
      badge: 'Locomotive Feat',
      badgeColor: 'text-blue-600 bg-blue-50 border-blue-100',
      title: 'Walking Through Coal at 60 mph',
      text: 'To complete the first regular non-stop runs from London to Edinburgh, engineers built a tiny, claustrophobic crawling tunnel right through the middle of the "Flying Scotsman" coal tender. This allowed driver crews to safely swap places at speed without halting the engine!'
    },
    {
      id: 'windshield-test',
      badge: 'Typographic Trial',
      badgeColor: 'text-indigo-600 bg-indigo-50 border-indigo-100',
      title: 'The Roof-Rack Typographic Trials',
      text: 'To test the legibility of Margaret Calvert’s "Rail Alphabet" font, officials mounted prototype signs to the roof of a car and raced down private runways at over 75 mph. Standing observers evaluated if letters stayed crisp and legible under speed and bad weather.'
    },
    {
      id: 'toothpaste-livery',
      badge: 'Heritage Fact',
      badgeColor: 'text-purple-600 bg-purple-50 border-purple-100',
      title: 'The Famous "Toothpaste" Trains',
      text: 'Network SouthEast’s bright original liveries (red, white, and blue) were initially mocked by classic rail enthusiasts and dubbed the "Toothpaste" style. Despite the criticism, the colourful sector design completely revitalised commuter numbers and turned a deficit into a profit.'
    },
    {
      id: 'longest-platform',
      badge: 'Station Trivia',
      badgeColor: 'text-teal-600 bg-teal-50 border-teal-100',
      title: 'Gloucester’s Six-Pitch Platform',
      text: 'Gloucester railway station plays host to the single longest continuous railway platform in the United Kingdom. Measuring an incredible 602 meters (1,975 feet) long, it holds enough room to stretch over six football fields back-to-back!'
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto my-6">
      
      {/* Header Block */}
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-2.5 bg-amber-100 rounded-lg text-amber-700 animate-pulse-slow">
          <HelpCircle className="w-6 h-6 animate-bounce" />
        </div>
        <div>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-rail-blue tracking-tight">
            Did You Know? Obscure Fares & British Rail Heritage
          </h2>
          <p className="text-sm text-slate-500 font-sans">
            Fascinating secrets, historic anomalies, and obscure trivia behind Great Britain's rich railway design and engineering culture.
          </p>
        </div>
      </div>

      {/* Main Grid: Left is Facts Bento, Right is Satisfied Passenger Image with Travel Tip */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Facts Bento/Accordion Grid (7 columns) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          {/* Tablet & Desktop Grid */}
          <div className="hidden sm:grid grid-cols-2 gap-4">
            {facts.map((fact, index) => {
              const isActive = activeFactId === fact.id;
              
              return (
                <div 
                  key={fact.id}
                  onClick={() => setActiveFactId(isActive ? null : fact.id)}
                  className={`border rounded-xl p-4 transition-all duration-200 cursor-pointer select-none relative group h-full flex flex-col justify-between ${
                    isActive 
                      ? 'border-[#E21A22] bg-slate-50 shadow-md ring-2 ring-red-500/15'
                      : 'border-slate-200/80 hover:border-slate-350 hover:bg-slate-50/50'
                  }`}
                >
                  <div>
                    {/* Badge */}
                    <div className="flex justify-between items-center mb-2.5">
                      <span className={`text-[9px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded border ${fact.badgeColor}`}>
                        {fact.badge}
                      </span>
                      <span className="text-[10px] text-slate-350 font-mono">0{index + 1}</span>
                    </div>

                    {/* Headline */}
                    <h4 className="font-display font-bold text-slate-800 text-xs sm:text-sm tracking-tight mb-2 group-hover:text-rail-blue transition">
                      {fact.title}
                    </h4>

                    {/* Fact Text with clamping unless active */}
                    <p className={`text-xs text-slate-600 leading-relaxed font-sans ${
                      isActive ? 'line-clamp-none' : 'line-clamp-3 sm:line-clamp-4'
                    }`}>
                      {fact.text}
                    </p>
                  </div>

                  {/* Read indicator */}
                  <div className="text-right text-[10px] text-slate-400 font-mono mt-3 border-t border-slate-100 pt-1.5 font-bold">
                    {isActive ? 'Click to collapse ▲' : 'Click to expand ▼'}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Swipeable/Interactive Carousel */}
          <div className="sm:hidden relative">
            <div 
              onTouchStart={handleFactTouchStart}
              onTouchMove={handleFactTouchMove}
              onTouchEnd={handleFactTouchEnd}
              className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-5 flex flex-col justify-between min-h-[220px]"
            >
              <AnimatePresence mode="wait">
                {facts.map((fact, index) => {
                  if (index !== activeFactIndex) return null;
                  
                  return (
                    <motion.div
                      key={fact.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col justify-between h-full flex-1 touch-pan-y select-none"
                    >
                      <div>
                        {/* Badge */}
                        <div className="flex justify-between items-center mb-2.5">
                          <span className={`text-[9px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded border ${fact.badgeColor}`}>
                            {fact.badge}
                          </span>
                          <span className="text-[10px] text-slate-350 font-mono">0{index + 1} / 0{facts.length}</span>
                        </div>

                        {/* Headline */}
                        <h4 className="font-display font-bold text-slate-900 text-sm tracking-tight mb-2">
                          {fact.title}
                        </h4>

                        {/* Fact Text */}
                        <p className="text-xs text-slate-600 leading-relaxed font-sans">
                          {fact.text}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Integrated Carousel Navigation Pill */}
            <div className="flex items-center justify-center mt-4">
              <div className="inline-flex items-center space-x-3 bg-white border border-slate-200 shadow-sm rounded-xl py-1.5 px-3">
                <button
                  onClick={() => setActiveFactIndex((prev) => (prev === 0 ? facts.length - 1 : prev - 1))}
                  className="text-slate-500 hover:text-[#012169] active:scale-95 transition cursor-pointer p-0.5"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Dots Indicators */}
                <div className="flex space-x-1.5">
                  {facts.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveFactIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        idx === activeFactIndex ? 'w-4 bg-[#012169]' : 'bg-slate-200 hover:bg-slate-350'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setActiveFactIndex((prev) => (prev === facts.length - 1 ? 0 : prev + 1))}
                  className="text-slate-500 hover:text-[#012169] active:scale-95 transition cursor-pointer p-0.5"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Satisfied Passenger Card Column with our Reusable ClairePanel */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <ClairePanel 
            type="history"
            onNavigateToSplitter={onNavigateToSplitter} 
            onNavigateToCalculator={onNavigateToCalculator} 
          />
        </div>

      </div>

    </div>
  );
}
