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
      { label: 'Total Users', value: stats.usersCount },
      { label: 'Students', value: stats.studentsCount },
      { label: 'Admins', value: stats.adminsCount },
      { label: 'Courses', value: stats.coursesCount },
      { label: 'Enrollments', value: stats.enrollmentsCount },
      { label: 'Completion Rate', value: `${stats.completionRate}%` },
    ];
  }, [data]);

  return (
    <MainLayout sidebar={<Sidebar role="admin" />} navbar={<Navbar />}>
      <SessionExpiredModal isOpen={showExpiredModal} onClose={() => setShowExpiredModal(false)} />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-black">Admin Dashboard</h1>
        <button
          onClick={fetchDashboard}
          className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      {isLoading ? (
        <p className="text-gray-600">Loading dashboard...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {statCards.map((item) => (
              <Card key={item.label}>
                <p className="text-sm text-gray-500">{item.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{item.value}</p>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card>
              <h2 className="text-xl font-semibold text-black mb-3">Recent Users</h2>
              <ul className="space-y-2">
                {data?.recentUsers?.length ? (
                  data.recentUsers.map((user) => (
                    <li key={user._id} className="text-sm text-gray-700">
                      <span className="font-medium">{user.name}</span> · {user.email} ·{' '}
                      <span className="uppercase text-xs">{user.role}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-gray-500">No users yet.</li>
                )}
              </ul>
            </Card>

            <Card>
              <h2 className="text-xl font-semibold text-black mb-3">Recent Courses</h2>
              <ul className="space-y-2">
                {data?.recentCourses?.length ? (
                  data.recentCourses.map((course) => (
                    <li key={course._id} className="text-sm text-gray-700">
                      <span className="font-medium">{course.title}</span> · {course.level} ·{' '}
                      {course.durationWeeks} weeks
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-gray-500">No courses yet.</li>
                )}
              </ul>
            </Card>
          </div>

          <div className="flex gap-3 flex-wrap">
            <Link
              href="/edit_lesson"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Add/Edit Lessons
            </Link>
            <Link
              href="/manage_students"
              className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 transition-colors"
            >
              Manage Students
            </Link>
          </div>
        </>
      )}
    </MainLayout>
  );
};

export default DashboardPage;