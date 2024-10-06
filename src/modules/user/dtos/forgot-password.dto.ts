import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPassword {
  @IsNotEmpty({ message: 'email không được để trống' })
  @IsEmail({}, { message: 'email không hợp lệ' })
  email: string;
}
