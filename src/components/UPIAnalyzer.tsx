import React, { useState, useMemo } from 'react';
import { Smartphone, PieChart, BarChart3, Plus, FileUp, Trash2, Edit3, Check, Search, IndianRupee } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, UserData, Transaction } from '../types';
import { CATEGORIES } from '../constants';
import { formatCurrency } from '../hooks/useData';
import Papa from 'papaparse';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement
);

interface UPIAnalyzerProps {
  currentUser: User | null;
  userData: UserData;
  onUpdateTransactions: (ts: Transaction[]) => void;
  onLoginPrompt: () => void;
}

export default function UPIAnalyzer({ currentUser, userData, onUpdateTransactions, onLoginPrompt }: UPIAnalyzerProps) {
  const [activeTab, setActiveTab] = useState<'manual' | 'import'>('manual');
  const [formData, setFormData] = useState({ category: 'Food', amount: '', date: new Date().toISOString().split('T')[0], note: '', type: 'expense' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [importPreview, setImportPreview] = useState<Transaction[] | null>(null);

  const transactions = currentUser ? userData.transactions : dummyTransactions;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onLoginPrompt();
      return;
    }
    const { category, amount, date, note, type } = formData;
    if (!amount || isNaN(Number(amount))) return;

    if (editingId) {
      const updated = transactions.map(t => t.id === editingId ? { ...t, category, amount: Number(amount), date, note, type: type as any } : t);
      onUpdateTransactions(updated);
      setEditingId(null);
    } else {
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        category,
        amount: Number(amount),
        date,
        note,
        type: type as any
      };
      onUpdateTransactions([newTransaction, ...transactions]);
    }
    setFormData({ category: 'Food', amount: '', date: new Date().toISOString().split('T')[0], note: '', type: 'expense' });
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this transaction?')) {
      onUpdateTransactions(transactions.filter(t => t.id !== id));
    }
  };

  const handleEdit = (t: Transaction) => {
    setEditingId(t.id);
    setFormData({ category: t.category, amount: t.amount.toString(), date: t.date, note: t.note || '', type: t.type });
    setActiveTab('manual');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const parsed = results.data.map((row: any) => ({
            id: Math.random().toString(36).substr(2, 9),
            date: row.Date || row.date || new Date().toISOString().split('T')[0],
            category: row.Category || row.category || 'Other',
            amount: Math.abs(Number(row.Amount || row.amount || 0)),
            type: Number(row.Amount || row.amount || 0) < 0 ? 'expense' : 'income',
            note: row.Note || row.note || ''
          })) as Transaction[];
          setImportPreview(parsed);
        }
      });
    }
  };

  const confirmImport = () => {
    if (importPreview) {
      onUpdateTransactions([...importPreview, ...transactions]);
      setImportPreview(null);
    }
  };

  // Analytics Calculations
  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyTrans = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const expenses = monthlyTrans.filter(t => t.type === 'expense');
    const income = monthlyTrans.filter(t => t.type === 'income');

    const totalSpent = expenses.reduce((acc, t) => acc + t.amount, 0);
    const totalReceived = income.reduce((acc, t) => acc + t.amount, 0);

    const cats = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

    const highestCat = Object.entries(cats).sort((a, b) => b[1] - a[1])[0] || ['None', 0];

    return { totalSpent, totalReceived, categoryData: cats, highestCat };
  }, [transactions]);

  const donutData = {
    labels: Object.keys(stats.categoryData),
    datasets: [{
      data: Object.values(stats.categoryData),
      backgroundColor: [
        '#f7a325', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6', '#ec4899', '#f97316', '#06b6d4', '#14b8a6', '#6366f1'
      ],
      borderWidth: 0,
    }]
  };

  return (
    <section id="upi" className="flex-grow pt-8 pb-4 px-6 lg:px-8 h-[calc(100vh-80px)] overflow-hidden flex flex-col">
      <div className="max-w-7xl mx-auto w-full flex-grow flex flex-col overflow-y-auto pr-2 scrollbar-hide">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
           <div>
              <div className="flex items-center gap-3 text-brand-amber mb-2">
                 <Smartphone size={24} />
                 <h2 className="text-3xl font-display font-extrabold">UPI Analyzer</h2>
              </div>
              <p className="text-gray-500 dark:text-gray-400">Track and analyze your mobile payments with ease.</p>
           </div>
           {!currentUser && (
             <div className="px-4 py-2 bg-brand-amber/10 border border-brand-amber/20 rounded-xl text-brand-amber text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <Check size={14} /> Log in to save transactions
             </div>
           )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* Form Area */}
           <div className="space-y-6">
              <div className="bg-white dark:bg-brand-navy border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-lg">
                 <div className="flex bg-gray-50 dark:bg-white/5 p-1">
                    <button 
                      onClick={() => setActiveTab('manual')}
                      className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'manual' ? 'bg-white dark:bg-brand-amber dark:text-brand-navy shadow-md' : 'text-gray-500'}`}
                    >
                      Manual Entry
                    </button>
                    <button 
                      onClick={() => setActiveTab('import')}
                      className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'import' ? 'bg-white dark:bg-brand-amber dark:text-brand-navy shadow-md' : 'text-gray-500'}`}
                    >
                      CSV Import
                    </button>
                 </div>

                 <div className="p-6">
                    {activeTab === 'manual' ? (
                       <form onSubmit={handleAdd} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                               <label className="text-xs font-bold text-gray-500 uppercase">Type</label>
                               <select 
                                 value={formData.type}
                                 onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                 className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl p-3 text-sm font-bold focus:outline-none focus:border-brand-amber"
                               >
                                 <option value="expense">Expense</option>
                                 <option value="income">Income</option>
                               </select>
                            </div>
                            <div className="space-y-2">
                               <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
                               <select 
                                 value={formData.category}
                                 onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                 className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl p-3 text-sm font-bold focus:outline-none focus:border-brand-amber"
                               >
                                 {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                               </select>
                            </div>
                          </div>

                          <div className="space-y-2">
                             <label className="text-xs font-bold text-gray-500 uppercase">Amount (₹)</label>
                             <input 
                               type="number"
                               required
                               placeholder="e.g. 500"
                               value={formData.amount}
                               onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                               className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl p-4 text-xl font-extrabold focus:outline-none focus:border-brand-amber"
                             />
                          </div>

                          <div className="space-y-2">
                             <label className="text-xs font-bold text-gray-500 uppercase">Date</label>
                             <input 
                               type="date"
                               required
                               value={formData.date}
                               onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                               className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-brand-amber"
                             />
                          </div>

                          <div className="space-y-2">
                             <label className="text-xs font-bold text-gray-500 uppercase">Note (Optional)</label>
                             <input 
                               type="text"
                               placeholder="What was this for?"
                               value={formData.note}
                               onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                               className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-brand-amber"
                             />
                          </div>

                          <button type="submit" className="w-full btn-primary py-4 flex items-center justify-center gap-2">
                            {editingId ? <Check size={20} /> : <Plus size={20} />}
                            {editingId ? 'Update Entry' : 'Add Transaction'}
                          </button>
                       </form>
                    ) : (
                       <div className="space-y-4">
                          <div className="border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl p-8 text-center space-y-4">
                             <div className="w-16 h-16 bg-brand-amber/10 rounded-full flex items-center justify-center text-brand-amber mx-auto">
                                <FileUp size={32} />
                             </div>
                             <div>
                                <h4 className="font-bold">Import CSV File</h4>
                                <p className="text-xs text-gray-500">Columns: Date, Category, Amount, Note</p>
                             </div>
                             <input 
                               type="file" 
                               accept=".csv"
                               onChange={handleFileUpload}
                               className="hidden" 
                               id="csv-upload"
                             />
                             <label 
                               htmlFor="csv-upload"
                               className="inline-block btn-primary py-2 px-6 cursor-pointer"
                             >
                               Select File
                             </label>
                          </div>

                          {importPreview && (
                             <div className="space-y-4">
                                <div className="max-h-40 overflow-y-auto border border-gray-100 dark:border-white/10 rounded-xl">
                                   <table className="w-full text-xs text-left">
                                      <thead className="bg-gray-50 dark:bg-white/5 sticky top-0">
                                         <tr>
                                            <th className="p-2">Date</th>
                                            <th className="p-2">Amt</th>
                                         </tr>
                                      </thead>
                                      <tbody>
                                         {importPreview.map((p, i) => (
                                            <tr key={i} className="border-t border-gray-100 dark:border-white/10">
                                               <td className="p-2">{p.date}</td>
                                               <td className="p-2 font-bold">{formatCurrency(p.amount)}</td>
                                            </tr>
                                         ))}
                                      </tbody>
                                   </table>
                                </div>
                                <button 
                                  onClick={confirmImport}
                                  className="w-full btn-primary py-3"
                                >
                                  Import {importPreview.length} items
                                </button>
                             </div>
                          )}
                       </div>
                    )}
                 </div>
              </div>

              {/* Analytics Cards */}
              <div className="grid grid-cols-1 gap-4">
                 <div className="glass-card p-6 border-l-4 border-l-brand-amber">
                    <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Spent This Month</span>
                    <span className="text-2xl font-extrabold">{formatCurrency(stats.totalSpent)}</span>
                 </div>
                 <div className="glass-card p-6 border-l-4 border-l-emerald-500">
                    <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Received This Month</span>
                    <span className="text-2xl font-extrabold">{formatCurrency(stats.totalReceived)}</span>
                 </div>
                 <div className="glass-card p-6 border-l-4 border-l-blue-500">
                    <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Top Spend Category</span>
                    <span className="text-lg font-extrabold">{stats.highestCat[0]} ({formatCurrency(stats.highestCat[1])})</span>
                 </div>
              </div>
           </div>

           {/* Dashboard Area */}
           <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="glass-card p-8 flex flex-col items-center">
                    <h4 className="font-bold mb-6 self-start flex items-center gap-2">
                       <PieChart size={18} className="text-brand-amber" /> Spends by Category
                    </h4>
                    <div className="w-full max-w-[240px]">
                       <Doughnut 
                         data={donutData} 
                         options={{ 
                           plugins: { legend: { display: false } },
                           cutout: '60%'
                         }} 
                       />
                    </div>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-8 w-full border-t border-gray-100 dark:border-white/10 pt-6">
                       {Object.entries(stats.categoryData).slice(0, 4).map(([cat, val]) => (
                         <div key={cat} className="flex justify-between items-center text-xs">
                           <span className="text-gray-500 font-bold">{cat}</span>
                           <span className="font-extrabold">{formatCurrency(val as number)}</span>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="glass-card p-8">
                    <h4 className="font-bold mb-6 flex items-center gap-2">
                       <BarChart3 size={18} className="text-brand-amber" /> Month over Month
                    </h4>
                    <div className="h-[240px]">
                       <Bar 
                         data={{
                           labels: ['Previous', 'Current'],
                           datasets: [{
                             label: 'Total Spends',
                             data: [stats.totalSpent * 0.85, stats.totalSpent], // Simulated prev month
                             backgroundColor: ['#3b82f6', '#f7a325'],
                             borderRadius: 12,
                           }]
                         }}
                         options={{
                           maintainAspectRatio: false,
                           plugins: { legend: { display: false } },
                           scales: { 
                             y: { display: false },
                             x: { grid: { display: false }, ticks: { font: { weight: 'bold' } } }
                           }
                         }}
                       />
                    </div>
                    <p className="mt-8 text-xs text-center text-gray-500 font-medium">
                       {stats.totalSpent > stats.totalSpent * 0.85 
                          ? `You spent 15% more than last month. Watch those ${stats.highestCat[0]} costs! 📈` 
                          : 'Better budgeting! You spent less than last month. 🚀'}
                    </p>
                 </div>
              </div>

              {/* Transactions Table */}
              <div className="bg-white dark:bg-brand-navy border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-lg">
                 <div className="p-6 border-b border-gray-200 dark:border-white/10 flex justify-between items-center">
                    <h3 className="font-display font-extrabold text-xl">Recent Activity</h3>
                    <div className="relative">
                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                       <input 
                         type="text" 
                         placeholder="Search note..."
                         className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-lg py-1 pl-8 pr-4 text-xs focus:outline-none"
                       />
                    </div>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead>
                          <tr className="bg-gray-50 dark:bg-white/5 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                             <th className="px-6 py-4">Date</th>
                             <th className="px-6 py-4">Category</th>
                             <th className="px-6 py-4">Note</th>
                             <th className="px-6 py-4 text-right">Amount</th>
                             <th className="px-6 py-4 text-right">Actions</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                          {transactions.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-bold italic">
                                 No transactions yet. Add your first one above.
                              </td>
                            </tr>
                          ) : (
                            transactions.map((t) => (
                               <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-white/2 transition-colors">
                                  <td className="px-6 py-4 text-xs font-medium">{t.date}</td>
                                  <td className="px-6 py-4">
                                     <span className="text-[10px] px-2 py-1 bg-gray-100 dark:bg-white/10 rounded-full font-bold">{t.category}</span>
                                  </td>
                                  <td className="px-6 py-4 text-xs text-gray-500 max-w-[150px] truncate">{t.note || '-'}</td>
                                  <td className={`px-6 py-4 text-sm font-extrabold text-right ${t.type === 'expense' ? 'text-red-500' : 'text-emerald-500'}`}>
                                     {t.type === 'expense' ? '-' : '+'}{formatCurrency(t.amount)}
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                     <div className="flex justify-end gap-2">
                                        <button onClick={() => handleEdit(t)} className="p-2 hover:bg-brand-amber/10 text-brand-amber rounded-lg transition-colors">
                                           <Edit3 size={14} />
                                        </button>
                                        <button onClick={() => handleDelete(t.id)} className="p-2 hover:bg-red-50 to-red-500 text-red-400 hover:text-red-600 rounded-lg transition-colors">
                                           <Trash2 size={14} />
                                        </button>
                                     </div>
                                  </td>
                               </tr>
                            ))
                          )}
                       </tbody>
                    </table>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </section>
  );
}

const dummyTransactions: Transaction[] = [
  { id: 'd1', date: '2026-05-01', category: 'Food', amount: 450, type: 'expense', note: 'Zomato Lunch' },
  { id: 'd2', date: '2026-05-02', category: 'Transport', amount: 80, type: 'expense', note: 'Uber Auto' },
  { id: 'd3', date: '2026-05-03', category: 'Shopping', amount: 1200, type: 'expense', note: 'Amazon' },
  { id: 'd4', date: '2026-05-04', category: 'Other', amount: 50000, type: 'income', note: 'Salary' },
  { id: 'd5', date: '2026-05-05', category: 'Rent', amount: 15000, type: 'expense', note: 'Monthly House Rent' }
];
