import { IsNotEmpty, Length } from "class-validator";

export class LoginDto {
    @IsNotEmpty({message:"email không được trống"})
    email: string;
    
    @IsNotEmpty({message:"email không được trống"})
    @Length(0,10,{message: "address phải lớn hơn 5 và nhỏ hơn 10"})
    password: string;
}