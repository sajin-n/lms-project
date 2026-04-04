import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/auth-options';
import connectToDatabase from '@/utils/mongodb';
import Enrollment from '@/app/models/Enrollment';

export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { enrollmentId } = params;

    if (!mongoose.Types.ObjectId.isValid(enrollmentId)) {
      return NextResponse.json({ error: 'Invalid enrollment id' }, { status: 400 });
    }

    await connectToDatabase();

    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) {
      return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 });
    }

    if (
      session.user.role === 'student' &&
      String(enrollment.student) !== String(session.user.id)
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (!['student', 'admin'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const progress = Number(body?.progress);

    if (!Number.isFinite(progress) || progress < 0 || progress > 100) {
      return NextResponse.json(
        { error: 'Progress must be a number between 0 and 100' },
        { status: 400 }
      );
    }

    enrollment.progress = progress;
    enrollment.status = progress === 100 ? 'completed' : 'enrolled';

    if (session.user.role === 'admin' && body?.grade) {
      const grade = String(body.grade).toUpperCase();
      if (!['N/A', 'A', 'B', 'C', 'D', 'F'].includes(grade)) {
        return NextResponse.json({ error: 'Invalid grade value' }, { status: 400 });
      }
      enrollment.grade = grade;
    }

    await enrollment.save();

    return NextResponse.json({ enrollment }, { status: 200 });
  } catch (error) {
    console.error('Enrollment PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
