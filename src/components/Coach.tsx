import React, { useState, useEffect, useRef } from 'react';
import { Send, Trash2, Info, MessageSquare, PieChart as PieChartIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage, User, UserData } from '../types';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { formatCurrency } from '../hooks/useData';

ChartJS.register(ArcElement, Tooltip, Legend);

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

  const currentHistory = currentUser ? userData.chatHistory : guestHistory;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentHistory]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
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

  // Chart Data
  const budgetData = currentUser && userData.onboarding ? {
    labels: ['Needs', 'Wants', 'Savings'],
    datasets: [{
      data: [
        userData.onboarding.budgetSplit.needs,
        userData.onboarding.budgetSplit.wants,
        userData.onboarding.budgetSplit.savings
      ],
      backgroundColor: ['#3b82f6', '#f7a325', '#10b981'],
      borderWidth: 0,
    }]
  } : {
    labels: ['Needs', 'Wants', 'Savings'],
    datasets: [{
      data: [50, 30, 20],
      backgroundColor: ['#e5e7eb', '#d1d5db', '#9ca3af'],
      borderWidth: 0,
    }]
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

          {/* Budget Insight Column */}
          <div className="flex-1 space-y-6">
             <div className="glass-card p-8 flex flex-col items-center justify-center h-full relative overflow-hidden">
                <div className="flex items-center gap-3 self-start mb-8 text-brand-amber">
                   <PieChartIcon size={24} />
                   <h3 className="font-display font-extrabold text-xl">Budget Strategy</h3>
                </div>
                
                <div className="w-full max-w-[240px]">
                  <Doughnut 
                    data={budgetData} 
                    options={{ 
                      cutout: '70%',
                      plugins: {
                        legend: { position: 'bottom', labels: { color: '#888', font: { weight: 'bold' } } }
                      }
                    }} 
                  />
                </div>

                <div className="text-center mt-8 space-y-2">
                   <h4 className="text-2xl font-extrabold">
                     {currentUser && userData.onboarding 
                        ? `${userData.onboarding.budgetSplit.needs}:${userData.onboarding.budgetSplit.wants}:${userData.onboarding.budgetSplit.savings}`
                        : '50:30:20 Rule'
                     }
                   </h4>
                   <p className="text-sm text-gray-500">
                     {currentUser && userData.onboarding
                        ? `Focus: Saving ${formatCurrency(userData.onboarding.savingsGoal)}/mo`
                        : 'Default strategy for financial health'
                     }
                   </p>
                </div>

                {!currentUser && (
                   <div className="absolute inset-0 bg-white/60 dark:bg-brand-navy/60 backdrop-blur-[2px] flex items-center justify-center p-6 text-center">
                      <div className="bg-white dark:bg-brand-navy p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-white/10">
                         <Info size={24} className="mx-auto mb-2 text-brand-amber" />
                         <p className="text-xs font-bold mb-4">Login to see your personalized budget dashboard</p>
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
