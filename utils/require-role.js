import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/utils/auth-options';

export async function requireRole(requiredRole) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/signin');
  }

  if (session.user.role !== requiredRole) {
    if (session.user.role === 'admin') {
      redirect('/admin_dashboard');
    }

    if (session.user.role === 'student') {
      redirect('/student_dashboard');
    }

    redirect('/signin');
  }

  return session;
}
