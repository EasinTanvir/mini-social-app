const { PrismaClient } = require("../generated/prisma");

const prismaCli = new PrismaClient();

module.exports = { prismaCli };
