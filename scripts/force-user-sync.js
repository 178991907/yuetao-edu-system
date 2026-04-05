const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Checking and upserting system users...");
  
  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: { password: "admin123", role: "ADMIN", name: "阅陶校长" },
    create: { username: "admin", password: "admin123", role: "ADMIN", name: "阅陶校长" },
  });
  
  const teacher = await prisma.user.upsert({
    where: { username: "teacher" },
    update: { password: "teacher123", role: "TEACHER", name: "莉莉老师" },
    create: { username: "teacher", password: "teacher123", role: "TEACHER", name: "莉莉老师" },
  });

  console.log("Upserted Users:", { admin: admin.username, teacher: teacher.username });
  
  const count = await prisma.user.count();
  console.log("Total users in DB:", count);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
