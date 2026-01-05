'use client';
import { useState } from 'react';
import { expenseService } from '@/services/expense.service';
import { PlusCircle, Loader2 } from 'lucide-react';

export default function ExpenseForm({ onExpenseAdded }: { onExpenseAdded: () => void }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // වැදගත්: category එක මෙතනින් යවන්න එපා. 
      // එතකොට Backend එකේ GeminiService එකෙන් description එක බලලා category එක හදාගනියි.
      await expenseService.addExpense({ 
        description, 
        amount: Number(amount), 
        date
      });

      setDescription('');
      setAmount('');
      
      // Dashboard එක refresh කරන්න මේක අනිවාර්යයි
      onExpenseAdded(); 
      
    } catch (error) {
      console.error(error);
      alert("Error adding expense!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <PlusCircle size={20} className="text-emerald-600" />
        <h2 className="text-lg font-bold text-slate-800">Add Expense</h2>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Description</label>
          <input
            type="text" 
            placeholder="e.g. Starbucks Coffee"
            className="w-full p-3 mt-1 border border-slate-100 bg-slate-50 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition text-slate-700"
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            required
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Amount (Rs.)</label>
          <input
            type="number" 
            placeholder="0.00"
            className="w-full p-3 mt-1 border border-slate-100 bg-slate-50 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition text-slate-700 font-mono"
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            required
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Date</label>
          <input
            type="date"
            className="w-full p-3 mt-1 border border-slate-100 bg-slate-50 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition text-slate-700"
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            required
          />
        </div>

        <button
          type="submit" 
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-emerald-100 disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
        >
          {loading ? (
            <><Loader2 className="animate-spin" size={20} /> Saving...</>
          ) : (
            'Save Expense'
          )}
        </button>
      </div>
    </form>
  );
}