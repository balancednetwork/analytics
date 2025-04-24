export const theme = {
  colors: {
    // Main colors
    primary: '#0c2a4d', // Teal accent color used in buttons and highlights
    secondary: '#1B2B3F', // Darker blue used in cards
    background: {
      primary: '#01002a', // Dark navy background
      secondary: '#0c2a4d', // Slightly lighter navy for cards
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#0c2a4d',
    },
    chart: '#40E0D0', // Chart line color
    success: '#34C759',
    error: '#FF3B30',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  typography: {
    fontFamily: "'TeX Gyre Adventor', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
    fontSize: {
      xs: '12px',
      small: '14px',
      medium: '16px',
      large: '20px',
      xl: '24px',
      xxl: '32px',
      huge: '48px',
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    }
  },
  breakpoints: {
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1280px',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },
  shadows: {
    card: '0 4px 6px rgba(0, 0, 0, 0.1)',
    elevated: '0 10px 20px rgba(0, 0, 0, 0.2)',
  },
  transitions: {
    fast: '0.1s ease-in-out',
    normal: '0.2s ease-in-out',
    slow: '0.3s ease-in-out',
  },
} as const;

export type Theme = typeof theme; 