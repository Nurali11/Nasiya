import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsPhoneNumber, IsString } from 'class-validator';

export class UpdateSellerDto  {
    @ApiProperty({ example: "John Doe" })
      @IsString()
      name?: string;
    
      @ApiProperty({ example: "+998912345678" })
      @IsPhoneNumber()
      phone?: string;
    
      @ApiProperty({ example: "12345" })
      @IsString()
      password?: string;
    
      @ApiProperty({ example: "1234" })
      @IsNumber()
      passcode?: number;
    
      @ApiProperty({ example: "alex@gmail.com" })
      @IsEmail()
      email?: string;
    
      @ApiProperty({ example: "15000000" })
      @IsNumber()
      balance?: number;
    
    
}
