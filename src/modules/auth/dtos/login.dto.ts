import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsEmail({}, { message: 'phải là email' })
  email: string;

  @ApiProperty()
  @Length(2, 10, { message: 'address phải lớn hơn 5 và nhỏ hơn 10' })
  password: string;
}
