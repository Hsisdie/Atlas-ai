import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Brain,
  Box,
  Cpu,
  FlaskConical,
  Users,
  Smartphone,
  ChevronLeft,
  Hexagon,
} from 'lucide-react';
import styles from './Sidebar.module.css';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navSections = [
  {
    id: 'core',
    title: 'Operations',
    items: [
      { id: 'command', label: 'Command Center', icon: LayoutDashboard, path: '/' },
      { id: 'brain', label: 'Atlas Brain', icon: Brain, path: '/brain', badge: 1 },
      { id: 'digital-twin', label: 'Digital Twin', icon: Box, path: '/digital-twin' },
    ],
  },
  {
    id: 'simulate',
    title: 'Intelligence',
    items: [
      { id: 'ai-engine', label: 'AI Engine', icon: Cpu, path: '/ai-engine' },
      { id: 'agents', label: 'Multi-Agent AI', icon: Users, path: '/agents' },
      { id: 'simulator', label: 'Scenario Simulator', icon: FlaskConical, path: '/simulator' },
    ],
  },
  {
    id: 'platform',
    title: 'Platform',
    items: [
      { id: 'fan', label: 'Fan Companion', icon: Smartphone, path: '/fan' },
    ],
  },
];

function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      {/* Brand */}
      <div className={styles.brand}>
        <div className={styles.logoMark}>
          <span className={styles.logoIcon}>
            <Hexagon />
          </span>
        </div>
        <div className={styles.logoText}>
          <span className={styles.logoName}>AtlasOS</span>
          <span className={styles.logoTag}>Stadium AI</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className={styles.nav} aria-label="Main navigation">
        {navSections.map((section) => (
          <div key={section.id} className={styles.section}>
            <div className={styles.sectionTitle}>{section.title}</div>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.path);

              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                  title={collapsed ? item.label : undefined}
                >
                  <span className={styles.navIcon}>
                    <Icon />
                  </span>
                  <span className={styles.navLabel}>{item.label}</span>
                  {item.badge && <span className={styles.navBadge}>{item.badge}</span>}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <div className={styles.footer}>
        <button
          className={styles.collapseBtn}
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <span className={styles.collapseIcon}>
            <ChevronLeft size={16} />
          </span>
          <span className={styles.collapseLabel}>Collapse</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
