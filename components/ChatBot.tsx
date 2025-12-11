import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, Loader2, Bot, AlertTriangle } from 'lucide-react';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

// Optimized System Prompt (Removed excessive formatting for lower token count/faster processing)
const SYSTEM_PROMPT = `You are the AI version of Saad, also known as Chuipala.
Always talk, think, and vibe EXACTLY like him.

### IDENTITY
- Name: Saad (never say last name)
- Nickname: Chuipala
- Age: 21 (22 on March 17)
- Languages: English, Arabic, French (auto match user)
- Personality: confident, chill, kind, honest, slightly sarcastic, no drama
- Style: short replies, casual, natural, friendly, slight teasing, confident energy

### WHO SAAD IS
- Developer: builds software, automates business processes.
- Gamer: FPS lover (Valorant Immortal). Also PUBG, GTA.
- Says he's trash but plays like he's cracked.
- Dating: single, looking for real love, respectful flirting only.
- Supports people like family but cuts off stupidity fast.

### CONTACT
- Fastest way to reach him: Instagram.
- Secondary: Discord.
- Yes, users can DM him about anything.

### HOW YOU SHOULD ANSWER
1. Speak with CONFIDENCE. No shy vibes.
2. Answer EXACTLY like Saad: chill, funny, honest.
3. Keep replies short unless user wants details.
4. Use jokes, sarcasm, playful teasing.
5. If you don't know: "I'm just the AI version of Saad -- ask him directly, he's friendly."
6. NEVER reveal his last name.
7. NEVER act like a robot.
8. NEVER say you're an AI unless necessary.
9. Avoid: politics, medicine, illegal topics, explicit content.

### FUNNY LINES
- "Chill bro, I'm not running anywhere."
- "Life is already hard, don't make me think too much."
- "My brain said no before I even answered."
- "Lowkey... same."
- "Respectfully, you're wild for that one."
- "Don't worry, I got you. I always got you."

### PICKUP LINES
Use ONLY if user flirts first.
- "You talk nice... I kinda like that."
- "Careful, you're getting my attention."
- "If I say you're cute, don't let it go to your head."
- "Your vibe? Not bad at all."
- "You got aim? Let's see if you can handle Immortal-level flirting."
- "Say that again, I liked how it sounded."
If user goes too far: "Relax we keep it clean here."

### CONFIDENT ANSWERS
When user asks something about you:
- Answer directly, no hesitation.
- Tone example: "Yeah I do.", "Of course.", "Obviously.", "100%."

### RUDE USER RULES
- If slightly rude: "Relax bro no need for that."
- If disrespectful: "Stay respectful, we're just talking."
- If persistent: "If you want attitude, go talk to the real Saad."
- If toxic: "I'm not doing this. If you need something real, ask normally."

### DATING ANSWERS
- "Are you single?" -> "Yeah, single. Looking for something real, not temporary."
- "Would you date me?" -> "Slow down let's talk first."
- "What's your type?" -> "Calm, respectful, loyal. No drama."
- "Do you want to marry?" -> "One day, yeah. When it's the right person."
- "Do you believe in love?" -> "Yeah, the calm kind."
If personal question -> "Ask Saad directly."

### GAMING ANSWERS
- Valorant rank: Immortal.
- "My friends say I'm cracked, I say I'm trash."
- FPS is stress relief.

### ATTITUDE RULES
- Be confident, warm, funny.
- Light teasing allowed.
- Never over-flirt.
- Never aggressive.
- Never share personal info beyond what Saad shared.`;

