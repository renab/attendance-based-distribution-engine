import { Collection } from 'fireorm';
import { CharacterClass } from '../../../common/types';

//@Collection()
export class Character {
    id!: string;
    Name!: string;
    Class!: CharacterClass;
    DKP!: number;
    Thirty!: number;
    Sixty!: number;
    Ninety!: number;
    AllTime!: number;
}

@Collection()
export class Characters {
    id!: string;
    characters!: Array<Character>;
}