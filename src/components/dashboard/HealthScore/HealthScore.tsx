import { useMemo } from 'react';
import { Shield } from 'lucide-react';
import Card from '../../shared/Card/Card';
import StatusBadge from '../../shared/StatusBadge/StatusBadge';
import AnimatedNumber from '../../shared/AnimatedNumber/AnimatedNumber';
import { useSimulation } from '../../../context/SimulationContext';
import { stadiumConfig, formatNumber } from '../../../data/mockData';
import styles from './HealthScore.module.css';

function HealthScore() {
  const { stadiumHealth, phase } = useSimulation();
  const { eventName, eventTime, matchMinute, currentAttendance, capacity } = stadiumConfig;

  // Compute status badge based on phase
  const overallStatus = useMemo(() => {
    if (phase === 'crisis') return 'critical';
    if (phase === 'alert') return 'warning';
    return 'operational';
  }, [phase]);

  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const progress = (stadiumHealth / 100) * circumference;
  const dashOffset = circumference - progress;

  const scoreColor = useMemo(() => {
    if (stadiumHealth >= 90) return 'var(--color-success)';
    if (stadiumHealth >= 70) return 'var(--color-warning)';
    return 'var(--color-danger)';
  }, [stadiumHealth]);

  return (
    <Card
      variant="elevated"
      padding="lg"
      glow
      header={{
        title: 'Stadium Health',
        subtitle: 'Real-time operational score',
        icon: <Shield />,
        actions: <StatusBadge status={overallStatus} />,
      }}
      className={styles.card}
    >
      <div className={styles.content}>
        {/* Radial Gauge */}
        <div className={styles.gaugeContainer}>
          <svg className={styles.gaugeSvg} viewBox="0 0 140 140">
            <circle className={styles.gaugeTrack} cx="70" cy="70" r={radius} />
            <circle
              className={styles.gaugeProgress}
              cx="70"
              cy="70"
              r={radius}
              stroke={scoreColor}
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
            />
          </svg>
          <div className={styles.gaugeCenter}>
            <AnimatedNumber
              value={stadiumHealth}
              decimals={1}
              className={styles.gaugeValue}
              style={{ color: scoreColor }}
            />
            <span className={styles.gaugeLabel}>Score</span>
          </div>
          <div className={styles.ambientGlow} style={{ background: scoreColor }} />
        </div>

        {/* Event Info + Quick Stats */}
        <div className={styles.info}>
          <div>
            <div className={styles.eventName}>{eventName}</div>
            <div className={styles.eventMeta}>
              <span>{eventTime}</span>
              <span className={styles.metaDot} />
              <span className={styles.matchMinute}>
                <span className={styles.matchMinuteDot} />
                {matchMinute}'
              </span>
              <span className={styles.metaDot} />
              <span>Atlas Arena</span>
            </div>
          </div>

          <div className={styles.quickStats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>
                <AnimatedNumber value={currentAttendance} />
              </span>
              <span className={styles.statLabel}>Attendance</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>
                <AnimatedNumber value={Math.round((currentAttendance / capacity) * 100)} suffix="%" />
              </span>
              <span className={styles.statLabel}>Capacity</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>
                {formatNumber(capacity - currentAttendance)}
              </span>
              <span className={styles.statLabel}>Available</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default HealthScore;
