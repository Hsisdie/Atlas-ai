# Digital Twin

The Digital Twin is a real-time, interactive virtual replica of the physical infrastructure managed by Atlas AI.

## Core Capabilities
- **Live State Reflection**: The UI updates instantaneously as underlying telemetry data changes.
- **Spatial Context**: Unlike standard dashboards, the Digital Twin provides spatial relationships, allowing operators to see *where* an anomaly is occurring.
- **Interactive Layers**: Users can toggle different data layers (e.g., thermal mapping, structural stress, security zones) to gain specific insights without cluttering the main view.

## Implementation Details
The Digital Twin view (`/digital-twin`) relies on Framer Motion for complex SVG path animations and transitions. This allows the application to smoothly interpolate between normal and critical states, drawing the user's attention to issues organically.

Data models for the twin are stored in `src/data/` and provide the structural blueprint that the React components render.
