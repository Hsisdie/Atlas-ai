# Architecture Documentation

Atlas AI is built as a modern, modular React application designed to scale. The architecture strictly separates concerns between the presentation layer, business logic (context), and external services (AI models).

## Core Principles
1. **Component-Based UI**: Uses React 19 functional components with hooks.
2. **Contextual State Management**: Global state (Simulation, AI recommendations) is managed via React Context to avoid prop drilling.
3. **Module CSS**: Scoped CSS modules for component-specific styling, paired with a global CSS variable system (`variables.css`) for consistent theming and dark mode support.
4. **Type Safety**: End-to-end TypeScript enforcement.

## Layer Overview

### 1. Presentation Layer (`src/components/`, `src/pages/`)
Contains all the visual elements. 
- `pages/` handle routing and compose multiple components.
- `components/` are highly reusable building blocks. Divided into sub-domains (e.g., `dashboard`, `digital-twin`, `shared`).

### 2. State & Logic Layer (`src/context/`, `src/hooks/`)
Handles the application state.
- `SimulationContext`: Manages the state of the scenario simulator (running scenarios, timeline).
- `AIContext` (if applicable): Manages the state of the agents and recommendations.

### 3. Service Layer (`src/services/`)
Handles external API communication.
- Currently integrates with `@google/genai` to communicate with the Gemini model.

### 4. Data Layer (`src/data/`, `src/types/`)
Defines the shapes of the data and provides mock data structures used for the digital twin and simulations.
