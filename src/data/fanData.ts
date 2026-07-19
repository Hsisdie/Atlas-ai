/* ═══════════════════════════════════════════════════════════
   AtlasOS — Fan Companion Data  (Milestone 7)
   Mock data for the mobile-first fan experience.
   ═══════════════════════════════════════════════════════════ */

import type { FanProfile, ChatMessage, QueuePrediction } from '../types';

export const fanProfile: FanProfile = {
  name: 'Alex Rivera',
  seat: { section: '108', row: 'K', number: 14 },
  ticketType: 'premium',
  language: 'en',
};

export const matchInfo = {
  homeTeam: 'Brazil',
  awayTeam: 'France',
  homeScore: 2,
  awayScore: 1,
  minute: 67,
  venue: 'Atlas Arena',
  homeFlag: '🇧🇷',
  awayFlag: '🇫🇷',
};

export const queuePredictions: QueuePrediction[] = [
  { id: 'q1', name: 'Food Court A — North', type: 'food', currentWait: 12, predictedWait: 6, bestTime: 'After 75th minute', distance: '2 min walk' },
  { id: 'q2', name: 'Food Court B — East', type: 'food', currentWait: 8, predictedWait: 15, bestTime: 'Now', distance: '4 min walk' },
  { id: 'q3', name: 'Restroom — Section 108', type: 'restroom', currentWait: 3, predictedWait: 8, bestTime: 'Now', distance: '1 min walk' },
  { id: 'q4', name: 'Restroom — Section 112', type: 'restroom', currentWait: 7, predictedWait: 4, bestTime: 'After 75th minute', distance: '3 min walk' },
  { id: 'q5', name: 'Merchandise Stand — Gate A', type: 'merchandise', currentWait: 15, predictedWait: 5, bestTime: 'Post-match', distance: '6 min walk' },
  { id: 'q6', name: 'Food Court C — West', type: 'food', currentWait: 5, predictedWait: 12, bestTime: 'Now', distance: '5 min walk' },
];

export const initialChatMessages: ChatMessage[] = [
  {
    id: 'msg-0',
    role: 'assistant',
    content: 'Welcome to Atlas Arena! 🏟️ I\'m your AI assistant. How can I help you today? You can ask me about your seat, food, restrooms, or anything else.',
    timestamp: new Date(Date.now() - 300000),
  },
];

export const quickActions = [
  { label: '🪑 Find my seat', query: 'How do I get to my seat Section 108, Row K, Seat 14?' },
  { label: '🚻 Nearest restroom', query: 'Where is the nearest restroom?' },
  { label: '🍔 Food nearby', query: 'What food options are near me?' },
  { label: '🚇 Exit routes', query: 'What\'s the best exit route after the match?' },
  { label: '🆘 Emergency', query: 'I need emergency assistance' },
  { label: '♿ Accessibility', query: 'What accessibility services are available?' },
];

export const assistantResponses: Record<string, string> = {
  'seat': '🪑 Your seat is in **Section 108, Row K, Seat 14**.\n\nFrom your current location:\n1. Head through Concourse Level 1\n2. Take the entrance marked "Sections 106-110"\n3. Walk down to Row K (11th row from the top)\n4. Your seat is 14th from the left aisle\n\n📍 Estimated walk time: **3 minutes**',
  'restroom': '🚻 The nearest restroom is in **Section 108** — just **1 minute walk** from your seat.\n\n⏱️ Current wait: **3 minutes**\n📊 AI Prediction: Wait will increase to 8 min at half-time\n\n💡 **Tip**: The Section 112 restroom has a 7-min wait now but will drop to 4 min after the 75th minute.',
  'food': '🍔 Food options near Section 108:\n\n1. **Food Court B (East)** — 4 min walk\n   • 🌯 Wraps, 🍕 Pizza, 🥤 Drinks\n   • Wait: 8 min (best to go now!)\n\n2. **Food Court A (North)** — 2 min walk\n   • 🍔 Burgers, 🌮 Tacos, 🍦 Ice cream\n   • Wait: 12 min (will drop to 6 min after 75\')\n\n💡 **AI Recommendation**: Go to Food Court B now for the shortest wait.',
  'exit': '🚇 Best exit routes after the match:\n\n1. **Gate A (North)** — Recommended ✅\n   • 5 min walk, low congestion expected\n   • Metro Line 1: 3 min to city center\n\n2. **Gate C (South)** — Alternative\n   • 4 min walk, moderate congestion\n   • Parking Lot access\n\n⏱️ Estimated dispersal time: **38 minutes**\n💡 **Tip**: Leaving 5 minutes before full-time saves ~15 minutes.',
  'emergency': '🆘 **Emergency Contacts**:\n\n📞 Medical: Dial **199** or press the SOS button below\n📍 Nearest Medical Bay: **Section 110** (2 min walk)\n👨‍⚕️ Staff on duty: **42 medical professionals**\n🚑 Ambulances on standby: **6**\n\n⚠️ If this is a life-threatening emergency, stay calm and a response team will reach you within 3 minutes.',
  'accessibility': '♿ **Accessibility Services**:\n\n• Wheelchair spaces: **42 available**\n• Accessible restrooms: **31 operational** (1 out of order)\n• 🛗 Elevators: **11 of 12 operational** (Elevator 7 in East Wing is temporarily closed)\n• 🎧 Assistive listening: **4 channels active**\n• 🤟 Sign language interpreters at Sections 101, 201, VIP\n• Braille signage: Complete throughout venue\n\nNeed a companion seat? Ask a nearby steward or contact us.',
  'default': 'I can help you with:\n\n🪑 **Seat Navigation** — Find your way to your seat\n🚻 **Restrooms** — Nearest options with wait times\n🍔 **Food & Drinks** — Nearby options and queue predictions\n🚇 **Exit Routes** — Best way out after the match\n🆘 **Emergency** — Medical and safety assistance\n♿ **Accessibility** — Available services and support\n\nJust ask me anything!',
};

export const languageOptions = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
];
