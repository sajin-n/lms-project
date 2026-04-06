"use client";
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import MainLayout from '../layout/main-layout';
import Sidebar from '../layout/sidebar';
import Navbar from '../layout/navbar';
import Card from '../global/card';
import SessionExpiredModal from '../global/session-expired-modal';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState(null);
  const [showExpiredModal, setShowExpiredModal] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/student', { cache: 'no-store' });
        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            setShowExpiredModal(true);
            return;
          }
          throw new Error(data?.error || 'Failed to load profile data');
        }

        setStats(data.stats);
      } catch (error) {
        toast.error(error.message || 'Failed to load profile data');
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    if (!session) {
      setShowExpiredModal(true);
    }
  }, [session]);

  return (
    <MainLayout sidebar={<Sidebar role="student" />} navbar={<Navbar />}>
      <SessionExpiredModal isOpen={showExpiredModal} />
      
      {/* Header Section */}
      <div className="mb-12 border-[4px] border-black bg-[#A000FF] text-white p-12">
        <h1 className="nb-heading-light text-5xl md:text-6xl mb-2">YOUR</h1>
        <p className="text-2xl md:text-3xl font-bold uppercase tracking-wider">PROFILE</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Details */}
        <div className="border-[4px] border-black bg-white shadow-[8px_8px_0px] shadow-black hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[12px_12px_0px] transition-all duration-150 p-8">
          <h2 className="nb-subheading text-2xl md:text-3xl mb-8">ACCOUNT</h2>
          <div className="space-y-6 border-t-[4px] border-black pt-8">
            <div>
              <p className="font-black text-xs uppercase tracking-widest text-gray-600 mb-2">NAME</p>
              <p className="text-2xl font-black text-black">{session?.user?.name || '—'}</p>
            </div>
            <div>
              <p className="font-black text-xs uppercase tracking-widest text-gray-600 mb-2">EMAIL</p>
              <p className="text-sm font-bold text-gray-800 break-all">{session?.user?.email || '—'}</p>
            </div>
            <div>
              <p className="font-black text-xs uppercase tracking-widest text-gray-600 mb-2">ROLE</p>
              <span className="px-4 py-2 bg-[#00FFD1] text-black font-black text-sm uppercase border-[2px] border-black inline-block">
                {session?.user?.role || '—'}
              </span>
            </div>
          </div>
        </div>

        {/* Learning Stats */}
        <div className="border-[4px] border-black bg-white shadow-[8px_8px_0px] shadow-black hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[12px_12px_0px] transition-all duration-150 p-8">
          <h2 className="nb-subheading text-2xl md:text-3xl mb-8">LEARNING</h2>
          <div className="space-y-6 border-t-[4px] border-black pt-8">
            <div>
              <p className="font-black text-xs uppercase tracking-widest text-gray-600 mb-2">ENROLLED</p>
              <p className="text-5xl font-black text-[#FF0080]">{stats?.enrolledCourses ?? 0}</p>
              <p className="text-xs font-bold text-gray-500 mt-1">COURSES</p>
            </div>
            <div>
              <p className="font-black text-xs uppercase tracking-widest text-gray-600 mb-2">COMPLETED</p>
              <p className="text-5xl font-black text-[#00FFD1]">{stats?.completedCourses ?? 0}</p>
              <p className="text-xs font-bold text-gray-500 mt-1">COURSES</p>
            </div>
            <div>
              <p className="font-black text-xs uppercase tracking-widest text-gray-600 mb-2">PROGRESS</p>
              <div className="flex items-baseline gap-2">
                <p className="text-5xl font-black text-[#FFFF00]">{stats?.averageProgress ?? 0}%</p>
                <div className="w-32 bg-gray-200 border-[2px] border-black h-3 flex-1">
                  <div 
                    className="bg-[#FFFF00] border-r-[2px] border-black h-full"
                    style={{ width: `${stats?.averageProgress ?? 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
