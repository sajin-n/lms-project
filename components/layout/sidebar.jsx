"use client";
import React from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const Sidebar = ({ role, children }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      const loadingToast = toast.loading('Logging out...', {
        duration: Infinity,
      });
      
      await signOut({ redirect: false });
      
      toast.dismiss(loadingToast);
      toast.success('Logout successful!');

      setTimeout(() => {
        router.push('/signin');
      }, 500);
    } catch (error) {
      toast.error('Logout failed. Please try again.');
      console.error('Logout error:', error);
    }
  };

  const itemClass = (href, tone) => {
    const active = pathname === href;

    if (tone === 'admin') {
      return active
        ? 'font-semibold bg-blue-100 text-blue-800 px-3 py-2 rounded-md'
        : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-2 rounded-md transition-colors';
    }

    return active
      ? 'font-semibold bg-green-100 text-green-800 px-3 py-2 rounded-md'
      : 'text-green-600 hover:text-green-800 hover:bg-green-50 px-3 py-2 rounded-md transition-colors';
  };

  let links;
  if (role === 'admin') {
    links = (
      <>
        <Link href="/admin_dashboard" className={itemClass('/admin_dashboard', 'admin')}>Admin Dashboard</Link>
        <Link href="/edit_lesson" className={itemClass('/edit_lesson', 'admin')}>Edit Lessons</Link>
        <Link href="/manage_students" className={itemClass('/manage_students', 'admin')}>Manage Users</Link>
        <button
          onClick={handleLogout}
          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-2 rounded-md text-left transition-colors"
        >
          Logout
        </button>
      </>
    );
  } else if (role === 'student') {
    links = (
      <>
        <Link href="/student_dashboard" className={itemClass('/student_dashboard', 'student')}>Student Dashboard</Link>
        <Link href="/courses" className={itemClass('/courses', 'student')}>My Courses</Link>
        <Link href="/grades" className={itemClass('/grades', 'student')}>Grades</Link>
        <Link href="/profile" className={itemClass('/profile', 'student')}>Profile</Link>
        <button
          onClick={handleLogout}
          className="text-green-600 hover:text-green-800 hover:bg-green-50 px-3 py-2 rounded-md text-left transition-colors"
        >
          Logout
        </button>
      </>
    );
  } else {
    links = null;
  }

  if (!links) return null;

  return (
    <aside className="w-64 bg-gray-100 h-full p-4 hidden md:block border-r">
      <nav className="flex flex-col gap-4">
        {links}
      </nav>
      {children}
    </aside>
  );
};

export default Sidebar;