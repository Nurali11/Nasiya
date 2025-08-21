import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseGuards, Res } from '@nestjs/common';
import { DebtService } from './debt.service';
import { CreateNasiyaDto } from './dto/create-nasiya.dto';
import { UpdateNasiyaDto } from './dto/update-nasiya.dto';
import { ApiQuery } from '@nestjs/swagger';
import { RolesD } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Request } from 'express';
import { DebtDateDto } from './dto/debt-date.dot';

@Controller('debt')
export class DebtController {
  constructor(private readonly debtService: DebtService) {}

  @RolesD("SELLER")
  @Post()
  @UseGuards(AuthGuard, RoleGuard)
  create(@Body() data: CreateNasiyaDto, @Req() res: Request) {
    return this.debtService.create(data, res);
  }

  @RolesD("SELLER")
  @UseGuards(AuthGuard, RoleGuard)
  @ApiQuery({ name: 'endDate', required: true, type: String })
  @Get("date")
  dateToday(@Query("endDate") endDate: string) {
    return this.debtService.dateFilter(endDate)
  }

  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'filter', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @Get()
  findAll(
    @Query('filter') filter: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortBy') sortBy: string,
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc',
  ) {
    return this.debtService.findAll(filter, page, limit, sortBy, sortOrder);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.debtService.findOne(id);
  }


  @RolesD("SELLER")
  @UseGuards(AuthGuard, RoleGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDebtDto: UpdateNasiyaDto) {
    console.log(updateDebtDto);

    return this.debtService.update(id, updateDebtDto);
  }

  @RolesD("SELLER")
  @UseGuards(AuthGuard, RoleGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.debtService.remove(id);
  }
}
