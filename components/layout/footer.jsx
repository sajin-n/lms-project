"use client"
import React from 'react';

const Footer = () => (
  <footer className="w-full border-t-[4px] border-black bg-black text-white text-center py-6 mt-auto font-black uppercase tracking-wide text-sm">
    © {new Date().getFullYear()} <span className="text-[#FF0080]">LMS</span> — Learning Management System
  </footer>
);

export default Footer;
