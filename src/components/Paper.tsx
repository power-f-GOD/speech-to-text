import React from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import IconButton from '@material-ui/core/IconButton';
import MicIcon from '@material-ui/icons/Mic';

const Paper = () => {
  return (
    <Container className='Paper scale-in'>
      <Container fluid as='header'>
        <h1>R Speech-to-Text App</h1>
      </Container>
      <Container fluid className='text-area-container px-0'>
        <Row
          className='text-area'
          contentEditable={true}
          suppressContentEditableWarning={true}>
          Content here is editable...
        </Row>
      </Container>
      <Container as='footer' className='footer px-0'>
        <IconButton
          className='record'
          onClick={() => alert('Still under construction, baby. :D')}>
          <MicIcon />
        </IconButton>
      </Container>
    </Container>
  );
};

export default Paper;
