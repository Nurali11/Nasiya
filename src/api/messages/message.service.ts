import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
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
        message: "Successfully created",
        data: message,
      }
    } catch (error) {
      throw new BadRequestException(
        `Error creating message: ${error.message}`,
      );
    }
  }

  async findAll(filter: string, debtorId?: string, userId?: string, page = 1, limit = 10, sellerId?: string) {
    try {
      const where: any = { sellerId: userId };
      if (filter) {
        where.message = {
          contains: filter,
          mode: 'insensitive',
        };
      }

      where.sellerId = sellerId || userId

      const messages = await this.prisma.message.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      })

      const total = debtorId
        ? await this.prisma.message.count({
            where: { ...where, debtorId },
          })
        : await this.prisma.debtor.count({ where: { sellerId: userId } });

      return {
        message: "Messages fetched successfully",
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
