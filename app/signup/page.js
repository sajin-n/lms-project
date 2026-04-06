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
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {/* Card Container */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header Section */}
            <div className="bg-linear-to-r from-blue-600 to-indigo-600 px-8 py-6">
              <h2 className="text-3xl font-bold text-white text-center">Sign Up</h2>
              <p className="text-blue-100 text-center mt-2 text-sm">Create your account to get started</p>
            </div>
            
            {/* Form Section */}
            <div className="px-8 py-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <InputField
                  label="Full Name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  disabled={isLoading}
                  required
                />
                
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
                  placeholder="Enter your password (min 8 characters)"
                  disabled={isLoading}
                  required
                />

                <InputField
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  disabled={isLoading}
                  required
                />
                
                <div className="mb-4">
                  <label htmlFor="role" className="block text-sm text-gray-700 font-semibold mb-2">
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-gray-900 bg-gray-50 border-2 border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 hover:border-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={isLoading}
                    required
                  >
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {form.role === 'admin' && (
                  <InputField
                    label="Admin Invite Code"
                    name="adminInviteCode"
                    type="password"
                    value={form.adminInviteCode}
                    onChange={handleChange}
                    placeholder="Enter admin invite code"
                    disabled={isLoading}
                    required
                  />
                )}
                
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </span>
                  ) : 'Sign Up'}
                </Button>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => router.push('/signin')}
                      className="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-all"
                    >
                      Sign In
                    </button>
                  </p>
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
