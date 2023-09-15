import { Injectable } from '@nestjs/common';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { UpdateReactionDto } from './dto/update-reaction.dto';
import { Reaction } from './entities/reaction.entity';
import { InjectRepository, Repository } from '@app/typedorm';
import { Status } from '../statuses/entities/status.entity';

@Injectable()
export class ReactionsService {
  constructor(
    @InjectRepository(Reaction)
    private reactionsRepository: Repository<Reaction>,
    @InjectRepository(Status)
    private statusesRepository: Repository<Status>,
  ) {}

  async create(
    statusId: string,
    username: string,
    dto: CreateReactionDto,
  ): Promise<Reaction> {
    await this.statusesRepository.findOne(
      { id: statusId },
      { queryIndex: 'GSI1' },
    );

    const reaction = Reaction.create(dto.content, username, statusId);
    const item = await this.reactionsRepository.create(reaction);
    return item;
  }

  async findAll(statusId: string): Promise<Reaction[]> {
    const { items } = await this.reactionsRepository.find({ statusId });
    return items;
  }

  async findByUsername(statusId: string, createdBy: string): Promise<Reaction> {
    const reaction = await this.reactionsRepository.findOne({
      statusId,
      createdBy,
    });
    return reaction;
  }

  async findOne(statusId: string, id: string): Promise<Reaction> {
    const reaction = await this.reactionsRepository.findOne(
      { statusId, id },
      { queryIndex: 'LSI1' },
    );
    return reaction;
  }

  async update(
    statusId: string,
    id: string,
    dto: UpdateReactionDto,
  ): Promise<Reaction> {
    const newReaction = await this.reactionsRepository.update(
      { statusId, id },
      { content: dto.content },
    );
    return newReaction;
  }

  async remove(statusId: string, id: string): Promise<boolean> {
    const exists = await this.reactionsRepository.exists({ id, statusId });
    if (!exists) return false;

    const { success } = await this.reactionsRepository.delete({ statusId, id });
    return success;
  }
}
