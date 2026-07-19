/* ═══════════════════════════════════════════════════════════
   AtlasOS — Simulation Context (Orchestration Hub)
   The central nervous system of Atlas AI.
   Manages global state, emits events, orchestrates all modules.
   ═══════════════════════════════════════════════════════════ */

import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import type { SimulationScenario, AIAnalysisResult } from '../types';
import { scenarios } from '../data/scenarioData';
import { AtlasEventBus, type AtlasEvent } from '../services/AtlasEventBus';
import { generateDynamicAnalysis } from '../services/aiService';

/* ─── Types ─── */
export type SystemPhase = 'nominal' | 'alert' | 'crisis' | 'recovery';

export interface Notification {
  id: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: Date;
  read: boolean;
  source: string;
}

export interface GlobalSimulationState {
  // Core metrics
  time: Date;
  stadiumHealth: number;
  crowdDensity: number;
  activeScenario: SimulationScenario | null;
  phase: SystemPhase;

  // Metrics
  metrics: {
    weather: string;
    temperature: number;
    queueAverage: number;
    parkingCapacity: number;
    activeAgents: number;
    energy: number;
    transport: number;
  };

  // AI State
  aiState: {
    thinking: boolean;
    lastAnalysis: AIAnalysisResult | null;
    reasoningStream: string[];
    confidence: number;
  };

  // Event System
  eventLog: AtlasEvent[];
  notifications: Notification[];
  unreadNotifications: number;

