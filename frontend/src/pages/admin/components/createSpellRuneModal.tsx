import * as React from 'react';
import { Backdrop, Card, Modal, Fade, Typography, Snackbar, AlertProps, Alert, Container, Box, Button, TextField, Stack, Grid } from '@mui/material';
import { ClassSpellCount, Expansion, SpellRune } from '../../../model/expansions';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 900,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

interface SpellRuneModalProps {
    open: boolean;
    expansion: Expansion;
    spellRune?: SpellRune | null;
    closeHandler: () => void
    submitHandler: (expansion: Expansion, spellRune: SpellRune, setSnackbar: React.Dispatch<React.SetStateAction<Pick<AlertProps, 'children' | 'severity'> | null>>) => void
}

export default function CreateSpellRuneModal(props: SpellRuneModalProps) {
    const [snackbar, setSnackbar] = React.useState<Pick<AlertProps, 'children' | 'severity'> | null>(null);
    const handleCloseSnackbar = () => setSnackbar(null);
    const getNumberFromData = (data: FormData, className: string): number => {
        const value = data.get(className)?.valueOf() as string;
        return parseInt(value, 10);
    }
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const name = data.get('name');
        const classData: Array<ClassSpellCount> = []
        classData.push({ class: 'Bard', count: getNumberFromData(data, 'bard')});
        classData.push({ class: 'Beastlord', count: getNumberFromData(data, 'beastlord')});
        classData.push({ class: 'Berserker', count: getNumberFromData(data, 'berserker')});
        classData.push({ class: 'Cleric', count: getNumberFromData(data, 'cleric')});
        classData.push({ class: 'Druid', count: getNumberFromData(data, 'druid')});
        classData.push({ class: 'Enchanter', count: getNumberFromData(data, 'enchanter')});
        classData.push({ class: 'Magician', count: getNumberFromData(data, 'magician')});
        classData.push({ class: 'Monk', count: getNumberFromData(data, 'monk')});
        classData.push({ class: 'Necromancer', count: getNumberFromData(data, 'necromancer')});
        classData.push({ class: 'Paladin', count: getNumberFromData(data, 'paladin')});
        classData.push({ class: 'Ranger', count: getNumberFromData(data, 'ranger')});
        classData.push({ class: 'Rogue', count: getNumberFromData(data, 'rogue')});
        classData.push({ class: 'Shadow Knight', count: getNumberFromData(data, 'shadowknight')});
        classData.push({ class: 'Shaman', count: getNumberFromData(data, 'shaman')});
        classData.push({ class: 'Warrior', count: getNumberFromData(data, 'warrior')});
        classData.push({ class: 'Wizard', count: getNumberFromData(data, 'wizard')});
        if (!name || name === '')
        {
            setSnackbar({ children: 'You must provide the name of the Spell Rune to add', severity: 'error' });
        }
        else if (props.expansion && !props.spellRune)
        {
            // This is a new spell rune
            let exists = false;
            for (const spellRune of props.expansion.spells) {
                if (spellRune.name === name) {
                    exists = true;
                    setSnackbar({ children: 'There is already a Spell Rune with this name', severity: 'error' });
                    break;
                }
            }
            if (!exists)
            {
                const newSpellRune: SpellRune = { name: name as string, classesThatNeed: classData, charactersWithRune: [] };
                props.submitHandler(props.expansion, newSpellRune, setSnackbar);
            }
        }
        else
        {
            // This is an update
            (props.spellRune as SpellRune).name = data.get('name') as string;
            (props.spellRune as SpellRune).classesThatNeed = classData;
            if (!props.spellRune?.charactersWithRune)
            {
                (props.spellRune as SpellRune).charactersWithRune = []
            }
            props.submitHandler(props.expansion, props.spellRune as SpellRune, setSnackbar);
        }
    };

    const getValueFromProps = (className: string) => {
        if (props.spellRune?.classesThatNeed) {
            for (const characterClass of props.spellRune.classesThatNeed)
            {
                if (characterClass.class === className) {
                    return characterClass.count;
                }
            }
            return 0;
        } else {
            return 0;
        }
    }

    return (
        <Container component="main" maxWidth='xl' sx={{'paddingTop': '10px'}}>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={props.open}
                onClose={props.closeHandler}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                    timeout: 500,
                    },
                }}
            >
                <Fade in={props.open}>
                    <Card sx={style}>
                        <Typography id="transition-modal-title" variant="h5" component="h2">
                            Add Key to {props.expansion?.name}
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="name"
                                label="Spell Rune Name"
                                name="name"
                                autoFocus
                                defaultValue={props.spellRune?.name || ''}
                            />
                            <Grid container spacing={1}>
                                <Grid item xs={3}>
                                    <TextField
                                        InputProps={{
                                            inputProps: {
                                                min: 0
                                            }
                                        }}
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="bard"
                                        label="Number of Bard Runes"
                                        type='number'
                                        name="bard"
                                        defaultValue={getValueFromProps('Bard')}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        InputProps={{
                                            inputProps: {
                                                min: 0
                                            }
                                        }}
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="beastlord"
                                        label="Number of Beastlord Runes"
                                        type='number'
                                        name="beastlord"
                                        defaultValue={getValueFromProps('Beastlord')}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        InputProps={{
                                            inputProps: {
                                                min: 0
                                            }
                                        }}
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="berserker"
                                        label="Number of Berserker Runes"
                                        type='number'
                                        name="berserker"
                                        defaultValue={getValueFromProps('Berserker')}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        InputProps={{
                                            inputProps: {
                                                min: 0
                                            }
                                        }}
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="cleric"
                                        label="Number of Cleric Runes"
                                        type='number'
                                        name="cleric"
                                        defaultValue={getValueFromProps('Cleric')}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        InputProps={{
                                            inputProps: {
                                                min: 0
                                            }
                                        }}
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="druid"
                                        label="Number of Druid Runes"
                                        type='number'
                                        name="druid"
                                        defaultValue={getValueFromProps('Druid')}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        InputProps={{
                                            inputProps: {
                                                min: 0
                                            }
                                        }}
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="enchanter"
                                        label="Number of Enchanter Runes"
                                        type='number'
                                        name="enchanter"
                                        defaultValue={getValueFromProps('Enchanter')}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        InputProps={{
                                            inputProps: {
                                                min: 0
                                            }
                                        }}
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="magician"
                                        label="Number of Magician Runes"
                                        type='number'
                                        name="magician"
                                        defaultValue={getValueFromProps('Magician')}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        InputProps={{
                                            inputProps: {
                                                min: 0
                                            }
                                        }}
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="monk"
                                        label="Number of Monk Runes"
                                        type='number'
                                        name="monk"
                                        defaultValue={getValueFromProps('Monk')}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        InputProps={{
                                            inputProps: {
                                                min: 0
                                            }
                                        }}
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="necromancer"
                                        label="Number of Necromancer Runes"
                                        type='number'
                                        name="necromancer"
                                        defaultValue={getValueFromProps('Necromancer')}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        InputProps={{
                                            inputProps: {
                                                min: 0
                                            }
                                        }}
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="paladin"
                                        label="Number of Paladin Runes"
                                        type='number'
                                        name="paladin"
                                        defaultValue={getValueFromProps('Paladin')}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        InputProps={{
                                            inputProps: {
                                                min: 0
                                            }
                                        }}
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="ranger"
                                        label="Number of Ranger Runes"
                                        type='number'
                                        name="ranger"
                                        defaultValue={getValueFromProps('Ranger')}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        InputProps={{
                                            inputProps: {
                                                min: 0
                                            }
                                        }}
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="rogue"
                                        label="Number of Rogue Runes"
                                        type='number'
                                        name="rogue"
                                        defaultValue={getValueFromProps('Rogue')}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        InputProps={{
                                            inputProps: {
                                                min: 0
                                            }
                                        }}
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="shadowknight"
                                        label="Number of Shadow Knight Runes"
                                        type='number'
                                        name="shadowknight"
                                        defaultValue={getValueFromProps('Shadow Knight')}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        InputProps={{
                                            inputProps: {
                                                min: 0
                                            }
                                        }}
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="shaman"
                                        label="Number of Shaman Runes"
                                        type='number'
                                        name="shaman"
                                        defaultValue={getValueFromProps('Shaman')}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        InputProps={{
                                            inputProps: {
                                                min: 0
                                            }
                                        }}
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="warrior"
                                        label="Number of Warrior Runes"
                                        type='number'
                                        name="warrior"
                                        defaultValue={getValueFromProps('Warrior')}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        InputProps={{
                                            inputProps: {
                                                min: 0
                                            }
                                        }}
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="wizard"
                                        label="Number of Wizard Runes"
                                        type='number'
                                        name="wizard"
                                        defaultValue={getValueFromProps('Wizard')}
                                    />
                                </Grid>
                            </Grid>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Submit
                            </Button>
                        </Box>
                        {!!snackbar && (
                            <Snackbar open onClose={handleCloseSnackbar} autoHideDuration={6000}>
                            <Alert {...snackbar} onClose={handleCloseSnackbar} />
                            </Snackbar>
                        )}
                    </Card>
                </Fade>
            </Modal>
        </Container> 
    );
}