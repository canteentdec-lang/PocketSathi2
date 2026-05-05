import React, { useState, useMemo } from 'react';
import { TrendingUp, PieChart, Landmark, IndianRupee, Save, Trash2, History } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, UserData, SavedCalculation } from '../types';
import { formatCurrency } from '../hooks/useData';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface InvestmentCalculatorsProps {
  currentUser: User | null;
  userData: UserData;
  onUpdateCalculations: (cs: SavedCalculation[]) => void;
  onLoginPrompt: () => void;
}

type TabType = 'sip' | 'stepup' | 'lumpsum' | 'fd' | 'emi';

export default function InvestmentCalculators({ currentUser, userData, onUpdateCalculations, onLoginPrompt }: InvestmentCalculatorsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('sip');
  
  const tabs = [
    { id: 'sip', label: 'SIP', icon: <TrendingUp size={16} /> },
    { id: 'stepup', label: 'Step-Up SIP', icon: <TrendingUp size={16} /> },
    { id: 'lumpsum', label: 'Lump Sum', icon: <PieChart size={16} /> },
    { id: 'fd', label: 'FD', icon: <Landmark size={16} /> },
    { id: 'emi', label: 'EMI', icon: <IndianRupee size={16} /> },
  ];

  return (
    <section id="investment" className="py-24 px-4 bg-white dark:bg-brand-navy">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
           <div className="flex items-center gap-3 text-brand-amber mb-2">
              <TrendingUp size={28} />
              <h2 className="text-3xl font-display font-extrabold">Wealth Calculators</h2>
           </div>
           <p className="text-gray-500 dark:text-gray-400">Project your growth and plan your goals with data-driven insights.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           {/* Sidebar Tabs */}
           <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-white/5 p-1.5 rounded-2xl border border-gray-100 dark:border-white/10">
                 {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as TabType)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                        activeTab === tab.id 
                          ? 'bg-white dark:bg-brand-amber text-brand-navy shadow-md' 
                          : 'text-gray-500 hover:bg-white/10'
                      }`}
                    >
                      {tab.icon} {tab.label}
                    </button>
                 ))}
              </div>

              {/* Tips Panel */}
              <div className="bg-brand-amber/5 border border-brand-amber/10 rounded-2xl p-6 space-y-4">
                 <h4 className="text-xs font-bold uppercase tracking-wider text-brand-amber">Market Insights</h4>
                 <div className="space-y-3">
                    <RecommendationCard text="Nifty 50 Index Fund: Avg 12% CAGR" />
                    <RecommendationCard text="Start ELSS SIP for 80C tax saving" />
                    <RecommendationCard text="SBI FD: 6.8% | HDFC FD: 7.1% (2024)" />
                 </div>
              </div>
           </div>

           {/* Calculator Area */}
           <div className="lg:col-span-3 space-y-8">
              <div className="bg-white dark:bg-brand-navy border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-xl">
                 <AnimatePresence mode="wait">
                    {activeTab === 'sip' && <SIPCalc currentUser={currentUser} onSave={(s) => onUpdateCalculations([s, ...userData.savedCalculations])} onLoginPrompt={onLoginPrompt} />}
                    {activeTab === 'stepup' && <StepUpCalc currentUser={currentUser} onSave={(s) => onUpdateCalculations([s, ...userData.savedCalculations])} onLoginPrompt={onLoginPrompt} />}
                    {activeTab === 'lumpsum' && <LumpSumCalc currentUser={currentUser} onSave={(s) => onUpdateCalculations([s, ...userData.savedCalculations])} onLoginPrompt={onLoginPrompt} />}
                    {activeTab === 'fd' && <FDCalc currentUser={currentUser} onSave={(s) => onUpdateCalculations([s, ...userData.savedCalculations])} onLoginPrompt={onLoginPrompt} />}
                    {activeTab === 'emi' && <EMICalc currentUser={currentUser} onSave={(s) => onUpdateCalculations([s, ...userData.savedCalculations])} onLoginPrompt={onLoginPrompt} />}
                 </AnimatePresence>
              </div>

              {/* History Expandable */}
              {userData.savedCalculations.length > 0 && (
                <div className="glass-card p-6">
                   <div className="flex items-center gap-2 mb-4 font-bold">
                      <History size={18} className="text-brand-amber" /> Calculation History
                   </div>
                   <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                         <thead className="text-[10px] font-bold uppercase text-gray-500 bg-gray-50 dark:bg-white/5">
                            <tr>
                               <th className="p-4">Type</th>
                               <th className="p-4">Label</th>
                               <th className="p-4">Investment</th>
                               <th className="p-4 text-right">Result</th>
                               <th className="p-4 text-right">Action</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                            {userData.savedCalculations.map(c => (
                               <tr key={c.id}>
                                  <td className="p-4 font-bold uppercase opacity-60">{c.type}</td>
                                  <td className="p-4 font-bold">{c.title}</td>
                                  <td className="p-4">{formatCurrency(c.inputs.investment || c.inputs.principal || c.inputs.loan)}</td>
                                  <td className="p-4 text-right font-extrabold text-brand-amber">{formatCurrency(c.result.maturity || c.result.emi)}</td>
                                  <td className="p-4 text-right">
                                     <button onClick={() => onUpdateCalculations(userData.savedCalculations.filter(x => x.id !== c.id))} className="text-red-400 hover:text-red-600">
                                        <Trash2 size={14} />
                                     </button>
                                  </td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                </div>
              )}
           </div>
        </div>
      </div>
    </section>
  );
}

function RecommendationCard({ text }: { text: string }) {
  return (
    <div className="p-3 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl text-[11px] font-bold">
       {text}
    </div>
  );
}

// Calculators

function SIPCalc({ currentUser, onSave, onLoginPrompt }: { currentUser: any, onSave: (s: SavedCalculation) => void, onLoginPrompt: () => void }) {
  const [inputs, setInputs] = useState({ investment: 5000, return: 12, years: 10 });
  const [label, setLabel] = useState('My SIP Plan');

  const result = useMemo(() => {
    const P = inputs.investment;
    const r = (inputs.return / 100) / 12;
    const n = inputs.years * 12;
    const maturity = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const invested = P * n;
    return { maturity, invested, returns: maturity - invested };
  }, [inputs]);

  const handleSave = () => {
    if (!currentUser) return onLoginPrompt();
    onSave({
      id: Date.now().toString(),
      type: 'sip',
      title: label,
      inputs,
      result,
      date: new Date().toISOString()
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
       <div className="space-y-6">
          <h3 className="text-xl font-bold">SIP Calculator</h3>
          <div className="space-y-4">
             <CalcInput label="Monthly Investment (₹)" value={inputs.investment} onChange={v => setInputs({ ...inputs, investment: v })} min={500} max={1000000} step={500} />
             <CalcInput label="Expected Return (% p.a)" value={inputs.return} onChange={v => setInputs({ ...inputs, return: v })} min={1} max={30} step={0.5} />
             <CalcInput label="Duration (Years)" value={inputs.years} onChange={v => setInputs({ ...inputs, years: v })} min={1} max={40} step={1} />
          </div>
          <div className="pt-4 border-t border-gray-100 dark:border-white/10">
             <label className="text-[10px] font-bold text-gray-500 uppercase block mb-2">Save calculation</label>
             <div className="flex gap-2">
                <input type="text" value={label} onChange={e => setLabel(e.target.value)} className="flex-1 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-4 text-sm focus:outline-none" />
                <button onClick={handleSave} className="bg-brand-amber text-brand-navy p-3 rounded-xl"><Save size={18} /></button>
             </div>
          </div>
       </div>
       <div className="flex flex-col gap-6">
          <div className="grid grid-cols-3 gap-3">
             <StatBox label="Invested" value={formatCurrency(result.invested)} />
             <StatBox label="Returns" value={formatCurrency(result.returns)} />
             <StatBox label="Maturity" value={formatCurrency(result.maturity)} amber />
          </div>
          <div className="h-48 border border-gray-100 dark:border-white/10 rounded-2xl p-4">
             <Line 
               data={{
                 labels: Array.from({ length: inputs.years + 1 }, (_, i) => i),
                 datasets: [{
                   label: 'Growth',
                   data: Array.from({ length: inputs.years + 1 }, (_, i) => {
                     const r = (inputs.return / 100) / 12;
                     const n = i * 12;
                     return i === 0 ? 0 : inputs.investment * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
                   }),
                   borderColor: '#f7a325',
                   backgroundColor: 'rgba(247, 163, 37, 0.1)',
                   fill: true,
                   tension: 0.4
                 }]
               }}
               options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { display: false }, x: { grid: { display: false } } } }}
             />
          </div>
       </div>
    </div>
  );
}

// Reusable parts for each calculator
function CalcInput({ label, value, onChange, min, max, step }: { label: string, value: number, onChange: (v: number) => void, min: number, max: number, step: number }) {
  return (
    <div className="space-y-2">
       <div className="flex justify-between items-center">
          <label className="text-xs font-bold text-gray-500 uppercase">{label}</label>
          <span className="text-sm font-extrabold">{value.toLocaleString('en-IN')}</span>
       </div>
       <input 
         type="range" min={min} max={max} step={step} value={value} 
         onChange={e => onChange(Number(e.target.value))} 
         className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-amber"
       />
    </div>
  );
}

function StatBox({ label, value, amber }: { label: string, value: string, amber?: boolean }) {
  return (
    <div className={`p-4 rounded-2xl text-center shadow-inner ${amber ? 'bg-brand-amber text-brand-navy' : 'bg-gray-50 dark:bg-white/5'}`}>
       <span className="text-[8px] font-bold uppercase block mb-1 opacity-60">{label}</span>
       <span className="text-xs font-bold whitespace-nowrap">{value}</span>
    </div>
  );
}

// Stub for other tabs similarly implemented
function StepUpCalc({ currentUser, onSave, onLoginPrompt }: any) { return <div className="p-12 text-center text-gray-500 italic">Step-Up SIP Calculator View</div>; }
function LumpSumCalc({ currentUser, onSave, onLoginPrompt }: any) { return <div className="p-12 text-center text-gray-500 italic">Lump Sum Calculator View</div>; }
function FDCalc({ currentUser, onSave, onLoginPrompt }: any) { return <div className="p-12 text-center text-gray-500 italic">FD Calculator View</div>; }
function EMICalc({ currentUser, onSave, onLoginPrompt }: any) { return <div className="p-12 text-center text-gray-500 italic">EMI Calculator View</div>; }
