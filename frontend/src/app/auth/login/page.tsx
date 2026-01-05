'use client';
import Link from 'next/link';
import { LayoutDashboard, Mail, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // --- Google Login Logic ---
  useEffect(() => {
    /* global google */
    // @ts-ignore
    if (window.google) {
      // @ts-ignore
      window.google.accounts.id.initialize({
        client_id: "743633020812-4jk9fu3mmui0n32k1dagl7fhpj95hrvd.apps.googleusercontent.com", // ඔයාගේ Client ID එක මෙතනට දාන්න
        callback: handleGoogleLogin,
      });

      // @ts-ignore
      window.google.accounts.id.renderButton(
        document.getElementById("googleBtn"),
        { 
          theme: "outline", 
          size: "large", 
          width: "100%", 
          shape: "pill",
          text: "signin_with" 
        }
      );
    }
  }, []);

  const handleGoogleLogin = async (response: any) => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: response.credential }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/dashboard');
      } else {
        alert("Google Login Failed!");
      }
    } catch (error) {
      alert("Error in Backend!");
    } finally {
      setLoading(false);
    }
  };
  // --------------------------

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/dashboard');
      } else {
        alert(data.message || "Wrong Email or Password!");
      }
    } catch (error) {
      alert("Backend server is not working!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6">
      <div className="mb-8 flex items-center gap-2 text-3xl font-bold text-slate-800">
        <LayoutDashboard className="text-emerald-500" size={32} /> SmartSpend
      </div>
      
      <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome Back</h2>
          <p className="text-slate-500">Login to manage your daily expenses</p>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
          <div className="relative">
            <Mail className="absolute left-4 top-4 text-slate-400" size={20} />
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 transition"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-4 text-slate-400" size={20} />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 transition"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-100 disabled:opacity-70"
          >
            {loading ? 'Processing...' : 'Sign In'}
          </button>
        </form>

        <div className="relative my-8 flex items-center justify-center">
          <span className="absolute inset-x-0 border-t border-slate-100"></span>
          <span className="relative bg-white px-4 text-xs text-slate-400 font-bold uppercase tracking-widest">Or continue with</span>
        </div>
        
        {/* Google බටන් එක පෙන්වන තැන */}
        <div id="googleBtn" className="w-full flex justify-center"></div>

        <p className="text-sm text-center text-slate-400 mt-10">
          New here? <Link href="/auth/signup" className="text-emerald-600 font-bold hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}