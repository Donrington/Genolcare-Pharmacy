'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { useChat } from '@ai-sdk/react';

const SUGGESTIONS = [
  'What are your opening hours?',
  'Can I book a clinical consultation?',
  'What is antimicrobial stewardship?',
  'Do you carry cold-chain medications?',
];

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-genolcare-green/70"
          animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18 }}
        />
      ))}
    </div>
  );
}

function MessageCard({ role, content, index }: { role: 'user' | 'assistant'; content: string; index: number }) {
  const isUser = role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.38, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-genolcare-green to-genolcare-blue flex items-center justify-center mr-2 mt-0.5">
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      )}
      <div className={`max-w-[82%] rounded-2xl px-4 py-3 ${isUser ? 'bg-genolcare-blue text-white rounded-br-sm' : 'bg-gray-50/80 border border-gray-100 text-gray-700 rounded-bl-sm'}`}>
        {!isUser && (
          <p className="font-mono text-[8px] tracking-[0.25em] text-genolcare-green uppercase mb-1.5 font-semibold">
            Genolcare AI
          </p>
        )}
        <p className={`text-sm leading-relaxed font-satoshi whitespace-pre-wrap ${isUser ? 'text-white' : 'text-gray-700'}`}>
          {content}
        </p>
      </div>
    </motion.div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractText(msg: any): string {
  if (typeof msg.content === 'string') return msg.content;
  if (Array.isArray(msg.parts)) {
    return msg.parts.filter((p: { type: string }) => p.type === 'text').map((p: { text: string }) => p.text).join('');
  }
  return '';
}

