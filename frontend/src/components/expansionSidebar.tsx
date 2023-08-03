import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import KeyIcon from '@mui/icons-material/Key';
import BoltIcon from '@mui/icons-material/Bolt';
import { Box, Card, Divider, Link } from '@mui/material';
import { Expansion } from '../model/expansions';

interface ExpansionSidebarProps {
    expansions: Array<Expansion>;
    setExpansion: React.Dispatch<React.SetStateAction<Expansion | null>>;
}

export default function ExpansionSidebar(props: ExpansionSidebarProps) {
    return (
    <Card>
        <List>
            {props.expansions.map((expansion) => {
            return(
            <ListItem key={expansion.name} disablePadding>
                <ListItemButton onClick={() => props.setExpansion(expansion)}>
                    <ListItemText primary={expansion.name} />
                </ListItemButton>
            </ListItem>
            );
            })}
        </List>
    </Card>
    );
}