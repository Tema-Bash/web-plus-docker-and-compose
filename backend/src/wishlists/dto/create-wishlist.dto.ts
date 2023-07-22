import { Length, IsString, IsUrl, IsOptional, IsArray } from 'class-validator';

export class CreateWishlistDto {
  @Length(1, 250)
  @IsString()
  name: string;

  @IsUrl()
  image: string;

  @Length(1, 1500)
  @IsOptional()
  description: string;

  @IsArray()
  itemsId: number[];
}
