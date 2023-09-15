import { Module } from '@nestjs/common';
import { StatusesController } from './statuses.controller';
import { StatusesService } from './statuses.service';
import { TypeDormModule } from '@app/typedorm';
import { Status } from './entities/status.entity';

@Module({
  imports: [TypeDormModule.forFeature([Status])],
  controllers: [StatusesController],
  providers: [StatusesService],
})
export class StatusesModule {}
