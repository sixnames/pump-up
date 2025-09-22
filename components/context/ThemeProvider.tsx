'use client';

import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from 'next-themes';
import * as React from 'react';

interface OdThemeProviderProps extends ThemeProviderProps {}

export default function ThemeProvider({ children, ...props }: OdThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
