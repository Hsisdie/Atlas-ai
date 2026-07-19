import { History } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Card from '../../shared/Card/Card';
import { timeAgo } from '../../../data/mockData';
import { useSimulation } from '../../../context/SimulationContext';
import styles from './ActivityTimeline.module.css';

function ActivityTimeline() {
  const { eventLog } = useSimulation();

  return (
    <Card
      variant="default"
      padding="md"
      header={{
        title: 'Activity Log',
        subtitle: 'Real-time operations event-stream',
        icon: <History />,
      }}
    >
      <div className={styles.content}>
        <div className={styles.timeline}>
          <AnimatePresence initial={false}>
            {eventLog.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={styles.emptyState}
                style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-tertiary)' }}
              >
                Waiting for system events...
              </motion.div>
            )}
            
            {eventLog.map((event, idx) => {
              // Convert severity/type to style key for colors
              let typeClass = 'info';
              if (event.severity === 'critical') typeClass = 'critical';
              else if (event.severity === 'warning') typeClass = 'warning';
              else if (event.type === 'RECOVERY_COMPLETE') typeClass = 'success';

              let title = event.type.replace(/_/g, ' ');
              let desc = JSON.stringify(event.payload).replace(/[{""}]/g, '').substring(0, 100);
              
              if (event.type === 'TIMELINE_EVENT') {
                title = String(event.payload.event);
                desc = '';
              } else if (event.type === 'SCENARIO_TRIGGERED') {
                title = `Scenario Active: ${event.payload.scenarioName}`;
                desc = `Affected: ${Array.isArray(event.payload.affectedSystems) ? event.payload.affectedSystems.join(', ') : 'Unknown'}`;
              } else if (event.type === 'AI_ANALYSIS_COMPLETE') {
                title = 'Atlas AI Strategy Updated';
                desc = `Confidence: ${event.payload.confidence}% | Predictions: ${event.payload.predictions}`;
                typeClass = 'info';
              }

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`${styles.timelineItem} ${styles[typeClass]}`}
                >
                  <div className={`${styles.timelineNode} ${idx === 0 ? styles.active : ''}`}>
                    <span className={styles.timelineNodeDot} />
                  </div>
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineHeader}>
                      <span className={styles.timelineTitle}>{title}</span>
                      <span className={styles.timelineTime}>{timeAgo(event.timestamp)}</span>
                    </div>
                    {desc && <p className={styles.timelineDesc}>{desc}</p>}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </Card>
  );
}

export default ActivityTimeline;
