import { IsEmail, IsEmpty, IsNotEmpty, Length } from 'class-validator';

export class RegisterDto {
  @Length(2, 10, { message: 'first name không lớn hơn 2 và nhỏ hơn 10' })
  firstName: string;

  @Length(2, 10, { message: 'last name không lớn hơn 2 và nhỏ hơn 10' })
  lastName: string;

  @IsEmail({}, { message: 'phải là email' })
  email: string;

  @IsNotEmpty({ message: 'password không được để trống' })
  @Length(0, 10, { message: 'address phải lớn hơn 5 và nhỏ hơn 10' })
  password: string;

  @Length(5, 255, { message: 'address phải lớn hơn 5 và nhỏ hơn 255' })
  address: string;

  @IsNotEmpty({ message: 'role không được để trống' })
  roleId: number;
}
