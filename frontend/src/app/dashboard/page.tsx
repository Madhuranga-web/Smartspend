'use client';
import { useEffect, useState } from 'react';
import { expenseService } from '@/services/expense.service';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseTable from '../components/ExpenseTable';
import PieChart from "../components/Charts/PieChart";
import { LogOut, Wallet, TrendingUp, Sparkles, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [expenses, setExpenses] = useState([]);
  const [chartData, setChartData] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [aiAdvice, setAiAdvice] = useState<string>("");
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (!token || !savedUser) {
      router.push("/auth/login");
    } else {
      setUser(JSON.parse(savedUser));
      setLoading(false);
      loadData();
    }
  }, []);

  const loadData = async () => {
    try {
      const data = await expenseService.getAllExpenses();
      console.log("Fetched Expenses:", data);
      setExpenses(data);
      processChartData(data);
      
      // දත්ත ලැබුණු ගමන් AI Advice එකත් ගමු
      if (data.length > 0) {
        fetchAiAdvice(data);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const fetchAiAdvice = async (expenseList: any[]) => {
    setLoadingAdvice(true);
    try {
      // Backend එකේ get-advice endpoint එකට request එකක් යවනවා
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3001/expenses/advice', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const advice = await res.text();
      setAiAdvice(advice);
    } catch (error) {
      console.error("AI Advice error:", error);
    } finally {
      setLoadingAdvice(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  const processChartData = (data: any[]) => {
    const categories: any = {};
    data.forEach((exp) => {
      categories[exp.category] = (categories[exp.category] || 0) + exp.amount;
    });

    setChartData({
      labels: Object.keys(categories),
      datasets: [
        {
          data: Object.values(categories),
          backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#6366f1'],
          borderWidth: 0,
        },
      ],
    });
  };

  const totalSpending = expenses.reduce((acc, curr: any) => acc + curr.amount, 0);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#fcfdfd]">
        <Loader2 className="animate-spin text-emerald-500" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfdfd] font-sans pb-20">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-3 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2 font-bold text-slate-800">
          <TrendingUp size={28} className="text-emerald-600" />
          <span className="text-xl tracking-tight">SmartSpend AI</span>
        </div>
        
        <div className="flex items-center gap-5">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-700">{user?.name}</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">{user?.email}</p>
          </div>
          <button 
            onClick={handleLogout} 
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition"
          >
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-12">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900">Dashboard</h1>
          <p className="text-slate-500 font-medium">Take control of your finances intelligently.</p>
        </div>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="bg-emerald-50 w-12 h-12 rounded-2xl flex items-center justify-center text-emerald-600 mb-4">
              <Wallet size={24} />
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Spending</p>
            <h3 className="text-3xl font-black text-slate-900">Rs. {totalSpending.toLocaleString()}</h3>
          </div>

          {/* AI Advice Card */}
          <div className="md:col-span-2 bg-emerald-900 p-6 rounded-3xl shadow-xl text-white relative overflow-hidden">
            <Sparkles className="absolute right-4 top-4 text-emerald-400/30" size={80} />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2 text-emerald-300 font-bold text-sm uppercase">
                <Sparkles size={16} /> AI Financial Insight
              </div>
              {loadingAdvice ? (
                <div className="flex items-center gap-2 animate-pulse">
                  <div className="h-4 w-4 bg-emerald-400 rounded-full"></div>
                  <p>AI is analyzing your data…</p>
                </div>
              ) : (
                <p className="text-emerald-50 leading-relaxed font-medium">
                  {aiAdvice || "Once you add your expenses, I’ll provide advice here based on your financial patterns."}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form & Chart */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Enter a new expense</h2>
              <ExpenseForm onExpenseAdded={loadData} />
            </div>
            
            {chartData && (
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h2 className="text-lg font-bold text-slate-800 mb-6 text-center">Spending breakdown</h2>
                <PieChart data={chartData} />
              </div>
            )}
          </div>

          {/* Right Column: Table */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Expense History</h2>
              <ExpenseTable expenses={expenses} onExpenseDeleted={loadData} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}