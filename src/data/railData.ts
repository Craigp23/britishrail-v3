import { Station, TimelineEvent, DesignElement, FareCalculation } from '../types';

export const STATIONS: Station[] = [
  { code: 'KGX', name: 'London King\'s Cross', city: 'London', popular: true },
  { code: 'EDB', name: 'Edinburgh Waverley', city: 'Edinburgh', popular: true },
  { code: 'MAN', name: 'Manchester Piccadilly', city: 'Manchester', popular: true },
  { code: 'BHM', name: 'Birmingham New Street', city: 'Birmingham', popular: true },
  { code: 'YRK', name: 'York', city: 'York', popular: true },
  { code: 'BRI', name: 'Bristol Temple Meads', city: 'Bristol', popular: true },
  { code: 'EUS', name: 'London Euston', city: 'London', popular: true },
  { code: 'PAD', name: 'London Paddington', city: 'London', popular: false },
  { code: 'GLC', name: 'Glasgow Central', city: 'Glasgow', popular: true },
  { code: 'NCL', name: 'Newcastle Central', city: 'Newcastle', popular: false },
  { code: 'LDS', name: 'Leeds City', city: 'Leeds', popular: false },
  { code: 'LIV', name: 'Liverpool Lime Street', city: 'Liverpool', popular: false },
  { code: 'CNM', name: 'Cheltenham Spa', city: 'Cheltenham', popular: false },
  { code: 'SOU', name: 'Southampton Central', city: 'Southampton', popular: false },
  { code: 'CDF', name: 'Cardiff Central', city: 'Cardiff', popular: false }
];

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    year: 1948,
    title: 'Nationalisation of the Railways',
    subtitle: 'The Creation of British Railways',
    description: 'Under the Transport Act 1947, the "Big Four" private railway companies are merged to form British Railways, creating a unified state-owned national network under public service parameters.',
    category: 'heritage'
  },
  {
    year: 1955,
    title: 'The Modernisation Plan',
    subtitle: 'Transition from Steam to Diesel and Electric',
    description: 'A massive government commitment (£1.2 billion) is approved to phase out steam locomotion in favor of modern diesel and electric train units, standardizing rolling stock. Track signaling and services undergo rapid modernization.',
    category: 'engineering'
  },
  {
    year: 1965,
    title: 'The New Corporate Identity',
    subtitle: 'Rebranding to British Rail with the "Double Arrow"',
    description: 'The Design Research Unit triggers a landmark visual overhaul. Gerry Barney drafts the famous interlocking "Double Arrow" logo on a sketchpad. The name is shortened to "British Rail" and the bespoke Rail Alphabet font is deployed across all signs.',
    category: 'design'
  },
  {
    year: 1976,
    title: 'Launch of the InterCity 125',
    subtitle: 'The World\'s Fastest Diesel Train (HST)',
    description: 'The world-famous High Speed Train (class 43 locomotive) debuts, running at 125 mph (200 km/h). Boasting Kenneth Grange\'s legendary aerodynamic design and iconic dual-front yellow nose, it revolutionized long-distance travel.',
    category: 'engineering'
  },
  {
    year: 1982,
    title: 'Sectorisation & Design Zenith',
    subtitle: 'Formation of InterCity, Network SouthEast & Provincial',
    description: 'British Rail is restructured into business segments. This ushers in highly successful sector liveries, including the classy InterCity Executive look, the bright red-white-blue of Network SouthEast, and the iconic regional Sprinter stripes.',
    category: 'design'
  },
  {
    year: 1994,
    title: 'The Privatisation Era Begins',
    subtitle: 'Rail Railways Board Dissolution',
    description: 'The Railways Act 1993 takes effect, splintering British Rail infrastructure (transferred to Railtrack) and separating passenger services into 25 independent commercial franchises, bringing an end to the cohesive state-owned branding under BR.',
    category: 'heritage'
  }
];

