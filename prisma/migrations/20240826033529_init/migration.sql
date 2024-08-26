-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriceTable" (
    "id" SERIAL NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "fullPaid" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT NOT NULL,
    "creatorId" INTEGER NOT NULL,

    CONSTRAINT "PriceTable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserPriceTables" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_UserPayments" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_UserPriceTables_AB_unique" ON "_UserPriceTables"("A", "B");

-- CreateIndex
CREATE INDEX "_UserPriceTables_B_index" ON "_UserPriceTables"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UserPayments_AB_unique" ON "_UserPayments"("A", "B");

-- CreateIndex
CREATE INDEX "_UserPayments_B_index" ON "_UserPayments"("B");

-- AddForeignKey
ALTER TABLE "PriceTable" ADD CONSTRAINT "PriceTable_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserPriceTables" ADD CONSTRAINT "_UserPriceTables_A_fkey" FOREIGN KEY ("A") REFERENCES "PriceTable"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserPriceTables" ADD CONSTRAINT "_UserPriceTables_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserPayments" ADD CONSTRAINT "_UserPayments_A_fkey" FOREIGN KEY ("A") REFERENCES "PriceTable"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserPayments" ADD CONSTRAINT "_UserPayments_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
