import { Cloud, Droplets, Wind, Thermometer } from 'lucide-react';
import Card from '../../shared/Card/Card';
import { useSimulation } from '../../../context/SimulationContext';
import { weather } from '../../../data/mockData';
import styles from './WeatherCard.module.css';

const conditionEmoji: Record<string, string> = {
  clear: '☀️',
  cloudy: '⛅',
  rain: '🌧️',
  storm: '⛈️',
  snow: '🌨️',
};

function WeatherCard() {
  const { metrics } = useSimulation();
  return (
    <Card
      variant="default"
      padding="md"
      header={{
        title: 'Weather',
        subtitle: 'Current conditions',
        icon: <Cloud />,
      }}
    >
      <div className={styles.content}>
        <div className={styles.main}>
          <div className={styles.tempDisplay}>
            <span className={styles.tempValue}>{metrics.temperature}</span>
            <span className={styles.tempUnit}>°C</span>
          </div>
          <div className={styles.details}>
            <span className={styles.condition}>
              <span className={styles.weatherIcon}>{conditionEmoji[metrics.weather.toLowerCase()] || '☁️'}</span>{' '}
              {metrics.weather}
            </span>
            <div className={styles.detailRow}>
              <Thermometer /> Feels like {weather.feelsLike}°C
            </div>
            <div className={styles.detailRow}>
              <Droplets /> Humidity {weather.humidity}%
            </div>
            <div className={styles.detailRow}>
              <Wind /> Wind {weather.windSpeed} km/h
            </div>
          </div>
        </div>

        <div className={styles.forecast}>
          {weather.forecast.map((f) => (
            <div key={f.time} className={styles.forecastItem}>
              <span className={styles.forecastTime}>{f.time}</span>
              <span className={styles.weatherIcon} style={{ fontSize: '1.2rem' }}>
                {conditionEmoji[f.condition] || '☀️'}
              </span>
              <span className={styles.forecastTemp}>{f.temperature}°</span>
              <span className={styles.forecastCondition}>{f.condition}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

export default WeatherCard;
