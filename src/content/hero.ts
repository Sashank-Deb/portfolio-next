export interface Stat {
  value: string;
  arrowTo?: string;
  label: string;
}

export const STATS: Stat[] = [
  { value: '3.8s', arrowTo: '<0.8s', label: 'LCP, after the performance work I led' },
  { value: '50+', label: 'Clients on the radiology platform whose auth I owned' },
  { value: '−30%', label: 'Auth support tickets after the PIN-to-password migration' },
];

export interface AboutFact {
  count: number;
  suffix?: string;
  label: string;
}

export const ABOUT_FACTS: AboutFact[] = [
  { count: 5, suffix: '+', label: 'Years of experience' },
  { count: 20, suffix: '+', label: 'Projects shipped' },
  { count: 3, label: 'Companies' },
];
