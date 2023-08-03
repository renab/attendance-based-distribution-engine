import * as React from 'react';
import { Container } from '@mui/material';
import { DKPTable } from '../../components/dkpTable';

export function DKP() {
    return (
        <Container component="main" maxWidth='xl' sx={{'paddingTop': '10px'}}>
            <DKPTable/>
        </Container>
    );
}