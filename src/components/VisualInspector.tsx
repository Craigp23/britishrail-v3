import { useState, useEffect, useRef, MouseEvent } from 'react';
import * as Lucide from 'lucide-react';

// Registry of main component container selectors mapping to files and line coordinates
interface CodeMapping {
  selector: string;
  component: string;
  file: string;
  approxLines: string;
  friendlyName: string;
  description: string;
}

const MODULE_CODE_MAPPINGS: CodeMapping[] = [
  {
    selector: '#rail-alphabet-typography-section',
    component: 'RailAlphabetTypewriter',
    file: '/src/components/RailAlphabetTypewriter.tsx',
    approxLines: 'lines 1000-1040',
    friendlyName: 'BR Typography Builder',
    description: 'The overall section container housing the Gerry Barney tribute station signage simulator.',
  },
  {
    selector: '#select-preset-signage',
    component: 'RailAlphabetTypewriter',
    file: '/src/components/RailAlphabetTypewriter.tsx',
    approxLines: 'lines 1100-1120',
    friendlyName: 'Station Sign Presets Dropdown',
    description: 'The select elements menu that loads standard configurations (Way Out, Platform 1, etc.)',
  },
  {
    selector: '#control-card',
    component: 'RailAlphabetTypewriter',
    file: '/src/components/RailAlphabetTypewriter.tsx',
    approxLines: 'lines 1090-1200',
    friendlyName: 'Card 1: Sign Config Card',
    description: 'The sidebar slider card control containing text content input and station background colours.',
  },
  {
    selector: '#typography-settings-card',
    component: 'RailAlphabetTypewriter',
    file: '/src/components/RailAlphabetTypewriter.tsx',
    approxLines: 'lines 1225-1310',
    friendlyName: 'Card 2: Spacing & Letter sizes',
    description: 'The secondary layout card with letter spacing trackers and text height em scales.',
  },
  {
    selector: '#double-arrow-card',
    component: 'RailAlphabetTypewriter',
    file: '/src/components/RailAlphabetTypewriter.tsx',
    approxLines: 'lines 1318-1425',
    friendlyName: 'Card 3: British Rail Double Arrow Card',
    description: 'Column selector and positioning rules for incorporating the 1965 corporate emblem.',
  },
  {
    selector: '#arrow-control-pad-card',
    component: 'RailAlphabetTypewriter',
    file: '/src/components/RailAlphabetTypewriter.tsx',
    approxLines: 'lines 1446-1560',
    friendlyName: 'Card 4: Directional Arrow Pad',
    description: 'The 8-way directional compass button grid representing exit orientation signage.',
  },
  {
    selector: '#pictogram-card',
    component: 'RailAlphabetTypewriter',
    file: '/src/components/RailAlphabetTypewriter.tsx',
    approxLines: 'lines 1582-1685',
    friendlyName: 'Card 5: Station Pictograms',
    description: 'Pictogram glyph selector containing high-contrast vector symbols (telephones, toilets, baggage, etc.)',
  },
  {
    selector: '#hero-home',
    component: 'App',
    file: '/src/App.tsx',
    approxLines: 'lines 85-136',
    friendlyName: 'UK Travel Home Hero Banner',
    description: 'The main Royal Blue gradient hero element showcasing the vintage British Rail ticket asset.',
  },
  {
    selector: '#hero-history',
    component: 'App',
    file: '/src/App.tsx',
    approxLines: 'lines 294-346',
    friendlyName: 'Design History Hero Banner',
    description: 'The historical banner featuring the classic InterCity 125 dynamic train speed livery asset.',
  },
  {
    selector: '#hero-guide',
    component: 'App',
    file: '/src/App.tsx',
    approxLines: 'lines 419-484',
    friendlyName: 'Smart Travel Guide Hero Banner',
    description: 'The helpful guide banner explaining split ticketing and cheap advanced fares hacks.',
  },
  {
    selector: '#timeline-interactive-container',
    component: 'InteractiveTimeline',
    file: '/src/components/InteractiveTimeline.tsx',
    approxLines: 'lines 7-230',
    friendlyName: 'British Rail Modernization Timeline',
    description: 'The interactive chronological timeline graphing post-nationalisation transit history.',
  },
  {
    selector: '#br-symbol-geometry-canvas',
    component: 'DoubleArrowGeometry',
    file: '/src/components/DoubleArrowGeometry.tsx',
    approxLines: 'lines 105-320',
    friendlyName: 'Gerry Barney Mathematical Stage',
    description: 'The svg drawing canvas recalculating alignment lines, grid boxes, and coordinates on the fly.',
  },
  {
    selector: '#claire-assistant-panel',
    component: 'ClairePanel',
    file: '/src/components/ClairePanel.tsx',
    approxLines: 'lines 9-180',
    friendlyName: 'Claire Smart AI Assistant Panel',
    description: 'The helpful avatar conversation sidebar offering immediate UK split ticket responses.',
  },
  {
    selector: '#fare-finder-interactive-container',
    component: 'FareFinder',
    file: '/src/components/FareFinder.tsx',
    approxLines: 'lines 7-420',
    friendlyName: 'National Rail Fare Calculator Widget',
    description: 'The search component supporting Uk station inputs, passenger groups, and split listings.',
  },
  {
    selector: '#did-you-know-card',
    component: 'DidYouKnow',
    file: '/src/components/DidYouKnow.tsx',
    approxLines: 'lines 14-110',
    friendlyName: 'Design Mythbuster Exhibition Carousel',
    description: 'Interactive questions displaying lesser-known details on vintage UK railway history.',
  },
  {
    selector: '#advance-tracker-card',
    component: 'AdvanceTracker',
    file: '/src/components/AdvanceTracker.tsx',
    approxLines: 'lines 5-150',
    friendlyName: '12-Week Advance Release Reminder Card',
    description: 'Ticketing date calculator estimating current advance ticket releases.',
  }
];

