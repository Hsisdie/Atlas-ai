/* ═══════════════════════════════════════════════════════════
   AtlasOS — Scenario Simulator Page  (Milestone 5)
   Cinematic What-If simulator with 6 crisis scenarios.
   ═══════════════════════════════════════════════════════════ */

import { useState, useCallback } from 'react';
import {
  FlaskConical, CloudRain, TrainFront, ZapOff, Siren,
  ShieldAlert, Crown, AlertTriangle, Brain, RotateCcw,
  Clock, Zap,
} from 'lucide-react';
import Card from '../../components/shared/Card/Card';
import { scenarios } from '../../data/scenarioData';
import type { SimulationScenario, SimulationPhase } from '../../types';
import { useSimulation } from '../../context/SimulationContext';
import styles from './Simulator.module.css';

const iconMap: Record<string, React.ReactNode> = {
  CloudRain: <CloudRain />, TrainFront: <TrainFront />, ZapOff: <ZapOff />,
  Siren: <Siren />, ShieldAlert: <ShieldAlert />, Crown: <Crown />,
};

const iconColorMap: Record<string, { bg: string; fg: string }> = {
  'heavy-rain': { bg: 'hsla(200, 85%, 55%, 0.15)', fg: 'hsl(200, 85%, 55%)' },
  'metro-delay': { bg: 'hsla(38, 92%, 55%, 0.15)', fg: 'hsl(38, 92%, 55%)' },
  'power-failure': { bg: 'hsla(0, 72%, 58%, 0.15)', fg: 'hsl(0, 72%, 58%)' },
  'medical-emergency': { bg: 'hsla(0, 72%, 58%, 0.15)', fg: 'hsl(0, 72%, 58%)' },
  'gate-closure': { bg: 'hsla(38, 92%, 55%, 0.15)', fg: 'hsl(38, 92%, 55%)' },
  'vip-arrival': { bg: 'hsla(270, 60%, 58%, 0.15)', fg: 'hsl(270, 60%, 58%)' },
};

