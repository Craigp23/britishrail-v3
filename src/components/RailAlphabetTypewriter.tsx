import { useState, ChangeEvent, CSSProperties } from 'react';
import * as Lucide from 'lucide-react';

interface DirectionConfig {
  key: string;
  name: string;
  angle: number;
}

const DIRECTIONS: Record<string, DirectionConfig> = {
  'N': { key: 'N', name: 'Up (Straight on / Upstairs)', angle: 0 },
  'NE': { key: 'NE', name: 'Up-Right (Right upstairs)', angle: 45 },
  'E': { key: 'E', name: 'Right', angle: 90 },
  'SE': { key: 'SE', name: 'Down-Right (Right downstairs)', angle: 135 },
  'S': { key: 'S', name: 'Down (Downstairs)', angle: 180 },
  'SW': { key: 'SW', name: 'Down-Left (Left downstairs)', angle: 225 },
  'W': { key: 'W', name: 'Left', angle: 270 },
  'NW': { key: 'NW', name: 'Up-Left (Left upstairs)', angle: 315 },
};

const DIRECTION_CHAR_CODES: Record<string, number> = {
  'N': 192,
  'NE': 193,
  'E': 194,
  'SE': 195,
  'S': 196,
  'SW': 197,
  'W': 198,
  'NW': 199,
};

const PICTOGRAM_GLYPHS = [
  { code: 201, name: "Way Out / Exit" },
  { code: 202, name: "Telephones" },
  { code: 203, name: "Male Toilet" },
  { code: 204, name: "Female Toilet" },
  { code: 205, name: "Unisex Toilet (WC)" },
  { code: 206, name: "Taxis" },
  { code: 207, name: "Lift / Elevator" },
  { code: 208, name: "Information" },
  { code: 209, name: "Buffet / Catering" },
  { code: 210, name: "Left Luggage / Baggage" },
  { code: 211, name: "First Aid" },
  { code: 212, name: "Lost Property" },
  { code: 213, name: "Ticket / Booking Office" },
  { code: 214, name: "Car Parking (P)" },
  { code: 216, name: "Escalator / Stairs" },
  { code: 217, name: "Bus / Coach" },
  { code: 218, name: "Cycles / Bicycle Storage" },
  { code: 219, name: "Ticket Symbol" },
  { code: 220, name: "Waiting Room" },
  { code: 221, name: "Buffet (alt)" },
  { code: 222, name: "Refreshments" },
];

const GLYPH_MAP: Record<string, number> = {
  'exit': 201,
  'telephones': 202,
  'toilet': 205,
  'taxi': 206,
  'lift': 207,
  'info': 208,
  'catering': 209,
  'luggage': 210,
  'firstaid': 211,
};

// Beautiful native vector way out icon per client architectural spec
export const WayOutIcon = ({ 
  className = "w-[28px] h-[28px] flex-shrink-0 animate-fade-in", 
  color = "currentColor",
  style
}: { 
  className?: string; 
  color?: string; 
  style?: CSSProperties 
}) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 100 100" 
    className={className}
    aria-label="Way Out Symbol"
    style={{ fill: color, overflow: 'visible', ...style }}
  >
    {/* The stark, blocky architectural frame enclosure */}
    <path 
      d="M75 15 H20 V85 H75 V68 H60 V70 H35 V30 H60 V32 H75 Z" 
    />
    {/* The legendary sharp-angled directional arrow */}
    <path 
      d="M48 38 L62 50 L48 62 V54 H8 V46 H48 V38 Z" 
    />
  </svg>
);

// Precise mathematical reproduction of the British Rail Gerry Barney 1965 Double Arrow
const DoubleArrowLogo = ({ type, textSize = 52 }: { type: string; textSize?: number }) => {
  if (type === 'none') return null;

  const symbolColor = type === 'white-reversed-on-red' ? '#FFFFFF' : '#E5001C';

  // Using the authentic BR double arrow (character 200) in the signage builder
  const symbolElement = (
    <span 
      style={{
        fontFamily: "'Brsign', 'Geist', sans-serif",
        fontSize: `${textSize * 1.3}px`,
        lineHeight: 1,
        color: symbolColor,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'normal'
      }}
      className="select-none h-full self-center"
    >
      {String.fromCharCode(200)}
    </span>
  );

  const paddingStyle = {
    paddingLeft: `${textSize * 0.6}px`,
    paddingRight: `${textSize * 0.6}px`,
    aspectRatio: '1.75'
  };

  switch (type) {
    case 'red-on-white':
      return (
        <div className="flex items-center justify-center bg-white border-r border-[#CBD5E1] h-full flex-shrink-0 animate-fade-in" style={paddingStyle}>
          {symbolElement}
        </div>
      );
    case 'white-reversed-on-red':
      return (
        <div className="flex items-center justify-center bg-[#E5001C] h-full flex-shrink-0 animate-fade-in" style={paddingStyle}>
          {symbolElement}
        </div>
      );
    case 'red-ruled-red':
      return (
        <div className="flex items-center justify-center bg-white border-[3.5px] border-[#E5001C] h-full flex-shrink-0 animate-fade-in" style={paddingStyle}>
          {symbolElement}
        </div>
      );
    case 'red-ruled-black':
      return (
        <div className="flex items-center justify-center bg-white border-[3.5px] border-black h-full flex-shrink-0 animate-fade-in" style={paddingStyle}>
          {symbolElement}
        </div>
      );
    default:
      return null;
  }
};

