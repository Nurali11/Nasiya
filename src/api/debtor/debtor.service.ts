import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateDebtorDto } from './dto/create-debtor.dto';
import { UpdateDebtorDto } from './dto/update-debtor.dto';
import { PrismaService } from 'src/core/entity/prisma.service';

@Injectable()
export class DebtorService {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: CreateDebtorDto, sellerId: string) {
    try {
      const newDebtor = await this.prisma.debtor.create({
        data: {
          name: data.name,
          address: data.address,
          comment: data.comment,
          Seller: {
            connect: { id: sellerId }
          },
        },
      });
      if (data.images && data.images.length > 0) {
        for (const image of data.images) {
          await this.prisma.debtorImage.create({
            data: {
              debtorId: newDebtor.id,
              image: image,
              sellerId
            }
          })
        }
      }

      if (data.phoneNumbers && data.phoneNumbers.length > 0) {
        for (const number of data.phoneNumbers) {
          await this.prisma.debtorPhone.create({
            data: {
              debtorId: newDebtor.id,
              phone: number
            }
          })
        }
      }
      let debtor = await this.prisma.debtor.findUnique({ where: { id: newDebtor.id }, include: { Images: true, Phone: true } });
      return debtor

    } catch (error) {
      throw new BadRequestException('Yaratishda xatolik: ' + error.message);
    }
  }

  async findAll(
    phone: string,
    sellerId: string,
    address: string,
    filter: string,
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: 'asc' | 'desc',
  ) {
    try {
      const take = Number(limit) || 10
      const skip = page ? (page - 1) * take : 0;

      const where: any = {};
      if (filter) {
        where.OR = [
          { name: { contains: filter, mode: 'insensitive' } },
        ];
      }

      if (phone) {
        where.OR = [
          { Phone: { some: { phone: { contains: phone, mode: 'insensitive' } } } },
        ]
      }

      if (sellerId) {
        where.sellerId = sellerId
      }

      if (address) {
        where.OR = [
          { address: { contains: address, mode: 'insensitive' } },
        ]
      }

      const orderBy: any = {};
      if (sortBy) {
        orderBy[sortBy] = sortOrder || 'asc';
      }

      const debtor = await this.prisma.debtor.findMany({
        select: {
          id: true,
          name: true,
          address: true,
          comment: true,
          star: true,
          createdAt: true,
          updatedAt: true,
          Images: {
            select: {
              image: true
            }
          },
          Phone: {
            select: {
              phone: true
            }
          },
          PaymentHistory: {
            select: {
              amount: true,
              createAt: true
            }
          },
          Nasiya: true
        },
        where,
        skip,
        take,
        orderBy: sortBy ? orderBy : { createdAt: 'desc' },
      });

      const withTotal = debtor.map((debtor) => {
        let total = debtor.Nasiya ? debtor.Nasiya.reduce((total, nasiya) => total + nasiya.remainedSum, 0) : 0;
        return {
          ...debtor,
          total
        }
      });

      const total = await this.prisma.debtor.count({ where });

      return {
        data: withTotal,
        total,
        page,
        limit: take,
        totalPages: Math.ceil(total / take),
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string) {
    try {
      const debtor = await this.prisma.debtor.findUnique({
        where: { id },
        include: {
          Images: true,
          Phone: true,
          Message: true,
          Nasiya: {
            include: { PaidMonths: true }
          },
          PaymentHistory: true,
          Payment: true,
          Seller: true,
        }
      }
        
      );
      if (!debtor) {
        throw new NotFoundException('Bunday IDga ega qarzdor topilmadi');
      }

      const withTotal = {
        ...debtor,
        total: debtor.Nasiya ? debtor.Nasiya.reduce((total, nasiya) => total + nasiya.remainedSum, 0) : 0,
      };

      return withTotal;
    } catch (error) {
      throw new BadRequestException('Topishda xatolik: ' + error.message);
    }
  }

  async update(id: string, data: UpdateDebtorDto) {
  try {
    const existing = await this.prisma.debtor.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Yangilamoqchi bo\'lgan qarzdor topilmadi');
    }

    if (data.images && data.images.length > 0) {
      await this.prisma.debtorImage.deleteMany({
        where: {
          debtorId: id
        }
      });
      for (let i of data.images) {
        await this.prisma.debtorImage.create({
          data: {
            debtorId: id,
            image: i
          }
        })
      }
    }

    if (data.phoneNumbers && data.phoneNumbers.length > 0) {
      await this.prisma.debtorPhone.deleteMany({
        where: {
          debtorId: id,
        }
      });
      for (let i of data.phoneNumbers) {
        await this.prisma.debtorPhone.create({
          data: {
            debtorId: id,
            phone: i
          }
        })
      }
    }

    const { images, phoneNumbers, ...debtorFields } = data;

    return await this.prisma.debtor.update({
      where: { id },
      data: debtorFields,
      include: {
        Images: true,
        Phone: true
      }
    });
  } catch (error) {
    throw new BadRequestException('Yangilashda xatolik: ' + error.message);
  }
}


  async remove(id: string) {
    try {
      const existing = await this.prisma.debtor.findUnique({ where: { id } });
      if (!existing) {
        throw new NotFoundException('O\'chirilmoqchi bo\'lgan qarzdor topilmadi');
      }
      const debts = await this.prisma.nasiya.findMany({
        where: { debtorId: id },
      });

      if (debts.length > 0) {
        await this.prisma.nasiya.deleteMany({
          where: {
            debtorId: id
          }
        })
      }

      await this.prisma.debtorImage.deleteMany({
        where: { debtorId: id }
      })

      await this.prisma.debtorPhone.deleteMany({
        where: { debtorId: id }
      })

      return await this.prisma.debtor.delete({ where: { id } });
    } catch (error) {
      throw new BadRequestException('O\'chirishda xatolik: ' + error.message);
    }
  }
}