  // Actions
  triggerScenario: (scenarioId: string) => void;
  resetSimulation: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

const defaultState: GlobalSimulationState = {
  time: new Date(),
  stadiumHealth: 94.2,
  crowdDensity: 68,
  activeScenario: null,
  phase: 'nominal',
  metrics: {
    weather: 'Clear',
    temperature: 24,
    queueAverage: 5,
    parkingCapacity: 82,
    activeAgents: 7,
    energy: 98,
    transport: 95,
  },
  aiState: {
    thinking: false,
    lastAnalysis: null,
    reasoningStream: [],
    confidence: 96,
  },
  eventLog: [],
  notifications: [],
  unreadNotifications: 0,
  triggerScenario: () => { },
  resetSimulation: () => { },
  addNotification: () => { },
  markNotificationRead: () => { },
  markAllNotificationsRead: () => { },
};

const SimulationContext = createContext<GlobalSimulationState>(defaultState);

// eslint-disable-next-line react-refresh/only-export-components
export function useSimulation() {
  return useContext(SimulationContext);
}

interface ProviderProps {
  children: ReactNode;
}

export function SimulationProvider({ children }: ProviderProps) {
  const [time, setTime] = useState(new Date());
  const [stadiumHealth, setStadiumHealth] = useState(94.2);
  const [crowdDensity, setCrowdDensity] = useState(68);
  const [activeScenario, setActiveScenario] = useState<SimulationScenario | null>(null);
  const [phase, setPhase] = useState<SystemPhase>('nominal');
  const [metrics, setMetrics] = useState(defaultState.metrics);
  const [aiState, setAiState] = useState(defaultState.aiState);
  const [eventLog, setEventLog] = useState<AtlasEvent[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const analysisRef = useRef(0);

  // Sync event log from bus
  useEffect(() => {
    const unsub = AtlasEventBus.onAll((event) => {
      setEventLog(prev => [event, ...prev].slice(0, 100));
    });
    return unsub;
  }, []);

  // ── Global Tick: Every 2 seconds ──
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());

      // Base fluctuation
      const healthFluctuation = (Math.random() - 0.5) * 0.5;
      const densityFluctuation = (Math.random() - 0.5) * 1.5;

      setStadiumHealth(prev => {
        let newHealth = prev + healthFluctuation;

        if (activeScenario) {
          if (activeScenario.id === 'heavy-rain') newHealth -= 0.5;
          else if (activeScenario.id === 'power-failure') newHealth -= 1.5;
          else if (activeScenario.severity === 'critical') newHealth -= 0.8;
        }

        // Recovery: health slowly climbs back when no scenario
        if (!activeScenario && phase === 'recovery') {
          newHealth += 0.8;
        }

        return Number(Math.max(10, Math.min(100, newHealth)).toFixed(1));
      });

      setCrowdDensity(prev => {
        let newDensity = prev + densityFluctuation;

        if (activeScenario) {
          if (activeScenario.id === 'heavy-rain') newDensity += 1.2;
          else if (activeScenario.severity === 'critical') newDensity += 0.5;
        }

        return Number(Math.max(0, Math.min(100, newDensity)).toFixed(1));
      });

      setMetrics(prev => {
        let newQueue = prev.queueAverage + (Math.random() - 0.5) * 0.5;
        let newParking = prev.parkingCapacity + (Math.random() - 0.5) * 0.8;
        let newEnergy = prev.energy + (Math.random() - 0.5) * 0.3;
        let newTransport = prev.transport + (Math.random() - 0.5) * 0.5;

        if (activeScenario) {
          if (activeScenario.id === 'heavy-rain') {
            newQueue += 0.8;
            newTransport -= 1.2;
          } else if (activeScenario.id === 'power-failure') {
            newQueue += 2.0;
            newEnergy -= 45.0; // Huge drop on power failure
          }
        }
        
        // Recover energy if in recovery phase
        if (!activeScenario && phase === 'recovery' && newEnergy < 95) {
          newEnergy += 2.0;
        }

        newQueue = Math.max(0, newQueue);
        newParking = Math.max(0, Math.min(100, newParking));
        newEnergy = Math.max(0, Math.min(100, newEnergy));
        newTransport = Math.max(0, Math.min(100, newTransport));

        return {
          ...prev,
          queueAverage: Number(newQueue.toFixed(1)),
          parkingCapacity: Number(newParking.toFixed(1)),
          energy: Number(newEnergy.toFixed(1)),
          transport: Number(newTransport.toFixed(1)),
          temperature: activeScenario?.id === 'heavy-rain'
            ? Number((prev.temperature - 0.05).toFixed(1))
            : prev.temperature,
          weather: activeScenario?.id === 'heavy-rain' ? 'Heavy Rain' : prev.weather,
        };
      });
    }, 1000); // 1-second tick

    return () => clearInterval(interval);
  }, [activeScenario, phase]);

  // ── Phase management ──
  useEffect(() => {
    if (activeScenario) {
      const severity = activeScenario.severity;
      const newPhase: SystemPhase = severity === 'critical' ? 'crisis' : 'alert';
      if (phase !== newPhase) {
        setPhase(newPhase);
        AtlasEventBus.emit('PHASE_CHANGED', 'SimulationContext', { phase: newPhase, scenario: activeScenario.name }, severity === 'critical' ? 'critical' : 'warning');
      }
    }
  }, [activeScenario, phase]);

  // ── AI Analysis on state change ──
  const stadiumHealthRounded = Math.round(stadiumHealth);
  const crowdDensityRounded = Math.round(crowdDensity);

  useEffect(() => {
    const runId = ++analysisRef.current;

    const runAnalysis = async () => {
      setAiState(prev => ({
        ...prev,
        thinking: true,
        reasoningStream: [],
      }));

      AtlasEventBus.emit('AI_THINKING_START', 'AIService', { scenario: activeScenario?.name || 'baseline' }, 'info');

      // Build the state object for the service
      const stateForAnalysis: GlobalSimulationState = {
        time,
        stadiumHealth,
        crowdDensity,
        activeScenario,
        phase,
        metrics,
        aiState: defaultState.aiState,
        eventLog: [],
        notifications: [],
        unreadNotifications: 0,
        triggerScenario: () => {},
        resetSimulation: () => {},
        addNotification: () => {},
        markNotificationRead: () => {},
        markAllNotificationsRead: () => {},
      };

      const result = await generateDynamicAnalysis(stateForAnalysis);

      if (runId !== analysisRef.current) return; // stale

      // Stream reasoning steps
      for (let i = 0; i < result.reasoning.length; i++) {
        if (runId !== analysisRef.current) return;
        await new Promise(r => setTimeout(r, 150));
        const step = result.reasoning[i];
        setAiState(prev => ({
          ...prev,
          reasoningStream: [...prev.reasoningStream, `[Step ${step.step}] ${step.input} → ${step.conclusion}`],
        }));
        AtlasEventBus.emit('AI_REASONING_STEP', 'AIService', { step: step.step, input: step.input, conclusion: step.conclusion }, 'info');
      }

      setAiState({
        thinking: false,
        lastAnalysis: result,
        reasoningStream: result.reasoning.map(r => `[Step ${r.step}] ${r.input} → ${r.conclusion}`),
        confidence: result.overallConfidence,
      });

      AtlasEventBus.emit('AI_ANALYSIS_COMPLETE', 'AIService', {
        risk: result.overallRisk,
        confidence: result.overallConfidence,
        predictions: result.predictions.length,
        recommendations: result.recommendations.length,
      }, result.overallRisk === 'critical' ? 'critical' : 'info');
    };

    // Debounce slightly
    const timer = setTimeout(runAnalysis, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeScenario, stadiumHealthRounded, crowdDensityRounded]);

  // ── Trigger Scenario ──
  const triggerScenario = useCallback((scenarioId: string) => {
    const scenario = scenarios.find((s) => s.id === scenarioId);
    if (!scenario) return;

    setActiveScenario(scenario);

    AtlasEventBus.emit('SCENARIO_TRIGGERED', 'Simulator', {
      scenarioId: scenario.id,
      scenarioName: scenario.name,
      severity: scenario.severity,
      affectedSystems: scenario.affectedSystems,
    }, scenario.severity === 'critical' ? 'critical' : 'warning');

    // Generate fan notification
    const notif: Notification = {
      id: `notif-${Date.now()}`,
      title: `⚠️ ${scenario.name} Alert`,
      message: `${scenario.description} Atlas AI is coordinating response.`,
      severity: scenario.severity === 'critical' ? 'critical' : 'warning',
      timestamp: new Date(),
      read: false,
      source: 'Atlas AI',
    };
    setNotifications(prev => [notif, ...prev]);

    AtlasEventBus.emit('FAN_NOTIFICATION', 'Simulator', {
      title: notif.title,
      message: notif.message,
      severity: notif.severity,
    }, notif.severity);

    // Emit timeline cascade events with delays
    scenario.timeline.forEach((evt, i) => {
      setTimeout(() => {
        AtlasEventBus.emit('TIMELINE_EVENT', 'Simulator', {
          time: evt.time,
          event: evt.event,
          severity: evt.severity,
          automated: evt.automated,
          scenarioName: scenario.name,
        }, evt.severity === 'critical' ? 'critical' : 'info');
      }, (i + 1) * 2000);
    });
  }, []);

  // ── Reset Simulation ──
  const resetSimulation = useCallback(() => {
    setPhase('recovery');

    AtlasEventBus.emit('RECOVERY_STARTED', 'SimulationContext', { previousScenario: activeScenario?.name }, 'info');

    // Recovery animation period
    setTimeout(() => {
      setActiveScenario(null);
      setStadiumHealth(94.2);
      setCrowdDensity(68);
      setMetrics({
        weather: 'Clear',
        temperature: 24,
        queueAverage: 5,
        parkingCapacity: 82,
        activeAgents: 7,
        energy: 98,
        transport: 95,
      });

      // Stay in recovery briefly to show green sweep
      setTimeout(() => {
        setPhase('nominal');
        AtlasEventBus.emit('RECOVERY_COMPLETE', 'SimulationContext', {}, 'info');
        AtlasEventBus.emit('PHASE_CHANGED', 'SimulationContext', { phase: 'nominal' }, 'info');
      }, 2000);
    }, 1500);
  }, [activeScenario]);

  // ── Notification helpers ──
  const addNotification = useCallback((notif: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const full: Notification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      timestamp: new Date(),
      read: false,
    };
    setNotifications(prev => [full, ...prev]);
    AtlasEventBus.emit('FAN_NOTIFICATION', notif.source, { title: notif.title, message: notif.message }, notif.severity);
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <SimulationContext.Provider
      value={{
        time,
        stadiumHealth,
        crowdDensity,
        activeScenario,
        phase,
        metrics,
        aiState,
        eventLog,
        notifications,
        unreadNotifications,
        triggerScenario,
        resetSimulation,
        addNotification,
        markNotificationRead,
        markAllNotificationsRead,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
}
