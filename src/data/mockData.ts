/* ═══════════════════════════════════════════════════════════
   AtlasOS — Mock Data
   Believable stadium operation data for the Command Center.
   Models a 80,000-capacity football stadium mid-match.
   ═══════════════════════════════════════════════════════════ */

import type {
  Alert,
  ActivityEvent,
  AIRecommendation,
  Zone,
  WeatherData,
} from '../types';

/* ─── Stadium Config ─── */
export const stadiumConfig = {
  name: 'Atlas Arena',
  city: 'Lusail',
  capacity: 80000,
  currentAttendance: 74218,
  eventName: 'Semi-Final — Brazil vs France',
  eventTime: '21:00 KST',
  matchMinute: 67,
  healthScore: 94.2,
  overallStatus: 'operational' as const,
};

/* ─── Zone Data ─── */
export const zones: Zone[] = [
  { id: 'z1', name: 'North Stand', type: 'stand', status: 'operational', capacity: 18000, currentOccupancy: 17420, temperature: 24.2 },
  { id: 'z2', name: 'South Stand', type: 'stand', status: 'operational', capacity: 18000, currentOccupancy: 17180, temperature: 24.8 },
  { id: 'z3', name: 'East Wing', type: 'stand', status: 'warning', capacity: 16000, currentOccupancy: 15680, alerts: 2, temperature: 25.1 },
  { id: 'z4', name: 'West Wing', type: 'stand', status: 'operational', capacity: 16000, currentOccupancy: 14890, temperature: 24.5 },
  { id: 'z5', name: 'VIP Lounge', type: 'vip', status: 'operational', capacity: 4000, currentOccupancy: 3640, temperature: 22.0 },
  { id: 'z6', name: 'Gate A', type: 'gate', status: 'operational', capacity: 2000, currentOccupancy: 420 },
  { id: 'z7', name: 'Gate B', type: 'gate', status: 'warning', capacity: 2000, currentOccupancy: 1780, alerts: 1 },
  { id: 'z8', name: 'Gate C', type: 'gate', status: 'operational', capacity: 2000, currentOccupancy: 380 },
  { id: 'z9', name: 'Gate D', type: 'gate', status: 'operational', capacity: 2000, currentOccupancy: 610 },
  { id: 'z10', name: 'Concourse Level 1', type: 'concourse', status: 'operational', capacity: 6000, currentOccupancy: 2140, temperature: 23.5 },
  { id: 'z11', name: 'Concourse Level 2', type: 'concourse', status: 'warning', capacity: 6000, currentOccupancy: 4820, alerts: 1, temperature: 24.1 },
  { id: 'z12', name: 'Parking North', type: 'parking', status: 'operational', capacity: 4500, currentOccupancy: 4120 },
  { id: 'z13', name: 'Parking South', type: 'parking', status: 'critical', capacity: 4500, currentOccupancy: 4480, alerts: 3 },
  { id: 'z14', name: 'Medical Bay 1', type: 'medical', status: 'operational', capacity: 50, currentOccupancy: 8 },
  { id: 'z15', name: 'Medical Bay 2', type: 'medical', status: 'operational', capacity: 50, currentOccupancy: 3 },
  { id: 'z16', name: 'Field', type: 'field', status: 'operational', capacity: 200, currentOccupancy: 34 },
];

/* ─── Crowd Heatmap Data (zone → density 0-1) ─── */
export const heatmapData = [
  { zone: 'North Stand', density: 0.97, trend: 'stable' as const, fans: 17420 },
  { zone: 'South Stand', density: 0.95, trend: 'up' as const, fans: 17180 },
  { zone: 'East Wing', density: 0.98, trend: 'up' as const, fans: 15680 },
  { zone: 'West Wing', density: 0.93, trend: 'down' as const, fans: 14890 },
  { zone: 'VIP Lounge', density: 0.91, trend: 'stable' as const, fans: 3640 },
  { zone: 'Concourse L1', density: 0.36, trend: 'down' as const, fans: 2140 },
  { zone: 'Concourse L2', density: 0.80, trend: 'up' as const, fans: 4820 },
  { zone: 'Gate A', density: 0.21, trend: 'down' as const, fans: 420 },
  { zone: 'Gate B', density: 0.89, trend: 'up' as const, fans: 1780 },
  { zone: 'Gate C', density: 0.19, trend: 'stable' as const, fans: 380 },
  { zone: 'Gate D', density: 0.31, trend: 'stable' as const, fans: 610 },
];

/* ─── Crowd Flow Over Time (last 90 min) ─── */
export const crowdFlowTimeline = [
  { time: '19:00', count: 8200 },
  { time: '19:15', count: 22400 },
  { time: '19:30', count: 41800 },
  { time: '19:45', count: 58900 },
  { time: '20:00', count: 68200 },
  { time: '20:15', count: 72100 },
  { time: '20:30', count: 73400 },
  { time: '20:45', count: 73800 },
  { time: '21:00', count: 74100 },
  { time: '21:15', count: 73900 },
  { time: '21:30', count: 74050 },
  { time: '21:45', count: 74218 },
];

