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
    const baseStyle = 'font-black text-sm uppercase tracking-wider px-4 py-3 border-l-[4px] transition-all duration-150';

    if (tone === 'admin') {
      return active
        ? `${baseStyle} border-[#A000FF] bg-[#F0ECFF] text-[#A000FF]`
        : `${baseStyle} border-transparent text-black hover:border-[#A000FF] hover:bg-gray-50`;
    }

    return active
      ? `${baseStyle} border-[#00FFD1] bg-[#E0FFFC] text-[#00FFD1]`
      : `${baseStyle} border-transparent text-black hover:border-[#00FFD1] hover:bg-gray-50`;
  };

  let links;
  if (role === 'admin') {
    links = (
      <>
        <Link href="/admin_dashboard" className={itemClass('/admin_dashboard', 'admin')}>
          ⚙️ DASHBOARD
        </Link>
        <Link href="/edit_lesson" className={itemClass('/edit_lesson', 'admin')}>
          📚 MANAGE COURSES
        </Link>
        <Link href="/manage_students" className={itemClass('/manage_students', 'admin')}>
          👥 MANAGE USERS
        </Link>
        <button
          onClick={handleLogout}
          className="font-black text-sm uppercase tracking-wider px-4 py-3 border-l-[4px] border-[#FF0080] text-[#FF0080] hover:bg-[#FFE6F0] w-full text-left transition-all duration-150"
        >
          🚪 LOGOUT
        </button>
      </>
    );
  } else if (role === 'student') {
    links = (
      <>
        <Link href="/student_dashboard" className={itemClass('/student_dashboard', 'student')}>
          📊 DASHBOARD
        </Link>
        <Link href="/courses" className={itemClass('/courses', 'student')}>
          🎓 MY COURSES
        </Link>
        <Link href="/grades" className={itemClass('/grades', 'student')}>
          📈 GRADES
        </Link>
        <Link href="/profile" className={itemClass('/profile', 'student')}>
          👤 PROFILE
        </Link>
        <button
          onClick={handleLogout}
          className="font-black text-sm uppercase tracking-wider px-4 py-3 border-l-[4px] border-[#FF0080] text-[#FF0080] hover:bg-[#FFE6F0] w-full text-left transition-all duration-150"
        >
          🚪 LOGOUT
        </button>
      </>
    );
  } else {
    links = null;
  }

  if (!links) return null;

  return (
    <aside className="w-64 bg-white h-full p-6 hidden md:block border-r-[4px] border-black">
      <nav className="flex flex-col gap-2">
        {links}
      </nav>
      {children}
    </aside>
  );
};

export default Sidebar;