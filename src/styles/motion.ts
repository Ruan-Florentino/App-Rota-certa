/**
 * Premium Motion System for Right Way
 * Defines custom easing curves, durations, and spring presets.
 */

export const easing = {
  // Naturais (Apple-like)
  apple: [0.25, 0.1, 0.25, 1],
  appleIn: [0.42, 0, 1, 1],
  appleOut: [0, 0, 0.58, 1],
  appleInOut: [0.42, 0, 0.58, 1],
  
  // Springs (mais vivos)
  spring: [0.34, 1.56, 0.64, 1],        // overshoot suave
  springSoft: [0.175, 0.885, 0.32, 1.275], // overshoot forte
  springBounce: [0.68, -0.55, 0.265, 1.55], // bounce alegre
  
  // Swift (rápidos e precisos - Material Design 3)
  swiftOut: [0.4, 0, 0.2, 1],
  swiftIn: [0.4, 0, 1, 1],
  swiftInOut: [0.2, 0, 0, 1],
  emphasized: [0.2, 0, 0, 1],
  
  // Cinematográficos (dramáticos)
  dramatic: [0.87, 0, 0.13, 1],
  cinematic: [0.83, 0, 0.17, 1],
  anticipate: [0.68, -0.6, 0.32, 1.6],
  
  // Exponenciais (smooth decay)
  expoOut: [0.16, 1, 0.3, 1],
  expoIn: [0.7, 0, 0.84, 0],
  expoInOut: [0.87, 0, 0.13, 1],
  
  // Circulares (fluidos)
  circOut: [0, 0.55, 0.45, 1],
  circIn: [0.55, 0, 1, 0.45],
  circInOut: [0.85, 0, 0.15, 1],
};

export const duration = {
  instant: 0.1,
  micro: 0.15,
  fast: 0.2,
  base: 0.3,
  smooth: 0.4,
  slow: 0.5,
  slower: 0.7,
  cinematic: 1.0,
  epic: 1.5,
  dramatic: 2.0,
};

export const springs = {
  gentle: { type: 'spring', stiffness: 100, damping: 20 },
  default: { type: 'spring', stiffness: 200, damping: 20 },
  wobbly: { type: 'spring', stiffness: 180, damping: 12 },
  stiff: { type: 'spring', stiffness: 400, damping: 30 },
  slow: { type: 'spring', stiffness: 80, damping: 25 },
  molasses: { type: 'spring', stiffness: 40, damping: 25 },
  bounce: { type: 'spring', stiffness: 300, damping: 10 },
} as const;