export const DESIGN_ELEMENTS: DesignElement[] = [
  {
    id: 'double-arrow',
    number: '01',
    title: 'The Double Arrow',
    description: 'Designed by Gerry Barney in 1965, the interlocking parallel arrows perfectly symbolized the dual directions of a modern, multi-track national transit network.',
    longerDescription: 'Commissioned as part of a complete corporate identity overhaul led by the Design Research Unit (DRU), the symbol is composed of two parallel lines with arrows pointing in opposite directions, representing two tracks, with crossovers representing the tracks themselves or diverging lines. Gerry Barney famously sketched the design on his morning train commute. Its geometry is mathematically precise, balancing negative space to look crisp from miles away.',
    iconName: 'GitCommit'
  },
  {
    id: 'rail-alphabet',
    number: '02',
    title: 'Rail Alphabet',
    description: 'A bespoke, highly legible sans-serif typeface created by Jock Kinneir and Margaret Calvert to instantly cut through visual noise across stations nationwide.',
    longerDescription: 'Developed in 1965 (and revised as Rail Alphabet 2 in recent years), this elegant typeface was designed to be easily read by travelers from moving transit vehicles or at a distance in visually complex station halls. Available in light and dark weights (for negative text on dark signboards vs positive text on white boards), it forms the basis of all modern highway signage systems across the UK and many international regions.',
    iconName: 'Type'
  },
  {
    id: 'flame-red',
    number: '03',
    title: 'Flame Red Accent',
    description: 'Utilized strategically against Rail Blue to bring high-visibility energy to train liveries, safety sign systems, and printed passenger materials.',
    longerDescription: 'The official British Rail signature palette comprised primarily Rail Blue (BS 381C No. 114) for body colors, Rail Grey for roofs/accents, and Flame Red (BS 381C No. 537) for key accents. This brilliant crimson contrast was reserved for double arrows on locomotive sides, warning sign systems, timetables, and station emergency systems to balance the heavy corporate stability of Rail Blue with vital kinetic energy.',
    iconName: 'Flame'
  },
  {
    id: 'intercity-125',
    number: '04',
    title: 'The InterCity 125',
    description: 'Kenneth Grange’s sleek, aerodynamic nose cone design paired industrial speed engineering with unmistakable mid-century styling cues.',
    longerDescription: 'In the early 1970s, passenger comfort and speed were crucial to compete with growing motorways. The resulting HST (High Speed Train) featured class-leading diesel performance. Industrial design master Sir Kenneth Grange was brought in to refine the aerodynamic outer shell. By removing standard buffer blocks and sculpting the fiberglass nose cone, he created a timeless silhouette that symbolized fast, comfortable rail travel and saved British Rail financially.',
    iconName: 'Zap'
  }
];

// Calculation utility for simulated train fares & splits
export function calculateFare(
  originCode: string,
  destinationCode: string,
  railcard: string,
  date: string,
  time: string
): FareCalculation | null {
  const origin = STATIONS.find(s => s.code === originCode);
  const destination = STATIONS.find(s => s.code === destinationCode);

  if (!origin || !destination) return null;

  // Compute a base price based on distance proxy using codes
  // We make it stable but realistic
  const sumLen = (originCode.charCodeAt(0) + destinationCode.charCodeAt(0) + destinationCode.charCodeAt(1));
  const baseStandard = 45 + (sumLen % 4) * 25 + (sumLen % 5) * 6;

  let splitPoint = 'York';
  let splitPointCode = 'YRK';
  let splitFactor = 0.58; // split tickets are typically 30-45% cheaper

  // Real route-specific splits
  if ((originCode === 'KGX' && destinationCode === 'EDB') || (originCode === 'EDB' && destinationCode === 'KGX')) {
    splitPoint = 'York';
    splitPointCode = 'YRK';
    splitFactor = 0.56;
  } else if ((originCode === 'EUS' && destinationCode === 'MAN') || (originCode === 'MAN' && destinationCode === 'EUS')) {
    splitPoint = 'Crewe';
    splitPointCode = 'CRE';
    splitFactor = 0.61;
  } else if ((originCode === 'BHM' && destinationCode === 'BRI') || (originCode === 'BRI' && destinationCode === 'BHM')) {
    splitPoint = 'Cheltenham Spa';
    splitPointCode = 'CNM';
    splitFactor = 0.65;
  } else {
    // general fallback split point
    const middleStations = STATIONS.filter(s => s.code !== originCode && s.code !== destinationCode);
    const middle = middleStations[sumLen % middleStations.length];
    splitPoint = middle.name;
    splitPointCode = middle.code;
    splitFactor = 0.60 + (sumLen % 10) / 100;
  }

  // Calculate prices
  let standardPrice = baseStandard;
  
  // Apply railcard discount (1/3 off standard fare)
  const discountMultiplier = railcard && railcard !== 'none' ? 2/3 : 1;
  standardPrice = Math.round(standardPrice * discountMultiplier * 100) / 100;

  const splitPriceTotal = Math.round((baseStandard * splitFactor) * discountMultiplier * 100) / 100;
  const splitPrice1 = Math.round((splitPriceTotal * 0.55) * 100) / 100;
  const splitPrice2 = Math.round((splitPriceTotal * 0.45) * 100) / 100;

  const savingsPercent = Math.round((1 - (splitPriceTotal / standardPrice)) * 100);

  return {
    origin,
    destination,
    date,
    time,
    railcard,
    standardPrice,
    splitPrice: splitPriceTotal,
    savingsPercent,
    splitSegments: [
      {
        from: origin.name,
        to: splitPoint,
        price: splitPrice1,
        train: 'LNER InterCity Express'
      },
      {
        from: splitPoint,
        to: destination.name,
        price: splitPrice2,
        train: 'CrossCountry HighSpeed Train'
      }
    ]
  };
}
