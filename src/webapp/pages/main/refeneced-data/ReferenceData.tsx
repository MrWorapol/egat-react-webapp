import { Typography } from '@mui/material'
import React from 'react'
import { useNavigationSet } from '../../../hooks/useNavigationSet';
import { NavigationCurrentType } from '../../../state/navigation-current-state';

export default function ReferenceData() {
    useNavigationSet(NavigationCurrentType.IMBALANCE);

    return (
        <div>
            <Typography>
                Ref Page
            </Typography>
        </div>
    )
}
