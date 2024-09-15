import { JWT } from 'google-auth-library';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { ConfigService } from '@nestjs/config';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Character } from './model/character.schema';
import { CharacterClass } from 'src/common/types';
// import axios from 'axios';
import { CharacterService } from './character.service';

@Injectable()
export class CharacterUpdaterService {
  private readonly logger = new Logger(CharacterUpdaterService.name);
  static config: ConfigService;

  constructor(config: ConfigService) {
    CharacterUpdaterService.config = config;
  }

  @Inject(CharacterService)
  private readonly characterService: CharacterService;

  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    const data = await this.getCharacterData();
    const firebaseCompatibleData = JSON.parse(JSON.stringify(data));
    if (data && Array.isArray(firebaseCompatibleData)) {
      this.characterService.insertOrUpdate({ id: '1', characters: firebaseCompatibleData });
    }
  }
  
  async getCharacterData(): Promise<Array<Character> | null> { 
    const characterMap: Map<string, Character> = new Map();
    try {

      const serviceAccountAuth = new JWT({
        email:  CharacterUpdaterService.config.get('GOOGLE_API_EMAIL'),
        key:    CharacterUpdaterService.config.get('GOOGLE_API_KEY'),
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      const doc = new GoogleSpreadsheet(CharacterUpdaterService.config.get('GOOGLE_SHEET_ID'), serviceAccountAuth);

      await doc.loadInfo();

      const rosterSheet = doc.sheetsByTitle[CharacterUpdaterService.config.get('GOOGLE_SHEET_ROSTER_TITLE')];
      const attendanceSheet = doc.sheetsByTitle[CharacterUpdaterService.config.get('GOOGLE_SHEET_ATTENDANCE_TITLE')];
      const dkpSheet = doc.sheetsByTitle[CharacterUpdaterService.config.get('GOOGLE_SHEET_DKP_TITLE')];

      await rosterSheet.loadCells();
      for (let i = 0; i < rosterSheet.rowCount; i++) {
        const charName = rosterSheet.getCell(i, 0).value as string;
        if (charName === null || charName === undefined) continue;
        const alt = rosterSheet.getCell(i, 4).value as string;
        if (alt === 'A' || characterMap.has(charName)) continue;
        let character = new Character();
        character.Name = charName;
        character.Class = rosterSheet.getCell(i, 2).value as CharacterClass;
        character.Thirty = 0;
        character.Sixty = 0;
        character.Ninety = 0;
        character.AllTime = 0;
        character.DKP = 0;
        characterMap.set(charName, character);
      }

      await attendanceSheet.loadCells();
      for (let i = 0; i < attendanceSheet.rowCount; i++) {
        let charName = attendanceSheet.getCell(i, 1).value as string;
        if (characterMap.has(charName)) {
          const character30 = characterMap.get(charName);
          character30.Thirty = attendanceSheet.getCell(i, 2).value as number;
        }
        charName = attendanceSheet.getCell(i, 6).value as string;
        if (characterMap.has(charName)) {
          const character60 = characterMap.get(charName);
          character60.Sixty = attendanceSheet.getCell(i, 7).value as number;
        }
        charName = attendanceSheet.getCell(i, 11).value as string;
        if (characterMap.has(charName)) {
          const character90 = characterMap.get(charName);
          character90.Ninety = attendanceSheet.getCell(i, 12).value as number;
        }
        charName = attendanceSheet.getCell(i, 16).value as string;
        if (characterMap.has(charName)) {
          const characterAll = characterMap.get(charName);
          characterAll.AllTime = attendanceSheet.getCell(i, 17).value as number;
        }
      }

      await dkpSheet.loadCells();
      for (let i = 0; i < dkpSheet.rowCount; i++) {
        const charName = dkpSheet.getCell(i, 2).value as string;
        if (characterMap.has(charName)) {
          const character = characterMap.get(charName);
          character.DKP = dkpSheet.getCell(i, 6).value as number;
        }
      }
    } catch (err) {
      this.logger.error(err);
      return null;
    }
    return Array.from(characterMap.values());
  }
  // async getCharacterData(): Promise<Array<Character> | null> {
  //   try {
  //     const { data, status } = await axios.get<Array<Character>>('http://vetsofnorrath.com:8081/roster/mains', {
  //       headers: {
  //         Accept: 'application/json'
  //       }
  //     });
  //     if (status === 200 && data)
  //     {
  //       return data;
  //     }
  //     else
  //     {
  //       this.logger.error(`Invalid response from upstream. Status code ${status}.`);
  //       return null;
  //     }
  //   } catch (err) {
  //     this.logger.error(err);
  //     return null;
  //   }
  // }
}
