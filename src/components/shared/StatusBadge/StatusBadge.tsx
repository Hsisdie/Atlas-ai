import styles from './StatusBadge.module.css';

interface StatusBadgeProps {
  status: 'operational' | 'warning' | 'critical' | 'offline' | 'info';
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  dotOnly?: boolean;
  className?: string;
}

function StatusBadge({
  status,
  label,
  size = 'md',
  animated = true,
  dotOnly = false,
  className = '',
}: StatusBadgeProps) {
  const displayLabel = label || status.charAt(0).toUpperCase() + status.slice(1);

  const classNames = [
    styles.badge,
    styles[status],
    styles[size],
    animated && styles.animated,
    dotOnly && styles.dotOnly,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classNames} role="status" aria-label={`Status: ${displayLabel}`}>
      <span className={styles.dot} />
      {!dotOnly && <span>{displayLabel}</span>}
    </span>
  );
}

export default StatusBadge;
