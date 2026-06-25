const { PrismaClient } = require("../generated/prisma/client");

const prismaCli = new PrismaClient();

module.exports = { prismaCli };
