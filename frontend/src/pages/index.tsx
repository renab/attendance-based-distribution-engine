import React from 'react';
import { Typography, Container } from "@mui/material";

export function defaultPage() {
    return (
        <Container component="main" maxWidth='xl' sx={{'paddingTop': '10px'}}>
            <Typography variant='h3'>VoN Distribution Tools</Typography>
        </Container>
    )
}