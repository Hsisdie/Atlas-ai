import { ShieldAlert } from 'lucide-react';
import Card from '../../shared/Card/Card';
import StatusBadge from '../../shared/StatusBadge/StatusBadge';
import { emergencyData } from '../../../data/mockData';
import styles from './EmergencyCard.module.css';

function EmergencyCard() {
  return (
    <Card
      variant="default"
      padding="md"
      header={{
        title: 'Emergency',
        subtitle: `${emergencyData.activeIncidents} active incidents`,
        icon: <ShieldAlert />,
        actions: <StatusBadge status={emergencyData.status} />,
      }}
    >
      <div className={styles.content}>
        <div className={styles.statsRow}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{emergencyData.medicalStaffOnDuty}/{emergencyData.medicalStaff}</span>
            <span className={styles.statLabel}>Medical Staff</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{emergencyData.securityOnDuty}/{emergencyData.securityPersonnel}</span>
            <span className={styles.statLabel}>Security</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{emergencyData.ambulancesStandby}</span>
            <span className={styles.statLabel}>Ambulances</span>
          </div>
        </div>

        <div className={styles.readiness}>
          <span className={styles.readinessLabel}>Evacuation Readiness</span>
          <span className={styles.readinessValue}>{emergencyData.evacuationReadiness}%</span>
        </div>

        <div className={styles.incidents}>
          {emergencyData.incidents.map((inc) => (
            <div key={inc.id} className={styles.incident}>
              <span
                className={styles.incidentDot}
                style={{ background: inc.severity === 'low' ? 'var(--color-warning)' : 'var(--color-danger)' }}
              />
              <span className={styles.incidentDesc}>{inc.description}</span>
              <span className={styles.incidentTime}>{inc.time}</span>
              <span
                className={styles.incidentStatus}
                style={{
                  color: 'var(--color-accent)',
                  background: 'var(--color-accent-subtle)',
                }}
              >
                {inc.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

export default EmergencyCard;
