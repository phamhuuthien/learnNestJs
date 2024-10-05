import { Expose, Transform } from 'class-transformer';
import { IsNumber, IsString, Min } from 'class-validator';

export class fillterUserDto {
  @Transform(({ value }) => parseInt(value, 10) || 1)
  @Expose()
  @IsNumber()
  @Min(1)
  page: number;

  @Transform(({ value }) => parseInt(value, 10) || 10)
  @Expose()
  @IsNumber()
  @Min(1)
  pageSize: number;

  @Transform(({ value }) => value || '')
  @Expose()
  @IsString()
  search: string;
}
