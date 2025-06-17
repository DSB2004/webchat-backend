/*
  Warnings:

  - A unique constraint covering the columns `[blockedId,blockerId]` on the table `Block` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[inviteCode]` on the table `Chatroom` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `inviteCode` to the `Chatroom` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StatusType" AS ENUM ('SEEN', 'SENT', 'DELIVERIED', 'PENDING');

-- AlterTable
ALTER TABLE "Chatroom" ADD COLUMN     "inviteCode" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Status" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "StatusType" NOT NULL,

    CONSTRAINT "Status_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Status_messageId_userId_key" ON "Status"("messageId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Block_blockedId_blockerId_key" ON "Block"("blockedId", "blockerId");

-- CreateIndex
CREATE UNIQUE INDEX "Chatroom_inviteCode_key" ON "Chatroom"("inviteCode");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Status" ADD CONSTRAINT "Status_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Status" ADD CONSTRAINT "Status_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
