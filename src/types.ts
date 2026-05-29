/**
 * Shared Type Definitions for British Rail Legacy and Travel Portal
 */

export type Page = 'home' | 'history' | 'guide';

export interface Station {
  code: string;
  name: string;
  city: string;
  popular: boolean;
}

export interface FareCalculation {
  origin: Station;
  destination: Station;
  date: string;
  time: string;
  railcard: string;
  standardPrice: number;
  splitPrice: number;
  savingsPercent: number;
  splitSegments: {
    from: string;
    to: string;
    price: number;
    train: string;
  }[];
}

export interface DesignElement {
  id: string;
  number: string;
  title: string;
  description: string;
  longerDescription: string;
  iconName: string;
}

export interface TimelineEvent {
  year: number;
  title: string;
  subtitle: string;
  description: string;
  category: 'heritage' | 'design' | 'engineering';
}