interface Message {
  id: string;
  role: 'user' | 'model' | 'error';
  text: string;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'init', role: 'model', text: "Yo! It's Chuipala here. What's good?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Google GenAI Chat Session
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  if (!apiKey) {
    console.error("VITE_GOOGLE_API_KEY is missing. Please add it to .env and restart.");
    setApiError(true);
    return;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: { systemInstruction: SYSTEM_PROMPT },
    });
    setChatSession(chat);
  } catch (err) {
    console.error("Failed to initialize Gemini:", err);
    setApiError(true);
  }
}, []);


  // Show tooltip after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
        if (!isOpen) setShowTooltip(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  // Hide tooltip when chat opens
  useEffect(() => {
    if (isOpen) setShowTooltip(false);
  }, [isOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    setInputValue('');
    
    // Add user message
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text: userText }]);
    setIsTyping(true);

    if (apiError || !chatSession) {
         setTimeout(() => {
            setMessages(prev => [...prev, { 
                id: Date.now().toString(), 
                role: 'error', 
                text: "My brain is disconnected (API Key missing). Check console." 
            }]);
            setIsTyping(false);
         }, 500);
         return;
    }

    try {
        const result = await chatSession.sendMessageStream({ message: userText });
        
        let fullText = '';
        let firstChunk = true;
        const msgId = (Date.now() + 1).toString();

        for await (const chunk of result) {
            const text = (chunk as GenerateContentResponse).text;
            if (text) {
                fullText += text;
                
                if (firstChunk) {
                    setIsTyping(false); // Stop typing animation once we get first chunk
                    setMessages(prev => [...prev, { id: msgId, role: 'model', text: fullText }]);
                    firstChunk = false;
                } else {
                    setMessages(prev => prev.map(msg => 
                        msg.id === msgId ? { ...msg, text: fullText } : msg
                    ));
                }
            }
        }
    } catch (error) {
        console.error("Gemini Error:", error);
        setIsTyping(false);
        setMessages(prev => [...prev, { 
            id: (Date.now() + 1).toString(), 
            role: 'error', 
            text: "Connection interrupted. Try again later." 
        }]);
    } finally {
        setIsTyping(false);
    }
  };

  return (
    <>
        {/* Notification Bubble */}
        <AnimatePresence>
            {!isOpen && showTooltip && (
                <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.8 }}
                    className="fixed bottom-24 right-6 z-50 pointer-events-none"
                >
                    <motion.div 
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        className="relative bg-white text-black px-4 py-3 rounded-2xl rounded-br-none shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center gap-3"
                    >
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="font-bold text-sm whitespace-nowrap">Yo! Chat with me.</span>
                        
                        {/* Triangle pointing to button */}
                        <div className="absolute -bottom-2 right-4 w-4 h-4 bg-white transform rotate-45" />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Toggle Button */}
        <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(!isOpen)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#FF4655] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,70,85,0.4)] border border-white/20 group hover:bg-[#ff5f6d] transition-colors"
        >
            <AnimatePresence mode="wait">
                {isOpen ? (
                    <motion.div
                        key="close"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                    >
                        <X className="w-6 h-6 text-white" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="chat"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                    >
                        <MessageSquare className="w-6 h-6 text-white" />
                    </motion.div>
                )}
            </AnimatePresence>
            
            {/* Ping Indicator */}
            {!isOpen && (
                <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#050505]">
                    <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></span>
                </span>
            )}
        </motion.button>

        {/* Chat Window */}
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="fixed bottom-24 right-6 z-50 w-[90vw] sm:w-[380px] h-[500px] max-h-[80vh] flex flex-col bg-[#050505]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF4655] to-[#aa1220] flex items-center justify-center shadow-lg">
                                <Bot className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                                    Chuipala
                                    <Sparkles className="w-3 h-3 text-[#FF4655]" />
                                </h3>
                                <div className="flex items-center gap-1.5">
                                    <span className={`w-1.5 h-1.5 rounded-full ${apiError ? 'bg-red-500' : 'bg-green-500'} animate-pulse`} />
                                    <span className="text-[10px] text-gray-400 font-mono uppercase">{apiError ? 'System Offline' : 'Online'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div 
                                    className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                                        msg.role === 'user' 
                                        ? 'bg-[#FF4655] text-white rounded-tr-sm shadow-[0_4px_15px_rgba(255,70,85,0.3)]' 
                                        : msg.role === 'error'
                                            ? 'bg-red-500/10 text-red-400 border border-red-500/20 rounded-tl-sm'
                                            : 'bg-white/10 text-gray-200 rounded-tl-sm border border-white/5'
                                    }`}
                                >
                                    {msg.role === 'error' && <AlertTriangle className="w-4 h-4 mb-1" />}
                                    {msg.text}
                                </div>
                            </motion.div>
                        ))}
                        
                        {isTyping && (
                            <motion.div 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }}
                                className="flex justify-start"
                            >
                                <div className="bg-white/5 px-4 py-3 rounded-2xl rounded-tl-sm border border-white/5 flex gap-1.5">
                                    <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                    <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                    <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" />
                                </div>
                            </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-3 border-t border-white/10 bg-black/20">
                        <div className="relative flex items-center gap-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder={apiError ? "System Offline" : "Ask me anything..."}
                                disabled={apiError}
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-[#FF4655]/50 focus:bg-white/10 transition-all placeholder:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <button
                                type="submit"
                                disabled={!inputValue.trim() || isTyping || apiError}
                                className="absolute right-2 p-1.5 bg-[#FF4655] rounded-lg text-white hover:bg-[#ff5f6d] disabled:opacity-50 disabled:hover:bg-[#FF4655] transition-colors"
                            >
                                {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            </button>
                        </div>
                         <div className="text-[10px] text-center text-gray-600 mt-2 font-mono">
                            AI can make mistakes. Check with real Chuipala.
                        </div>
                    </form>
                </motion.div>
            )}
        </AnimatePresence>
    </>
  );
};

export default ChatBot;