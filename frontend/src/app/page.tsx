'use client';
import Link from 'next/link';
import { TrendingUp, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-12 py-8 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-2 text-2xl font-bold text-slate-900 tracking-tight">
          <TrendingUp className="text-emerald-500" size={30} strokeWidth={2.5} />
          <span>SmartSpend</span>
        </div>
        <div className="flex items-center gap-10">
          <Link href="/auth/login" className="text-slate-600 font-semibold hover:text-emerald-600 transition text-lg">
            Login
          </Link>
          <Link 
            href="/auth/signup" 
            className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-100 text-lg"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-[1400px] mx-auto px-12 py-12 md:py-24 grid lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-12">
          <h1 className="text-[5.5rem] font-black text-slate-900 leading-[1] tracking-tighter">
            AI-Powered Expense <br /> 
            Tracker
          </h1>
          
          <p className="text-2xl text-slate-500 max-w-xl leading-relaxed font-medium">
            Track expenses effortlessly with AI categorization, get monthly insights, 
            predict future spending, and never miss a budget alert.
          </p>

          <div className="pt-6">
            <Link 
              href="/auth/signup" 
              className="inline-flex items-center gap-3 bg-emerald-600 text-white px-10 py-5 rounded-2xl text-xl font-bold hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-200 group"
            >
              Start Tracking 
              <ArrowRight className="group-hover:translate-x-2 transition-transform" size={26} />
            </Link>
          </div>
        </div>

        {/* Right Side Image */}
        <div className="relative pl-10">
          <div className="relative bg-slate-100 rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] aspect-[4/3] transform rotate-2">
             <img 
               src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2026" 
               className="object-cover w-full h-full opacity-95 -rotate-2 scale-110" 
               alt="Financial Data Visualization" 
             />
             <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent"></div>
          </div>
          
          <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-[2rem] shadow-2xl border border-slate-100 hidden xl:block">
             <div className="flex items-center gap-4">
                <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600">
                   <TrendingUp size={32} />
                </div>
                <div>
                   <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Efficiency</p>
                   <p className="text-2xl font-black text-slate-900">+85% Savings</p>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}