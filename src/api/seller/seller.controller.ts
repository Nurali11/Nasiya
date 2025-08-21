import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { SellerService } from './seller.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { LoginSellerDto } from './dto/login-seller.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { VerifyOtpDto } from './dto/verifyOtp.dto';
import { ResetRequestDto } from './dto/reset-request.dto';
import { RefreshTokenDto } from './dto/refreshtokenDto';
import { ApiQuery } from '@nestjs/swagger';
import { PaymentDto } from './dto/payment.dto';
import { RolesD } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Request } from 'express';

@Controller('seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) { }

  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'filter', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @Get()
  findAll(
    @Query('filter') filter: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortBy') sortBy: string,
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc',
  ) {
    return this.sellerService.findAll(filter, page, limit, sortBy, sortOrder);
  }

  @RolesD("SELLER")
  @Post('addBalance')
  @UseGuards(AuthGuard,RoleGuard)
  payment(@Body() paymentDto: PaymentDto, @Req() req: Request) {
    const sellerId = (req as any).user.id;
    return this.sellerService.payment(paymentDto.money, sellerId);
  }

  @RolesD("ADMIN")
  @Post('create')
  @UseGuards(AuthGuard, RoleGuard)
  async register(@Body() data: CreateSellerDto) {
    return await this.sellerService.post(data);
  }

  @Post('login')
  async login(@Body() data: LoginSellerDto) {
    return await this.sellerService.login(data);
  }

  @RolesD("SELLER")
  @UseGuards(AuthGuard, RoleGuard)
  @Get('settings')
  async settings(@Req() req: Request) {
    const id = (req as any).user.id;
    return await this.sellerService.settings(id);
  }

  @Post('forget')
  forgetRequest(@Body() data: ResetRequestDto) {
    return this.sellerService.forgetRequest(data.email);
  }

  @Post('verifyOtp')
  async verifyOtp(@Body() data: VerifyOtpDto) {
    return await this.sellerService.forgetVerify(data);
  }

  @Post('resetPassword')
  async resetPassword(@Body() data: ResetPasswordDto) {
    return await this.sellerService.resetPassword(data);
  }

  @RolesD("SELLER")
  @UseGuards(AuthGuard, RoleGuard)
  @Get("me")
  async me(@Req() req: Request) {
    return await this.sellerService.me(req);
  }

  @Patch(':id')
    update(@Param('id') id: string, @Body() data: UpdateSellerDto) {
      return this.sellerService.update(id, data);
    }

  @RolesD('ADMIN')
  @UseGuards(AuthGuard, RoleGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sellerService.remove(id);
  }
}