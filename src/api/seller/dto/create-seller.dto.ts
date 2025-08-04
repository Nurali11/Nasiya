import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNumber, IsPhoneNumber, IsString,  } from "class-validator";

export class CreateSellerDto {
  @ApiProperty({ example: "John Doe" })
  @IsString()
  name: string;

  @ApiProperty({ example: "+998912345678" })
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({ example: "image.png" })
  @IsString()
  image: string;

  @ApiProperty({ example: "12345" })
  @IsString()
  password: string;

  @ApiProperty({ example: "alex@gmail.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "15000000" })
  @IsNumber()
  balance: number;

}
