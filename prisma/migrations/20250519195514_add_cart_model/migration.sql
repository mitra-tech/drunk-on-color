/*
  Warnings:

  - You are about to drop the column `sessionCarId` on the `Cart` table. All the data in the column will be lost.
  - Added the required column `sessionCartId` to the `Cart` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "sessionCarId",
ADD COLUMN     "sessionCartId" TEXT NOT NULL;
