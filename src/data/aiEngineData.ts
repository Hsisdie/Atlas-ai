/* ═══════════════════════════════════════════════════════════
   AtlasOS — AI Engine Mock Data
   High-fidelity mock AI analysis results for the
   Explainable AI panel. Structured to match real Gemini output.
   ═══════════════════════════════════════════════════════════ */

import type { AIAnalysisResult } from '../types';

export const mockAnalysisResult: AIAnalysisResult = {
  id: 'analysis-mock-001',
  timestamp: new Date(),
  overallRisk: 'moderate',
  overallConfidence: 91,
  processingTime: 1847,
  modelVersion: 'Gemini 2.5 Pro',

  predictions: [
    {
      id: 'pred-1',
      problem: 'East Wing Overcrowding',
      description: 'East Wing density is approaching critical threshold at 98%. Current trajectory indicates breach of safe occupancy limit within 12 minutes unless intervention is initiated.',
      confidence: 94,
      severity: 'high',
      timeframe: '8-12 minutes',
      affectedZones: ['East Wing', 'Gate B', 'Concourse L2'],
      indicators: ['Density at 98%', 'Upward trend +2.1%/5min', 'Gate B queue 200m+'],
    },
    {
      id: 'pred-2',
      problem: 'Post-Match Transport Surge',
      description: 'With the match at minute 67, dispersal will begin within approximately 26 minutes. Current transport staging is insufficient for the projected 74,000+ exodus.',
      confidence: 88,
      severity: 'medium',
      timeframe: '20-30 minutes',
      affectedZones: ['All Gates', 'Parking North', 'Parking South', 'Metro Station'],
      indicators: ['Match minute 67', 'Rideshare surge 2.4x', 'Parking 93.7% full'],
    },
    {
      id: 'pred-3',
      problem: 'South Parking Gridlock',
      description: 'Parking Lot B (South) at 99.3% capacity with 3 active alerts. Incoming vehicles will create gridlock on access roads within 5 minutes if not redirected.',
      confidence: 96,
      severity: 'critical',
      timeframe: '3-5 minutes',
      affectedZones: ['Parking South', 'Gate C', 'Gate D'],
      indicators: ['99.3% occupied', '3 active alerts', 'No overflow activated'],
    },
    {
      id: 'pred-4',
      problem: 'Heat Stress Risk',
      description: 'Ambient temperature at 28°C with 62% humidity. Feels-like temperature of 31°C in exposed stands. Elevated risk of heat-related medical incidents in the next 30 minutes.',
      confidence: 72,
      severity: 'low',
      timeframe: '15-30 minutes',
      affectedZones: ['East Wing', 'South Stand'],
      indicators: ['28°C ambient', '62% humidity', '31°C feels-like', '1 active heat case'],
    },
    {
      id: 'pred-5',
      problem: 'Concourse L2 Bottleneck',
      description: 'Concourse Level 2 at 80% density with upward trend. Half-time concession traffic creates flow restriction between Sections 204-208.',
      confidence: 79,
      severity: 'medium',
      timeframe: '5-10 minutes',
      affectedZones: ['Concourse L2', 'Food Courts'],
      indicators: ['80% density', 'Upward trend', '1 alert active'],
    },
  ],

  recommendations: [
    {
      id: 'act-1',
      action: 'Open auxiliary corridor between East Wing and West Wing',
      reasoning: 'West Wing has 7% spare capacity (1,110 seats). Opening Corridor 3B distributes load and reduces East Wing density by an estimated 4.2% within 8 minutes.',
      priority: 'high',
      assignedTo: 'Crowd Agent',
      estimatedImpact: '-4.2% density in East Wing',
    },
    {
      id: 'act-2',
      action: 'Activate Parking Overflow Lot E and redirect southern approach traffic',
      reasoning: 'Lot E is at 74.7% capacity with 380 available spaces. Digital signage on routes S1-S3 can redirect within 2 minutes. Prevents south access road gridlock.',
      priority: 'critical',
      assignedTo: 'Transport Agent',
      estimatedImpact: 'Prevents 15-min gridlock',
      dependencies: ['Digital signage system', 'Traffic control personnel'],
    },
    {
      id: 'act-3',
      action: 'Stage 8 additional shuttle buses at North Terminal',
      reasoning: 'Historical data from 23 prior events shows pre-staging reduces dispersal time by 11 minutes average. Current bus deployment insufficient for 74K crowd.',
      priority: 'high',
      assignedTo: 'Transport Agent',
      estimatedImpact: '-11 min dispersal time',
    },
    {
      id: 'act-4',
      action: 'Deploy 4 additional stewards to East Wing entries',
      reasoning: 'Flow rate management at entry points is the fastest intervention for density reduction. Each steward manages ~200 fans/minute throughput.',
      priority: 'high',
      assignedTo: 'Security Agent',
      estimatedImpact: 'Immediate flow control',
    },
    {
      id: 'act-5',
      action: 'Activate HVAC boost mode in East Wing and South Stand',
      reasoning: 'Reducing perceived temperature by 2°C decreases heat incident probability by 34% according to venue medical data.',
      priority: 'medium',
      assignedTo: 'Weather Agent',
      estimatedImpact: '-2°C perceived temp',
    },
    {
      id: 'act-6',
      action: 'Pre-open Gates A & D for early departures',
      reasoning: 'Enabling early egress reduces peak dispersal load by 8-12%. Gates A and D have lowest current utilization (21% and 31%).',
      priority: 'medium',
      assignedTo: 'Crowd Agent',
      estimatedImpact: '-12% peak exit load',
    },
  ],

  reasoning: [
    {
      step: 1,
      input: 'Crowd density data: 16 zones, 74,218 current attendance',
      analysis: 'Applied time-series forecasting (ARIMA) on 5-minute density snapshots. East Wing shows consistent upward trajectory (+2.1%/5min). Gate B correlation coefficient 0.89 with East Wing density.',
      conclusion: 'East Wing will exceed safe threshold (capacity × 1.02 safety factor) in 8-12 minutes without intervention.',
    },
    {
      step: 2,
      input: 'Parking occupancy: Lot B at 99.3%, overall 93.7%',
      analysis: 'Regression model on historical ingress patterns shows 12 more vehicles expected in next 5 minutes. Lot B cannot absorb this. Access road queue simulation shows gridlock onset at T+4 minutes.',
      conclusion: 'Immediate redirect to overflow Lot E required. Probability of gridlock without action: 94%.',
    },
    {
      step: 3,
      input: 'Match state: Minute 67, transport staging metrics',
      analysis: 'Bayesian model trained on 47 similar events. Average match end: minute 93±4. Current transport capacity handles 68% of projected dispersal in optimal 45-minute window. Gap: 32% (~23,750 fans) need additional transport.',
      conclusion: 'Pre-staging buses and metro surge protocol fills the gap. Historical evidence: 89% success rate with proactive staging.',
    },
    {
      step: 4,
      input: 'Weather: 28°C, 62% humidity, feels-like 31°C',
      analysis: 'Heat index calculation shows moderate risk zone. Medical log cross-reference: 1 heat case active. Venue baseline shows 2.3 heat incidents per event at this temperature. HVAC boost reduces effective temperature perception.',
      conclusion: 'Proactive HVAC intervention recommended. Low severity but easy to prevent.',
    },
    {
      step: 5,
      input: 'All agent analyses combined, cross-domain dependency graph',
      analysis: 'Multi-agent consensus: 6/7 agents agree on East Wing as primary risk. Transport Agent flags post-match as higher urgency. Coordinator resolves by temporal prioritization: East Wing NOW, transport in 10 minutes.',
      conclusion: 'Execute East Wing mitigations immediately (T+0). Begin transport pre-staging at T+5. Parking redirect at T+0 (parallel with East Wing). Monitor heat metrics passively.',
    },
  ],
};

