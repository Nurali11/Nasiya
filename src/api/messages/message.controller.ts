import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Request } from 'express';
import { FilterDto } from 'src/common/dto/filter.dto';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UpdateMessageDto } from './dto/update-message.dto';
import { RoleGuard } from 'src/common/guards/role.guard';
import { RolesD } from 'src/common/decorators/roles.decorator';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  create(
    @Body() createNotificationDto: CreateMessageDto,
    @Req() req: Request,
  ) {
    const userId = req['user'].id;
    return this.messageService.create(createNotificationDto, userId);
  }

  @Get()
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'debtorId', required: false, type: String })
  @ApiQuery({ name: 'sellerId', required: false, type: String })
  findAll(
    @Query("search") filter: string,
    @Query("debtorId") debtorId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query("sellerId") sellerId: string,
    @Req() req: Request,
  ) {
    const userId = req['user'].id;
    return this.messageService.findAll(filter, debtorId, userId, page, limit, sellerId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('myMessages')
  myMessages(@Req() req: Request) {
    const userId = req['user'].id;
    return this.messageService.myMessages(userId);
  }

  @RolesD("SELLER")
  @UseGuards(AuthGuard, RoleGuard)
  @ApiBearerAuth()
  @Delete('deleteChat/:debtorId')
  deleteChat(@Param('debtorId') debtorid: string) {
    return this.messageService.chatDelete(debtorid);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messageService.findOne(id);
  }


  @RolesD("SELLER")
  @UseGuards(AuthGuard, RoleGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateMessageDto,
    @Req() req: Request,
  ) {
    const userId = req['user'].id;
    return this.messageService.update(id, updateNotificationDto, userId);
  }

  @RolesD("SELLER")
  @UseGuards(AuthGuard, RoleGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    const userId = req['user'].id;

    return this.messageService.remove(id, userId);
  }
}
