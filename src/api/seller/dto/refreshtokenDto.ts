import { ApiProperty } from "@nestjs/swagger";

export class RefreshTokenDto {
  @ApiProperty({example:'string'})
  refreshToken: string;
  

}
