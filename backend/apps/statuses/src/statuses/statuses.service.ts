import { Injectable } from '@nestjs/common';
import { Status } from './entities/status.entity';
import { CreateStatusDTO } from './dto/create-status.dto';
import { InjectRepository, Repository } from '@app/typedorm';

@Injectable()
export class StatusesService {
  constructor(
    @InjectRepository(Status)
    private statusesRepository: Repository<Status>,
  ) {}

  async findStatusesByUser(username: string): Promise<Status[]> {
    const { items } = await this.statusesRepository.find(
      {
        createdBy: username,
      },
      {
        queryIndex: 'GSI1',
      },
    );
    return items;
  }

  async createStatus(username: string, dto: CreateStatusDTO): Promise<Status> {
    const status = Status.create(dto.content, username);
    const item = await this.statusesRepository.create(status);
    return item;
  }

  async getStatus(id: string): Promise<Status> {
    const item = await this.statusesRepository.findOne({
      id,
    });
    return item;
  }

  async deleteStatus(id: string, createdBy: string): Promise<boolean> {
    const exists = await this.statusesRepository.exists({ id, createdBy });
    if (!exists) return false;

    const { success } = await this.statusesRepository.delete({
      id,
      createdBy,
    });
    return success;
  }
}
