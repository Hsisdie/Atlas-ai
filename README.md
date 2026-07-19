<div align="center">
  <h1>🌍 Atlas AI</h1>
  <p><strong>A Professional Multi-Agent System, Digital Twin, and Scenario Simulator</strong></p>
  <p><i>Ready for Submission</i></p>
</div>

<br />

## 📖 Challenge Submission Details

### 1. Chosen Vertical: **Smart Stadium & Event Infrastructure Management**
Managing large-scale infrastructural systems like stadiums during live events is highly complex and reactive. Security, crowd flow, environmental controls, and parking are traditionally siloed. **Atlas AI** targets this vertical by serving as a central, proactive intelligence layer that connects physical infrastructure (via a Digital Twin) with a network of specialized AI agents.

### 2. Approach and Logic
Our approach bridges **Multi-Agent Orchestration** with **Digital Twin Technology**:
- **Data Ingestion:** The Digital Twin acts as the single source of truth, mocking real-time telemetry (crowd density, temperature, structural health, parking capacity).
- **Multi-Agent System:** Specialized AI agents (e.g., Crowd Flow Agent, Security Agent, Environmental Agent) continuously monitor their specific domains. 
- **Centralized Reasoning (Atlas Brain):** The agents feed their findings to the "Atlas Brain," which uses the **Google Gemini LLM** to synthesize the data, identify cross-domain anomalies, and generate high-confidence predictions and recommendations.
- **Scenario Simulation:** Administrators can inject stress-test scenarios (e.g., "Fire Alarm in Sector B") to observe how the AI predicts crowd panic and recommends evacuation routes in real-time.

### 3. How the Solution Works
1. **The Dashboard:** Operators view a real-time Command Center showing active alerts, stadium health, and crowd heatmaps.
2. **Dynamic AI Engine:** When an anomaly occurs (e.g., sudden crowd density spike), the `aiService` packages the current Digital Twin state into a strict JSON schema prompt and sends it to the Gemini API.
3. **Structured Response:** Gemini responds with structured JSON containing:
   - **Predictions:** What is likely to happen next (e.g., bottleneck at Gate 4).
   - **Recommendations:** Specific actions (e.g., deploy stewards, open auxiliary exits).
   - **Reasoning:** Step-by-step logic explaining *why* the AI made these recommendations, ensuring full transparency.
4. **Execution:** The recommendations are displayed beautifully in the UI for the human operator to approve.

### 4. Assumptions Made
- We assume that the physical stadium is heavily instrumented with IoT sensors (cameras, temperature sensors, ticketing gates) capable of feeding real-time data to the Digital Twin.
- For the sake of this prototype, sensor telemetry is simulated dynamically on the frontend.
- We assume human-in-the-loop operation: the AI recommends, but a human operator ultimately approves critical actions.

---

## 🛠 Tech Stack & Architecture
- **Frontend Framework:** React 19 + Vite (TypeScript)
- **Styling & Animations:** Vanilla CSS + Framer Motion (for premium micro-animations)
- **AI Integration:** `@google/genai` SDK for robust, dynamic reasoning
- **State Management:** React Context API for global simulation state sync

## 🚀 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Hsisdie/Atlas-ai.git
   cd Atlas-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add your Gemini API key:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the Application:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

## 🔒 Security Note
This repository follows security best practices. The `.env` file is excluded via `.gitignore` to ensure API keys are never exposed in version control. If deploying to production, environment variables should be injected securely via the hosting provider.

## 🤝 Team
- **Developed for the 2026 AI Challenge**
- **License:** MIT
