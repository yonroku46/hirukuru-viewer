"use client";

import { forwardRef } from 'react';
import { SnackbarProvider as NotistackSnackbarProvider, useSnackbar } from 'notistack';

import Alert from '@mui/material/Alert';

const ClickableSnackbar = forwardRef<HTMLDivElement, { id: string | number, message: string, variant: string }>(
  ({ id, message, variant }, ref) => {
    const { closeSnackbar } = useSnackbar();

    return (
      <Alert
        ref={ref}
        variant='filled'
        severity={variant === 'default' ? 'info' : variant as any}
        onClick={() => closeSnackbar(id)}
        sx={{ cursor: 'pointer', borderRadius: '2rem', boxShadow: 'var(--info-shadow)',
          '& .MuiAlert-message': { alignSelf: 'center' }
        }}
      >
        {message}
      </Alert>
    );
  }
);

ClickableSnackbar.displayName = 'ClickableSnackbar';

export default function SnackbarProvider({ children }: { children: React.ReactNode }) {
  return (
    <NotistackSnackbarProvider
      maxSnack={3}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      autoHideDuration={13500}
      preventDuplicate={true}
      classes={{
        root: "snackbar",
      }}
      Components={{
        default: ClickableSnackbar,
        error: ClickableSnackbar,
        success: ClickableSnackbar,
        warning: ClickableSnackbar,
        info: ClickableSnackbar,
      }}
    >
      {children}
    </NotistackSnackbarProvider>
  );
}