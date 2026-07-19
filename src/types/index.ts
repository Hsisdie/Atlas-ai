/* ═══════════════════════════════════════════════════════════
   AtlasOS Type Definitions
   Core data models for the entire platform.
   ═══════════════════════════════════════════════════════════ */

/* ─── Navigation ─── */
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: number;
  children?: NavItem[];
}

export interface NavSection {
  id: string;
  title?: string;
  items: NavItem[];
}

/* ─── Status ─── */
export type StatusLevel = 'operational' | 'warning' | 'critical' | 'offline';
export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type Trend = 'up' | 'down' | 'stable';

/* ─── Metrics ─── */
export interface Metric {
  id: string;
  label: string;
  value: number;
  unit?: string;
  trend?: Trend;
  trendValue?: number;
  status?: StatusLevel;
  icon?: string;
}

/* ─── Zones ─── */
export type ZoneType =
  | 'gate' | 'stand' | 'concourse' | 'parking' | 'vip'
  | 'medical' | 'field' | 'food' | 'volunteer' | 'emergency_route';

export interface Zone {
  id: string;
  name: string;
  type: 'gate' | 'stand' | 'concourse' | 'parking' | 'vip' | 'medical' | 'field';
  status: StatusLevel;
  capacity: number;
  currentOccupancy: number;
  temperature?: number;
  alerts?: number;
}

/* ─── Digital Twin ─── */
export interface DigitalTwinZone {
  id: string;
  name: string;
  type: ZoneType;
  status: StatusLevel;
  capacity: number;
  currentOccupancy: number;
  temperature?: number;
  alerts?: number;
  svgPath: string;
  center: { x: number; y: number };
  layer: number;
  density?: number;
}

export interface FoodCourt {
  id: string;
  name: string;
  position: { x: number; y: number };
  menuTypes: string[];
  queueLength: number;
  waitTime: string;
  status: StatusLevel;
  popularItem: string;
}

export interface VolunteerStation {
  id: string;
  name: string;
  position: { x: number; y: number };
  volunteerCount: number;
  roles: string[];
  status: StatusLevel;
  shift: string;
}

export interface EmergencyRoute {
  id: string;
  name: string;
  pathData: string;
  capacity: number;
  status: StatusLevel;
  exitGate: string;
  estimatedClearTime: string;
}

export interface DigitalTwinViewConfig {
  zoom: number;
  panX: number;
  panY: number;
  rotateX: number;
  rotateZ: number;
}

export type DigitalTwinLayerKey =
  | 'crowdDensity' | 'gates' | 'parking' | 'medical'
  | 'foodCourts' | 'volunteers' | 'emergencyRoutes' | 'labels';

/* ─── Alerts ─── */
export interface Alert {
  id: string;
  type: 'info' | 'warning' | 'danger' | 'success';
  title: string;
  description: string;
  timestamp: Date;
  zone?: string;
  priority: Priority;
  acknowledged: boolean;
}

/* ─── Activity ─── */
export interface ActivityEvent {
  id: string;
  type: 'crowd' | 'security' | 'medical' | 'weather' | 'transport' | 'system';
  title: string;
  description?: string;
  timestamp: Date;
  icon?: string;
}

/* ─── Weather ─── */
export interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  condition: 'clear' | 'cloudy' | 'rain' | 'storm' | 'snow';
  forecast: WeatherForecast[];
}

export interface WeatherForecast {
  time: string;
  temperature: number;
  condition: string;
}

/* ─── AI ─── */
export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  confidence: number;
  priority: Priority;
  actions: string[];
  reasoning: string;
  agents?: string[];
}

export interface AIAgent {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'idle' | 'processing' | 'error';
  lastUpdate: Date;
  insights: string[];
}

/* ─── Simulation ─── */
export interface Scenario {
  id: string;
  name: string;
  description: string;
  icon: string;
  severity: Priority;
  effects: ScenarioEffect[];
}

export interface ScenarioEffect {
  metric: string;
  change: number;
  description: string;
}

