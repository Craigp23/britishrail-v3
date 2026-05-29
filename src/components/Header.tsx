import { Page } from '../types';
import { Train, Menu, X, Landmark, Search } from 'lucide-react';
import { useState } from 'react';
// @ts-expect-error - image asset
import logoImg from '../assets/images/logo.png';

interface HeaderProps {
  currentTab: Page;
  setTab: (tab: Page) => void;
}

export default function Header({ currentTab, setTab }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Precision SVG path representing Gerry Barney's 1965 British Rail Double Arrow logo
  const doubleArrowLogoSVG = (
    <svg 
      viewBox="0 0 100 60" 
      className="w-12 h-8 text-rail-red transition-transform hover:scale-105 duration-200"
      fill="none" 
      stroke="currentColor" 
      strokeWidth="7" 
      strokeLinecap="square"
      strokeLinejoin="miter"
    >
      {/* Top arrow head facing left, bottom arrow head facing right, joined by parallel lines */}
      <path d="M 40 12 L 15 12 L 35 27 L 85 27" />
      <path d="M 60 48 L 85 48 L 65 33 L 15 33" />
      <path d="M 35 27 L 15 12 M 65 33 L 85 48" />
    </svg>
  );

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200/80 shadow-sm backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo & Brand title */}
          <div className="flex items-center cursor-pointer" onClick={() => { setTab('home'); setMobileMenuOpen(false); }}>
            <img 
              src={logoImg} 
              alt="britishrail.co.uk Logo" 
              className="h-10 md:h-11 w-auto object-contain hover:opacity-95 transition-all duration-200 pr-0 mr-0"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            <button
              onClick={() => setTab('home')}
              className={`pl-[8px] pr-[8px] ml-[16px] py-2 rounded-md font-sans font-medium text-sm transition-all duration-200 ${
                currentTab === 'home'
                  ? 'bg-rail-blue text-white shadow-sm'
                  : 'text-slate-600 hover:text-rail-blue hover:bg-slate-50'
              }`}
            >
              Home & Fare Finder
            </button>
            <button
              onClick={() => setTab('history')}
              className={`px-4 py-2 rounded-md font-sans font-medium text-sm transition-all duration-200 ${
                currentTab === 'history'
                  ? 'bg-rail-blue text-white shadow-sm'
                  : 'text-slate-600 hover:text-rail-blue hover:bg-slate-50'
              }`}
            >
              History & Design
            </button>
            <button
              onClick={() => setTab('guide')}
              className={`px-4 py-2 rounded-md font-sans font-medium text-sm transition-all duration-200 ${
                currentTab === 'guide'
                  ? 'bg-rail-blue text-white shadow-sm'
                  : 'text-slate-600 hover:text-rail-blue hover:bg-slate-50'
              }`}
            >
              Smart Travel Guide
            </button>
          </nav>

          {/* Right badge - Non-affiliated Notice */}
          <div className="hidden lg:flex items-center space-x-2 bg-slate-100/80 px-3 py-1.5 rounded-full border border-slate-200">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-mono text-slate-500 tracking-tight font-medium">
              Live Fares Active
            </span>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1">
          <button
            onClick={() => { setTab('home'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-3 rounded-md font-sans font-medium text-sm ${
              currentTab === 'home'
                ? 'bg-rail-blue text-white'
                : 'text-slate-600 hover:bg-slate-50 hover:text-rail-blue'
            }`}
          >
            Home & Fare Finder
          </button>
          <button
            onClick={() => { setTab('history'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-3 rounded-md font-sans font-medium text-sm ${
              currentTab === 'history'
                ? 'bg-rail-blue text-white'
                : 'text-slate-600 hover:bg-slate-50 hover:text-rail-blue'
            }`}
          >
            History & Design Archive
          </button>
          <button
            onClick={() => { setTab('guide'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-3 rounded-md font-sans font-medium text-sm ${
              currentTab === 'guide'
                ? 'bg-rail-blue text-white'
                : 'text-slate-600 hover:bg-slate-50 hover:text-rail-blue'
            }`}
          >
            Smart Travel Guide
          </button>
          
          <div className="pt-3 border-t border-slate-100 flex items-center space-x-2 px-4 justify-between">
            <span className="text-[11px] font-mono text-slate-400">Independent Historical Portal</span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full">
              Live Updates
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
