/*
  Warnings:

  - Added the required column `loginType` to the `Auth` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LoginType" AS ENUM ('EMAIL', 'GOOGLE');

-- AlterTable
ALTER TABLE "Auth" ADD COLUMN     "loginType" "LoginType" NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "description" TEXT,
ADD COLUMN     "profilePic" TEXT,
ADD COLUMN     "status" TEXT;
