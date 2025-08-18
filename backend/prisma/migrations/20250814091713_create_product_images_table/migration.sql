/*
  Warnings:

  - The values [DELETING] on the enum `products_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `products` MODIFY `status` ENUM('ACTIVE', 'INACTIVE', 'SOLD', 'REMOVED') NOT NULL DEFAULT 'INACTIVE';

-- CreateTable
CREATE TABLE `product_images` (
    `product_image_id` CHAR(36) NOT NULL,
    `product_id` CHAR(36) NOT NULL,
    `image_url` VARCHAR(255) NOT NULL,
    `is_primary` BOOLEAN NOT NULL DEFAULT false,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`product_image_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `product_images` ADD CONSTRAINT `product_images_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;
