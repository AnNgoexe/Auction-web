import { AddressType } from '@prisma/client';

export class CreateAddressDto {
  streetAddress!: string;

  city!: string;

  state?: string;

  postalCode?: string;

  country!: string;

  addressType!: AddressType;
}
