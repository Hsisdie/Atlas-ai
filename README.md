<div align="center">
  <h1>🌍 Atlas AI</h1>
  <p><strong>A Professional Multi-Agent System, Digital Twin, and Scenario Simulator</strong></p>
  <p><i>Ready for PromptWars 2026 Submission</i></p>
</div>

<br />

## 📖 Project Overview
Atlas AI is a state-of-the-art intelligent application that bridges the gap between physical infrastructure and artificial intelligence. By integrating a multi-agent system with real-time digital twin technology and scenario simulation, Atlas AI allows administrators, operators, and analysts to predict, simulate, and resolve complex infrastructural problems autonomously.

## 🎯 Problem Statement
Managing large-scale infrastructural systems in real-time is often reactive, resulting in delayed responses to critical situations, inefficiencies, and lack of predictive insights. Traditional systems lack the cognitive flexibility to simulate diverse scenarios and automatically prescribe solutions.

## 💡 Solution
Atlas AI solves this by deploying a network of intelligent agents powered by Gemini, constantly analyzing a Digital Twin of the infrastructure. It provides a Scenario Simulator to test "what-if" models, enabling proactive management and automated incident response recommendations.

## ✨ Key Features
- **Multi-Agent Orchestration**: Specialized AI agents (security, environment, operations) collaborating in real-time.
- **Digital Twin Sync**: Live synchronization of physical asset states to a virtual replica.
- **Scenario Simulator**: Predictive modeling and "what-if" analysis for edge cases and disasters.
- **Gemini-Powered Engine**: Advanced LLM reasoning for dynamic context understanding and resolution planning.

## 🤖 AI Workflow
The workflow relies on a continuous feedback loop:
1. **Data Ingestion**: Real-time telemetry from the Digital Twin.
2. **Agent Analysis**: Distributed analysis by specialized agents (e.g., Security Agent, Crowd Flow Agent).
3. **Consensus & Recommendation**: The central Atlas Brain synthesizes agent reports and generates actionable insights via Gemini.
4. **Simulation**: Proposed actions are simulated before deployment.

## 🏛 Architecture
Built with scalability in mind:
- **Frontend**: React 19, Vite, TypeScript, Framer Motion for smooth micro-animations.
- **Styling**: Vanilla CSS with comprehensive CSS Variables for theming (Design System).
- **AI Layer**: `@google/genai` integration for intelligent recommendations.
- **Routing**: React Router DOM.

## 🛠 Tech Stack
- **Framework**: React (Vite)
- **Language**: TypeScript
- **AI Integration**: Google GenAI SDK (Gemini)
- **Visualization**: Recharts, Framer Motion
- **Icons**: Lucide React

## 📂 Folder Structure
```text
atlas-ai/
├── docs/                # Comprehensive architectural and technical documentation
├── public/              # Static assets
└── src/
    ├── components/      # Reusable React components (Dashboard, Shared, Digital Twin)
    ├── context/         # React Context for state management (Simulation, AI)
    ├── data/            # Mock data and models
    ├── pages/           # Route views (MultiAgent, Simulator, AIEngine, DigitalTwin)
    ├── services/        # API and AI integration services
    ├── styles/          # Global CSS, variables, resets
    └── types/           # TypeScript definitions
```

## 🚀 Installation Guide

1. **Clone the repository:**
   ```bash
   git clone https://github.com/PromptWars/atlas-ai.git
   cd atlas-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## 🔐 Environment Variables
Create a `.env` file in the root directory and add your required keys:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

## 💻 Running Locally
Start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

## 📦 Deployment
To build for production:
```bash
npm run build
```
This generates the optimized bundle in the `dist` folder.

## 📸 Screenshots Section
*(Add screenshots of the Dashboard, Multi-Agent view, Digital Twin, and Simulator to `docs/screenshots`)*

## 🔮 Future Improvements
- Persistent backend integration for real-time telemetry instead of mocked data.
- Expansion of the Multi-Agent system to support custom agent plugins.
- Advanced 3D rendering for the Digital Twin using Three.js.

## 👥 Team
- **PromptWars 2026 Team** - *Core Developers*

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
