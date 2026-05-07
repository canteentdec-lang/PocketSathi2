import React, { useState } from 'react';
import { X, CheckCircle2, Wallet, PieChart, Target, Save, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { OnboardingData } from '../types';
import { CATEGORIES } from '../constants';
import { formatCurrency } from '../hooks/useData';

interface ProfileSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: OnboardingData) => void;
  initialData: OnboardingData;
}

export default function ProfileSummaryModal({ isOpen, onClose, onUpdate, initialData }: ProfileSummaryModalProps) {
  const [data, setData] = useState<OnboardingData>({ ...initialData });
  const [isSaved, setIsSaved] = useState(false);

  const toggleCategory = (cat: string) => {
    const updated = data.categories.includes(cat)
      ? data.categories.filter(c => c !== cat)
      : [...data.categories, cat];
    setData({ ...data, categories: updated });
  };

  const updateSplit = (key: keyof typeof data.budgetSplit, value: number) => {
    setData({
      ...data,
      budgetSplit: { ...data.budgetSplit, [key]: value }
    });
  };

  const totalSplit = data.budgetSplit.needs + data.budgetSplit.wants + data.budgetSplit.savings;

  const handleSave = () => {
    if (totalSplit !== 100) return;
    onUpdate(data);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-brand-navy/80 backdrop-blur-md"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-brand-navy border border-gray-200 dark:border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-8 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-white/2">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-amber/10 flex items-center justify-center text-brand-amber">
                 <Sparkles size={24} />
              </div>
              <div>
                 <h2 className="text-2xl font-display font-extrabold">Financial Profile</h2>
                 <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Manage your budget & money goals</p>
              </div>
           </div>
           <button onClick={onClose} className="p-3 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors">
              <X size={24} />
           </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-8 space-y-10 scrollbar-hide">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Left Column: Basic Details */}
              <div className="space-y-8">
                 {/* Salary Section */}
                 <section className="space-y-4">
                    <div className="flex items-center gap-3 text-brand-amber">
                       <Wallet size={20} />
                       <h3 className="font-bold text-sm uppercase">Monthly Income</h3>
                    </div>
                    <div className="relative">
                       <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">₹</span>
                       <input
                         type="number"
                         value={data.salary}
                         onChange={(e) => setData({ ...data, salary: Number(e.target.value) })}
                         className="w-full bg-gray-50 dark:bg-white/5 border-2 border-gray-100 dark:border-white/10 rounded-2xl py-4 pl-12 pr-6 text-2xl font-extrabold focus:outline-none focus:border-brand-amber transition-all"
                       />
                    </div>
                 </section>

                 {/* Savings Goal Section */}
                 <section className="space-y-4">
                    <div className="flex items-center gap-3 text-brand-amber">
                       <Target size={20} />
                       <h3 className="font-bold text-sm uppercase">Savings Target</h3>
                    </div>
                    <div className="p-6 bg-brand-amber/5 rounded-3xl border border-brand-amber/10 space-y-4">
                       <div className="flex justify-between items-end">
                          <span className="text-3xl font-extrabold text-brand-amber">{formatCurrency(data.savingsGoal)}</span>
                          <span className="text-xs font-bold text-gray-400 uppercase">Goal Amount</span>
                       </div>
                       <input 
                         type="range" 
                         min="0" 
                         max={data.salary} 
                         step="1000"
                         value={data.savingsGoal}
                         onChange={(e) => setData({ ...data, savingsGoal: Number(e.target.value) })}
                         className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-amber"
                       />
                    </div>
                 </section>

                 {/* Categories Section */}
                 <section className="space-y-4">
                    <div className="flex items-center gap-3 text-brand-amber">
                       <PieChart size={20} />
                       <h3 className="font-bold text-sm uppercase">Expense Categories</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                       {CATEGORIES.map(cat => (
                         <button
                           key={cat}
                           onClick={() => toggleCategory(cat)}
                           className={`py-2 px-4 rounded-xl border-2 font-bold text-xs transition-all ${
                             data.categories.includes(cat)
                               ? 'bg-brand-amber border-brand-amber text-brand-navy shadow-lg shadow-brand-amber/20'
                               : 'bg-transparent border-gray-100 dark:border-white/10 text-gray-400 hover:text-gray-600'
                           }`}
                         >
                           {cat}
                         </button>
                       ))}
                    </div>
                 </section>
              </div>

              {/* Right Column: Visualization & Split */}
              <div className="space-y-8">
                 <section className="space-y-4">
                    <div className="flex items-center gap-3 text-brand-amber">
                       <PieChart size={20} />
                       <h3 className="font-bold text-sm uppercase">Budget Allocation (50/30/20)</h3>
                    </div>
                    
                    {/* Visual Bar */}
                    <div className="h-16 w-full flex rounded-2xl overflow-hidden border-2 border-gray-100 dark:border-white/5 shadow-inner">
                       <div className="bg-blue-500 h-full flex flex-col items-center justify-center text-[10px] font-bold text-white transition-all duration-500" style={{ width: `${data.budgetSplit.needs}%` }}>
                          <span>{data.budgetSplit.needs}%</span>
                          <span className="opacity-60 text-[8px]">NEEDS</span>
                       </div>
                       <div className="bg-brand-amber h-full flex flex-col items-center justify-center text-[10px] font-bold text-brand-navy transition-all duration-500" style={{ width: `${data.budgetSplit.wants}%` }}>
                          <span>{data.budgetSplit.wants}%</span>
                          <span className="opacity-60 text-[8px]">WANTS</span>
                       </div>
                       <div className="bg-emerald-500 h-full flex flex-col items-center justify-center text-[10px] font-bold text-white transition-all duration-500" style={{ width: `${data.budgetSplit.savings}%` }}>
                          <span>{data.budgetSplit.savings}%</span>
                          <span className="opacity-60 text-[8px]">SAVE</span>
                       </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6 pt-4">
                       {Object.entries(data.budgetSplit).map(([key, val]) => (
                         <div key={key} className="space-y-2">
                           <label className="block text-[10px] font-extrabold uppercase text-gray-400">{key} %</label>
                           <input
                             type="number"
                             value={val}
                             onChange={(e) => updateSplit(key as any, Number(e.target.value))}
                             className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-4 font-extrabold text-lg text-center focus:border-brand-amber outline-none transition-all"
                           />
                         </div>
                       ))}
                    </div>

                    {totalSplit !== 100 && (
                      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold text-center italic">
                        ⚠️ Total allocation must be 100% (Current: {totalSplit}%)
                      </div>
                    )}
                 </section>

                 <div className="p-8 bg-brand-navy text-white rounded-[2rem] space-y-4">
                    <h4 className="font-bold flex items-center gap-2 text-brand-amber"><Sparkles size={18} /> Budget Summary</h4>
                    <p className="text-sm opacity-60 leading-relaxed">Based on your {data.salary.toLocaleString()} income, we recommend spending no more than {((data.salary * data.budgetSplit.needs) / 100).toLocaleString()} on essentials to stay on track.</p>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                       <div className="bg-white/5 p-4 rounded-2xl">
                          <p className="text-[10px] opacity-40 uppercase font-bold">Planned Savings</p>
                          <p className="text-lg font-bold">{formatCurrency((data.salary * data.budgetSplit.savings) / 100)}</p>
                       </div>
                       <div className="bg-white/5 p-4 rounded-2xl">
                          <p className="text-[10px] opacity-40 uppercase font-bold">Lifestyle Fund</p>
                          <p className="text-lg font-bold">{formatCurrency((data.salary * data.budgetSplit.wants) / 100)}</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/2 flex gap-4">
           <button 
             onClick={onClose}
             className="flex-1 py-4 px-6 border-2 border-gray-100 dark:border-white/10 rounded-2xl font-bold hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
           >
              Cancel
           </button>
           <button 
             onClick={handleSave}
             disabled={totalSplit !== 100 || isSaved}
             className={`flex-[2] py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl transition-all ${
               isSaved ? 'bg-emerald-500 text-white cursor-default' : 'bg-brand-amber text-brand-navy shadow-brand-amber/20 hover:scale-[1.02] active:scale-98 disabled:opacity-50'
             }`}
           >
              {isSaved ? (
                <>
                  <CheckCircle2 size={24} />
                  Changes Saved Successfully!
                </>
              ) : (
                <>
                  <Save size={24} />
                  Update Financial Profile
                </>
              )}
           </button>
        </div>
      </motion.div>
    </div>
  );
}
