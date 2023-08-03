import * as React from 'react';
import { Avatar, Container, Typography, Stack, Card, CardHeader, CardContent } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import PersonIcon from '@mui/icons-material/Person';
import AdminSidebar from './components/sidebar';
import { fetchUserCountHook } from './hooks/user.hooks';
import { fetchCharacterCountHook } from '../../model/characters';
import { fetchExpansionsCountHook } from '../../model/expansions';
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { AuthContext } from '../../lib/firebase';
import { User } from 'firebase/auth';

export function AdminDashboard() {
    const { user, token, setUser, setToken } = React.useContext(AuthContext);
    const users = fetchUserCountHook(user as User);
    const characters = fetchCharacterCountHook();
    const expansions = fetchExpansionsCountHook();
    return (
        <Container component="main" maxWidth='xl' sx={{'paddingTop': '10px'}}>
            <Grid container spacing={2}>
                <Grid xs={3}>
                    <AdminSidebar/>
                </Grid>
                <Grid xs={9}>
                    <Stack spacing={2} direction='row'>
                        <Card sx={{ minWidth: 300 }}>
                            <CardHeader
                                avatar={<Avatar><PersonIcon/></Avatar>}
                                title={'Users'}
                            />
                            <CardContent>
                                <Typography>There are {users ? users : 0} registered users.</Typography>
                            </CardContent>
                        </Card>
                        <Card sx={{ minWidth: 300 }}>
                            <CardHeader
                                avatar={<Avatar><SportsKabaddiIcon/></Avatar>}
                                title={'Characters'}
                            />
                            <CardContent>
                                <Typography>There are {characters ? characters: 0} tracked characters.</Typography>
                            </CardContent>
                        </Card>
                        <Card sx={{ minWidth: 300 }}>
                            <CardHeader
                                avatar={<Avatar><SportsEsportsIcon/></Avatar>}
                                title={'Expansions'}
                            />
                            <CardContent>
                                <Typography>There are {expansions ? expansions : 0} configured expansions.</Typography>
                            </CardContent>
                        </Card>
                    </Stack>
                </Grid>
            </Grid>
        </Container>
    );
}