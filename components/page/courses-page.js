"use client";
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import MainLayout from '../layout/main-layout';
import Sidebar from '../layout/sidebar';
import Navbar from '../layout/navbar';
import Card from '../global/card';
import SessionExpiredModal from '../global/session-expired-modal';

export default function CoursesPage() {
  const { data: session } = useSession();
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showExpiredModal, setShowExpiredModal] = useState(false);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/courses', { cache: 'no-store' });
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setShowExpiredModal(true);
          return;
        }
        throw new Error(data?.error || 'Failed to fetch courses');
      }

      setCourses(data.courses || []);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch courses');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (!session) {
      setShowExpiredModal(true);
    }
  }, [session]);

  const handleEnroll = async (courseId) => {
    const loadingToast = toast.loading('Enrolling...');
    try {
      const response = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to enroll');
      }

      toast.dismiss(loadingToast);
      toast.success('Enrolled successfully');
      fetchCourses();
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.message || 'Failed to enroll');
    }
  };

  const handleProgress = async (enrollmentId, currentProgress) => {
    const nextProgress = Math.min(100, currentProgress + 10);
    const loadingToast = toast.loading('Updating progress...');

    try {
      const response = await fetch(`/api/enrollments/${enrollmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progress: nextProgress }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Failed to update progress');
      }

      toast.dismiss(loadingToast);
      toast.success('Progress updated');
      fetchCourses();
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.message || 'Failed to update progress');
    }
  };

  return (
    <MainLayout sidebar={<Sidebar role="student" />} navbar={<Navbar />}>
      <SessionExpiredModal isOpen={showExpiredModal} />
      
      {/* Header Section */}
      <div className="mb-12 border-[4px] border-black bg-[#FF0080] text-white p-12">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="nb-heading-light text-5xl md:text-6xl mb-2">EXPLORE</h1>
            <p className="text-2xl md:text-3xl font-bold uppercase tracking-wider">COURSES</p>
          </div>
          <button
            onClick={fetchCourses}
            className="px-6 py-3 bg-white text-[#FF0080] font-black border-[3px] border-white uppercase tracking-wide shadow-[6px_6px_0px] shadow-white hover:translate-x-[3px] hover:translate-y-[3px] active:shadow-none transition-all duration-100"
          >
            ↻ REFRESH
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <svg className="animate-spin h-12 w-12 text-black mb-4 mx-auto" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="font-black text-lg uppercase tracking-wider">LOADING...</p>
          </div>
        </div>
      ) : courses.length === 0 ? (
        <div className="border-[4px] border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          <p className="font-black text-lg uppercase tracking-wider text-gray-600">NO COURSES AVAILABLE</p>
          <p className="text-sm text-gray-500 mt-2">Check back soon for exciting new courses</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course._id} className="border-[4px] border-black bg-white shadow-[8px_8px_0px] shadow-black hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[12px_12px_0px] transition-all duration-150 p-8">
              {/* Course Header */}
              <div className="mb-6 pb-6 border-b-[3px] border-black">
                <h2 className="font-black text-2xl uppercase tracking-wide text-black mb-3">{course.title}</h2>
                <div className="flex gap-2 flex-wrap">
                  <span className="px-3 py-1 bg-[#FFFF00] text-black font-black text-xs uppercase border-[2px] border-black">
                    {course.level}
                  </span>
                  <span className="px-3 py-1 bg-[#00FFD1] text-black font-black text-xs uppercase border-[2px] border-black">
                    {course.durationWeeks} WEEKS
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm font-medium text-gray-700 mb-6">{course.description}</p>

              {/* Enrollment Status & Action */}
              <div className="mt-auto">
                {course.enrolled ? (
                  <>
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-black text-sm uppercase tracking-wide">Progress</p>
                        <p className="font-black text-lg text-[#FF0080]">{course.progress}%</p>
                      </div>
                      <div className="w-full bg-gray-300 border-[2px] border-black h-4">
                        <div
                          className="bg-[#FF0080] border-r-[2px] border-black h-full transition-all duration-300"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => handleProgress(course.enrollmentId, course.progress)}
                      className="w-full px-6 py-3 bg-[#00FFD1] text-black font-black border-[3px] border-black uppercase tracking-wide shadow-[6px_6px_0px] shadow-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px] active:shadow-none transition-all duration-100"
                    >
                      📊 ADD 10% PROGRESS
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleEnroll(course._id)}
                    className="w-full px-6 py-3 bg-[#FF0080] text-white font-black border-[3px] border-black uppercase tracking-wide shadow-[6px_6px_0px] shadow-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px] active:shadow-none transition-all duration-100"
                  >
                    📝 ENROLL NOW
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </MainLayout>
  );
}
