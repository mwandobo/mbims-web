export const colors = {
    primary: {
        50:  '#e8f0f8',
        100: '#c5d9ec',
        200: '#9fbfdf',
        300: '#78a5d2',
        400: '#5b91c8',
        500: '#3e7dbe',
        600: '#2f6eaf',
        700: '#245c9b',
        800: '#1a4b87',
        900: '#0D4C91', // brand
        DEFAULT: '#0D4C91',
    },

    secondary: {
        50:  '#fef3e9',
        100: '#fde0c4',
        200: '#fbc99b',
        300: '#f9b172',
        400: '#f79e53',
        500: '#f58b34',
        600: '#E87927', // brand
        700: '#d06a1f',
        800: '#b85b18',
        900: '#9a4a12',
        DEFAULT: '#E87927',
    },

    gray: {
        50:  '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
        DEFAULT: '#6b7280',
    },

    success: {
        light: '#dcfce7',
        DEFAULT: '#16a34a',
        dark: '#15803d',
    },
    warning: {
        light: '#fef3c7',
        DEFAULT: '#d97706',
        dark: '#b45309',
    },
    error: {
        light: '#fee2e2',
        DEFAULT: '#dc2626',
        dark: '#b91c1c',
    },
    info: {
        light: '#e0f2fe',
        DEFAULT: '#0284c7',
        dark: '#0369a1',
    },

    white: '#ffffff',
    black: '#000000',
    transparent: 'transparent',
} as const;

export type Colors = typeof colors;