// Beautiful transport-style solid arrow renderer utilizing authentic custom font woff2 asset
const DirectionArrow = ({ direction, show, color, sizePx }: { direction: string; show: boolean; color?: string; sizePx?: number }) => {
  if (!show) return null;

  const charCode = DIRECTION_CHAR_CODES[direction];
  if (charCode) {
    return (
      <div className="flex items-center justify-center px-5 flex-shrink-0 h-full animate-fade-in">
        <span 
          style={{ 
            fontFamily: "'Brsign', 'Geist', sans-serif",
            fontSize: sizePx ? `${sizePx}px` : '2.3em',
            color: color || "#009CCA",
            lineHeight: 1,
            display: 'inline-block',
            fontWeight: 'normal'
          }}
          className="select-none"
        >
          {String.fromCharCode(charCode)}
        </span>
      </div>
    );
  }

  // Fallback to beautiful SVG in case mapping is missing
  const angle = DIRECTIONS[direction]?.angle ?? 0;
  return (
    <div className="flex items-center justify-center px-5 flex-shrink-0 h-full animate-fade-in">
      <svg 
        viewBox="0 0 100 100" 
        className="h-[2.3em] w-auto transition-transform duration-200"
        style={{ transform: `rotate(${angle}deg)`, overflow: 'visible' }}
      >
        <path 
          d="M 50,15 L 15,50 L 30,35 V 85 H 70 V 35 L 85,50 Z" 
          fill={color || "#009CCA"}
        />
      </svg>
    </div>
  );
};

// Renders the stylized station pictograms including WayOutIcon natively
const Pictogram = ({ type, color, textSize = 52 }: { type: string; color: string; textSize?: number }) => {
  if (type === 'none') return null;

  // Render authentic BR custom font glyphs first if available
  let charCode: number | null = null;
  if (/^\d+$/.test(type)) {
    charCode = parseInt(type, 10);
  } else if (GLYPH_MAP[type] !== undefined) {
    charCode = GLYPH_MAP[type];
  }

  if (charCode !== null) {
    return (
      <div 
        className="flex items-center justify-center flex-shrink-0 h-full animate-fade-in"
      >
        <span 
          style={{ 
            fontFamily: "'Brsign', 'Geist', sans-serif",
            fontSize: `${textSize * 1.6}px`, // Increased by 123%: 1.3 * 1.23 = 1.599 ~ 1.6
            lineHeight: 1,
            color: color,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'normal'
          }}
          className="select-none h-full self-center"
        >
          {String.fromCharCode(charCode)}
        </span>
      </div>
    );
  }

  const iconSize = Math.round(textSize * 1.54); // Increased by 123%: 1.25 * 1.23 = 1.5375 ~ 1.54
  const iconProps = {
    color: color,
    size: iconSize,
    strokeWidth: 2.2,
    className: "flex-shrink-0 animate-fade-in"
  };

  return (
    <div 
      className="flex items-center justify-center flex-shrink-0 h-full"
    >
      {type === 'exit' && (
        <WayOutIcon 
          color={color} 
          className="flex-shrink-0 animate-fade-in" 
          style={{ width: `${iconSize}px`, height: `${iconSize}px` }}
        />
      )}
      {type === 'telephones' && <Lucide.Phone {...iconProps} />}
      {type === 'taxi' && <Lucide.Car {...iconProps} />}
      {type === 'toilet' && <Lucide.Users {...iconProps} />}
      {type === 'lift' && <Lucide.ArrowUpDown {...iconProps} />}
      {type === 'info' && <Lucide.Info {...iconProps} />}
      {type === 'catering' && <Lucide.Coffee {...iconProps} />}
      {type === 'luggage' && <Lucide.Luggage {...iconProps} />}
      {type === 'firstaid' && <Lucide.BriefcaseMedical {...iconProps} />}
    </div>
  );
};

// Renders an authentic vertical dividing line centered and sized appropriately with minHeight to prevent collapsing
const VerticalSeparator = ({ show, isDarkClass, textSize = 52 }: { show: boolean; isDarkClass: boolean; textSize?: number }) => {
  if (!show) return null;
  const colorClass = isDarkClass ? 'bg-white' : 'bg-black';
  const sepHeight = Math.round(textSize * 2.375); // Increased by 190%: 1.25 * 1.9 = 2.375
  const sepWidth = Math.max(4, Math.round(textSize * 0.10)); // Increased by 200%: 0.05 * 2.0 = 0.10 (with double the minimum limit)
  const horizontalMargin = Math.max(12, Math.round(textSize * 0.35));
  return (
    <div 
      className={`${colorClass} self-center flex-shrink-0 opacity-100`}
      style={{ 
        height: `${sepHeight}px`,
        width: `${sepWidth}px`,
        marginLeft: `${horizontalMargin}px`,
        marginRight: `${horizontalMargin}px`
      }}
    />
  );
};

