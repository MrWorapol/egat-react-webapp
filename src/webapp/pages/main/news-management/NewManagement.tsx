import { Container } from '@mui/material'
import React from 'react'
import { useNavigationSet } from '../../../hooks/useNavigationSet'
import { NavigationCurrentType } from '../../../state/navigation-current-state'

export default function NewManagement() {
    useNavigationSet(NavigationCurrentType.NEWS_MANAGEMENT);

    return (
        <Container sx={{ backgroundColor: "#fff" }}>

        </Container>
    )
}
