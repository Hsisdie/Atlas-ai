import { BellRing, Check, ShieldAlert } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Card from '../../shared/Card/Card';
import Button from '../../shared/Button/Button';
import StatusBadge from '../../shared/StatusBadge/StatusBadge';
import { timeAgo } from '../../../data/mockData';
import { useSimulation } from '../../../context/SimulationContext';
import styles from './LiveAlerts.module.css';

function LiveAlerts() {
  const { notifications, markNotificationRead } = useSimulation();

  const activeAlerts = notifications.filter((a) => !a.read);

  return (
    <Card
      variant="default"
      padding="md"
      header={{
        title: 'Active Alerts',
        subtitle: `${activeAlerts.length} urgent issues`,
        icon: <BellRing />,
        actions: (
          <StatusBadge
            status={activeAlerts.length > 0 ? 'warning' : 'operational'}
            label={activeAlerts.length > 0 ? `${activeAlerts.length} Alerts` : 'Nominal'}
          />
        ),
      }}
    >
      <div className={styles.content}>
        <AnimatePresence initial={false}>
          {notifications.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-tertiary)' }}
            >
              No active alerts. All systems nominal.
            </motion.div>
          )}

          {notifications.map((alert) => {
            const priorityClass = styles[alert.severity];
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, height: 0, margin: 0, padding: 0 }}
                className={`${styles.alertItem} ${priorityClass} ${
                  !alert.read ? styles.unacknowledged : ''
                }`}
              >
                <div className={styles.alertHeader}>
                  <div className={styles.alertTitleRow}>
                    <ShieldAlert size={14} />
                    <span className={styles.alertTitle}>{alert.title}</span>
                  </div>
                  <span className={styles.alertTime}>{timeAgo(alert.timestamp)}</span>
                </div>
                <p className={styles.alertDesc}>{alert.message}</p>
                <div className={styles.alertFooter}>
                  <span className={styles.alertZone}>{alert.source}</span>
                  {!alert.read ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      leftIcon={<Check size={12} />}
                      onClick={() => markNotificationRead(alert.id)}
                    >
                      Acknowledge
                    </Button>
                  ) : (
                    <span style={{ fontSize: 'var(--text-micro)', color: 'var(--color-text-tertiary)' }}>
                      Acknowledged
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </Card>
  );
}

export default LiveAlerts;
