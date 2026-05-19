import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  let user = await prisma.user.findFirst({
    where: { role: "SUPER_ADMIN" }
  });

  if (!user) {
    user = await prisma.user.findFirst();
  }

  if (!user) {
    console.log("No users found. Creating default System Admin...");
    user = await prisma.user.create({
      data: {
        email: "admin@bitsolmarketing.com",
        password: "auto-generated-placeholder",
        name: "System Admin",
        role: "SUPER_ADMIN"
      }
    });
    console.log("Created user:", user.email);
  } else {
    console.log("User already exists:", user.email);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
