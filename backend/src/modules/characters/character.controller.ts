import { Controller, Get, Put } from '@nestjs/common';
import { CharacterService } from './character.service';
import { CharacterUpdaterService } from './character.updater.service';

@Controller('/api/characters')
export class CharacterController {
  constructor(private readonly characterService: CharacterService, private readonly characterUpdater: CharacterUpdaterService) {}

  @Get('')
  async getAll() {
    const characters = await this.characterService.findOne('1');
    return characters?.characters ? characters.characters : [];
  }

  @Put('')
  async updateCharacters() {
    return await this.characterUpdater.handleCron();
  }

}
