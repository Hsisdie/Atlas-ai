import { TrainFront, Bus, Car, Footprints, Clock } from 'lucide-react';
import Card from '../../shared/Card/Card';
import StatusBadge from '../../shared/StatusBadge/StatusBadge';
import { useSimulation } from '../../../context/SimulationContext';
import { transportData } from '../../../data/mockData';
import styles from './TransportCard.module.css';

function TransportCard() {
  const { metrics } = useSimulation();
  
  // Scale rideshare wait time based on transport metric (0-100)
  const waitTimeNum = Math.round(15 + (100 - metrics.transport) * 0.5);
  const surge = (100 - metrics.transport) > 20 ? ((100 - metrics.transport) / 10).toFixed(1) : transportData.rideshare.surgeMultiplier;

  return (
    <Card
      variant="default"
      padding="md"
      header={{ title: 'Transport', subtitle: 'Multi-modal status', icon: <TrainFront /> }}
    >
      <div className={styles.content}>
        <div className={styles.modes}>
          <div className={styles.mode}>
            <div className={styles.modeHeader}>
              <span className={styles.modeName}>Metro</span>
              <span className={styles.modeIcon}><TrainFront /></span>
            </div>
            <div className={styles.modeValue}>{transportData.metro.nextArrival}</div>
            <div className={styles.modeLabel}>Next arrival</div>
            <div className={styles.modeMeta}>
              <StatusBadge status={transportData.metro.status} size="sm" dotOnly />
              {transportData.metro.linesActive} lines active • {transportData.metro.capacity}% load
            </div>
          </div>

          <div className={styles.mode}>
            <div className={styles.modeHeader}>
              <span className={styles.modeName}>Shuttle Bus</span>
              <span className={styles.modeIcon}><Bus /></span>
            </div>
            <div className={styles.modeValue}>{transportData.bus.shuttlesDeployed}</div>
            <div className={styles.modeLabel}>Shuttles deployed</div>
            <div className={styles.modeMeta}>
              <StatusBadge status={transportData.bus.status} size="sm" dotOnly />
              {transportData.bus.activeRoutes} routes • Avg {transportData.bus.avgWait}
            </div>
          </div>

          <div className={styles.mode}>
            <div className={styles.modeHeader}>
              <span className={styles.modeName}>Rideshare</span>
              <span className={styles.modeIcon}><Car /></span>
            </div>
            <div className={styles.modeValue}>{waitTimeNum} min</div>
            <div className={styles.modeLabel}>Average wait</div>
            <div className={styles.modeMeta}>
              <span className={styles.surgeTag}>{surge}x surge</span>
              {transportData.rideshare.driversNearby} nearby
            </div>
          </div>

          <div className={styles.mode}>
            <div className={styles.modeHeader}>
              <span className={styles.modeName}>Pedestrian</span>
              <span className={styles.modeIcon}><Footprints /></span>
            </div>
            <div className={styles.modeValue}>{transportData.pedestrian.activeExits}/{transportData.pedestrian.totalExits}</div>
            <div className={styles.modeLabel}>Exits open</div>
            <div className={styles.modeMeta}>
              Est. clear: {transportData.pedestrian.estimatedClearTime}
            </div>
          </div>
        </div>

        <div className={styles.dispersal}>
          <span className={styles.dispersalIcon}><Clock /></span>
          <span className={styles.dispersalText}>
            Post-match dispersal estimate: <span className={styles.dispersalValue}>{transportData.metro.estimatedPostMatch}</span>
          </span>
        </div>
      </div>
    </Card>
  );
}

export default TransportCard;
