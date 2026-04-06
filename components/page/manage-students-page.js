"use client";
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import MainLayout from '../layout/main-layout';
import Sidebar from '../layout/sidebar';
import Navbar from '../layout/navbar';
import Card from '../global/card';
import SessionExpiredModal from '../global/session-expired-modal';

export default function ManageStudentsPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [summary, setSummary] = useState({ total: 0, students: 0, admins: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [showExpiredModal, setShowExpiredModal] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/users', { cache: 'no-store' });
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setShowExpiredModal(true);
          return;
        }
        throw new Error(data?.error || 'Failed to fetch users');
      }

      setUsers(data.users || []);
      setSummary(data.summary || { total: 0, students: 0, admins: 0 });
    } catch (error) {
      toast.error(error.message || 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!session) {
      setShowExpiredModal(true);
    }
  }, [session]);

  const handleDeleteStudent = async (user) => {
    if (user.role !== 'student') {
      toast.error('Only student accounts can be deleted here.');
      return;
    }

    const confirmed = window.confirm(
      `Delete ${user.name} permanently? This will remove the student and all their enrollments.`
    );

    if (!confirmed) return;

    setDeletingUserId(user._id);
    const loadingToast = toast.loading('Deleting student...');

    try {
      const response = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to delete student');
      }

      toast.dismiss(loadingToast);
      toast.success('Student deleted permanently');
      fetchUsers();
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.message || 'Failed to delete student');
    } finally {
      setDeletingUserId(null);
    }
  };

  return (
    <MainLayout sidebar={<Sidebar role="admin" />} navbar={<Navbar />}>
      <SessionExpiredModal isOpen={showExpiredModal} />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-black">Manage Students</h1>
        <button
          onClick={fetchUsers}
          className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <p className="text-sm text-gray-500">Total Users</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{summary.total}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Students</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{summary.students}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Admins</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{summary.admins}</p>
        </Card>
      </div>

      <Card>
        {isLoading ? (
          <p className="text-gray-600">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-gray-600">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="py-2 pr-4 text-gray-600">Name</th>
                  <th className="py-2 pr-4 text-gray-600">Email</th>
                  <th className="py-2 pr-4 text-gray-600">Role</th>
                  <th className="py-2 pr-4 text-gray-600">Joined</th>
                  <th className="py-2 pr-4 text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b border-gray-100">
                    <td className="py-2 pr-4 text-gray-900">{user.name}</td>
                    <td className="py-2 pr-4 text-gray-700">{user.email}</td>
                    <td className="py-2 pr-4">
                      <span className="uppercase text-xs font-semibold text-gray-700">{user.role}</span>
                    </td>
                    <td className="py-2 pr-4 text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2 pr-4">
                      {user.role === 'student' ? (
                        <button
                          onClick={() => handleDeleteStudent(user)}
                          className="text-xs bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 disabled:opacity-60"
                          disabled={deletingUserId === user._id}
                        >
                          {deletingUserId === user._id ? 'Deleting...' : 'Delete Permanently'}
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">Not allowed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </MainLayout>
  );
}
