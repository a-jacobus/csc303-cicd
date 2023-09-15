import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { UpdateReactionDto } from './dto/update-reaction.dto';
import { ParseULIDPipe } from '../utils/ulid.pipe';
import { Reaction } from './entities/reaction.entity';
import { ItemDoesNotExist } from '@app/typedorm';

@Controller(':statusId/reactions')
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Post()
  create(
    @Param('statusId', ParseULIDPipe) statusId: string,
    @Body() createReactionDto: CreateReactionDto,
  ): Promise<Reaction> {
    return this.reactionsService.create(
      statusId,
      'synthsym',
      createReactionDto,
    );
  }

  @Get()
  findAll(
    @Param('statusId', ParseULIDPipe) statusId: string,
    @Query('username') username: string,
  ): Promise<Reaction | Reaction[]> {
    if (username) {
      return this.reactionsService.findByUsername(statusId, username);
    }
    return this.reactionsService.findAll(statusId);
  }

  @Get(':id')
  async findOne(
    @Param('statusId', ParseULIDPipe) statusId: string,
    @Param('id', ParseULIDPipe) id: string,
  ): Promise<Reaction> {
    try {
      const reaction = await this.reactionsService.findOne(statusId, id);
      return reaction;
    } catch (e) {
      if (e instanceof ItemDoesNotExist) {
        throw new NotFoundException();
      }
      throw e;
    }
  }

  @Patch(':id')
  update(
    @Param('statusId', ParseULIDPipe) statusId: string,
    @Param('id', ParseULIDPipe) id: string,
    @Body() updateReactionDto: UpdateReactionDto,
  ): Promise<Reaction> {
    return this.reactionsService.update(statusId, id, updateReactionDto);
  }

  @Delete(':id')
  remove(
    @Param('statusId', ParseULIDPipe) statusId: string,
    @Param('id', ParseULIDPipe) id: string,
  ) {
    return this.reactionsService.remove(statusId, id);
  }
}
