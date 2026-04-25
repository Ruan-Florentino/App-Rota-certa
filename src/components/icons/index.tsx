import React from 'react';
import * as Nav from './NavigationIcons';
import * as Action from './ActionIcons';
import * as Travel from './TravelIcons';
import * as Social from './SocialIcons';
import * as Utility from './UtilityIcons';
import * as Cat from './CategoryIcons';
import * as Status from './StatusIcons';
import { IconProps } from './BaseIcon';

// Epic Action Icons
import { LenteAIIcon } from './actions/LenteAIIcon';
import { MundoIcon } from './actions/MundoIcon';
import { InspiracaoIcon } from './actions/InspiracaoIcon';
import { AlertasIcon } from './actions/AlertasIcon';

export { LenteAIIcon as LensAIIcon, MundoIcon as WorldIcon, InspiracaoIcon as InspirationIcon, AlertasIcon, AlertasIcon as AlertsIcon };

// Re-export everything for direct usage
export * from './NavigationIcons';
export * from './ActionIcons';
export * from './TravelIcons';
export * from './SocialIcons';
export * from './UtilityIcons';
export * from './CategoryIcons';
export * from './StatusIcons';
export * from './BaseIcon';

// Lens and other specific ones if they existed (keeping placeholders for now)
export const CommunityIcon = Social.SparklesIcon; // Placeholder
export const CopyIcon = Action.BookmarkIcon;
export const AwardIcon = Status.TrophyIcon;
export const NavigationIcon = Nav.MapIcon;
export const ErrorIcon = Status.ErrorIcon;
export const WalletIcon = Utility.DollarIcon;

// Registry for dynamic usage
export const IconRegistry = {
  ...Nav,
  ...Action,
  ...Travel,
  ...Social,
  ...Utility,
  ...Cat,
  ...Status,
  LensAI: LenteAIIcon,
  World: MundoIcon,
  Inspiration: InspiracaoIcon,
  Alerts: AlertasIcon,
  Alertas: AlertasIcon,
  Community: Nav.SocialIcon, // Mapping legacy name
  CommunityIcon: Nav.SocialIcon,
  Trash: Action.TrashIcon, // Mapping legacy name
  LogoutIcon: Utility.LogoutIcon,
  WalletIcon: Utility.DollarIcon,
  ShieldIcon: Utility.ShieldIcon,
  BellIcon: Utility.BellIcon,
  Search: Action.SearchIcon,
  Mic: Action.MicIcon,
  X: Action.XIcon,
  XIcon: Action.XIcon,
  Clock: Utility.ClockIcon,
  MapPin: Nav.MapPinIcon,
  MapPinIcon: Nav.MapPinIcon,
  Sparkles: Social.SparklesIcon,
  CopyIcon: Action.BookmarkIcon, // Placeholder for Copy
  AwardIcon: Status.TrophyIcon,
  NavigationIcon: Nav.MapIcon,
  ErrorIcon: Status.ErrorIcon,
  HomeScreenIcon: Nav.HomeIcon,
};

export type IconName = keyof typeof IconRegistry;

interface RegistryIconProps extends IconProps {
  name: IconName;
}

export const Icon: React.FC<RegistryIconProps> = ({ name, ...props }) => {
  const IconComponent = (IconRegistry as any)[name] as React.FC<any>;
  if (!IconComponent) return null;
  return <IconComponent {...props} />;
};
