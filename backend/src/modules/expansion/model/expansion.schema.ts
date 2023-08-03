import { Collection } from 'fireorm';
import { CharacterClass } from '../../../common/types';

export class CharacterKeys {
    name!: string;
    keys!: { main: boolean; box: boolean };
}

export class Key {
    name!: string;
    charactersWithKey!: Array<CharacterKeys>;
}

export class ClassSpellCount {
    class!: CharacterClass;
    count!: number;
}

export class CharacterSpellRunes {
    name!: string;
    count!: number;
}

export class SpellRune {
    name!: string;
    classesThatNeed!: Array<ClassSpellCount>;
    charactersWithRune!: Array<CharacterSpellRunes>;
}

export class Expansion {
    id!: string;
    name!: string;
    keys!: Array<Key>;
    spells!: Array<SpellRune>;
}

@Collection()
export class Expansions {
    id: string;
    expansions!: Array<Expansion>;
}