"use client";
import React from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const SessionExpiredModal = ({ isOpen }) => {
  const router = useRouter();

  if (!isOpen) return null;

  const handleLoginAgain = () => {
    signIn('credentials', { redirect: true });
  };

  const handleGoToSignIn = () => {
    router.push('/signin');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Session Expired</h3>
          <p className="text-gray-600 mb-6">Your session has expired. Please log in again to continue.</p>
          <div className="flex gap-3">
            <button
              onClick={handleGoToSignIn}
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Go to Sign In
            </button>
            <button
              onClick={handleLoginAgain}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Log In Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionExpiredModal;