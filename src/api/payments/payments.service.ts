import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto, PayAsYouWishDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { RemainingMonthsDto } from './dto/RemainingMonths.dto';
import { MultiMonthPayDto } from './dto/MultiMonthlyPaydto';
import { PrismaService } from 'src/core/entity/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) { }

  async OneMonth(data: CreatePaymentDto, sellerId: string) {

  }

  async anyQuantity(dto: PayAsYouWishDto, SellerId: string) {
    const nasiya = await this.prisma.nasiya.findUnique({
      where: { id: dto.debtId },
      include: {
        Debtor: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!nasiya) {
      throw new NotFoundException('Borrowed product not found');
    }

    if (nasiya.sum <= 0) {
      throw new BadRequestException(
        `This product is already fully paid. Total amount is 0 sum.`,
      );
    }

    if (dto.amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    if (dto.amount > nasiya.sum) {
      throw new BadRequestException(
        `You cannot pay more than ${nasiya.sum} sum`,
      );
    }

    await this.prisma.paymentHistory.create({
      data: {
        debtId: dto.debtId,
        debtorId: dto.debtorId,
        amount: dto.amount,
      },
    });

    await this.prisma.seller.update({
      where: { id: SellerId },
      data: {
        balance: {
          increment: dto.amount,
        },
      },
    });

    const newTotal = nasiya.sum - dto.amount;

    if (newTotal <= 0) {
      await this.prisma.nasiya.update({
        where: { id: dto.debtId },
        data: { sum: 0 },
      });

      return {
        message:
          'Payment completed. The sum amount is now 0 sum. Further payments are not allowed.',
      };
    } else {
      await this.prisma.nasiya.update({
        where: { id: dto.debtId },
        data: { sum: newTotal },
      });

      const remainingMonths = Math.ceil(
        newTotal / nasiya.monthlySum,
      );

      return {
        message: `Payment successful. ${remainingMonths} months of payment remaining`,
        remainingAmount: newTotal,
      };
    }
  }

  async calculateRemainingMonths(dto: RemainingMonthsDto) {
    const nasiya = await this.prisma.nasiya.findUnique({
      where: { id: dto.debtId },
    });

    if (!nasiya) {
      throw new NotFoundException('Borrowed product not found');
    }

    if (nasiya.debtorId !== dto.debtorId) {
      throw new BadRequestException(
        'This borrowed product does not belong to the specified debtor',
      );
    }

    if (nasiya.sum <= 0) {
      return {
        message: 'This product is fully paid. No remaining payments.',
        remainingMonths: 0,
        remainingAmount: 0,
      };
    }

    const remainingMonths = Math.ceil(
      nasiya.sum / nasiya.monthlySum,
    );

    return {
      debtId: dto.debtId,
      debtorId: dto.debtorId,
      sum: nasiya.sum,
      monthlySum: nasiya.monthlySum,
      remainingMonths,
    };
  }
async multiMonthPay(dto: MultiMonthPayDto, SellerId: string) {
  const nasiya = await this.prisma.nasiya.findUnique({
    where: { id: dto.debtId },
  });

  if (!nasiya) {
    throw new NotFoundException('Borrowed product not found');
  }

  if (nasiya.debtorId !== dto.debtorId) {
    throw new BadRequestException(
      'This borrowed product does not belong to the specified debtor',
    );
  }

  if (nasiya.sum <= 0) {
    throw new BadRequestException(
      'This product is already fully paid. Further payments are not allowed.',
    );
  }

  const remainingMonths = Math.ceil(
    nasiya.sum / nasiya.monthlySum,
  );

  if (dto.monthsToPay > remainingMonths) {
    throw new BadRequestException(
      `You cannot pay more than ${remainingMonths} months. Only ${remainingMonths} months are left.`,
    );
  }

  const totalPayment = dto.monthsToPay * nasiya.monthlySum;

  await this.prisma.paymentHistory.create({
    data: {
      debtId: dto.debtId,
      debtorId: dto.debtorId,
      amount: totalPayment,
    },
  });

  await this.prisma.seller.update({
    where: { id: SellerId },
    data: {
      balance: {
        increment: totalPayment,
      },
    },
  });

  const newTotal = nasiya.sum - totalPayment;

  await this.prisma.nasiya.update({
    where: { id: dto.debtId },
    data: { sum: newTotal },
  });

  const remainingMonthsAfterPayment = Math.ceil(
    newTotal / nasiya.monthlySum,
  );

  const message =
    newTotal <= 0
      ? 'Payment completed. Total amount is now 0 sum.'
      : `Payment successful. ${remainingMonthsAfterPayment} months of payment remaining`;

  return {
    message,
    remainingAmount: newTotal,
    remainingMonths: remainingMonthsAfterPayment,
  };
}

}