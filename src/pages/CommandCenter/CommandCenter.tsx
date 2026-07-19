import HealthScore from '../../components/dashboard/HealthScore/HealthScore';
import CrowdHeatmap from '../../components/dashboard/CrowdHeatmap/CrowdHeatmap';
import WeatherCard from '../../components/dashboard/WeatherCard/WeatherCard';
import ParkingCard from '../../components/dashboard/ParkingCard/ParkingCard';
import TransportCard from '../../components/dashboard/TransportCard/TransportCard';
import EmergencyCard from '../../components/dashboard/EmergencyCard/EmergencyCard';
import AccessibilityCard from '../../components/dashboard/AccessibilityCard/AccessibilityCard';
import SustainabilityCard from '../../components/dashboard/SustainabilityCard/SustainabilityCard';
import LiveAlerts from '../../components/dashboard/LiveAlerts/LiveAlerts';
import AIRecommendationCard from '../../components/dashboard/AIRecommendationCard/AIRecommendationCard';
import ActivityTimeline from '../../components/dashboard/ActivityTimeline/ActivityTimeline';
import AtlasBrain from '../../components/dashboard/AtlasBrain/AtlasBrain';
import styles from './CommandCenter.module.css';

function CommandCenter() {
  return (
    <div className={styles.container}>
      {/* Top Section: Health Score + High-level cards */}
      <div className={styles.topGrid}>
        <HealthScore />
        <WeatherCard />
        <SustainabilityCard />
      </div>

      {/* Main Grid Section */}
      <div className={styles.mainGrid}>
        {/* Left Column: Heatmap, Parking, Transport, etc. */}
        <div className={styles.leftColumn}>
          <CrowdHeatmap />
          <div className={styles.detailsGrid}>
            <ParkingCard />
            <TransportCard />
            <EmergencyCard />
            <AccessibilityCard />
          </div>
        </div>

        {/* Right Column: AI Insights, Alerts, Activity Log */}
        <div className={styles.rightColumn}>
          <AtlasBrain />
          <AIRecommendationCard />
          <LiveAlerts />
          <ActivityTimeline />
        </div>
      </div>
    </div>
  );
}

export default CommandCenter;
