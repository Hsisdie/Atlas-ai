/* ═══════════════════════════════════════════════════════════
   StadiumLegend — Density scale + zone type legend
   ═══════════════════════════════════════════════════════════ */

import styles from './StadiumLegend.module.css';

const zoneTypes = [
  { label: 'Stands', color: 'var(--color-accent)' },
  { label: 'Gates', color: 'hsl(280, 70%, 60%)' },
  { label: 'Parking', color: 'hsl(200, 80%, 55%)' },
  { label: 'Medical', color: 'hsl(0, 75%, 60%)' },
  { label: 'Food', color: 'hsl(38, 92%, 55%)' },
  { label: 'Volunteers', color: 'hsl(152, 60%, 48%)' },
];

function StadiumLegend() {
  return (
    <div className={styles.legend}>
      {/* Density gradient */}
      <div className={styles.densitySection}>
        <span className={styles.label}>Density</span>
        <div className={styles.gradientBar} />
        <div className={styles.gradientLabels}>
          <span>Low</span>
          <span>High</span>
        </div>
      </div>

      <div className={styles.divider} />

      {/* Zone type dots */}
      <div className={styles.typeSection}>
        {zoneTypes.map((t) => (
          <div key={t.label} className={styles.typeItem}>
            <span className={styles.typeDot} style={{ background: t.color }} />
            <span className={styles.typeLabel}>{t.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StadiumLegend;
