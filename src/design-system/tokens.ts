export const tokens = {
  // ============================================
  // COLORS
  // ============================================
  colors: {
    // Primary palette
    brand: {
      cyan: {
        50: '#ECFEFF',
        100: '#CFFAFE',
        200: '#A5F3FC',
        300: '#67E8F9',
        400: '#22D3EE',
        500: '#06B6D4',
        600: '#0891B2',
        700: '#0E7490',
        800: '#155E75',
        900: '#164E63',
      },
      purple: {
        50: '#FAF5FF',
        100: '#F3E8FF',
        200: '#E9D5FF',
        300: '#D8B4FE',
        400: '#C084FC',
        500: '#A855F7',
        600: '#9333EA',
        700: '#7E22CE',
        800: '#6B21A8',
        900: '#581C87',
      },
      green: {
        400: '#34D399',
        500: '#10F5A0',
        600: '#059669',
      },
    },
    
    // Neutral palette
    neutral: {
      0: '#FFFFFF',
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
      950: '#030712',
      1000: '#000000',
    },
    
    // Semantic
    semantic: {
      success: '#10F5A0',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#22D3EE',
    },
    
    // Surface (glassmorphism)
    surface: {
      primary: 'rgba(15, 23, 42, 0.85)',
      secondary: 'rgba(30, 41, 59, 0.75)',
      tertiary: 'rgba(51, 65, 85, 0.65)',
      overlay: 'rgba(3, 7, 18, 0.9)',
    },
  },
  
  // ============================================
  // SPACING (4px grid)
  // ============================================
  spacing: {
    0: '0',
    0.5: '2px',
    1: '4px',
    1.5: '6px',
    2: '8px',
    2.5: '10px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    7: '28px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
    20: '80px',
    24: '96px',
    32: '128px',
  },
  
  // ============================================
  // TYPOGRAPHY
  // ============================================
  typography: {
    fontFamily: {
      sans: "'Geist', 'Inter', system-ui, -apple-system, sans-serif",
      display: "'Fraunces', Georgia, serif",
      mono: "'JetBrains Mono', 'Fira Code', monospace",
      accent: "'Caveat', cursive",
    },
    
    fontSize: {
      xs: '11px',
      sm: '12px',
      base: '14px',
      md: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '28px',
      '4xl': '32px',
      '5xl': '40px',
      '6xl': '48px',
      '7xl': '60px',
      '8xl': '72px',
    },
    
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },
    
    lineHeight: {
      none: 1,
      tight: 1.1,
      snug: 1.2,
      normal: 1.4,
      relaxed: 1.6,
      loose: 1.8,
    },
    
    letterSpacing: {
      tightest: '-0.06em',
      tighter: '-0.04em',
      tight: '-0.02em',
      normal: '0',
      wide: '0.02em',
      wider: '0.05em',
      widest: '0.15em',
    },
  },
  
  // ============================================
  // BORDER RADIUS
  // ============================================
  radius: {
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '20px',
    '3xl': '24px',
    '4xl': '32px',
    full: '9999px',
  },
  
  // ============================================
  // SHADOWS (elevations)
  // ============================================
  shadows: {
    xs: '0 1px 2px rgba(0, 0, 0, 0.15)',
    sm: '0 2px 4px rgba(0, 0, 0, 0.2)',
    md: '0 4px 8px rgba(0, 0, 0, 0.25)',
    lg: '0 8px 16px rgba(0, 0, 0, 0.3)',
    xl: '0 16px 32px rgba(0, 0, 0, 0.35)',
    '2xl': '0 24px 48px rgba(0, 0, 0, 0.4)',
    
    // Glow shadows (signature)
    glowCyan: '0 0 20px rgba(34, 211, 238, 0.4)',
    glowPurple: '0 0 20px rgba(168, 85, 247, 0.4)',
    glowGreen: '0 0 20px rgba(16, 245, 160, 0.4)',
    
    // Inner
    inner: 'inset 0 1px 0 rgba(255, 255, 255, 0.05)',
    innerStrong: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
  },
  
  // ============================================
  // MOTION
  // ============================================
  motion: {
    duration: {
      instant: '0ms',
      fast: '150ms',
      normal: '250ms',
      moderate: '400ms',
      slow: '600ms',
      slower: '1000ms',
    },
    
    easing: {
      linear: 'linear',
      smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      snappy: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.27, 1.55)',
      decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
      accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
      overshoot: 'cubic-bezier(0.16, 1, 0.3, 1)',
    },
  },
  
  // ============================================
  // Z-INDEX
  // ============================================
  zIndex: {
    base: 0,
    above: 1,
    dropdown: 10,
    sticky: 20,
    overlay: 30,
    modal: 40,
    popover: 50,
    toast: 60,
    tooltip: 70,
    max: 9999,
  },
  
  // ============================================
  // BREAKPOINTS
  // ============================================
  breakpoints: {
    xs: '360px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const;

export type Tokens = typeof tokens;
