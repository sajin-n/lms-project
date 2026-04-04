import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/auth-options';
import connectToDatabase from '@/utils/mongodb';
import User from '@/app/models/User';
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

    const users = await User.find({}, '-password')
      .sort({ createdAt: -1 })
      .lean();

    const summary = {
      total: users.length,
      students: users.filter((user) => user.role === 'student').length,
      admins: users.filter((user) => user.role === 'admin').length,
    };

    return NextResponse.json({ users, summary }, { status: 200 });
  } catch (error) {
    console.error('Admin users GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const userId = body?.userId;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: 'Invalid user id' }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findById(userId).select('role name').lean();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.role !== 'student') {
      return NextResponse.json(
        { error: 'Only student accounts can be deleted from this section' },
        { status: 400 }
      );
    }

    const [userDeleteResult, enrollmentDeleteResult] = await Promise.all([
      User.deleteOne({ _id: userId, role: 'student' }),
      Enrollment.deleteMany({ student: userId }),
    ]);

    if (!userDeleteResult.deletedCount) {
      return NextResponse.json({ error: 'Unable to delete user' }, { status: 500 });
    }

    return NextResponse.json(
      {
        message: 'Student deleted permanently',
        deletedUserId: userId,
        deletedEnrollments: enrollmentDeleteResult.deletedCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Admin users DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
