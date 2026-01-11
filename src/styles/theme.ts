export const theme = {
  colors: {
    primary: '#222',
    primaryHover: '#000',
    background: '#f5f5f5',
    card: '#fff',
    border: '#e5e5e5',
    text: '#222',
    textSecondary: '#666',
    textMuted: '#999',
    error: '#dc2626',
    disabled: '#ccc',
  },
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  fontSize: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
  },
} as const;

export type Theme = typeof theme;
