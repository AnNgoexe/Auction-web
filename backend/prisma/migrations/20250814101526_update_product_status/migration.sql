/*
  Warnings:

  - The values [REMOVED] on the enum `products_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `categories` MODIFY `name` ENUM('ELECTRONICS', 'FASHION', 'COLLECTIBLES', 'HOME_APPLIANCES', 'SPORTS_EQUIPMENT', 'TOYS_AND_GAMES', 'VEHICLES', 'REAL_ESTATE', 'ART_AND_CRAFTS', 'JEWELRY_AND_ACCESSORIES', 'HEALTH_AND_BEAUTY', 'GARDEN_AND_OUTDOORS', 'MUSIC_INSTRUMENTS', 'PET_SUPPLIES', 'OFFICE_SUPPLIES', 'OTHER') NOT NULL;

-- AlterTable
ALTER TABLE `products` MODIFY `status` ENUM('ACTIVE', 'INACTIVE', 'SOLD') NOT NULL DEFAULT 'INACTIVE';