/* ─── Input display labels for the AI Engine UI ─── */
export const inputCategories = [
  { key: 'crowd', label: 'Crowd Intelligence', icon: 'Users', color: 'hsl(215, 100%, 58%)', value: '74,218', sublabel: '92.8% capacity' },
  { key: 'weather', label: 'Weather Systems', icon: 'Cloud', color: 'hsl(200, 85%, 55%)', value: '28°C', sublabel: 'Clear, 62% humidity' },
  { key: 'parking', label: 'Parking Matrix', icon: 'ParkingCircle', color: 'hsl(38, 92%, 55%)', value: '93.7%', sublabel: '760 spaces available' },
  { key: 'transport', label: 'Transport Grid', icon: 'Train', color: 'hsl(152, 60%, 48%)', value: 'Active', sublabel: '3 metro lines, 28 shuttles' },
  { key: 'medical', label: 'Medical Status', icon: 'HeartPulse', color: 'hsl(0, 72%, 58%)', value: '2 Active', sublabel: '42 staff on duty' },
  { key: 'accessibility', label: 'Accessibility', icon: 'Accessibility', color: 'hsl(270, 60%, 58%)', value: '96/100', sublabel: '1 elevator issue' },
  { key: 'security', label: 'Security Net', icon: 'Shield', color: 'hsl(160, 50%, 48%)', value: '365 Active', sublabel: '2 alerts' },
];