function Simulator() {
  const { triggerScenario, resetSimulation: globalReset, activeScenario: globalScenario } = useSimulation();
  
  // Local phase controls cinematic UI
  const [phase, setPhase] = useState<SimulationPhase>('idle');
  const [displayedResponse, setDisplayedResponse] = useState('');

  // Sync with global scenario
  const activeScenario = globalScenario;

  const activateScenario = useCallback(async (scenario: SimulationScenario) => {
    setPhase('activating');
    setDisplayedResponse('');

    // Cinematic activation delay
    await new Promise((r) => setTimeout(r, 2000));
    setPhase('active');
    
    // Trigger global state change
    triggerScenario(scenario.id);

    // Typewriter effect for AI response
    const text = scenario.aiResponse;
    for (let i = 0; i <= text.length; i++) {
      await new Promise((r) => setTimeout(r, 12));
      setDisplayedResponse(text.slice(0, i));
    }
  }, [triggerScenario]);

  const resetSimulation = useCallback(() => {
    setPhase('resolving');
    globalReset(); // Reset global context
    setTimeout(() => {
      setPhase('idle');
      setDisplayedResponse('');
    }, 1500); // Give time for recovery animation
  }, [globalReset]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'var(--color-danger)';
      case 'high': return 'var(--color-warning)';
      case 'medium': return 'var(--color-accent)';
      default: return 'var(--color-success)';
    }
  };

  return (
    <div className={styles.page}>
      {/* Hero Status Bar */}
      <div className={`${styles.heroBar} ${phase === 'active' ? (activeScenario?.severity === 'critical' ? styles.critical : styles.active) : ''}`}>
        <div className={styles.heroLeft}>
          <div className={`${styles.simBadge} ${phase !== 'idle' ? styles.active : styles.idle}`}>
            <FlaskConical />
            {phase === 'idle' ? 'Simulator Ready' : 'Simulation Active'}
          </div>
          <span className={styles.heroTitle}>
            {phase === 'idle' ? (
              <>Select a scenario to begin <strong>What-If Analysis</strong></>
            ) : (
              <>Active: <strong>{activeScenario?.name}</strong></>
            )}
          </span>
        </div>
        {phase === 'active' && (
          <button className={styles.resetBtn} onClick={resetSimulation} aria-label="Reset simulation to default state">
            <RotateCcw /> Reset Simulation
          </button>
        )}
      </div>

      {/* Activation Overlay */}
      {phase === 'activating' && activeScenario && (
        <div className={styles.activationOverlay}>
          <div className={styles.activationContent}>
            <div
              className={styles.activationIcon}
              style={{
                background: iconColorMap[activeScenario.id]?.bg,
                color: iconColorMap[activeScenario.id]?.fg,
              }}
            >
              {iconMap[activeScenario.icon]}
            </div>
            <div className={styles.activationTitle}>{activeScenario.name}</div>
            <div
              className={styles.activationStatus}
              style={{
                background: `${getSeverityColor(activeScenario.severity)}20`,
                color: getSeverityColor(activeScenario.severity),
              }}
            >
              <AlertTriangle size={16} /> SIMULATION ACTIVATING…
            </div>
          </div>
        </div>
      )}

      {/* Idle: Scenario Selection Grid */}
      {phase === 'idle' && (
        <div className={styles.scenarioGrid}>
          {scenarios.map((scenario) => (
            <div
              key={scenario.id}
              className={styles.scenarioCard}
              onClick={() => activateScenario(scenario)}
            >
              <div
                className={styles.scenarioIcon}
                style={{
                  background: iconColorMap[scenario.id]?.bg,
                  color: iconColorMap[scenario.id]?.fg,
                }}
              >
                {iconMap[scenario.icon]}
              </div>
              <div className={styles.scenarioName}>{scenario.name}</div>
              <div className={styles.scenarioDesc}>{scenario.description}</div>
              <div className={styles.scenarioMeta}>
                <span className={`${styles.severityTag} ${styles[scenario.severity]}`}>
                  {scenario.severity}
                </span>
                <span className={styles.systemCount}>
                  {scenario.affectedSystems.length} systems affected
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Active: Full Simulation View */}
      {phase === 'active' && activeScenario && (
        <div className={styles.simActive}>
          {/* Warning Banner */}
          <div className={styles.warningBanner}>
            <AlertTriangle />
            SIMULATION MODE — All data shown reflects projected impact of the "{activeScenario.name}" scenario. No real systems are affected.
          </div>

          {/* Effects Grid */}
          <div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Zap size={16} style={{ color: 'var(--color-accent)' }} /> Impact Analysis
            </div>
            <div className={styles.effectsGrid}>
              {activeScenario.effects.map((effect, i) => (
                <div
                  key={effect.metric}
                  className={styles.effectCard}
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className={styles.effectLabel}>{effect.metric}</div>
                  <div className={styles.effectValues}>
                    <span className={styles.effectBefore}>
                      {effect.currentValue}
                    </span>
                    <span className={styles.effectArrow}>→</span>
                    <span className={`${styles.effectAfter} ${styles[effect.impact]}`}>
                      {effect.simulatedValue}
                      <span className={styles.effectUnit}>{effect.unit}</span>
                    </span>
                  </div>
                  <div className={styles.effectDesc}>{effect.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Response Panel */}
          <Card variant="glass" padding="none" glow>
            <div className={styles.aiPanel}>
              <div className={styles.aiPanelHeader}>
                <div className={styles.aiPanelIcon}><Brain /></div>
                <div>
                  <div className={styles.aiPanelTitle}>Gemini Emergency Response Plan</div>
                  <div className={styles.aiPanelSubtitle}>
                    AI-generated response for {activeScenario.name} scenario
                  </div>
                </div>
              </div>
              <div className={styles.aiResponseText}>
                {displayedResponse}
                {displayedResponse.length < activeScenario.aiResponse.length && (
                  <span style={{ opacity: 0.5, animation: 'blink 1s infinite' }}>▊</span>
                )}
              </div>
            </div>
          </Card>

          {/* Event Timeline */}
          <Card variant="outlined" padding="md">
            <div className={styles.timelineSection}>
              <div className={styles.timelineTitle}>
                <Clock /> Cascade Timeline
              </div>
              <div className={styles.timelineList}>
                {activeScenario.timeline.map((evt, i) => (
                  <div
                    key={i}
                    className={styles.timelineEvent}
                    style={{ animationDelay: `${i * 120}ms` }}
                  >
                    <div
                      className={styles.timelineDot}
                      style={{ background: getSeverityColor(evt.severity) }}
                    />
                    <span className={styles.timelineTime}>{evt.time}</span>
                    <span className={styles.timelineDesc}>{evt.event}</span>
                    {evt.automated && (
                      <span className={styles.timelineAutoBadge}>Auto</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Reset */}
          <div className={styles.resetBar}>
            <button className={styles.resetBtn} onClick={resetSimulation} aria-label="Reset simulation to default state">
              <RotateCcw /> End Simulation & Reset to Baseline
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Simulator;
