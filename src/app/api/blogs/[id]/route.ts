import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const blog = await prisma.blog.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: { author: { select: { name: true } } },
    });
    if (!blog) return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    return NextResponse.json(blog);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await req.json();
    const blog = await prisma.blog.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.title ? data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") : undefined,
        content: data.content,
        excerpt: data.excerpt,
        published: data.published,
      },
    });
    return NextResponse.json(blog);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.blog.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Blog deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
