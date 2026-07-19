# Gemini Integration

Atlas AI leverages Google's Gemini models for advanced reasoning and natural language generation.

## Setup
The application uses the official `@google/genai` SDK.
An API key must be provided via the `VITE_GEMINI_API_KEY` environment variable.

## Usage in Atlas AI
Gemini is primarily utilized within the "Atlas Brain" component. Its responsibilities include:
- **Anomaly Correlation**: Taking independent reports from the Multi-Agent system and determining if they are symptoms of a larger, systemic issue.
- **Actionable Recommendations**: Generating human-readable mitigation strategies based on the current state of the Digital Twin.
- **Scenario Generation**: Assisting the Scenario Simulator by generating realistic edge-case scenarios and predicting their evolution over time.

## Prompt Engineering
Prompts sent to Gemini are heavily contextualized. Before a request is made, the application serializes the current state of the Digital Twin and the latest Agent logs into a structured JSON format. This ensures Gemini grounds its reasoning in the immediate reality of the system rather than relying solely on its pre-trained weights.
