/**
 * RIGHT WAY - BRAND CONSTANTS
 * Centralized brand configuration for the complete rebranding.
 */

export const BRAND = {
  // Main brand names
  name: 'Right Way',
  nameShort: 'RW',
  
  // Variations for different contexts
  full: 'Right Way',
  short: 'RightWay',  // used for URLs, handles, folders
  compact: 'RW',      // used for app icon, favicon
  
  // Digital presence
  domain: 'rightway.app',
  url: 'https://rightway.app',
  
  // Social handles
  social: {
    instagram: '@rightway.app',
    twitter: '@rightwayapp',
    tiktok: '@rightway.app',
  },
  
  // Legal information
  legal: {
    name: 'Right Way Tecnologia LTDA',
  },
  
  // Tagline configuration
  tagline: {
    pt: 'sua jornada começa aqui',
    en: 'your journey starts here',
    es: 'tu viaje comienza aquí',
  },
  
  // Context-specific taglines
  taglines: {
    main: {
      pt: 'sua jornada começa aqui',
      en: 'your journey starts here',
    },
    hero: {
      pt: 'o caminho certo pra sua próxima viagem',
      en: 'the right way to your next trip',
    },
    app: {
      pt: 'planeje, viaje, compartilhe',
      en: 'plan, travel, share',
    },
    minimal: {
      pt: 'viaje melhor',
      en: 'travel better',
    },
  },
  
  // Descriptions for meta tags, stores, etc.
  description: {
    pt: 'O app definitivo pra planejar e compartilhar suas viagens',
    en: 'The definitive app to plan and share your travels',
  },
  
  // Brand color palette (keeping existing premium colors)
  colors: {
    primary: '#22D3EE',   // cyan
    secondary: '#A855F7', // purple
    accent: '#10F5A0',    // green
    gold: '#FFD700',      // premium
  },
} as const;
