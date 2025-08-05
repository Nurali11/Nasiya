import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Query } from '@nestjs/common';
import { SampleService } from './sample.service';
import { CreateSampleDto } from './dto/create-sample.dto';
import { UpdateSampleDto } from './dto/update-sample.dto';
import { Request } from 'express';
import { ApiQuery } from '@nestjs/swagger';
import { SampleFilterDto } from './dto/sample-filter.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesD } from 'src/common/decorators/roles.decorator';
import { RoleGuard } from 'src/common/guards/role.guard';

@Controller('sample')
export class SampleController {
  constructor(private readonly sampleService: SampleService) {}

  @RolesD("SELLER")
  @UseGuards(AuthGuard, RoleGuard)
  @Post()
  create(@Body() createSampleDto: CreateSampleDto, @Req() req: Request) {
    const userId = req['user'].id;
    return this.sampleService.create(createSampleDto, userId);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiQuery({ name: "sellerId", required: false, type: String, description: 'Seller id' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search' })
  @ApiQuery({ name: 'status', required: false, type: Boolean, description: 'Status (true/false)' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'limit on page', example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['createdAt', 'text'], description: 'sort by' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], description: 'sort order' })
  findAll(@Query() query: SampleFilterDto, @Req() req: Request) {
    const userId = req['user'].id
    return this.sampleService.findAll(query, userId);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sampleService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSampleDto: UpdateSampleDto,
    @Req() req: Request,
  ) {
    const user = req['user'];
    return this.sampleService.update(id, updateSampleDto, user);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    const user = req['user'];
    return this.sampleService.remove(id, user);
  }
}