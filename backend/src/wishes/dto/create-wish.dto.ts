import {
  Length,
  IsUrl,
  IsPositive,
  IsString,
  IsOptional,
} from 'class-validator';
import { Column } from 'typeorm/decorator/columns/Column';

export class CreateWishDto {
  @IsString()
  @Length(1, 250)
  name: string;

  @IsUrl()
  link: string;

  @IsUrl()
  image: string;

  @IsPositive()
  price: number;

  @Column({ default: 0 })
  raised: number;

  @IsString()
  @Length(1, 1024)
  description: string;

  @IsOptional()
  copied: number;
}