// Map commonly modified Tailwind utility classes to traditional CSS descriptions for learning!
const TAILWIND_EXPLAINER: Record<string, string> = {
  // Padding & Margin
  'p-': 'padding: {v}rem (approx {px}px);',
  'px-': 'padding-left: {v}rem; padding-right: {v}rem;',
  'py-': 'padding-top: {v}rem; padding-bottom: {v}rem;',
  'pt-': 'padding-top: {v}rem ({px}px);',
  'pb-': 'padding-bottom: {v}rem ({px}px);',
  'pl-': 'padding-left: {v}rem ({px}px);',
  'pr-': 'padding-right: {v}rem ({px}px);',
  'm-': 'margin: {v}rem (approx {px}px);',
  'mx-': 'margin-left: {v}rem; margin-right: {v}rem;',
  'my-': 'margin-top: {v}rem; margin-bottom: {v}rem;',
  'mt-': 'margin-top: {v}rem ({px}px);',
  'mb-': 'margin-bottom: {v}rem ({px}px);',
  'ml-': 'margin-left: {v}rem ({px}px);',
  'mr-': 'margin-right: {v}rem ({px}px);',
  
  // Font Sizes
  'text-xs': 'font-size: 0.75rem (12px); line-height: 1rem;',
  'text-sm': 'font-size: 0.875rem (14px); line-height: 1.25rem;',
  'text-base': 'font-size: 1rem (16px); line-height: 1.5rem;',
  'text-lg': 'font-size: 1.125rem (18px); line-height: 1.75rem;',
  'text-xl': 'font-size: 1.25rem (20px); line-height: 1.75rem;',
  'text-2xl': 'font-size: 1.5rem (24px); line-height: 2rem;',
  'text-3xl': 'font-size: 1.875rem (30px); line-height: 2.25rem;',
  'text-4xl': 'font-size: 2.25rem (36px); line-height: 2.5rem;',
  
  // Font Weights
  'font-thin': 'font-weight: 100;',
  'font-extralight': 'font-weight: 200;',
  'font-light': 'font-weight: 300;',
  'font-normal': 'font-weight: 400;',
  'font-medium': 'font-weight: 500;',
  'font-semibold': 'font-weight: 600;',
  'font-bold': 'font-weight: 700;',
  'font-extrabold': 'font-weight: 800;',
  'font-black': 'font-weight: 900;',

  // Displays
  'flex': 'display: flex; /* Active layout grid alignment */',
  'grid': 'display: grid; /* Grid row columns matrix */',
  'hidden': 'display: none;',
  'block': 'display: block;',
  'inline-block': 'display: inline-block;',
  'inline': 'display: inline;',
  'flex-col': 'flex-direction: column;',
  'items-center': 'align-items: center;',
  'justify-between': 'justify-content: space-between;',
  'justify-center': 'justify-content: center;',
  'flex-wrap': 'flex-wrap: wrap;',

  // Borders & Rounded Corners
  'rounded-none': 'border-radius: 0px;',
  'rounded-sm': 'border-radius: 0.125rem (2px);',
  'rounded': 'border-radius: 0.25rem (4px);',
  'rounded-md': 'border-radius: 0.375rem (6px);',
  'rounded-lg': 'border-radius: 0.5rem (8px);',
  'rounded-xl': 'border-radius: 0.75rem (12px);',
  'rounded-2xl': 'border-radius: 1rem (16px);',
  'rounded-3xl': 'border-radius: 1.5rem (24px);',
  'rounded-full': 'border-radius: 9999px; /* Circle shape */',
  'border': 'border-width: 1px;',
  'border-2': 'border-width: 2px;',
  
  // Shadows
  'shadow-none': 'box-shadow: none;',
  'shadow-sm': 'box-shadow: 0 1px 2px rgba(0,0,0,0.05);',
  'shadow': 'box-shadow: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06);',
  'shadow-md': 'box-shadow: 0 4px 6px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.03);',
  'shadow-lg': 'box-shadow: 0 10px 15px rgba(0,0,0,0.05), ...;',
  'shadow-xl': 'box-shadow: 0 20px 25px rgba(0,0,0,0.15), ...;',
  'shadow-2xl': 'box-shadow: 0 25px 50px rgba(0,0,0,0.25);'
};

