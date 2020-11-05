import React, { useState, createContext } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Box from '@material-ui/core/Box';

const App = () => {
  return (
    <Box className='App fade-in' position='relative'>
      <h1>Welcome to your Speech-to-Text App</h1>
    </Box>
  );
};

export default App;