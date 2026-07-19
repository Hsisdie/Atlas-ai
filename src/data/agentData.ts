/* ═══════════════════════════════════════════════════════════
   AtlasOS — Multi-Agent AI Data  (Milestone 6)
   Seven specialized agents + coordinator plan.
   ═══════════════════════════════════════════════════════════ */

import type { AgentAnalysis, CoordinatorPlan } from '../types';

export const agents: AgentAnalysis[] = [
  {
    agentId: 'crowd',
    agentName: 'Crowd Agent',
    role: 'Monitors crowd density, flow patterns, and congestion risk across all zones',
    color: 'hsl(215, 100%, 58%)',
    status: 'idle',
    riskLevel: 'high',
    confidence: 94,
    processingTime: 340,
    lastUpdate: new Date(Date.now() - 30000),
    insights: [
      { id: 'ci-1', title: 'East Wing Critical Density', description: 'Density at 98% with upward trend of +2.1% per 5 minutes. Safe threshold breach projected in 8-12 minutes.', confidence: 94, category: 'density', dataPoints: ['98% occupancy', '+2.1%/5min trend', '15,680 fans'] },
      { id: 'ci-2', title: 'Gate B Congestion Building', description: 'Queue length exceeds 200 meters. Throughput rate declining as density increases in adjacent zones.', confidence: 89, category: 'flow', dataPoints: ['89% throughput', '200m queue', '1,780 in queue area'] },
      { id: 'ci-3', title: 'Post-Match Surge Predicted', description: 'Match minute 67 — estimated 23 minutes until dispersal begins. Pre-positioning required for 74K exit.', confidence: 88, category: 'prediction', dataPoints: ['74,218 attendance', 'Minute 67', '93±4 avg match end'] },
    ],
  },
  {
    agentId: 'transport',
    agentName: 'Transport Agent',
    role: 'Manages metro, bus, rideshare, and pedestrian flow for optimal dispersal',
    color: 'hsl(38, 92%, 55%)',
    status: 'idle',
    riskLevel: 'moderate',
    confidence: 86,
    processingTime: 280,
    lastUpdate: new Date(Date.now() - 45000),
    insights: [
      { id: 'ti-1', title: 'Rideshare Surge Active', description: 'Surge multiplier at 2.4x. Average wait time 18 minutes. 342 drivers nearby but insufficient for post-match demand.', confidence: 92, category: 'rideshare', dataPoints: ['2.4x surge', '18min avg wait', '342 drivers'] },
      { id: 'ti-2', title: 'Metro Capacity Sufficient', description: 'All 3 lines operational at 82% capacity. Surge protocol available but not yet needed.', confidence: 95, category: 'metro', dataPoints: ['3 lines active', '82% capacity', '3min interval'] },
      { id: 'ti-3', title: 'Bus Pre-Staging Needed', description: 'Current 28 shuttles insufficient for 74K dispersal. Recommend staging 8 additional at North Terminal.', confidence: 86, category: 'bus', dataPoints: ['28 deployed', '12 routes', '8min avg wait'] },
    ],
  },
  {
    agentId: 'security',
    agentName: 'Security Agent',
    role: 'Monitors threat levels, perimeter integrity, and incident response readiness',
    color: 'hsl(152, 60%, 48%)',
    status: 'idle',
    riskLevel: 'low',
    confidence: 97,
    processingTime: 210,
    lastUpdate: new Date(Date.now() - 20000),
    insights: [
      { id: 'si-1', title: 'Unattended Bag Investigation', description: 'Gate B screening area. Security team on site. K9 unit en route. Preliminary assessment: low threat.', confidence: 97, category: 'incident', dataPoints: ['Gate B', 'K9 dispatched', 'Low threat'] },
      { id: 'si-2', title: 'Perimeter Secure', description: 'All perimeter checkpoints operational. No anomalies detected in latest sweep. CCTV coverage at 100%.', confidence: 99, category: 'perimeter', dataPoints: ['100% CCTV', 'All gates staffed', 'Last sweep clean'] },
      { id: 'si-3', title: 'Steward Deployment Recommendation', description: 'East Wing density warrants 4 additional stewards at entry points for flow management.', confidence: 91, category: 'staffing', dataPoints: ['365 on duty', '4 needed East Wing', '98% zone density'] },
    ],
  },
  {
    agentId: 'accessibility',
    agentName: 'Accessibility Agent',
    role: 'Ensures inclusive operations for guests with disabilities and special needs',
    color: 'hsl(270, 60%, 58%)',
    status: 'idle',
    riskLevel: 'low',
    confidence: 96,
    processingTime: 190,
    lastUpdate: new Date(Date.now() - 60000),
    insights: [
      { id: 'ai-1', title: 'Elevator 7 Out of Service', description: 'East Wing elevator 7 non-operational. Alternative route adds 4 minutes for wheelchair users. Technician ETA: 45 minutes.', confidence: 100, category: 'infrastructure', dataPoints: ['Elevator 7 down', '+4min detour', '45min repair ETA'] },
      { id: 'ai-2', title: 'Wheelchair Spaces Adequate', description: '42 accessible seats available. No waitlist. Companion seating sufficient at 240 positions.', confidence: 98, category: 'seating', dataPoints: ['42 available', '198 occupied', '240 companion seats'] },
      { id: 'ai-3', title: 'Assistive Listening Active', description: 'All 4 channels broadcasting. Sign language interpreters positioned at Sections 101, 201, VIP.', confidence: 99, category: 'services', dataPoints: ['4 channels', '3 interpreters', 'Braille signage complete'] },
    ],
  },
  {
    agentId: 'emergency',
    agentName: 'Emergency Agent',
    role: 'Coordinates medical response, evacuation readiness, and fire safety systems',
    color: 'hsl(0, 72%, 58%)',
    status: 'idle',
    riskLevel: 'low',
    confidence: 98,
    processingTime: 250,
    lastUpdate: new Date(Date.now() - 35000),
    insights: [
      { id: 'ei-1', title: 'Medical Response Active', description: 'Minor heat exhaustion case in East Wing Row 42. Responding team on site. Patient stable, no transport needed.', confidence: 98, category: 'medical', dataPoints: ['1 active case', 'Team responding', 'Patient stable'] },
      { id: 'ei-2', title: 'Evacuation Readiness: 98%', description: 'All emergency routes tested. Route ER-2 (East) has minor obstruction at waypoint 3 — steward notified.', confidence: 96, category: 'evacuation', dataPoints: ['4 routes clear', '98% readiness', '1 minor obstruction'] },
      { id: 'ei-3', title: 'Ambulances On Standby', description: '6 ambulances positioned at staging areas. 4 fire units ready. All equipment checked within last hour.', confidence: 99, category: 'resources', dataPoints: ['6 ambulances', '4 fire units', 'Equipment current'] },
    ],
  },
  {
    agentId: 'weather',
    agentName: 'Weather Agent',
    role: 'Monitors meteorological conditions and environmental comfort for fan safety',
    color: 'hsl(200, 85%, 55%)',
    status: 'idle',
    riskLevel: 'low',
    confidence: 91,
    processingTime: 150,
    lastUpdate: new Date(Date.now() - 90000),
    insights: [
      { id: 'wi-1', title: 'Clear Conditions Holding', description: 'No precipitation expected for next 4 hours. Wind decreasing from 14 to 10 km/h by 23:00.', confidence: 94, category: 'forecast', dataPoints: ['Clear skies', '14→10 km/h wind', 'No rain 4hrs'] },
      { id: 'wi-2', title: 'Heat Index Moderate', description: 'Ambient 28°C, feels-like 31°C due to 62% humidity. Cooling trend expected after 22:00.', confidence: 91, category: 'comfort', dataPoints: ['28°C ambient', '31°C feels-like', '62% humidity'] },
      { id: 'wi-3', title: 'HVAC Optimization Available', description: 'Boosting HVAC in East Wing and South Stand can reduce perceived temperature by 2°C, reducing heat incident risk by 34%.', confidence: 88, category: 'mitigation', dataPoints: ['92% HVAC efficiency', '-2°C possible', '-34% risk reduction'] },
    ],
  },
  {
    agentId: 'coordinator',
    agentName: 'Coordinator Agent',
    role: 'Synthesizes all agent analyses into a unified operational plan with prioritized actions',
    color: 'hsl(280, 80%, 60%)',
    status: 'idle',
    riskLevel: 'moderate',
    confidence: 91,
    processingTime: 420,
    lastUpdate: new Date(Date.now() - 15000),
    insights: [
      { id: 'co-1', title: 'Multi-Agent Consensus: East Wing Priority', description: '6 of 7 agents flag East Wing density as the primary operational risk. Unified action plan generated.', confidence: 94, category: 'consensus', dataPoints: ['6/7 agents agree', 'East Wing primary', '94% confidence'] },
      { id: 'co-2', title: 'Temporal Priority Matrix', description: 'Immediate: East Wing + Parking. T+5min: Transport pre-staging. T+10min: Heat mitigation. Passive: Weather monitoring.', confidence: 91, category: 'planning', dataPoints: ['3 priority tiers', '6 total actions', 'All agents contributing'] },
    ],
  },
];

