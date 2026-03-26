export const colors = {
  bg: '#0a0a0b',
  surface: '#111113',
  surface2: '#18181b',
  surface3: '#222225',
  border: '#2a2a2e',
  border2: '#3a3a3e',
  text: '#e4e4e7',
  textDim: '#a1a1aa',
  textMuted: '#71717a',
  amber: '#f59e0b',
  amberDim: '#b45309',
  amberBg: 'rgba(245,158,11,0.06)',
  green: '#34d399',
  greenDim: '#059669',
  greenBg: 'rgba(52,211,153,0.06)',
  blue: '#60a5fa',
  blueDim: '#2563eb',
  blueBg: 'rgba(96,165,250,0.06)',
  orange: '#fb923c',
  orangeDim: '#ea580c',
  orangeBg: 'rgba(251,146,60,0.06)',
  red: '#f87171',
  redBg: 'rgba(248,113,113,0.06)',
  purple: '#a78bfa',
  purpleBg: 'rgba(167,139,250,0.06)',
  cyan: '#22d3ee',
};

export const fonts = {
  body: 'System',
  mono: 'monospace',
};

export const rpeColor = (cls: string) => {
  switch (cls) {
    case 'low': return colors.green;
    case 'mid': return colors.amber;
    case 'high': return colors.orange;
    case 'max': return colors.red;
    default: return colors.textMuted;
  }
};

export const badgeColor = (type: string) => {
  switch (type) {
    case 'warmup': return { bg: colors.blueBg, text: colors.blue };
    case 'feeler': return { bg: colors.purpleBg, text: colors.purple };
    case 'working': return { bg: colors.greenBg, text: colors.green };
    default: return { bg: colors.surface2, text: colors.textDim };
  }
};
