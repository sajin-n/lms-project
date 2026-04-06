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
      
      {/* Header Section */}
      <div className="mb-12 border-[4px] border-black bg-[#00FFD1] text-black p-12">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="nb-heading text-5xl md:text-6xl mb-2">YOUR</h1>
            <p className="text-2xl md:text-3xl font-bold uppercase tracking-wider">GRADES</p>
          </div>
          <button
            onClick={fetchGrades}
            className="px-6 py-3 bg-black text-white font-black border-[3px] border-black uppercase tracking-wide shadow-[6px_6px_0px] shadow-black hover:translate-x-[3px] hover:translate-y-[3px] active:shadow-none transition-all duration-100"
          >
            ⚡ REFRESH
          </button>
        </div>
      </div>

      {/* Average Progress Card */}
      <div className="border-[4px] border-black bg-[#FFFF00] text-black p-12 shadow-[8px_8px_0px] shadow-black mb-12">
        <p className="font-black text-sm uppercase tracking-widest mb-4 text-gray-700">OVERALL PROGRESS</p>
        <p className="text-7xl font-black">{averageProgress}%</p>
      </div>

      {/* Enrollments List */}
      <div className="border-[4px] border-black bg-white shadow-[8px_8px_0px] shadow-black p-8">
        <h2 className="nb-subheading text-3xl md:text-4xl mb-8">COURSES</h2>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <svg className="animate-spin h-10 w-10 text-black" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : enrollments.length === 0 ? (
          <div className="border-[3px] border-dashed border-gray-300 p-8 text-center">
            <p className="font-black text-lg uppercase tracking-wider text-gray-500">NO GRADES YET</p>
            <p className="text-sm text-gray-400 mt-2">Enroll in a course to see your progress</p>
          </div>
        ) : (
          <div className="space-y-4">
            {enrollments.map((enrollment) => (
              <div key={enrollment._id} className="border-l-[4px] border-[#FF0080] bg-gray-50 hover:bg-white transition-colors p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-black text-lg uppercase tracking-wide text-black">
                    {enrollment.course?.title}
                  </h3>
                  <span className="px-4 py-2 bg-[#A000FF] text-white font-black text-xs uppercase border-[2px] border-black">
                    {enrollment.status?.toUpperCase() || 'ACTIVE'}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="font-black text-xs uppercase tracking-widest text-gray-600 mb-2">PROGRESS</p>
                    <p className="text-4xl font-black text-[#FF0080]">{enrollment.progress}%</p>
                    <div className="w-full bg-gray-200 border-[2px] border-black h-2 mt-2">
                      <div 
                        className="bg-[#FF0080] h-full"
                        style={{ width: `${enrollment.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <p className="font-black text-xs uppercase tracking-widest text-gray-600 mb-2">GRADE</p>
                    <p className="text-4xl font-black text-[#00FFD1]">
                      {enrollment.grade || '—'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
