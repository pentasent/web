'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, ArrowRight, Sparkles, RefreshCw } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  action?: {
    label: string;
    href: string;
  };
}

const INITIAL_GREETINGS = [
  "Hi there! 👋 I'm MAYA, your Pentasent guide.",
  "Whether you need evidence-based health calculators (like BMI, BMR, or Calories), info on clinical research, or details about our platform, I'm here to help.",
  'What would you like to explore today?',
];

const INITIAL_SUGGESTIONS = [
  'Calculate my BMI',
  'What is Pentasent?',
  'Pricing & Plans',
  'Explore Health Tools',
  'Careers & Open Roles',
  'Talk to Support',
];

// Allowlist for Maya chatbot visibility
const CHATBOT_ALLOWED_ROUTES = [
  '/',
  '/company/contact',
  '/legal/*',
];

function isRouteAllowed(pathname: string, allowedRoutes: string[]): boolean {
  return allowedRoutes.some((route) => {
    if (route.endsWith('/*')) {
      const prefix = route.slice(0, -2);
      return pathname === prefix || pathname.startsWith(`${prefix}/`);
    }
    return pathname === route;
  });
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeSuggestions, setActiveSuggestions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [isError, setIsError] = useState(false);

  // Session ref to cancel in-flight async loops on refresh / close
  const sessionRef = useRef(0);
  const messageIdCounterRef = useRef(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();

  const isAllowed = isRouteAllowed(pathname, CHATBOT_ALLOWED_ROUTES);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior, block: 'end' });
      // Direct scroll on the scroll-area viewport to guarantee 100% end alignment
      const scrollParent = messagesEndRef.current.closest(
        '[data-slot="scroll-area-viewport"]'
      ) as HTMLElement | null;
      if (scrollParent) {
        scrollParent.scrollTo({
          top: scrollParent.scrollHeight,
          behavior,
        });
      }
    }
  };

  // Smoothly scroll to bottom when messages, thinking state, or suggestions change
  useEffect(() => {
    scrollToBottom('smooth');

    // If suggestions just appeared, scroll as they expand so options are fully visible
    if (activeSuggestions.length > 0) {
      const t1 = setTimeout(() => scrollToBottom('smooth'), 80);
      const t2 = setTimeout(() => scrollToBottom('smooth'), 220);
      const t3 = setTimeout(() => scrollToBottom('smooth'), 380);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [messages, isBotThinking, activeSuggestions]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 350);
    }
  }, [isOpen]);

  // Play greeting sequence with cancellation checks and smooth pacing
  const playGreetingSequence = async (sessionId: number) => {
    for (let i = 0; i < INITIAL_GREETINGS.length; i++) {
      if (sessionRef.current !== sessionId) return;

      setIsBotThinking(true);
      await new Promise((resolve) => setTimeout(resolve, i === 0 ? 550 : 750));
      if (sessionRef.current !== sessionId) return;

      setIsBotThinking(false);

      const newMsg: ChatMessage = {
        id: `greeting-${sessionId}-${i}`,
        type: 'bot',
        content: INITIAL_GREETINGS[i],
      };

      setMessages((prev) => [...prev, newMsg]);

      // If it's the last greeting message, reveal suggestions after a gentle beat
      if (i === INITIAL_GREETINGS.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 350));
        if (sessionRef.current === sessionId) {
          setActiveSuggestions(INITIAL_SUGGESTIONS);
        }
      }
    }
  };

  // Open chat fresh every time
  const handleOpen = () => {
    const nextSession = ++sessionRef.current;
    setIsOpen(true);
    setMessages([]);
    setActiveSuggestions([]);
    setSelectedOption(null);
    setIsSelecting(false);
    setIsBotThinking(false);
    setIsError(false);
    setInputValue('');
    playGreetingSequence(nextSession);
  };

  // Close chat and reset completely so next open starts fresh
  const handleClose = () => {
    sessionRef.current++; // Cancels any running async sequences
    setIsOpen(false);
    setIsBotThinking(false);
    setIsError(false);
    setMessages([]);
    setInputValue('');
    setActiveSuggestions([]);
    setSelectedOption(null);
    setIsSelecting(false);
  };

  // Refresh conversation cleanly without duplicate messages
  const handleResetChat = () => {
    const nextSession = ++sessionRef.current; // Cancels previous loop
    setMessages([]);
    setActiveSuggestions([]);
    setSelectedOption(null);
    setIsSelecting(false);
    setIsBotThinking(false);
    setIsError(false);
    setInputValue('');
    playGreetingSequence(nextSession);
  };

  const sendMessage = async (userMessage: string) => {
    const trimmed = userMessage.trim();
    if (!trimmed || isBotThinking) return;

    const currentSession = sessionRef.current;
    messageIdCounterRef.current += 1;

    // 1. Add user message cleanly
    const userMsg: ChatMessage = {
      id: `user-${currentSession}-${messageIdCounterRef.current}`,
      type: 'user',
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsError(false);
    setIsBotThinking(true);

    try {
      // 2. Fetch intelligent response from API
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      });

      if (!res.ok) {
        throw new Error('API response failed');
      }

      const data = await res.json();
      if (sessionRef.current !== currentSession) return;

      const messageList: string[] = Array.isArray(data.messages)
        ? data.messages
        : [data.response || "I'm here to help. What would you like to know?"];

      const suggestions: string[] = Array.isArray(data.suggestions)
        ? data.suggestions
        : [];
      const action = data.action;

      // 3. Deliver multi-messages with smooth, human-like pacing
      for (let i = 0; i < messageList.length; i++) {
        if (sessionRef.current !== currentSession) return;

        // Realistic thinking pause between messages
        setIsBotThinking(true);
        await new Promise((resolve) =>
          setTimeout(resolve, i === 0 ? 800 : 750)
        );
        if (sessionRef.current !== currentSession) return;

        setIsBotThinking(false);

        const isLast = i === messageList.length - 1;
        messageIdCounterRef.current += 1;
        const botMsg: ChatMessage = {
          id: `bot-${currentSession}-${i}-${messageIdCounterRef.current}`,
          type: 'bot',
          content: messageList[i],
          action: isLast ? action : undefined,
        };

        setMessages((prev) => [...prev, botMsg]);

        // When the last message finishes, smoothly reveal the new suggestions
        if (isLast && suggestions.length > 0) {
          await new Promise((resolve) => setTimeout(resolve, 350));
          if (sessionRef.current === currentSession) {
            setActiveSuggestions(suggestions);
          }
        }
      }
    } catch (err) {
      console.error('Chat error:', err);
      if (sessionRef.current !== currentSession) return;

      setIsError(true);
      setIsBotThinking(false);
      messageIdCounterRef.current += 1;
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${currentSession}-${messageIdCounterRef.current}`,
          type: 'bot',
          content:
            "I'm having a brief connection issue. Please feel free to try again or reach our team at support@pentasent.com.",
        },
      ]);
      setActiveSuggestions([
        'Explore Health Tools',
        'What is Pentasent?',
        'Contact Pentasent',
      ]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (isBotThinking || isSelecting) return;
    setIsSelecting(true);
    setSelectedOption(suggestion);

    // Smoothly fold away suggestions with height collapse
    setActiveSuggestions([]);

    // Send the user message
    sendMessage(suggestion);

    setTimeout(() => {
      setSelectedOption(null);
      setIsSelecting(false);
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isBotThinking || isSelecting) return;
    setActiveSuggestions([]);
    sendMessage(inputValue);
  };

  if (!isAllowed) {
    return null;
  }

  return (
    <>
      {/* Floating Maya Launch Button */}
      <motion.button
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 cursor-pointer"
        initial={{ opacity: 0, scale: 0.85, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleOpen}
        aria-label="Open Maya Assistant"
      >
        <div className="relative group">
          {/* Subtle Outer Glow */}
          <div className="absolute -inset-1 rounded-full bg-linear-to-r from-primary via-chart-3 to-primary opacity-30 blur-sm group-hover:opacity-60 transition duration-300" />

          {/* Trigger Container */}
          <div className="relative flex items-center gap-2.5 rounded-full bg-primary pl-2 pr-4 py-1.5 text-white shadow-lg border border-white/20">
            <div className="relative h-11 w-11 shrink-0">
              {/* Avatar */}
              <div className="h-11 w-11 rounded-full overflow-hidden bg-primary border-2 border-chart-3">
                <Image
                  src="/assets/images/avatars/chars/maya-four.png"
                  alt="Maya AI"
                  width={88}
                  height={88}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>

              {/* Online Ping Dot */}
              <span className="absolute bottom-0 right-0 h-2 w-2 -translate-x-0.5 -translate-y-1 rounded-full bg-emerald-500" />
            </div>

            <div className="flex flex-col text-left">
              <span className="text-[13px] font-bold leading-tight tracking-tight flex items-center gap-1">
                <span>Ask MAYA</span>
                <Sparkles className="w-3 h-3 text-chart-3" />
              </span>
              <span className="text-[10.5px] text-white/75 leading-tight">
                Healthcare Guide
              </span>
            </div>
          </div>
        </div>
      </motion.button>

      {/* Main Chat Drawer Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-0 right-0 z-50 flex h-full min-h-0 w-full flex-col overflow-hidden bg-white shadow-2xl border border-border-2/80 md:bottom-20 md:right-6 md:h-155 md:max-h-[85vh] md:w-102.5 md:rounded-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-primary px-4 py-3.5 text-white md:rounded-t-2xl shadow-xs shrink-0">
              <div className="flex items-center gap-3">
                {/* Maya Avatar with Gradient Halo */}
                <div className="relative">
                  <div className="rounded-full bg-linear-to-tr from-chart-3 via-white/40 to-chart-4 p-0.5">
                    <div className="h-10 w-10 rounded-full overflow-hidden bg-primary">
                      <Image
                        src="/assets/images/avatars/chars/maya-four.png"
                        alt="Maya"
                        width={80}
                        height={80}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-primary bg-emerald-500 animate-pulse" />
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-[15px] font-bold leading-tight">MAYA</h2>
                    <span className="text-[9.5px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-white/15 text-chart-3 font-semibold">
                      Verified AI
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-1 text-[11px] text-white/80">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span>Pentasent Healthcare Guide</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Reset & Close */}
              <div className="flex items-center gap-1">
                <Button
                  onClick={handleResetChat}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-white/80 hover:bg-white/10 hover:text-white cursor-pointer"
                  title="Restart conversation"
                  aria-label="Restart conversation"
                >
                  <RefreshCw size={15} />
                </Button>
                <Button
                  onClick={handleClose}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-white/80 hover:bg-white/10 hover:text-white cursor-pointer"
                  aria-label="Close chat"
                >
                  <X size={18} />
                </Button>
              </div>
            </div>

            {/* Educational Health Advisory Sub-Header */}
            <div className="bg-border-background border-b border-border-2 px-3 py-1.5 text-[10.5px] text-muted-foreground flex items-center justify-between shrink-0">
              <span>Evidence-based guidance • Not medical advice</span>
              <Link
                href="/tools"
                onClick={handleClose}
                className="text-primary hover:underline font-medium"
              >
                Tools
              </Link>
            </div>

            {/* Chat Messages (Scrollable Container) */}
            <ScrollArea className="flex-1 px-4 py-3 min-h-0 bg-white">
              <div className="space-y-3 pb-4">
                {messages.map((message) => {
                  const isUser = message.type === 'user';

                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className={`flex flex-col ${
                        isUser ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div className="flex items-end gap-2 max-w-[88%]">
                        {!isUser && (
                          <div className="h-6 w-6 rounded-full overflow-hidden shrink-0 mb-1 border border-primary/20">
                            <Image
                              src="/assets/images/avatars/chars/maya-four.png"
                              alt="Maya"
                              width={24}
                              height={24}
                              className="object-cover"
                            />
                          </div>
                        )}

                        <div
                          className={`px-3.5 py-2.5 text-[13.5px] leading-[1.6] ${
                            isUser
                              ? 'bg-primary text-white rounded-2xl rounded-br-xs shadow-xs'
                              : 'bg-border-background text-foreground border border-border-2/70 rounded-2xl rounded-bl-xs'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{message.content}</p>

                          {/* Direct Navigation Action Button */}
                          {message.action && (
                            <div className="mt-2.5 pt-2 border-t border-border-2/50">
                              <Link
                                href={message.action.href}
                                onClick={handleClose}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-chart-3 text-secondary text-xs font-semibold hover:bg-chart-4 transition-colors"
                              >
                                <span>{message.action.label}</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Animated Thinking Bubble Indicator on Maya's Side */}
                {isBotThinking && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-end gap-2 my-2"
                  >
                    <div className="h-6 w-6 rounded-full overflow-hidden shrink-0 mb-1 border border-primary/20">
                      <Image
                        src="/assets/images/avatars/chars/maya-four.png"
                        alt="Maya thinking"
                        width={24}
                        height={24}
                        className="object-cover"
                      />
                    </div>
                    <div className="bg-border-background border border-border-2/70 px-4 py-3 rounded-2xl rounded-bl-xs flex items-center gap-1.5 shadow-xs">
                      <span className="h-2 w-2 rounded-full bg-primary/70 animate-bounce animation-duration:[1s] [animation-delay:-0.32s]" />
                      <span className="h-2 w-2 rounded-full bg-primary/70 animate-bounce animation-duration:[1s] [animation-delay:-0.16s]" />
                      <span className="h-2 w-2 rounded-full bg-primary/70 animate-bounce animation-duration:[1s]" />
                    </div>
                  </motion.div>
                )}

                {/* Active Suggestion Chips - Smooth height collapse without layout jump */}
                <AnimatePresence>
                  {activeSuggestions.length > 0 && (
                    <motion.div
                      key="active-suggestions-shelf"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{
                        opacity: 0,
                        height: 0,
                        transition: {
                          opacity: { duration: 0.2 },
                          height: { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
                        },
                      }}
                      className="overflow-hidden"
                    >
                      <div className="pt-2 pb-1 pl-8 flex flex-wrap gap-1.5">
                        {activeSuggestions.map((suggestion, sIdx) => {
                          const isSelected = selectedOption === suggestion;
                          return (
                            <button
                              key={`sug-${sIdx}-${suggestion}`}
                              type="button"
                              onClick={() => handleSuggestionClick(suggestion)}
                              disabled={isBotThinking || isSelecting}
                              className={`rounded-full border text-left text-[11.5px] font-medium transition-all duration-200 cursor-pointer disabled:cursor-not-allowed ${
                                isSelected
                                  ? 'bg-primary text-white border-primary scale-[0.98]'
                                  : 'border-primary/20 bg-primary/5 hover:bg-primary hover:text-white text-foreground'
                              } px-3 py-1.5 shadow-2xs`}
                            >
                              {suggestion}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div ref={messagesEndRef} className="h-1 w-full shrink-0" />
              </div>
            </ScrollArea>

            {/* Input Form Footer */}
            <div className="p-3 border-t border-border-2 bg-white md:rounded-b-2xl shrink-0">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask Maya about calculators, health, plans..."
                  className="flex-1 py-2.5 px-4 text-xs sm:text-sm bg-border-background border border-border-2 rounded-full text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  disabled={isBotThinking || isSelecting}
                />
                <Button
                  type="submit"
                  disabled={!inputValue.trim() || isBotThinking || isSelecting}
                  className="h-10 w-10 shrink-0 bg-primary text-white rounded-full hover:bg-primary-hover disabled:bg-muted disabled:text-muted-foreground disabled:opacity-70 disabled:cursor-not-allowed transition-all cursor-pointer"
                  aria-label="Send message"
                >
                  <Send size={16} />
                </Button>
              </form>

              {isError && (
                <p className="mt-1.5 text-center text-[11px] text-destructive">
                  Connection interrupted. Please try again.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}