export const coordinatorPlan: CoordinatorPlan = {
  id: 'plan-001',
  title: 'Unified Operational Response Plan',
  summary: 'Cross-domain analysis identifies East Wing overcrowding as the primary risk, with transport pre-staging and parking overflow as secondary priorities. All 7 agents contributing to a synchronized action plan.',
  consensusLevel: 94,
  contributingAgents: ['Crowd Agent', 'Transport Agent', 'Security Agent', 'Accessibility Agent', 'Emergency Agent', 'Weather Agent'],
  timestamp: new Date(),
  actions: [
    { id: 'ca-1', action: 'Open auxiliary corridor between East Wing and West Wing', priority: 'high', sourceAgents: ['Crowd Agent', 'Security Agent'], reasoning: 'West Wing 7% spare capacity absorbs redistribution. Security confirms corridor 3B clear.', status: 'pending' },
    { id: 'ca-2', action: 'Activate Parking Overflow Lot E', priority: 'critical', sourceAgents: ['Transport Agent', 'Crowd Agent'], reasoning: 'Lot B at 99.3%. Lot E has 380 spaces. Digital signage redirect prevents gridlock.', status: 'pending' },
    { id: 'ca-3', action: 'Deploy 4 additional stewards to East Wing', priority: 'high', sourceAgents: ['Security Agent', 'Crowd Agent'], reasoning: 'Flow rate management at entry points. Each steward manages 200 fans/min throughput.', status: 'pending' },
    { id: 'ca-4', action: 'Stage 8 additional shuttle buses at North Terminal', priority: 'high', sourceAgents: ['Transport Agent'], reasoning: '23 prior events show pre-staging reduces dispersal by 11 minutes average.', status: 'pending' },
    { id: 'ca-5', action: 'Activate HVAC boost in East Wing and South Stand', priority: 'medium', sourceAgents: ['Weather Agent', 'Emergency Agent'], reasoning: '-2°C perceived temp reduces heat incident probability by 34%.', status: 'pending' },
    { id: 'ca-6', action: 'Pre-open Gates A & D for early departures', priority: 'medium', sourceAgents: ['Crowd Agent', 'Transport Agent'], reasoning: 'Reduces peak dispersal load by 8-12%. Both gates at low utilization.', status: 'pending' },
  ],
};
