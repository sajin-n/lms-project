"use client";
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import MainLayout from '../layout/main-layout';
import Sidebar from '../layout/sidebar';
import Navbar from '../layout/navbar';
import Card from '../global/card';
import SessionExpiredModal from '../global/session-expired-modal';

const StudentDashboardPage = () => {
  const { data: session } = useSession();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showExpiredModal, setShowExpiredModal] = useState(false);

  const fetchDashboard = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/dashboard/student', { cache: 'no-store' });
      const payload = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setShowExpiredModal(true);
          return;
        }
        throw new Error(payload?.error || 'Failed to load student dashboard');
      }

      setData(payload);
    } catch (error) {
      toast.error(error.message || 'Failed to load dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  useEffect(() => {
    if (!session) {
      setShowExpiredModal(true);
    }
  }, [session]);

  const cards = useMemo(() => {
    const stats = data?.stats;
    if (!stats) return [];

    return [
      { label: 'AVAILABLE', value: stats.totalCourses, icon: '📚', color: 'bg-[#FF0080]' },
      { label: 'ENROLLED', value: stats.enrolledCourses, icon: '✓', color: 'bg-[#00FFD1]' },
      { label: 'COMPLETED', value: stats.completedCourses, icon: '🏆', color: 'bg-[#FFFF00]' },
      { label: 'PROGRESS', value: `${stats.averageProgress}%`, icon: '📊', color: 'bg-[#A000FF]' },
    ];
  }, [data]);

  return (
    <MainLayout sidebar={<Sidebar role="student" />} navbar={<Navbar />}>
      <SessionExpiredModal isOpen={showExpiredModal} />
      
      {/* Hero Section */}
      <div className="mb-12 border-[4px] border-black bg-gradient-to-r from-[#000000] to-[#1a1a1a] text-white p-12">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="nb-heading-light text-5xl md:text-7xl mb-4">HEY,</h1>
            <p className="text-2xl md:text-3xl font-bold uppercase tracking-wider mb-2">
              {session?.user?.name?.toUpperCase() || 'STUDENT'}
            </p>
            <div className="w-32 h-1 bg-[#FF0080] mb-2"></div>
            <p className="text-lg font-bold uppercase tracking-wider text-gray-300">WELCOME BACK TO YOUR DASHBOARD</p>
          </div>
          <button
            onClick={fetchDashboard}
            className="px-6 py-3 bg-[#FF0080] text-white font-black border-[3px] border-white uppercase tracking-wide shadow-[6px_6px_0px] shadow-white hover:translate-x-[3px] hover:translate-y-[3px] active:shadow-none transition-all duration-100"
          >
            ↻ REFRESH
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block">
              <svg className="animate-spin h-12 w-12 text-black mb-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="font-black text-lg uppercase tracking-wider">LOADING DATA...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {cards.map((item) => (
              <div key={item.label} className={`border-[4px] border-black ${item.color} text-black p-8 shadow-[8px_8px_0px] shadow-black hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[12px_12px_0px] transition-all duration-150`}>
                <div className="text-4xl mb-4">{item.icon}</div>
                <p className="font-black text-sm uppercase tracking-widest mb-3 text-gray-700">{item.label}</p>
                <p className="text-5xl md:text-6xl font-black leading-none">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Recent Enrollments */}
          <div className="border-[4px] border-black bg-white p-8 shadow-[8px_8px_0px] shadow-black mb-12">
            <h2 className="nb-subheading text-3xl md:text-4xl mb-8">RECENT</h2>
            <div className="mb-8">
              <div className="w-full h-1 bg-black mb-8"></div>
              
              {data?.enrollments?.length ? (
                <div className="space-y-4">
                  {data.enrollments.slice(0, 5).map((enrollment, idx) => (
                    <div key={enrollment._id} className="border-l-[4px] border-[#FF0080] pl-6 py-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-black text-lg uppercase tracking-wide text-black">
                          {enrollment.course?.title}
                        </h3>
                        <span className="px-4 py-1 bg-[#00FFD1] text-black font-black text-xs uppercase border-[2px] border-black">
                          {enrollment.status?.toUpperCase() || 'ACTIVE'}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 border-[2px] border-black h-4">
                        <div 
                          className="bg-[#FF0080] border-r-[2px] border-black h-full transition-all duration-300"
                          style={{ width: `${enrollment.progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs font-bold uppercase tracking-wider mt-2 text-gray-600">
                        {enrollment.progress}% COMPLETE
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-[3px] border-dashed border-gray-300 p-8 text-center">
                  <p className="font-black text-lg uppercase tracking-wider text-gray-500">
                    NO ENROLLMENTS YET
                  </p>
                  <p className="text-sm text-gray-400 mt-2">START YOUR LEARNING JOURNEY</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/courses"
              className="border-[4px] border-black bg-[#FF0080] text-white p-8 shadow-[8px_8px_0px] shadow-black hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0px] active:shadow-none transition-all duration-100 text-center font-black text-lg uppercase tracking-wider"
            >
              📚 EXPLORE COURSES
            </Link>
            <Link
              href="/grades"
              className="border-[4px] border-black bg-[#00FFD1] text-black p-8 shadow-[8px_8px_0px] shadow-black hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0px] active:shadow-none transition-all duration-100 text-center font-black text-lg uppercase tracking-wider"
            >
              📊 VIEW GRADES
            </Link>
            <Link
              href="/profile"
              className="border-[4px] border-black bg-black text-white p-8 shadow-[8px_8px_0px] shadow-black hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0px] active:shadow-none transition-all duration-100 text-center font-black text-lg uppercase tracking-wider"
            >
              👤 YOUR PROFILE
            </Link>
          </div>
        </>
      )}
    </MainLayout>
  );
};

export default StudentDashboardPage;
