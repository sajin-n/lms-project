"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import MainLayout from '../layout/main-layout';
import Sidebar from '../layout/sidebar';
import Navbar from '../layout/navbar';
import Card from '../global/card';
import SessionExpiredModal from '../global/session-expired-modal';

export default function GradesPage() {
  const { data: session } = useSession();
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showExpiredModal, setShowExpiredModal] = useState(false);

  const fetchGrades = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/enrollments', { cache: 'no-store' });
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setShowExpiredModal(true);
          return;
        }
        throw new Error(data?.error || 'Failed to fetch grades');
      }

      setEnrollments(data.enrollments || []);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch grades');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, []);

  useEffect(() => {
    if (!session) {
      setShowExpiredModal(true);
    }
  }, [session]);

  const averageProgress = useMemo(() => {
    if (!enrollments.length) return 0;
    return Math.round(
      enrollments.reduce((total, enrollment) => total + (enrollment.progress || 0), 0) /
        enrollments.length
    );
  }, [enrollments]);

  return (
    <MainLayout sidebar={<Sidebar role="student" />} navbar={<Navbar />}>
      <SessionExpiredModal isOpen={showExpiredModal} />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-black">Grades & Progress</h1>
        <button
          onClick={fetchGrades}
          className="text-sm bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Refresh
        </button>
      </div>

      <Card className="mb-6">
        <p className="text-sm text-gray-500">Average Progress</p>
        <p className="text-2xl font-bold text-gray-900 mt-2">{averageProgress}%</p>
      </Card>

      <Card>
        {isLoading ? (
          <p className="text-gray-600">Loading grades...</p>
        ) : enrollments.length === 0 ? (
          <p className="text-gray-600">No grade data yet. Enroll in a course first.</p>
        ) : (
          <div className="space-y-3">
            {enrollments.map((enrollment) => (
              <div key={enrollment._id} className="border border-gray-200 rounded-md p-3">
                <p className="font-semibold text-gray-900">{enrollment.course?.title}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Progress: {enrollment.progress}% · Status: {enrollment.status}
                </p>
                <p className="text-sm text-gray-600">Grade: {enrollment.grade}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </MainLayout>
  );
}
