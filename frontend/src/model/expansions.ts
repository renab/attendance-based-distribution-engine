import {useState, useEffect} from 'react';
import axios from 'axios';
import { User } from 'firebase/auth';

export type CharacterClass = 'Bard' | 'Beastlord' | 'Berserker' | 'Cleric' | 'Druid' | 'Enchanter' | 'Magician' | 'Monk' | 'Necromancer' | 'Paladin' | 'Ranger' | 'Rogue' | 'Shadow Knight' | 'Shaman' | 'Warrior' | 'Wizard';

export type Character = {
    id: string;
    Name: string;
    DKP: number;
    Thirty: number;
    Sixty: number;
    Ninety: number;
    Alltime: number;
}

export type CharacterKeys = {
    name: string;
    keys: { main: boolean; box: boolean };
}

export type CharacterSpellRunes = {
    name: string;
    count: number;
}

export type Key = {
    name: string;
    charactersWithKey: Array<CharacterKeys>;
}

export type ClassSpellCount = {
    class: CharacterClass;
    count: number;
}

export type SpellRune = {
    name: string;
    classesThatNeed: Array<ClassSpellCount>;
    charactersWithRune: Array<CharacterSpellRunes>;
}

export type Expansion = {
    name: string;
    keys: Array<Key>;
    spells: Array<SpellRune>;
}

const baseUrl = '/api/expansions';

export const fetchExpansionsHook = (): [Array<Expansion>, React.Dispatch<React.SetStateAction<Array<Expansion>>>] => {
    const [expansions, setExpansions] = useState<Array<Expansion>>([]);
    useEffect(() => {
        axios.get(baseUrl).then((response) => {
            setExpansions(response.data);
        }).catch((err) => {
            console.error(err);
        });
    }, []);
    if (!expansions) return [[], setExpansions];
    return [expansions, setExpansions];
}

export const fetchExpansionsCountHook = () => {
    const [expansions, setExpansions] = useState<number>(-1);
    useEffect(() => {
        axios.get(baseUrl).then((response) => {
            setExpansions(response.data.length);
        }).catch((err) => {
            console.error(err);
        });
    }, []);
    if (!expansions) return null;
    return expansions;
}

export const updateExpansions = (user: User, expansions: Array<Expansion>): Promise<Array<Expansion> | null> => {
    return new Promise<Array<Expansion> | null>((resolve, reject) => {
        if (user) {
            user.getIdToken(false).then((token) => {
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };
                axios.put(`${baseUrl}/1`, expansions, config).then((response) => {
                    resolve(response.data);
                }).catch((err) => {
                    reject(err);
                });
            })
        }
        else
        {
            reject('No logged in user');
        }
    });
}