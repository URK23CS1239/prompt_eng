import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  AlertTriangle, 
  User, 
  Trash2, 
  Copy, 
  Check, 
  ShieldAlert, 
  PhoneCall, 
  FileText, 
  HelpCircle,
  Stethoscope
} from 'lucide-react';
import { ChatMessage, MedicalReport } from '../types';

interface AIChatbotViewProps {
  currentReport?: MedicalReport | null;
  onNavigateTab: (tab: string) => void;
}

export const AIChatbotView: React.FC<AIChatbotViewProps> = ({ currentReport, onNavigateTab }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: `Hello! I am **MedExplain AI**, your personal health assistant. I can help explain medical terms, interpret lab biomarkers, suggest safe home remedies, and prepare questions for your doctor.\n\n*How can I help you understand your health today?*`,
      timestamp: 'Just now',
      urgencyLevel: 'routine',
      suggestedFollowUps: [
        'What does an elevated HbA1c mean?',
        'How do I safely manage a mild fever at home?',
        'Can I take Metformin on an empty stomach?',
        'When should chest discomfort be treated as an emergency?'
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [includeReportContext, setIncludeReportContext] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const reportContext = (includeReportContext && currentReport) 
        ? `Patient Name: ${currentReport.patientName}\nReport: ${currentReport.title} (${currentReport.date})\nSummary: ${currentReport.summary}\nBiomarkers: ${currentReport.biomarkers?.map(b => `${b.name}: ${b.value} (Status: ${b.status})`).join(', ')}`
        : undefined;

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: query,
          reportContext,
          messages: messages.slice(-4)
        })
      });

      const data = await res.json();

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'I could not process that request. Please speak with your healthcare provider.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        urgencyLevel: data.urgencyLevel || 'routine',
        suggestedFollowUps: data.suggestedFollowUps || []
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Error querying chat API:', err);
      const fallbackMsg: ChatMessage = {
        id: `bot-fallback-${Date.now()}`,
        sender: 'assistant',
        text: 'I apologize, but I encountered a connection interruption. Please consult your physician for health guidance.',
        timestamp: 'Just now',
        urgencyLevel: 'routine'
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'msg-welcome',
        sender: 'assistant',
        text: `Chat cleared. How else may I assist you with health or laboratory explanations?`,
        timestamp: 'Just now',
        urgencyLevel: 'routine',
        suggestedFollowUps: [
          'What does an elevated HbA1c mean?',
          'What are safe remedies for a sore throat?',
          'How does dietary fiber help lower LDL?'
        ]
      }
    ]);
  };

  return (
    <div className="bg-white rounded-2xl border border-sky-100 shadow-xs flex flex-col h-[750px] overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-100 bg-linear-to-r from-sky-50/60 to-white flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-slate-900 text-sm">MedExplain Clinical Health Chatbot</h2>
              <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Safe AI Online
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Plain-language symptom education & lab interpretations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentReport && (
            <label className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-lg cursor-pointer hover:bg-slate-50">
              <input
                type="checkbox"
                checked={includeReportContext}
                onChange={(e) => setIncludeReportContext(e.target.checked)}
                className="h-3.5 w-3.5 text-sky-600 rounded-sm"
              />
              <FileText className="w-3.5 h-3.5 text-sky-600" />
              <span>Use {currentReport.patientName}'s report context</span>
            </label>
          )}

          <button
            onClick={clearChat}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/30">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isUrgent = msg.urgencyLevel === 'urgent_consult';

          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white ${
                  isUrgent ? 'bg-rose-600' : 'bg-sky-600'
                }`}>
                  {isUrgent ? <ShieldAlert className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                </div>
              )}

              <div className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                isUser
                  ? 'bg-sky-600 text-white rounded-tr-xs shadow-xs'
                  : isUrgent
                  ? 'bg-rose-50 border-2 border-rose-300 text-rose-950 rounded-tl-xs shadow-xs'
                  : 'bg-white border border-slate-200/80 text-slate-800 rounded-tl-xs shadow-xs'
              }`}>
                {/* Emergency header if urgent */}
                {isUrgent && (
                  <div className="flex items-center gap-2 font-bold text-rose-700 text-xs mb-2 pb-2 border-b border-rose-200">
                    <PhoneCall className="w-4 h-4 text-rose-600 animate-bounce" />
                    <span>TRIAGE ALERT: PROMPT CLINICAL EVALUATION REQUIRED</span>
                  </div>
                )}

                {/* Message body with basic markdown formatting */}
                <div className="whitespace-pre-line space-y-2">
                  {msg.text}
                </div>

                {/* Footer and copy action */}
                <div className="mt-2.5 pt-2 border-t border-slate-100/60 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => copyToClipboard(msg.id, msg.text)}
                      className="hover:text-slate-600 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Follow-up suggestions */}
                {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <HelpCircle className="w-3 h-3 text-sky-500" />
                      Suggested Follow-up Questions:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestedFollowUps.map((fu, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(fu)}
                          className="text-[11px] text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg px-2.5 py-1 text-left cursor-pointer transition-colors"
                        >
                          {fu}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-lg bg-slate-700 text-white flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
            <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
            </div>
            <span>MedExplain AI is analyzing your medical query...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-3 sm:p-4 border-t border-slate-100 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a health question (e.g. 'What does high LDL mean?' or describe mild symptoms)..."
            className="flex-1 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white p-2.5 rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-2 text-[10px] text-slate-400 text-center flex items-center justify-center gap-2">
          <ShieldAlert className="w-3 h-3 text-amber-500" />
          <span>Educational AI only. Not a substitute for professional medical diagnosis or clinical treatment.</span>
        </div>
      </div>
    </div>
  );
};
