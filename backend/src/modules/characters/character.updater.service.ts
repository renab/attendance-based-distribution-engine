
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Characters, Character } from './model/character.schema';
import axios from 'axios';
import { CharacterService } from './character.service';

@Injectable()
export class CharacterUpdaterService {
  private readonly logger = new Logger(CharacterUpdaterService.name);

  @Inject(CharacterService)
  private readonly characterService: CharacterService;

  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    const data = await this.getCharacterData();
    if (data && Array.isArray(data)) {
      this.characterService.insertOrUpdate({ id: '1', characters: data });
    }
  }

  async getCharacterData(): Promise<Array<Character> | null> {
    try {
      const { data, status } = await axios.get<Array<Character>>('http://vetsofnorrath.com:8081/roster/mains', {
        headers: {
          Accept: 'application/json'
        }
      });
      if (status === 200 && data)
      {
        return data;
      }
      else
      {
        this.logger.error(`Invalid response from upstream. Status code ${status}.`);
        return null;
      }
    } catch (err) {
      this.logger.error(err);
      return null;
    }
  }
}
