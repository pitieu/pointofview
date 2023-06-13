"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
var client_1 = require("@prisma/client");
var globalForPrisma = globalThis;
var prisma;
if (process.env.NODE_ENV === "production") {
    prisma = new client_1.PrismaClient();
}
else {
    console.log("New PrismaClient connection is cached?", !!globalForPrisma.prisma);
    if (!globalForPrisma.prisma) {
        prisma = new client_1.PrismaClient();
    }
    else {
        prisma = globalForPrisma.prisma;
    }
}
exports.db = prisma;
