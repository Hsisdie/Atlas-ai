import { type ReactNode, type HTMLAttributes } from 'react';
import styles from './Card.module.css';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass' | 'ghost' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  interactive?: boolean;
  glow?: boolean;
  statusAccent?: 'operational' | 'warning' | 'critical' | 'info';
  header?: {
    title: string;
    subtitle?: string;
    icon?: ReactNode;
    actions?: ReactNode;
  };
  children?: ReactNode;
}

function Card({
  variant = 'default',
  padding = 'md',
  interactive = false,
  glow = false,
  statusAccent,
  header,
  children,
  className = '',
  ...props
}: CardProps) {
  const classNames = [
    styles.card,
    styles[variant],
    padding !== 'none' && styles[padding],
    padding === 'none' && styles.noPadding,
    interactive && styles.interactive,
    glow && styles.glow,
    statusAccent && styles.statusAccent,
    statusAccent && styles[statusAccent],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames} {...props}>
      {header && (
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            {header.icon && <div className={styles.headerIcon}>{header.icon}</div>}
            <div>
              <div className={styles.headerTitle}>{header.title}</div>
              {header.subtitle && (
                <div className={styles.headerSubtitle}>{header.subtitle}</div>
              )}
            </div>
          </div>
          {header.actions && (
            <div className={styles.headerActions}>{header.actions}</div>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

export default Card;
