import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

const uri = process.env.MONGODB_URI || "";
let client: MongoClient | null = null;

async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client.db("mydb");
}

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy");

export async function POST(request: Request) {
  try {
    const { name, email, service, message } = await request.json();

    // Primary storage: PostgreSQL CRMLead (admin dashboard)
    const lead = await prisma.cRMLead.create({
      data: {
        name,
        email,
        company: null,
        phone: null,
        status: "NEW",
        value: null,
        notes: `Service: ${service}\n\n${message}`,
      },
    });

    // Secondary storage: MongoDB (non-fatal — skipped if Atlas is unreachable)
    await connectToDatabase()
      .then((db) =>
        db.collection("Lead").insertOne({
          name,
          email,
          subject: service,
          message,
          status: "NEW",
          createdAt: new Date(),
        })
      )
      .catch((err) => console.error("[MongoDB sync] skipped:", err.message));

    // Send Email Notification
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: "BITSOL Leads <leads@bitsolmarketing.com>",
        to: process.env.ADMIN_EMAIL || "adnan.bashir7895@gmail.com",
        subject: `New Lead: ${name} - ${service}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #00D9FF;">New Inquiry from BITSOL Website</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Interested Service:</strong> ${service}</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            <p><strong>Message:</strong></p>
            <p style="background: #f9f9f9; padding: 15px; border-radius: 8px;">${message}</p>
            <p style="font-size: 12px; color: #888; margin-top: 30px;">
              This inquiry has also been stored in the BITSOL Admin Dashboard.
            </p>
          </div>
        `,
      });
    }

    return NextResponse.json(
      { success: true, leadId: lead.id },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  } catch (error) {
    console.error("Lead submission error:", error);
    return NextResponse.json(
      { error: "Failed to process inquiry" },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    }
  );
}
