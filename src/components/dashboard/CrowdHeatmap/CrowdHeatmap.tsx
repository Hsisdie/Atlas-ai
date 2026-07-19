import { Users, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Card from '../../shared/Card/Card';
import { heatmapData, getDensityColor, formatNumber } from '../../../data/mockData';
import styles from './CrowdHeatmap.module.css';

function CrowdHeatmap() {
  const trendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp size={12} className={styles.trendUp} />;
    if (trend === 'down') return <TrendingDown size={12} className={styles.trendDown} />;
    return <Minus size={12} className={styles.trendStable} />;
  };

  return (
    <Card
      variant="default"
      padding="md"
      header={{
        title: 'Live Crowd Density',
        subtitle: 'Zone-by-zone heatmap',
        icon: <Users />,
      }}
    >
      <div className={styles.grid}>
        {heatmapData.map((zone) => (
          <div key={zone.zone} className={styles.row}>
            <span className={styles.zoneName}>{zone.zone}</span>
            <div className={styles.barContainer}>
              <div
                className={styles.barFill}
                style={{
                  width: `${zone.density * 100}%`,
                  background: getDensityColor(zone.density),
                }}
              />
            </div>
            <div className={styles.stats}>
              <span className={styles.density} style={{ color: getDensityColor(zone.density) }}>
                {Math.round(zone.density * 100)}%
              </span>
              <span className={styles.fans}>{formatNumber(zone.fans)}</span>
              <span className={styles.trend}>{trendIcon(zone.trend)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.summary}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryDot} style={{ background: 'var(--color-success)' }} />
          Low
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryDot} style={{ background: 'var(--color-accent)' }} />
          Moderate
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryDot} style={{ background: 'var(--color-warning)' }} />
          High
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryDot} style={{ background: 'var(--color-danger)' }} />
          Critical
        </div>
      </div>
    </Card>
  );
}

export default CrowdHeatmap;
