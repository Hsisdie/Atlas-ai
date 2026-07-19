import { useSimulation } from '../../../context/SimulationContext';
import styles from './FutureProjection.module.css';

export default function FutureProjection() {
  const { crowdDensity, stadiumHealth, activeScenario } = useSimulation();

  // Calculate future projections based on current state
  const isEmergency = !!activeScenario;
  const projections = [
    { label: 'NOW', density: crowdDensity, health: stadiumHealth },
    { 
      label: '+5m', 
      density: isEmergency ? Math.min(100, crowdDensity + 12) : crowdDensity - 2, 
      health: isEmergency ? Math.max(10, stadiumHealth - 15) : stadiumHealth 
    },
    { 
      label: '+10m', 
      density: isEmergency ? Math.min(100, crowdDensity + 18) : crowdDensity - 4, 
      health: isEmergency ? Math.max(10, stadiumHealth - 25) : stadiumHealth 
    },
    { 
      label: '+15m', 
      density: isEmergency ? crowdDensity + 5 : crowdDensity - 8, 
      health: isEmergency ? Math.max(10, stadiumHealth - 20) : stadiumHealth 
    },
    { 
      label: '+20m', 
      density: isEmergency ? crowdDensity - 15 : crowdDensity - 12, 
      health: isEmergency ? Math.max(10, stadiumHealth + 10) : stadiumHealth 
    },
  ];

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Predictive Simulation Window</h3>
      <div className={styles.timeline}>
        {projections.map((p, i) => (
          <div key={p.label} className={styles.nodeWrapper}>
            <div className={styles.node}>
              <div className={styles.timeLabel}>{p.label}</div>
              <div className={styles.metrics}>
                <div className={`${styles.metric} ${p.health < 60 ? styles.critical : p.health < 80 ? styles.warning : styles.nominal}`}>
                  {p.health.toFixed(1)}% H
                </div>
                <div className={`${styles.metric} ${p.density > 85 ? styles.critical : p.density > 70 ? styles.warning : styles.nominal}`}>
                  {p.density.toFixed(1)}% D
                </div>
              </div>
            </div>
            {i < projections.length - 1 && (
              <div className={styles.edge}>
                <div className={styles.flow} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
