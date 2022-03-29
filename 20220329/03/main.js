const prisma = require("@prisma/client");
const client = new prisma.PrismaClient();

async function main() {
  const store = await client.store.findUnique({
    where: { id: 1 },
    select: { products: true },
  });
  console.log(store.products);
}
main();
