import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {totp} from "otplib"
import { PrismaService } from 'src/core/entity/prisma.service';

totp.options = {
  digits: 5,
  step: 300,
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly jwt: JwtService,
  ) { }

  async register(data: CreateAuthDto) {
    const existing = await this.prisma.admin.findFirst({
      where: { email: data.email },
    })
    if (existing) {
      throw new UnauthorizedException('Bu emaildan ADMIN bor');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.admin.create({
      data: {
        ...data,
        password: hashedPassword
      },
    });
  }

  async login(data: LoginAuthDto) {
    const admin = await this.prisma.admin.findFirst({
      where: { email: data.email },
    });

    if (!admin) {
      throw new UnauthorizedException('Admin not found');
    }

    const check = bcrypt.compareSync(data.password, admin.password);

    if (!check) {
      throw new UnauthorizedException("Parol notogri");
    }

    const token = this.jwt.sign({ id: admin.id, role: "ADMIN", email: admin.email });
    return { access_token: token };
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

     const query: any = {};
    if (filter) {
      query.OR = [{ name: { contains: filter, mode: 'insensitive' } }, { email: { contains: filter, mode: 'insensitive' } }, { phone: { contains: filter, mode: 'insensitive' } },];
    }

     const sort: any = {};
    if (sortBy) {
      sort[sortBy] = sortOrder || 'asc';
    }

    const user = await this.prisma.admin.findMany({
      where: query,
      skip,
      take,
      orderBy: sortBy ? sort : { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        phone: true,
        password: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

     const total = await this.prisma.admin.count({ where: query });

    return {
      data: user,
      total,
      page,
      limit: take,
      totalPages: Math.ceil(total / take),
    };
  }

  async singleAdmin(id: string) {
    const admin = await this.prisma.admin.findFirst({ where: { id } });

    if (!admin) {
      throw new NotFoundException('Admin topilmadi');
    }

    return admin;
  }

  async updateAdmin(id: string, data: UpdateAuthDto) {
    const admin = await this.prisma.admin.findFirst({ where: { id } });

    if (!admin) {
      throw new NotFoundException('Admin topilmadi');
    }

    return this.prisma.admin.update({
      where: { id },
      data,
    });
  }

  async deleteAdmin(id: string) {
    const admin = await this.prisma.admin.findFirst({ where: { id } });

    if (!admin) {
      throw new NotFoundException('Admin topilmadi');
    }

    return this.prisma.admin.delete({ where: { id } });
  }
}
