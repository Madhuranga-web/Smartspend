'use client';
import { signIn } from "next-auth/react";
import Link from 'next/link';
import { LayoutDashboard, UserPlus, Mail, Lock, User } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // NestJS Backend එකේ Signup Endpoint එකට data යවනවා
      const res = await fetch('http://localhost:3001/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Account Created Successfully! Redirecting to login...");
        router.push('/auth/login'); // Login පිටුවට යවනවා
      } else {
        // Backend එකෙන් එන error message එක (උදා: User already exists)
        alert(data.message || "Something went wrong!");
      }

    } catch (error) {
      alert("Backend Server එකත් එක්ක සම්බන්ධ වෙන්න බැහැ!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 font-sans">
      <div className="mb-8 flex items-center gap-2 text-3xl font-bold text-slate-800">
        <LayoutDashboard className="text-emerald-500" size={32} />
        <span>SmartSpend</span>
      </div>
      
      <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 w-full max-w-md">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-slate-800">Create Account</h2>
          <p className="text-slate-500 text-sm">Start managing your wealth with AI</p>
        </div>
        
        <form onSubmit={handleSignUp} className="space-y-4">
          <button 
            type="button" 
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 py-3.5 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition shadow-sm mb-6"
          >
            <img src="https://authjs.dev/img/providers/google.svg" className="w-5 h-5" alt="Google icon" />
            Sign up with Google
          </button>

          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
            <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-white px-2 text-slate-400 font-bold tracking-widest">Or use email</span></div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-3.5 text-slate-400" size={18} />
              <input 
                required
                type="text" 
                placeholder="Full Name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition text-slate-900 font-medium"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-slate-400" size={18} />
              <input 
                required
                type="email" 
                placeholder="Email Address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition text-slate-900 font-medium"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-slate-400" size={18} />
              <input 
                required
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition text-slate-900 font-medium"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-100 mt-6 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            <UserPlus size={20} /> {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-8 font-medium">
          Already have an account? <Link href="/auth/login" className="text-emerald-600 font-bold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}