function explainClass(className: string): string {
  const clean = className.trim();
  if (TAILWIND_EXPLAINER[clean]) {
    return TAILWIND_EXPLAINER[clean];
  }

  // Handle parameterized padding / margins like p-4, pr-6, my-10, gap-4
  const spacingRegex = /^(p|py|px|pt|pb|pl|pr|m|my|mx|mt|mb|ml|mr|gap)-([0-9\.]+)$/;
  const match = clean.match(spacingRegex);
  if (match) {
    const prefix = match[1] + '-';
    const val = parseFloat(match[2]);
    const pxVal = Math.round(val * 4); // tailwind 1 spacing unit = 4px (or 0.25rem)
    const remVal = val * 0.25;
    
    let template = TAILWIND_EXPLAINER[prefix] || `${prefix} spacing: {v}rem;`;
    return template.replace('{v}', remVal.toString()).replace('{px}', pxVal.toString());
  }

  // Handle colors
  if (clean.includes('bg-')) {
    return `background-color: ${clean.replace('bg-', '')} value;`;
  }
  if (clean.includes('text-')) {
    return `color: ${clean.replace('text-', '')} spectrum;`;
  }
  if (clean.includes('border-')) {
    return `border-color: ${clean.replace('border-', '')};`;
  }
  if (clean.startsWith('w-')) {
    return `width: ${clean.replace('w-', '')};`;
  }
  if (clean.startsWith('h-')) {
    return `height: ${clean.replace('h-', '')};`;
  }

  return 'utility style layout rule;';
}

