import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Mic, MicOff, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const npsResponses: Record<string, string> = {
  'what is nps': 'The **National Pension System (NPS)** is a voluntary, long-term retirement savings scheme designed to enable systematic savings. It is regulated by PFRDA and available to all Indian citizens aged 18-70.\n\n**Key features:**\n- Tax benefits under Section 80CCD\n- Choice of fund managers\n- Two account types: Tier 1 (mandatory) and Tier 2 (voluntary)\n- Partial withdrawal allowed after 3 years',
  'nps tier 1': '**NPS Tier 1** is the primary pension account:\n- Mandatory for government employees, voluntary for others\n- Minimum ₹500 per contribution\n- Tax deduction up to ₹2 lakh (Sec 80CCD)\n- Withdrawal restricted until age 60\n- 60% can be withdrawn tax-free at maturity\n- 40% must be used to purchase annuity',
  'withdraw': 'You can withdraw from NPS under these conditions:\n\n**At Retirement (age 60):**\n- 60% as lump sum (tax-free)\n- 40% used to buy annuity (monthly pension)\n\n**Before 60 (Premature):**\n- Allowed after 3 years\n- 20% lump sum, 80% annuity\n\n**Partial Withdrawal:**\n- Allowed after 3 years for specific purposes (education, medical, house)',
  'default': 'I can help you understand NPS! Try asking:\n- "What is NPS?"\n- "What is NPS Tier 1?"\n- "When can I withdraw?"\n- "How much pension will I get?"\n\nI\'m here to simplify pension planning for you. 🙏',
};

function getResponse(query: string): string {
  const q = query.toLowerCase();
  if (q.includes('tier 1') || q.includes('tier-1')) return npsResponses['nps tier 1'];
  if (q.includes('what is nps') || q.includes('nps kya') || q.includes('explain nps')) return npsResponses['what is nps'];
  if (q.includes('withdraw') || q.includes('nikalna') || q.includes('pension kab')) return npsResponses['withdraw'];
  if (q.includes('how much') || q.includes('kitni pension') || q.includes('projection')) {
    return 'Based on average contributions, you can estimate your pension using our **Pension Simulator**. Go to the Simulator page to input your details and see projections for Conservative, Balanced, and Aggressive scenarios.';
  }
  return npsResponses['default'];
}

export default function AssistantPage() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: npsResponses['default'] },
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const reply: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: getResponse(text) };
      setMessages((prev) => [...prev, reply]);
    }, 800);
  };

  const toggleVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (isListening) {
      setIsListening(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      sendMessage(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
    setIsListening(true);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col p-4 md:p-8">
      <h1 className="mb-4 font-display text-3xl font-bold text-foreground">{t('chat.title')}</h1>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 rounded-xl border border-border bg-card p-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
              )}
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm senior-text-boost whitespace-pre-line ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                {msg.content}
              </div>
              {msg.role === 'user' && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/20">
                  <User className="h-5 w-5 text-accent" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div className="mt-4 flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleVoice}
          className={`shrink-0 h-12 w-12 rounded-xl ${isListening ? 'bg-destructive text-destructive-foreground animate-pulse-gentle' : ''}`}
          aria-label={isListening ? t('chat.listening') : t('chat.voice')}
        >
          {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
          placeholder={t('chat.placeholder')}
          className="h-12 text-base senior-text-boost rounded-xl"
          aria-label={t('chat.placeholder')}
        />
        <Button onClick={() => sendMessage(input)} size="icon" className="shrink-0 h-12 w-12 rounded-xl" aria-label={t('chat.send')}>
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
