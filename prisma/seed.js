const { PrismaClient } = require("@prisma/client");
const data = require("../assets/mock-data.json");
const prisma = new PrismaClient();

async function main() {
  const clerkId = "user_2eATuV2scN1Ke8qPOixXnF8F8iV";

  const jobs = data.map((datum) => ({ ...datum, clerkId }));

  for (const job of jobs) {
    await prisma.job.create({
      data: job,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .then(() => {
    console.log("🚀Database seed complete!🚀");
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
