"use client"
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import Navbar from '../layout/navbar';
import InputField from '../global/input-field';
import Button from '../global/button';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = form.email.trim().toLowerCase();
    const password = form.password;
    
    if (!email || !password) {
      toast.error('Email and password are required.');
      return;
    }
    
    setIsLoading(true);
    
    const loadingToast = toast.loading('SIGNING IN...', {
      duration: Infinity,
    });
    
    try {
      const callbackUrl = searchParams.get('callbackUrl');

      const res = await signIn("credentials", { 
        redirect: false, 
        email,
        password,
        callbackUrl: callbackUrl || undefined,
      });
      
      if (res?.error) {
        toast.dismiss(loadingToast);
        toast.error("INVALID CREDENTIALS");
        return;
      }
      
      if (res?.ok) {
        toast.dismiss(loadingToast);
        toast.success('LOGIN SUCCESSFUL!');

        if (callbackUrl && callbackUrl.startsWith('/')) {
          router.push(callbackUrl);
          return;
        }

        const sessionRes = await fetch('/api/auth/session', { cache: 'no-store' });
        const session = await sessionRes.json();
        const role = session?.user?.role;

        if (role === 'admin') {
          router.push('/admin_dashboard');
        } else {
          router.push('/student_dashboard');
        }
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("ERROR OCCURRED");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white nb-grid-bg">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-16 md:py-24">
        <div className="w-full max-w-lg">
          {/* Main Card Container - Neo Brutalism */}
          <div className="border-[4px] border-black bg-white shadow-[12px_12px_0px] shadow-black p-0">
            {/* Header Section - Bold Contrast */}
            <div className="bg-black text-white border-b-[4px] border-black px-8 py-12">
              <h1 className="nb-heading-light text-4xl md:text-6xl mb-2">SIGN IN</h1>
              <div className="w-full h-1 bg-[#FF0080] mb-4"></div>
              <p className="text-xl font-bold uppercase tracking-wider">ACCESS YOUR ACCOUNT</p>
            </div>
            
            {/* Form Section */}
            <div className="px-8 md:px-12 py-12">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Email Field */}
                <div>
                  <label className="block text-black font-black text-lg uppercase tracking-wide mb-3">
                    EMAIL ADDRESS
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="YOUR@EMAIL.COM"
                    disabled={isLoading}
                    className="nb-input"
                    required
                  />
                </div>
                
                {/* Password Field */}
                <div>
                  <label className="block text-black font-black text-lg uppercase tracking-wide mb-3">
                    PASSWORD
                  </label>
                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    disabled={isLoading}
                    className="nb-input"
                    required
                  />
                </div>
                
                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-8 py-4 bg-[#FF0080] text-white font-black text-lg border-[4px] border-black uppercase tracking-wider shadow-[8px_8px_0px] shadow-black hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0px] active:translate-x-[8px] active:translate-y-[8px] active:shadow-none transition-all duration-100 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-3">
                      <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      SIGNING IN
                    </span>
                  ) : 'SIGN IN'}
                </button>
                
                {/* Divider */}
                <div className="relative">
                  <div className="border-t-[3px] border-black"></div>
                </div>
                
                {/* Sign Up Link */}
                <div className="text-center">
                  <p className="text-sm font-bold uppercase tracking-wider mb-4">
                    NEW HERE?
                  </p>
                  <button
                    type="button"
                    onClick={() => router.push('/signup')}
                    className="w-full px-6 py-3 bg-black text-white font-black text-base border-[3px] border-black uppercase tracking-wide shadow-[6px_6px_0px] shadow-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px] active:translate-x-[4px] active:translate-y-[4px] transition-all duration-100"
                  >
                    CREATE ACCOUNT
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          {/* Info Banner */}
          <div className="mt-8 border-[3px] border-black bg-[#FFFF00] text-black p-6">
            <p className="font-black text-sm uppercase tracking-wider">
              📧 DEMO: Use test@example.com / password123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;