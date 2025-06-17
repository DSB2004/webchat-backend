/*
  Warnings:

  - You are about to drop the `_AdminRelation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ParticipantRelation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AdminRelation" DROP CONSTRAINT "_AdminRelation_A_fkey";

-- DropForeignKey
ALTER TABLE "_AdminRelation" DROP CONSTRAINT "_AdminRelation_B_fkey";

-- DropForeignKey
ALTER TABLE "_ParticipantRelation" DROP CONSTRAINT "_ParticipantRelation_A_fkey";

-- DropForeignKey
ALTER TABLE "_ParticipantRelation" DROP CONSTRAINT "_ParticipantRelation_B_fkey";

-- DropTable
DROP TABLE "_AdminRelation";

-- DropTable
DROP TABLE "_ParticipantRelation";

-- CreateTable
CREATE TABLE "ChatroomParticipant" (
    "id" TEXT NOT NULL,
    "chatroomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ChatroomParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatroomAdmin" (
    "id" TEXT NOT NULL,
    "chatroomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ChatroomAdmin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChatroomParticipant_chatroomId_userId_key" ON "ChatroomParticipant"("chatroomId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "ChatroomAdmin_chatroomId_userId_key" ON "ChatroomAdmin"("chatroomId", "userId");

-- AddForeignKey
ALTER TABLE "ChatroomParticipant" ADD CONSTRAINT "ChatroomParticipant_chatroomId_fkey" FOREIGN KEY ("chatroomId") REFERENCES "Chatroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatroomParticipant" ADD CONSTRAINT "ChatroomParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatroomAdmin" ADD CONSTRAINT "ChatroomAdmin_chatroomId_fkey" FOREIGN KEY ("chatroomId") REFERENCES "Chatroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatroomAdmin" ADD CONSTRAINT "ChatroomAdmin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
