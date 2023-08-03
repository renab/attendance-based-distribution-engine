import { Logger, Injectable } from '@nestjs/common';
import { BaseFirestoreRepository } from 'fireorm';
import { InjectRepository } from 'nestjs-fireorm';
import { Characters } from './model/character.schema';

@Injectable()
export class CharacterService {
  private readonly logger: Logger = new Logger(CharacterService.name);
  constructor(
    @InjectRepository(Characters)
    private characters: BaseFirestoreRepository<Characters>
  ) {}

  async findOne(id: string): Promise<Characters> {
    try {
      return await this.characters.findById(id);
    } catch (err) {
      this.logger.error(err);
      return null;
    }
  }

  async findAll(): Promise<Array<Characters>> {
    try {
      return [await this.characters.findById('1')];
    } catch (err) {
      this.logger.error(err);
      return [];
    }
  }

  async insertOrUpdate(characters: Characters): Promise<Characters> {
    try {
      let ret = await this.characters.findById('1');
      if (ret) {
          await this.characters.update(characters);
      } else {
          characters = await this.characters.create(characters);
      }
      return characters;
    } catch (err) {
      this.logger.error(err);
      return null;
    }
  }

/*  async insertOrUpdateMany(characters: Array<Character>): Promise<Array<Character>> {
    try {
      const prms: Array<Promise<Character>> = [];
      const ret: Array<Character> = [];
      const batchRepository = this.characters.createBatch();
      const existingCharacters: Array<Character> = await this.characters.find();
      const existingNameMap = new Map<string, Character>();
      const incomingNameMap = new Map<string, Character>();
      for (const existing of existingCharacters)
      {
        existingNameMap.set(existing.Name, existing);
      }
      for (const character of characters)
      {
        incomingNameMap.set(character.Name, character);
        const existing = existingNameMap.get(character.Name);
        if (existing) {
          existing.DKP = character.DKP;
          existing.Thirty = character.Thirty;
          existing.Sixty = character.Sixty;
          existing.Ninety = character.Ninety;
          existing.AllTime = character.AllTime;
          batchRepository.update(existing);
          ret.push(existing);
        }
        else
        {
          batchRepository.create(character);
        }
      }
      for (const key of existingNameMap.keys())
      {
        if (!incomingNameMap.has(key))
        {
          batchRepository.delete(existingNameMap.get(key));
        }
      }
      await batchRepository.commit();
      return Array.from(incomingNameMap.values());
    } catch (err) {
      this.logger.error(err);
      return null;
    }
  }*/
}