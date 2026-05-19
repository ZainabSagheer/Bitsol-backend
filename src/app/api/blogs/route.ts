import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: { createdAt: "desc" },
      include: { author: { select: { name: true } } },
    });
    return NextResponse.json(blogs);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Find an admin user to assign as the author
    let user = await prisma.user.findFirst({
      where: { role: "SUPER_ADMIN" }
    });

    if (!user) {
      user = await prisma.user.findFirst(); // fallback to any user
    }

    if (!user) {
      return NextResponse.json({ error: "No users found in database to author this blog" }, { status: 400 });
    }

    const blog = await prisma.blog.create({
      data: {
        title: data.title,
        slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now().toString().slice(-4),
        content: data.content,
        excerpt: data.excerpt || null,
        published: data.published || false,
        authorId: user.id,
      },
    });
    return NextResponse.json(blog, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
