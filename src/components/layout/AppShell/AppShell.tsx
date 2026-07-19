import { useState, useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { PageTransition } from '../../shared';
import Sidebar from '../Sidebar/Sidebar';
import TopBar from '../TopBar/TopBar';
import { useSimulation } from '../../../context/SimulationContext';
import styles from './AppShell.module.css';

interface AppShellProps {
  children: ReactNode;
  title?: string;
  breadcrumb?: string[];
}

function AppShell({ children, title, breadcrumb }: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const { phase } = useSimulation();

  // Sync phase to document body for global CSS variables
  useEffect(() => {
    document.body.setAttribute('data-phase', phase);
  }, [phase]);

  return (
    <div className={styles.shell}>
      {/* Ambient Particle Layer */}
      <div className={styles.ambientParticles}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className={styles.particle} style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${15 + Math.random() * 15}s`
          }} />
        ))}
      </div>

      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <TopBar
        sidebarCollapsed={sidebarCollapsed}
        title={title}
        breadcrumb={breadcrumb}
      />
      <main
        className={`${styles.main} ${sidebarCollapsed ? styles.collapsed : styles.expanded}`}
      >
        <div className={styles.content}>
          <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>
              {children}
            </PageTransition>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default AppShell;
