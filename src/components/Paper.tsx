import React, { useState, useCallback, useEffect, FormEvent } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import IconButton from '@material-ui/core/IconButton';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';

const SpeechRecognition$ =
  window.SpeechRecognition || (window as any).webkitSpeechRecognition;

let recognition: SpeechRecognition | null = null;
let finalTranscript$ = '';

if (SpeechRecognition$) {
  recognition = new SpeechRecognition$();
}

const Paper = () => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [finalTranscript, setFinalTranscript] = useState<string>('');
  const [interimTranscript, setInterimTranscript] = useState<string>('');

  const startListening = useCallback(() => {
    if (recognition) {
      recognition.lang = 'en-UK';
      recognition[isListening ? 'stop' : 'start']();
    }
  }, [isListening]);

  const triggerEdit = useCallback((e: FormEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;

    finalTranscript$ = target.textContent || finalTranscript$;
    e.persist();
  }, []);

  useEffect(() => {
    if (recognition) {
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        if (finalTranscript$) {
          finalTranscript$ += ' ';
          setFinalTranscript(finalTranscript$);
        }
        setIsListening(true);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (e: SpeechRecognitionEvent) => {
        const len = e.results.length;
        let interimTranscript = '';
        let i = e.resultIndex;

        for (; i < len; ++i) {
          let t = e.results[i][0].transcript;

          if (e.results[i].isFinal) {
            finalTranscript$ += t;
          } else {
            interimTranscript += t;
          }
        }

        setFinalTranscript(finalTranscript$);
        setInterimTranscript(interimTranscript);
      };
    }
  }, []);

  return (
    <Container className='Paper scale-in'>
      <Container fluid as='header'>
        <h1>R Speech-to-Text App</h1>
      </Container>
      <Container fluid className='text-area-container px-0'>
        <Row
          className='text-area'
          contentEditable={true}
          suppressContentEditableWarning={true}
          onInput={triggerEdit}
          onCut={triggerEdit}
          onPaste={triggerEdit}>
          {finalTranscript
            ? finalTranscript
            : 'Content here is editable... \n\nNB: Say "new line/paragraph" for a new line or paragraph; "full stop" for a full stop.'}
          <span className='interim-transcript'>
            {interimTranscript ? interimTranscript : ''}
          </span>
        </Row>
      </Container>
      <Container as='footer' className='footer'>
        <IconButton
          className={`mic-button ${isListening ? 'is-listening' : ''}`}
          onClick={startListening}>
          {isListening ? <MicOffIcon /> : <MicIcon />}
        </IconButton>
      </Container>
    </Container>
  );
};

export default Paper;
