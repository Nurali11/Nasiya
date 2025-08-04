import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginSellerDto } from './dto/login-seller.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { VerifyOtpDto } from './dto/verifyOtp.dto';
import { ResetRequestDto } from './dto/reset-request.dto';
import { RefreshTokenDto } from './dto/refreshtokenDto';
import { MailService } from '../../common/mail/mail.service';
import {totp} from "otplib"
import { PrismaService } from 'src/core/entity/prisma.service';
totp.options = {
  digits: 5,
  step: 300,
}
@Injectable()
export class SellerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly mailService: MailService

  ) { }

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

    const sellers = await this.prisma.seller.findMany({
      where,
      skip,
      take,
      orderBy: sortBy ? orderBy : { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        phone: true,
        password: true,
        email: true,
        balance: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const total = await this.prisma.seller.count({ where });

    return {
      data: sellers,
      total,
      page,
      limit: take,
      totalPages: Math.ceil(total / take),
    };
  }

  async post(data: CreateSellerDto) {
    try {
      let existing = await this.prisma.seller.findUnique({ where: { email: data.email } });
      if (existing) throw new BadRequestException('Bu emaildan foydalanuvchi bor');

      const hashedPassword = await bcrypt.hash(data.password, 10);
      let seller = await this.prisma.seller.create({
        data: {
          ...data,
          image: data.image,
          password: hashedPassword,
        }
      })

      return {
        message: "Successfully created",
        data: seller
      }
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async login(data: LoginSellerDto) {
    console.log(data);

    const { email, password } = data;
    let seller = await this.prisma.seller.findUnique({ where: { email } });
    if (!seller) throw new NotFoundException('seller not found');

    let match = bcrypt.compareSync(password, seller.password);
    if (!match) throw new NotFoundException('wrong password');

    let token = this.jwt.sign({ id: seller.id, role: "SELLER", email: seller.email });
    return { token };
  }

  async verifyOtp(data: VerifyOtpDto) {
    const { email, otp } = data;
    const seller = await this.prisma.seller.findUnique({ where: { email } });
    if (!seller) throw new NotFoundException('User not found');
    
    await this.prisma.seller.update({
      where: { email },
      data: { active: "ACTIVE" },
    });

    return { message: 'OTP tasdiqlandi' };
  }

  async resetPassword(data: ResetPasswordDto) {
    const { email, newPassword } = data;
    const seller = await this.prisma.seller.findUnique({ where: { email } });
    if (!seller) throw new NotFoundException('User not found');

    if (seller.active == "PENDING")
      return  new UnauthorizedException('OTP tasdig‘i talab qilinadi');

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.seller.update({
      where: { email },
      data: {
        password: hashedPassword,
        active: "ACTIVE",
      },
    });

    return { message: 'Parol muvaffaqiyatli o‘zgartirildi' };
  }

  async getAccessToken(user: any) {
    return this.jwt.sign(
      {
        id: user.id,
        fullname: user.fullname,
        role: user.role,
        email: user.email,
        password: user.password,
        phone: user.phone,
      },
      { expiresIn: '1h' },
    );
  }

  async refreshToken(dto: RefreshTokenDto) {
    try {
      const user = this.jwt.verify(dto.refreshToken);

      return { accessToken: await this.getAccessToken(user) };
    } catch (error) {
      throw new BadRequestException('Invalid refresh token');
    }
  }

  async update(id: string, data: UpdateSellerDto) {
    try {
      const existing = await this.prisma.seller.findUnique({ where: { id } });
      if (!existing) {
        throw new NotFoundException('Yangilamoqchi bo‘lgan seller topilmadi');
      }

      if (data.password) {
        const salt = await bcrypt.genSalt(10);
        data.password = await bcrypt.hash(data.password, salt);
      }

      return await this.prisma.seller.update({ where: { id }, data });
    } catch (error) {
      throw new BadRequestException('Yangilashda xatolik: ' + error.message);
    }
  }

   async payment(sum: number, sellerId: string) {
    const seller = await this.prisma.seller.findUnique({
      where: { id: sellerId },
      select: { balance: true },
    });

    if (!seller) {
      throw new NotFoundException('Seller topilmadi');
    }

    const updatedSeller = await this.prisma.seller.update({
      where: { id: sellerId },
      data: {
        balance: seller.balance + sum,
      },
    });

    return {
      message: 'Hisobingiz muvaffaqiyatli to‘ldirildi',
      balance: updatedSeller.balance,
    };
  }

  async remove(id: string) {
    const seller = await this.prisma.seller.findUnique({
      where: { id },
    });

    if (!seller) throw new NotFoundException('Seller not found');

    const deleted = await this.prisma.seller.delete({
      where: { id },
    });

    return { message: "This seller deleted", deleted };
  }
}