import React, { useState, useMemo } from 'react';
import {} from 'react-router-dom';

import Box from '@material-ui/core/Box';

import Paper from './components/Paper';
import Snackbar, {
  SnackbarState,
  SnackbarContext
} from './components/SnackBar';

const App = () => {
  const [_snackbarState, setSnackbarState] = useState<SnackbarState>({
    message: '',
    severity: 'info',
    timeout: 5000,
    autoHide: true,
    open: false
  });
  const snackbarState = useMemo(() => _snackbarState, [_snackbarState]);

  return (
    <Box className='App fade-in' position='relative'>
      <SnackbarContext.Provider value={setSnackbarState}>
        <Paper />
      </SnackbarContext.Provider>

      <Snackbar snackbar={snackbarState} setSnackbarState={setSnackbarState} />
    </Box>
  );
};

export default App;
