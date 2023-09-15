import { Module } from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { ReactionsController } from './reactions.controller';
import { TypeDormModule } from '@app/typedorm';
import { Reaction } from './entities/reaction.entity';
import { Status } from '../statuses/entities/status.entity';

@Module({
  imports: [TypeDormModule.forFeature([Reaction, Status])],
  controllers: [ReactionsController],
  providers: [ReactionsService],
})
export class ReactionsModule {}
