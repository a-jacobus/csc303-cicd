import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { StatusesService } from './statuses.service';
import { Status } from './entities/status.entity';
import { CreateStatusDTO } from './dto/create-status.dto';
import { ParseULIDPipe } from '../utils/ulid.pipe';
import { ItemDoesNotExist } from '@app/typedorm';

@Controller()
export class StatusesController {
  constructor(private readonly statusesService: StatusesService) {}

  @Get()
  async findAll(@Query('username') username?: string): Promise<Status[]> {
    if (username === undefined) throw new BadRequestException();
    return this.statusesService.findStatusesByUser(username);
  }

  @Post()
  async create(@Body(ValidationPipe) body: CreateStatusDTO): Promise<Status> {
    return this.statusesService.createStatus('synthsym', body);
  }

  @Get(':id')
  async findOne(@Param('id', ParseULIDPipe) id: string): Promise<Status> {
    try {
      const status = await this.statusesService.getStatus(id);
      return status;
    } catch (e) {
      if (e instanceof ItemDoesNotExist) {
        throw new NotFoundException();
      }
      throw e;
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseULIDPipe) id: string) {
    const res = await this.statusesService.deleteStatus(id, 'synthsym');
    console.log('Delete status result', res);
    if (!res) throw new NotFoundException();
  }
}
