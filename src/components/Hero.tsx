import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, TrendingUp, ShieldCheck, Cpu, Smartphone, Calendar, User, Edit3 } from 'lucide-react';
import { OnboardingData, User as UserType } from '../types';
import { formatCurrency } from '../hooks/useData';

interface HeroProps {
  currentUser: UserType | null;
  onboarding: OnboardingData | null;
  onExploreClick: () => void;
  onTryCoachClick: () => void;
  onEditProfile: () => void;
  transactionsCount: number;
}

export default function Hero({ currentUser, onboarding, onExploreClick, onTryCoachClick, onEditProfile, transactionsCount }: HeroProps) {
  if (currentUser && onboarding) {
    return (
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-brand-amber/10 border-2 border-brand-amber/20 rounded-[2rem] p-8 md:p-12 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-amber/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-brand-amber font-bold text-sm tracking-widest uppercase">
                  <span className="w-8 h-px bg-brand-amber" /> DASHBOARD
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-extrabold">
                  Welcome back, {currentUser.name} 👋
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl">
                  You're in control of your financial future. Here's a quick look at your current status.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                   <button onClick={onEditProfile} className="btn-primary py-2 px-6 flex items-center gap-2">
                     <Edit3 size={18} /> Edit Profile
                   </button>
                   <button onClick={onTryCoachClick} className="px-6 py-2 border-2 border-brand-amber/20 font-bold rounded-xl hover:bg-brand-amber/5 transition-all">
                     Chat with Coach
                   </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                <div className="glass-card p-6 min-w-[160px]">
                  <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Monthly Salary</span>
                  <span className="text-xl font-extrabold">{formatCurrency(onboarding.salary)}</span>
                </div>
                <div className="glass-card p-6 min-w-[160px]">
                  <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Savings Goal</span>
                  <span className="text-xl font-extrabold text-emerald-500">{formatCurrency(onboarding.savingsGoal)}</span>
                </div>
                <div className="glass-card p-6 min-w-[160px]">
                  <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Budget Split</span>
                  <span className="text-xl font-extrabold text-brand-amber">
                    {onboarding.budgetSplit.needs}:{onboarding.budgetSplit.wants}:{onboarding.budgetSplit.savings}
                  </span>
                </div>
                <div className="glass-card p-6 min-w-[160px]">
                  <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Transactions</span>
                  <span className="text-xl font-extrabold">{transactionsCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative pt-40 pb-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-amber/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-brand-amber/20 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] pointer-events-none text-[600px] flex items-center justify-center font-bold select-none">
          ₹
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center space-y-8">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
        >
          <span className="px-4 py-2 bg-brand-amber/10 border border-brand-amber/20 rounded-full text-brand-amber text-xs font-extrabold tracking-widest uppercase inline-block mb-6">
            ✨ Your AI-Powered Wealth Mentor
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tight leading-[1.1]">
            Your Smartest <br />
            <span className="text-brand-amber">Money Friend</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-3xl mx-auto"
        >
          Budget smarter, track UPI spends, spot loan traps, and start your first SIP — all in one place. Tailored for the modern Indian saver.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <button onClick={onExploreClick} className="btn-primary w-full sm:w-auto text-lg py-4 px-10 flex items-center justify-center gap-3 group">
            Explore Features <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button onClick={onTryCoachClick} className="w-full sm:w-auto px-10 py-4 font-bold rounded-2xl border-2 border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-all text-lg">
            Try the Coach
          </button>
        </motion.div>

        {/* Feature Preview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-20">
          <FeaturePreview icon={<Cpu />} label="AI Coach" href="#coach" />
          <FeaturePreview icon={<Smartphone />} label="UPI Analyzer" href="#upi" />
          <FeaturePreview icon={<ShieldCheck />} label="Debt Detector" href="#debt" />
          <FeaturePreview icon={<TrendingUp />} label="Investments" href="#investment" />
          <FeaturePreview icon={<Calendar />} label="Learn Hub" href="#learn" />
        </div>
      </div>
    </section>
  );
}

function FeaturePreview({ icon, label, href }: { icon: React.ReactNode, label: string, href: string }) {
  return (
    <a href={href} className="glass-card card-glow p-6 flex flex-col items-center gap-3 group border border-transparent hover:border-brand-amber/30">
      <div className="w-12 h-12 rounded-xl bg-brand-amber/10 flex items-center justify-center text-brand-amber group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 group-hover:text-brand-amber transition-colors">
        {label}
      </span>
    </a>
  );
}
