import { toast } from './toast';
import { useEasterEggStore } from '../stores/easterEggsStore';

export const triggerKonami = () => {
    useEasterEggStore.getState().discover('konami');
    useEasterEggStore.getState().activateSecretTheme(true);
    toast.success("🎮 Código descoberto! +500 XP");
    // Trigger confetti here eventually
};

export const triggerPartyMode = () => {
    useEasterEggStore.getState().discover('logo-tap-7');
    useEasterEggStore.getState().activatePartyMode(true);
    toast.success("🎉 MODO FESTA ATIVADO!");
    setTimeout(() => useEasterEggStore.getState().activatePartyMode(false), 10000);
};
