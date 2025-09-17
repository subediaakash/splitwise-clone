import { Currency, ExpenseSplitType, ExpenseType } from "@/generated/prisma"
export interface IExpense{
description : string,
participants : string[],
amount : number,
splitType : ExpenseSplitType,
currency? : Currency,
expenseType? : ExpenseType

}