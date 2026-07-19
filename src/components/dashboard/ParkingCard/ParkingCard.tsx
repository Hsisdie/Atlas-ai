import { Car } from 'lucide-react';
import Card from '../../shared/Card/Card';
import AnimatedNumber from '../../shared/AnimatedNumber/AnimatedNumber';
import StatusBadge from '../../shared/StatusBadge/StatusBadge';
import { useSimulation } from '../../../context/SimulationContext';
import { parkingData, getDensityColor } from '../../../data/mockData';
import styles from './ParkingCard.module.css';

function ParkingCard() {
  const { metrics } = useSimulation();
  // metrics.parkingCapacity is a percentage (0-100)
  const occupancyRate = (100 - metrics.parkingCapacity) / 100;
  const availableSpaces = Math.round((metrics.parkingCapacity / 100) * parkingData.totalSpaces);

  return (
    <Card
      variant="default"
      padding="md"
      header={{ title: 'Parking', subtitle: `${availableSpaces} spaces available`, icon: <Car /> }}
    >
      <div className={styles.content}>
        <div className={styles.overview}>
          <div>
            <div className={styles.bigNumber}>
              <AnimatedNumber value={availableSpaces} />
            </div>
            <div className={styles.bigLabel}>Available</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className={styles.bigNumber} style={{ color: getDensityColor(occupancyRate) }}>
              <AnimatedNumber value={Math.round(occupancyRate * 100)} suffix="%" />
            </div>
            <div className={styles.bigLabel}>Occupied</div>
          </div>
        </div>

        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{
              width: `${occupancyRate * 100}%`,
              background: getDensityColor(occupancyRate),
            }}
          />
        </div>

        <div className={styles.lots}>
          {parkingData.lots.map((lot) => {
            const pct = lot.occupied / lot.capacity;
            return (
              <div key={lot.name} className={styles.lot}>
                <StatusBadge status={lot.status} dotOnly size="sm" />
                <span className={styles.lotName}>{lot.name}</span>
                <div className={styles.lotBar}>
                  <div
                    className={styles.lotFill}
                    style={{ width: `${pct * 100}%`, background: getDensityColor(pct) }}
                  />
                </div>
                <span className={styles.lotPercent}>{Math.round(pct * 100)}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

export default ParkingCard;
