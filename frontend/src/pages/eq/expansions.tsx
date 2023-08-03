import * as React from 'react';
import { Container, Typography, Card, Tab, Tabs, Box, Divider, Stack, Paper, SxProps, Breadcrumbs, Link } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { Expansion, Key, SpellRune, fetchExpansionsHook, updateExpansions } from '../../model/expansions';
import { AuthContext } from '../../lib/firebase';
import { User } from 'firebase/auth';
import ExpansionSidebar from '../../components/expansionSidebar';
import { Character, fetchCharactersHook } from '../../model/characters';
import { KeyTable } from '../../components/keyTable';
import ScrollInto from 'react-scroll-into-view';
import { SpellTable } from '../../components/spellTable';

function a11yProps(index: number) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
    sx?: SxProps;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
}

interface KeyBreadcrumbsProps {
    keys: Array<Key>;
    currentKey: Key;
}

function KeyBreadcrumbs(props: KeyBreadcrumbsProps) {
    const getKeysToLink = () => {
        const ret: Array<Key> = [];
        for (const key of props.keys) {
            if (key.name !== props.currentKey.name)
            {
                ret.push(key);
            }
        }
        return ret;
    }

    return (
        <Breadcrumbs sx={{pt: 0.75}} aria-label='breadcrumbs'>
            {getKeysToLink().map((key) => {
                return (
                    <Link underline='hover' color='inherit' onClick={() => { document.getElementById(key.name)?.scrollIntoView({ behavior: 'smooth' }) }}>
                        {key.name}
                    </Link>
                );
            })}            
        </Breadcrumbs>
    )
}

interface SpellBreadcrumbsProps {
    spellRunes: Array<SpellRune>;
    currentSpellRune: SpellRune;
}

function SpellBreadcrumbs(props: SpellBreadcrumbsProps) {
    const getKeysToLink = () => {
        const ret: Array<SpellRune> = [];
        for (const spellRune of props.spellRunes) {
            if (spellRune.name !== props.currentSpellRune.name)
            {
                ret.push(spellRune);
            }
        }
        return ret;
    }

    return (
        <Breadcrumbs sx={{pt: 0.75}} aria-label='breadcrumbs'>
            {getKeysToLink().map((key) => {
                return (
                    <Link underline='hover' color='inherit' onClick={() => { document.getElementById(key.name)?.scrollIntoView({ behavior: 'smooth' }) }}>
                        {key.name}
                    </Link>
                );
            })}            
        </Breadcrumbs>
    )
}

