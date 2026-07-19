# Digital Twin

The Digital Twin is a real-time, interactive virtual replica of the physical **Smart Stadium & Event Infrastructure** managed by Atlas AI.

## Core Capabilities
- **Live State Reflection**: The UI updates instantaneously as underlying telemetry data (like stadium health and crowd density) changes.
- **Spatial Context**: Unlike standard dashboards, the Digital Twin provides spatial relationships, allowing operators to see *where* an anomaly (e.g. a bottleneck at Gate 4) is occurring.
- **Interactive Layers**: Users can toggle different data layers (e.g., thermal mapping, structural stress, security zones, parking capacity) to gain specific insights without cluttering the main view.

## Implementation Details
The Digital Twin view (`/digital-twin`) relies on Framer Motion for complex SVG path animations and transitions. This allows the application to smoothly interpolate between normal and critical states, drawing the user's attention to stadium issues organically.

Data models for the twin are stored in `src/data/digitalTwinData.ts` and provide the structural blueprint of the stadium that the React components render.
