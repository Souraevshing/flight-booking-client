/* eslint-disable @typescript-eslint/no-unused-vars */
import { getSession } from "@/lib/auth";
import { type NextRequest, NextResponse } from "next/server";

// Mock users data - in a real app, this would be your database
const users = [
  {
    id: "1",
    email: "user@example.com",
    password: "password123", // In a real app, this would be hashed
    firstName: "John",
    lastName: "Doe",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    email: "admin@example.com",
    password: "admin123", // In a real app, this would be hashed
    firstName: "Admin",
    lastName: "User",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 }
    );
  }

  // Check if user is updating their own profile or is an admin
  if (session.user.id !== context.params.id && session.user.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  try {
    const userData = await request.json();

    // Find user
    const userIndex = users.findIndex((u) => u.id === context.params.id);

    if (userIndex === -1) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Update user
    users[userIndex] = {
      ...users[userIndex],
      ...userData,
      updatedAt: new Date(),
    };

    // Return updated user (excluding password)

    const { password, ...userWithoutPassword } = users[userIndex];
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Failed to update user" },
      { status: 500 }
    );
  }
}
