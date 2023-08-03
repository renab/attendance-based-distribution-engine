import { Controller, Get, Render } from '@nestjs/common';
import { CharacterService } from './character.service';

@Controller('/api/characters')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Get('')
  async getAll() {
    const characters = await this.characterService.findOne('1');
    return characters?.characters ? characters.characters : [];
  }

}