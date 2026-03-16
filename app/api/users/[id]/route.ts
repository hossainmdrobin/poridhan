import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PATCH /api/users/[id] - Update user
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const { name, email, password, role, phone, address, isActive } = body;

    // Check if user exists
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if email is being changed and if it's already taken
    if (email && email.toLowerCase() !== existingUser.email) {
      const emailExists = await User.findOne({ email: email.toLowerCase() });
      if (emailExists) {
        return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
      }
    }

    // Build update object
    const updateData: Record<string, unknown> = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email.toLowerCase();
    if (password) updateData.password = await bcrypt.hash(password, 12);
    if (role) updateData.role = role;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (isActive !== undefined) updateData.isActive = isActive;

    const user = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

// DELETE /api/users/[id] - Delete user
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = await params;

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
