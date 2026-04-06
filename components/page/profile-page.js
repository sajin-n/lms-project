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
      <h1 className="text-3xl font-bold text-black mb-6">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <h2 className="text-xl font-semibold text-black mb-4">Account Details</h2>
          <p className="text-sm text-gray-700 mb-2">
            <span className="font-medium">Name:</span> {session?.user?.name || '-'}
          </p>
          <p className="text-sm text-gray-700 mb-2">
            <span className="font-medium">Email:</span> {session?.user?.email || '-'}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-medium">Role:</span> {session?.user?.role || '-'}
          </p>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-black mb-4">Learning Snapshot</h2>
          <p className="text-sm text-gray-700 mb-2">
            <span className="font-medium">Enrolled Courses:</span> {stats?.enrolledCourses ?? 0}
          </p>
          <p className="text-sm text-gray-700 mb-2">
            <span className="font-medium">Completed Courses:</span> {stats?.completedCourses ?? 0}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-medium">Average Progress:</span> {stats?.averageProgress ?? 0}%
          </p>
        </Card>
      </div>
    </MainLayout>
  );
}
