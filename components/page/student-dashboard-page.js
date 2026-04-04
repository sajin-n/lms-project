"use client";
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import MainLayout from '../layout/main-layout';
import Sidebar from '../layout/sidebar';
import Navbar from '../layout/navbar';
import Card from '../global/card';

const StudentDashboardPage = () => {
  const { data: session } = useSession();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboard = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/dashboard/student', { cache: 'no-store' });
      const payload = await response.json();

      if (!response.ok) {
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

  const cards = useMemo(() => {
    const stats = data?.stats;
    if (!stats) return [];

    return [
      { label: 'Available Courses', value: stats.totalCourses },
      { label: 'Enrolled Courses', value: stats.enrolledCourses },
      { label: 'Completed Courses', value: stats.completedCourses },
      { label: 'Average Progress', value: `${stats.averageProgress}%` },
    ];
  }, [data]);

  return (
    <MainLayout sidebar={<Sidebar role="student" />} navbar={<Navbar />}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-black">
          Welcome, {session?.user?.name || 'Student'}
        </h1>
        <button
          onClick={fetchDashboard}
          className="text-sm bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      {isLoading ? (
        <p className="text-gray-600">Loading dashboard...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {cards.map((item) => (
              <Card key={item.label}>
                <p className="text-sm text-gray-500">{item.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{item.value}</p>
              </Card>
            ))}
          </div>

          <Card className="mb-6">
            <h2 className="text-xl font-semibold text-black mb-3">Recent Enrollments</h2>
            <ul className="space-y-2">
              {data?.enrollments?.length ? (
                data.enrollments.slice(0, 5).map((enrollment) => (
                  <li key={enrollment._id} className="text-sm text-gray-700">
                    <span className="font-medium">{enrollment.course?.title}</span> ·{' '}
                    {enrollment.progress}% progress · {enrollment.status}
                  </li>
                ))
              ) : (
                <li className="text-sm text-gray-500">No enrollments yet. Start with a course!</li>
              )}
            </ul>
          </Card>

          <div className="flex gap-3 flex-wrap">
            <Link
              href="/courses"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Browse Courses
            </Link>
            <Link
              href="/grades"
              className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 transition-colors"
            >
              View Grades
            </Link>
            <Link
              href="/profile"
              className="bg-gray-200 text-gray-900 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
            >
              Profile
            </Link>
          </div>
        </>
      )}
    </MainLayout>
  );
};

export default StudentDashboardPage;
