import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, MessageSquare, Smartphone, ShieldAlert, TrendingUp, BookOpen, ChevronRight, PieChart } from 'lucide-react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import { OnboardingData, User, UserData } from '../types';
import { formatCurrency } from '../hooks/useData';

interface HomeProps {
  currentUser: User | null;
  userData: UserData;
  onLoginPrompt: () => void;
  onEditProfile: () => void;
}

export default function Home({ currentUser, userData, onLoginPrompt, onEditProfile }: HomeProps) {
  return (
    <div className="space-y-12 pb-24">
      <Hero 
        currentUser={currentUser}
        onboarding={userData.onboarding}
        onExploreClick={() => null} // Handled by routing now
        onTryCoachClick={() => null} // Handled by routing now
        onEditProfile={onEditProfile}
        transactionsCount={userData.transactions.length}
      />

      {/* Features Preview Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 space-y-16">
        
        {/* Coach Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <div className="w-10 h-10 bg-brand-amber/10 rounded-xl flex items-center justify-center text-brand-amber">
              <MessageSquare size={20} />
            </div>
            <h2 className="text-3xl font-display font-extrabold">Your Personal AI Coach</h2>
            <p className="text-gray-500 text-base leading-relaxed max-w-lg">
              Stuck on choosing a mutual fund? Not sure if that "instant loan" SMS is a trap? Ask PocketSathi Coach. Get real-time financial advice tailored to your goals.
            </p>
            <Link to="/coach" className="inline-flex items-center gap-2 font-bold text-brand-amber hover:gap-3 transition-all">
              Chat with Coach Now <ArrowRight size={18} />
            </Link>
          </div>
          <div className="glass-card p-6 border-brand-amber/20 shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <MessageSquare size={80} />
             </div>
             <div className="space-y-4">
                <div className="bg-gray-100 dark:bg-white/5 p-4 rounded-2xl rounded-tl-none w-4/5">
                   <p className="text-[10px] font-bold text-gray-400 mb-1">COACH</p>
                   <p className="text-sm">"Based on your spendings, you've spent ₹2,400 on Swiggy this week. That's 15% of your 'Wants' budget. Maybe try cooking today?"</p>
                </div>
                <div className="bg-brand-amber text-brand-navy p-4 rounded-2xl rounded-tr-none w-4/5 ml-auto text-right font-bold">
                   <p className="text-sm">Suggest me a better SIP instead of Swiggy!</p>
                </div>
             </div>
          </div>
        </div>

        {/* UPI Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="order-2 md:order-1 glass-card p-6 border-brand-amber/20 shadow-2xl flex flex-col items-center">
             <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 self-start">Recent Activity</h3>
             <div className="w-full space-y-2">
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-transparent hover:border-brand-amber/20 transition-all">
                   <span className="text-xs font-bold">Zomato Order</span>
                   <span className="text-red-500 font-extrabold">- ₹450</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-transparent hover:border-brand-amber/20 transition-all">
                   <span className="text-xs font-bold">Amazon Shopping</span>
                   <span className="text-red-500 font-extrabold">- ₹1,200</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-transparent hover:border-brand-amber/20 transition-all">
                   <span className="text-xs font-bold">Uber Auto</span>
                   <span className="text-red-500 font-extrabold">- ₹85</span>
                </div>
             </div>
          </div>
          <div className="order-1 md:order-2 space-y-4">
            <div className="w-10 h-10 bg-brand-amber/10 rounded-xl flex items-center justify-center text-brand-amber">
              <Smartphone size={20} />
            </div>
            <h2 className="text-3xl font-display font-extrabold">Master the UPI Leak</h2>
            <p className="text-gray-500 text-base leading-relaxed max-w-lg">
              ₹10 here, ₹20 there—it adds up. Our UPI Analyzer scans your transaction history to reveal patterns you didn't know existed. Take control of your digital wallet.
            </p>
            <Link to="/upi" className="inline-flex items-center gap-2 font-bold text-brand-amber hover:gap-3 transition-all">
              Analyze My Spends <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* Debt Detector Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500">
              <ShieldAlert size={20} />
            </div>
            <h2 className="text-3xl font-display font-extrabold">Spot the Loan Traps</h2>
            <p className="text-gray-500 text-base leading-relaxed max-w-lg">
              Don't be fooled by "No Cost" or "Instant Approval" slogans. We calculate the hidden APR so you know what you're really paying.
            </p>
            <Link to="/debt" className="inline-flex items-center gap-2 font-bold text-brand-amber hover:gap-3 transition-all">
              Check Loan Safety <ArrowRight size={18} />
            </Link>
          </div>
          <div className="glass-card p-8 bg-red-500/5 border-red-500/20 text-center relative">
             <div className="absolute top-2 right-2 px-3 py-1 bg-red-500 rounded-full text-[10px] font-bold text-white uppercase tracking-wider">High Risk</div>
             <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mx-auto mb-4">
                <ShieldAlert size={24} />
             </div>
             <p className="text-sm text-gray-500 mb-4">"Effective APR of 32.4%. Standard bank loans are 11-14%."</p>
             <div className="h-1.5 w-full bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 w-[85%]" />
             </div>
          </div>
        </div>

        {/* Investment Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="order-2 md:order-1 glass-card p-6 border-brand-amber/20 shadow-2xl relative">
             <div className="flex items-center gap-3 mb-6">
                <TrendingUp size={20} className="text-brand-amber" />
                <h3 className="font-bold text-sm">SIP Goal: ₹1 Crore</h3>
             </div>
             <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-bold text-gray-400">
                   <span>MONTHLY SIP</span>
                   <span>₹5,000</span>
                </div>
                <div className="flex justify-between text-lg font-extrabold border-t border-white/10 pt-4">
                   <span>MATURITY</span>
                   <span className="text-brand-amber">₹3.5 Crores</span>
                </div>
                <p className="text-[9px] text-center text-gray-500 italic">"Step-up by 10% annually to hit ₹5.2 Crores!"</p>
             </div>
          </div>
          <div className="order-1 md:order-2 space-y-4">
            <div className="w-10 h-10 bg-brand-amber/10 rounded-xl flex items-center justify-center text-brand-amber">
              <TrendingUp size={20} />
            </div>
            <h2 className="text-3xl font-display font-extrabold">Build Real Wealth</h2>
            <p className="text-gray-500 text-base leading-relaxed max-w-lg">
              Use our advanced calculators to see exactly how your money can grow. From standard SIPs to Step-up strategies, plan your financial freedom today.
            </p>
            <Link to="/investment" className="inline-flex items-center gap-2 font-bold text-brand-amber hover:gap-3 transition-all">
              Start Calculating <ArrowRight size={18} />
            </Link>
          </div>
        </div>

      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-12">
         <div className="bg-brand-navy rounded-[2.5rem] p-10 md:p-16 text-center text-white relative overflow-hidden border border-white/10 shadow-2xl">
            <div className="absolute top-0 left-0 w-64 h-64 bg-brand-amber/10 blur-[100px] rounded-full" />
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight">Ready to start?</h2>
              <p className="text-gray-400 text-base">Join thousands of young Indians who are taking control of their money with PocketSathi.</p>
              <button 
                onClick={currentUser ? () => null : onLoginPrompt} 
                className="btn-primary py-4 px-12 text-lg"
              >
                {currentUser ? 'Go to Dashboard' : 'Create Free Account'}
              </button>
            </div>
         </div>
      </section>
    </div>
  );
}