/* ─── Stadium ─── */
export interface StadiumConfig {
  name: string;
  capacity: number;
  zones: Zone[];
  gates: number;
  parkingLots: number;
  medicalStations: number;
  foodCourts: number;
}

/* ─── Component Props ─── */
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

export interface ButtonVariant {
  variant: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size: 'sm' | 'md' | 'lg';
}

/* ─── AI Engine (Milestone 4) ─── */
export interface AIAnalysisInput {
  crowd: { totalAttendance: number; densityZones: { zone: string; density: number }[] };
  weather: { temperature: number; condition: string; humidity: number; windSpeed: number };
  parking: { occupancyPercent: number; availableSpaces: number };
  transport: { metroStatus: string; busCapacity: number; rideshareWait: string };
  medical: { activeIncidents: number; staffOnDuty: number };
  accessibility: { score: number; elevatorIssues: number };
  security: { personnelOnDuty: number; activeAlerts: number };
}

export interface AIPrediction {
  id: string;
  problem: string;
  description: string;
  confidence: number;
  severity: Priority;
  timeframe: string;
  affectedZones: string[];
  indicators: string[];
}

export interface AIAction {
  id: string;
  action: string;
  reasoning: string;
  priority: Priority;
  assignedTo: string;
  estimatedImpact: string;
  dependencies?: string[];
}

export interface AIReasoningStep {
  step: number;
  input: string;
  analysis: string;
  conclusion: string;
}

export interface AIAnalysisResult {
  id: string;
  timestamp: Date;
  overallRisk: 'low' | 'moderate' | 'high' | 'critical';
  overallConfidence: number;
  predictions: AIPrediction[];
  recommendations: AIAction[];
  reasoning: AIReasoningStep[];
  processingTime: number;
  modelVersion: string;
}

/* ─── Multi-Agent AI (Milestone 6) ─── */
export interface AgentAnalysis {
  agentId: string;
  agentName: string;
  role: string;
  color: string;
  status: 'idle' | 'processing' | 'complete' | 'error';
  insights: AgentInsight[];
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  confidence: number;
  processingTime: number;
  lastUpdate: Date;
}

export interface AgentInsight {
  id: string;
  title: string;
  description: string;
  confidence: number;
  category: string;
  dataPoints: string[];
}

export interface CoordinatorPlan {
  id: string;
  title: string;
  summary: string;
  actions: CoordinatorAction[];
  consensusLevel: number;
  contributingAgents: string[];
  timestamp: Date;
}

export interface CoordinatorAction {
  id: string;
  action: string;
  priority: Priority;
  sourceAgents: string[];
  reasoning: string;
  status: 'pending' | 'approved' | 'executing' | 'completed';
}

/* ─── Scenario Simulator (Milestone 5) ─── */
export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  icon: string;
  severity: Priority;
  category: 'weather' | 'transport' | 'infrastructure' | 'medical' | 'security' | 'operations';
  affectedSystems: string[];
  effects: SimulationEffect[];
  aiResponse: string;
  timeline: SimulationEvent[];
}

export interface SimulationEffect {
  metric: string;
  currentValue: number;
  simulatedValue: number;
  unit: string;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
}

export interface SimulationEvent {
  time: string;
  event: string;
  severity: Priority;
  automated: boolean;
}

export type SimulationPhase = 'idle' | 'activating' | 'active' | 'resolving';

/* ─── Fan Companion (Milestone 7) ─── */
export type FanTab = 'home' | 'navigate' | 'queue' | 'assistant' | 'emergency';

export interface FanProfile {
  name: string;
  seat: { section: string; row: string; number: number };
  ticketType: 'standard' | 'premium' | 'vip';
  language: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  language?: string;
}

export interface QueuePrediction {
  id: string;
  name: string;
  type: 'food' | 'restroom' | 'merchandise';
  currentWait: number;
  predictedWait: number;
  bestTime: string;
  distance: string;
}
