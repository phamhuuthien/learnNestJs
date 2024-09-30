import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'phải là email' })
  email: string;

  @Length(2, 10, { message: 'address phải lớn hơn 5 và nhỏ hơn 10' })
  password: string;
}
