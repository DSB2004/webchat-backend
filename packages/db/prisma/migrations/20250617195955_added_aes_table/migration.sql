/*
  Warnings:

  - Added the required column `publicKey` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "publicKey" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "MessaageAESKey" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,

    CONSTRAINT "MessaageAESKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MessaageAESKey_messageId_userId_key" ON "MessaageAESKey"("messageId", "userId");

-- AddForeignKey
ALTER TABLE "MessaageAESKey" ADD CONSTRAINT "MessaageAESKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessaageAESKey" ADD CONSTRAINT "MessaageAESKey_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
