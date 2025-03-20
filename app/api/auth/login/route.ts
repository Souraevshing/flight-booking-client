import { USER_ROLE } from "@/lib/types/users-types";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

// Mock user database - in a real app, this would be your database
const users = [
  {
    id: "1",
    email: "user@example.com",
    password: "password123", // In a real app, this would be hashed
    firstName: "John",
    lastName: "Doe",
    role: USER_ROLE.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    email: "admin@example.com",
    password: "admin123", // In a real app, this would be hashed
    firstName: "Admin",
    lastName: "User",
    role: USER_ROLE.ADMIN,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Find user by email
    const user = users.find((u) => u.email === email);

    // Check if user exists and password matches
    if (!user || user.password !== password) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Create session
    const session = {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };

    // Set session cookie
    (
      await // Set session cookie
      cookies()
    ).set({
      name: "session",
      value: btoa(JSON.stringify(session)),
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
