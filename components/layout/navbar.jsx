"use client"
import React from 'react';

const Navbar = ({ children }) => (
  <nav className="w-full border-b-[4px] border-black bg-white text-black px-6 md:px-8 py-6 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="text-3xl md:text-4xl font-black uppercase tracking-tighter">LMS</div>
      <div className="text-xs md:text-sm font-black uppercase tracking-widest text-gray-600 hidden sm:block">LEARNING MANAGEMENT SYSTEM</div>
    </div>
    {children}
  </nav>
);

export default Navbar;