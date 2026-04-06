"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';
import Navbar from '../../components/layout/navbar';
import InputField from '../../components/global/input-field';
import Button from '../../components/global/button';

const SignupPage = () => {
  const [form, setForm] = useState({ 
    email: '',
    password: '',
    confirmPassword: '',
    name: '', 
    role: 'student',
    adminInviteCode: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = form.email.trim().toLowerCase();
    const password = form.password;
    const name = form.name.trim();
    const wantsAdmin = form.role === 'admin';
    
    if (!email || !password || !name || !form.role) {
      toast.error('All fields are required.');
      return;
    }

    if (password !== form.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    if (password.length < 8 || !/\d/.test(password)) {
      toast.error('Password must be at least 8 characters and include a number.');
      return;
    }

    if (wantsAdmin && !form.adminInviteCode.trim()) {
      toast.error('Admin invite code is required for admin registration.');
      return;
    }
    
    setIsLoading(true);
  
    const loadingToast = toast.loading('Creating your account...', {
      duration: Infinity,
    });
    
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name,
          role: form.role,
          adminInviteCode: form.adminInviteCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.dismiss(loadingToast);
        toast.error(data.error || 'Registration failed. Please try again.');
        return;
      }

      toast.dismiss(loadingToast);
      const loginToast = toast.loading('Registration successful! Logging you in...', {
        duration: Infinity,
      });

      // Optional: Wait for DB consistency
      await new Promise((res) => setTimeout(res, 500));

      const signInResponse = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (signInResponse?.ok) {
        const sessionRes = await fetch('/api/auth/session', { cache: 'no-store' });
        const session = await sessionRes.json();

        toast.dismiss(loginToast);
        toast.success(`Welcome ${name}! Redirecting to your dashboard...`);

        if (session?.user?.role === 'admin') {
          router.push('/admin_dashboard');
        } else {
          router.push('/student_dashboard');
        }
      } else {
        toast.dismiss(loginToast);
        toast.error('Registration succeeded, but automatic login failed. Please sign in manually.');
        setTimeout(() => {
          router.push('/signin');
        }, 3000);
      }

    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error('An unexpected error occurred. Please try again.');
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
            <div className="bg-[#00FFD1] text-black border-b-[4px] border-black px-8 py-12">
              <h1 className="nb-heading text-4xl md:text-5xl mb-2">CREATE</h1>
              <h2 className="nb-heading text-4xl md:text-5xl mb-4">ACCOUNT</h2>
              <div className="w-full h-1 bg-black mb-4"></div>
              <p className="text-lg font-bold uppercase tracking-wider">JOIN THE PLATFORM</p>
            </div>
            
            {/* Form Section */}
            <div className="px-8 md:px-12 py-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name Field */}
                <div>
                  <label className="block text-black font-black text-lg uppercase tracking-wide mb-2">
                    YOUR NAME
                  </label>
                  <input
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="FULL NAME"
                    disabled={isLoading}
                    className="nb-input"
                    required
                  />
                </div>
                
                {/* Email Field */}
                <div>
                  <label className="block text-black font-black text-lg uppercase tracking-wide mb-2">
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
                  <label className="block text-black font-black text-lg uppercase tracking-wide mb-2">
                    PASSWORD
                  </label>
                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="MIN 8 CHARS + NUMBER"
                    disabled={isLoading}
                    className="nb-input"
                    required
                  />
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-black font-black text-lg uppercase tracking-wide mb-2">
                    CONFIRM PASSWORD
                  </label>
                  <input
                    name="confirmPassword"
                    type="password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="•••••••••"
                    disabled={isLoading}
                    className="nb-input"
                    required
                  />
                </div>
                
                {/* Role Selection */}
                <div>
                  <label className="block text-black font-black text-lg uppercase tracking-wide mb-2">
                    SELECT ROLE
                  </label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="nb-input cursor-pointer appearance-none bg-white"
                    disabled={isLoading}
                    required
                  >
                    <option value="student" className="bg-white text-black">STUDENT</option>
                    <option value="admin" className="bg-white text-black">ADMIN</option>
                  </select>
                </div>

                {/* Admin Invite Code - Conditional */}
                {form.role === 'admin' && (
                  <div className="border-[3px] border-[#FF0080] bg-[#FFE6F0] p-4 mb-4">
                    <label className="block text-black font-black text-lg uppercase tracking-wide mb-2">
                      🔐 ADMIN CODE
                    </label>
                    <input
                      name="adminInviteCode"
                      type="password"
                      value={form.adminInviteCode}
                      onChange={handleChange}
                      placeholder="ENTER ADMIN KEY"
                      disabled={isLoading}
                      className="nb-input"
                      required
                    />
                  </div>
                )}
                
                {/* Sign Up Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-8 py-4 bg-[#00FFD1] text-black font-black text-lg border-[4px] border-black uppercase tracking-wider shadow-[8px_8px_0px] shadow-black hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0px] active:translate-x-[8px] active:translate-y-[8px] active:shadow-none transition-all duration-100 disabled:opacity-50 mt-8"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-3">
                      <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      CREATING
                    </span>
                  ) : 'CREATE ACCOUNT'}
                </button>
                
                {/* Divider */}
                <div className="relative">
                  <div className="border-t-[3px] border-black"></div>
                </div>
                
                {/* Sign In Link */}
                <div className="text-center">
                  <p className="text-sm font-bold uppercase tracking-wider mb-4">
                    ALREADY A MEMBER?
                  </p>
                  <button
                    type="button"
                    onClick={() => router.push('/signin')}
                    className="w-full px-6 py-3 bg-black text-white font-black text-base border-[3px] border-black uppercase tracking-wide shadow-[6px_6px_0px] shadow-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px] active:translate-x-[4px] active:translate-y-[4px] transition-all duration-100"
                  >
                    SIGN IN
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
