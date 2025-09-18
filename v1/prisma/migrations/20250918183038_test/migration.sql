-- AlterTable
ALTER TABLE "public"."expense" ADD COLUMN     "totalExpenseSettlementStatus" "public"."SettlementStatus" NOT NULL DEFAULT 'UNPAID';

-- AlterTable
ALTER TABLE "public"."expense_participant" ADD COLUMN     "totalUserSettlementStatus" "public"."SettlementStatus" NOT NULL DEFAULT 'UNPAID';
