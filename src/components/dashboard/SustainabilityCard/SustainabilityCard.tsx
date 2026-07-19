import { Leaf, Sun, Droplets, Trash2, Cpu } from 'lucide-react';
import Card from '../../shared/Card/Card';
import AnimatedNumber from '../../shared/AnimatedNumber/AnimatedNumber';
import { useSimulation } from '../../../context/SimulationContext';
import { sustainabilityData } from '../../../data/mockData';
import styles from './SustainabilityCard.module.css';

function SustainabilityCard() {
  const { metrics } = useSimulation();
  
  // metrics.energy (0-100), inverse it for load. 100 energy means low load.
  const loadPercentage = Math.max(0, 100 - metrics.energy); 
  const currentEnergy = 12.4 + (loadPercentage * 0.15); // Scale between 12.4 and ~27.4 MW
  const percentOfTarget = Math.round((currentEnergy / 28.5) * 100);

  const d = sustainabilityData;

  return (
    <Card
      variant="default"
      padding="md"
      header={{
        title: 'Sustainability',
        subtitle: 'Eco-efficiency metrics',
        icon: <Leaf />,
      }}
    >
      <div className={styles.content}>
        <div className={styles.metricsGrid}>
          <div className={styles.metric}>
            <div className={styles.metricHeader}>
              <span className={styles.metricName}>Power Load</span>
              <span className={styles.metricIcon}><Cpu /></span>
            </div>
            <div className={styles.metricValueContainer}>
              <AnimatedNumber value={currentEnergy} decimals={1} className={styles.metricValue} />
              <span className={styles.metricUnit}>{d.energyConsumption.unit}</span>
            </div>
            <div className={styles.barContainer}>
              <div className={styles.barFill} style={{ width: `${percentOfTarget}%` }} />
            </div>
            <div className={styles.summary}>
              <span>Target: {d.energyConsumption.target} {d.energyConsumption.unit}</span>
              <span>{percentOfTarget}%</span>
            </div>
          </div>

          <div className={styles.metric}>
            <div className={styles.metricHeader}>
              <span className={styles.metricName}>Solar Gen</span>
              <span className={styles.metricIcon} style={{ color: 'var(--color-warning)' }}><Sun /></span>
            </div>
            <div className={styles.metricValueContainer}>
              <AnimatedNumber value={d.solarGeneration.current} decimals={1} className={styles.metricValue} />
              <span className={styles.metricUnit}>{d.solarGeneration.unit}</span>
            </div>
            <div className={styles.barContainer}>
              <div
                className={styles.barFill}
                style={{ width: `${d.solarGeneration.percentOfLoad}%`, background: 'var(--color-warning)' }}
              />
            </div>
            <div className={styles.summary}>
              <span>Of active load</span>
              <span>{d.solarGeneration.percentOfLoad}%</span>
            </div>
          </div>

          <div className={styles.metric}>
            <div className={styles.metricHeader}>
              <span className={styles.metricName}>Water Rate</span>
              <span className={styles.metricIcon} style={{ color: 'var(--color-info)' }}><Droplets /></span>
            </div>
            <div className={styles.metricValueContainer}>
              <AnimatedNumber value={d.waterUsage.current} className={styles.metricValue} />
              <span className={styles.metricUnit}>{d.waterUsage.unit}</span>
            </div>
            <div className={styles.barContainer}>
              <div className={styles.barFill} style={{ width: `${d.waterUsage.percentOfTarget}%`, background: 'var(--color-info)' }} />
            </div>
            <div className={styles.summary}>
              <span>Target limit</span>
              <span>{d.waterUsage.percentOfTarget}%</span>
            </div>
          </div>

          <div className={styles.metric}>
            <div className={styles.metricHeader}>
              <span className={styles.metricName}>Recycle Rate</span>
              <span className={styles.metricIcon} style={{ color: 'var(--color-accent)' }}><Trash2 /></span>
            </div>
            <div className={styles.metricValueContainer}>
              <AnimatedNumber value={d.wasteRecycled.rate} className={styles.metricValue} suffix="%" />
            </div>
            <div className={styles.barContainer}>
              <div className={styles.barFill} style={{ width: `${d.wasteRecycled.rate}%`, background: 'var(--color-accent)' }} />
            </div>
            <div className={styles.summary}>
              <span>Target: {d.wasteRecycled.target}%</span>
              <span>{d.wasteRecycled.rate}%</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default SustainabilityCard;
