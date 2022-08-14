/*
  Warnings:

  - You are about to drop the `verify_tokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "GeneralTokenContext" AS ENUM ('VERIFY_EMAIL', 'FORGOT_PASSWORD');

-- DropForeignKey
ALTER TABLE "verify_tokens" DROP CONSTRAINT "verify_tokens_userId_fkey";

-- DropTable
DROP TABLE "verify_tokens";

-- CreateTable
CREATE TABLE "general_tokens" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "context" "GeneralTokenContext" NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "general_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "general_tokens_token_key" ON "general_tokens"("token");

-- AddForeignKey
ALTER TABLE "general_tokens" ADD CONSTRAINT "general_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
