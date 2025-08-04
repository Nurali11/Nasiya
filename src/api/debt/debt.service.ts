import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateNasiyaDto } from './dto/create-nasiya.dto';
import { UpdateNasiyaDto } from './dto/update-nasiya.dto';
import { PrismaService } from 'src/core/entity/prisma.service';

@Injectable()
export class DebtService {
  constructor(private readonly prisma: PrismaService) { }

 async create(data: CreateNasiyaDto) {
    const debtor = await this.prisma.nasiya.findFirst({
      where: { id: data.debtorId },
    });
    if (!debtor) {
      throw new BadRequestException('Debtor id not found!');
    }

    const monthlyPayment = Math.ceil(data.sum / data.period);


    const nasiya = await this.prisma.nasiya.create({
      data: {
        startDate:data.startDate,
        name: data.name,
        period: data.period,
        comment: data.comment,
        debtorId: data.debtorId,
        sum: data.sum,
        monthlySum: monthlyPayment,
        remainedSum: data.sum
      },
      include: {
        Debtor: true,
      },
    });

    if (data.images && data.images.length > 0) {
      await Promise.all(
        data.images.map(async (item) => {
          await this.prisma.nasiyaImage.create({
            data: {
              nasiyaId: nasiya.id,
              image: item,
            },
          });
        }),
      );
    }

    const fullBorrowedProduct = await this.prisma.nasiya.findFirst({
      where: { id: nasiya.id },
      include: {
        Debtor: true,
        nasiyaImages: true,
      },
    });

    return fullBorrowedProduct;
  }



  async findAll(
    filter: string,
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: 'asc' | 'desc',
  ) {
    const take = Number(limit) || 10
    const skip = page ? (page - 1) * take : 0;

    const where: any = {};
    if (filter) {
      where.OR = [
        { name: { contains: filter, mode: 'insensitive' } },
        { phone: { contains: filter, mode: 'insensitive' } },
        { email: { contains: filter, mode: 'insensitive' } },
      ];
    }

    const orderBy: any = {};
    if (sortBy) {
      orderBy[sortBy] = sortOrder || 'asc';
    }

    const nasiya = await this.prisma.nasiya.findMany({
      where,
      skip,
      take,
      orderBy: sortBy ? orderBy : { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        startDate: true,
        period: true,
        comment: true,
        debtorId: true,
        createdAt: true,
        updatedAt: true,
        nasiyaImages: {
          select: {
            image: true
          }
        }
      },
    });

    const total = await this.prisma.nasiya.count({ where })
    return {
      data: nasiya,
      total,
      page,
      limit: take,
      totalPages: Math.ceil(total / take),
    };
  }

  async findOne(id: string) {
    const nasiya = await this.prisma.nasiya.findFirst({
      where: { id },
      include: {
        nasiyaImages: true
      }
    },
    );
    if (!nasiya) {
      throw new NotFoundException('Debt topilmadi');
    }
    return nasiya;
  }

  async update(id: string, data: UpdateNasiyaDto) {
  const existing = await this.prisma.nasiya.findFirst({ where: { id } });

  if (!existing) {
    throw new NotFoundException("Yangilamoqchi bo'lgan nasiya topilmadi");
  }

  if (data.debtorId) {
  const debtor = await this.prisma.nasiya.findFirst({
    where: { id: data.debtorId }
  });
  if (!debtor) {
    throw new BadRequestException('Berilgan debtorId bo‘yicha qarzdor topilmadi');
  }
}


  const updated = await this.prisma.nasiya.update({
    where: { id },
    data: {
      name: data.name,
      startDate: data.startDate,
      period: data.period,
      comment: data.comment,
      Debtor: {
        connect: { id: data.debtorId }
      }
    }
  });

  return updated;
}


  async remove(id: string) {
  const existing = await this.prisma.nasiya.findFirst({ where: { id } });
  if (!existing) {
    throw new NotFoundException("O'chirmoqchi bo'lgan nasiya topilmadi");
  }

  await this.prisma.nasiyaImage.deleteMany({
    where: { nasiyaId: id }
  });

  return await this.prisma.nasiya.delete({
    where: { id }
  });
}

}
