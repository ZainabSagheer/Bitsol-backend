import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const published = searchParams.get('published');
    const where = published === 'true' ? { published: true } : {};

    const blogs = await prisma.blog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { author: { select: { name: true } } },
    });
    
    // Map coverImage to image for the frontend
    const mappedBlogs = blogs.map(blog => ({
      ...blog,
      image: blog.coverImage
    }));
    
    return NextResponse.json(mappedBlogs);
  } catch (error: any) {
    console.error("GET /api/blogs error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch blogs" }, { status: 500 });
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
      // Auto-create a default admin user if the database is completely empty
      user = await prisma.user.create({
        data: {
          email: process.env.ADMIN_EMAIL || "admin@bitsolmarketing.com",
          password: "auto-generated-placeholder",
          name: "System Admin",
          role: "SUPER_ADMIN"
        }
      });
    }

    const blog = await prisma.blog.create({
      data: {
        title: data.title,
        slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now().toString().slice(-4),
        content: data.content,
        excerpt: data.excerpt || null,
        metaDescription: data.metaDescription || null,
        coverImage: data.coverImage || null,
        tags: data.tags || [],
        published: data.published || false,
        authorId: user.id,
      },
    });
    return NextResponse.json({ ...blog, image: blog.coverImage }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
