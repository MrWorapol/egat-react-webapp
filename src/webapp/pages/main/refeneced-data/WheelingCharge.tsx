import React from 'react'
import { useNavigationSet } from '../../../hooks/useNavigationSet';
import { NavigationCurrentType } from '../../../state/navigation-current-state';

export default function WheelingCharge() {
    useNavigationSet(NavigationCurrentType.WHEELING_CHART);
    console.log('')
    return (
        <div>
            HELLO
        </div>
    )
}