const PRESETS = [
  {
    name: "Way Out",
    text: "Way out",
    theme: "white",
    arrowDir: "E",
    arrowPos: "right",
    logoType: "none",
    logoPos: "left",
    picType: "exit",
    picPos: "left",
    showSeparator: true,
    textSize: 52,
    letterSpacing: -0.05,
    textAlign: "left"
  },
  {
    name: "Tickets",
    text: "Tickets",
    theme: "white",
    arrowDir: "E",
    arrowPos: "right",
    logoType: "none",
    logoPos: "left",
    picType: "none",
    picPos: "left",
    showSeparator: false,
    textSize: 52,
    letterSpacing: -0.05,
    textAlign: "left"
  },
  {
    name: "Ladies",
    text: "Ladies",
    theme: "white",
    arrowDir: "E",
    arrowPos: "right",
    logoType: "none",
    logoPos: "left",
    picType: "toilet",
    picPos: "left",
    showSeparator: true,
    textSize: 52,
    letterSpacing: -0.05,
    textAlign: "left"
  },
  {
    name: "Gentlemen",
    text: "Gentlemen",
    theme: "white",
    arrowDir: "W",
    arrowPos: "left",
    logoType: "none",
    logoPos: "left",
    picType: "toilet",
    picPos: "right",
    showSeparator: true,
    textSize: 52,
    letterSpacing: -0.05,
    textAlign: "left"
  },
  {
    name: "Toilets",
    text: "Toilets",
    theme: "white",
    arrowDir: "E",
    arrowPos: "right",
    logoType: "none",
    logoPos: "left",
    picType: "toilet",
    picPos: "left",
    showSeparator: true,
    textSize: 52,
    letterSpacing: -0.05,
    textAlign: "left"
  },
  {
    name: "Lost Property",
    text: "Lost property",
    theme: "white",
    arrowDir: "E",
    arrowPos: "right",
    logoType: "none",
    logoPos: "left",
    picType: "none",
    picPos: "left",
    showSeparator: false,
    textSize: 52,
    letterSpacing: -0.05,
    textAlign: "left"
  },
  {
    name: "Taxis",
    text: "Taxis",
    theme: "white",
    arrowDir: "E",
    arrowPos: "right",
    logoType: "none",
    logoPos: "left",
    picType: "taxi",
    picPos: "left",
    showSeparator: true,
    textSize: 52,
    letterSpacing: -0.05,
    textAlign: "left"
  },
  {
    name: "Buffet Bar",
    text: "Buffet Bar",
    theme: "white",
    arrowDir: "none",
    arrowPos: "none",
    logoType: "none",
    logoPos: "left",
    picType: "catering",
    picPos: "left",
    showSeparator: true,
    textSize: 52,
    letterSpacing: -0.05,
    textAlign: "left"
  },
  {
    name: "Restaurant",
    text: "Restaurant",
    theme: "white",
    arrowDir: "none",
    arrowPos: "none",
    logoType: "red-on-white",
    logoPos: "left",
    picType: "none",
    picPos: "none",
    showSeparator: false,
    textSize: 52,
    letterSpacing: -0.05,
    textAlign: "left"
  },
  {
    name: "Trains Platform Sign",
    text: "Trains",
    theme: "white",
    arrowDir: "SE",
    arrowPos: "right",
    logoType: "none",
    logoPos: "left",
    picType: "none",
    picPos: "left",
    showSeparator: false,
    textSize: 52,
    letterSpacing: -0.05,
    textAlign: "left"
  },
  {
    name: "Fire Exit (Hobby Green)",
    text: "Fire exit",
    theme: "green",
    arrowDir: "NW",
    arrowPos: "left",
    logoType: "none",
    logoPos: "left",
    picType: "none",
    picPos: "left",
    showSeparator: false,
    textSize: 52,
    letterSpacing: -0.05,
    textAlign: "left"
  },
  {
    name: "No Entry Warning",
    text: "No entry",
    theme: "red",
    arrowDir: "none",
    arrowPos: "none",
    logoType: "none",
    logoPos: "left",
    picType: "none",
    picPos: "left",
    showSeparator: false,
    textSize: 52,
    letterSpacing: -0.05,
    textAlign: "center"
  },
  {
    name: "Staff Only Notice",
    text: "Staff only",
    theme: "black",
    arrowDir: "none",
    arrowPos: "none",
    logoType: "none",
    logoPos: "left",
    picType: "none",
    picPos: "left",
    showSeparator: false,
    textSize: 52,
    letterSpacing: -0.05,
    textAlign: "left"
  },
  {
    name: "First Aid Room",
    text: "First aid",
    theme: "green",
    arrowDir: "none",
    arrowPos: "none",
    logoType: "none",
    logoPos: "left",
    picType: "firstaid",
    picPos: "left",
    showSeparator: true,
    textSize: 52,
    letterSpacing: -0.05,
    textAlign: "left"
  }
];

