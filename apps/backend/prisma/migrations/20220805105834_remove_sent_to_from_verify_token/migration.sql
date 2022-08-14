/*
  Warnings:

  - You are about to drop the column `sentTo` on the `verify_tokens` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "verify_tokens" DROP COLUMN "sentTo";
