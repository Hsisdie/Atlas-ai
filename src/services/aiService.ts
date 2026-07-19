/* ═══════════════════════════════════════════════════════════
   AtlasOS — AI Service (Enhanced with Gemini)
   Real-time dynamic reasoning using the Gemini API.
   ═══════════════════════════════════════════════════════════ */

import { GoogleGenAI } from '@google/genai';
import type { AIAnalysisResult } from '../types';
import type { GlobalSimulationState } from '../context/SimulationContext';

let aiClient: GoogleGenAI | null = null;

function getClient() {
  if (!aiClient) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (apiKey) {
      aiClient = new GoogleGenAI({ apiKey });
    }
  }
  return aiClient;
}

const systemPrompt = `You are the core AI Engine for Atlas, an intelligent stadium management platform.
Your job is to analyze the current state of the stadium and return a structured JSON response predicting issues and recommending actions.
Always return valid JSON that conforms EXACTLY to this structure (do not include markdown \`\`\`json wrappers):
{
  "overallRisk": "low" | "moderate" | "high" | "critical",
  "overallConfidence": number,
  "predictions": [
    {
      "id": "string",
      "problem": "string",
      "description": "string",
      "confidence": number,
      "severity": "low" | "medium" | "high" | "critical",
      "timeframe": "string",
      "affectedZones": ["string"],
      "indicators": ["string"]
    }
  ],
  "recommendations": [
    {
      "id": "string",
      "action": "string",
      "reasoning": "string",
      "priority": "low" | "medium" | "high" | "critical",
      "assignedTo": "string",
      "estimatedImpact": "string"
    }
  ],
  "reasoning": [
    {
      "step": number,
      "input": "string",
      "analysis": "string",
      "conclusion": "string"
    }
  ]
}
Be highly specific, dynamic, and realistic based on the provided state. Ensure you return at least 3-5 reasoning steps, 2-3 predictions, and 2-3 recommendations.`;

// Fallback logic in case Gemini API fails or rate limits
function getFallbackAnalysis(state: GlobalSimulationState): AIAnalysisResult {
  const isCritical = state.activeScenario?.severity === 'critical';
  return {
    id: `fallback-${Date.now()}`,
    timestamp: new Date(),
    overallRisk: isCritical ? 'critical' : (state.activeScenario ? 'high' : 'low'),
    overallConfidence: 85,
    processingTime: 500,
    modelVersion: 'Fallback Logic',
    predictions: [
      {
        id: 'pred-fallback-1',
        problem: state.activeScenario ? `${state.activeScenario.name} Impact` : 'Crowd Congestion',
        description: `System detecting anomalies due to current state: Health ${state.stadiumHealth}%, Density ${state.crowdDensity}%`,
        confidence: 82,
        severity: isCritical ? 'critical' : 'medium',
        timeframe: 'Immediate',
        affectedZones: state.activeScenario?.affectedSystems || ['Concourse'],
        indicators: [`Health: ${state.stadiumHealth}%`, `Density: ${state.crowdDensity}%`]
      }
    ],
    recommendations: [
      {
        id: 'rec-fallback-1',
        action: 'Deploy Stewards to High Density Areas',
        reasoning: 'Proactive crowd management prevents bottlenecks.',
        priority: 'high',
        assignedTo: 'Security Agent',
        estimatedImpact: 'Reduces congestion by 15%'
      }
    ],
    reasoning: [
      {
        step: 1,
        input: 'Simulation State Data',
        analysis: 'Fallback analysis triggered due to API unreachability.',
        conclusion: 'Executing pre-programmed safe operational guidelines.'
      }
    ]
  };
}

export async function generateDynamicAnalysis(state: GlobalSimulationState): Promise<AIAnalysisResult> {
  const startTime = performance.now();
  
  try {
    const client = getClient();
    if (!client) {
      console.warn('[Atlas AI] No Gemini API key found. Using fallback.');
      return getFallbackAnalysis(state);
    }

    const stateContext = JSON.stringify({
      stadiumHealth: state.stadiumHealth,
      crowdDensity: state.crowdDensity,
      phase: state.phase,
      activeScenario: state.activeScenario ? {
        name: state.activeScenario.name,
        severity: state.activeScenario.severity,
        affectedSystems: state.activeScenario.affectedSystems
      } : 'None',
      metrics: state.metrics
    }, null, 2);

    const response = await client.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: [
        {
          role: 'user',
          parts: [{ text: `System Prompt:\n${systemPrompt}\n\nCurrent State:\n${stateContext}` }]
        }
      ],
      config: {
        temperature: 0.2,
      }
    });

    const text = response.text || '';
    
    // Attempt to extract JSON from response
    let jsonStr = text;
    if (text.includes('```json')) {
      jsonStr = text.split('```json')[1].split('```')[0];
    } else if (text.includes('```')) {
      jsonStr = text.split('```')[1].split('```')[0];
    }
    
    const parsed = JSON.parse(jsonStr.trim());
    
    const processingTime = Math.round(performance.now() - startTime);

    return {
      id: `analysis-${Date.now()}`,
      timestamp: new Date(),
      overallRisk: parsed.overallRisk || 'moderate',
      overallConfidence: parsed.overallConfidence || 90,
      predictions: parsed.predictions || [],
      recommendations: parsed.recommendations || [],
      reasoning: parsed.reasoning || [],
      processingTime,
      modelVersion: 'Gemini 3.1 Pro (High)',
    };
  } catch (error) {
    console.error('[Atlas AI] Gemini API Error:', error);
    return getFallbackAnalysis(state);
  }
}
