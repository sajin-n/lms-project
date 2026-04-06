"use client"
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import MainLayout from '../layout/main-layout';
import Sidebar from '../layout/sidebar';
import Navbar from '../layout/navbar';
import Card from '../global/card';
import SessionExpiredModal from '../global/session-expired-modal';

const DashboardPage = () => {
  const { data: session } = useSession();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showExpiredModal, setShowExpiredModal] = useState(false);

  const fetchDashboard = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/dashboard/admin', { cache: 'no-store' });
      const payload = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setShowExpiredModal(true);
          return;
        }
        throw new Error(payload?.error || 'Failed to load admin dashboard');
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

  const statCards = useMemo(() => {
    const stats = data?.stats;
    if (!stats) return [];

    return [
      { label: 'TOTAL USERS', value: stats.usersCount, icon: '👥', color: 'bg-[#FF0080]' },
      { label: 'STUDENTS', value: stats.studentsCount, icon: '🎓', color: 'bg-[#00FFD1]' },
      { label: 'ADMINS', value: stats.adminsCount, icon: '👨‍💼', color: 'bg-[#A000FF]' },
      { label: 'COURSES', value: stats.coursesCount, icon: '📚', color: 'bg-[#FFFF00]' },
      { label: 'ENROLLMENTS', value: stats.enrollmentsCount, icon: '📝', color: 'bg-[#FF6B00]' },
      { label: 'COMPLETION', value: `${stats.completionRate}%`, icon: '✓', color: 'bg-[#00FF41]' },
    ];
  }, [data]);

  return (
    <MainLayout sidebar={<Sidebar role="admin" />} navbar={<Navbar />}>
      <SessionExpiredModal isOpen={showExpiredModal} onClose={() => setShowExpiredModal(false)} />
      
      {/* Hero Section */}
      <div className="mb-12 border-[4px] border-black bg-gradient-to-r from-[#A000FF] to-[#FF0080] text-white p-12">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="nb-heading-light text-5xl md:text-7xl mb-4">ADMIN</h1>
            <p className="text-2xl md:text-3xl font-bold uppercase tracking-wider mb-2">
              CONTROL CENTER
            </p>
            <div className="w-32 h-1 bg-[#00FFD1] mb-2"></div>
            <p className="text-lg font-bold uppercase tracking-wider text-gray-100">MANAGE EVERYTHING</p>
          </div>
          <button
            onClick={fetchDashboard}
            className="px-6 py-3 bg-white text-black font-black border-[3px] border-white uppercase tracking-wide shadow-[6px_6px_0px] shadow-white hover:translate-x-[3px] hover:translate-y-[3px] active:shadow-none transition-all duration-100"
          >
            ⚡ REFRESH
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
            <p className="font-black text-lg uppercase tracking-wider">LOADING...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Stats Grid - Epic Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {statCards.map((item, idx) => (
              <div key={item.label} className={`border-[4px] border-black ${item.color} text-black p-8 shadow-[8px_8px_0px] shadow-black hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[12px_12px_0px] transition-all duration-150 ${item.color === 'bg-[#FFFF00]' ? 'text-black' : item.color.includes('FF0080') || item.color.includes('A000FF') || item.color.includes('FF6B00') ? 'text-white' : 'text-black'}`}>
                <div className="text-5xl mb-4">{item.icon}</div>
                <p className="font-black text-xs uppercase tracking-widest mb-3 opacity-75">{item.label}</p>
                <p className="text-6xl font-black leading-none">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Recent Users Card */}
            <div className="border-[4px] border-black bg-white shadow-[8px_8px_0px] shadow-black p-8">
              <h2 className="nb-subheading text-3xl mb-8">RECENT USERS</h2>
              <div className="mb-6">
                <div className="w-full h-1 bg-black mb-6"></div>
              </div>
              {data?.recentUsers?.length ? (
                <div className="space-y-4">
                  {data.recentUsers.map((user) => (
                    <div key={user._id} className="border-l-[4px] border-[#FF0080] pl-6 py-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-black text-base uppercase tracking-wide">{user.name}</h3>
                        <span className={`px-3 py-1 font-black text-xs uppercase border-[2px] border-black ${user.role === 'admin' ? 'bg-[#A000FF] text-white' : 'bg-[#00FFD1] text-black'}`}>
                          {user.role}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 font-medium">{user.email}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-[3px] border-dashed border-gray-300 p-8 text-center">
                  <p className="font-black text-lg uppercase tracking-wider text-gray-500">NO DATA</p>
                </div>
              )}
            </div>

            {/* Recent Courses Card */}
            <div className="border-[4px] border-black bg-white shadow-[8px_8px_0px] shadow-black p-8">
              <h2 className="nb-subheading text-3xl mb-8">RECENT COURSES</h2>
              <div className="mb-6">
                <div className="w-full h-1 bg-black mb-6"></div>
              </div>
              {data?.recentCourses?.length ? (
                <div className="space-y-4">
                  {data.recentCourses.map((course) => (
                    <div key={course._id} className="border-l-[4px] border-[#00FFD1] pl-6 py-4 hover:bg-gray-50 transition-colors">
                      <h3 className="font-black text-base uppercase tracking-wide mb-2">{course.title}</h3>
                      <div className="flex gap-4">
                        <span className="px-3 py-1 bg-[#FFFF00] text-black font-black text-xs uppercase border-[2px] border-black">
                          {course.level}
                        </span>
                        <span className="px-3 py-1 bg-[#FF6B00] text-white font-black text-xs uppercase border-[2px] border-black">
                          {course.durationWeeks} WEEKS
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-[3px] border-dashed border-gray-300 p-8 text-center">
                  <p className="font-black text-lg uppercase tracking-wider text-gray-500">NO DATA</p>
                </div>
              )}
            </div>
          </div>

          {/* Admin Action Buttons - Bold & Epic */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/edit_lesson"
              className="border-[4px] border-black bg-[#00FFD1] text-black p-8 shadow-[8px_8px_0px] shadow-black hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0px] active:shadow-none transition-all duration-100 text-center font-black text-lg uppercase tracking-wider"
            >
              📚 MANAGE COURSES
            </Link>
            <Link
              href="/manage_students"
              className="border-[4px] border-black bg-[#FF0080] text-white p-8 shadow-[8px_8px_0px] shadow-black hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0px] active:shadow-none transition-all duration-100 text-center font-black text-lg uppercase tracking-wider"
            >
              👥 MANAGE STUDENTS
            </Link>
          </div>
        </>
      )}
    </MainLayout>
  );
};

export default DashboardPage;