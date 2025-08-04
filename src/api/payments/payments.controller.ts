import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import {  CreatePaymentDto, PayAsYouWishDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { RemainingMonthsDto } from './dto/RemainingMonths.dto';
import { MultiMonthPayDto } from './dto/MultiMonthlyPaydto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ROLES_KEY, RolesD } from 'src/common/decorators/roles.decorator';
import { RoleGuard } from 'src/common/guards/role.guard';

RolesD("SELLER")
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @RolesD("SELLER")
  @UseGuards(AuthGuard)
  @Post('one-month-pay')
  oneMonthPay(@Body() dto: CreatePaymentDto, @Req() req: Request) {
    const sellerId = (req as any).user.id
    return this.paymentsService.OneMonth(dto, sellerId);
  }

  @RolesD("SELLER")
  @UseGuards(AuthGuard, RoleGuard)
  @Post('pay-as-you-wish')
  payAsYouWish(@Body() dto: PayAsYouWishDto, @Req() req: Request) {
   const sellerId = (req as any).user.id
    return this.paymentsService.anyQuantity(dto, sellerId);
  }

  @RolesD("SELLER")
  @UseGuards(AuthGuard,RoleGuard)
  @Post('remaining-months')
  getRemainingMonths(@Body() dto: RemainingMonthsDto) {
    return this.paymentsService.calculateRemainingMonths(dto);
  }


  @RolesD("SELLER")
  @Post('multi-month-pay')
  @UseGuards(AuthGuard,RoleGuard)
  multiMonthPay(@Body() dto: MultiMonthPayDto, @Req() req: Request) {
    const sellerId = (req as any).user.id
    return this.paymentsService.multiMonthPay(dto, sellerId);
  }
}