import { IsBoolean, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class CreateOfferDto {
  @IsNotEmpty()
  @Min(1)
  amount: number;

  @IsBoolean()
  @IsOptional()
  hidden: boolean;

  @IsNotEmpty()
  itemId: number;
}
