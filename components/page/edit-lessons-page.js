"use client";
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import MainLayout from '../layout/main-layout';
import Sidebar from '../layout/sidebar';
import Navbar from '../layout/navbar';
import Card from '../global/card';
import InputField from '../global/input-field';
import Button from '../global/button';
import SessionExpiredModal from '../global/session-expired-modal';

const initialForm = {
  title: '',
  description: '',
  level: 'beginner',
  durationWeeks: 4,
};

export default function EditLessonsPage() {
  const { data: session } = useSession();
  const [form, setForm] = useState(initialForm);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [deletingCourseId, setDeletingCourseId] = useState(null);
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
        throw new Error(data?.error || 'Failed to load courses');
      }

      setCourses(data.courses || []);
    } catch (error) {
      toast.error(error.message || 'Failed to load courses');
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

  const handleSaveCourse = async (event) => {
    event.preventDefault();

    if (!form.title.trim() || !form.description.trim()) {
      toast.error('Title and description are required');
      return;
    }

    const isEditing = Boolean(editingCourseId);
    setIsSaving(true);
    const loadingToast = toast.loading(isEditing ? 'Updating course...' : 'Creating course...');

    try {
      const response = await fetch(isEditing ? `/api/courses/${editingCourseId}` : '/api/courses', {
        method: isEditing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || `Failed to ${isEditing ? 'update' : 'create'} course`);
      }

      toast.dismiss(loadingToast);
      toast.success(isEditing ? 'Course updated successfully' : 'Course created successfully');
      setForm(initialForm);
      setEditingCourseId(null);
      fetchCourses();
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.message || `Failed to ${isEditing ? 'update' : 'create'} course`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourseId(course._id);
    setForm({
      title: course.title || '',
      description: course.description || '',
      level: course.level || 'beginner',
      durationWeeks: course.durationWeeks || 4,
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingCourseId(null);
    setForm(initialForm);
  };

  const handleDeleteCourse = async (course) => {
    const confirmed = window.confirm(
      `Delete "${course.title}" permanently? This will also remove all related enrollments.`
    );

    if (!confirmed) return;

    setDeletingCourseId(course._id);
    const loadingToast = toast.loading('Deleting course...');

    try {
      const response = await fetch(`/api/courses/${course._id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to delete course');
      }

      toast.dismiss(loadingToast);
      toast.success('Course deleted successfully');

      if (editingCourseId === course._id) {
        handleCancelEdit();
      }

      fetchCourses();
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.message || 'Failed to delete course');
    } finally {
      setDeletingCourseId(null);
    }
  };

  return (
    <MainLayout sidebar={<Sidebar role="admin" />} navbar={<Navbar />}>
      <SessionExpiredModal isOpen={showExpiredModal} />
      
      {/* Header Section */}
      <div className="mb-12 border-[4px] border-black bg-[#00FFD1] text-black p-12">
        <h1 className="nb-heading text-5xl md:text-6xl mb-4">MANAGE</h1>
        <p className="text-2xl md:text-3xl font-bold uppercase tracking-wider">LESSONS</p>
      </div>

      {/* Form Section */}
      <div className="border-[4px] border-black bg-white shadow-[8px_8px_0px] shadow-black mb-12 p-8">
        <div className="flex items-center justify-between mb-8 pb-8 border-b-[4px] border-black">
          <h2 className="nb-subheading text-3xl md:text-4xl">
            {editingCourseId ? '✏️ EDIT LESSON' : '➕ CREATE NEW'}
          </h2>
          {editingCourseId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-6 py-3 bg-gray-300 text-black font-black border-[3px] border-black uppercase tracking-wide shadow-[4px_4px_0px] hover:shadow-none transition-all duration-100"
            >
              CANCEL
            </button>
          )}
        </div>

        <form onSubmit={handleSaveCourse} className="space-y-6">
          <div>
            <label className="block text-black font-black text-lg uppercase tracking-wide mb-3">
              LESSON TITLE
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="E.G. JAVASCRIPT FOUNDATIONS"
              disabled={isSaving}
              className="nb-input"
              required
            />
          </div>

          <div>
            <label className="block text-black font-black text-lg uppercase tracking-wide mb-3">
              DESCRIPTION
            </label>
            <textarea
              value={form.description}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, description: event.target.value }))
              }
              placeholder="DESCRIBE WHAT STUDENTS WILL LEARN"
              rows={5}
              className="w-full px-6 py-4 text-black bg-white border-[4px] border-black font-semibold focus:outline-none focus:border-[#FF0080] transition-all uppercase tracking-wide disabled:opacity-50"
              disabled={isSaving}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-black font-black text-lg uppercase tracking-wide mb-3">
                LEVEL
              </label>
              <select
                value={form.level}
                onChange={(event) => setForm((prev) => ({ ...prev, level: event.target.value }))}
                className="nb-input w-full cursor-pointer appearance-none"
                disabled={isSaving}
              >
                <option>BEGINNER</option>
                <option>INTERMEDIATE</option>
                <option>ADVANCED</option>
              </select>
            </div>

            <div>
              <label className="block text-black font-black text-lg uppercase tracking-wide mb-3">
                DURATION (WEEKS)
              </label>
              <input
                type="number"
                min={1}
                max={52}
                value={form.durationWeeks}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, durationWeeks: Number(event.target.value) }))
                }
                className="nb-input"
                disabled={isSaving}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSaving}
            className="w-full px-8 py-4 bg-[#A000FF] text-white font-black text-lg border-[4px] border-black uppercase tracking-wider shadow-[8px_8px_0px] shadow-black hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0px] active:translate-x-[8px] active:translate-y-[8px] active:shadow-none transition-all duration-100 disabled:opacity-50"
          >
            {isSaving ? '⏳ SAVING...' : editingCourseId ? '✏️ UPDATE LESSON' : '➕ CREATE LESSON'}
          </button>
        </form>
      </div>

      {/* Existing Courses Section */}
      <div className="border-[4px] border-black bg-white shadow-[8px_8px_0px] shadow-black p-8">
        <div className="flex items-center justify-between mb-8 pb-8 border-b-[4px] border-black">
          <h2 className="nb-subheading text-3xl md:text-4xl">EXISTING LESSONS</h2>
          <button
            onClick={fetchCourses}
            className="px-6 py-3 bg-black text-white font-black border-[3px] border-black uppercase tracking-wide shadow-[6px_6px_0px] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px] active:shadow-none transition-all duration-100"
          >
            ⚡ REFRESH
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <svg className="animate-spin h-10 w-10 text-black" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : courses.length === 0 ? (
          <div className="border-[3px] border-dashed border-gray-300 p-8 text-center">
            <p className="font-black text-lg uppercase tracking-wider text-gray-500">NO LESSONS YET</p>
            <p className="text-sm text-gray-400 mt-2">Create your first lesson above</p>
          </div>
        ) : (
          <div className="space-y-4">
            {courses.map((course) => (
              <div key={course._id} className="border-l-[4px] border-[#00FFD1] bg-gray-50 hover:bg-white transition-colors p-6">
                <div className="mb-4">
                  <h3 className="font-black text-xl uppercase tracking-wide text-black mb-2">
                    {course.title}
                  </h3>
                  <p className="text-sm font-medium text-gray-700">{course.description}</p>
                </div>

                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex gap-3">
                    <span className="px-4 py-2 bg-[#FFFF00] text-black font-black text-xs uppercase border-[2px] border-black">
                      {course.level?.toUpperCase() || 'BEGINNER'}
                    </span>
                    <span className="px-4 py-2 bg-[#FF0080] text-white font-black text-xs uppercase border-[2px] border-black">
                      {course.durationWeeks} WEEKS
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleEditCourse(course)}
                      className="px-6 py-2 bg-[#00FFD1] text-black font-black border-[3px] border-black uppercase tracking-wide text-xs shadow-[4px_4px_0px] hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50 transition-all duration-100"
                      disabled={isSaving || deletingCourseId === course._id}
                    >
                      ✏️ EDIT
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCourse(course)}
                      className="px-6 py-2 bg-[#FF0080] text-white font-black border-[3px] border-black uppercase tracking-wide text-xs shadow-[4px_4px_0px] hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50 transition-all duration-100"
                      disabled={deletingCourseId === course._id}
                    >
                      {deletingCourseId === course._id ? '⏳ DELETING...' : '🗑️ DELETE'}
                    </button>
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
