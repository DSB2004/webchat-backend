/*
  Warnings:

  - Added the required column `aesKey` to the `MessaageAESKey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "MessageType" ADD VALUE 'INFO';

-- AlterTable
ALTER TABLE "MessaageAESKey" ADD COLUMN     "aesKey" TEXT NOT NULL;
