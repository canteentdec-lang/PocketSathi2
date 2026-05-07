import React, { useState, useEffect, useRef } from 'react';
import { Send, Trash2, Info, MessageSquare, Mic, Volume2, Waves, MoreVertical, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage, User, UserData } from '../types';
import { GoogleGenAI, Modality } from "@google/genai";
import { formatCurrency } from '../hooks/useData';

interface CoachProps {
  currentUser: User | null;
  userData: UserData;
  onUpdateUserData: (data: Partial<UserData>) => void;
  onLoginPrompt: () => void;
}

export default function Coach({ currentUser, userData, onUpdateUserData, onLoginPrompt }: CoachProps) {
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const guestHistory: ChatMessage[] = [
    { id: '1', role: 'coach', text: 'Namaste! I am your PocketSathi AI Coach. How can I help you today?', timestamp: new Date().toISOString() },
    { id: '2', role: 'user', text: 'How do I start a SIP?', timestamp: new Date().toISOString() },
    { id: '3', role: 'coach', text: 'Starting a SIP is easy! You just need a KYC-compliant bank account and a demat account. I recommend starting with Index Funds as they are low-cost and diversified.', timestamp: new Date().toISOString() },
  ];

  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioContext = useRef<AudioContext | null>(null);
  const recognition = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = 'en-IN';

      recognition.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleSendVoice(transcript);
        setIsListening(false);
      };

      recognition.current.onerror = () => setIsListening(false);
      recognition.current.onend = () => setIsListening(false);
    }
  }, []);

  useEffect(() => {
    if (isListening) {
      recognition.current?.start();
    } else {
      recognition.current?.stop();
    }
  }, [isListening]);

  const currentHistory = currentUser ? userData.chatHistory : guestHistory;

  const handleSendVoice = (text: string) => {
    if (!currentUser) return;
    
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: new Date().toISOString()
    };

    const coachText = getCoachResponse(text);
    const coachMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'coach',
      text: coachText,
      timestamp: new Date().toISOString()
    };

    onUpdateUserData({ chatHistory: [...userData.chatHistory, userMsg, coachMsg] });
    generateTTS(coachText);
  };

  const playAudioData = async (base64Audio: string) => {
    try {
      if (!audioContext.current) {
        audioContext.current = new AudioContext({ sampleRate: 24000 });
      }

      const binaryString = atob(base64Audio);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // The Gemini TTS returns raw PCM data (S16_LE)
      // We need to convert it to a Float32Array for Web Audio
      const int16Array = new Int16Array(bytes.buffer);
      const float32Array = new Float32Array(int16Array.length);
      for (let i = 0; i < int16Array.length; i++) {
        float32Array[i] = int16Array[i] / 32768.0;
      }

      const audioBuffer = audioContext.current.createBuffer(1, float32Array.length, 24000);
      audioBuffer.getChannelData(0).set(float32Array);

      const source = audioContext.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.current.destination);
      
      setIsSpeaking(true);
      source.onended = () => setIsSpeaking(false);
      source.start();
    } catch (error) {
      console.error("Audio playback failed:", error);
      setIsSpeaking(false);
    }
  };

  const generateTTS = async (text: string) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-tts-preview",
        contents: [{ parts: [{ text: `Say naturally: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Zephyr' }
            }
          }
        }
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        await playAudioData(base64Audio);
      }
    } catch (error) {
      console.error("TTS generation failed:", error);
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentUser) {
      onLoginPrompt();
      return;
    }
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date().toISOString()
    };

    const coachText = getCoachResponse(input);
    const coachMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'coach',
      text: coachText,
      timestamp: new Date().toISOString()
    };

    onUpdateUserData({ chatHistory: [...userData.chatHistory, userMsg, coachMsg] });
    setInput('');
    generateTTS(coachText);
  };

  const getCoachResponse = (text: string) => {
    const low = text.toLowerCase();
    if (low.includes('sip')) return "SIPs are the secret to wealth creation in India. Even ₹500/month can grow significantly over 15-20 years thanks to compounding!";
    if (low.includes('budget')) return "A good budget follows the 50:30:20 rule. I've updated your budget chart below based on your onboarding data.";
    if (low.includes('loan')) return "Loans can be traps if the interest rate is above 15% (Personal/Credit Card). Always check the APR using the Debt Detector tool below!";
    if (low.includes('upi')) return "UPI is great for convenience but bad for tracking small spends. Use my UPI Analyzer to see where your money is leaking.";
    if (low.includes('save')) return "Saving is the first step. Aim to save at least 20% of your income. It's not about how much you earn, but how much you keep.";
    if (low.includes('emi')) return "Keep your total EMIs below 40% of your take-home pay to avoid financial stress.";
    if (low.includes('invest')) return "Investing is better than just saving. Look into ELSS for tax saving and Index Funds for long term growth.";
    return "I'm a demo coach. Connect a Gemini API key in the settings for real-time AI financial advice tailored to your transactions!";
  };

  const clearChat = () => {
    if (confirm('Are you sure you want to clear your chat history?')) {
      onUpdateUserData({ chatHistory: [] });
    }
  };

  return (
    <section id="coach" className="flex-grow flex flex-col pt-8 pb-4 px-6 lg:px-8 bg-gray-50 dark:bg-brand-navy/50 h-[calc(100vh-80px)] overflow-hidden">
      <div className="max-w-7xl mx-auto w-full flex-grow flex flex-col overflow-y-auto pr-2 scrollbar-hide">
        <div className="flex flex-col md:flex-row gap-6 flex-grow">
          
          {/* Chat Interface */}
          <div className="flex-[2] flex flex-col h-full bg-white dark:bg-brand-navy border border-gray-200 dark:border-white/10 rounded-[2rem] overflow-hidden shadow-xl">
             <div className="p-6 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-brand-navy text-white">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-brand-amber flex items-center justify-center text-brand-navy">
                      <MessageSquare size={20} />
                   </div>
                   <div>
                      <h3 className="font-bold">PocketSathi Coach</h3>
                      <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">● Online</span>
                   </div>
                </div>
                {currentUser && currentHistory.length > 0 && (
                  <button onClick={clearChat} className="p-2 hover:bg-white/10 rounded-lg text-gray-400">
                    <Trash2 size={18} />
                  </button>
                )}
             </div>

             <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {currentHistory.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl ${
                      msg.role === 'user' 
                        ? 'bg-brand-amber text-brand-navy font-bold rounded-tr-none' 
                        : 'bg-gray-100 dark:bg-white/5 text-gray-800 dark:text-gray-200 rounded-tl-none'
                    }`}>
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <span className="text-[10px] opacity-50 mt-2 block">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
             </div>

             <form onSubmit={handleSend} className="p-4 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/2">
                <div className="relative">
                  <input
                    type="text"
                    disabled={!currentUser}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={currentUser ? "Ask anything about money..." : "Login to chat with me"}
                    className="w-full bg-white dark:bg-brand-navy border border-gray-200 dark:border-white/10 rounded-xl py-4 pl-6 pr-14 focus:outline-none focus:ring-2 focus:ring-brand-amber transition-all disabled:opacity-50"
                  />
                  <button 
                    type="submit"
                    disabled={!currentUser || !input.trim()}
                    className="absolute right-2 top-2 p-3 bg-brand-amber text-brand-navy rounded-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                  >
                    <Send size={20} />
                  </button>
                </div>
                {!currentUser && (
                  <p className="text-center text-[10px] text-gray-500 mt-2 uppercase font-bold tracking-tight">Logged-in users get persistent chat & insights</p>
                )}
             </form>
          </div>

          {/* Voice Agent UI */}
          <div className="flex-1 flex flex-col h-full bg-white dark:bg-brand-navy border border-gray-200 dark:border-white/10 rounded-[2rem] overflow-hidden shadow-xl">
             <div className="p-8 flex flex-col items-center justify-center h-full relative overflow-hidden bg-gradient-to-b from-brand-amber/5 to-transparent">
                <div className="absolute top-6 left-8 flex items-center gap-3 text-brand-amber">
                   <Waves size={24} />
                   <h3 className="font-display font-extrabold text-xl">Voice Agent</h3>
                </div>

                <div className="relative flex items-center justify-center py-20">
                   {/* Wave Visualization */}
                   <AnimatePresence>
                      {(isListening || isSpeaking) && (
                        <div className="absolute inset-0 flex items-center justify-center gap-1">
                           {[...Array(12)].map((_, i) => (
                             <motion.div
                               key={i}
                               initial={{ height: 4 }}
                               animate={{ 
                                 height: isListening ? [10, 40, 10] : [4, 60, 4] 
                               }}
                               transition={{ 
                                 duration: isListening ? 0.4 : 0.6, 
                                 repeat: Infinity,
                                 delay: i * 0.05
                               }}
                               className={`w-1 rounded-full ${isListening ? 'bg-brand-amber' : 'bg-emerald-500'}`}
                             />
                           ))}
                        </div>
                      )}
                   </AnimatePresence>

                   {/* Circular Avatar */}
                   <motion.div 
                     animate={{ 
                       scale: isListening ? [1, 1.1, 1] : 1,
                       boxShadow: isListening 
                         ? "0 0 40px rgba(247, 163, 37, 0.4)" 
                         : "0 0 20px rgba(0,0,0,0.1)"
                     }}
                     transition={{ repeat: Infinity, duration: 1.5 }}
                     className={`w-32 h-32 rounded-full border-4 flex items-center justify-center z-10 transition-colors ${
                       isListening ? 'border-brand-amber bg-brand-amber/10' : 
                       isSpeaking ? 'border-emerald-500 bg-emerald-500/10' :
                       'border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5'
                     }`}
                   >
                     {isSpeaking ? (
                       <Volume2 size={48} className="text-emerald-500" />
                     ) : (
                       <Mic size={48} className={isListening ? 'text-brand-amber' : 'text-gray-300'} />
                     )}
                   </motion.div>
                </div>

                <div className="text-center space-y-4 z-10">
                   <div className="space-y-1">
                      <h4 className="text-2xl font-display font-extrabold">
                        {isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Voice Agent Offline'}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {isListening ? 'Ask your financial questions' : isSpeaking ? 'PocketSathi is responding' : 'Tap to start conversation'}
                      </p>
                   </div>

                   <button 
                     onClick={() => !currentUser ? onLoginPrompt() : setIsListening(!isListening)}
                     className={`px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all ${
                       isListening 
                         ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' 
                         : 'bg-brand-amber text-brand-navy shadow-lg shadow-brand-amber/30 hover:scale-105 active:scale-95'
                     }`}
                   >
                     {isListening ? <X size={20} /> : <Mic size={20} />}
                     {isListening ? 'Stop Listening' : 'Start Talking'}
                   </button>
                </div>

                {isSpeaking && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3"
                  >
                    <Sparkles size={16} className="text-emerald-500" />
                    <p className="text-xs text-emerald-600 font-bold">PocketSathi is currently speaking...</p>
                  </motion.div>
                )}

                {!currentUser && (
                   <div className="absolute inset-0 bg-white/60 dark:bg-brand-navy/60 backdrop-blur-[2px] flex items-center justify-center p-6 text-center z-20">
                      <div className="bg-white dark:bg-brand-navy p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-white/10">
                         <Info size={24} className="mx-auto mb-2 text-brand-amber" />
                         <p className="text-xs font-bold mb-4">Login to use the interactive Voice Agent</p>
                         <button onClick={onLoginPrompt} className="btn-primary py-2 px-4 text-xs w-full">Join Now</button>
                      </div>
                   </div>
                )}
             </div>
          </div>

        </div>
      </div>
    </section>
  );
}
