import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AnyQuantityDto, CreatePaymentDto } from './dto/create-payment.dto';
import { PrismaService } from 'src/core/entity/prisma.service';
import { PayForMonths } from './dto/RemainingMonths.dto';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) { }
  async getAll(sellerId: string) {
    try {
      let all = await this.prisma.paymentHistory.findMany({ where: { Debtor: { sellerId } }, include: { Debtor: { include: { Phone: true } }, Nasiya: true } })
      return all
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async OneMonth(data: CreatePaymentDto, sellerId: string) {
    try {
      let { debtId } = data
      let nasiya = await this.prisma.nasiya.findFirst({ where: { id: debtId } })
      if (!nasiya) { return new NotFoundException('Borrowed product not found') }
      if (sellerId != nasiya.sellerId) { return new BadRequestException('This borrowed product does not belong to the specified debtor') }

      let firstMonth = await this.prisma.paymentPeriod.findFirst({ where: { nasiyaId: debtId, }, orderBy: { period: 'asc' } })
      if (!firstMonth) {
        return new NotFoundException('Borrowed product not found')
      }
      let deleted = await this.prisma.paymentPeriod.delete({ where: { id: firstMonth.id } })
      await this.prisma.nasiya.update({ where: { id: nasiya.id }, data: { remainedSum: nasiya.remainedSum - firstMonth.sum } })

      let historyWrite = await this.prisma.paymentHistory.create({ data: { amount: firstMonth.sum, nasiyaId: nasiya.id, debtorId: nasiya.debtorId } })
      return {
        message: "Successfully paid for next month",
        data: deleted
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async anyQuantity(data: AnyQuantityDto, sellerId: string) {
    try {
      let { debtId } = data
      let amount = data.amount
      let totalAmout = amount
      let nasiya = await this.prisma.nasiya.findFirst({ where: { id: debtId } })
      console.log(sellerId, nasiya);
      if (!nasiya) { return new NotFoundException('Borrowed product not found') }
      if (sellerId != nasiya.sellerId) { return new BadRequestException('This borrowed product does not belong to the specified debtor') }
      let totalRemainedSum = nasiya.remainedSum

      let remainedMonths = await this.prisma.paymentPeriod.findMany({ where: { nasiyaId: debtId }, orderBy: { period: 'asc' } })
      if (!remainedMonths.length) {
        return new NotFoundException('Borrowed product not found')
      }

      for (let i of remainedMonths) {
        if (amount >= i.sum) {
          await this.prisma.paymentPeriod.delete({ where: { id: i.id } })
          let up = await this.prisma.nasiya.update({ where: { id: nasiya.id }, data: { remainedSum: totalRemainedSum - i.sum } })
          totalRemainedSum = totalRemainedSum - i.sum
          amount = amount - i.sum
          console.log(i.sum, amount, up.remainedSum);
        } else if (amount > 0 && amount < i.sum) {
          await this.prisma.paymentPeriod.update({ where: { id: i.id }, data: { sum: i.sum - amount } })
          let up = await this.prisma.nasiya.update({ where: { id: nasiya.id }, data: { remainedSum: totalRemainedSum - amount } })
          amount = 0
          console.log("b", i.sum, amount, up.remainedSum);

          break
        }
      }

      let historyWrite = await this.prisma.paymentHistory.create({ data: { amount: totalAmout, nasiyaId: nasiya.id, debtorId: nasiya.debtorId } })

      return {
        message: "Successfully paid",
        data
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }


  async forMonths(data: PayForMonths, sellerId: string) {
    try {
      let { debtId } = data
      let errorMessage = ""
      let nasiya = await this.prisma.nasiya.findFirst({ where: { id: debtId } })
      if (!nasiya) { return new NotFoundException('Borrowed product not found') }
      if (sellerId != nasiya.sellerId) { return new BadRequestException('This borrowed product does not belong to the specified debtor') }

      let paidSum = 0
      let paidMonths: { month: number, endDate: string }[] = []
      for (let i of data.monthsToPay) {
        let month = await this.prisma.paymentPeriod.findFirst({ where: { nasiyaId: debtId, period: i } })
        if (!month) {
          errorMessage += `Month ${i} not found.`
          continue
        }
        paidSum += month.sum
        paidMonths.push({
          month: i,
          endDate: month?.endDate || ""
        })
        await this.prisma.paymentPeriod.delete({ where: { id: month.id } })
      }

      await this.prisma.nasiya.update({ where: { id: nasiya.id }, data: { remainedSum: nasiya.remainedSum - paidSum } })
      if (paidSum) {
        await this.prisma.paymentHistory.create({
          data: {
            amount: paidSum, nasiyaId: nasiya.id, debtorId: nasiya.debtorId
          }
        })
      }

      if (paidMonths.length) {
        return {
          message: `Successfully paid.${errorMessage ? 'and' + errorMessage : ''}`,
          data: {
            debtId: debtId,
            paidMonths
          }
        }
      } else {
        return new BadRequestException({
          message: `${errorMessage ? 'Months not found ' + errorMessage : ''}`
        })
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}