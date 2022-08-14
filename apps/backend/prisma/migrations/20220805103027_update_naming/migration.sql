/*
  Warnings:

  - You are about to drop the column `confirmedAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `confirm_tokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "confirm_tokens" DROP CONSTRAINT "confirm_tokens_userId_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "confirmedAt",
ADD COLUMN     "verifiedAt" TIMESTAMP(3);

-- DropTable
DROP TABLE "confirm_tokens";

-- CreateTable
CREATE TABLE "verify_tokens" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "sentTo" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verify_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "verify_tokens_token_key" ON "verify_tokens"("token");

-- AddForeignKey
ALTER TABLE "verify_tokens" ADD CONSTRAINT "verify_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
