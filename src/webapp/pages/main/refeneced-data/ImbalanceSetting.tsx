import React from 'react'
import { useNavigationSet } from '../../../hooks/useNavigationSet';
import { NavigationCurrentType } from '../../../state/navigation-current-state';

export default function ImbalanceSetting() {
    useNavigationSet(NavigationCurrentType.IMBALANCE);

    return (
        <div>
            
        </div>
    )
}
