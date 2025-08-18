import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@common/services/prisma.service';
import { AddressResponseDto } from '@modules/address/dtos/address.response.dto';
import { CreateAddressDto } from '@modules/address/dtos/create-address.body.dto';
import {
  MAX_ADDRESS_COUNT,
  ERROR_TOO_MANY_ADDRESSES,
} from '@modules/address/address.constant';

@Injectable()
export class AddressService {
  constructor(private readonly prisma: PrismaService) {}

  async getAddressesByUserId(userId: string): Promise<AddressResponseDto[]> {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        addressId: true,
        streetAddress: true,
        city: true,
        state: true,
        postalCode: true,
        country: true,
        addressType: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async replaceAddresses(
    userId: string,
    newAddresses: CreateAddressDto[],
  ): Promise<void> {
    if (newAddresses.length > MAX_ADDRESS_COUNT) {
      throw new BadRequestException(ERROR_TOO_MANY_ADDRESSES);
    }

    await this.prisma.$transaction(async (prisma) => {
      await prisma.address.deleteMany({
        where: { userId },
      });

      if (newAddresses.length > 0) {
        await prisma.address.createMany({
          data: newAddresses.map((addr) => ({
            userId,
            streetAddress: addr.streetAddress,
            city: addr.city,
            state: addr.state,
            postalCode: addr.postalCode,
            country: addr.country,
            addressType: addr.addressType,
          })),
        });
      }
    });
  }
}