/* ─── Weather ─── */
export const weather: WeatherData = {
  temperature: 28,
  feelsLike: 31,
  humidity: 62,
  windSpeed: 14,
  condition: 'clear',
  forecast: [
    { time: '22:00', temperature: 26, condition: 'clear' },
    { time: '23:00', temperature: 24, condition: 'cloudy' },
    { time: '00:00', temperature: 22, condition: 'cloudy' },
    { time: '01:00', temperature: 21, condition: 'clear' },
  ],
};

/* ─── Parking ─── */
export const parkingData = {
  totalSpaces: 12000,
  occupied: 11240,
  available: 760,
  lots: [
    { name: 'Lot A — North', capacity: 3000, occupied: 2920, status: 'warning' as const },
    { name: 'Lot B — South', capacity: 3000, occupied: 2980, status: 'critical' as const },
    { name: 'Lot C — East', capacity: 3000, occupied: 2840, status: 'operational' as const },
    { name: 'Lot D — VIP', capacity: 1500, occupied: 1380, status: 'operational' as const },
    { name: 'Lot E — Overflow', capacity: 1500, occupied: 1120, status: 'operational' as const },
  ],
};

/* ─── Transport ─── */
export const transportData = {
  metro: {
    status: 'operational' as const,
    nextArrival: '3 min',
    capacity: 82,
    linesActive: 3,
    estimatedPostMatch: '45 min dispersal',
  },
  bus: {
    status: 'operational' as const,
    activeRoutes: 12,
    shuttlesDeployed: 28,
    avgWait: '8 min',
  },
  rideshare: {
    status: 'warning' as const,
    surgeMultiplier: 2.4,
    avgWait: '18 min',
    driversNearby: 342,
  },
  pedestrian: {
    activeExits: 16,
    totalExits: 18,
    estimatedClearTime: '38 min',
  },
};

/* ─── Emergency ─── */
export const emergencyData = {
  status: 'operational' as const,
  activeIncidents: 2,
  resolvedToday: 7,
  medicalStaff: 48,
  medicalStaffOnDuty: 42,
  securityPersonnel: 380,
  securityOnDuty: 365,
  ambulancesStandby: 6,
  fireUnitsStandby: 4,
  evacuationReadiness: 98,
  incidents: [
    { id: 'inc-1', type: 'medical', severity: 'low' as const, description: 'Minor heat exhaustion — East Wing Row 42', time: '21:32', status: 'responding' },
    { id: 'inc-2', type: 'security', severity: 'low' as const, description: 'Unattended bag — Gate B screening', time: '21:38', status: 'investigating' },
  ],
};

/* ─── Accessibility ─── */
export const accessibilityData = {
  score: 96,
  wheelchairSpaces: { total: 240, occupied: 198, available: 42 },
  accessibleRestrooms: { total: 32, operational: 31, outOfOrder: 1 },
  assistiveListening: { active: true, channels: 4 },
  signLanguageInterpreters: 3,
  brailleSignage: 'complete' as const,
  elevators: { total: 12, operational: 11, outOfOrder: 1, location: 'Elevator 7 — East Wing' },
  accessibleParking: { total: 180, occupied: 162, available: 18 },
  companionSeating: 240,
};

/* ─── Sustainability ─── */
export const sustainabilityData = {
  energyConsumption: { current: 2.4, unit: 'MW', target: 3.0, percentOfTarget: 80 },
  solarGeneration: { current: 0.8, unit: 'MW', percentOfLoad: 33 },
  waterUsage: { current: 12400, unit: 'L/hr', target: 15000, percentOfTarget: 83 },
  wasteRecycled: { rate: 78, target: 85 },
  carbonOffset: { today: 4.2, unit: 'tonnes CO₂', credits: 12 },
  hvacEfficiency: 92,
  ledLighting: 100,
};

/* ─── Alerts ─── */
export const alerts: Alert[] = [
  {
    id: 'a1', type: 'warning', title: 'High density detected',
    description: 'East Wing approaching 98% capacity. Consider restricting entry.',
    timestamp: new Date(Date.now() - 120000), zone: 'East Wing', priority: 'high', acknowledged: false,
  },
  {
    id: 'a2', type: 'danger', title: 'Parking Lot B at capacity',
    description: 'South parking lot has reached 99.3% occupancy. Redirect incoming vehicles.',
    timestamp: new Date(Date.now() - 300000), zone: 'Parking South', priority: 'critical', acknowledged: false,
  },
  {
    id: 'a3', type: 'warning', title: 'Gate B congestion',
    description: 'Gate B experiencing 89% throughput. Queue length exceeding 200m.',
    timestamp: new Date(Date.now() - 480000), zone: 'Gate B', priority: 'high', acknowledged: true,
  },
  {
    id: 'a4', type: 'info', title: 'Rideshare surge pricing active',
    description: 'Surge multiplier at 2.4x. Recommend promoting metro and shuttle options.',
    timestamp: new Date(Date.now() - 600000), zone: 'Transport', priority: 'medium', acknowledged: true,
  },
  {
    id: 'a5', type: 'success', title: 'HVAC zone rebalanced',
    description: 'Temperature normalization complete in Concourse Level 2.',
    timestamp: new Date(Date.now() - 900000), zone: 'Concourse L2', priority: 'low', acknowledged: true,
  },
  {
    id: 'a6', type: 'info', title: 'Half-time crowd surge predicted',
    description: 'AI predicts 40% concourse movement in next 8 minutes.',
    timestamp: new Date(Date.now() - 1200000), priority: 'medium', acknowledged: true,
  },
];

