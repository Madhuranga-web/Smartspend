'use client';
import { Trash2, ReceiptText } from 'lucide-react';
import { expenseService } from '@/services/expense.service';

interface Expense {
  _id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export default function ExpenseTable({ 
  expenses, 
  onExpenseDeleted 
}: { 
  expenses: Expense[], 
  onExpenseDeleted: () => void 
}) {

  const handleDelete = async (id: string) => {
    if (window.confirm("මෙම වියදම ඉවත් කිරීමට ඔබට විශ්වාසද?")) {
      try {
        await expenseService.deleteExpense(id); // service එකේ මේක තියෙන්න ඕනේ
        onExpenseDeleted(); // Dashboard එක refresh කරනවා
      } catch (error) {
        alert("වියදම මැකීමට නොහැකි විය.");
      }
    }
  };

  // ඩේටා නැති වෙලාවට ලස්සන Empty State එකක් පෙන්වමු
  if (!expenses || expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
        <ReceiptText size={48} className="text-slate-300 mb-3" />
        <p className="text-slate-500 font-medium">තවමත් වියදම් කිසිවක් ඇතුළත් කර නැත.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Description</th>
              <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Category</th>
              <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Amount</th>
              <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-center font-serif">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {expenses.map((exp) => (
              <tr key={exp._id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="p-5">
                  <p className="font-bold text-slate-700">{exp.description}</p>
                  <p className="text-[10px] text-slate-400 font-medium italic">
                    {new Date(exp.date).toLocaleDateString()}
                  </p>
                </td>
                <td className="p-5 text-center">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight
                    ${exp.category === 'Food' ? 'bg-orange-50 text-orange-600' : 
                      exp.category === 'Transport' ? 'bg-blue-50 text-blue-600' :
                      exp.category === 'Shopping' ? 'bg-pink-50 text-pink-600' :
                      'bg-emerald-50 text-emerald-600'}
                  `}>
                    {exp.category}
                  </span>
                </td>
                <td className="p-5 text-right">
                  <span className="font-black text-slate-900">
                    Rs. {exp.amount.toLocaleString()}
                  </span>
                </td>
                <td className="p-5 text-center">
                  <button 
                    onClick={() => handleDelete(exp._id)}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}