/* ═══════════════════════════════════════════════════════════
   StadiumTooltip — Glassmorphic floating tooltip
   Shows zone info on hover.
   ═══════════════════════════════════════════════════════════ */

import type { DigitalTwinZone, FoodCourt, VolunteerStation } from '../../../types';
import styles from './StadiumTooltip.module.css';

type TooltipTarget =
  | { kind: 'zone'; data: DigitalTwinZone }
  | { kind: 'food'; data: FoodCourt }
  | { kind: 'volunteer'; data: VolunteerStation };

interface StadiumTooltipProps {
  target: TooltipTarget | null;
  x: number;
  y: number;
  visible: boolean;
}

const typeLabels: Record<string, string> = {
  field: '⚽ Pitch',
  stand: '🏟️ Stand',
  concourse: '🚶 Concourse',
  gate: '🚪 Gate',
  parking: '🅿️ Parking',
  medical: '🏥 Medical',
  vip: '⭐ VIP',
  food: '🍔 Food Court',
  volunteer: '🤝 Volunteer',
};

const statusColors: Record<string, string> = {
  operational: 'var(--color-success)',
  warning: 'var(--color-warning)',
  critical: 'var(--color-danger)',
  offline: 'var(--color-text-tertiary)',
};

function StadiumTooltip({ target, x, y, visible }: StadiumTooltipProps) {
  if (!visible || !target) return null;

  return (
    <div
      className={styles.tooltip}
      style={{
        left: x,
        top: y,
        opacity: visible ? 1 : 0,
      }}
    >
      {target.kind === 'zone' && <ZoneContent zone={target.data} />}
      {target.kind === 'food' && <FoodContent food={target.data} />}
      {target.kind === 'volunteer' && <VolunteerContent station={target.data} />}
    </div>
  );
}

function ZoneContent({ zone }: { zone: DigitalTwinZone }) {
  const pct = Math.round((zone.currentOccupancy / zone.capacity) * 100);
  return (
    <>
      <div className={styles.header}>
        <span className={styles.type}>{typeLabels[zone.type] ?? zone.type}</span>
        <span className={styles.statusDot} style={{ background: statusColors[zone.status] }} />
      </div>
      <div className={styles.name}>{zone.name}</div>
      <div className={styles.barTrack}>
        <div
          className={styles.barFill}
          style={{ width: `${pct}%`, background: statusColors[zone.status] }}
        />
      </div>
      <div className={styles.stats}>
        <span>{zone.currentOccupancy.toLocaleString()} / {zone.capacity.toLocaleString()}</span>
        <span className={styles.pct}>{pct}%</span>
      </div>
      {zone.temperature !== undefined && (
        <div className={styles.meta}>🌡️ {zone.temperature}°C</div>
      )}
      {(zone.alerts ?? 0) > 0 && (
        <div className={styles.alerts}>⚠️ {zone.alerts} active alert{zone.alerts! > 1 ? 's' : ''}</div>
      )}
    </>
  );
}

function FoodContent({ food }: { food: FoodCourt }) {
  return (
    <>
      <div className={styles.header}>
        <span className={styles.type}>🍔 Food Court</span>
        <span className={styles.statusDot} style={{ background: statusColors[food.status] }} />
      </div>
      <div className={styles.name}>{food.name}</div>
      <div className={styles.stats}>
        <span>Queue: {food.queueLength} people</span>
        <span className={styles.pct}>{food.waitTime}</span>
      </div>
      <div className={styles.meta}>⭐ {food.popularItem}</div>
      <div className={styles.tags}>
        {food.menuTypes.map((m) => (
          <span key={m} className={styles.tag}>{m}</span>
        ))}
      </div>
    </>
  );
}

function VolunteerContent({ station }: { station: VolunteerStation }) {
  return (
    <>
      <div className={styles.header}>
        <span className={styles.type}>🤝 Volunteer Station</span>
        <span className={styles.statusDot} style={{ background: statusColors[station.status] }} />
      </div>
      <div className={styles.name}>{station.name}</div>
      <div className={styles.stats}>
        <span>{station.volunteerCount} volunteers</span>
        <span className={styles.pct}>{station.shift}</span>
      </div>
      <div className={styles.tags}>
        {station.roles.map((r) => (
          <span key={r} className={styles.tag}>{r}</span>
        ))}
      </div>
    </>
  );
}

export default StadiumTooltip;
