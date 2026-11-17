import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ColorScheme = 'light' | 'dark';

export interface ThemeConfig {
  colors: {
    primary: {
      navy: string;
      teal: string;
    };
    neutral: {
      white: string;
      grey: string;
      navy: string;
    };
    background?: string;
    surface?: string;
    text?: string;
    textSecondary?: string;
  };
  fonts: {
    sans: string;
    display: string;
  };
  spacing: {
    grid: string;
    container: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  shadows: {
    soft: string;
    medium: string;
    large: string;
  };
}

const theme: ThemeConfig = {
  colors: {
    primary: {
      navy: '#0B1F3A',
      teal: '#24B8A6',
    },
    neutral: {
      white: '#FFFFFF',
      grey: '#F5F7FA',
      navy: '#182230',
    },
    background: '#FFFFFF',
    surface: '#F5F7FA',
    text: '#182230',
    textSecondary: '#6B7280',
  },
  fonts: {
    sans: 'Inter, system-ui, sans-serif',
    display: 'Inter, system-ui, sans-serif',
  },
  spacing: {
    grid: '8px',
    container: '24px',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
  shadows: {
    soft: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    medium: '0 4px 6px rgba(0, 0, 0, 0.10)',
    large: '0 10px 25px rgba(0, 0, 0, 0.08)',
  },
};

export { theme };

export const getTheme = (scheme: ColorScheme = 'light'): ThemeConfig => {
  return {
    ...theme,
    colors: {
      ...theme.colors,
      background: scheme === 'light' ? '#FFFFFF' : '#0B1F3A',
      surface: scheme === 'light' ? '#F5F7FA' : '#182230',
      text: scheme === 'light' ? '#182230' : '#FFFFFF',
      textSecondary: scheme === 'light' ? '#6B7280' : '#9CA3AF',
    },
  };
};