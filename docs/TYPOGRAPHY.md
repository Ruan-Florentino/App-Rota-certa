# Right Way Typography System

The Right Way app uses a 4-tier typographic stack to establish an editorial and deeply unique identity, breaking away from standard template designs. 

## Stack Overview

1. **Fraunces (Display)**
   Serif variable font used for all main headings, country names in cards, and large stat numbers. It includes `SOFT 50`, `WONK 1`, and `opsz auto` configurations.
   
2. **Geist (Sans / UI)**
   A modern and clean generic sans-serif crafted by Vercel for superior hinting and legibility. Replaces "Inter", "Roboto", "San Francisco". Use this for the entire application Body, forms, navigation, and controls.

3. **JetBrains Mono (Tech / Mono)**
   Gives a "cockpit" or "airplane terminal" feel. Use for Airports (GRU, JFK), Dates, IDs, and tabular numbers. Includes `font-variant-numeric: tabular-nums`.

4. **Caveat (Accent / Handwritten)**
   Very low usage (< 5% of app content). Used exclusively for cursive handwritten quotes, easter-eggs, "stamps", or personalized travel notes.

## React Component

Instead of scattering generic `<h1>` or `p className="text-sm"` tags across the application, you must use the `<Text />` component located at `src/components/ui/Text.tsx`.

```tsx
import { Text } from '@/components/ui/Text';

// Title
<Text variant="display-lg">Meu Perfil</Text>

// Airport Code
<Text variant="mono-lg">NYC -> LHR</Text>

// Note
<Text variant="accent-sm">Uma viagem inesquecível...</Text>
```

## Scale Reference
* `display-(sm|md|lg|xl|2xl)`
* `h1`, `h2`, `h3`, `h4`
* `body-(xs|sm|md|lg)`
* `label-(sm|md|lg)`
* `mono-(sm|md|lg)`
* `accent-(sm|md|lg)`