export default function VisualInspector() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPickerActive, setIsPickerActive] = useState(false);
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  
  // Active Inspector State
  const [elementSelector, setElementSelector] = useState<string>('');
  const [elementTag, setElementTag] = useState<string>('');
  const [elementClasses, setElementClasses] = useState<string[]>([]);
  const [classInput, setClassInput] = useState<string>('');
  const [geometryInfo, setGeometryInfo] = useState({ width: 0, height: 0, top: 0, left: 0 });
  const [hoverGeometry, setHoverGeometry] = useState({ width: 0, height: 0, top: 0, left: 0 });
  const [mappedFile, setMappedFile] = useState<CodeMapping | null>(null);

  // Tab selections in structural DevTools
  const [devtoolsTab, setDevtoolsTab] = useState<'styles' | 'presets' | 'guide'>('styles');

  // Track coordinates of window highlights
  useEffect(() => {
    if (!isOpen) {
      setIsPickerActive(false);
      setSelectedElement(null);
      setHoveredElement(null);
    }
  }, [isOpen]);

  // Keep selected element geometry updated if user scrolls or resizes
  useEffect(() => {
    const updateGeom = () => {
      if (selectedElement) {
        const r = selectedElement.getBoundingClientRect();
        setGeometryInfo({
          width: r.width,
          height: r.height,
          top: r.top + window.scrollY,
          left: r.left + window.scrollX
        });
      }
    };
    
    window.addEventListener('resize', updateGeom);
    window.addEventListener('scroll', updateGeom);
    return () => {
      window.removeEventListener('resize', updateGeom);
      window.removeEventListener('scroll', updateGeom);
    };
  }, [selectedElement]);

  // Picker mode: Capture hover elements
  useEffect(() => {
    if (!isPickerActive) {
      setHoveredElement(null);
      return;
    }

    const handleMouseOver = (e: globalThis.MouseEvent) => {
      e.stopPropagation();
      const target = e.target as HTMLElement;
      
      // Let's protect internal devtools content from being picked!
      if (target.closest('#br-inspector-dock') || target.closest('#inspector-toggle-badge')) {
        return;
      }
      
      setHoveredElement(target);
      const r = target.getBoundingClientRect();
      setHoverGeometry({
        width: r.width,
        height: r.height,
        top: r.top + window.scrollY,
        left: r.left + window.scrollX
      });
    };

    const handleMouseClick = (e: globalThis.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      const target = e.target as HTMLElement;
      if (target.closest('#br-inspector-dock') || target.closest('#inspector-toggle-badge')) {
        return;
      }

      lockInspectorOnElement(target);
      setIsPickerActive(false);
    };

    // Capture standard keyboard shortcuts
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsPickerActive(false);
        setHoveredElement(null);
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('click', handleMouseClick, true);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('click', handleMouseClick, true);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPickerActive]);

  const lockInspectorOnElement = (el: HTMLElement) => {
    setSelectedElement(el);
    setElementTag(el.tagName.toLowerCase());

    // Compute direct ID or best CSS selector label
    let selector = el.tagName.toLowerCase();
    if (el.id) {
      selector += `#${el.id}`;
    } else if (el.className) {
      const firstClass = el.className.split(' ')[0];
      if (firstClass && typeof firstClass === 'string' && !firstClass.includes('(')) {
        selector += `.${firstClass}`;
      }
    }
    setElementSelector(selector);

    // Save actual classes
    const classes = Array.from(el.classList);
    setElementClasses(classes);
    setClassInput(el.className);

    // Geometry box
    const r = el.getBoundingClientRect();
    setGeometryInfo({
      width: r.width,
      height: r.height,
      top: r.top + window.scrollY,
      left: r.left + window.scrollX
    });

    // Parse any existing arbitrary inline styling on select
    applyArbitraryInlineStyles(el, el.className);

    // Match code location
    const matched = MODULE_CODE_MAPPINGS.find(mapping => {
      if (el.closest(mapping.selector)) return true;
      return false;
    });
    setMappedFile(matched || null);
  };

  // Parser to dynamically apply arbitrary Tailwind classes (like left-[-19px] or w-[calc(50%-10px)]) as real-time inline styles
  const applyArbitraryInlineStyles = (el: HTMLElement, classString: string) => {
    // Reset standard styles we manage so they recalculate from scratch
    el.style.left = '';
    el.style.right = '';
    el.style.top = '';
    el.style.bottom = '';
    el.style.width = '';
    el.style.height = '';
    el.style.minHeight = '';
    el.style.gridTemplateColumns = '';
    el.style.gap = '';
    el.style.padding = '';
    el.style.paddingLeft = '';
    el.style.paddingRight = '';
    el.style.paddingTop = '';
    el.style.paddingBottom = '';
    
    const words = classString.split(/\s+/).filter(Boolean);
    words.forEach(word => {
      // Standard coordinates
      const matchPosDefault = word.match(/^(left|right|top|bottom)-\[(-?\d+px)\]$/);
      if (matchPosDefault) {
        const prop = matchPosDefault[1];
        const val = matchPosDefault[2];
        el.style[prop as any] = val;
      }
      
      // Coordinate with arbitrary units/calc (e.g., right-[-20px])
      const matchPosArbitrary = word.match(/^(left|right|top|bottom)-\[(.*?)\]$/);
      if (matchPosArbitrary) {
        const prop = matchPosArbitrary[1];
        const val = matchPosArbitrary[2];
        el.style[prop as any] = val;
      }

      // Width of elements
      const matchWidth = word.match(/^(?:\w+:)?w-\[(.*?)\]$/);
      if (matchWidth) {
        el.style.width = matchWidth[1];
      }

      // Height of elements
      const matchHeight = word.match(/^(?:\w+:)?h-\[(.*?)\]$/);
      if (matchHeight) {
        el.style.height = matchHeight[1];
      }

      // Minimum height of elements
      const matchMinHeight = word.match(/^min-h-\[(.*?)\]$/);
      if (matchMinHeight) {
        el.style.minHeight = matchMinHeight[1];
      }

      // Grid systems and columns
      const matchGridCols = word.match(/^grid-cols-(\d+)$/);
      if (matchGridCols) {
        el.style.gridTemplateColumns = `repeat(${matchGridCols[1]}, minmax(0, 1fr))`;
      }
      const matchGridColsArbitrary = word.match(/^grid-cols-\[(.*?)\]$/);
      if (matchGridColsArbitrary) {
        el.style.gridTemplateColumns = matchGridColsArbitrary[1];
      }

      // Element Gaps
      const matchGap = word.match(/^gap-(\d+(\.\d+)?)$/);
      if (matchGap) {
        el.style.gap = `${parseFloat(matchGap[1]) * 0.25}rem`;
      }
      const matchGapArbitrary = word.match(/^gap-\[(.*?)\]$/);
      if (matchGapArbitrary) {
        el.style.gap = matchGapArbitrary[1];
      }

      // Padding overrides
      const matchP = word.match(/^p-\[(.*?)\]$/);
      if (matchP) el.style.padding = matchP[1];
      const matchPx = word.match(/^px-\[(.*?)\]$/);
      if (matchPx) {
        el.style.paddingLeft = matchPx[1];
        el.style.paddingRight = matchPx[1];
      }
      const matchPy = word.match(/^py-\[(.*?)\]$/);
      if (matchPy) {
        el.style.paddingTop = matchPy[1];
        el.style.paddingBottom = matchPy[1];
      }
    });
  };

  // Computes interactive path of parent nodes up to the container
  const getBreadcrumbPath = (el: HTMLElement | null) => {
    if (!el) return [];
    const path: { tag: string; id: string; className: string; element: HTMLElement }[] = [];
    let current: HTMLElement | null = el;
    while (current && current.tagName && current.tagName.toLowerCase() !== 'body' && current.tagName.toLowerCase() !== 'html') {
      const firstClass = current.className && typeof current.className === 'string' ? current.className.split(/\s+/)[0] || '' : '';
      path.unshift({
        tag: current.tagName.toLowerCase(),
        id: current.id || '',
        className: firstClass,
        element: current
      });
      current = current.parentElement;
    }
    return path.slice(-5); // Show last 5 parent levels inside UI
  };

  // Direct live style updater! Replaces className string in DOM node on keypress!
  const handleClassInputChange = (newVal: string) => {
    setClassInput(newVal);
    if (selectedElement) {
      // Direct raw DOM alteration - provides instant fluid layout feedback!
      selectedElement.className = newVal;
      
      // Parse any custom arbitrary positioning classes on the fly!
      applyArbitraryInlineStyles(selectedElement, newVal);
      
      // Update our array lists
      const splitArr = newVal.split(/\s+/).filter(Boolean);
      setElementClasses(splitArr);
      
      // Refresh geometry
      const r = selectedElement.getBoundingClientRect();
      setGeometryInfo({
        width: r.width,
        height: r.height,
        top: r.top + window.scrollY,
        left: r.left + window.scrollX
      });
    }
  };

  // Category check helpers
  const isPaddingClass = (cls: string): boolean => {
    return /^(p|px|py)-(\d+(\.\d+)?)$/.test(cls);
  };

  const isBorderRadiusClass = (cls: string): boolean => {
    return cls === 'rounded' || /^(rounded-(none|sm|md|lg|xl|2xl|3xl|full))$/.test(cls);
  };

  const isShadowClass = (cls: string): boolean => {
    return cls === 'shadow' || /^(shadow-(none|sm|md|lg|xl|2xl))$/.test(cls);
  };

  const isTextSizeClass = (cls: string): boolean => {
    return /^text-(xs|sm|base|lg|xl|2xl|3xl|4xl)$/.test(cls);
  };

  // Quick Knobs helper class replacement values
  const handleQuickKnob = (category: 'padding' | 'rounded' | 'shadow' | 'textSize', value: string) => {
    if (!selectedElement) return;

    const currentClasses = classInput.split(/\s+/).filter(Boolean);
    let cleared = [...currentClasses];

    if (category === 'padding') {
      cleared = cleared.filter(c => !isPaddingClass(c));
    } else if (category === 'rounded') {
      cleared = cleared.filter(c => !isBorderRadiusClass(c));
    } else if (category === 'shadow') {
      cleared = cleared.filter(c => !isShadowClass(c));
    } else if (category === 'textSize') {
      cleared = cleared.filter(c => !isTextSizeClass(c));
    }
    
    if (value) {
      cleared.push(value);
    }
    
    const combined = cleared.join(' ').replace(/\s+/g, ' ').trim();
    handleClassInputChange(combined);
  };

  // Quick jump-to select options in drop menu helper
  const handleJumpToPreset = (selectorStr: string) => {
    const el = document.querySelector(selectorStr) as HTMLElement;
    if (el) {
      // scroll to it
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // lock onto it with visual indicator
      setTimeout(() => {
        lockInspectorOnElement(el);
      }, 350);
    }
  };

  const getActiveValue = (prefix: string): string => {
    const matched = elementClasses.find(c => c.startsWith(prefix));
    return matched ? matched.substring(prefix.length) : '';
  };

  // Prepare clear summary instructions for the AI to rewrite this once the client loves their layout
  const assembleAICopyPrompt = () => {
    if (!selectedElement) return '';
    const componentName = mappedFile ? mappedFile.component : 'your components';
    const filePath = mappedFile ? mappedFile.file : 'the relevant layout';
    const lines = mappedFile ? ` (around ${mappedFile.approxLines})` : '';
    
    return `In ${filePath}${lines}, please find the '${elementTag}' element inside the ${componentName} component (which originally had classes similar to it) and update its styling. Change its class list directly to:
className="${classInput}"`;
  };

  return (
    <>
      {/* 1. FLOATING BRAND TRIGGER BUTTON */}
      <button
        id="inspector-toggle-badge"
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg font-bold border transition-all duration-300 cursor-pointer ${
          isOpen 
            ? 'bg-rose-600 hover:bg-rose-700 text-white border-rose-500 hover:scale-105' 
            : 'bg-slate-900 border-slate-950 text-[#E5001C] hover:text-white hover:bg-slate-950 hover:scale-105'
        }`}
        title="Toggle Visual Code Inspector"
      >
        <Lucide.Sliders className={`w-4 h-4 ${isPickerActive ? 'animate-spin' : ''}`} />
        <span className="text-[11px] font-mono tracking-wider">
          {isOpen ? 'CLOSE INSPECTOR' : 'INSPECTOR MODE'}
        </span>
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#E5001C]"></span>
          </span>
        )}
      </button>

      {/* 2. PICKER MODE MOUSEOVER BLUE HIGHLIGHT OUTLINES */}
      {isPickerActive && hoveredElement && (
        <div
          className="pointer-events-none fixed z-[9999] border-1 border-dashed border-[#0EA5E9] bg-sky-500/10 transition-all duration-75 flex flex-col justify-between"
          style={{
            top: hoverGeometry.top - window.scrollY,
            left: hoverGeometry.left - window.scrollX,
            width: hoverGeometry.width,
            height: hoverGeometry.height,
          }}
        >
          {/* Tag Name tooltip */}
          <div className="absolute top-1 left-1 bg-[#012169] font-mono text-[9px] text-white px-1.5 py-0.5 rounded shadow flex items-center gap-1 font-semibold">
            <span className="text-amber-400 font-bold">&lt;{hoveredElement.tagName.toLowerCase()}&gt;</span>
            <span className="opacity-60">|</span>
            <span>{Math.round(hoverGeometry.width)} × {Math.round(hoverGeometry.height)}px</span>
          </div>
        </div>
      )}

      {/* 3. INSPECTOR LOCK PERSISTENT FOCUS BOX */}
      {isOpen && selectedElement && (
        <div
          className="pointer-events-none absolute z-[9998] border-2 border-[#012169] bg-blue-500/5 transition-all duration-300"
          style={{
            top: geometryInfo.top,
            left: geometryInfo.left,
            width: geometryInfo.width,
            height: geometryInfo.height,
          }}
        >
          {/* Target label hanging high - moved to -top-10 to completely avoid covering smaller text element content */}
          <div className="absolute -top-10 left-0 bg-slate-950 border border-slate-700 text-white font-mono text-[9px] px-2 py-0.5 rounded shadow whitespace-nowrap shadow-md">
            Inspected: <span className="text-emerald-400 font-bold">{elementSelector}</span>
          </div>
        </div>
      )}

      {/* 4. MAIN DOCKED INSPECTOR DRAWER PANEL (Bottom Panel) */}
      {isOpen && (
        <div
          id="br-inspector-dock"
          className="fixed bottom-0 left-0 right-0 z-[40] bg-slate-900 text-slate-100 border-t border-slate-800 shadow-2xl flex flex-col h-[340px] md:h-[290px] animate-fade-in font-sans"
        >
          {/* Top Row: System Status bar */}
          <div className="flex items-center justify-between px-4 py-1.5 bg-slate-950 border-b border-slate-800 text-[10px] font-mono">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                BR DESIGN DEVTOOLS v1.0
              </span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400 flex items-center gap-1">
                <Lucide.FileCode className="w-3 h-3 text-amber-500" />
                {mappedFile ? (
                  <>
                    Active source: <strong className="text-slate-200">{mappedFile.file}</strong> ({mappedFile.approxLines})
                  </>
                ) : (
                  'Click an element to see its code location'
                )}
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsPickerActive(!isPickerActive)}
                className={`px-3 py-0.5 rounded border text-[10px] font-bold cursor-pointer transition flex items-center gap-1 ${
                  isPickerActive 
                    ? 'bg-rose-600 text-white border-rose-500' 
                    : 'bg-slate-800 text-[#E5001C] border-[#E5001C]/40 hover:bg-slate-700'
                }`}
                title="Click and hover over any visual element on screen"
              >
                <Lucide.MousePointerClick className="w-3" />
                {isPickerActive ? 'PICKING SOURCE (Click to Select)' : 'PICK VISUAL ELEMENT'}
              </button>
              
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-500 hover:text-white transition cursor-pointer"
              >
                <Lucide.X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bottom Dock Workspace Split */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
            
            {/* LEFT COLUMN (4 Grid size): Navigation, Jump-Select presets */}
            <div className="md:col-span-3 border-r border-slate-850 p-3 overflow-y-auto bg-slate-950/40 text-xs">
              <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase tracking-wider text-[9px] mb-2 font-mono">
                <Lucide.Compass className="w-3 h-3 text-rail-blue" />
                <span>Page Components Selector</span>
              </div>
              
              <div className="space-y-1">
                {MODULE_CODE_MAPPINGS.map((item) => {
                  const isActive = selectedElement && document.querySelector(item.selector) === selectedElement;
                  return (
                    <button
                      key={item.selector}
                      onClick={() => handleJumpToPreset(item.selector)}
                      className={`w-full text-left px-2 py-1 rounded transition class cursor-pointer font-sans.5 text-[11px] block truncate ${
                        isActive 
                          ? 'bg-[#012169] text-white font-semibold' 
                          : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate font-medium">{item.friendlyName}</span>
                        <span className="text-[8px] font-mono opacity-50 ml-1">{item.component}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* MIDDLE COLUMN (5 Grid size): Tailwind Input & CSS Translator Explainer */}
            <div className="md:col-span-5 p-3 flex flex-col overflow-hidden border-r border-slate-850">
              
              {/* Tab Selector inside mid column */}
              <div className="flex items-center gap-2 border-b border-slate-800 pb-1.5 mb-2.5">
                <button
                  onClick={() => setDevtoolsTab('styles')}
                  className={`text-[10px] font-mono font-bold tracking-wider pb-0.5 cursor-pointer border-b transition ${
                    devtoolsTab === 'styles' 
                      ? 'text-white border-amber-500' 
                      : 'text-slate-400 border-transparent hover:text-white'
                  }`}
                >
                  TAILWIND UTILITIES INSPECTOR
                </button>
                <button
                  onClick={() => setDevtoolsTab('presets')}
                  className={`text-[10px] font-mono font-bold tracking-wider pb-0.5 cursor-pointer border-b transition ${
                    devtoolsTab === 'presets' 
                      ? 'text-white border-amber-500' 
                      : 'text-slate-400 border-transparent hover:text-white'
                  }`}
                >
                  CSS TRANSLATOR
                </button>
                <button
                  onClick={() => setDevtoolsTab('guide')}
                  className={`text-[10px] font-mono font-bold tracking-wider pb-0.5 cursor-pointer border-b transition ${
                    devtoolsTab === 'guide' 
                      ? 'text-white border-amber-500' 
                      : 'text-slate-400 border-transparent hover:text-white'
                  }`}
                >
                  SAVE & COPY FOR AGENT ➔
                </button>
              </div>

              {/* Tab 1: Styles Editor Input */}
              {devtoolsTab === 'styles' && (
                <div className="flex-1 flex flex-col justify-between overflow-hidden">
                  <div className="space-y-1.5 overflow-y-auto max-h-[170px] pr-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>HTML Tag: <strong className="text-amber-500 font-bold">&lt;{elementTag || 'div'}&gt;</strong></span>
                      <span>Classes ({elementClasses.length})</span>
                    </div>

                    {/* Highly Interactive DOM parent traceback breadcrumbs */}
                    {selectedElement && (
                      <div className="flex items-center gap-1 font-mono text-[9px] text-slate-400 bg-slate-950/80 px-1.5 py-1 rounded border border-slate-800/80 overflow-x-auto whitespace-nowrap scrollbar-none">
                        <span className="text-slate-500 font-bold uppercase text-[8px] mr-1 flex items-center gap-0.5 select-none shrink-0">
                          <Lucide.Layers className="w-3 text-amber-500 shrink-0" />
                          DOM Path:
                        </span>
                        {getBreadcrumbPath(selectedElement).map((node, i, arr) => (
                          <div key={i} className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => lockInspectorOnElement(node.element)}
                              className={`px-1 py-0.5 rounded transition hover:bg-slate-800 hover:text-white cursor-pointer ${
                                i === arr.length - 1 
                                  ? 'bg-[#012169] text-[#22C55E] font-bold border border-[#012169]/80' 
                                  : 'text-slate-350 bg-slate-900/60'
                              }`}
                              title={node.className ? `.${node.className.substring(0, 30)}` : 'No classes'}
                            >
                              {node.tag}
                              {node.id ? `#${node.id}` : ''}
                            </button>
                            {i < arr.length - 1 && <span className="text-slate-600 select-none">➔</span>}
                          </div>
                        ))}
                      </div>
                    )}

                    <textarea
                      disabled={!selectedElement}
                      value={classInput}
                      onChange={(e) => handleClassInputChange(e.target.value)}
                      placeholder={selectedElement ? "Add or modify Tailwind classes..." : "Select an element to begin tweaking layout classes..."}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-xs text-slate-200 outline-none focus:ring-1 focus:ring-amber-500 transition resize-none h-[75px] disabled:opacity-50"
                    />
                  </div>

                  <div className="text-[10px] text-slate-500 leading-tight font-sans italic pt-1 flex items-center gap-1 border-t border-slate-850">
                    <Lucide.Sparkles className="w-3 text-[#E5001C]" />
                    <span>Visual changes warp instantly! Click on any element in the breadcrumb trail above to inspect its parent container.</span>
                  </div>
                </div>
              )}

              {/* Tab 2: Translation table explaining Tailwind abbreviations */}
              {devtoolsTab === 'presets' && (
                <div className="flex-1 overflow-y-auto text-xs space-y-1.5 pr-1.5">
                  {!selectedElement ? (
                    <div className="text-slate-500 font-sans italic text-center py-6">Select an element to inspect its styles.</div>
                  ) : (
                    <>
                      <div className="text-[9px] font-mono text-slate-400 uppercase font-black mb-1 border-b border-slate-850 pb-0.5">Tailwind Classes translation:</div>
                      {elementClasses.map((item, idx) => (
                        <div key={item + idx} className="grid grid-cols-12 gap-1 font-mono text-[10px] border-b border-slate-850 pb-1">
                          <span className="col-span-5 text-[#E5001C] font-semibold truncate" title={item}>{item}</span>
                          <span className="col-span-1 text-slate-600">➔</span>
                          <span className="col-span-6 text-slate-400 truncate" title={explainClass(item)}>{explainClass(item)}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}

              {/* Tab 3: AI Code instructions helper */}
              {devtoolsTab === 'guide' && (
                <div className="flex-1 flex flex-col justify-between overflow-hidden">
                  <div className="space-y-1.5">
                    <span className="block text-[9px] font-mono font-bold text-slate-400 uppercase">AI Bot Sync Instruction Codeblock:</span>
                    <textarea
                      readOnly
                      value={selectedElement ? assembleAICopyPrompt() : "Choose an element on your station page layout first."}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 font-mono text-[9px] text-slate-300 outline-none resize-none h-[100px] select-all cursor-text"
                    />
                  </div>

                  <button
                    disabled={!selectedElement}
                    onClick={() => {
                      navigator.clipboard.writeText(assembleAICopyPrompt());
                      alert('Copied sync request to clipboard! Paste this message in our chat box, and I will write these modifications permanently!');
                    }}
                    className="w-full bg-[#E5001C] hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs py-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow"
                  >
                    <Lucide.Copy className="w-3.5" />
                    <span>Copy Style Change Prompt</span>
                  </button>
                </div>
              )}

            </div>

            {/* RIGHT COLUMN (4 Grid size): Sizing & Spacing Interactive Knobs */}
            <div className="md:col-span-4 p-3 bg-slate-950/20 overflow-y-auto">
              <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase tracking-wider text-[9px] mb-2 font-mono">
                <Lucide.SlidersHorizontal className="w-3 text-amber-500" />
                <span>Live Spacing / Size Knobs</span>
              </div>

              {!selectedElement ? (
                <div className="text-slate-500 font-sans italic text-center py-10 text-xs">
                  Pick a physical layout element above to activate interactive slider controls.
                </div>
              ) : (() => {
                const currentPaddingClass = elementClasses.find(c => isPaddingClass(c)) || '';
                const currentPaddingVal = currentPaddingClass ? parseFloat(currentPaddingClass.split('-')[1]) : 4;
                const currentPaddingType = currentPaddingClass ? currentPaddingClass.split('-')[0] : 'p';

                const currentTextSizeClass = elementClasses.find(c => isTextSizeClass(c)) || 'text-base';

                return (
                  <div className="space-y-3.5 text-xs">
                    
                    {/* Padding Controller */}
                    <div>
                      <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mb-1">
                        <span>PADDING (INNER SPACING)</span>
                        <span className="text-amber-500 font-bold">{currentPaddingClass || 'default (p-4)'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono text-slate-600">None</span>
                        <input
                          type="range"
                          min="0"
                          max="16"
                          step="1"
                          value={isNaN(currentPaddingVal) ? 4 : currentPaddingVal}
                          onChange={(e) => {
                            const val = e.target.value;
                            handleQuickKnob('padding', val === '0' ? `${currentPaddingType}-0` : `${currentPaddingType}-${val}`);
                          }}
                          className="flex-1 accent-amber-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-[9px] font-mono text-slate-600">X-Large</span>
                      </div>
                    </div>

                    {/* Corner Rounded Radius */}
                    <div>
                      <span className="block text-[10px] font-mono text-slate-400 mb-1">CORNERS (BORDER RADIUS)</span>
                      <div className="grid grid-cols-4 gap-1 p-0.5 bg-slate-950 rounded-lg border border-slate-850">
                        {[
                          { id: 'rounded-none', label: 'None' },
                          { id: 'rounded-md', label: 'Medium' },
                          { id: 'rounded-xl', label: 'Round' },
                          { id: 'rounded-2xl', label: 'X-Round' }
                        ].map((item) => {
                          const active = classInput.split(/\s+/).includes(item.id) || (item.id === 'rounded-none' && !classInput.split(/\s+/).some(isBorderRadiusClass));
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => handleQuickKnob('rounded', item.id === 'rounded-none' ? '' : item.id)}
                              className={`py-1 text-[9px] font-mono font-bold uppercase rounded cursor-pointer transition ${
                                active 
                                  ? 'bg-amber-500 text-slate-950 shadow' 
                                  : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              {item.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Soft Drop Shadows */}
                    <div>
                      <span className="block text-[10px] font-mono text-slate-400 mb-1">ELEVATION (SHADOW STRENGTH)</span>
                      <div className="grid grid-cols-4 gap-1 p-0.5 bg-slate-950 rounded-lg border border-slate-850">
                        {[
                          { id: 'shadow-none', label: 'Flat' },
                          { id: 'shadow-sm', label: 'Soft' },
                          { id: 'shadow-md', label: 'Medium' },
                          { id: 'shadow-lg', label: 'Deep' }
                        ].map((item) => {
                          const active = classInput.split(/\s+/).includes(item.id) || (item.id === 'shadow-none' && !classInput.split(/\s+/).some(isShadowClass));
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => handleQuickKnob('shadow', item.id === 'shadow-none' ? '' : item.id)}
                              className={`py-1 text-[9px] font-mono font-bold uppercase rounded cursor-pointer transition ${
                                active 
                                  ? 'bg-amber-500 text-slate-950 shadow' 
                                  : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              {item.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Font Sizes slider */}
                    <div>
                      <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mb-1">
                        <span>TEXT HEIGHT (FONT SIZE)</span>
                        <span className="text-amber-500 font-bold">{currentTextSizeClass}</span>
                      </div>
                      <div className="grid grid-cols-5 gap-1 p-0.5 bg-slate-950 rounded-lg border border-slate-850">
                        {[
                          { id: 'text-xs', label: 'XS' },
                          { id: 'text-sm', label: 'SM' },
                          { id: 'text-base', label: 'BASE' },
                          { id: 'text-lg', label: 'LG' },
                          { id: 'text-xl', label: 'XL' }
                        ].map((item) => {
                          const active = classInput.split(/\s+/).includes(item.id);
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => handleQuickKnob('textSize', item.id)}
                              className={`py-1 text-[9px] font-mono font-bold uppercase rounded cursor-pointer transition ${
                                active 
                                  ? 'bg-amber-500 text-slate-950 shadow' 
                                  : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              {item.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                );
              })()}

            </div>

          </div>
        </div>
      )}
    </>
  );
}
