import { Module } from '@nestjs/common';
import { FireormModule } from 'nestjs-fireorm';
import { Characters } from './model/character.schema';
import { CharacterService } from './character.service';
import { CharacterUpdaterService } from './character.updater.service';
import { CharacterController } from './character.controller';

@Module({
  imports: [FireormModule.forFeature([Characters])],
  providers: [CharacterService, CharacterUpdaterService],
  controllers: [CharacterController],
  exports: [CharacterService, CharacterUpdaterService],
})
export class CharacterModule {}