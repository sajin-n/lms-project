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
      
      {/* Header Section */}
      <div className="mb-12 border-[4px] border-black bg-[#FF0080] text-white p-12">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="nb-heading-light text-5xl md:text-6xl mb-2">MANAGE</h1>
            <p className="text-2xl md:text-3xl font-bold uppercase tracking-wider">STUDENTS</p>
          </div>
          <button
            onClick={fetchUsers}
            className="px-6 py-3 bg-white text-[#FF0080] font-black border-[3px] border-white uppercase tracking-wide shadow-[6px_6px_0px] shadow-white hover:translate-x-[3px] hover:translate-y-[3px] active:shadow-none transition-all duration-100"
          >
            ⚡ REFRESH
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="border-[4px] border-black bg-[#00FFD1] text-black p-8 shadow-[8px_8px_0px] shadow-black">
          <p className="font-black text-sm uppercase tracking-widest mb-3 text-gray-700">TOTAL USERS</p>
          <p className="text-6xl font-black">{summary.total}</p>
        </div>
        <div className="border-[4px] border-black bg-[#FFFF00] text-black p-8 shadow-[8px_8px_0px] shadow-black">
          <p className="font-black text-sm uppercase tracking-widest mb-3 text-gray-700">STUDENTS</p>
          <p className="text-6xl font-black">{summary.students}</p>
        </div>
        <div className="border-[4px] border-black bg-[#A000FF] text-white p-8 shadow-[8px_8px_0px] shadow-black">
          <p className="font-black text-sm uppercase tracking-widest mb-3 text-gray-100">ADMINS</p>
          <p className="text-6xl font-black">{summary.admins}</p>
        </div>
      </div>

      {/* Users Table Section */}
      <div className="border-[4px] border-black bg-white shadow-[8px_8px_0px] shadow-black p-8">
        <h2 className="nb-subheading text-3xl md:text-4xl mb-8">ALL USERS</h2>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <svg className="animate-spin h-10 w-10 text-black" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : users.length === 0 ? (
          <div className="border-[3px] border-dashed border-gray-300 p-8 text-center">
            <p className="font-black text-lg uppercase tracking-wider text-gray-500">NO USERS FOUND</p>
          </div>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user._id} className="border-l-[4px] border-[#FF0080] bg-gray-50 hover:bg-white transition-colors p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* User Info */}
                  <div className="flex-1">
                    <h3 className="font-black text-lg uppercase tracking-wide text-black mb-1">
                      {user.name}
                    </h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Joined: {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Role & Action */}
                  <div className="flex items-center gap-4">
                    <span className={`px-4 py-2 font-black text-xs uppercase border-[2px] border-black ${
                      user.role === 'admin' 
                        ? 'bg-[#A000FF] text-white' 
                        : 'bg-[#00FFD1] text-black'
                    }`}>
                      {user.role?.toUpperCase()}
                    </span>

                    {user.role === 'student' ? (
                      <button
                        onClick={() => handleDeleteStudent(user)}
                        className="px-6 py-2 bg-[#FF0080] text-white font-black border-[3px] border-black uppercase tracking-wide text-xs shadow-[4px_4px_0px] hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50 transition-all duration-100"
                        disabled={deletingUserId === user._id}
                      >
                        {deletingUserId === user._id ? '⏳ DELETING' : '🗑️ DELETE'}
                      </button>
                    ) : (
                      <span className="px-6 py-2 bg-gray-300 text-gray-600 font-black border-[3px] border-black uppercase tracking-wide text-xs cursor-not-allowed">
                        PROTECTED
                      </span>
                    )}
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
