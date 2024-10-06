import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class ResetPassword {
  @IsNotEmpty({ message: 'password không được để trống' })
  @IsString()
  @MaxLength(10, { message: 'password phải nhỏ hơn 10 kí tự' })
  @MinLength(5, { message: 'password phải lớn hơn 5 kí tự' })
  password: string;
}
