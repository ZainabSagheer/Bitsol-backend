import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function POST(request: Request) {
  try {
    const { name, email, phone, courseName, coursePrice, paymentMethod } =
      await request.json();

    if (!name || !email || !courseName) {
      return NextResponse.json(
        { error: "name, email, and courseName are required" },
        { status: 400, headers: CORS }
      );
    }

    // 1. Find or create student user
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

    // 2. Find or create course by title
    let course = await prisma.course.findFirst({
      where: { title: { equals: courseName, mode: "insensitive" } },
    });
    if (!course) {
      // Parse price string like "Rs 20,000" → 20000
      const parsedPrice = coursePrice
        ? parseFloat(String(coursePrice).replace(/[^0-9.]/g, ""))
        : 0;

      course = await prisma.course.create({
        data: {
          title: courseName,
          description: "Course from courses.bitsolmarketing.com",
          price: isNaN(parsedPrice) ? 0 : parsedPrice,
          category: "Online",
          isActive: true,
        },
      });
    }

    // 3. Find or create enrollment (prevent duplicates)
    const existing = await prisma.enrollment.findFirst({
      where: { userId: user.id, courseId: course.id },
    });

    let enrollment = existing;
    if (!existing) {
      enrollment = await prisma.enrollment.create({
        data: {
          userId: user.id,
          courseId: course.id,
          progress: 0,
        },
      });
    }

    // 4. Optionally log payment method in a CRM lead note (non-fatal)
    prisma.cRMLead
      .create({
        data: {
          name,
          email,
          phone: phone || null,
          status: "NEW",
          notes: `Course Enrollment\nCourse: ${courseName}\nPrice: ${coursePrice || "N/A"}\nPayment: ${paymentMethod || "N/A"}`,
        },
      })
      .catch(() => {});

    return NextResponse.json(
      {
        success: true,
        enrollmentId: enrollment!.id,
        userId: user.id,
        courseId: course.id,
      },
      { status: 201, headers: CORS }
    );
  } catch (error) {
    console.error("[course-inquiry]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: CORS }
    );
  }
}
