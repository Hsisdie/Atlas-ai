/* ═══════════════════════════════════════════════════════════
   AtlasOS — Atlas Brain Page
   The signature piece: visualizing the AI's internal state.
   ═══════════════════════════════════════════════════════════ */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Activity, Shield, Users, Cloud, Network,
  Target, GitMerge, BarChart2,
} from 'lucide-react';
import Card from '../../components/shared/Card/Card';
import StatusBadge from '../../components/shared/StatusBadge/StatusBadge';
import { useSimulation } from '../../context/SimulationContext';
import { generateDynamicAnalysis } from '../../services/aiService';
import type { AIAnalysisResult } from '../../types';
import styles from './AtlasBrain.module.css';

export default function AtlasBrain() {
  const state = useSimulation();
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [thinking, setThinking] = useState(true);

  // Dynamic fetch loop for the brain
  useEffect(() => {
    let mounted = true;
    setThinking(true);

    generateDynamicAnalysis(state).then(res => {
      if (mounted) {
        setAnalysis(res);
        setThinking(false);
      }
    });

    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.activeScenario, state.crowdDensity, state.stadiumHealth]);

  const currentObjective = state.activeScenario
    ? `Mitigate impact of ${state.activeScenario.name}`
    : 'Maintain nominal stadium operations and safety';

  return (
    <div className={styles.page}>

      {/* Top Header Section */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.brainIconWrapper}>
            <Brain size={32} className={thinking ? styles.pulsing : ''} />
          </div>
          <div>
            <h1 className={styles.title}>Atlas Core Engine</h1>
            <div className={styles.subtitle}>
              <span className={styles.modelName}>{analysis?.modelVersion || 'Gemini 3.1 Pro (High)'}</span>
              <span className={styles.separator}>•</span>
              <span className={styles.statusIndicator}>
                <span className={`${styles.dot} ${thinking ? styles.thinking : styles.ready}`} />
                {thinking ? 'Synthesizing Live Data...' : 'Consensus Reached'}
              </span>
            </div>
          </div>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.objectiveCard}>
            <div className={styles.objectiveLabel}>Current Objective</div>
            <div className={styles.objectiveValue}>{currentObjective}</div>
          </div>
        </div>
      </div>

      <div className={styles.mainGrid}>

        {/* Left Column: Collaboration & Reasoning */}
        <div className={styles.leftCol}>

          {/* Multi-Agent Collaboration Matrix */}
          <Card variant="glass" className={styles.agentMatrix}>
            <h2 className={styles.sectionTitle}><Network size={18} /> Sub-Agent Collaboration</h2>
            <div className={styles.agentGrid}>
              {[
                { name: 'Crowd', icon: Users, status: state.activeScenario ? 'Processing' : 'Active Sync', conf: state.activeScenario ? 92 : 98 },
                { name: 'Transport', icon: Activity, status: state.activeScenario?.id === 'heavy-rain' ? 'Rerouting' : 'Processing', conf: 88 },
                { name: 'Security', icon: Shield, status: 'Active Sync', conf: 99 },
                { name: 'Weather', icon: Cloud, status: state.activeScenario?.id === 'heavy-rain' ? 'Active Alert' : 'Idle', conf: 100 },
              ].map(agent => (
                <div key={agent.name} className={styles.agentNode}>
                  <div className={styles.agentIcon}><agent.icon size={16} /></div>
                  <div className={styles.agentInfo}>
                    <span className={styles.agentName}>{agent.name}</span>
                    <span className={styles.agentStatus}>{agent.status}</span>
                  </div>
                  <div className={styles.agentConf}>{agent.conf}%</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Live Reasoning Trace */}
          <Card variant="glass" className={styles.reasoningTrace}>
            <h2 className={styles.sectionTitle}><GitMerge size={18} /> Live Reasoning</h2>
            <div className={styles.traceStream}>
              <AnimatePresence mode="popLayout">
                {analysis?.reasoning.map((step, idx) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={styles.traceItem}
                  >
                    <div className={styles.traceLine} />
                    <div className={styles.traceContent}>
                      <span className={styles.traceInput}>INPUT: {step.input}</span>
                      <span className={styles.traceLogic}>{step.analysis}</span>
                      <span className={styles.traceConclusion}>OUT: {step.conclusion}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {thinking && (
                <div className={styles.thinkingShimmer}>Generating next inference step...</div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Decisions & Outcomes */}
        <div className={styles.rightCol}>

          {/* Core Decision Queue */}
          <Card variant="glass" glow={!!state.activeScenario} className={styles.decisionQueue}>
            <div className={styles.decisionHeader}>
              <h2 className={styles.sectionTitle}><Target size={18} /> Recommended Strategy</h2>
              {analysis && (
                <div className={styles.confidenceScore}>
                  Confidence <strong>{analysis.overallConfidence}%</strong>
                </div>
              )}
            </div>

            {analysis?.recommendations.map(rec => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={styles.primaryDecision}
              >
                <div className={styles.decisionTitleRow}>
                  <h3>{rec.action}</h3>
                  <StatusBadge status={rec.priority === 'critical' ? 'critical' : 'info'} label={rec.priority.toUpperCase()} />
                </div>
                <div className={styles.decisionWhy}>
                  <strong>Why:</strong> {rec.reasoning}
                </div>
                <div className={styles.decisionOutcome}>
                  <strong>Expected Impact:</strong> {rec.estimatedImpact}
                </div>
              </motion.div>
            ))}
          </Card>

          {/* Future Projection Mini-Timeline */}
          <Card variant="glass" className={styles.futureProjection}>
            <h2 className={styles.sectionTitle}><BarChart2 size={18} /> Predicted Outcomes</h2>
            <div className={styles.timeline}>
              <div className={styles.timelineNode}>
                <div className={styles.timeLabel}>NOW</div>
                <div className={styles.timelineMetric}>Action Applied</div>
              </div>
              <div className={styles.timelineEdge} />
              <div className={styles.timelineNode}>
                <div className={styles.timeLabel}>+5m</div>
                <div className={styles.timelineMetric}>Density -12%</div>
              </div>
              <div className={styles.timelineEdge} />
              <div className={styles.timelineNode}>
                <div className={styles.timeLabel}>+15m</div>
                <div className={styles.timelineMetric}>Stabilized</div>
              </div>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}
