import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { AnyQuantityDto, CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PayForMonths } from './dto/RemainingMonths.dto';
import { MultiMonthPayDto } from './dto/MultiMonthlyPaydto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ROLES_KEY, RolesD } from 'src/common/decorators/roles.decorator';
import { RoleGuard } from 'src/common/guards/role.guard';

RolesD("SELLER")
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }
  @Get("")
  getAll(@Req() req: Request) {
    const sellerId = (req as any).user.id
    return this.paymentsService.getAll(sellerId);
  }

  @RolesD("SELLER")
  @UseGuards(AuthGuard, RoleGuard)
  @Post('one-month-pay')
  oneMonthPay(@Body() dto: CreatePaymentDto, @Req() req: Request) {
    const sellerId = (req as any).user.id
    return this.paymentsService.OneMonth(dto, sellerId);
  }

  @RolesD("SELLER")
  @UseGuards(AuthGuard, RoleGuard)
  @Post('pay-any-sum')
  payAsYouWish(@Body() data: AnyQuantityDto, @Req() req: Request) {
   const sellerId = (req as any).user.id
    return this.paymentsService.anyQuantity(data, sellerId);
  }

  @RolesD("SELLER")
  @UseGuards(AuthGuard,RoleGuard)
  @Post('pay-for-months')
  forMonths(@Body() dto: PayForMonths, @Req() req: Request) {
    const sellerId = (req as any).user.id
    return this.paymentsService.forMonths(dto, sellerId);
  }
}