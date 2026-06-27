import React, { useState, useEffect, useRef } from 'react';
import { Page, Station } from './types';
import Header from './components/Header';
import FareFinder from './components/FareFinder';
import DoubleArrowGeometry from './components/DoubleArrowGeometry';
import RailAlphabetTypewriter from './components/RailAlphabetTypewriter';
import AdvanceTracker from './components/AdvanceTracker';
import InteractiveTimeline from './components/InteractiveTimeline';
import DidYouKnow from './components/DidYouKnow';
import ClairePanel from './components/ClairePanel';
import VisualInspector from './components/VisualInspector';
import AdSenseContainer from './components/AdSenseContainer';
import CookieBanner from './components/CookieBanner';
import LegalModals from './components/LegalModals';
// @ts-expect-error - image asset
import ticketImg from './assets/images/ticket.png';
// @ts-expect-error - image asset
import heroImg from './assets/images/british_rail_history_hero_1780041941158.png';
import { 
  Train, ArrowRight, ArrowUpDown, Calendar, HelpCircle, ShieldCheck, 
  Clock, Info, Layout, Sliders, Type, Landmark, ExternalLink, Sparkles,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { TIMELINE_EVENTS, DESIGN_ELEMENTS } from './data/railData';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [currentTab, setTab] = useState<Page>('home');
  const [pendingScroll, setPendingScroll] = useState(false);
  const [pendingCalculatorScroll, setPendingCalculatorScroll] = useState(false);
  const [pendingStrategiesScroll, setPendingStrategiesScroll] = useState(false);
  const [activeLegalModal, setActiveLegalModal] = useState<'about' | 'privacy' | null>(null);
  const [cookieBannerKey, setCookieBannerKey] = useState(0);
  const [activeDesignIndex, setActiveDesignIndex] = useState(0);
  const [designTouchStart, setDesignTouchStart] = useState<number | null>(null);
  const [designTouchEnd, setDesignTouchEnd] = useState<number | null>(null);

  const handleDesignTouchStart = (e: React.TouchEvent) => {
    setDesignTouchStart(e.targetTouches[0].clientX);
  };

  const handleDesignTouchMove = (e: React.TouchEvent) => {
    setDesignTouchEnd(e.targetTouches[0].clientX);
  };

  const handleDesignTouchEnd = () => {
    if (!designTouchStart || !designTouchEnd) return;
    const distance = designTouchStart - designTouchEnd;
    const minSwipeDistance = 50;
    if (distance > minSwipeDistance) {
      setActiveDesignIndex((prev) => (prev === DESIGN_ELEMENTS.length - 1 ? 0 : prev + 1));
    } else if (distance < -minSwipeDistance) {
      setActiveDesignIndex((prev) => (prev === 0 ? DESIGN_ELEMENTS.length - 1 : prev - 1));
    }
    setDesignTouchStart(null);
    setDesignTouchEnd(null);
  };

  const prevTabRef = useRef<Page>(currentTab);

  // Bilateral synchronization between URL hash and application state
  useEffect(() => {
    const getTabFromHash = (): Page => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'home' || hash === 'history' || hash === 'guide') {
        return hash as Page;
      }
      return 'home';
    };

    // Initialize on mount
    setTab(getTabFromHash());

    const handleHashChange = () => {
      setTab(getTabFromHash());
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Update hash when local tab shifts
  useEffect(() => {
    const currentHash = window.location.hash.replace('#', '');
    if (currentHash !== currentTab) {
      window.location.hash = currentTab;
    }
  }, [currentTab]);

  // Reset scroll to top of viewport ONLY on authentic tab switch to prevent scroll clamping issues
  // but only if we are not coordinating a pending scroll navigation to the splitter
  useEffect(() => {
    if (prevTabRef.current !== currentTab) {
      prevTabRef.current = currentTab;
      if (!pendingScroll) {
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
    }
  }, [currentTab, pendingScroll]);

  // Robust pending scroll handler that runs after Home tab enters the DOM
  useEffect(() => {
    if (currentTab === 'home' && pendingScroll) {
      const scrollTimes = [0, 50, 150, 300, 500, 800, 1200];
      const timers: NodeJS.Timeout[] = [];

      scrollTimes.forEach((delay) => {
        const t = setTimeout(() => {
          const el = document.getElementById('fare-finder-section');
          if (el) {
            el.scrollIntoView({ behavior: 'auto', block: 'start' });
            if (delay === scrollTimes[scrollTimes.length - 1]) {
              setPendingScroll(false);
            }
          }
        }, delay);
        timers.push(t);
      });

      return () => {
        timers.forEach(clearTimeout);
      };
    }
  }, [currentTab, pendingScroll]);

  // Robust pending calculator scroll handler that runs after Guide tab enters the DOM
  useEffect(() => {
    if (currentTab === 'guide' && pendingCalculatorScroll) {
      const scrollTimes = [0, 50, 150, 300, 500, 800, 1200];
      const timers: NodeJS.Timeout[] = [];

      scrollTimes.forEach((delay) => {
        const t = setTimeout(() => {
          const el = document.getElementById('advance-tracker-section');
          if (el) {
            el.scrollIntoView({ behavior: 'auto', block: 'start' });
            if (delay === scrollTimes[scrollTimes.length - 1]) {
              setPendingCalculatorScroll(false);
            }
          }
        }, delay);
        timers.push(t);
      });

      return () => {
        timers.forEach(clearTimeout);
      };
    }
  }, [currentTab, pendingCalculatorScroll]);

  // Robust pending strategies scroll handler that runs after Guide tab enters the DOM
  useEffect(() => {
    if (currentTab === 'guide' && pendingStrategiesScroll) {
      const scrollTimes = [0, 50, 150, 300, 500, 800, 1200];
      const timers: NodeJS.Timeout[] = [];

      scrollTimes.forEach((delay) => {
        const t = setTimeout(() => {
          const el = document.getElementById('strategies-guide');
          if (el) {
            el.scrollIntoView({ behavior: 'auto', block: 'start' });
            if (delay === scrollTimes[scrollTimes.length - 1]) {
              setPendingStrategiesScroll(false);
            }
          }
        }, delay);
        timers.push(t);
      });

      return () => {
        timers.forEach(clearTimeout);
      };
    }
  }, [currentTab, pendingStrategiesScroll]);

  // Precision custom inline SVG representing the double arrow logo
  const doubleArrowLogo = (
    <svg viewBox="0 0 100 60" className="w-12 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="square">
      <path d="M 40 12 L 15 12 L 35 27 L 85 27" />
      <path d="M 60 48 L 85 48 L 65 33 L 15 33" />
      <path d="M 35 27 L 15 12 M 65 33 L 85 48" />
    </svg>
  );

  const navigateToSplitter = () => {
    if (currentTab === 'home') {
      const el = document.getElementById('fare-finder-section');
      if (el) {
        el.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
    } else {
      setPendingScroll(true);
      setTab('home');
    }
  };

  const navigateToCalculator = () => {
    if (currentTab === 'guide') {
      const el = document.getElementById('advance-tracker-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      setPendingCalculatorScroll(true);
      setTab('guide');
    }
  };

  const navigateToStrategies = () => {
    if (currentTab === 'guide') {
      const el = document.getElementById('strategies-guide');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      setPendingStrategiesScroll(true);
      setTab('guide');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased">
      
      {/* Global Brand Header with custom Double Arrow logo */}
      <Header currentTab={currentTab} setTab={setTab} />

      {/* Main Single Page Tab Router with Motion Transitions */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          
          {/* ==================== 1. HOME & FARE FINDER TAB ==================== */}
          {currentTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {/* Home Hero Split - Preserves Legacy Index Layout */}
              <section id="hero-home" className="relative bg-[#012169] text-white py-16 lg:py-24 overflow-hidden">
                {/* Visual grid backdrop lines */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                  <div className="flex flex-col gap-4 lg:grid lg:grid-cols-12 lg:gap-10 lg:items-center max-lg:items-center max-lg:text-center">
                    
                    {/* Left text column */}
                    <div className="max-lg:contents lg:col-span-7 lg:space-y-4">
                      
                      <h1 className="hero-heading font-display font-extrabold tracking-tight text-white leading-tight max-lg:order-2 max-lg:max-w-xl">
                        Travel Smarter on UK Rail
                      </h1>
                      
                      <p className="text-lg text-slate-200 font-normal leading-relaxed max-w-2xl max-lg:order-3">
                        Find cheap fares, master split-ticketing, and explore the glorious design history of British railways.
                      </p>

                      <div className="flex flex-col sm:flex-row gap-4 pt-1 max-lg:order-5 max-lg:w-full max-lg:justify-center">
                        <a 
                          href="#fare-finder-section"
                          className="px-6 py-3 bg-[#a8081b] hover:bg-opacity-95 text-white rounded-xl font-bold text-center text-sm shadow-md transition-all cursor-pointer"
                        >
                          Find Cheapest Fares Now
                        </a>
                        <button 
                          onClick={() => setTab('guide')}
                          className="px-6 py-3 bg-transparent border-2 border-white/60 hover:border-white hover:bg-white/10 text-white rounded-xl font-bold text-center text-sm transition-all cursor-pointer"
                        >
                          Smart Split-Ticket Tips
                        </button>
                      </div>
                    </div>

                    {/* Right Interactive Ticket graphic - Authentic image asset from original site, cleaned up */}
                    <div className="lg:col-span-5 flex justify-center max-lg:order-4 max-lg:w-full">
                      <div className="relative max-w-sm w-full">
                        <img 
                          src={ticketImg} 
                          alt="Prinstine clean-edged vintage British Rail ticket asset" 
                          className="w-full h-auto object-contain bg-transparent"
                          style={{ 
                            filter: 'drop-shadow(-12px 16px 20px rgba(15, 23, 42, 0.42))' 
                          }}
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>

                  </div>
                </div>
              </section>

              {/* CHEAPEST FARE FINDER REACT INTERACTIVE MODULE */}
              <section className="py-12 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <FareFinder />
                </div>
              </section>

              {/* STEP CARDS - How it Works section */}
              <section className="py-12 bg-white border-y border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center max-w-2xl mx-auto mb-10">
                    <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-rail-blue tracking-tight">
                      How to Secure the Cheapest Fares
                    </h2>
                    <p className="text-sm text-slate-500 font-sans mt-2">
                      Slicing ticket pricing on the UK National Rail network is simple when using split-tickets. Follow these guidelines:
                    </p>
                  </div>

                  {/* 12-column layout carrying steps and Claire's panel side-by-side */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mt-8">
                    
                    {/* Left Column: 4 Step Cards */}
                    <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="bg-slate-50 rounded-xl border border-slate-200/60 p-5 hover:shadow-md transition flex flex-col justify-between">
                        <div>
                          <span className="text-xs font-mono font-black text-[#a8081b] bg-red-100/80 px-2 py-1 rounded">01</span>
                          <h4 className="font-display font-bold text-slate-800 text-sm mt-4">Destination Search</h4>
                          <p className="text-xs text-slate-600 mt-2 leading-relaxed font-sans">
                            Enter your starting and target stations. Autocomplete will filter actual UK transit stations instantly.
                          </p>
                        </div>
                      </div>

                      <div className="bg-slate-50 rounded-xl border border-slate-200/60 p-5 hover:shadow-md transition flex flex-col justify-between">
                        <div>
                          <span className="text-xs font-mono font-black text-[#a8081b] bg-red-100/80 px-2 py-1 rounded">02</span>
                          <h4 className="font-display font-bold text-slate-800 text-sm mt-4">Splitting Algorithmic Points</h4>
                          <p className="text-xs text-slate-600 mt-2 leading-relaxed font-sans">
                            The ticket model calculates splitting stations (e.g. York). Keep seat reservations on the same carriages!
                          </p>
                        </div>
                      </div>

                      <div className="bg-slate-50 rounded-xl border border-slate-200/60 p-5 hover:shadow-md transition flex flex-col justify-between">
                        <div>
                          <span className="text-xs font-mono font-black text-[#a8081b] bg-red-100/80 px-2 py-1 rounded">03</span>
                          <h4 className="font-display font-bold text-slate-800 text-sm mt-4">Enforce Railcard Codes</h4>
                          <p className="text-xs text-slate-600 mt-2 leading-relaxed font-sans">
                            Applying digital Railcards (Two Together, Student 16-25, Senior) cuts another 34% off the price.
                          </p>
                        </div>
                      </div>

                      <div className="bg-slate-50 rounded-xl border border-slate-200/60 p-5 hover:shadow-md transition flex flex-col justify-between">
                        <div>
                          <span className="text-xs font-mono font-black text-[#a8081b] bg-red-100/80 px-2 py-1 rounded">04</span>
                          <h4 className="font-display font-bold text-slate-800 text-sm mt-4">Secure Real Purchase</h4>
                          <p className="text-xs text-slate-600 mt-2 leading-relaxed font-sans">
                            Clicking booking routes you to official, secure Trainline windows containing your parameters.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Claire Panel */}
                    <div className="lg:col-span-4" id="home-claire-panel-container">
                      <ClairePanel 
                        compact={true} 
                        onNavigateToSplitter={navigateToSplitter} 
                        onNavigateToCalculator={navigateToCalculator} 
                      />
                    </div>

                  </div>
                </div>
              </section>

              {/* ADVERTISEMENT PLACEHOLDER (AdSense Enabled) */}
              <AdSenseContainer />

              {/* THREE COLUMN INFO GRID */}
              <section className="py-12 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition">
                      <div>
                        <div className="text-xl mb-3">🏛️</div>
                        <h4 className="font-display font-bold text-slate-800">Historic Graphic Legacy</h4>
                        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                          Discover Gerry Barney's mathematical grid logo design and the legendary Rail Alphabet typography crafted by Jock Kinneir & Margaret Calvert.
                        </p>
                      </div>
                      <button 
                        onClick={() => setTab('history')}
                        className="text-xs font-bold text-[#a8081b] hover:text-rail-blue transition mt-5 flex items-center space-x-1 cursor-pointer"
                      >
                        Explore Design Archive ➔
                      </button>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition">
                      <div>
                        <div className="text-xl mb-3">🎫</div>
                        <h4 className="font-display font-bold text-slate-800">Split Ticket Mastery</h4>
                        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                          Learn how breaking up your rail trips into sequential segments can cut 40%+ off the cost of your journey.
                        </p>
                      </div>
                      <button 
                        onClick={navigateToStrategies}
                        className="text-xs font-bold text-[#a8081b] hover:text-rail-blue transition mt-5 flex items-center space-x-1 cursor-pointer"
                      >
                        Read Travel Strategies ➔
                      </button>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition">
                      <div>
                        <div className="text-xl mb-3">📅</div>
                        <h4 className="font-display font-bold text-slate-800">The 12-Week Release Cycle</h4>
                        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                          Train companies release their cheapest advance inventory 12 weeks ahead. Track release dates using our easy reminder tool.
                        </p>
                      </div>
                      <button 
                        onClick={navigateToCalculator}
                        className="text-xs font-bold text-[#a8081b] hover:text-rail-blue transition mt-5 flex items-center space-x-1 cursor-pointer"
                      >
                        Release Calculator & Reminder Tool ➔
                      </button>
                    </div>

                  </div>
                </div>
              </section>

            </motion.div>
          )}

          {/* ==================== 2. HISTORY & DESIGN TAB ==================== */}
          {currentTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {/* History Hero Split - EXACTLY preserves index hero split styling as requested */}
              <section id="hero-history" className="relative bg-[#012169] text-white py-16 lg:py-24 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                  <div className="flex flex-col gap-4 lg:grid lg:grid-cols-12 lg:gap-10 lg:items-center max-lg:items-center max-lg:text-center">
                    
                    {/* Left text column */}
                    <div className="max-lg:contents lg:col-span-7 lg:space-y-4">
                      
                      <h1 className="hero-heading font-display font-extrabold tracking-tight text-white leading-tight max-lg:order-2 max-lg:max-w-xl">
                        The Design Legacy of British Rail
                      </h1>
                      
                      <p className="text-lg text-slate-200 font-normal leading-relaxed max-w-2xl max-lg:order-3">
                        Explore how a bold 1960s identity project transformed Britain's public railway system into an enduring icon of graphic design history.
                      </p>

                      <div className="flex flex-col sm:flex-row gap-4 pt-1 max-lg:order-5 max-lg:w-full max-lg:justify-center">
                        <a 
                          href="#exhibit"
                          onClick={(e) => {
                            e.preventDefault();
                            const el = document.getElementById('exhibit');
                            if (el) {
                              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                          }}
                          className="px-6 py-3 bg-[#a8081b] hover:bg-opacity-95 text-white rounded-xl font-bold text-center text-sm shadow-md transition-all cursor-pointer"
                        >
                          Explore Interactive Exhibit
                        </a>
                        <button 
                          onClick={() => setTab('home')}
                          className="px-6 py-3 bg-transparent border-2 border-white/60 hover:border-white hover:bg-white/10 text-white rounded-xl font-bold text-center text-sm transition-all cursor-pointer"
                        >
                          Back to Travel Portal
                        </button>
                      </div>
                    </div>

                    {/* Right Image column - Drops in appropriate, attractive Hero image generated */}
                    <div className="lg:col-span-5 flex justify-center max-lg:order-4 max-lg:w-full">
                      <div className="relative rounded-2xl overflow-hidden border-4 border-white/15 shadow-2xl shadow-slate-950/50 aspect-[16/9] w-full max-w-md">
                        <img 
                          src={heroImg} 
                          alt="Iconic InterCity 125 train in its classic yellow and blue modernization era livery traveling through the British countryside" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        {/* Elegant vintage caption banner */}
                        <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 px-4 py-2 text-[11px] font-mono text-slate-300 flex justify-between border-t border-slate-800">
                          <span>INTERCITY 125 HST SPEED TUNING</span>
                          <span>EST. 1976</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </section>

              {/* CORPORATE DESIGN IDENTITY ELEMENTS GRID - From legacy history page */}
              <section id="exhibit" className="py-12 bg-white border-b border-slate-200/80 scroll-mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center max-w-2xl mx-auto mb-10">
                    <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-rail-blue tracking-tight">
                      Icons of Corporate Identity (1965)
                    </h2>
                    <p className="text-sm text-slate-500 font-sans mt-2">
                      Designed to unify thousand of platforms and locomotives under a singular public service graphic standard:
                    </p>
                  </div>

                  {/* Desktop Grid Layout */}
                  <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {DESIGN_ELEMENTS.map((elem) => {
                      const targetId = elem.id === 'double-arrow' || elem.id === 'flame-red'
                        ? 'double-arrow-geometry-section'
                        : elem.id === 'rail-alphabet'
                        ? 'rail-alphabet-typewriter-section'
                        : elem.id === 'intercity-125'
                        ? 'timeline-section'
                        : '';

                      return (
                        <div key={elem.id} className="bg-slate-50 rounded-xl border border-slate-200/50 p-5 flex flex-col justify-between hover:shadow-md transition">
                          <div>
                            <div className="flex justify-between items-center border-b border-slate-200 pb-2 mb-3">
                              <span className="text-xs font-mono font-black text-[#a8081b] bg-red-100/80 px-2 py-1 rounded">ELEMENT {elem.number}</span>
                              {targetId ? (
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    const el = document.getElementById(targetId);
                                    if (el) {
                                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    }
                                  }}
                                  className="text-xs font-bold text-[#a8081b] hover:text-rail-blue transition cursor-pointer font-sans"
                                >
                                  INTERACTIVE &gt;
                                </button>
                              ) : (
                                <span className="text-xs font-bold text-[#a8081b]">ACTIVE ERA</span>
                              )}
                            </div>
                            <h4 className="font-display font-bold text-slate-800 text-sm mt-1">{elem.title}</h4>
                            <p className="text-xs text-slate-600 mt-2 leading-relaxed">{elem.description}</p>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-4 italic font-sans font-medium">Design Research Unit archive</div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Mobile Interactive Carousel */}
                  <div className="md:hidden relative">
                    <div 
                      onTouchStart={handleDesignTouchStart}
                      onTouchMove={handleDesignTouchMove}
                      onTouchEnd={handleDesignTouchEnd}
                      className="overflow-hidden rounded-xl border border-slate-200/65 bg-slate-50 p-6 flex flex-col justify-between min-h-[220px]"
                    >
                      <AnimatePresence mode="wait">
                        {DESIGN_ELEMENTS.map((elem, idx) => {
                          if (idx !== activeDesignIndex) return null;
                          const targetId = elem.id === 'double-arrow' || elem.id === 'flame-red'
                            ? 'double-arrow-geometry-section'
                            : elem.id === 'rail-alphabet'
                            ? 'rail-alphabet-typewriter-section'
                            : elem.id === 'intercity-125'
                            ? 'timeline-section'
                            : '';

                          return (
                            <motion.div
                              key={elem.id}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              transition={{ duration: 0.2 }}
                              className="flex flex-col justify-between h-full flex-1 touch-pan-y select-none"
                            >
                              <div>
                                <div className="flex justify-between items-center border-b border-slate-200 pb-2 mb-3">
                                  <span className="text-xs font-mono font-black text-[#a8081b] bg-red-100/80 px-2 py-1 rounded">
                                    ELEMENT {elem.number}
                                  </span>
                                  {targetId ? (
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        const el = document.getElementById(targetId);
                                        if (el) {
                                          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                        }
                                      }}
                                      className="text-xs font-bold text-[#a8081b] hover:text-rail-blue transition cursor-pointer font-sans"
                                    >
                                      INTERACTIVE &gt;
                                    </button>
                                  ) : (
                                    <span className="text-xs font-bold text-[#a8081b]">ACTIVE ERA</span>
                                  )}
                                </div>
                                <h4 className="font-display font-bold text-slate-800 text-sm mt-1">{elem.title}</h4>
                                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{elem.description}</p>
                              </div>
                              <div className="text-[10px] text-slate-400 mt-4 italic font-sans font-medium">
                                Design Research Unit archive
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
                          onClick={() => setActiveDesignIndex((prev) => (prev === 0 ? DESIGN_ELEMENTS.length - 1 : prev - 1))}
                          className="text-slate-500 hover:text-[#a8081b] active:scale-95 transition cursor-pointer p-0.5"
                          aria-label="Previous slide"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>

                        {/* Dots Indicators */}
                        <div className="flex space-x-1.5">
                          {DESIGN_ELEMENTS.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setActiveDesignIndex(idx)}
                              className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                                idx === activeDesignIndex ? 'w-4 bg-[#a8081b]' : 'bg-slate-200 hover:bg-slate-350'
                              }`}
                              aria-label={`Go to slide ${idx + 1}`}
                            />
                          ))}
                        </div>

                        <button
                          onClick={() => setActiveDesignIndex((prev) => (prev === DESIGN_ELEMENTS.length - 1 ? 0 : prev + 1))}
                          className="text-slate-500 hover:text-[#a8081b] active:scale-95 transition cursor-pointer p-0.5"
                          aria-label="Next slide"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* MODULE 1: INTERACTIVE TIMELINE */}
              <section id="timeline-section" className="py-12 bg-slate-50 border-b border-slate-200 scroll-mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <InteractiveTimeline />
                </div>
              </section>

              {/* MODULE 2: INTERACTIVE GERRY BARNEY MATHEMATICAL GEOMETRY DESIGN SLIDERS */}
              <section id="double-arrow-geometry-section" className="py-12 bg-white border-b border-slate-200 scroll-mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <DoubleArrowGeometry />
                </div>
              </section>

              {/* MODULE 3: INTERACTIVE RAIL ALPHABET TYPOGRAPHY SIGN GENERATOR */}
              <section id="rail-alphabet-typewriter-section" className="py-12 bg-slate-50 border-b border-slate-200 scroll-mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <RailAlphabetTypewriter />
                </div>
              </section>

              {/* MODULE 4: DID YOU KNOW SECTION */}
              <section className="py-12 bg-white border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <DidYouKnow 
                    onNavigateToSplitter={navigateToSplitter} 
                    onNavigateToCalculator={navigateToCalculator} 
                  />
                </div>
              </section>

            </motion.div>
          )}

          {/* ==================== 3. SMART TRAVEL GUIDE TAB ==================== */}
          {currentTab === 'guide' && (
            <motion.div
              key="guide"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {/* Travel Guide Hero Split - EXACTLY preserves index hero split styling as requested */}
              <section id="hero-guide" className="relative bg-[#012169] text-white py-16 lg:py-24 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                  <div className="flex flex-col gap-4 lg:grid lg:grid-cols-12 lg:gap-10 lg:items-center max-lg:items-center max-lg:text-center">
                    
                    {/* Left text column */}
                    <div className="max-lg:contents lg:col-span-7 lg:space-y-4">
                      <div className="inline-flex items-center space-x-2 bg-rose-950/40 border border-[#a8081b]/50 px-3 py-1 rounded-full text-xs text-red-200 max-lg:order-1">
                        <Clock className="w-3.5 h-3.5 text-[#a8081b]" />
                        <span className="font-mono tracking-wide">Advance Fare Hacks</span>
                      </div>
                      
                      <h1 className="hero-heading font-display font-extrabold tracking-tight text-white leading-tight max-lg:order-2 max-lg:max-w-xl">
                        Smart Travel Guide and Fare Secrets
                      </h1>
                      
                      <p className="text-lg text-slate-200 font-normal leading-relaxed max-w-2xl max-lg:order-3">
                        Overpaying for train journeys? Learn core strategies when booking, leverage split-tickets, maximize discounts and make your UK travel budget go further.
                      </p>

                      <div className="flex flex-col sm:flex-row gap-4 pt-1 max-lg:order-5 max-lg:w-full max-lg:justify-center">
                        <a 
                          href="https://www.thetrainline.com/trains/great-britain/split-tickets"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-6 py-3 bg-[#a8081b] hover:bg-opacity-95 text-white rounded-xl font-bold text-center text-sm shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
                        >
                          <span>Check Fares Live on Trainline</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <a 
                          href="#strategies-guide"
                          onClick={(e) => {
                            e.preventDefault();
                            const el = document.getElementById('strategies-guide');
                            if (el) {
                              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                          }}
                          className="px-6 py-3 bg-transparent border-2 border-white/60 hover:border-white hover:bg-white/10 text-white rounded-xl font-bold text-center text-sm transition-all text-center cursor-pointer"
                        >
                          Read Core Strategies
                        </a>
                      </div>
                    </div>

                    {/* Right Dynamic visual column */}
                    <div className="lg:col-span-5 flex justify-center max-lg:order-4 max-lg:w-full">
                      <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl max-w-sm w-full shadow-xl relative overflow-hidden text-slate-300">
                        <div className="flex items-center space-x-2 text-rose-500 mb-3 border-b border-slate-800 pb-2">
                          <ShieldCheck className="w-5 h-5" />
                          <span className="text-xs font-mono font-bold tracking-widest uppercase text-slate-200">SOLID FARE REDUCTIONS</span>
                        </div>
                        <ul className="space-y-3.5 text-xs">
                          <li className="flex items-start space-x-2">
                            <span className="text-emerald-400 mt-0.5 font-bold">✓</span>
                            <span><strong>Split ticketing:</strong> Legally divides journeys, saving up to ~43%, sometimes without even swapping seat!</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span className="text-emerald-400 mt-0.5 font-bold">✓</span>
                            <span><strong>12-Week Release:</strong> Grab Tier 1 prices the moment they release on the system.</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span className="text-emerald-400 mt-0.5 font-bold">✓</span>
                            <span><strong>Off-Peak windows:</strong> Avoid Monday to Friday peak hours (06:30-09:30 and 15:30-18:30).</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                  </div>
                </div>
              </section>

              {/* DYNAMIC 12-WEEK BOOKING WINDOW TRACKER REMINDER CALCULATOR */}
              <section id="advance-tracker-section" className="py-12 bg-slate-50 scroll-mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <AdvanceTracker onNavigateToSplitter={navigateToSplitter} />
                </div>
              </section>

              {/* DETAILED TRAVEL HACKS AND FARES SECTION */}
              <section id="strategies-guide" className="py-12 bg-white border-y border-slate-200 scroll-mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center max-w-2xl mx-auto mb-12">
                    <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-rail-blue tracking-tight">
                      UK National Rail Booking Cheatsheet
                    </h2>
                    <p className="text-sm text-slate-500 font-sans mt-2">
                      Master these four proven tactics to save hundreds of pounds in yearly travel.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto items-stretch">
                    
                    {/* Left Column: Tactics Grid */}
                    <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 relative flex flex-col justify-between">
                        <div>
                          <div className="absolute top-0 right-0 bg-amber-400 text-slate-900 text-[10px] font-mono font-bold px-2 py-0.5 rounded-bl">
                            TACTIC A
                          </div>
                          <h4 className="font-display font-bold text-slate-950 text-base mb-2">Mastering Split-Ticketing</h4>
                          <p className="text-xs text-slate-600 leading-relaxed font-sans">
                            Under UK National Rail conditions of carriage, <strong className="highlight-text">split tickets are completely valid</strong> provided the train physically halts at your split station(s). For example, if you are traveling on an LNER HST from London King's Cross to Edinburgh Waverley, buying 'London to York' + 'York to Edinburgh Waverley' tickets is legally valid as long as the train makes a scheduled stop at York station, even if you don't stand up or change seats!
                          </p>
                        </div>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 relative flex flex-col justify-between">
                        <div>
                          <div className="absolute top-0 right-0 bg-amber-400 text-slate-900 text-[10px] font-mono font-bold px-2 py-0.5 rounded-bl">
                            TACTIC B
                          </div>
                          <h4 className="font-display font-bold text-slate-950 text-base mb-2">The Two Together Trick</h4>
                          <p className="text-xs text-slate-600 leading-relaxed font-sans">
                            If you travel with a spouse, sibling, or peer, the <strong className="highlight-text">Two Together Railcard</strong> costs just £30 and is valid for a whole year. It slices 34% off your total checkout standard price on all joint travel after 9:30 AM weekdays, paying for itself on just one medium-range trip (such as London to York return).
                          </p>
                        </div>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 relative flex flex-col justify-between">
                        <div>
                          <div className="absolute top-0 right-0 bg-amber-400 text-slate-900 text-[10px] font-mono font-bold px-2 py-0.5 rounded-bl">
                            TACTIC C
                          </div>
                          <h4 className="font-display font-bold text-slate-950 text-base mb-2">Advance Tickets Block Releases</h4>
                          <p className="text-xs text-slate-600 leading-relaxed font-sans">
                            Unlike airline ticket price algorithms that move dynamically according to user browsing queries, train ticket prices are distributed in static <strong className="highlight-text">"Tariff Tiers"</strong>. For example, the Tier 1 price remains flat until all inventory in Tier 1 on that train has been purchased.
                          </p>
                          <br/>
                          <p className="text-xs text-slate-600 leading-relaxed font-sans">
                            Securing bookings at the start of a 12-week release window guarantees you standard tickets at the lowest rate.
                          </p>
                        </div>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 relative flex flex-col justify-between">
                        <div>
                          <div className="absolute top-0 right-0 bg-amber-400 text-slate-900 text-[10px] font-mono font-bold px-2 py-0.5 rounded-bl">
                            TACTIC D
                          </div>
                          <h4 className="font-display font-bold text-slate-950 text-base mb-2">The Off-Peak & Super Off-Peak Windows</h4>
                          <p className="text-xs text-slate-600 leading-relaxed font-sans">
                            The busy, peak period, commuter time slots are heavily taxed. Adjusting your travel and booking only <strong className="highlight-text">"Off-Peak"</strong> or <strong className="highlight-text">"Super Off-Peak"</strong> tickets bypasses those premium fees entirely. The "Off-Peak" or "Super Off-Peak" slots usually start after 9:30 AM, and all day during weekends or public holidays.
                          </p>
                        </div>
                      </div>

                    </div>

                    {/* Right Column: Claire Panel */}
                    <div className="lg:col-span-4" id="guide-claire-panel-container">
                      <ClairePanel 
                        compact={true} 
                        onNavigateToSplitter={navigateToSplitter} 
                        onNavigateToCalculator={navigateToCalculator} 
                      />
                    </div>

                  </div>
                </div>
              </section>

              {/* ADVERTISEMENT PLACEHOLDER (AdSense Slot 2) */}
              <AdSenseContainer slotIndex={2} />

              {/* FAQ Section */}
              <section className="py-12 bg-slate-50">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-8">
                    <h3 className="font-display font-bold text-xl text-rail-blue tracking-tight">Frequently Answered Questions - FAQs</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <h5 className="font-bold text-xs font-sans text-slate-800">Do I have to change seats or get off when using Split Tickets?</h5>
                      <p className="text-xs text-slate-600 mt-2">As long as the same train is specified for your next journey segment then... No! You can just relax and stay in your reserved seat. Of course, depending on the route and schedule, your next segment may also be on another train.</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <h5 className="font-bold text-xs font-sans text-slate-800">What happens if a connecting train is delayed and I miss my connection?</h5>
                      <p className="text-xs text-slate-600 mt-2">Even if you use split tickets, the UK National Rail Conditions of Carriage protect your whole journey. You are permitted to board the next available scheduled train service at no additional cost.</p>
                    </div>
                  </div>
                </div>
              </section>

            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* ADVERTISEMENT PLACEHOLDER (AdSense Slot 3) */}
      <AdSenseContainer slotIndex={3} />

      {/* <VisualInspector /> */}
      {/* Symmetrical Brand Footer */}
      <footer className="bg-[#012169] border-t border-blue-900/60 text-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-center md:text-left">
            <div>
              <div className="flex items-center justify-center md:justify-start">
                <span className="font-display font-extrabold text-white uppercase tracking-wider text-sm">
                  BRITISH RAIL DESIGN ARCHIVE
                </span>
              </div>
              <p className="text-[10px] text-slate-300 mt-2 max-w-xl leading-relaxed">
                An independent home for British railway design heritage and travel ticket tips. The site funds itself through ethical travel partnerships and is not affiliated with National Rail, Great British Railways, or the Department for Transport. ❤️🙏
              </p>
            </div>

            <div className="flex flex-col items-center md:items-end space-y-2 text-right">
              <p className="text-[11px] font-sans text-slate-100">
                &copy; 2009-{new Date().getFullYear()} BritishRail.co.uk. All rights reserved.
              </p>
              
              <div className="flex flex-wrap justify-center md:justify-end gap-x-4 gap-y-1.5 text-[11px] text-slate-300">
                <button 
                  onClick={() => setActiveLegalModal('about')}
                  className="hover:text-amber-400 transition cursor-pointer font-sans underline decoration-dotted underline-offset-2"
                >
                  About & Contact
                </button>
                <span className="text-slate-500 hidden sm:inline">•</span>
                <button 
                  onClick={() => setActiveLegalModal('privacy')}
                  className="hover:text-amber-400 transition cursor-pointer font-sans underline decoration-dotted underline-offset-2"
                >
                  Privacy & Cookies
                </button>
                <span className="text-slate-500 hidden sm:inline">•</span>
                <button 
                  onClick={() => {
                    localStorage.removeItem('br_cookie_consent');
                    setCookieBannerKey(prev => prev + 1);
                  }}
                  className="hover:text-amber-400 transition cursor-pointer font-sans underline decoration-dotted underline-offset-2"
                >
                  Manage Cookies
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Cookie Consent Banner */}
      <CookieBanner 
        consentTrigger={cookieBannerKey} 
        onOpenPrivacy={() => setActiveLegalModal('privacy')} 
      />

      {/* Legal Overlay Modals */}
      <LegalModals 
        activeModal={activeLegalModal} 
        onClose={() => setActiveLegalModal(null)} 
      />

    </div>
  );
}
