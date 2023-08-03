import {useState, useEffect} from 'react';
import axios from 'axios';

export type Character = {
    id: string;
    Name: string;
    Class: string;
    DKP: number;
    Thirty: number;
    Sixty: number;
    Ninety: number;
    AllTime: number;
}

const baseUrl = '/api/characters';

export const fetchCharactersHook = () => {
    const [characters, setCharacters] = useState<Array<Character>>([]);
    useEffect(() => {
        axios.get(baseUrl).then((response) => {
            setCharacters(response.data);
        }).catch((err) => {
            console.error(err);
        });
    }, []);
    if (!characters) return null;
    return characters;
}

export const fetchCharacterCountHook = () => {
    const [characters, setCharacters] = useState<number>(-1);
    useEffect(() => {
        axios.get(baseUrl).then((response) => {
            setCharacters(response.data.length);
        }).catch((err) => {
            console.error(err);
        });
    }, []);
    if (!characters) return null;
    return characters;
}