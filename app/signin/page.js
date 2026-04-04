import { Suspense } from 'react';
import LoginPage from "@/components/page/login-page";

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-600">Loading sign in...</div>}>
      <LoginPage />
    </Suspense>
  );
}
