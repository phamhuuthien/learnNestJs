import { IsEmail, IsNotEmpty, Length } from "class-validator";

export class CreateUserDto {
  @IsEmail({},{message: "phải là email"})
  email: string;

  @IsNotEmpty({message: "password không được để trống"})
  @Length(5,10,{message: "address phải lớn hơn 5 và nhỏ hơn 10"})
  password: string;

  @Length(5,255,{message: "address phải lớn hơn 5 và nhỏ hơn 255"})
  address: string;

  @IsNotEmpty({message: "role không được để trống"})
  roleId : number;
}