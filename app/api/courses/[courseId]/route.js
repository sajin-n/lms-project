import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/auth-options';
import connectToDatabase from '@/utils/mongodb';
import Course from '@/app/models/Course';
import Enrollment from '@/app/models/Enrollment';

function validateCoursePayload(body) {
  const title = body?.title?.trim();
  const description = body?.description?.trim();
  const level = body?.level;
  const durationWeeks = Number(body?.durationWeeks);

  if (!title || !description) {
    return { error: 'Title and description are required' };
  }

  if (title.length < 3 || title.length > 120) {
    return { error: 'Title must be between 3 and 120 characters' };
  }

  if (description.length < 10 || description.length > 1000) {
    return { error: 'Description must be between 10 and 1000 characters' };
  }

  if (!['beginner', 'intermediate', 'advanced'].includes(level)) {
    return { error: 'Invalid course level' };
  }

  if (!Number.isFinite(durationWeeks) || durationWeeks < 1 || durationWeeks > 52) {
    return { error: 'Duration must be between 1 and 52 weeks' };
  }

  return {
    data: {
      title,
      description,
      level,
      durationWeeks,
    },
  };
}

async function requireAdminSession() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  if (session.user.role !== 'admin') {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }

  return { session };
}

export async function PATCH(request, { params }) {
  try {
    const auth = await requireAdminSession();
    if (auth.error) return auth.error;

    const { courseId } = params;

    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
      return NextResponse.json({ error: 'Invalid course id' }, { status: 400 });
    }

    const body = await request.json();
    const validated = validateCoursePayload(body);

    if (validated.error) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }

    await connectToDatabase();

    const updatedCourse = await Course.findByIdAndUpdate(courseId, validated.data, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updatedCourse) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json({ course: updatedCourse }, { status: 200 });
  } catch (error) {
    console.error('Course PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  try {
    const auth = await requireAdminSession();
    if (auth.error) return auth.error;

    const { courseId } = params;

    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
      return NextResponse.json({ error: 'Invalid course id' }, { status: 400 });
    }

    await connectToDatabase();

    const deletedCourse = await Course.findByIdAndDelete(courseId).lean();

    if (!deletedCourse) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const enrollmentDeleteResult = await Enrollment.deleteMany({ course: courseId });

    return NextResponse.json(
      {
        message: 'Course deleted successfully',
        deletedCourseId: courseId,
        deletedEnrollments: enrollmentDeleteResult.deletedCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Course DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
