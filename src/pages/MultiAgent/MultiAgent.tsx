/* ═══════════════════════════════════════════════════════════
   AtlasOS — Multi-Agent AI Page  (Milestone 6)
   Visual multi-agent reasoning system with coordinator.
   ═══════════════════════════════════════════════════════════ */

import { useState, useCallback, useEffect } from 'react';
import {
  Users, Play, Clock, Target, Brain,
  Users as CrowdIcon, Train, Shield, Accessibility,
  AlertTriangle, Cloud, Crown,
} from 'lucide-react';
import Card from '../../components/shared/Card/Card';
import { agents as initialAgents, coordinatorPlan } from '../../data/agentData';
import type { AgentAnalysis } from '../../types';
import styles from './MultiAgent.module.css';

const agentIconMap: Record<string, React.ReactNode> = {
  crowd: <CrowdIcon />, transport: <Train />, security: <Shield />,
  accessibility: <Accessibility />, emergency: <AlertTriangle />,
  weather: <Cloud />, coordinator: <Crown />,
};

import { useSimulation } from '../../context/SimulationContext';

function MultiAgent() {
  const { aiState } = useSimulation();
  const [agents, setAgents] = useState<AgentAnalysis[]>(initialAgents);
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);

  // Sync internal state with global AI state
  const isRunning = aiState.thinking;
  const showPlan = !aiState.thinking && aiState.lastAnalysis !== null;

  // React to global thinking state
  useEffect(() => {
    let mounted = true;

    if (isRunning) {
      // Set all agents to processing when global AI starts thinking
      setAgents(initialAgents.map((a) => ({ ...a, status: 'processing' as const })));
    } else if (aiState.lastAnalysis) {
      // Complete all agents when global AI finishes
      const resolveAgents = async () => {
        for (let i = 0; i < initialAgents.length; i++) {
          if (!mounted) return;
          await new Promise((r) => setTimeout(r, 100)); // Stagger completion slightly
          setAgents((prev) =>
            prev.map((a, j) =>
              j === i
                ? { ...a, status: 'complete' as const, lastUpdate: new Date(), processingTime: Math.round(150 + Math.random() * 400) }
                : a
            )
          );
        }
      };
      resolveAgents();
    } else {
      // Idle state
      setAgents(initialAgents.map((a) => ({ ...a, status: 'idle' as const })));
    }

    return () => { mounted = false; };
  }, [isRunning, aiState.lastAnalysis]);

  const runAnalysis = useCallback(() => {
    // In actual implementation, this would trigger global re-analysis.
    // For now, it's just a visual placeholder if clicked manually while not running.
  }, []);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'var(--color-danger)';
      case 'high': return 'var(--color-warning)';
      case 'moderate': return 'var(--color-accent)';
      default: return 'var(--color-success)';
    }
  };

  const allComplete = agents.every((a) => a.status === 'complete');

  return (
    <div className={styles.page}>
      {/* Status Bar */}
      <div className={styles.statusBar}>
        <div className={styles.statusLeft}>
          <div className={styles.agentBadge}>
            <Users /> Multi-Agent System
          </div>
          <span className={styles.agentCount}>
            <strong>{agents.filter((a) => a.status === 'complete').length}</strong> of {agents.length} agents {isRunning ? 'processing…' : allComplete ? 'complete' : 'ready'}
          </span>
        </div>
        <button className={styles.runBtn} onClick={runAnalysis} disabled={isRunning} aria-label="Run multi-agent analysis">
          {isRunning ? (
            <>
              <div style={{
                width: 16, height: 16,
                border: '2px solid hsla(0,0%,100%,0.3)',
                borderTopColor: 'white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }} />
              Running Analysis…
            </>
          ) : (
            <><Play /> Run All Agents</>
          )}
        </button>
      </div>

      {/* Agent Grid */}
      <div className={styles.agentGrid}>
        {agents.filter((a) => a.agentId !== 'coordinator').map((agent) => (
          <div
            key={agent.agentId}
            className={`${styles.agentCard} ${styles[agent.status]}`}
            style={{ '--glow-color': agent.color } as React.CSSProperties}
            onClick={() => setExpandedAgent(expandedAgent === agent.agentId ? null : agent.agentId)}
          >
            <div className={styles.agentHeader}>
              <div className={styles.agentIdentity}>
                <div
                  className={styles.agentAvatar}
                  style={{ background: `${agent.color}15`, color: agent.color }}
                >
                  {agentIconMap[agent.agentId]}
                </div>
                <div>
                  <div className={styles.agentName}>{agent.agentName}</div>
                  <div className={styles.agentRole}>{agent.role}</div>
                </div>
              </div>
              <div className={styles.agentStatus}>
                <div className={`${styles.statusIndicator} ${styles[agent.status]}`} />
                <span className={styles.statusLabel}>{agent.status}</span>
              </div>
            </div>

            {/* Insights (shown when complete and expanded) */}
            {agent.status === 'complete' && expandedAgent === agent.agentId && (
              <div className={styles.insightList}>
                {agent.insights.map((insight) => (
                  <div
                    key={insight.id}
                    className={styles.insightItem}
                    style={{ '--insight-color': agent.color } as React.CSSProperties}
                  >
                    <div className={styles.insightTitle}>{insight.title}</div>
                    <div className={styles.insightDesc}>{insight.description}</div>
                    <div className={styles.dataPoints}>
                      {insight.dataPoints.map((dp, i) => (
                        <span key={i} className={styles.dataPoint}>{dp}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Agent Meta */}
            {agent.status === 'complete' && (
              <div className={styles.agentMeta}>
                <span className={styles.agentMetaItem}>
                  <Target size={12} />
                  {agent.confidence}% confidence
                </span>
                <span className={styles.agentMetaItem} style={{ color: getRiskColor(agent.riskLevel) }}>
                  {agent.riskLevel} risk
                </span>
                <span className={styles.agentMetaItem}>
                  <Clock size={12} />
                  {agent.processingTime}ms
                </span>
                <div className={styles.confidenceBar}>
                  <div
                    className={styles.confidenceFill}
                    style={{
                      width: `${agent.confidence}%`,
                      background: agent.color,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Flow Visualization */}
      {allComplete && (
        <div className={styles.flowSection}>
          <div className={styles.flowArrows}>
            <div className={styles.flowDot} />
            <div className={styles.flowLine} />
            <div className={styles.flowDot} />
            <div className={styles.flowLine} />
            <span className={styles.flowLabel}>Agent Insights → Coordinator Synthesis</span>
            <div className={styles.flowLine} />
            <div className={styles.flowDot} />
            <div className={styles.flowLine} />
            <div className={styles.flowDot} />
          </div>
        </div>
      )}

      {/* Coordinator Plan */}
      {showPlan && (
        <div className={styles.planSection}>
          <Card variant="glass" padding="lg" glow>
            <div className={styles.planHeader}>
              <div className={styles.planTitle}>
                <Brain /> {coordinatorPlan.title}
              </div>
              <div className={styles.consensusBadge}>
                {coordinatorPlan.consensusLevel}% Consensus
              </div>
            </div>

            <div className={styles.planSummary}>
              {coordinatorPlan.summary}
            </div>

            <div className={styles.planActions}>
              {coordinatorPlan.actions.map((action, i) => (
                <div key={action.id} className={styles.planAction}>
                  <div className={styles.actionNumber}>{i + 1}</div>
                  <div className={styles.actionContent}>
                    <div className={styles.actionTitle}>{action.action}</div>
                    <div className={styles.actionReasoning}>{action.reasoning}</div>
                    <div className={styles.actionAgents}>
                      {action.sourceAgents.map((agent) => (
                        <span key={agent} className={styles.sourceAgent}>{agent}</span>
                      ))}
                    </div>
                  </div>
                  <span className={`${styles.actionPriority} ${styles[action.priority]}`}>
                    {action.priority}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default MultiAgent;
