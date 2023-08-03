import { Module } from '@nestjs/common';
import { FireormModule } from 'nestjs-fireorm';
import { Expansions } from './model/expansion.schema';
import { ExpansionService } from './expansion.service';
import { ExpansionController } from './expansion.controller';

@Module({
  imports: [FireormModule.forFeature([Expansions])],
  providers: [ExpansionService],
  controllers: [ExpansionController],
  exports: [ExpansionService],
})
export class ExpansionModule {}