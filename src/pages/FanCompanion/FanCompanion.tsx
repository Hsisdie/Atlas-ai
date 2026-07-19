/* ═══════════════════════════════════════════════════════════
   AtlasOS — Fan Companion Page  (Milestone 7)
   Mobile-first fan experience with 5-tab navigation.
   ═══════════════════════════════════════════════════════════ */

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  Hexagon, Home, Map, Clock, MessageCircle,
  AlertTriangle, Send, Armchair, Navigation,
  Phone, Shield, Heart,
  Globe,
} from 'lucide-react';
import {
  fanProfile, matchInfo, queuePredictions, initialChatMessages,
  quickActions, assistantResponses, languageOptions,
} from '../../data/fanData';
import type { FanTab, ChatMessage } from '../../types';
import styles from './FanCompanion.module.css';

function FanCompanion() {
  const [activeTab, setActiveTab] = useState<FanTab>('home');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [language, setLanguage] = useState('en');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  const getResponse = (query: string): string => {
    const lower = query.toLowerCase();
    if (lower.includes('seat') || lower.includes('section')) return assistantResponses.seat;
    if (lower.includes('restroom') || lower.includes('bathroom') || lower.includes('toilet')) return assistantResponses.restroom;
    if (lower.includes('food') || lower.includes('eat') || lower.includes('drink')) return assistantResponses.food;
    if (lower.includes('exit') || lower.includes('route') || lower.includes('leave')) return assistantResponses.exit;
    if (lower.includes('emergency') || lower.includes('help') || lower.includes('sos')) return assistantResponses.emergency;
    if (lower.includes('accessibility') || lower.includes('wheelchair') || lower.includes('disabled')) return assistantResponses.accessibility;
    return assistantResponses.default;
  };

  const sendMessage = useCallback(async (text?: string) => {
    const message = text || chatInput.trim();
    if (!message) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);

    // Simulate AI response delay
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 1200));

    const response = getResponse(message);
    const assistantMsg: ChatMessage = {
      id: `msg-${Date.now()}-r`,
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };

    setIsTyping(false);
    setChatMessages((prev) => [...prev, assistantMsg]);
  }, [chatInput]);

  const tabs: { id: FanTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home /> },
    { id: 'navigate', label: 'Navigate', icon: <Map /> },
    { id: 'queue', label: 'Queues', icon: <Clock /> },
    { id: 'assistant', label: 'Assistant', icon: <MessageCircle /> },
    { id: 'emergency', label: 'SOS', icon: <AlertTriangle /> },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.phone}>
        {/* Top Bar */}
        <div className={styles.topBar}>
          <div className={styles.topBarBrand}>
            <Hexagon /> AtlasOS Fan
          </div>
          <div className={styles.topBarRight}>
            <button
              className={styles.langBtn}
              onClick={() => {
                const idx = languageOptions.findIndex((l) => l.code === language);
                setLanguage(languageOptions[(idx + 1) % languageOptions.length].code);
              }}
              aria-label="Change Language"
            >
              <Globe size={12} />
              {languageOptions.find((l) => l.code === language)?.flag}
            </button>
            <div className={styles.liveDot} />
          </div>
        </div>

        {/* Content Area */}
        <div className={styles.content}>
          {/* ── Home Tab ── */}
          {activeTab === 'home' && (
            <>
              {/* Match Card */}
              <div className={styles.matchCard}>
                <div className={styles.matchTeams}>
                  <div>
                    <div className={styles.teamFlag}>{matchInfo.homeFlag}</div>
                    <div className={styles.teamName}>{matchInfo.homeTeam}</div>
                  </div>
                  <div className={styles.matchScore}>
                    {matchInfo.homeScore} — {matchInfo.awayScore}
                  </div>
                  <div>
                    <div className={styles.teamFlag}>{matchInfo.awayFlag}</div>
                    <div className={styles.teamName}>{matchInfo.awayTeam}</div>
                  </div>
                </div>
                <div className={styles.matchMinute}>
                  <span className={styles.matchMinuteDot} />
                  {matchInfo.minute}' LIVE
                </div>
              </div>

              {/* Seat Info */}
              <div className={styles.seatCard}>
                <div className={styles.seatIcon}><Armchair /></div>
                <div className={styles.seatInfo}>
                  <div className={styles.seatLabel}>Your Seat</div>
                  <div className={styles.seatValue}>
                    Sec {fanProfile.seat.section} · Row {fanProfile.seat.row} · Seat {fanProfile.seat.number}
                  </div>
                </div>
                <span className={styles.seatType}>{fanProfile.ticketType}</span>
              </div>

              {/* Quick Links */}
              <div className={styles.sectionHeader}>Quick Access</div>
              <div className={styles.quickLinks}>
                <button className={styles.quickLink} onClick={() => setActiveTab('navigate')}>
                  <Navigation size={16} /> Navigate to Seat
                </button>
                <button className={styles.quickLink} onClick={() => setActiveTab('queue')}>
                  <Clock size={16} /> Queue Times
                </button>
                <button className={styles.quickLink} onClick={() => setActiveTab('assistant')}>
                  <MessageCircle size={16} /> AI Assistant
                </button>
                <button className={styles.quickLink} onClick={() => setActiveTab('emergency')}>
                  <Shield size={16} /> Emergency Info
                </button>
              </div>
            </>
          )}

          {/* ── Navigate Tab ── */}
          {activeTab === 'navigate' && (
            <>
              <div className={styles.sectionHeader}>Stadium Map</div>
              <div className={styles.stadiumMap}>
                <svg className={styles.mapSvg} viewBox="0 0 300 300">
                  {/* Stadium outline */}
                  <ellipse cx="150" cy="150" rx="140" ry="120" fill="none" stroke="var(--color-border-primary)" strokeWidth="2" />
                  <ellipse cx="150" cy="150" rx="100" ry="80" fill="none" stroke="var(--color-border-secondary)" strokeWidth="1" />
                  {/* Field */}
                  <rect x="105" y="110" width="90" height="80" rx="4" fill="hsla(152, 60%, 48%, 0.1)" stroke="hsla(152, 60%, 48%, 0.3)" strokeWidth="1" />
                  {/* Gates */}
                  <circle cx="150" cy="30" r="6" fill="var(--color-accent)" opacity="0.8" />
                  <text x="150" y="22" textAnchor="middle" fill="var(--color-text-tertiary)" fontSize="8">A</text>
                  <circle cx="285" cy="150" r="6" fill="var(--color-accent)" opacity="0.8" />
                  <text x="285" y="142" textAnchor="middle" fill="var(--color-text-tertiary)" fontSize="8">B</text>
                  <circle cx="150" cy="270" r="6" fill="var(--color-accent)" opacity="0.8" />
                  <text x="150" y="262" textAnchor="middle" fill="var(--color-text-tertiary)" fontSize="8">C</text>
                  <circle cx="15" cy="150" r="6" fill="var(--color-accent)" opacity="0.8" />
                  <text x="15" y="142" textAnchor="middle" fill="var(--color-text-tertiary)" fontSize="8">D</text>
                  {/* User seat highlight */}
                  <circle cx="210" cy="100" r="8" fill="var(--color-accent)" opacity="0.3">
                    <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="210" cy="100" r="4" fill="var(--color-accent)" />
                  <text x="210" y="90" textAnchor="middle" fill="var(--color-accent-text)" fontSize="7" fontWeight="600">108</text>
                  {/* Sections */}
                  <text x="150" y="55" textAnchor="middle" fill="var(--color-text-tertiary)" fontSize="7">North Stand</text>
                  <text x="150" y="255" textAnchor="middle" fill="var(--color-text-tertiary)" fontSize="7">South Stand</text>
                  <text x="255" y="150" textAnchor="middle" fill="var(--color-text-tertiary)" fontSize="7">East Wing</text>
                  <text x="45" y="150" textAnchor="middle" fill="var(--color-text-tertiary)" fontSize="7">West Wing</text>
                  <text x="150" y="155" textAnchor="middle" fill="hsla(152, 60%, 48%, 0.5)" fontSize="8" fontWeight="500">FIELD</text>
                </svg>
                <div className={styles.mapLabel}>
                  📍 Your seat: Section 108 (highlighted in blue)
                </div>
              </div>

              {/* Seat Finder */}
              <div className={styles.sectionHeader}>Find a Seat</div>
              <div className={styles.seatFinder}>
                <input className={styles.seatInput} placeholder="Section" defaultValue="108" />
                <input className={styles.seatInput} placeholder="Row" defaultValue="K" />
                <input className={styles.seatInput} placeholder="Seat" defaultValue="14" />
                <button className={styles.findBtn}>Go</button>
              </div>
            </>
          )}

          {/* ── Queue Tab ── */}
          {activeTab === 'queue' && (
            <>
              <div className={styles.sectionHeader}>Queue Predictions</div>
              <div className={styles.queueList}>
                {queuePredictions.map((q) => (
                  <div key={q.id} className={styles.queueCard}>
                    <div className={styles.queueHeader}>
                      <span className={styles.queueName}>{q.name}</span>
                      <span className={`${styles.queueType} ${styles[q.type]}`}>{q.type}</span>
                    </div>
                    <div className={styles.queueMeta}>
                      <span className={styles.queueWait}>
                        <Clock size={12} /> Now: {q.currentWait} min
                      </span>
                      <span className={styles.queueWait}>
                        📊 Later: {q.predictedWait} min
                      </span>
                      <span className={styles.queueBest}>
                        ✨ {q.bestTime}
                      </span>
                    </div>
                    <div style={{ fontSize: 'var(--text-micro)', color: 'var(--color-text-tertiary)', marginTop: 'var(--space-1)' }}>
                      📍 {q.distance}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── Assistant Tab ── */}
          {activeTab === 'assistant' && (
            <div className={styles.chatContainer}>
              <div className={styles.chatMessages}>
                {chatMessages.map((msg) => (
                  <div key={msg.id}>
                    <div className={`${styles.chatBubble} ${styles[msg.role]}`}>
                      {msg.content}
                    </div>
                    <div className={styles.chatTime} style={{ textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className={styles.typingIndicator}>
                    <div className={styles.typingDot} />
                    <div className={styles.typingDot} />
                    <div className={styles.typingDot} />
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Quick Actions */}
              <div className={styles.quickActionsRow}>
                {quickActions.map((qa) => (
                  <button
                    key={qa.label}
                    className={styles.quickActionBtn}
                    onClick={() => sendMessage(qa.query)}
                  >
                    {qa.label}
                  </button>
                ))}
              </div>

              {/* Chat Input */}
              <div className={styles.chatInputRow}>
                <input
                  className={styles.chatInput}
                  placeholder="Ask me anything…"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button className={styles.sendBtn} onClick={() => sendMessage()} aria-label="Send message">
                  <Send />
                </button>
              </div>
            </div>
          )}

          {/* ── Emergency Tab ── */}
          {activeTab === 'emergency' && (
            <div className={styles.emergencyContent}>
              <div className={styles.sectionHeader}>Emergency Assistance</div>

              {/* SOS Button */}
              <button className={styles.sosButton}>
                <Phone />
                <span className={styles.sosLabel}>Emergency Call</span>
                <span style={{ fontSize: 'var(--text-micro)', opacity: 0.8 }}>
                  Tap to contact medical or security
                </span>
              </button>

              {/* Emergency Info Cards */}
              <div className={styles.emergencyCard}>
                <div className={styles.emergencyCardTitle}>
                  <Heart /> Nearest Medical Bay
                </div>
                <div className={styles.emergencyCardText}>
                  Section 110 — 2 minute walk from your seat{'\n'}
                  42 medical professionals on duty{'\n'}
                  6 ambulances on standby
                </div>
              </div>

              <div className={styles.emergencyCard}>
                <div className={styles.emergencyCardTitle}>
                  <Navigation /> Nearest Exit
                </div>
                <div className={styles.emergencyCardText}>
                  Gate B (East) — 3 minute walk{'\n'}
                  Currently at 89% throughput{'\n'}
                  Follow illuminated exit signs
                </div>
              </div>

              <div className={styles.emergencyCard}>
                <div className={styles.emergencyCardTitle}>
                  <Shield /> Security Contact
                </div>
                <div className={styles.emergencyCardText}>
                  365 security personnel on duty{'\n'}
                  Nearest steward: Section 108 Aisle{'\n'}
                  Response time: under 3 minutes
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Tab Bar */}
        <div className={styles.tabBar}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tabItem} ${activeTab === tab.id ? styles.active : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FanCompanion;
