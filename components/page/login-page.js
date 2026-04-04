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
    
    const loadingToast = toast.loading('Signing you in...', {
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
        toast.error("Invalid credentials. Please check your email and password.");
        return;
      }
      
      if (res?.ok) {
        toast.dismiss(loadingToast);
        toast.success('Login successful! Redirecting...');

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
      toast.error("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {/* Card Container */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header Section */}
            <div className="bg-linear-to-r from-blue-600 to-indigo-600 px-8 py-6">
              <h2 className="text-3xl font-bold text-white text-center">Sign In</h2>
             
            </div>
            
            {/* Form Section */}
            <div className="px-8 py-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <InputField
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  disabled={isLoading}
                  required
                />
                
                <InputField
                  label="Password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  disabled={isLoading}
                  required
                />
                
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : 'Sign In'}
                </Button>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Don&apos;t have an account?{' '}
                    <button
                      type="button"
                      onClick={() => router.push('/signup')}
                      className="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-all"
                    >
                      Sign Up
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>
          
          {/* Test Credentials */}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;