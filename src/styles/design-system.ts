export const colors = {
  // Backgrounds (profundidade)
  bg: {
    void: '#030712',
    deep: '#0A0E1A',
    elevated: '#111827',
    surface: '#1E293B',
    overlay: '#334155',
    glass: 'rgba(15, 23, 42, 0.6)',
  },
  // Brand
  brand: {
    cyan: { 
      50: '#ECFEFF', 
      500: '#00E5FF', // Neon Cyan as per initial requirement
      700: '#0E7490', 
      glow: 'rgba(0, 229, 255, 0.4)' 
    },
    green: { 500: '#10F5A0', glow: 'rgba(16, 245, 160, 0.4)' },
    purple: { 500: '#A855F7', glow: 'rgba(168, 85, 247, 0.4)' },
    orange: { 500: '#FB923C', glow: 'rgba(251, 146, 60, 0.4)' },
    gold: { 500: '#FFD700', glow: 'rgba(255, 215, 0, 0.4)' },
    pink: { 500: '#EC4899', glow: 'rgba(236, 72, 153, 0.4)' },
  },
  // Gradientes
  gradients: {
    hero: 'linear-gradient(135deg, #00E5FF 0%, #10F5A0 50%, #A855F7 100%)',
    aurora: 'linear-gradient(135deg, #00E5FF 0%, #A855F7 100%)',
    sunset: 'linear-gradient(135deg, #FB923C 0%, #A855F7 100%)',
    ocean: 'linear-gradient(180deg, #0A0E1A 0%, #1E293B 100%)',
    premium: 'linear-gradient(135deg, #FFD700 0%, #FF6B6B 100%)',
    mesh: 'radial-gradient(at 20% 30%, rgba(0, 229, 255, 0.2), transparent 50%), radial-gradient(at 80% 70%, rgba(168, 85, 247, 0.2), transparent 50%)',
  },
  text: {
    primary: '#F8FAFC', 
    secondary: '#CBD5E1',
    tertiary: '#64748B', 
    accent: '#00E5FF',
  },
  semantic: {
    success: '#10F5A0', 
    warning: '#FBBF24',
    error: '#F43F5E', 
    info: '#3B82F6',
  },
};

export const typography = {
  fonts: {
    display: '"Cal Sans", "Inter Display", system-ui, sans-serif',
    body: '"Inter", system-ui, sans-serif',
    mono: '"JetBrains Mono", monospace',
    brand: '"Satoshi", "Inter", sans-serif',
  },
  sizes: {
    xs: '0.75rem', sm: '0.875rem', base: '1rem',
    lg: '1.125rem', xl: '1.25rem', '2xl': '1.5rem',
    '3xl': '1.875rem', '4xl': '2.25rem', '5xl': '3rem',
    '6xl': '3.75rem', '7xl': '4.5rem', '8xl': '6rem',
  },
  weights: { thin: 100, light: 300, normal: 400, 
             medium: 500, semibold: 600, bold: 700, black: 900 },
  tracking: { tighter: '-0.05em', tight: '-0.025em', 
              normal: '0', wide: '0.025em', widest: '0.1em' },
};

export const spacing = {
  container: 'max-w-[420px]',
  gutter: '1rem',
};

export const shadows = {
  glow: '0 0 20px rgba(0, 229, 255, 0.3)',
  premium: '0 0 30px rgba(255, 215, 0, 0.3)',
};
