"use client";

import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material';
import { Noto_Sans_JP, Noto_Sans } from 'next/font/google';
import CssBaseline from '@mui/material/CssBaseline';

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900']
});
const notoSansEn = Noto_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900']
});

const fontFamily = `${notoSansJP.style.fontFamily}, ${notoSansEn.style.fontFamily}`;

export function ThemeProvider({ children }: { children: React.ReactNode }) {

  const primaryColor = "#171717";
  const secondaryColor = "#dc005c";
  const background = "#ffffff";
  const foreground = "#171717";

  const theme = createTheme({
    typography: {
      fontFamily: fontFamily
    },
    palette: {
      primary: {
        main: primaryColor,
      },
      secondary: {
        main: secondaryColor,
      },
      background: {
        default: background,
      },
      text: {
        primary: foreground,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '0.5rem',
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: '0.5rem',
          },
        },
      },
    },
  });

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
}