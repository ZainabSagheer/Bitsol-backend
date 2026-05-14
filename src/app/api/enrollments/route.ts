import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const enrollments = await prisma.enrollment.findMany({
    include: {
      user: { select: { id: true, name: true, email: true, phone: true, role: true } },
      course: { select: { id: true, title: true, price: true, category: true } },
    },
    orderBy: { enrolledAt: "desc" },
  });

  return NextResponse.json(enrollments);
}

export async function POST(request: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, email, phone, courseName } = await request.json();

    if (!name || !email || !courseName) {
      return NextResponse.json(
        { error: "name, email, and courseName are required" },
        { status: 400 }
      );
    }

    // Find or create user
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      const tempPassword = await bcrypt.hash(
        Math.random().toString(36).slice(-10),
        10
      );
      user = await prisma.user.create({
        data: {
          name,
          email,
          password: tempPassword,
          role: "STUDENT",
          phone: phone || null,
          isActive: true,
        },
      });
    }

    // Find or create course
    let course = await prisma.course.findFirst({
      where: { title: { equals: courseName, mode: "insensitive" } },
    });
    if (!course) {
      course = await prisma.course.create({
        data: {
          title: courseName,
          description: "Manually enrolled via admin panel",
          price: 0,
          category: "Online",
          isActive: true,
        },
      });
    }

    // Prevent duplicate enrollment
    const existing = await prisma.enrollment.findFirst({
      where: { userId: user.id, courseId: course.id },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Student is already enrolled in this course" },
        { status: 409 }
      );
    }

    const enrollment = await prisma.enrollment.create({
      data: { userId: user.id, courseId: course.id, progress: 0 },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true, role: true } },
        course: { select: { id: true, title: true, price: true, category: true } },
      },
    });

    return NextResponse.json(enrollment, { status: 201 });
  } catch (error) {
    console.error("[enrollments POST]", error);
    return NextResponse.json({ error: "Failed to create enrollment" }, { status: 500 });
  }
}
