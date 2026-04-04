import mongoose from 'mongoose';
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
      const enrollments = await Enrollment.find({})
        .sort({ createdAt: -1 })
        .populate('student', 'name email role')
        .populate('course', 'title level')
        .lean();

      return NextResponse.json({ enrollments }, { status: 200 });
    }

    if (session.user.role === 'student') {
      const enrollments = await Enrollment.find({ student: session.user.id })
        .sort({ updatedAt: -1 })
        .populate('course', 'title description level durationWeeks')
        .lean();

      return NextResponse.json({ enrollments }, { status: 200 });
    }

    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  } catch (error) {
    console.error('Enrollments GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'student') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const courseId = body?.courseId;

    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
      return NextResponse.json({ error: 'Invalid course id' }, { status: 400 });
    }

    await connectToDatabase();

    const course = await Course.findById(courseId).lean();
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    try {
      const enrollment = await Enrollment.create({
        student: session.user.id,
        course: courseId,
      });

      return NextResponse.json({ enrollment }, { status: 201 });
    } catch (error) {
      if (error?.code === 11000) {
        return NextResponse.json(
          { error: 'You are already enrolled in this course' },
          { status: 409 }
        );
      }

      throw error;
    }
  } catch (error) {
    console.error('Enrollments POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
