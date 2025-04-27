import React from 'react';
import * as Icons from '@mui/icons-material';
import {Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';

const AllIcons = () => {
    const iconNames = Object.keys(Icons);

    return (
        <Grid container spacing={2} style={{ padding: '20px' }}>
            {iconNames.map((iconName) => {
                const Icon = Icons[iconName];
                return (
                    <Grid item xs={2} key={iconName} style={{ textAlign: 'center' }}>
                        <Icon style={{ fontSize: 40 }} />
                        <Typography variant="caption">{iconName}</Typography>
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default AllIcons;
