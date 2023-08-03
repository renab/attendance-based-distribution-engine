import * as React from 'react';
import { Backdrop, Card, Modal, Fade, Typography, Snackbar, AlertProps, Alert, Container, Box, Button, TextField } from '@mui/material';
import { Expansion, Key } from '../../../model/expansions';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

interface KeyModalProps {
    open: boolean;
    expansion: Expansion;
    closeHandler: () => void
    submitHandler: (expansion: Expansion, key: Key, setSnackbar: React.Dispatch<React.SetStateAction<Pick<AlertProps, 'children' | 'severity'> | null>>) => void
}

export default function CreateKeyModal(props: KeyModalProps) {
    const [snackbar, setSnackbar] = React.useState<Pick<AlertProps, 'children' | 'severity'> | null>(null);
    const handleCloseSnackbar = () => setSnackbar(null);
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const name = data.get('name');
        if (!name || name === '')
        {
            setSnackbar({ children: 'You must provide the name of the key to add', severity: 'error' });
        }
        else if (props.expansion)
        {
            let exists = false;
            for (const key of props.expansion.keys) {
                console.log(`checking key [${key.name}]`)
                if (key.name === name) {
                    exists = true;
                    setSnackbar({ children: 'There is already a key with this name', severity: 'error' });
                    break;
                }
            }
            if (!exists)
            {
                const newKey: Key = { name: name as string, charactersWithKey: [] };
                props.submitHandler(props.expansion, newKey, setSnackbar)
            }
        }
    };

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
                                label="Key Name"
                                name="name"
                                autoFocus
                            />
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