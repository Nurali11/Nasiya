import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { FilterDto } from 'src/common/dto/filter.dto';
import { PrismaService } from 'src/core/entity/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateMessageDto, userId: string) {
    try {
      const debtor = await this.prisma.debtor.findFirst({
        where: { id: data.debtorId },
      });
      if (!debtor) throw new BadRequestException('debtor not found');

      const message = await this.prisma.message.create({
        data: { ...data, isSend: true, sellerId: userId },
      });

      return {
        message: "Createds",
        data: message,
      }
    } catch (error) {
      throw new BadRequestException(
        `Error creating message: ${error.message}`,
      );
    }
  }

  async findAll(filter: FilterDto, debtorId?: string, userId?: string) {
    try {
      const { limit = 10, page = 1, search } = filter;
      const where: any = { sellerId: userId };

      if (search) {
        where.message = {
          contains: search,
          mode: 'insensitive',
        };
      }

      let messages: any;

      if (debtorId) {
        messages = await this.prisma.message.findMany({
          where: { ...where, debtorId },
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { createdAt: 'desc' },
        });
      } else {
        messages = await this.prisma.debtor.findMany({
          where: { sellerId: userId },
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            Message: {
              take: 1,
              orderBy: { createdAt: 'desc' },
            },
            Phone: true
          },
        });
      }

      const total = debtorId
        ? await this.prisma.message.count({
            where: { ...where, debtorId },
          })
        : await this.prisma.debtor.count({ where: { sellerId: userId } });

      return {
        message: "Create Message",
        data: messages,
        total,
        page,
        limit,
      };
    } catch (error) {
      throw new BadRequestException(
        `Error fetching messages: ${error.message}`,
      );
    }
  }

  async findOne(id: string) {
    try {
      const message = await this.prisma.message.findFirst({
        where: { id },
        include: { debtor: true, Seller: true },
      });
      if (!message)
        throw new BadRequestException('Notification not found');

      return {
        data: message
      }
    } catch (error) {
      throw new BadRequestException(
        `Error fetching message: ${error.message}`,
      );
    }
  }

  async update(
    id: string,
    data: UpdateMessageDto,
    userId: string,
  ) {
    try {
      const message = await this.prisma.message.findFirst({
        where: { id },
      });
      if (!message)
        throw new BadRequestException('message not found');
      if (message.sellerId !== userId)
        throw new ForbiddenException('Access denied');

      const updated = await this.prisma.message.update({
        where: { id },
        data: { text: data.text },
      });

      return {
        message: "Updated",
        data: updated
      }
    } catch (error) {
      throw new BadRequestException(
        `Error updating message: ${error.message}`,
      );
    }
  }

  async remove(id: string, userId: string) {
    try {
      const message = await this.prisma.message.findFirst({
        where: { id },
      });
      if (!message)
        throw new BadRequestException('message not found');
      if (message.sellerId !== userId)
        throw new ForbiddenException('Access denied');

      let deleted = await this.prisma.message.delete({ where: { id } });

      return {
        message: "Deleted",
        data: deleted
      }
    } catch (error) {
      throw new BadRequestException(
        `Error deleting message: ${error.message}`,
      );
    }
  }
}
