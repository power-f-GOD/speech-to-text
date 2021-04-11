import React, { useState } from 'react';

import SnackBar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Slide from '@material-ui/core/Slide';
import Fade from '@material-ui/core/Fade';

export interface SnackbarState {
  open?: boolean;
  message?: string;
  severity?: 'error' | 'info' | 'success' | 'warning';
  autoHide?: boolean;
  timeout?: number;
}

export const SnackbarContext = React.createContext<
  (callback: (state: SnackbarState) => SnackbarState) => void
>(() => {});

const Snackbar = (props: {
  snackbar: SnackbarState;
  setSnackbarState: Function;
}) => {
  const { snackbar, setSnackbarState } = props;
  const { open, message, severity, autoHide, timeout: _timeout } = snackbar;
  const windowWidth = window.innerWidth;
  let timeout: any;

  const [closed, setClosed] = useState<boolean>(false);

  const handleClose = (_event?: any, reason?: string) => {
    clearTimeout(timeout);

    if (reason === 'clickaway' && !autoHide) return;

    setClosed(true);
    setSnackbarState((prev: SnackbarState) => ({ ...prev, open: false }));
    timeout = setTimeout(() => setClosed(false), 500);
  };

  return (
    <Slide
      direction={closed ? (windowWidth < 576 ? 'down' : 'left') : 'down'}
      in={open && !closed}
      mountOnEnter
      unmountOnExit
      timeout={windowWidth < 576 ? (closed ? 200 : 250) : closed ? 300 : 350}>
      <SnackBar
        open
        onClose={handleClose}
        onEntered={() => setClosed(false)}
        TransitionComponent={Fade}
        autoHideDuration={_timeout ? _timeout : autoHide ? 4000 : null}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}>
        <MuiAlert
          elevation={6}
          variant='filled'
          severity={severity}
          onClose={handleClose}>
          {message}
        </MuiAlert>
      </SnackBar>
    </Slide>
  );
};

export default Snackbar;
