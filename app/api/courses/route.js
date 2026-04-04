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

    await connectToDatabase();

    if (session.user.role === 'admin') {
      const courses = await Course.find({})
        .sort({ createdAt: -1 })
        .populate('createdBy', 'name email role')
        .lean();

      return NextResponse.json({ courses }, { status: 200 });
    }

    if (session.user.role === 'student') {
      const [courses, enrollments] = await Promise.all([
        Course.find({}).sort({ createdAt: -1 }).lean(),
        Enrollment.find({ student: session.user.id }).lean(),
      ]);

      const enrollmentMap = new Map(
        enrollments.map((enrollment) => [String(enrollment.course), enrollment])
      );

      const studentCourses = courses.map((course) => {
        const enrollment = enrollmentMap.get(String(course._id));

        return {
          ...course,
          enrolled: Boolean(enrollment),
          progress: enrollment?.progress ?? 0,
          grade: enrollment?.grade ?? 'N/A',
          status: enrollment?.status ?? 'not-enrolled',
          enrollmentId: enrollment?._id ?? null,
        };
      });

      return NextResponse.json({ courses: studentCourses }, { status: 200 });
    }

    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  } catch (error) {
    console.error('Courses GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const title = body?.title?.trim();
    const description = body?.description?.trim();
    const level = body?.level;
    const durationWeeks = Number(body?.durationWeeks);

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    if (title.length < 3 || title.length > 120) {
      return NextResponse.json(
        { error: 'Title must be between 3 and 120 characters' },
        { status: 400 }
      );
    }

    if (description.length < 10 || description.length > 1000) {
      return NextResponse.json(
        { error: 'Description must be between 10 and 1000 characters' },
        { status: 400 }
      );
    }

    if (!['beginner', 'intermediate', 'advanced'].includes(level)) {
      return NextResponse.json({ error: 'Invalid course level' }, { status: 400 });
    }

    if (!Number.isFinite(durationWeeks) || durationWeeks < 1 || durationWeeks > 52) {
      return NextResponse.json(
        { error: 'Duration must be between 1 and 52 weeks' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const course = await Course.create({
      title,
      description,
      level,
      durationWeeks,
      createdBy: session.user.id,
    });

    return NextResponse.json({ course }, { status: 201 });
  } catch (error) {
    console.error('Courses POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
