import { Accessibility, AlertTriangle } from 'lucide-react';
import Card from '../../shared/Card/Card';
import { accessibilityData } from '../../../data/mockData';
import styles from './AccessibilityCard.module.css';

function AccessibilityCard() {
  const d = accessibilityData;
  return (
    <Card
      variant="default"
      padding="md"
      header={{ title: 'Accessibility', subtitle: 'Inclusive operations', icon: <Accessibility /> }}
    >
      <div className={styles.content}>
        <div className={styles.scoreRow}>
          <div className={styles.scoreBadge}>{d.score}</div>
          <div className={styles.scoreText}>
            <span className={styles.scoreTitle}>Accessibility Score</span>
            <span className={styles.scoreSubtitle}>ADA & WCAG compliant</span>
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.item}>
            <span className={styles.itemLabel}>Wheelchair Spaces</span>
            <span className={styles.itemValue}>{d.wheelchairSpaces.available} avail</span>
          </div>
          <div className={styles.item}>
            <span className={styles.itemLabel}>Accessible Restrooms</span>
            <span className={styles.itemValue}>{d.accessibleRestrooms.operational}/{d.accessibleRestrooms.total}</span>
          </div>
          <div className={styles.item}>
            <span className={styles.itemLabel}>Elevators</span>
            <span className={styles.itemValue}>{d.elevators.operational}/{d.elevators.total}</span>
          </div>
          <div className={styles.item}>
            <span className={styles.itemLabel}>Accessible Parking</span>
            <span className={styles.itemValue}>{d.accessibleParking.available} avail</span>
          </div>
          <div className={styles.item}>
            <span className={styles.itemLabel}>Sign Language</span>
            <span className={styles.itemValue}>{d.signLanguageInterpreters} interpreters</span>
          </div>
          <div className={styles.item}>
            <span className={styles.itemLabel}>Assistive Listening</span>
            <span className={styles.itemValue}>{d.assistiveListening.channels} channels</span>
          </div>
        </div>

        {d.elevators.outOfOrder > 0 && (
          <div className={styles.alert}>
            <AlertTriangle />
            <span>{d.elevators.location} — Out of service</span>
          </div>
        )}
      </div>
    </Card>
  );
}

export default AccessibilityCard;
