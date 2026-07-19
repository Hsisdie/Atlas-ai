# Scenario Simulator

The Scenario Simulator allows operators to safely model and predict the outcomes of critical events without impacting the physical infrastructure.

## How It Works
The simulator branches off from the current state of the Digital Twin. It creates a sandbox environment where time can be accelerated and specific variables (e.g., crowd density, temperature, power availability) can be manipulated.

1. **Scenario Selection**: Users choose from predefined scenarios (e.g., "Fire Emergency", "Power Grid Failure") or create custom parameters.
2. **Execution**: The `SimulationContext` handles the temporal progression of the scenario. It orchestrates changes to the sandboxed data state.
3. **Observation**: Operators watch the scenario unfold on the simulated Digital Twin view.
4. **Resolution Testing**: The AI generates a resolution plan. Operators can apply this plan within the simulation to verify its effectiveness before deploying it in the real world.

## Technical Architecture
The Simulation is driven by a custom React hook `useSimulation` combined with `SimulationContext`. It uses a `requestAnimationFrame` loop or `setInterval` timer (depending on the required fidelity) to progress the scenario state independently of the main application state.
