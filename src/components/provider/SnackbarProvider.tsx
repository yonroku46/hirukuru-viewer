"use client";

import { SnackbarProvider as NotistackSnackbarProvider, useSnackbar, SnackbarKey } from 'notistack';
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close';

export default function SnackbarProvider({ children }: { children: React.ReactNode }) {

  function SnackbarAction({ id }: { id: SnackbarKey }) {
    const { closeSnackbar } = useSnackbar();
    return (
      <IconButton onClick={() => closeSnackbar(id)}>
        <CloseIcon fontSize="small" />
      </IconButton>
    );
  }

  return (
    <NotistackSnackbarProvider
      maxSnack={3}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      autoHideDuration={4500}
      preventDuplicate={true}
      action={(key) => <SnackbarAction id={key} />}
      classes={{
        root: "snackbar",
      }}
    >
      {children}
    </NotistackSnackbarProvider>
  );
}