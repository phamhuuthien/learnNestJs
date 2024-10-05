import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @Length(2, 10, { message: 'first name không lớn hơn 2 và nhỏ hơn 10' })
  firstName: string;

  @ApiProperty()
  @Length(2, 10, { message: 'last name không lớn hơn 2 và nhỏ hơn 10' })
  lastName: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'email không được để trống' })
  @IsEmail({}, { message: 'phải là email' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'password không được để trống' })
  @Length(5, 10, { message: 'address phải lớn hơn 5 và nhỏ hơn 10' })
  password: string;

  @ApiProperty()
  @IsOptional()
  address: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'role không được để trống' })
  roleId: number;
}
