import React, { useState } from 'react';
import { ShieldAlert, Info, AlertTriangle, CheckCircle2, Trash2, ExternalLink, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, UserData, DebtAnalysis, LoanRisk } from '../types';
import { formatCurrency } from '../hooks/useData';

interface DebtDetectorProps {
  currentUser: User | null;
  userData: UserData;
  onUpdateAnalyses: (as: DebtAnalysis[]) => void;
  onLoginPrompt: () => void;
}

export default function DebtDetector({ currentUser, userData, onUpdateAnalyses, onLoginPrompt }: DebtDetectorProps) {
  const [formData, setFormData] = useState({
    label: '',
    loanAmount: 100000,
    interestRate: 12,
    tenure: 12,
    processingFee: 1000,
    processingFeeType: 'amount' as 'amount' | 'percent',
    prepaymentPenalty: false,
    autoDebit: false,
    rawText: ''
  });

  const [currentAnalysis, setCurrentAnalysis] = useState<DebtAnalysis | null>(null);

  const analyzeLoan = () => {
    if (!currentUser) {
      onLoginPrompt();
      return;
    }

    const { loanAmount, interestRate, tenure, processingFee, processingFeeType } = formData;
    
    // Calculations
    const monthlyRate = (interestRate / 100) / 12;
    const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1);
    const totalRepayment = emi * tenure;
    const totalInterest = totalRepayment - loanAmount;
    
    const feeAmount = processingFeeType === 'percent' ? (loanAmount * processingFee / 100) : processingFee;
    const effectiveTotalInterest = totalInterest + feeAmount;
    
    // APR approx
    const apr = ((effectiveTotalInterest / loanAmount) / (tenure / 12)) * 100;

    // Risk Scoring
    let riskScore = 0;
    if (interestRate > 24) riskScore += 50;
    else if (interestRate > 15) riskScore += 25;
    
    if (processingFeeType === 'percent' && processingFee > 3) riskScore += 20;
    else if (processingFeeType === 'amount' && processingFee > loanAmount * 0.02) riskScore += 15;

    if (formData.prepaymentPenalty) riskScore += 15;
    if (formData.autoDebit) riskScore += 10;
    
    if (formData.rawText.toLowerCase().match(/instant|no documents|guaranteed/)) riskScore += 30;

    const result: DebtAnalysis = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      label: formData.label || `Analysis ${new Date().toLocaleDateString()}`,
      ...formData,
      riskScore,
      emi,
      totalRepayment,
      totalInterest,
      apr
    };

    setCurrentAnalysis(result);
  };

  const getRiskLevel = (score: number) => {
    if (score >= 70) return { label: LoanRisk.CRITICAL, color: 'text-red-500', bg: 'bg-red-500', icon: <ShieldAlert /> };
    if (score >= 40) return { label: LoanRisk.HIGH, color: 'text-orange-500', bg: 'bg-orange-500', icon: <AlertTriangle /> };
    if (score >= 20) return { label: LoanRisk.MEDIUM, color: 'text-yellow-500', bg: 'bg-yellow-500', icon: <Info /> };
    return { label: LoanRisk.LOW, color: 'text-emerald-500', bg: 'bg-emerald-500', icon: <CheckCircle2 /> };
  };

  const saveAnalysis = () => {
    if (currentAnalysis) {
      onUpdateAnalyses([currentAnalysis, ...userData.debtAnalyses]);
      alert('Analysis saved successfully!');
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this saved analysis?')) {
      onUpdateAnalyses(userData.debtAnalyses.filter(a => a.id !== id));
    }
  };

  const loadAnalysis = (a: DebtAnalysis) => {
    setFormData({
      label: a.label,
      loanAmount: a.loanAmount,
      interestRate: a.interestRate,
      tenure: a.tenure,
      processingFee: a.processingFee,
      processingFeeType: a.processingFeeType,
      prepaymentPenalty: a.prepaymentPenalty,
      autoDebit: a.autoDebit,
      rawText: a.rawText || ''
    });
    setCurrentAnalysis(a);
  };

  return (
    <section id="debt" className="py-24 px-4 bg-gray-50 dark:bg-brand-navy/50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
           <div className="flex items-center gap-3 text-brand-amber mb-2">
              <ShieldAlert size={28} />
              <h2 className="text-3xl font-display font-extrabold">Debt Detector</h2>
           </div>
           <p className="text-gray-500 dark:text-gray-400">Identify loan traps and understand the true cost of borrowing.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {/* Input Panel */}
           <div className="space-y-6">
              <div className="bg-white dark:bg-brand-navy border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-lg space-y-6">
                 <h4 className="font-bold flex items-center gap-2">Loan Details</h4>
                 
                 <div className="space-y-4">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-500 uppercase">Analysis Label</label>
                       <input 
                         type="text"
                         placeholder="e.g. Personal Loan Offer"
                         value={formData.label}
                         onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                         className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl p-3 focus:outline-none focus:border-brand-amber"
                       />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase">Loan Amount (₹)</label>
                          <input 
                            type="number"
                            value={formData.loanAmount}
                            onChange={(e) => setFormData({ ...formData, loanAmount: Number(e.target.value) })}
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl p-3 focus:outline-none focus:border-brand-amber"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase">Interest Rate (% p.a.)</label>
                          <input 
                            type="number"
                            step="0.1"
                            value={formData.interestRate}
                            onChange={(e) => setFormData({ ...formData, interestRate: Number(e.target.value) })}
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl p-3 focus:outline-none focus:border-brand-amber"
                          />
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase">Tenure (Months)</label>
                          <input 
                            type="number"
                            value={formData.tenure}
                            onChange={(e) => setFormData({ ...formData, tenure: Number(e.target.value) })}
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl p-3 focus:outline-none focus:border-brand-amber"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase">Processing Fee</label>
                          <div className="flex gap-2">
                             <input 
                               type="number"
                               value={formData.processingFee}
                               onChange={(e) => setFormData({ ...formData, processingFee: Number(e.target.value) })}
                               className="flex-[2] bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl p-3 focus:outline-none focus:border-brand-amber"
                             />
                             <select
                               value={formData.processingFeeType}
                               onChange={(e) => setFormData({ ...formData, processingFeeType: e.target.value as any })}
                               className="flex-1 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl p-3 text-xs"
                             >
                                <option value="amount">₹</option>
                                <option value="percent">%</option>
                             </select>
                          </div>
                       </div>
                    </div>

                    <div className="flex gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
                       <label className="flex-1 flex items-center gap-2 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            checked={formData.prepaymentPenalty}
                            onChange={(e) => setFormData({ ...formData, prepaymentPenalty: e.target.checked })}
                            className="w-4 h-4 accent-brand-amber" 
                          />
                          <span className="text-[10px] font-bold text-gray-500 uppercase group-hover:text-brand-amber transition-colors">Prepayment Penalty</span>
                       </label>
                       <label className="flex-1 flex items-center gap-2 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            checked={formData.autoDebit}
                            onChange={(e) => setFormData({ ...formData, autoDebit: e.target.checked })}
                            className="w-4 h-4 accent-brand-amber" 
                          />
                          <span className="text-[10px] font-bold text-gray-500 uppercase group-hover:text-brand-amber transition-colors">Auto-Debit Clause</span>
                       </label>
                    </div>

                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-500 uppercase">Paste SMS / Offer Text (Optional analysis)</label>
                       <textarea 
                         rows={3}
                         value={formData.rawText}
                         onChange={(e) => setFormData({ ...formData, rawText: e.target.value })}
                         placeholder="e.g. Pre-approved loan of 2L at instant approval..."
                         className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl p-3 text-xs focus:outline-none focus:border-brand-amber"
                       />
                    </div>

                    <button onClick={analyzeLoan} className="w-full btn-primary py-4">
                       Analyze Risks
                    </button>
                 </div>
              </div>

              {/* Saved History */}
              {userData.debtAnalyses.length > 0 && (
                <div className="bg-white dark:bg-brand-navy border border-gray-200 dark:border-white/10 rounded-3xl p-8">
                   <h4 className="font-bold mb-4">Past Saved Analyses</h4>
                   <div className="space-y-3">
                      {userData.debtAnalyses.map(a => (
                        <div key={a.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-transparent hover:border-brand-amber/20 transition-all group">
                           <div className="flex-1 cursor-pointer" onClick={() => loadAnalysis(a)}>
                              <p className="text-sm font-bold truncate">{a.label}</p>
                              <span className="text-[10px] text-gray-500">{new Date(a.date).toLocaleDateString()}</span>
                           </div>
                           <div className="flex items-center gap-4">
                              <span className={`text-[10px] font-bold uppercase ${getRiskLevel(a.riskScore).color}`}>
                                {getRiskLevel(a.riskScore).label}
                              </span>
                              <button onClick={() => handleDelete(a.id)} className="p-2 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 size={16} />
                              </button>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              )}
           </div>

           {/* Output Panel */}
           <div className="relative">
              {!currentAnalysis ? (
                 <div className="h-full flex flex-col items-center justify-center p-12 text-center glass-card">
                    <div className="w-20 h-20 bg-brand-amber/10 rounded-full flex items-center justify-center text-brand-amber mb-6">
                       <ShieldAlert size={40} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Ready to Scan</h3>
                    <p className="text-sm text-gray-500 max-w-xs">Enter loan details or paste an SMS offer to see a full risk breakdown and hidden costs.</p>
                 </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                   {/* Risk o Meter */}
                   <div className="glass-card p-8">
                      <div className="flex justify-between items-center mb-6">
                         <h4 className="font-bold flex items-center gap-2">Risk profile: <span className={getRiskLevel(currentAnalysis.riskScore).color}>{getRiskLevel(currentAnalysis.riskScore).label}</span></h4>
                         <span className="text-xs font-bold bg-white/10 px-3 py-1 rounded-full">Score: {currentAnalysis.riskScore}/100</span>
                      </div>
                      
                      <div className="h-4 w-full bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden relative border border-white/10">
                         <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-500 opacity-50" />
                         <motion.div 
                           initial={{ left: 0 }}
                           animate={{ left: `${currentAnalysis.riskScore}%` }}
                           className="absolute top-0 bottom-0 w-2 bg-white shadow-xl z-10 -translate-x-1/2" 
                         />
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                        <AnalysisStat label="Monthly EMI" value={formatCurrency(currentAnalysis.emi)} />
                        <AnalysisStat label="Total Payable" value={formatCurrency(currentAnalysis.totalRepayment)} />
                        <AnalysisStat label="Effective APR" value={`${currentAnalysis.apr.toFixed(1)}%`} />
                        <AnalysisStat label="Total Interest" value={formatCurrency(currentAnalysis.totalInterest)} />
                      </div>
                   </div>

                   {/* Warnings */}
                   <div className="space-y-3">
                      {currentAnalysis.interestRate > 15 && (
                        <WarningCard icon={<AlertTriangle />} text="High interest rate — typical of personal or unsecured loans." />
                      )}
                      {currentAnalysis.processingFeeType === 'percent' && currentAnalysis.processingFee > 2 && (
                        <WarningCard icon={<AlertTriangle />} text="Processing fee is high. Standard fees are usually 1-2%." />
                      )}
                      {currentAnalysis.prepaymentPenalty && (
                        <WarningCard icon={<ShieldAlert />} text="Closure penalty detected — you'll pay extra to close this early." />
                      )}
                      {currentAnalysis.rawText.toLowerCase().match(/instant|guaranteed/) && (
                        <WarningCard icon={<ShieldAlert />} text="Red-flag keywords detected. Be wary of 'Instant approval' lenders." />
                      )}
                   </div>

                   {/* Smart Tips */}
                   <div className="bg-brand-amber/10 border-2 border-brand-amber/20 rounded-3xl p-8 space-y-4">
                      <h4 className="font-bold flex items-center gap-2 text-brand-amber"><Info size={18} /> Smart Action Plan</h4>
                      <ul className="space-y-2 text-sm">
                         <li className="flex gap-2"><span>✅</span> Always compare this with an SBI or HDFC top-rated personal loan first.</li>
                         <li className="flex gap-2"><span>✅</span> Ask for a 'KFS' (Key Fact Statement) from the lender before signing.</li>
                         <li className="flex gap-2"><span>✅</span> Never share your OTP or click links from unsecured SMS offers.</li>
                      </ul>
                      <div className="flex gap-4 pt-4 border-t border-brand-amber/10">
                         <button onClick={saveAnalysis} className="flex-1 btn-primary py-2 flex items-center justify-center gap-2 text-sm">
                            <Save size={16} /> Save Analysis
                         </button>
                         <a href="https://www.rbi.org.in/" target="_blank" rel="noreferrer" className="flex-1 border border-brand-amber text-brand-amber py-2 rounded-xl flex items-center justify-center gap-2 text-sm font-bold">
                            RBI Guidelines <ExternalLink size={16} />
                         </a>
                      </div>
                   </div>

                </motion.div>
              )}
           </div>
        </div>
      </div>
    </section>
  );
}

function AnalysisStat({ label, value }: { label: string, value: string }) {
  return (
    <div className="space-y-1">
       <span className="text-[10px] font-bold text-gray-500 uppercase block">{label}</span>
       <span className="text-sm font-extrabold">{value}</span>
    </div>
  );
}

function WarningCard({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-xs font-bold">
       <div className="flex-shrink-0">{icon}</div>
       <p>{text}</p>
    </div>
  );
}
