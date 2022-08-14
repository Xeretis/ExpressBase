/*
  Warnings:

  - The values [FORGOT_PASSWORD] on the enum `GeneralTokenContext` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "GeneralTokenContext_new" AS ENUM ('VERIFY_EMAIL', 'RESET_PASSWORD');
ALTER TABLE "general_tokens" ALTER COLUMN "context" TYPE "GeneralTokenContext_new" USING ("context"::text::"GeneralTokenContext_new");
ALTER TYPE "GeneralTokenContext" RENAME TO "GeneralTokenContext_old";
ALTER TYPE "GeneralTokenContext_new" RENAME TO "GeneralTokenContext";
DROP TYPE "GeneralTokenContext_old";
COMMIT;
