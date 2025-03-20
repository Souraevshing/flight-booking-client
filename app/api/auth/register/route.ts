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
];

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, lastName, password } = await request.json();

    // Check if user already exists
    if (users.some((u) => u.email === email)) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Create new user
    const newUser = {
      id: `${users.length + 1}`,
      email,
      password, // In a real app, this would be hashed
      firstName,
      lastName,
      role: USER_ROLE.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add user to database
    users.push(newUser);

    // Create session
    const session = {
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = newUser;
    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
