import { NextResponse } from 'next/server';
import connectToDatabase from '@/utils/mongodb';
import User from '@/app/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const body = await request.json();
    const email = body?.email?.trim().toLowerCase();
    const password = body?.password;
    const name = body?.name?.trim();
    const role = body?.role === 'admin' ? 'admin' : 'student';
    const adminInviteCode = body?.adminInviteCode?.trim();

    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (name.length < 2 || name.length > 80) {
      return NextResponse.json(
        { error: 'Name must be between 2 and 80 characters' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    const hasNumber = /\d/.test(password);
    if (!hasNumber) {
      return NextResponse.json(
        { error: 'Password must include at least one number' },
        { status: 400 }
      );
    }

    if (role === 'admin') {
      const expectedCode = process.env.ADMIN_REGISTRATION_CODE;
      if (!expectedCode || adminInviteCode !== expectedCode) {
        return NextResponse.json(
          { error: 'Admin registration requires a valid invite code' },
          { status: 403 }
        );
      }
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      name,
      role,
    });

    return NextResponse.json(
      {
        message: 'User registered successfully',
        user: {
          id: newUser._id.toString(),
          email: newUser.email,
          name: newUser.name,
          role: newUser.role
        }
      },
      { status: 201 }
    );
  } catch (error) {
    if (error?.code === 11000) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
