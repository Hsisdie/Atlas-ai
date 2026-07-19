import { Search, Bell, HelpCircle } from 'lucide-react';
import { useSimulation } from '../../../context/SimulationContext';
import styles from './TopBar.module.css';

interface TopBarProps {
  sidebarCollapsed: boolean;
  title?: string;
  breadcrumb?: string[];
}

function TopBar({
  sidebarCollapsed,
  title = 'Command Center',
  breadcrumb = ['AtlasOS'],
}: TopBarProps) {
  const { phase, aiState, unreadNotifications } = useSimulation();

  return (
    <header
      className={`${styles.topbar} ${sidebarCollapsed ? styles.collapsed : styles.expanded}`}
      role="banner"
    >
      {/* Left */}
      <div className={styles.left}>
        <div className={styles.pageInfo}>
          <span className={styles.pageTitle}>{title}</span>
          <div className={styles.breadcrumb}>
            {breadcrumb.map((item, i) => (
              <span key={i}>
                {i > 0 && <span> / </span>}
                {item}
              </span>
            ))}
            <span> / </span>
            <span>{title}</span>
          </div>
        </div>
      </div>

      {/* Search */}
      <button className={styles.search} aria-label="Search or command palette">
        <Search />
        <span className={styles.searchText}>Search or command...</span>
        <kbd className={styles.searchShortcut}>⌘K</kbd>
      </button>

      {/* Right */}
      <div className={styles.right}>
        
        {/* Phase Indicator */}
        <div className={`${styles.phaseIndicator} ${styles[phase]}`}>
          <span className={styles.phaseDot} />
          {phase.toUpperCase()}
        </div>

        {/* AI Status */}
        {aiState.thinking && (
          <div className={styles.aiStatus}>
            <span className={styles.aiThinkingDot} />
            Atlas is analyzing...
          </div>
        )}

        <div className={styles.divider} />

        <button className={styles.iconButton} aria-label="Help">
          <HelpCircle />
        </button>

        <button className={styles.iconButton} aria-label="Notifications">
          <Bell />
          {unreadNotifications > 0 && (
            <span className={styles.notificationBadge}>{unreadNotifications}</span>
          )}
        </button>

        <div className={styles.divider} />

        <button className={styles.avatar} aria-label="User menu">
          SO
        </button>
      </div>
    </header>
  );
}

export default TopBar;