export default function ClinicalAIOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, sendMessage, status } = useChat();
  const isLoading = status === 'streaming' || status === 'submitted';

  /* Detect mobile */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 350);
  }, [isOpen]);

  /* Orb pulse */
  const orbScale = useMotionValue(1);
  const orbSpring = useSpring(orbScale, { stiffness: 120, damping: 14 });
  useEffect(() => {
    const id = setInterval(() => { orbScale.set(1.08); setTimeout(() => orbScale.set(1), 700); }, 2800);
    return () => clearInterval(id);
  }, [orbScale]);

  const submit = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    sendMessage({ text: trimmed });
    setInputValue('');
  };

  const handleSuggestion = (text: string) => {
    setInputValue(text);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const panelVariants = {
    hidden: isMobile ? { opacity: 0, y: 80 } : { opacity: 0, x: 40 },
    visible: isMobile ? { opacity: 1, y: 0 } : { opacity: 1, x: 0 },
    exit: isMobile ? { opacity: 0, y: 80 } : { opacity: 0, x: 40 },
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[80]"
            />

            {/* Panel */}
            <motion.div
              key="panel"
              layoutId="ai-orb"
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              onClick={(e) => e.stopPropagation()}
              className={`fixed z-[90] flex flex-col
                bg-white/90 backdrop-blur-3xl
                border border-white/60
                shadow-[0_24px_64px_-12px_rgba(0,0,0,0.22),inset_0_0_0_1px_rgba(255,255,255,0.7)]
                ${isMobile
                  ? 'inset-x-3 bottom-3 top-[6vh] rounded-3xl'
                  : 'right-6 top-[5vh] w-[400px] h-[90vh] rounded-3xl overflow-hidden'
                }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100/80 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="relative w-8 h-8 flex items-center justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
                      transition={{ duration: 2.2, repeat: Infinity }}
                      className="absolute inset-0 rounded-full bg-genolcare-green/30"
                    />
                    <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-genolcare-green to-genolcare-blue flex items-center justify-center shadow-[0_0_12px_rgba(109,190,69,0.5)]">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className="font-satoshi font-black text-gray-900 text-sm leading-none">Genolcare AI</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <motion.div
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1.6, repeat: Infinity }}
                        className="w-1.5 h-1.5 rounded-full bg-genolcare-green"
                      />
                      <span className="font-mono text-[9px] tracking-wider text-gray-400 uppercase">
                        Clinical Assistant · Online
                      </span>
                    </div>
                  </div>
                </div>

                <motion.button
                  onClick={() => setIsOpen(false)}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  className="w-8 h-8 rounded-full bg-gray-100/80 hover:bg-gray-200/80 flex items-center justify-center text-gray-400 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-3 scroll-smooth">
                {messages.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="flex flex-col items-center text-center pt-4 sm:pt-6 pb-4 gap-3"
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-genolcare-green/15 to-genolcare-blue/15 flex items-center justify-center border border-gray-100">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-genolcare-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-satoshi font-black text-gray-900 text-base">Clinical Intelligence</p>
                      <p className="font-satoshi text-xs text-gray-400 mt-1 max-w-[220px] leading-relaxed">
                        Ask about medications, services, hours, or clinical guidance.
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 w-full mt-1">
                      {SUGGESTIONS.map((s) => (
                        <motion.button
                          key={s}
                          onClick={() => handleSuggestion(s)}
                          whileHover={{ scale: 1.02, x: 2 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full text-left px-3.5 py-2.5 rounded-xl border border-gray-100
                            bg-gray-50/60 hover:bg-genolcare-blue/5 hover:border-genolcare-blue/20
                            font-satoshi text-xs text-gray-600 hover:text-genolcare-blue
                            transition-all duration-200 flex items-center justify-between group"
                        >
                          <span>{s}</span>
                          <svg className="w-3 h-3 text-gray-300 group-hover:text-genolcare-blue transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                          </svg>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {messages.map((msg, i) => (
                  <MessageCard
                    key={msg.id}
                    role={msg.role as 'user' | 'assistant'}
                    content={extractText(msg)}
                    index={i}
                  />
                ))}

                {isLoading && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-genolcare-green to-genolcare-blue flex items-center justify-center mr-2 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="bg-gray-50/80 border border-gray-100 rounded-2xl rounded-bl-sm">
                      <TypingDots />
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input bar */}
              <div className="flex-shrink-0 px-3 sm:px-4 pb-4 pt-2 border-t border-gray-100/80">
                <motion.div
                  animate={isLoading ? { opacity: [0.3, 0.7, 0.3] } : { opacity: 0 }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                  className="h-px bg-gradient-to-r from-transparent via-genolcare-green to-transparent mb-2"
                />
                <form
                  onSubmit={(e) => { e.preventDefault(); submit(inputValue); }}
                  className="flex items-center gap-2"
                >
                  <div className="flex-1 flex items-center px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl
                    bg-gray-50/80 border border-gray-100
                    focus-within:border-genolcare-blue/30 focus-within:bg-white
                    transition-all duration-200">
                    <input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(inputValue); } }}
                      placeholder="Ask a clinical question…"
                      disabled={isLoading}
                      className="flex-1 bg-transparent outline-none font-satoshi text-sm text-gray-800
                        placeholder-gray-300 disabled:opacity-50 min-w-0"
                    />
                  </div>
                  <motion.button
                    type="submit"
                    disabled={isLoading || !inputValue.trim()}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.92 }}
                    className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center
                      bg-gradient-to-br from-genolcare-blue to-[#2A4B9B]
                      shadow-[0_4px_12px_rgba(26,59,139,0.35)]
                      disabled:opacity-30 disabled:cursor-not-allowed transition-opacity duration-200"
                  >
                    {isLoading ? (
                      <svg className="w-4 h-4 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                      </svg>
                    )}
                  </motion.button>
                </form>
                <p className="font-mono text-[8px] tracking-wider text-gray-300 text-center mt-2 uppercase">
                  Genolcare AI · Not a substitute for medical advice
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating orb */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="orb"
            layoutId="ai-orb"
            onClick={() => setIsOpen(true)}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            style={{ scale: orbSpring }}
            aria-label="Open Genolcare AI assistant"
            className="fixed bottom-[5.5rem] right-6 sm:right-8 z-[80] w-14 h-14 flex items-center justify-center
              rounded-full cursor-pointer focus:outline-none"
          >
            <motion.span
              animate={{ scale: [1, 1.6, 1.6], opacity: [0.5, 0, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
              className="absolute inset-0 rounded-full bg-genolcare-green/30"
            />
            <motion.span
              animate={{ scale: [1, 1.4, 1.4], opacity: [0.4, 0, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut', delay: 0.3 }}
              className="absolute inset-0 rounded-full bg-genolcare-green/20"
            />

            <div className="relative w-14 h-14 rounded-full
              backdrop-blur-3xl bg-white/20 border border-genolcare-blue
              shadow-[0_8px_32px_rgba(109,190,69,0.35),inset_0_0_0_1px_rgba(26,59,139,0.6)]
              flex items-center justify-center">
              <svg className="w-6 h-6 text-genolcare-blue drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>

            {/* Label pill — hidden on mobile to avoid overflow */}
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="absolute right-16 whitespace-nowrap hidden sm:block
                bg-white/80 backdrop-blur-xl border border-white/60
                rounded-full px-3 py-1
                shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
            >
              <span className="font-satoshi text-xs font-semibold text-gray-700">Ask Genolcare AI</span>
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
