import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/auth-options';
import connectToDatabase from '@/utils/mongodb';
import User from '@/app/models/User';
import Course from '@/app/models/Course';
import Enrollment from '@/app/models/Enrollment';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectToDatabase();

    const [usersCount, studentsCount, adminsCount, coursesCount, enrollmentsCount, completedEnrollments, recentUsers, recentCourses] =
      await Promise.all([
        User.countDocuments({}),
        User.countDocuments({ role: 'student' }),
        User.countDocuments({ role: 'admin' }),
        Course.countDocuments({}),
        Enrollment.countDocuments({}),
        Enrollment.countDocuments({ status: 'completed' }),
        User.find({}, '-password').sort({ createdAt: -1 }).limit(5).lean(),
        Course.find({}).sort({ createdAt: -1 }).limit(5).lean(),
      ]);

    return NextResponse.json(
      {
        stats: {
          usersCount,
          studentsCount,
          adminsCount,
          coursesCount,
          enrollmentsCount,
          completedEnrollments,
          completionRate:
            enrollmentsCount === 0
              ? 0
              : Math.round((completedEnrollments / enrollmentsCount) * 100),
        },
        recentUsers,
        recentCourses,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Admin dashboard GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