/* ─── AI Recommendations ─── */
export const aiRecommendations: AIRecommendation[] = [
  {
    id: 'rec-1',
    title: 'Redirect East Wing Overflow',
    description: 'East Wing density at 98% with upward trend. Gate B queue growing. Recommend immediate action.',
    confidence: 94,
    priority: 'high',
    actions: [
      'Open auxiliary corridor between East Wing and West Wing',
      'Deploy 4 additional stewards to East Wing entries',
      'Enable digital signage to redirect foot traffic',
      'Alert Gate B to slow ingress rate by 30%',
    ],
    reasoning: 'Based on current density trajectory (↑2.1%/5min), East Wing will exceed safe threshold within 12 minutes. Historical data from 47 similar events shows 89% correlation between this pattern and congestion incidents. The West Wing has 7% available capacity that can absorb redistribution.',
    agents: ['Crowd Agent', 'Security Agent', 'Coordinator'],
  },
  {
    id: 'rec-2',
    title: 'Post-Match Dispersal Plan',
    description: 'Match minute 67. Begin pre-positioning transport and security for dispersal.',
    confidence: 88,
    priority: 'medium',
    actions: [
      'Stage 8 additional shuttle buses at North Terminal',
      'Pre-open Gates A & D for early departures',
      'Activate metro capacity surge protocol',
      'Deploy wayfinding staff to parking exits',
    ],
    reasoning: 'Average match ends at minute 93±4. Current transport load suggests 38-minute full dispersal. Proactive staging reduces this by an estimated 11 minutes based on 23 prior events at this venue.',
    agents: ['Transport Agent', 'Crowd Agent', 'Coordinator'],
  },
];

/* ─── Activity Timeline ─── */
export const activityTimeline: ActivityEvent[] = [
  { id: 'ev1', type: 'system', title: 'AI Engine scan complete', description: 'All 16 zones analyzed. 2 recommendations generated.', timestamp: new Date(Date.now() - 30000) },
  { id: 'ev2', type: 'crowd', title: 'East Wing density alert triggered', description: 'Density exceeded 95% threshold.', timestamp: new Date(Date.now() - 120000) },
  { id: 'ev3', type: 'security', title: 'Unattended bag investigation started', description: 'Gate B screening area. Security team dispatched.', timestamp: new Date(Date.now() - 180000) },
  { id: 'ev4', type: 'medical', title: 'Medical response dispatched', description: 'Heat exhaustion case — East Wing Row 42.', timestamp: new Date(Date.now() - 300000) },
  { id: 'ev5', type: 'transport', title: 'Rideshare surge detected', description: 'Multiplier increased to 2.4x in venue zone.', timestamp: new Date(Date.now() - 480000) },
  { id: 'ev6', type: 'weather', title: 'Weather update received', description: 'Clear skies holding. Wind decreasing to 10 km/h by 23:00.', timestamp: new Date(Date.now() - 720000) },
  { id: 'ev7', type: 'crowd', title: 'Second half kickoff', description: 'Crowd seated. All zones stable.', timestamp: new Date(Date.now() - 1200000) },
  { id: 'ev8', type: 'system', title: 'Half-time surge managed', description: 'Concourse flow rate within safe parameters.', timestamp: new Date(Date.now() - 1800000) },
  { id: 'ev9', type: 'security', title: 'Perimeter sweep completed', description: 'All clear. No anomalies detected.', timestamp: new Date(Date.now() - 2400000) },
  { id: 'ev10', type: 'system', title: 'Digital Twin synchronized', description: 'Full venue model updated with live sensor data.', timestamp: new Date(Date.now() - 3000000) },
];

/* ─── Helpers ─── */
export function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

export function formatNumber(n: number): string {
  return n.toLocaleString();
}

export function getDensityColor(density: number): string {
  if (density >= 0.95) return 'var(--color-danger)';
  if (density >= 0.85) return 'var(--color-warning)';
  if (density >= 0.6) return 'var(--color-accent)';
  return 'var(--color-success)';
}

export function getDensityLabel(density: number): string {
  if (density >= 0.95) return 'Critical';
  if (density >= 0.85) return 'High';
  if (density >= 0.6) return 'Moderate';
  return 'Low';
}
