import { useState, useEffect } from 'react';
import { Brain, ShieldAlert, ChevronRight, ChevronLeft, Loader, Zap, Clock, TrendingDown, Check } from 'lucide-react';
import Card from '../../shared/Card/Card';
import Button from '../../shared/Button/Button';
import { useSimulation } from '../../../context/SimulationContext';
import { generateDynamicAnalysis } from '../../../services/aiService';
import type { AIAnalysisResult } from '../../../types';
import styles from './AIRecommendationCard.module.css';

export default function AIRecommendationCard() {
  const state = useSimulation();
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [completedActions, setCompletedActions] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    generateDynamicAnalysis(state).then(res => {
      if (mounted) {
        setAnalysis(res);
        setActiveIndex(0); // reset index on new stream
        setLoading(false);
      }
    });
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.crowdDensity, state.stadiumHealth, state.activeScenario]);

  if (loading || !analysis) {
    return (
      <Card variant="glass" header={{ title: 'AI Recommendations', icon: <Brain /> }}>
        <div className={styles.emptyState}>
          <Loader className="spin" />
          <span>Synthesizing Strategy...</span>
        </div>
      </Card>
    );
  }

  const recommendation = analysis.recommendations[activeIndex];

  if (!recommendation) {
    return (
      <Card variant="glass" header={{ title: 'AI Recommendations', icon: <Brain /> }}>
        <div className={styles.emptyState}>
          <Brain />
          <span>No recommendations currently active</span>
        </div>
      </Card>
    );
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % analysis.recommendations.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + analysis.recommendations.length) % analysis.recommendations.length);
  };

  const handleToggleAction = () => {
    const key = `${recommendation.id}`;
    setCompletedActions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isCompleted = !!completedActions[recommendation.id];

  // Parse expected impact to display nicely
  const parts = recommendation.estimatedImpact.split('|');
  const impactText = parts[0]?.trim() || recommendation.estimatedImpact;
  const recoveryText = parts[1]?.replace('Recovery', '')?.trim() || 'N/A';

  return (
    <Card
      variant="glass"
      glow={recommendation.priority === 'critical'}
      header={{
        title: 'Recommended Strategy',
        subtitle: `Confidence ${analysis.overallConfidence}%`,
        icon: <Brain />,
        actions: (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Button size="sm" variant="ghost" iconOnly onClick={handlePrev} disabled={analysis.recommendations.length <= 1}>
              <ChevronLeft size={16} />
            </Button>
            <span style={{ fontSize: 'var(--text-micro)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>
              {activeIndex + 1}/{analysis.recommendations.length}
            </span>
            <Button size="sm" variant="ghost" iconOnly onClick={handleNext} disabled={analysis.recommendations.length <= 1}>
              <ChevronRight size={16} />
            </Button>
          </div>
        ),
      }}
    >
      <div className={styles.content}>
        <div className={styles.recHeader}>
          <div>
            <h3 className={styles.recTitle}>{recommendation.action}</h3>
          </div>
          <div className={styles.badgeRow}>
            <span className={`${styles.confidenceBadge} ${recommendation.priority === 'critical' ? styles.criticalBadge : ''}`}>
              <ShieldAlert size={12} />
              {recommendation.priority} Risk
            </span>
          </div>
        </div>

        <div className={styles.actionSection}>
          <span className={styles.actionTitle}>Recommended In-App Action</span>
          <div className={styles.actionList}>
            <div className={styles.actionItem}>
              <button
                className={`${styles.checkboxContainer} ${isCompleted ? styles.completed : ''}`}
                onClick={handleToggleAction}
                aria-label={`Mark as ${isCompleted ? 'incomplete' : 'complete'}`}
              >
                <Check />
              </button>
              <span className={`${styles.actionText} ${isCompleted ? styles.completed : ''}`}>
                Execute {recommendation.action}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.actionSection}>
          <span className={styles.actionTitle}>Reasoning</span>
          <p className={styles.reasoning}>"{recommendation.reasoning}"</p>
        </div>

        <div className={styles.gridStats}>
          <div className={styles.statItem}>
             <div style={{display:'flex', alignItems:'center', gap:'4px'}}>
               <TrendingDown size={14} color="var(--color-accent)"/>
               <span className={styles.statLabel}>Expected Impact</span>
             </div>
             <span className={styles.statValue}>{impactText}</span>
          </div>
          <div className={styles.statItem}>
             <div style={{display:'flex', alignItems:'center', gap:'4px'}}>
               <Clock size={14} color="var(--color-success)"/>
               <span className={styles.statLabel}>Est. Recovery</span>
             </div>
             <span className={styles.statValue}>{recoveryText}</span>
          </div>
        </div>

        <div className={styles.actionSection}>
          <div className={styles.agentTags}>
            <span className={styles.statLabel} style={{marginRight: '8px', alignSelf: 'center'}}>Assigned To</span>
            <span className={styles.agentTag}>{recommendation.assignedTo}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
          <Button variant="primary" fullWidth leftIcon={<Zap size={16} />}>
            Execute Strategy
          </Button>
        </div>
      </div>
    </Card>
  );
}
