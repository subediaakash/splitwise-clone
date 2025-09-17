-- CreateEnum
CREATE TYPE "public"."ExpenseType" AS ENUM ('PERSONAL', 'GROUP');

-- AlterTable
ALTER TABLE "public"."expense" ADD COLUMN     "expenseType" "public"."ExpenseType" NOT NULL DEFAULT 'GROUP';