// Exactly 5 neat options now
const LOGO_TYPES = [
  { id: 'none', label: 'None' },
  { id: 'red-on-white', label: 'Type A' },
  { id: 'white-reversed-on-red', label: 'Type B' },
  { id: 'red-ruled-red', label: 'Type C' },
  { id: 'red-ruled-black', label: 'Type D' }
];

export default function RailAlphabetTypewriter() {
  const [typedText, setTypedText] = useState('Way out');
  const [boardTheme, setBoardTheme] = useState<'white' | 'green' | 'red' | 'black'>('white');
  const [direction, setDirection] = useState<string>('E'); 
  const [arrowPosition, setArrowPosition] = useState<'left' | 'right' | 'none'>('right');
  const [arrowColor, setArrowColor] = useState<'blue' | 'black'>('blue'); // Arrow colour state
  const [logoType, setLogoType] = useState<string>('none');
  const [logoPosition, setLogoPosition] = useState<'left' | 'right'>('left');
  const [picType, setPicType] = useState<string>('exit');
  const [picPosition, setPicPosition] = useState<'left' | 'right'>('left');
  const [showSeparator, setShowSeparator] = useState<boolean>(true);
  
  // Sizing Defaults are exactly centered: 52px (from 24 to 80) and -0.05em (from -0.20 to 0.10)
  const [letterSpacing, setLetterSpacing] = useState<number>(-0.05); 
  const [textSize, setTextSize] = useState<number>(52);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left');
  const [selectedPresetName, setSelectedPresetName] = useState<string>('Way Out');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTypedText(e.target.value);
    setSelectedPresetName('custom');
  };

  const handleLogoIndexChange = (index: number) => {
    setLogoType(LOGO_TYPES[index].id);
  };

  const handleReset = () => {
    setTypedText('Way out');
    setBoardTheme('white');
    setDirection('E');
    setArrowPosition('right');
    setArrowColor('blue');
    setLogoType('none');
    setLogoPosition('left');
    setPicType('exit');
    setPicPosition('left');
    setShowSeparator(true);
    setLetterSpacing(-0.05);
    setTextSize(52);
    setTextAlign('left');
    setSelectedPresetName('Way Out');
  };

  const loadPreset = (preset: typeof PRESETS[number]) => {
    setTypedText(preset.text);
    setBoardTheme(preset.theme as 'white' | 'green' | 'red' | 'black');
    if (preset.arrowDir === 'none') {
      setArrowPosition('none');
    } else {
      setDirection(preset.arrowDir);
      setArrowPosition(preset.arrowPos as 'left' | 'right' | 'none');
    }
    setLogoType(preset.logoType);
    setLogoPosition(preset.logoPos as 'left' | 'right');
    setPicType(preset.picType);
    setPicPosition(preset.picPos as 'left' | 'right');
    setShowSeparator(preset.showSeparator);
    setTextSize(preset.textSize);
    setLetterSpacing(preset.letterSpacing);
    setTextAlign(preset.textAlign as 'left' | 'center' | 'right');
    setSelectedPresetName(preset.name);
  };

  const toSentenceCase = (str: string) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const getThemeData = () => {
    switch (boardTheme) {
      case 'green':
        return {
          bgClass: 'bg-[#008751]',
          borderClass: 'border-[#005c36]',
          textColorHex: '#FFFFFF',
          picColor: '#FFFFFF',
          isDarkTheme: true
        };
      case 'red':
        return {
          bgClass: 'bg-[#E5001C]',
          borderClass: 'border-[#9c0010]',
          textColorHex: '#FFFFFF',
          picColor: '#FFFFFF',
          isDarkTheme: true
        };
      case 'black':
        return {
          bgClass: 'bg-[#111111]',
          borderClass: 'border-black',
          textColorHex: '#FFFFFF',
          picColor: '#FFFFFF',
          isDarkTheme: true
        };
      case 'white':
      default:
        return {
          bgClass: 'bg-white',
          borderClass: 'border-slate-300 shadow-[0_4px_12px_rgba(0,0,0,0.05)]',
          textColorHex: '#000000',
          picColor: '#000000',
          isDarkTheme: false
        };
    }
  };

  const { bgClass, borderClass, textColorHex, picColor, isDarkTheme } = getThemeData();

  const getTextAlignmentClass = () => {
    if (textAlign === 'center') return 'items-center text-center';
    if (textAlign === 'right') return 'items-end text-right';
    return 'items-start text-left';
  };

  const activeLogoIndex = LOGO_TYPES.findIndex(t => t.id === logoType);
  const currentLogoIndex = activeLogoIndex >= 0 ? activeLogoIndex : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 lg:p-8 max-w-4xl mx-auto my-4 transition-all" id="rail-alphabet-typography-section">
      
      {/* Title block matching exact spelling "Typograpy" with functional reset */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-display font-bold text-rail-blue tracking-tight">
            Rail Alphabet Typograpy Signage Builder (1965—Present)
          </h3>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Refactored to meet authentic British Rail Station Signage Guidelines, featuring sentence-case hierarchy, modular grids, light-blue directionals, and genuine double arrow logo codes.
          </p>
        </div>
        <button
          onClick={handleReset}
          className="text-slate-500 hover:text-rail-blue p-2 hover:bg-slate-100 rounded-full transition cursor-pointer flex-shrink-0 animate-fade-in self-start"
          title="Reset Sign"
          id="btn-reset-sign"
        >
          <Lucide.RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-6">
        
        {/* Signboard mockup-accurate ambient background */}
        <div className="bg-slate-50 border border-slate-100 p-8 sm:p-12 rounded-xl flex flex-col items-center justify-center min-h-[220px] relative overflow-hidden">
          
          {/* Solid square-cornered British Rail sign plate */}
          <div 
            className={`w-full max-w-2xl flex items-stretch justify-between select-all rounded-none overflow-hidden transition-all duration-300 border-[3px] ${bgClass} ${borderClass} relative shadow-md`}
            style={{ minHeight: '124px' }}
          >
            {/* LEFT SECTION (Modular plank entries alignment) stretched to vertically center children */}
            <div className="flex items-stretch justify-start flex-shrink-0 h-full">
              {logoType !== 'none' && logoPosition === 'left' && (
                <DoubleArrowLogo type={logoType} textSize={textSize} />
              )}
              {picType !== 'none' && picPosition === 'left' && (
                <div className="flex items-stretch h-full">
                  <div className="h-full aspect-square flex items-center justify-center">
                    <Pictogram type={picType} color={picColor} textSize={textSize} />
                  </div>
                  <VerticalSeparator show={showSeparator} isDarkClass={isDarkTheme} textSize={textSize} />
                </div>
              )}
            </div>

            {/* MIDDLE SECTION (Station typography using authentic Geist 700 to replicate Rail Alphabet weight and scale) */}
            <div className={`flex flex-col justify-center flex-grow py-3 px-6 overflow-hidden select-all ${getTextAlignmentClass()}`}>
              <div className="inline-flex items-center gap-4 max-w-full">
                {arrowPosition === 'left' && (
                  <span 
                    style={{ 
                      fontFamily: "'Brsign', 'Geist', sans-serif",
                      fontSize: `${textSize}px`,
                      color: isDarkTheme ? '#FFFFFF' : (arrowColor === 'black' ? '#000000' : '#009CCA'),
                      lineHeight: '1',
                      display: 'inline-block',
                      fontWeight: 'normal'
                    }}
                    className="select-none flex-shrink-0 animate-fade-in"
                  >
                    {String.fromCharCode(DIRECTION_CHAR_CODES[direction])}
                  </span>
                )}

                <span 
                  className="select-all transition-all duration-200 break-words max-w-full"
                  style={{ 
                    fontFamily: "'Brsign', 'Geist', sans-serif",
                    fontWeight: 700, // Geist 700 as requested
                    fontSize: `${textSize}px`, 
                    letterSpacing: `${letterSpacing}em`,
                    color: textColorHex,
                    lineHeight: '1.1',
                    transform: 'scaleX(0.98)', // Reduced width of signage letters to 80% their current size
                    transformOrigin: textAlign === 'left' ? 'left' : textAlign === 'right' ? 'right' : 'center',
                    display: 'inline-block'
                  }}
                >
                  {toSentenceCase(typedText) || 'Platform 9¾'}
                </span>

                {arrowPosition === 'right' && (
                  <span 
                    style={{ 
                      fontFamily: "'Brsign', 'Geist', sans-serif",
                      fontSize: `${textSize}px`,
                      color: isDarkTheme ? '#FFFFFF' : (arrowColor === 'black' ? '#000000' : '#009CCA'),
                      lineHeight: '1',
                      display: 'inline-block',
                      fontWeight: 'normal'
                    }}
                    className="select-none flex-shrink-0 animate-fade-in"
                  >
                    {String.fromCharCode(DIRECTION_CHAR_CODES[direction])}
                  </span>
                )}
              </div>
            </div>

            {/* RIGHT SECTION (Modular plank entries alignment) stretched to vertically center children */}
            <div className="flex items-stretch justify-end flex-shrink-0 h-full">
              {picType !== 'none' && picPosition === 'right' && (
                <div className="flex items-stretch h-full">
                  <VerticalSeparator show={showSeparator} isDarkClass={isDarkTheme} textSize={textSize} />
                  <div className="h-full aspect-square flex items-center justify-center">
                    <Pictogram type={picType} color={picColor} textSize={textSize} />
                  </div>
                </div>
              )}
              {logoType !== 'none' && logoPosition === 'right' && (
                <DoubleArrowLogo type={logoType} textSize={textSize} />
              )}
            </div>
          </div>

        </div>

        {/* PRESETS SECTOR */}
        <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
          <label className="block text-xs font-mono font-medium text-slate-400 uppercase tracking-widest mb-2">
            Signage Presets
          </label>
          <div className="relative">
            <select
              id="select-preset-signage"
              value={selectedPresetName === 'custom' ? 'custom' : PRESETS.findIndex(p => p.name === selectedPresetName)}
              onChange={(e) => {
                const val = e.target.value;
                if (val !== 'custom') {
                  const idx = Number(val);
                  loadPreset(PRESETS[idx]);
                } else {
                  setSelectedPresetName('custom');
                }
              }}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold focus:ring-1 focus:ring-rail-blue outline-none text-slate-700 h-10 cursor-pointer"
            >
              <option value="custom" disabled>Custom Design (Settings Modified)</option>
              {PRESETS.map((preset, idx) => (
                <option key={idx} value={idx}>{preset.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* CONTROLS AREA */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
          
          {/* Col 1: Text Input, Sliders & Moved Alignment controls */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-medium text-slate-400 uppercase tracking-widest mb-2">
                Board Text
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={typedText}
                  onChange={handleInputChange}
                  maxLength={30}
                  placeholder="Way out"
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold focus:ring-1 focus:ring-rail-blue outline-none text-slate-800 transition-all font-sans tracking-wide h-10"
                />
                {typedText && (
                  <button
                    type="button"
                    onClick={() => {
                      setTypedText('');
                      setSelectedPresetName('custom');
                    }}
                    className="absolute right-3 top-3 text-slate-400 hover:text-rose-500 transition cursor-pointer"
                  >
                    <Lucide.Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-mono font-medium text-slate-400 uppercase tracking-widest mb-1.5">
                <span>Text Size</span>
                <span className="text-slate-600 font-bold">{textSize}px</span>
              </div>
              {/* Range scale: 24 to 80, makes 52 the exact center */}
              <input
                type="range"
                min="24"
                max="80"
                value={textSize}
                onChange={(e) => {
                  setTextSize(Number(e.target.value));
                  setSelectedPresetName('custom');
                }}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-rail-blue"
              />
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-mono font-medium text-slate-400 uppercase tracking-widest mb-1.5">
                <span>Letter Spacing</span>
                <span className="text-slate-600 font-bold">{letterSpacing.toFixed(2)}em</span>
              </div>
              {/* Range scale: -0.20 to 0.10, makes -0.05 the exact center */}
              <input
                type="range"
                min="-0.20"
                max="0.10"
                step="0.01"
                value={letterSpacing}
                onChange={(e) => {
                  setLetterSpacing(Number(e.target.value));
                  setSelectedPresetName('custom');
                }}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-rail-blue"
              />
            </div>

            {/* Text Alignment placed explicitly under Letter Spacing with standard H-8 buttons & NO LABEL */}
            <div className="pt-2">
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setTextAlign('left');
                    setSelectedPresetName('custom');
                  }}
                  className={`flex-grow h-8 text-[11px] font-bold uppercase tracking-wider rounded border cursor-pointer transition flex items-center justify-center ${
                    textAlign === 'left'
                      ? 'bg-[#002F6C] text-white border-blue-950 font-bold'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-500'
                  }`}
                >
                  Left
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTextAlign('center');
                    setSelectedPresetName('custom');
                  }}
                  className={`flex-grow h-8 text-[11px] font-bold uppercase tracking-wider rounded border cursor-pointer transition flex items-center justify-center ${
                    textAlign === 'center'
                      ? 'bg-[#002F6C] text-white border-blue-950 font-bold'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-500'
                  }`}
                >
                  Center
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTextAlign('right');
                    setSelectedPresetName('custom');
                  }}
                  className={`flex-grow h-8 text-[11px] font-bold uppercase tracking-wider rounded border cursor-pointer transition flex items-center justify-center ${
                    textAlign === 'right'
                      ? 'bg-[#002F6C] text-white border-blue-950 font-bold'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-500'
                  }`}
                >
                  Right
                </button>
              </div>
            </div>
          </div>

          {/* Col 2: Theme and Double Arrow Slider */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-medium text-slate-400 uppercase tracking-widest mb-2">
                Background Colour
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setBoardTheme('white');
                    setSelectedPresetName('custom');
                  }}
                  className={`h-9 font-semibold text-xs border rounded-md cursor-pointer transition ${
                    boardTheme === 'white' ? 'bg-white text-slate-900 border-slate-900 ring-1 ring-slate-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  White
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBoardTheme('green');
                    setSelectedPresetName('custom');
                  }}
                  className={`h-9 font-semibold text-xs text-white border rounded-md cursor-pointer transition ${
                    boardTheme === 'green' ? 'bg-[#008751] border-[#005c36] font-bold' : 'bg-[#008751]/80 border-transparent hover:opacity-100 text-emerald-100'
                  }`}
                >
                  Green
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBoardTheme('red');
                    setSelectedPresetName('custom');
                  }}
                  className={`h-9 font-semibold text-xs text-white border rounded-md cursor-pointer transition ${
                    boardTheme === 'red' ? 'bg-[#E5001C] border-[#9c0010] font-bold' : 'bg-[#E5001C]/80 border-transparent hover:opacity-100 text-red-100'
                  }`}
                >
                  Red
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBoardTheme('black');
                    setSelectedPresetName('custom');
                  }}
                  className={`h-9 font-semibold text-xs text-white border rounded-md cursor-pointer transition ${
                    boardTheme === 'black' ? 'bg-[#111111] border-neutral-900 font-bold' : 'bg-[#111111]/80 border-transparent hover:opacity-100 text-neutral-300'
                  }`}
                >
                  Black
                </button>
              </div>
            </div>

            {/* Slider with exactly 5 options designed in iconic BR Overground Map Style */}
            <div>
              <div className="flex justify-between items-center text-xs font-mono font-medium text-slate-400 uppercase tracking-widest mb-3">
                <span>Double Arrow Logo</span>
                <span className="text-[#E5001C] font-bold text-xs uppercase tracking-wider font-mono">
                  {LOGO_TYPES[currentLogoIndex].label}
                </span>
              </div>
              
              {/* Overground Map Track visual layout matching standard range track list */}
              <div className="relative pt-3 pb-3 mb-4 select-none px-2">
                {/* Thin, light grayish track bar matching the track details of the other inputs */}
                <div className="absolute top-1/2 left-[12px] right-[12px] h-2 bg-slate-100 -translate-y-1/2 rounded-lg pointer-events-none" />
                
                {/* Discrete nodes */}
                <div className="flex justify-between items-center relative z-10">
                  {[0, 1, 2, 3, 4].map((idx) => {
                    const isActive = idx === currentLogoIndex;
                    return (
                      <button
                        key={`logo-node-btn-${idx}`}
                        type="button"
                        onClick={() => {
                          handleLogoIndexChange(idx);
                          setSelectedPresetName('custom');
                        }}
                        className={`w-[15px] h-[15px] rounded-full flex items-center justify-center transition-all cursor-pointer border-0 ${
                          isActive 
                            ? 'bg-[#002f6c] shadow-md ring-2 ring-white scale-110' 
                            : 'bg-slate-200 hover:bg-slate-300'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Position selector (only applicable if a logo is chosen) */}
              {logoType !== 'none' && (
                <div className="flex items-center gap-2 mt-4 justify-end">
                  <span className="text-[10px] font-mono font-medium text-slate-400 uppercase tracking-widest">Position:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setLogoPosition('left');
                      setSelectedPresetName('custom');
                    }}
                    className={`cursor-pointer px-2 py-0.5 text-[10px] font-bold rounded border transition ${
                      logoPosition === 'left' ? 'bg-[#002F6C] text-white border-blue-950 shadow-sm' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Left
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLogoPosition('right');
                      setSelectedPresetName('custom');
                    }}
                    className={`cursor-pointer px-2 py-0.5 text-[10px] font-bold rounded border transition ${
                      logoPosition === 'right' ? 'bg-[#002F6C] text-white border-blue-950 shadow-sm' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Right
                  </button>
                </div>
              )}

              {/* Separator toggle control moved beneath the Double Arrow Logo */}
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="text-[10px] font-mono font-medium text-slate-400 uppercase tracking-widest">Separator:</span>
                <button
                  type="button"
                  onClick={() => {
                    setShowSeparator(!showSeparator);
                    setSelectedPresetName('custom');
                  }}
                  className={`cursor-pointer px-3 py-1 text-[10px] font-bold rounded border transition ${
                    showSeparator ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {showSeparator ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>
          </div>

          {/* Col 3: Arrows and Pictograms selectors */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-medium text-slate-400 uppercase tracking-widest mb-1.5">
                Directional Arrow
              </label>
              
              {/* 8 direction arrows */}
              <div className="grid grid-cols-8 gap-1 mb-2">
                {Object.entries(DIRECTIONS).map(([key, config]) => {
                  const isActive = direction === key && arrowPosition !== 'none';
                  const charCode = DIRECTION_CHAR_CODES[key];
                  return (
                    <button
                      key={`dir-btn-${key}`}
                      type="button"
                      onClick={() => {
                        setDirection(key);
                        if (arrowPosition === 'none') setArrowPosition('right');
                        setSelectedPresetName('custom');
                      }}
                      className={`h-8 rounded border flex items-center justify-center transition cursor-pointer text-xs ${
                        isActive 
                          ? 'bg-[#009CCA] text-white border-blue-900 shadow-sm font-semibold' 
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                      }`}
                      title={config.name}
                    >
                      {charCode ? (
                        <span 
                          style={{ 
                            fontFamily: "'Brsign', sans-serif", 
                            fontSize: '1.25rem',
                            lineHeight: 1,
                            display: 'inline-block',
                            fontWeight: 'normal'
                          }}
                          className="select-none"
                        >
                          {String.fromCharCode(charCode)}
                        </span>
                      ) : (
                        <span style={{ transform: `rotate(${config.angle - 90}deg)`, display: 'inline-block' }}>
                          ➔
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Order of placement buttons reordered to: Left, None, Right */}
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setArrowPosition('left');
                    setSelectedPresetName('custom');
                  }}
                  className={`flex-grow h-8 text-[11px] font-bold uppercase tracking-wider rounded border cursor-pointer transition flex items-center justify-center ${
                    arrowPosition === 'left'
                      ? 'bg-[#002F6C] text-white border-blue-950 font-bold'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-500'
                  }`}
                >
                  Left
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setArrowPosition('none');
                    setSelectedPresetName('custom');
                  }}
                  className={`flex-grow h-8 text-[11px] font-bold uppercase tracking-wider rounded border cursor-pointer transition flex items-center justify-center ${
                    arrowPosition === 'none'
                      ? 'bg-slate-900 text-white border-slate-900 font-bold'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-500'
                  }`}
                >
                  None
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setArrowPosition('right');
                    setSelectedPresetName('custom');
                  }}
                  className={`flex-grow h-8 text-[11px] font-bold uppercase tracking-wider rounded border cursor-pointer transition flex items-center justify-center ${
                    arrowPosition === 'right'
                      ? 'bg-[#002F6C] text-white border-blue-950 font-bold'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-500'
                  }`}
                >
                  Right
                </button>
              </div>

              {/* Arrow color selection toggle */}
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[10px] font-mono font-medium text-slate-400 uppercase tracking-widest">Arrow Colour:</span>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setArrowColor('blue');
                      setSelectedPresetName('custom');
                    }}
                    className={`cursor-pointer px-3 py-1 text-[10px] font-bold rounded border transition ${
                      arrowColor === 'blue' ? 'bg-[#002F6C] text-white border-blue-950 font-bold' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Blue
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setArrowColor('black');
                      setSelectedPresetName('custom');
                    }}
                    className={`cursor-pointer px-3 py-1 text-[10px] font-bold rounded border transition ${
                      arrowColor === 'black' ? 'bg-slate-900 text-white border-black font-bold' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Black
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-slate-400 uppercase tracking-widest mb-1.5">
                Pictograms
              </label>

              {/* Dropdown completely removed. Interactive glyph palette remains clean with NO glyph numbers beneath them */}
              <div className="bg-slate-100/50 border border-slate-200 rounded-xl p-3">
                <div className="grid grid-cols-7 gap-1">
                  {PICTOGRAM_GLYPHS.map((glyph) => {
                    const codeStr = String(glyph.code);
                    const isActive = picType === codeStr || (picType === 'exit' && glyph.code === 201) || (picType === 'telephones' && glyph.code === 202) || (picType === 'toilet' && glyph.code === 205) || (picType === 'taxi' && glyph.code === 206) || (picType === 'lift' && glyph.code === 207) || (picType === 'info' && glyph.code === 208) || (picType === 'catering' && glyph.code === 209) || (picType === 'luggage' && glyph.code === 210) || (picType === 'firstaid' && glyph.code === 211);
                    return (
                      <button
                        key={`glyph-btn-${glyph.code}`}
                        type="button"
                        onClick={() => {
                          setPicType(codeStr);
                          setSelectedPresetName('custom');
                        }}
                        className={`h-9 flex items-center justify-center rounded border transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#002F6C] border-[#002F6C] text-white shadow-sm scale-[1.05]'
                            : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800'
                        }`}
                        title={glyph.name}
                      >
                        <span 
                          style={{ fontFamily: "'Brsign', sans-serif", fontSize: '1.21rem', lineHeight: 1 }}
                          className="select-none font-normal"
                        >
                          {String.fromCharCode(glyph.code)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pictogram side replaced with identical Left, None, Right buttons under pictogram controls */}
              <div className="mt-3">
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setPicPosition('left');
                      if (picType === 'none') {
                        setPicType('exit');
                      }
                      setSelectedPresetName('custom');
                    }}
                    className={`flex-grow h-8 text-[11px] font-bold uppercase tracking-wider rounded border cursor-pointer transition flex items-center justify-center ${
                      picType !== 'none' && picPosition === 'left'
                        ? 'bg-[#002F6C] text-white border-blue-950 font-bold'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-500'
                    }`}
                  >
                    Left
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPicType('none');
                      setSelectedPresetName('custom');
                    }}
                    className={`flex-grow h-8 text-[11px] font-bold uppercase tracking-wider rounded border cursor-pointer transition flex items-center justify-center ${
                      picType === 'none'
                        ? 'bg-slate-900 text-white border-slate-900 font-bold'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-500'
                    }`}
                  >
                    None
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPicPosition('right');
                      if (picType === 'none') {
                        setPicType('exit');
                      }
                      setSelectedPresetName('custom');
                    }}
                    className={`flex-grow h-8 text-[11px] font-bold uppercase tracking-wider rounded border cursor-pointer transition flex items-center justify-center ${
                      picType !== 'none' && picPosition === 'right'
                        ? 'bg-[#002F6C] text-white border-blue-950 font-bold'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-500'
                    }`}
                  >
                    Right
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
