import React from 'react';
import { useEasterEggStore } from '../../stores/easterEggsStore';
import { Confetti } from './Confetti';
import { Balloons } from './Balloons';
import { Fireworks } from './Fireworks';
import { PartyMode } from './PartyMode';

export const EffectsOverlay = () => {
    // This component will manage state for modals and effects
    // Managed via orchestrator or local state triggered by store
    return (
        <>
            <PartyMode />
            {/* Add active modals/effects managed by local state or global effect triggers */}
        </>
    );
};
