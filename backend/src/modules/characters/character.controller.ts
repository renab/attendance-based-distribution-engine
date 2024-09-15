import { Controller, Get, Logger, Put } from '@nestjs/common';
import { CharacterService } from './character.service';
import { CharacterUpdaterService } from './character.updater.service';

@Controller('/api/characters')
export class CharacterController {
  private readonly logger = new Logger(CharacterUpdaterService.name);
  constructor(private readonly characterService: CharacterService, private readonly characterUpdater: CharacterUpdaterService) {}

  @Get('')
  async getAll() {
    const characters = await this.characterService.findOne('1');
    return characters?.characters ? characters.characters : [];
  }

  @Put('')
  async updateCharacters() {
    const start = new Date().getTime();
    this.logger.log("Character Update Requested");
    this.characterUpdater.handleCron().then(() => {
      const end = new Date().getTime();
      this.logger.log(`Character Update completed in ${(end - start) / 1000} seconds.`);
    });
    return { status: 'success', message: 'Character Data update initiated.' };
  }

}
