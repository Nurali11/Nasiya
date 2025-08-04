import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateSampleDto } from './dto/create-sample.dto';
import { UpdateSampleDto } from './dto/update-sample.dto';
import { SampleFilterDto } from './dto/sample-filter.dto';
import { PrismaService } from 'src/core/entity/prisma.service';

@Injectable()
export class SampleService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSampleDto: CreateSampleDto, userId: string) {
    try {
      const seller = await this.prisma.seller.findFirst({ where: { id: userId } });
      if (!seller) throw new BadRequestException('seller not found');

      const sample = await this.prisma.sample.create({
        data: { ...createSampleDto, isActive: true, sellerId: userId },
      });

      return {
        message: 'Sample created',
        data: sample,
      }
    } catch (error) {
      throw new BadRequestException(`Error creating sample: ${error.message}`);
    }
  }

  async findAll(filter: SampleFilterDto, userId: string) {
    try {
      const { search, status, page = 1, limit = 10, sortBy, sortOrder } = filter;
      const sortField = sortBy ?? 'createdAt';
      const direction = sortOrder ?? 'desc';

      const where: any = {sellerId: userId};

      if (search) {
        where.text = { contains: search, mode: 'insensitive' };
      }

      if (typeof status === 'boolean') {
        where.status = status;
      }

      const samples = await this.prisma.sample.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          [sortField]: direction,
        },
      });

      const total = await this.prisma.sample.count({ where });

      return {
        message: "Samples fetched",
        data: samples,
        total,
        page,
        limit,
      };
    } catch (error) {
      throw new BadRequestException(`Error fetching samples: ${error.message}`);
    }
  }

  async findOne(id: string) {
    try {
      const sample = await this.prisma.sample.findFirst({ where: { id } });
      if (!sample) throw new BadRequestException('Sample not found');

      return {
        message: "Sample fetched",
        data: sample
      }
    } catch (error) {
      throw new BadRequestException(`Error fetching sample: ${error.message}`);
    }
  }

  async update(
    id: string,
    updateSampleDto: UpdateSampleDto,
    user: { id: string; role: "ADMIN" | "SUPER_ADMIN" | "SELLER" },
  ) {
    try {
      const sample = await this.prisma.sample.findFirst({ where: { id } });
      if (!sample) throw new BadRequestException('Sample not found');

      if (
        sample.sellerId !== user.id
      ) {
        throw new ForbiddenException('Access denied');
      }

      const updated = await this.prisma.sample.update({
        where: { id },
        data: updateSampleDto,
      });

      return {
        message: "Sample updated",
        data: updated
      }
    } catch (error) {
      throw new BadRequestException(`Error updating sample: ${error.message}`);
    }
  }

  async remove(id: string, user: { id: string; role: "ADMIN" | "SUPER_ADMIN" | "SELLER" }) {
    try {
      const sample = await this.prisma.sample.findFirst({ where: { id } });
      if (!sample) throw new BadRequestException('Sample not found');

      if (
        sample.sellerId !== user.id
      ) {
        throw new ForbiddenException('Access denied');
      }

      let deleted = await this.prisma.sample.delete({ where: { id } });

      return {
        message: "Sample deleted",
        data: deleted
      }
    } catch (error) {
      throw new BadRequestException(`Error deleting sample: ${error.message}`);
    }
  }
}
