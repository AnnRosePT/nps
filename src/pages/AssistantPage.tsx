import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Mic, MicOff, Bot, User, Volume2, VolumeX, Sparkles, RotateCcw } from 'lucide-react';
import { resolveAssistantQuery, getDefaultWelcomeMessage, PROMPT_SUGGESTIONS } from '@/lib/assistantKnowledge';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function AssistantPage() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: getDefaultWelcomeMessage() },
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  // Clean up any ongoing TTS on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakText = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Strip markdown formatting for cleaner speech narration
    const cleanText = text.replace(/[*#_`|\[\]]/g, '').replace(/- /g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-IN';
    utterance.rate = 0.95;

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: resolveAssistantQuery(text),
      };
      setMessages((prev) => [...prev, reply]);
    }, 500);
  }, []);

  const toggleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
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

  const handleResetChat = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setSpeakingId(null);
    setMessages([{ id: Date.now().toString(), role: 'assistant', content: getDefaultWelcomeMessage() }]);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col p-4 md:p-8 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">{t('chat.title')}</h1>
          <p className="text-sm text-muted-foreground">Ask any questions in English, Hindi, Tamil, or Malayalam</p>
        </div>
        <Button variant="ghost" size="sm" onClick={handleResetChat} className="gap-2 text-muted-foreground hover:text-foreground">
          <RotateCcw className="h-4 w-4" />
          <span className="hidden sm:inline">Reset Chat</span>
        </Button>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        <Sparkles className="h-4 w-4 text-accent shrink-0" />
        {PROMPT_SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => sendMessage(suggestion)}
            className="shrink-0 rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-primary hover:text-primary hover:bg-primary/5 active:scale-95"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 rounded-xl border border-border bg-card p-4 md:p-6 shadow-sm">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Bot className="h-5 w-5" />
                </div>
              )}
              <div
                className={`group relative max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm senior-text-boost ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                {msg.role === 'assistant' ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none space-y-2 leading-relaxed">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="whitespace-pre-line">{msg.content}</div>
                )}

                {/* Read aloud TTS button for Assistant responses */}
                {msg.role === 'assistant' && (
                  <button
                    onClick={() => speakText(msg.id, msg.content)}
                    className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition"
                    title={speakingId === msg.id ? 'Stop listening' : 'Listen to this explanation'}
                    aria-label={speakingId === msg.id ? 'Stop listening' : 'Listen to this explanation'}
                  >
                    {speakingId === msg.id ? (
                      <>
                        <VolumeX className="h-3.5 w-3.5 text-destructive" />
                        <span className="text-destructive font-medium">Stop audio</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="h-3.5 w-3.5" />
                        <span>Listen</span>
                      </>
                    )}
                  </button>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent">
                  <User className="h-5 w-5" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input Form */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleVoice}
          className={`shrink-0 h-12 w-12 rounded-xl transition ${
            isListening ? 'bg-destructive text-destructive-foreground animate-pulse' : ''
          }`}
          aria-label={isListening ? 'Stop listening' : 'Start voice input'}
        >
          {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
          placeholder={isListening ? 'Listening to your voice...' : t('chat.placeholder')}
          className="h-12 text-base senior-text-boost rounded-xl"
          aria-label={t('chat.placeholder')}
        />
        <Button
          onClick={() => sendMessage(input)}
          disabled={!input.trim()}
          size="icon"
          className="shrink-0 h-12 w-12 rounded-xl"
          aria-label={t('chat.send')}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
