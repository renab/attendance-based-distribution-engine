import * as React from 'react';
import { Container, Typography, Card, List, ListItem, ListItemButton, ListItemText, ListItemIcon, styled, AlertProps, Stack, Divider, Button, Box, Paper, Chip, Dialog, DialogTitle, DialogContent, DialogActions, CardHeader, Avatar, CardContent, SpeedDial, SpeedDialAction } from '@mui/material';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Grid from '@mui/material/Unstable_Grid2';
import AdminSidebar from './components/sidebar';
import { Expansion, Key, SpellRune, fetchExpansionsHook, updateExpansions } from '../../model/expansions';
import { AuthContext } from '../../lib/firebase';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import CreateExpansionModal from './components/createExpansionModal';
import { User } from 'firebase/auth';
import CreateKeyModal from './components/createKeyModal';
import CreateSpellRuneModal from './components/createSpellRuneModal';
import BoltIcon from '@mui/icons-material/Bolt';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';

export function ExpansionManagement() {
    const { user, token, setUser, setToken } = React.useContext(AuthContext);
    const [expanded, setExpanded] = React.useState<string | false>('');
    const [expansions, setExpansions] = fetchExpansionsHook();
    const [expansionModalOpen, setExpansionModalOpen] = React.useState<boolean>(false);
    const [keyModalOpen, setKeyModalOpen] = React.useState<boolean>(false);
    const [spellModalOpen, setSpellModalOpen] = React.useState<boolean>(false);
    const [expansionBeingEdited, setExpansionBeingEdited] = React.useState<Expansion | null>(null);
    const [keyBeingRemoved, setKeyBeingRemoved] = React.useState<Key | null>(null);
    const [spellBeingRemoved, setSpellBeingRemoved] = React.useState<SpellRune | null>(null);
    const [spellRuneToEdit, setSpellRuneToEdit] = React.useState<SpellRune | null>(null);
    const [showRemoveKeyConfirmation, setShowRemoveKeyConfirmation] = React.useState<boolean>(false);
    const [showRemoveSpellRuneConfirmation, setShowRemoveSpellRuneConfirmation] = React.useState<boolean>(false);
    const Accordion = styled((props: AccordionProps) => (
        <MuiAccordion disableGutters elevation={0} square {...props} />
      ))(({ theme }) => ({
        border: `1px solid ${theme.palette.divider}`,
        '&:not(:last-child)': {
          borderBottom: 0,
        },
        '&:before': {
          display: 'none',
        },
      }));
      
      const AccordionSummary = styled((props: AccordionSummaryProps) => (
        <MuiAccordionSummary
          expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
          {...props}
        />
      ))(({ theme }) => ({
        backgroundColor:
          theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, .05)'
            : 'rgba(0, 0, 0, .03)',
        flexDirection: 'row-reverse',
        '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
          transform: 'rotate(90deg)',
        },
        '& .MuiAccordionSummary-content': {
          marginLeft: theme.spacing(1),
        },
      }));
      
      const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
        padding: theme.spacing(2),
        borderTop: '1px solid rgba(0, 0, 0, .125)',
      }));

    const handleAddExpansion = () => {setExpansionModalOpen
        setExpansionModalOpen(true);
    };

    const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
        setExpanded(newExpanded ? panel : false);
    };

    const handleEntered = () => {
        // The `autoFocus` is not used because, if used, the same Enter that saves
        // the cell triggers "No". Instead, we manually focus the "No" button once
        // the dialog is fully open.
        // noButtonRef.current?.focus();
    };

    const handleRemoveKeyFromExpansion = () => {
        if (expansionBeingEdited && keyBeingRemoved)
        {
            const oldExpansions = Array.from(expansions);
            const newExpansions = Array.from(expansions);
            for (let expIdx = 0; expIdx < oldExpansions.length; expIdx = expIdx + 1)
            {
                const existing = oldExpansions[expIdx];
                if (existing.name === expansionBeingEdited.name)
                {
                    for (let idx = 0; idx < existing.keys.length; idx = idx + 1)
                    {
                        const existingKey = existing.keys[idx];
                        if (existingKey.name === keyBeingRemoved.name)
                        {
                            newExpansions[expIdx].keys.splice(idx, idx +  1);
                            break;
                        }
                    }
                }
            }
            setExpansions(newExpansions);
            setShowRemoveKeyConfirmation(false);
            updateExpansions(user as User, newExpansions).then((expansions) => {
                setExpansions(expansions ? expansions : []);
            }).catch((err) => {
                console.error(err);
                setExpansions(oldExpansions);
            });
        }
    };

    const handleRemoveSpellRuneFromExpansion = () => {
        if (expansionBeingEdited && spellBeingRemoved)
        {
            const oldExpansions = Array.from(expansions);
            const newExpansions = Array.from(expansions);
            for (let expIdx = 0; expIdx < oldExpansions.length; expIdx = expIdx + 1)
            {
                const existing = oldExpansions[expIdx];
                if (existing.name === expansionBeingEdited.name)
                {
                    for (let idx = 0; idx < existing.spells.length; idx = idx + 1)
                    {
                        const existingSpell = existing.spells[idx];
                        if (existingSpell.name === spellBeingRemoved.name)
                        {
                            newExpansions[expIdx].spells.splice(idx, idx +  1);
                            break;
                        }
                    }
                }
            }
            setExpansions(newExpansions);
            setShowRemoveSpellRuneConfirmation(false);
            updateExpansions(user as User, newExpansions).then((expansions) => {
                setExpansions(expansions ? expansions : []);
            }).catch((err) => {
                console.error(err);
                setExpansions(oldExpansions);
            });
        }
    }

    const renderKeys = (expansion: Expansion) => {
        return (
            <Box sx={{p: 2}}>
                <Stack spacing={2} direction={'row'}>
                {expansion.keys.map((key) => {
                    if (key) {
                        return (
                            <Chip key={key.name} label={key.name} onDelete={() => {
                                setExpansionBeingEdited(expansion);
                                setKeyBeingRemoved(key);
                                setShowRemoveKeyConfirmation(true);
                            }} />
                        );
                    } else {
                        return;
                    }
                })}
                </Stack>
            </Box>
        )
    };

    const renderSpellRunes = (expansion: Expansion) => {
        return (
            <Box sx={{p: 2}}>
                <Stack spacing={2}>
                {expansion.spells.map((spell) => {
                    if (spell) {
                        return (
                            <Card variant='outlined' key={spell.name} sx={{ width: '100%' }}>
                                <CardHeader
                                    avatar={<Avatar><BoltIcon/></Avatar>}
                                    title={spell.name}
                                    titleTypographyProps={{variant: 'h6'}}
                                />
                                <CardContent>
                                    <Typography variant='subtitle1'>Runes per Class</Typography>
                                    <Divider/>
                                    <Grid container spacing={1} direction='row' sx={{mt: 1}}>
                                        {spell.classesThatNeed.map((classData) => {
                                            if (classData)
                                            {
                                                return (
                                                    <Grid key={classData.class}>
                                                        <Chip label={`${classData.class}: ${classData.count}`}/>
                                                    </Grid>
                                                );
                                            }
                                            return;
                                        })}
                                    </Grid>
                                    <Box sx={{width: '100%'}}>
                                    <SpeedDial
                                        ariaLabel="SpeedDial Spell Control"
                                        sx={{ position: 'relative', right: 16 }}
                                        icon={<MenuOpenIcon />}
                                        direction='left'
                                    >
                                        <SpeedDialAction
                                            icon={<DeleteForeverIcon/>}
                                            tooltipTitle={'Delete Spell Rune'}
                                            onClick={() => {
                                                setExpansionBeingEdited(expansion);
                                                setSpellBeingRemoved(spell);
                                                setShowRemoveSpellRuneConfirmation(true);
                                            }}
                                        />
                                        <SpeedDialAction
                                            icon={<EditIcon/>}
                                            tooltipTitle={'Edit Spell Rune'}
                                            onClick={() => {
                                                setExpansionBeingEdited(expansion);
                                                setSpellRuneToEdit(spell);
                                                setSpellModalOpen(true);
                                            }}
                                        />
                                    </SpeedDial>
                                    </Box>
                                </CardContent>
                            </Card>
                        );
                    } else {
                        return;
                    }
                })}
                </Stack>
            </Box>
        )
    };

    const renderExpansionConfiguration = (expansion: Expansion) => {
        return (
            <Stack spacing={2}>
                <Card sx={{width: '100%', p: 2}}>
                    <Stack spacing={0} direction={'row'}>
                        <Grid xs={10}>
                            <Typography variant='h6'>Keys</Typography>
                        </Grid>
                        <Grid xs={2}>
                            <Button onClick={() => {
                                setExpansionBeingEdited(expansion);
                                setKeyModalOpen(true);
                            }}>Add Key</Button>
                        </Grid>
                    </Stack>
                    <Divider/>
                    {renderKeys(expansion)}
                </Card>
                <Card sx={{width: '100%', p: 2}}>
                    <Stack spacing={0} direction={'row'}>
                        <Grid xs={10}>
                            <Typography variant='h6'>Spell Runes</Typography>
                        </Grid>
                        <Grid xs={2}>
                            <Button onClick={() => {
                                setExpansionBeingEdited(expansion);
                                setSpellModalOpen(true);
                            }}>Add Spell Rune</Button>
                        </Grid>
                    </Stack>
                    <Divider/>
                    {renderSpellRunes(expansion)}
                </Card>
            </Stack>
        );
    };

    const submitNewExpansionHandler = (expansion: Expansion, setSnackbar: React.Dispatch<React.SetStateAction<Pick<AlertProps, 'children' | 'severity'> | null>>) => 
    {
        if (expansions && Array.isArray(expansions))
        {
            const oldExpansions = Array.from(expansions);
            const newExpansions = Array.from(expansions);
            newExpansions.push(expansion);
            setExpansions(newExpansions);
            updateExpansions(user as User, newExpansions).then((expansions) => {
                setExpansions(expansions ? expansions : []);
                setExpansionModalOpen(false);
            }).catch((err) => {
                setSnackbar({ children: `There was an error while adding the new expansion: ${err}`, severity: 'error' });
                setExpansions(oldExpansions);
            });
        }
        else
        {
            const oldExpansions: Array<Expansion> = [];
            const newExpansions: Array<Expansion> = [];
            newExpansions.push(expansion);
            setExpansions(newExpansions);
            updateExpansions(user as User, newExpansions).then((expansions) => {
                setExpansions(expansions ? expansions : []);
                setExpansionModalOpen(false);
            }).catch((err) => {
                setSnackbar({ children: `There was an error while adding the new expansion: ${err}`, severity: 'error' });
                setExpansions(oldExpansions);
            });
        }
    };

    const addKeyToExpansionHandler = (expansion: Expansion, key: Key, setSnackbar: React.Dispatch<React.SetStateAction<Pick<AlertProps, 'children' | 'severity'> | null>>) => 
    {
        if (expansion && key)
        {
            const oldExpansions = Array.from(expansions);
            const newExpansions = Array.from(expansions);
            for (const existing of newExpansions)
            {
                if (existing.name === expansion.name)
                {
                    existing.keys.push(key);
                }
            }
            setExpansions(newExpansions);
            updateExpansions(user as User, newExpansions).then((expansions) => {
                setExpansions(expansions ? expansions : []);
                setKeyModalOpen(false);
            }).catch((err) => {
                setSnackbar({ children: `There was an error while adding the key to expansion [${expansion.name}]: ${err}`, severity: 'error' });
                setExpansions(oldExpansions);
            });
        }
    };

    const addSpellRuneToExpansionHandler = (expansion: Expansion, spellRune: SpellRune, setSnackbar: React.Dispatch<React.SetStateAction<Pick<AlertProps, 'children' | 'severity'> | null>>) => 
    {
        if (expansion && spellRune)
        {
            if (spellRuneToEdit) {
                const oldExpansions = Array.from(expansions);
                const newExpansions = Array.from(expansions);
                for (const existing of newExpansions)
                {
                    if (existing.name === expansion.name)
                    {
                        const newSpellArray = [];
                        for (const spell of existing.spells)
                        {
                            if (spell.name !== spellRuneToEdit.name)
                            {
                                newSpellArray.push(spell);
                            }
                            else
                            {
                                newSpellArray.push(spellRune);
                            }
                        }
                        existing.spells = newSpellArray;
                    }
                }
                setExpansions(newExpansions);
                updateExpansions(user as User, newExpansions).then((expansions) => {
                    setExpansions(expansions ? expansions : []);
                    setSpellModalOpen(false);
                    setSpellRuneToEdit(null);
                }).catch((err) => {
                    setSnackbar({ children: `There was an error while updating the spell rune [${spellRuneToEdit.name}] in expansion [${expansion.name}]: ${err}`, severity: 'error' });
                    setExpansions(oldExpansions);
                });             
            } else {
                const oldExpansions = Array.from(expansions);
                const newExpansions = Array.from(expansions);
                for (const existing of newExpansions)
                {
                    if (existing.name === expansion.name)
                    {
                        existing.spells.push(spellRune);
                    }
                }
                setExpansions(newExpansions);
                updateExpansions(user as User, newExpansions).then((expansions) => {
                    setExpansions(expansions ? expansions : []);
                    setSpellModalOpen(false);
                }).catch((err) => {
                    setSnackbar({ children: `There was an error while adding the spell rune to expansion [${expansion.name}]: ${err}`, severity: 'error' });
                    setExpansions(oldExpansions);
                });
            }
        }
    };

    const closeExpansionModalHandler = () =>
    {
        setExpansionModalOpen(false);
    };

    const closeKeyModalHandler = () =>
    {
        setKeyModalOpen(false);
    };

    const closeSpellModalHandler = () =>
    {
        setSpellModalOpen(false);
    };

    return (
        <Container component="main" maxWidth='xl' sx={{'paddingTop': '10px'}}>
            <Grid container spacing={2}>
                <Grid xs={3}>
                    <AdminSidebar/>
                    <Card sx={{ mt: 2 }}>
                        <List>
                            <ListItem key="Dashboard" disablePadding>
                                <ListItemButton onClick={handleAddExpansion}>
                                    <ListItemIcon>
                                        <AddToPhotosIcon/>
                                    </ListItemIcon>
                                    <ListItemText primary='Add Expansion' />
                                </ListItemButton>
                            </ListItem>
                            {expansions.map((expansion) => {
                            return (
                            <ListItem key={expansion.name} disablePadding>
                                <ListItemButton onClick={(() => { if (expanded !== expansion.name) setExpanded(expansion.name); document.getElementById(`${expansion.name}--header`)?.scrollIntoView({ behavior: 'smooth' }); })}>
                                    <ListItemIcon>
                                            <SportsEsportsIcon/>
                                        </ListItemIcon>
                                        <ListItemText primary={expansion.name} />
                                </ListItemButton>
                            </ListItem>
                            );
                            })}
                        </List>
                    </Card>
                </Grid>
                <Grid xs={9}>
                    <Card sx={{width: '100%', p: 2}}>
                        {Array.isArray(expansions) ? expansions.map((expansion, idx) => {
                            if (idx === 0 && !expanded) setExpanded(expansion.name);
                            return (
                            <Accordion key={expansion.name} expanded={expanded === expansion.name} onChange={handleAccordionChange(expansion.name)}>
                                <AccordionSummary aria-controls={`${expansion.name}-content`} id={`${expansion.name}--header`}>
                                    <Typography variant='h5'>{expansion.name}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {renderExpansionConfiguration(expansion)}
                                </AccordionDetails>
                            </Accordion>
                            );
                        }) : ''}
                        {!expansions || expansions.length === 0 &&
                            <Typography variant='h4'>There are no expansions configured. Please add an expansion.</Typography>
                        }
                    </Card>
                </Grid>
            </Grid>
            <CreateExpansionModal open={expansionModalOpen} expansions={expansions} closeHandler={closeExpansionModalHandler} submitHandler={submitNewExpansionHandler} />
            <CreateKeyModal open={keyModalOpen} expansion={expansionBeingEdited as Expansion} closeHandler={closeKeyModalHandler} submitHandler={addKeyToExpansionHandler} />
            <CreateSpellRuneModal open={spellModalOpen} expansion={expansionBeingEdited as Expansion} closeHandler={closeSpellModalHandler} submitHandler={addSpellRuneToExpansionHandler} spellRune={spellRuneToEdit} />
            <Dialog
                maxWidth="xs"
                TransitionProps={{ onEntered: handleEntered }}
                open={showRemoveKeyConfirmation}
            >
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogContent dividers>
                {`Pressing 'Yes' will remove the selected key AS WELL AS any associated character data.`}
                </DialogContent>
                <DialogActions>
                <Button onClick={() => setShowRemoveKeyConfirmation(false)}>No</Button>
                <Button onClick={handleRemoveKeyFromExpansion}>Yes</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                maxWidth="xs"
                TransitionProps={{ onEntered: handleEntered }}
                open={showRemoveSpellRuneConfirmation}
            >
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogContent dividers>
                {`Pressing 'Yes' will remove the selected spell rune AS WELL AS any associated character data.`}
                </DialogContent>
                <DialogActions>
                <Button onClick={() => setShowRemoveSpellRuneConfirmation(false)}>No</Button>
                <Button onClick={handleRemoveSpellRuneFromExpansion}>Yes</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}