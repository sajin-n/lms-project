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
      <h1 className="text-3xl font-bold text-black mb-6">Edit Lessons</h1>

      <Card className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-black">
            {editingCourseId ? 'Edit Lesson' : 'Create New Lesson'}
          </h2>
          {editingCourseId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel edit
            </button>
          )}
        </div>

        <form onSubmit={handleSaveCourse} className="space-y-4">
          <InputField
            label="Course Title"
            name="title"
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            placeholder="e.g. JavaScript Foundations"
            disabled={isSaving}
          />

          <div>
            <label className="block text-sm text-gray-700 font-semibold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              value={form.description}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, description: event.target.value }))
              }
              placeholder="Describe what students will learn"
              rows={4}
              className="w-full px-4 py-3 text-gray-900 bg-gray-50 border-2 border-gray-300 rounded-lg"
              disabled={isSaving}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 font-semibold mb-2" htmlFor="level">
                Level
              </label>
              <select
                id="level"
                value={form.level}
                onChange={(event) => setForm((prev) => ({ ...prev, level: event.target.value }))}
                className="w-full px-4 py-3 text-gray-900 bg-gray-50 border-2 border-gray-300 rounded-lg"
                disabled={isSaving}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label
                className="block text-sm text-gray-700 font-semibold mb-2"
                htmlFor="durationWeeks"
              >
                Duration (weeks)
              </label>
              <input
                id="durationWeeks"
                type="number"
                min={1}
                max={52}
                value={form.durationWeeks}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, durationWeeks: Number(event.target.value) }))
                }
                className="w-full px-4 py-3 text-gray-900 bg-gray-50 border-2 border-gray-300 rounded-lg"
                disabled={isSaving}
                required
              />
            </div>
          </div>

          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : editingCourseId ? 'Update Lesson' : 'Create Lesson'}
          </Button>
        </form>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-black">Existing Courses</h2>
          <button
            onClick={fetchCourses}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Refresh
          </button>
        </div>

        {isLoading ? (
          <p className="text-gray-600">Loading courses...</p>
        ) : courses.length === 0 ? (
          <p className="text-gray-600">No courses created yet.</p>
        ) : (
          <ul className="space-y-3">
            {courses.map((course) => (
              <li key={course._id} className="border border-gray-200 rounded-md p-3">
                <p className="font-semibold text-gray-900">{course.title}</p>
                <p className="text-sm text-gray-700 mt-1">{course.description}</p>
                <div className="flex items-center justify-between mt-2 gap-3 flex-wrap">
                  <p className="text-xs text-gray-500">
                    {course.level} · {course.durationWeeks} weeks
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleEditCourse(course)}
                      className="text-xs bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
                      disabled={isSaving || deletingCourseId === course._id}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCourse(course)}
                      className="text-xs bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 disabled:opacity-60"
                      disabled={deletingCourseId === course._id}
                    >
                      {deletingCourseId === course._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </MainLayout>
  );
}
