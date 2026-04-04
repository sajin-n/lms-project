import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/auth-options';
import connectToDatabase from '@/utils/mongodb';
import Course from '@/app/models/Course';
import Enrollment from '@/app/models/Enrollment';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'student') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectToDatabase();

    const [totalCourses, enrollments] = await Promise.all([
      Course.countDocuments({}),
      Enrollment.find({ student: session.user.id })
        .sort({ updatedAt: -1 })
        .populate('course', 'title level durationWeeks')
        .lean(),
    ]);

    const enrolledCourses = enrollments.length;
    const completedCourses = enrollments.filter((item) => item.status === 'completed').length;
    const averageProgress =
      enrollments.length === 0
        ? 0
        : Math.round(
            enrollments.reduce((sum, enrollment) => sum + (enrollment.progress || 0), 0) /
              enrollments.length
          );

    return NextResponse.json(
      {
        stats: {
          totalCourses,
          enrolledCourses,
          completedCourses,
          averageProgress,
        },
        enrollments,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Student dashboard GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
