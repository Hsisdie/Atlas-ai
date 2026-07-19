/* ═══════════════════════════════════════════════════════════
   AtlasOS — AI Decision Engine Page
   Explainable AI: Input → Processing → Predictions → Actions
   ═══════════════════════════════════════════════════════════ */

import { useState } from 'react';
import {
  Brain, CheckCircle2,
  AlertTriangle, Zap, Shield,
  Cpu, Users, Cloud, ParkingCircle, Train,
  HeartPulse, Accessibility, Clock, MapPin, Target, Lightbulb,
} from 'lucide-react';
import Card from '../../components/shared/Card/Card';
import { useSimulation } from '../../context/SimulationContext';
import { inputCategories } from '../../data/aiEngineData';
import styles from './AIEngine.module.css';

const iconMap: Record<string, React.ReactNode> = {
  Users: <Users />, Cloud: <Cloud />, ParkingCircle: <ParkingCircle />,
  Train: <Train />, HeartPulse: <HeartPulse />, Accessibility: <Accessibility />,
  Shield: <Shield />,
};

export default function AIEngine() {
  const state = useSimulation();
  const { aiState } = state;
  const { thinking: isProcessing, lastAnalysis: result } = aiState;
  const [expandedPrediction, setExpandedPrediction] = useState<string | null>(null);

  // Use aiState.reasoningStream to determine the current processing step for the UI
  const processingStep = aiState.reasoningStream.length;

  const processingSteps = [
    'Collecting sensor data…',
    'Analyzing crowd patterns…',
    'Running predictive models…',
    'Evaluating risk scenarios…',
    'Generating recommendations…',
    'Building reasoning trace…',
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'var(--color-danger)';
      case 'high': return 'var(--color-warning)';
      case 'moderate': return 'var(--color-accent)';
      default: return 'var(--color-success)';
    }
  };

  const getSeverityColor = (severity: string) => getRiskColor(severity);

  return (
    <div className={styles.page}>
      {/* Status Bar */}
      <div className={styles.statusBar}>
        <div className={styles.statusLeft}>
          <div className={styles.engineBadge}>
            <Cpu /> AI Decision Engine
          </div>
          <div className={`${styles.statusDot} ${isProcessing ? styles.processing : ''}`} />
          <span className={styles.statusText}>
            {isProcessing ? 'Re-evaluating stadium state…' : result ? 'Continuous Analysis Active' : 'Ready'}
          </span>
        </div>
        <div className={styles.statusRight}>
          <span className={styles.modelTag}>Gemini 2.5 Pro (Live Stream)</span>
          {result && (
            <span className={styles.processTime}>
              Latency: {result.processingTime}ms
            </span>
          )}
        </div>
      </div>

      {/* Main Layout: Input Panel + Output Panel */}
      <div className={styles.mainGrid}>
        {/* Left: Input Data Feeds */}
        <div className={styles.inputPanel}>
          <div className={styles.sectionTitle}>
            <Zap /> Live Data Feeds
          </div>
          {inputCategories.map((cat, i) => (
            <div
              key={cat.key}
              className={`${styles.inputCard} ${isProcessing && processingStep > i ? styles.active : ''}`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div
                className={styles.inputIcon}
                style={{ background: `${cat.color}15`, color: cat.color }}
              >
                {iconMap[cat.icon]}
              </div>
              <div className={styles.inputInfo}>
                <div className={styles.inputLabel}>{cat.label}</div>
                <div className={styles.inputValue}>{cat.value} · {cat.sublabel}</div>
              </div>
              <div className={styles.inputPulse} />
            </div>
          ))}
        </div>

        {/* Right: Output Panel */}
        <div className={styles.outputPanel}>
          
          {/* Processing Animation */}
          {isProcessing && (
            <Card variant="glass" padding="none">
              <div className={styles.processingOverlay}>
                <div className={styles.processingSpinner} />
                <div className={styles.processingText}>AI analyzing new stadium state…</div>
                <div className={styles.processingSteps}>
                  {processingSteps.map((step, i) => (
                    <div
                      key={i}
                      className={`${styles.processingStep} ${processingStep > i ? styles.done : ''}`}
                      style={{
                        animationDelay: `${i * 100}ms`,
                        opacity: processingStep > i ? 1 : undefined,
                      }}
                    >
                      {processingStep > i ? <CheckCircle2 /> : <Clock />}
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Results */}
          {!isProcessing && result && (
            <>
              {/* Risk Overview */}
              <Card variant="glass" padding="none" glow>
                <div className={styles.riskOverview}>
                  <div className={styles.riskGauge}>
                    <svg viewBox="0 0 100 100">
                      <circle className={styles.riskGaugeTrack} cx="50" cy="50" r="42" />
                      <circle
                        className={styles.riskGaugeProgress}
                        cx="50" cy="50" r="42"
                        stroke={getRiskColor(result.overallRisk)}
                        strokeDasharray={2 * Math.PI * 42}
                        strokeDashoffset={2 * Math.PI * 42 * (1 - result.overallConfidence / 100)}
                      />
                    </svg>
                    <div className={styles.riskCenter}>
                      <span className={styles.riskValue} style={{ color: getRiskColor(result.overallRisk) }}>
                        {result.overallConfidence}%
                      </span>
                      <span className={styles.riskLabel}>Confidence</span>
                    </div>
                  </div>
                  <div className={styles.riskMeta}>
                    <div className={styles.riskMetaItem}>
                      <div className={styles.riskMetaDot} style={{ background: getRiskColor(result.overallRisk) }} />
                      Overall Risk: <strong style={{ color: getRiskColor(result.overallRisk), textTransform: 'capitalize' }}>{result.overallRisk}</strong>
                    </div>
                    <div className={styles.riskMetaItem}>
                      <AlertTriangle /> {result.predictions.length} predicted issues identified
                    </div>
                    <div className={styles.riskMetaItem}>
                      <Lightbulb /> {result.recommendations.length} recommended actions
                    </div>
                    <div className={styles.riskMetaItem}>
                      <Clock /> Processed in {result.processingTime}ms
                    </div>
                  </div>
                </div>
              </Card>

              {/* Predictions + Recommendations Grid */}
              <div className={styles.resultsGrid}>
                {/* Predictions */}
                <div className={styles.predictionsSection}>
                  <div className={styles.sectionHeader}>
                    <div className={styles.sectionTitle}>
                      <AlertTriangle /> Predicted Problems
                    </div>
                    <span className={styles.sectionCount}>{result.predictions.length}</span>
                  </div>
                  <div className={styles.predictionList}>
                    {result.predictions.map((pred, i) => (
                      <div
                        key={pred.id}
                        className={`${styles.predictionCard} ${styles[pred.severity]}`}
                        style={{ animationDelay: `${i * 100}ms` }}
                        onClick={() => setExpandedPrediction(expandedPrediction === pred.id ? null : pred.id)}
                      >
                        <div className={styles.predictionHeader}>
                          <span className={styles.predictionTitle}>{pred.problem}</span>
                          <span className={styles.confidenceBadge}>
                            <Target size={10} /> {pred.confidence}%
                          </span>
                        </div>
                        <p className={styles.predictionDesc}>{pred.description}</p>
                        <div className={styles.predictionMeta}>
                          <span className={styles.metaTag}>
                            <Clock /> {pred.timeframe}
                          </span>
                          <span className={styles.metaTag}>
                            <MapPin /> {pred.affectedZones.length} zones
                          </span>
                          <span
                            className={styles.metaTag}
                            style={{ color: getSeverityColor(pred.severity) }}
                          >
                            {pred.severity.toUpperCase()}
                          </span>
                        </div>
                        {expandedPrediction === pred.id && (
                          <div className={styles.indicatorList}>
                            {pred.indicators.map((ind, j) => (
                              <span key={j} className={styles.indicator}>{ind}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div className={styles.recommendationsSection}>
                  <div className={styles.sectionHeader}>
                    <div className={styles.sectionTitle}>
                      <Lightbulb /> Recommended Actions
                    </div>
                    <span className={styles.sectionCount}>{result.recommendations.length}</span>
                  </div>
                  <div className={styles.actionList}>
                    {result.recommendations.map((action, i) => (
                      <div
                        key={action.id}
                        className={styles.actionCard}
                        style={{ animationDelay: `${i * 80}ms` }}
                      >
                        <div className={styles.actionHeader}>
                          <span className={styles.actionTitle}>{action.action}</span>
                          <span className={`${styles.priorityBadge} ${styles[action.priority]}`}>
                            {action.priority}
                          </span>
                        </div>
                        <p className={styles.actionReasoning}>{action.reasoning}</p>
                        <div className={styles.actionFooter}>
                          <span className={styles.actionAgent}>
                            <Users size={12} /> {action.assignedTo}
                          </span>
                          <span className={styles.actionImpact}>{action.estimatedImpact}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reasoning Trace */}
              <div className={styles.reasoningSection}>
                <div className={styles.sectionHeader}>
                  <div className={styles.sectionTitle}>
                    <Brain /> Reasoning Trace
                  </div>
                  <span className={styles.sectionCount}>{result.reasoning.length} steps</span>
                </div>
                <Card variant="outlined" padding="md">
                  <div className={styles.reasoningList}>
                    {result.reasoning.map((step) => (
                      <div key={step.step} className={styles.reasoningStep}>
                        <div className={styles.stepNumber}>{step.step}</div>
                        <div className={styles.stepContent}>
                          <div className={styles.stepInput}>{step.input}</div>
                          <p className={styles.stepAnalysis}>{step.analysis}</p>
                          <div className={styles.stepConclusion}>{step.conclusion}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
