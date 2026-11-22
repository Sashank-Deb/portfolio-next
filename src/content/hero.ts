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

export const ABOUT_FACTS = [
  { value: '5+', label: 'Years of experience' },
  { value: '20+', label: 'Projects shipped' },
  { value: '3', label: 'Companies' },
];
