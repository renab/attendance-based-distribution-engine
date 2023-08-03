import * as React from 'react';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useFirebaseTokenResultHook } from '../../../lib/firebase';
import { Card, Link } from '@mui/material';

export default function AdminSidebar() {
    const token = useFirebaseTokenResultHook();
    return (
    <Card>
        <List>
            <ListItem key="Dashboard" disablePadding>
                <ListItemButton component={Link} href='/admin'>
                    <ListItemIcon>
                        <DashboardIcon/>
                    </ListItemIcon>
                    <ListItemText primary='Dashboard' />
                </ListItemButton>
            </ListItem>
            {(token && token.claims && token.claims.SuperAdmin === true) &&
            <ListItem key="Users" disablePadding>
                <ListItemButton component={Link} href='/admin/users'>
                    <ListItemIcon>
                        <PersonSearchIcon/>
                    </ListItemIcon>
                    <ListItemText primary='User Management' />
                </ListItemButton>
            </ListItem>}
            <ListItem key="Expansion" disablePadding>
                <ListItemButton component={Link} href='/admin/expansions'>
                    <ListItemIcon>
                        <SportsEsportsIcon/>
                    </ListItemIcon>
                    <ListItemText primary='Expansion Management' />
                </ListItemButton>
            </ListItem>
        </List>
    </Card>
    );
}