export function Expansions() {
    const { user, token } = React.useContext(AuthContext);
    const [expansions, setExpansions] = fetchExpansionsHook();
    const characters = fetchCharactersHook();
    const [expansion, setExpansion] = React.useState<Expansion | null>(null);
    const [view, setView] = React.useState<number>(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setView(newValue);
    };

    const handleUpdateKey = (expansion: Expansion, key: Key) => {
        const oldExpansions = Array.from(expansions);
        const newExpansions = Array.from(expansions);
        if (user && token?.claims.Admin === true)
        {
            for (const exp of newExpansions) {
                if (exp.name === expansion.name)
                {
                    const newKeys: Array<Key> = [];
                    for(let expKey of exp.keys)
                    {
                        if (expKey.name !== key.name)
                        {
                            newKeys.push(expKey);
                        }
                        else
                        {
                            newKeys.push(key);
                        }
                    }
                    exp.keys = newKeys;
                }
            }
            updateExpansions(user as User, newExpansions).then((expansions) => {
                setExpansions(expansions ? expansions : []);
            }).catch((err) => {
                console.error(err);
                setExpansions(oldExpansions);
            });
        }
        else
        {
            setExpansions(oldExpansions);
        }
    }

    const handleUpdateSpell = (expansion: Expansion, spellRune: SpellRune) => {
        const oldExpansions = Array.from(expansions);
        const newExpansions = Array.from(expansions);
        if (user && token?.claims.Admin === true)
        {
            for (const exp of newExpansions) {
                if (exp.name === expansion.name)
                {
                    const newSpellRunes: Array<SpellRune> = [];
                    for(let expSpellRune of exp.spells)
                    {
                        if (expSpellRune.name !== spellRune.name)
                        {
                            newSpellRunes.push(expSpellRune);
                        }
                        else
                        {
                            newSpellRunes.push(spellRune);
                        }
                    }
                    exp.spells = newSpellRunes;
                }
            }
            updateExpansions(user as User, newExpansions).then((expansions) => {
                setExpansions(expansions ? expansions : []);
            }).catch((err) => {
                console.error(err);
                setExpansions(oldExpansions);
            });
        }
        else
        {
            setExpansions(oldExpansions);
        }
    }

    const renderKeysPane = (key: Key, characters: Array<Character>, expansion: Expansion) => {
        return (
            <Paper id={key.name} sx={{ width: 1030 }}>
                <Stack spacing={1} sx={{p: 2}}>
                    <Stack spacing={1} direction='row'>
                        <Typography variant='h6'>{key.name}</Typography>
                        <KeyBreadcrumbs keys={expansion.keys} currentKey={key}/>
                    </Stack>
                    <KeyTable expansionKey={key} characters={characters} updateHandler={(key) => handleUpdateKey(expansion, key) }/>
                </Stack>
            </Paper>
        );
    }

    const renderSpellRunePane = (spellRune: SpellRune, characters: Array<Character>, expansion: Expansion) => {
        return (
            <Paper id={spellRune.name} sx={{ width: 1030 }}>
                <Stack spacing={1} sx={{p: 2}}>
                    <Stack spacing={1} direction='row'>
                        <Typography variant='h6'>{spellRune.name}</Typography>
                        <SpellBreadcrumbs spellRunes={expansion.spells} currentSpellRune={spellRune}/>
                    </Stack>
                    <SpellTable expansionSpellRune={spellRune} characters={characters} updateHandler={(spellRune) => handleUpdateSpell(expansion, spellRune) }/>
                </Stack>
            </Paper>
        );
    }

    return (
        <Container component="main" maxWidth='xl' sx={{'paddingTop': '10px'}}>
            <Grid container spacing={2}>
                <Grid xs={2}>
                    <ExpansionSidebar expansions={expansions} setExpansion={setExpansion}/>
                </Grid>
                <Grid xs={10}>
                    <Card sx={{width: '100%', p: 2}}>
                        {!expansion &&
                        <Typography sx={{ flexGrow: 1, textAlign: 'center' }} variant='h5'>Select an expansion from the list to the left.</Typography>
                        }
                        {!!expansion &&
                        <Box>
                            <Typography sx={{mb: 1}} variant='h5'>{expansion.name}</Typography>
                            <Box sx={{ flexGrow: 1, flexShrink: 1, bgcolor: 'background.paper', display: 'flex' }}>
                                <Tabs
                                    orientation="vertical"
                                    variant="scrollable"
                                    value={view}
                                    onChange={handleChange}
                                    aria-label="Vertical tabs example"
                                    sx={{ borderRight: 1, borderColor: 'divider' }}
                                >
                                    <Tab label="Keys" {...a11yProps(0)} />
                                    <Tab label="Spell Runes" {...a11yProps(1)} />
                                </Tabs>
                                <TabPanel value={view} index={0}>
                                    { characters &&
                                    <Box>
                                        { token?.claims.Admin === true &&
                                        <Typography>Double click the cell you wish to edit. Hit enter to submit a change.</Typography>
                                        }
                                        <Stack spacing={2}>
                                            {!expansion.keys || expansion.keys.length === 0 &&
                                            <Typography>There are no keys for this expansion. Contact an officer if you think this is an error.</Typography>
                                            }
                                            {!!expansion.keys &&
                                            expansion.keys.map((key) => {
                                            return renderKeysPane(key, characters, expansion);
                                            })}
                                        </Stack>
                                    </Box>
                                    }
                                    { !characters &&
                                    <Typography>Loading...</Typography>
                                    }
                                </TabPanel>
                                <TabPanel value={view} index={1}>
                                    { characters &&
                                    <Box>
                                        { token?.claims.Admin === true &&
                                        <Typography>Double click the cell you wish to edit. Hit enter to submit a change.</Typography>
                                        }
                                        <Stack spacing={2}>
                                            {!expansion.spells || expansion.spells.length === 0 &&
                                            <Typography>There are no spell runes for this expansion. Contact an officer if you think this is an error.</Typography>
                                            }
                                            {!!expansion.spells &&
                                            expansion.spells.map((spellRune) => {
                                            return renderSpellRunePane(spellRune, characters, expansion);
                                            })}
                                        </Stack>
                                    </Box>
                                    }
                                    { !characters &&
                                    <Typography>Loading...</Typography>
                                    }
                                </TabPanel>
                            </Box>
                        </Box>
                        }
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}