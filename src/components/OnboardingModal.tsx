import React, { useState } from 'react';
import { X, CheckCircle2, ChevronRight, ChevronLeft, Wallet, PieChart, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { OnboardingData } from '../types';
import { CATEGORIES } from '../constants';
import { formatCurrency } from '../hooks/useData';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: OnboardingData) => void;
  initialData?: OnboardingData | null;
}

export default function OnboardingModal({ isOpen, onClose, onComplete, initialData }: OnboardingModalProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const [data, setData] = useState<OnboardingData>(initialData || {
    salary: 50000,
    categories: ['Food', 'Rent', 'Transport'],
    savingsGoal: 10000,
    budgetSplit: { needs: 50, wants: 30, savings: 20 }
  });

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFinish = () => {
    onComplete(data);
    onClose();
  };

  const toggleCategory = (cat: string) => {
    const updated = data.categories.includes(cat)
      ? data.categories.filter(c => c !== cat)
      : [...data.categories, cat];
    setData({ ...data, categories: updated });
  };

  const updateSplit = (key: keyof typeof data.budgetSplit, value: number) => {
    // Basic logic to ensure total is 100
    // Simplified for this demo: user manually adjusts, we show a warning if != 100
    // Or we could proportionally adjust. Let's do simple manual + warning.
    setData({
      ...data,
      budgetSplit: { ...data.budgetSplit, [key]: value }
    });
  };

  const totalSplit = data.budgetSplit.needs + data.budgetSplit.wants + data.budgetSplit.savings;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-brand-navy/60 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-white dark:bg-brand-navy border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-gray-100 dark:bg-white/5">
          <motion.div 
            className="h-full bg-brand-amber text-brand-navy"
            initial={{ width: 0 }}
            animate={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <span className="text-sm font-bold text-brand-amber uppercase tracking-wider">Step {step} of {totalSteps}</span>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="min-h-[300px]">
             <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-4 mb-2">
                       <div className="w-12 h-12 rounded-xl bg-brand-amber/10 flex items-center justify-center text-brand-amber">
                         <Wallet size={24} />
                       </div>
                       <h2 className="text-2xl font-display font-extrabold">Monthly Income</h2>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">What is your monthly take-home salary after taxes?</p>
                    <div className="relative mt-8">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">₹</span>
                      <input
                        type="number"
                        value={data.salary}
                        onChange={(e) => setData({ ...data, salary: Number(e.target.value) })}
                        className="w-full bg-gray-50 dark:bg-white/5 border-2 border-gray-100 dark:border-white/10 rounded-2xl py-6 pl-12 pr-6 text-3xl font-extrabold focus:outline-none focus:border-brand-amber transition-all"
                      />
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-4 mb-2">
                       <div className="w-12 h-12 rounded-xl bg-brand-amber/10 flex items-center justify-center text-brand-amber">
                         <PieChart size={24} />
                       </div>
                       <h2 className="text-2xl font-display font-extrabold">Top Spending Categories</h2>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">Select the categories you spend on most frequently.</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {CATEGORIES.map(cat => (
                        <button
                          key={cat}
                          onClick={() => toggleCategory(cat)}
                          className={`py-3 px-4 rounded-xl border-2 font-bold text-sm transition-all ${
                            data.categories.includes(cat)
                              ? 'bg-brand-amber border-brand-amber text-brand-navy'
                              : 'bg-transparent border-gray-100 dark:border-white/10 text-gray-500'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-4 mb-2">
                       <div className="w-12 h-12 rounded-xl bg-brand-amber/10 flex items-center justify-center text-brand-amber">
                         <Target size={24} />
                       </div>
                       <h2 className="text-2xl font-display font-extrabold">Monthly Savings Goal</h2>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">How much do you realistically want to save each month?</p>
                    <div className="space-y-4">
                       <input 
                         type="range" 
                         min="0" 
                         max={data.salary} 
                         step="1000"
                         value={data.savingsGoal}
                         onChange={(e) => setData({ ...data, savingsGoal: Number(e.target.value) })}
                         className="w-full h-3 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-amber"
                       />
                       <div className="flex justify-between items-center bg-brand-amber/10 p-6 rounded-2xl">
                          <span className="text-sm font-bold text-brand-amber uppercase">Your Goal</span>
                          <span className="text-3xl font-extrabold text-brand-amber">{formatCurrency(data.savingsGoal)}</span>
                       </div>
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-4 mb-2">
                       <div className="w-12 h-12 rounded-xl bg-brand-amber/10 flex items-center justify-center text-brand-amber">
                         <CheckCircle2 size={24} />
                       </div>
                       <h2 className="text-2xl font-display font-extrabold">Budget Allocation</h2>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">Use the 50/30/20 rule or customize your split (Needs % / Wants % / Savings %).</p>
                    
                    {/* Stacked bar visualization */}
                    <div className="h-10 w-full flex rounded-full overflow-hidden border-4 border-gray-100 dark:border-white/5 mb-8">
                       <div className="bg-blue-500 h-full flex items-center justify-center text-[10px] font-bold text-white px-2" style={{ width: `${data.budgetSplit.needs}%` }}>NEEDS</div>
                       <div className="bg-brand-amber h-full flex items-center justify-center text-[10px] font-bold text-brand-navy px-2" style={{ width: `${data.budgetSplit.wants}%` }}>WANTS</div>
                       <div className="bg-emerald-500 h-full flex items-center justify-center text-[10px] font-bold text-white px-2" style={{ width: `${data.budgetSplit.savings}%` }}>SAVE</div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                       {Object.entries(data.budgetSplit).map(([key, val]) => (
                         <div key={key} className="space-y-2">
                           <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400">{key}</label>
                           <input
                             type="number"
                             value={val}
                             onChange={(e) => updateSplit(key as any, Number(e.target.value))}
                             className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-3 font-bold text-center"
                           />
                         </div>
                       ))}
                    </div>
                    {totalSplit !== 100 && (
                      <p className="text-red-500 text-xs font-bold text-center italic">⚠️ Total must equal 100% (Current: {totalSplit}%)</p>
                    )}
                  </motion.div>
                )}

                {step === 5 && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-6 py-4"
                  >
                    <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-emerald-500/20">
                      <CheckCircle2 size={48} />
                    </div>
                    <h2 className="text-3xl font-display font-extrabold">You're all set! 🎉</h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                      PocketSathi is ready to help you hit your goal of <strong>{formatCurrency(data.savingsGoal)}</strong> this month.
                    </p>
                    
                    <div className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl p-6 text-left max-w-md mx-auto grid grid-cols-2 gap-4">
                       <div>
                         <span className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Monthly Salary</span>
                         <span className="text-xl font-extrabold">{formatCurrency(data.salary)}</span>
                       </div>
                       <div>
                         <span className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Savings Goal</span>
                         <span className="text-xl font-extrabold">{formatCurrency(data.savingsGoal)}</span>
                       </div>
                       <div className="col-span-2">
                         <span className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Top Focus</span>
                         <div className="flex flex-wrap gap-2">
                           {data.categories.slice(0, 3).map(c => (
                             <span key={c} className="text-xs px-3 py-1 bg-brand-amber/10 text-brand-amber border border-brand-amber/20 rounded-full font-bold">{c}</span>
                           ))}
                         </div>
                       </div>
                    </div>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>

          <div className="flex gap-4 mt-12">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="flex-1 py-4 px-6 border-2 border-gray-100 dark:border-white/10 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
              >
                <ChevronLeft size={20} /> Back
              </button>
            )}
            {step < totalSteps ? (
              <button
                onClick={handleNext}
                disabled={step === 4 && totalSplit !== 100}
                className="flex-[2] btn-primary py-4 px-6 flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale"
              >
                Continue <ChevronRight size={20} />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="flex-[2] btn-primary py-4 px-6 flex items-center justify-center gap-2"
              >
                Go to Dashboard <CheckCircle2 size={20} />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
