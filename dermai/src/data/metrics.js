import { Sun, Sparkles, Droplet, Waves } from 'lucide-react';

export const METRICS = [
  { key: 'redness', label: 'Redness', Icon: Sun },
  { key: 'trouble', label: 'Trouble', Icon: Sparkles },
  { key: 'dryness', label: 'Dryness', Icon: Droplet },
  { key: 'oiliness', label: 'Oiliness', Icon: Waves },
];

export const RANGES = [
  { key: '7D', label: '7D', days: 7, previous: '7D' },
  { key: '1M', label: '1M', days: 30, previous: '1M' },
  { key: '3M', label: '3M', days: 90, previous: '3M' },
  { key: '6M', label: '6M', days: 180, previous: '6M' },
];
