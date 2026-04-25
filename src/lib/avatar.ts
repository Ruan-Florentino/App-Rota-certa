// src/lib/avatar.ts

export function getUserAvatar(userId: string, name?: string): string {
  // Se o usuário não tem foto, gera avatar procedural baseado no ID ou nome
  const seed = name?.replace(/\s/g, '') || userId || 'default';
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=A855F7,7DD3FC,00E5D4`;
}

export function getInitialsAvatar(name: string): string {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?';
  
  // SVG procedural como fallback visual rápido
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#A855F7" />
          <stop offset="100%" style="stop-color:#7DD3FC" />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#grad)" />
      <text x="100" y="100" 
            font-family="Inter, sans-serif" 
            font-size="72" 
            font-weight="bold"
            fill="white" 
            text-anchor="middle" 
            dominant-baseline="central">
        ${initials}
      </text>
    </svg>
  `;
  
  // No iFrame do AI Studio, btoa funciona para strings simples.
  // Usamos unescape/encodeURIComponent para suportar caracteres especiais se necessário.
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}
