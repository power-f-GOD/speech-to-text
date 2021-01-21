import React, { useCallback, MouseEvent } from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import IconButton from '@material-ui/core/IconButton';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';

import FAIcon from './Icon';
import { editorRef, interimTranscriptRef } from './TextArea';

import { getSelectionRange } from '../utils/misc';

const Footer = (props: {
  isListening: boolean;
  startListening(e: MouseEvent<HTMLButtonElement>): void;
  stillInProgress?(): void;
}) => {
  const { isListening, startListening, stillInProgress } = props;

  const copyEditorTextToClipBoard = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      getSelectionRange(editorRef.current!).then((selection) => {
        document.execCommand('copy');
        selection?.removeAllRanges();
        interimTranscriptRef.current!.textContent =
          'Editor text copied to clipboard!';
        setTimeout(() => {
          interimTranscriptRef.current!.textContent = '';
        }, 3000);
      });
    },
    []
  );

  return (
    <Row as='footer' className='footer mx-0'>
      <Col className='d-flex flex-row-reverse px-1' xs={9}>
        <IconButton
          className={`tool-bar__button mr-1 mr-sm-2`}
          onClick={copyEditorTextToClipBoard}>
          <FAIcon name='copy' variant='outlined' />
        </IconButton>
        <IconButton
          className={`tool-bar__button mr-1 mr-sm-2`}
          onClick={stillInProgress}>
          <FAIcon name='file-download' />
        </IconButton>
        <IconButton
          className={`tool-bar__button mr-1 mr-sm-2`}
          onClick={stillInProgress}>
          <FAIcon name='print' />
        </IconButton>
        <IconButton
          className={`tool-bar__button mx-1 mx-sm-2`}
          onClick={stillInProgress}>
          <FAIcon name='trash-alt' />
        </IconButton>
      </Col>
      <Col className='px-0'>
        <IconButton
          className={`mic-button ${isListening ? 'is-listening' : ''} mr-1`}
          onClick={startListening}>
          {isListening ? <MicOffIcon /> : <MicIcon />}
        </IconButton>
      </Col>
    </Row>
  );
};

export default Footer;
