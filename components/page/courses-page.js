"use client";
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import MainLayout from '../layout/main-layout';
import Sidebar from '../layout/sidebar';
import Navbar from '../layout/navbar';
import Card from '../global/card';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/courses', { cache: 'no-store' });
      const data = await response.json();

      if (!response.ok) {
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-black">My Courses</h1>
        <button
          onClick={fetchCourses}
          className="text-sm bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Refresh
        </button>
      </div>

      {isLoading ? (
        <p className="text-gray-600">Loading courses...</p>
      ) : courses.length === 0 ? (
        <Card>
          <p className="text-gray-600">No courses available yet. Check back soon.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((course) => (
            <Card key={course._id}>
              <h2 className="text-xl font-semibold text-gray-900">{course.title}</h2>
              <p className="text-sm text-gray-600 mt-2">{course.description}</p>
              <p className="text-xs text-gray-500 mt-2">
                {course.level} · {course.durationWeeks} weeks
              </p>

              <div className="mt-4">
                {course.enrolled ? (
                  <>
                    <p className="text-sm text-gray-700 mb-2">
                      Progress: <span className="font-semibold">{course.progress}%</span>
                    </p>
                    <div className="w-full bg-gray-200 h-2 rounded mb-3">
                      <div
                        className="bg-green-600 h-2 rounded"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <button
                      onClick={() => handleProgress(course.enrollmentId, course.progress)}
                      className="text-sm bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700"
                    >
                      Mark +10% Progress
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleEnroll(course._id)}
                    className="text-sm bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700"
                  >
                    Enroll Now
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </MainLayout>
  );
}
