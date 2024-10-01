import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEmpty, IsNotEmpty, Length } from 'class-validator';

export class RegisterDto {
  @ApiProperty()
  @Length(2, 10, { message: 'first name không lớn hơn 2 và nhỏ hơn 10' })
  firstName: string;

  @ApiProperty()
  @Length(2, 10, { message: 'last name không lớn hơn 2 và nhỏ hơn 10' })
  lastName: string;

  @ApiProperty()
  @IsEmail({}, { message: 'phải là email' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'password không được để trống' })
  @Length(0, 10, { message: 'address phải lớn hơn 5 và nhỏ hơn 10' })
  password: string;

  @ApiProperty()
  @Length(5, 255, { message: 'address phải lớn hơn 5 và nhỏ hơn 255' })
  address: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'role không được để trống' })
  roleId: number;
}
