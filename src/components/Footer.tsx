import React, { useCallback, MouseEvent, useContext } from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import IconButton from '@material-ui/core/IconButton';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import Tooltip from '@material-ui/core/Tooltip';

import FAIcon from './Icon';
import { editorRef } from './TextArea';

import { getSelectionRange } from '../utils/misc';
import { SnackbarContext } from './SnackBar';

const Footer = (props: {
  isListening: boolean;
  finalTranscript: string;
  startListening(e: MouseEvent<HTMLButtonElement>): void;
  setFinalTranscript(transcript: string): void;
  stillInProgress?(): void;
}) => {
  const {
    isListening,
    finalTranscript,
    startListening,
    setFinalTranscript,
    stillInProgress
  } = props;
  const setSnackbarState = useContext(SnackbarContext);

  const copyEditorTextToClipBoard = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      getSelectionRange(editorRef.current!).then((selection) => {
        document.execCommand('copy');
        selection?.removeAllRanges();
        setSnackbarState((prev) => ({
          ...prev,
          open: true,
          message: 'Transcript copied to clipboard!',
          severity: 'info',
          timeout: 1250
        }));
      });
    },
    [setSnackbarState]
  );

  const downloadText = useCallback(() => {
    const a = document.createElement('a');

    setSnackbarState((prev) => ({
      ...prev,
      message: 'Preparing...',
      open: true,
      severity: 'info',
      timeout: 1500
    }));
    a.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(finalTranscript)
    );
    a.setAttribute(
      'download',
      (finalTranscript || 'transcript')
        .slice(0, 32)
        .replace(/<.*>|[^a-zA-Z0-9\s_-]/g, '')
    );
    a.click();
  }, [finalTranscript, setSnackbarState]);

  const clearTranscript = useCallback(() => {
    setFinalTranscript('');
    setSnackbarState((prev) => ({
      ...prev,
      open: true,
      message: 'Transcript cleared!',
      severity: 'info',
      timeout: 1000
    }));
  }, [setFinalTranscript, setSnackbarState]);

  return (
    <Row as='footer' className='footer mx-0'>
      <Col className='d-flex flex-row-reverse px-1' xs={9}>
        <Tooltip title='Copy transcript to clipboard'>
          <IconButton
            className={`tool-bar__button mr-1 mr-sm-2 ${
              !finalTranscript ? 'Mui-disabled' : ''
            }`}
            onClick={copyEditorTextToClipBoard}
            tabIndex={finalTranscript ? 0 : -1}>
            <FAIcon name='copy' variant='outlined' />
          </IconButton>
        </Tooltip>

        <Tooltip title='Download transript'>
          <IconButton
            className={`tool-bar__button mr-1 mr-sm-2 ${
              !finalTranscript ? 'Mui-disabled' : ''
            }`}
            onClick={downloadText}
            tabIndex={finalTranscript ? 0 : -1}>
            <FAIcon name='file-download' />
          </IconButton>
        </Tooltip>

        <Tooltip title='Print transript'>
          <IconButton
            className={`tool-bar__button mr-1 mr-sm-2 ${
              !finalTranscript ? 'Mui-disabled' : ''
            }`}
            onClick={stillInProgress}
            tabIndex={finalTranscript ? 0 : -1}>
            <FAIcon name='print' />
          </IconButton>
        </Tooltip>

        <Tooltip title='Clear transript'>
          <IconButton
            className={`tool-bar__button mx-1 mx-sm-2 ${
              !finalTranscript ? 'Mui-disabled' : ''
            }`}
            onClick={clearTranscript}
            tabIndex={finalTranscript ? 0 : -1}>
            <FAIcon name='trash-alt' />
          </IconButton>
        </Tooltip>
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
