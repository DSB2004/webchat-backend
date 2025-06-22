/*
  Warnings:

  - You are about to drop the `MessaageAESKey` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MessaageAESKey" DROP CONSTRAINT "MessaageAESKey_messageId_fkey";

-- DropForeignKey
ALTER TABLE "MessaageAESKey" DROP CONSTRAINT "MessaageAESKey_userId_fkey";

-- DropTable
DROP TABLE "MessaageAESKey";

-- CreateTable
CREATE TABLE "MessageAESKey" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "aesKey" TEXT NOT NULL,

    CONSTRAINT "MessageAESKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MessageAESKey_messageId_userId_key" ON "MessageAESKey"("messageId", "userId");

-- AddForeignKey
ALTER TABLE "MessageAESKey" ADD CONSTRAINT "MessageAESKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageAESKey" ADD CONSTRAINT "MessageAESKey_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
