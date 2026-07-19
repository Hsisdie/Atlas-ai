# Multi-Agent System

Atlas AI employs a decentralized Multi-Agent orchestration model to ensure high availability, specialized processing, and system resilience.

## Agent Types
1. **Security Agent**: Monitors access controls, camera feeds, and perimeter breaches.
2. **Environmental Agent**: Tracks HVAC, temperature, humidity, and air quality metrics.
3. **Operations Agent**: Manages energy consumption, resource allocation, and maintenance schedules.
4. **Crowd Flow Agent**: Analyzes movement patterns and predicts bottlenecks in high-traffic areas.

## Communication Protocol
Agents do not communicate directly with each other to avoid tight coupling. Instead, they publish their findings to a centralized event bus (implemented via the `SimulationContext` and state managers).

## Agent UI
The `/multi-agent` route provides a live dashboard where operators can view the active status, confidence scores, and real-time logs of each deployed agent. This transparency is crucial for human-in-the-loop oversight.
