/* ═══════════════════════════════════════════════════════════
   Atlas Event Bus
   Centralized pub/sub system connecting all modules.
   When anything happens, everything reacts.
   ═══════════════════════════════════════════════════════════ */

export type AtlasEventType =
  | 'SCENARIO_TRIGGERED'
  | 'SCENARIO_RESET'
  | 'AI_ANALYSIS_COMPLETE'
  | 'AI_THINKING_START'
  | 'AI_REASONING_STEP'
  | 'HEALTH_CHANGED'
  | 'AGENT_PROCESSING'
  | 'AGENT_COMPLETE'
  | 'AGENT_INSIGHT'
  | 'FAN_NOTIFICATION'
  | 'PHASE_CHANGED'
  | 'RECOVERY_STARTED'
  | 'RECOVERY_COMPLETE'
  | 'ALERT_TRIGGERED'
  | 'METRIC_UPDATE'
  | 'TIMELINE_EVENT';

export interface AtlasEvent {
  id: string;
  type: AtlasEventType;
  timestamp: Date;
  source: string;
  payload: Record<string, unknown>;
  severity?: 'info' | 'warning' | 'critical';
}

export type AtlasEventHandler = (event: AtlasEvent) => void;

class AtlasEventBusImpl {
  private listeners = new Map<AtlasEventType, Set<AtlasEventHandler>>();
  private globalListeners = new Set<AtlasEventHandler>();
  private eventLog: AtlasEvent[] = [];
  private maxLogSize = 200;

  on(type: AtlasEventType, handler: AtlasEventHandler): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(handler);
    return () => this.listeners.get(type)?.delete(handler);
  }

  onAll(handler: AtlasEventHandler): () => void {
    this.globalListeners.add(handler);
    return () => this.globalListeners.delete(handler);
  }

  emit(type: AtlasEventType, source: string, payload: Record<string, unknown> = {}, severity?: 'info' | 'warning' | 'critical') {
    const event: AtlasEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type,
      timestamp: new Date(),
      source,
      payload,
      severity,
    };

    this.eventLog.unshift(event);
    if (this.eventLog.length > this.maxLogSize) {
      this.eventLog = this.eventLog.slice(0, this.maxLogSize);
    }

    // Notify type-specific listeners
    this.listeners.get(type)?.forEach(handler => {
      try { handler(event); } catch (e) { console.error('[AtlasEventBus] Handler error:', e); }
    });

    // Notify global listeners
    this.globalListeners.forEach(handler => {
      try { handler(event); } catch (e) { console.error('[AtlasEventBus] Global handler error:', e); }
    });
  }

  getLog(): AtlasEvent[] {
    return this.eventLog;
  }

  getRecentEvents(count: number = 20): AtlasEvent[] {
    return this.eventLog.slice(0, count);
  }

  clear() {
    this.eventLog = [];
  }
}

// Singleton
export const AtlasEventBus = new AtlasEventBusImpl();
