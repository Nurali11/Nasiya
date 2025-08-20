import { Body, Controller, Post, Get, Param, Patch, Delete, ParseUUIDPipe, Query, Req, UseGuards, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { RoleGuard } from 'src/common/guards/role.guard';
import { RolesD } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';

@ApiTags('Admin')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @RolesD('ADMIN')
  @UseGuards(AuthGuard, RoleGuard)
  @Post('register')
  register(@Body() dto: CreateAuthDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginAuthDto) {
    return this.authService.login(dto);
  }

  @ApiQuery({ name: 'filter', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @Get()
  findAll(@Query('filter') filter: string, @Query('page') page: number = 1, @Query('limit') limit: number = 10, @Query('sortBy') sortBy: string, @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc',) {
    return this.authService.findAll(filter, page, limit, sortBy, sortOrder);
  }

  @Get(':id')
  getAdmin(@Param('id') id: string) {
    return this.authService.singleAdmin(id);
  }

  @RolesD('ADMIN')
  @UseGuards(AuthGuard, RoleGuard)
  @Patch(':id')
  updateAdmin(@Param('id') id: string, @Body() dto: UpdateAuthDto,
  ) {
    return this.authService.updateAdmin(id, dto);
  }

  @RolesD('ADMIN')
  @UseGuards(AuthGuard, RoleGuard)
  @Delete(':id')
  deleteAdmin(@Param('id') id: string) {
    return this.authService.deleteAdmin(id);
  }
}
