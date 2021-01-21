import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  FormEvent,
  MouseEvent
} from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import IconButton from '@material-ui/core/IconButton';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';

import FAIcon from './Icon';
import Header from './Header';
import TextArea, { editorRef, interimTranscriptRef } from './TextArea';
import Footer from './Footer';

import { getSelectionRange } from '../utils/misc';

const SpeechRecognition$ =
  window.SpeechRecognition || (window as any).webkitSpeechRecognition;

let recognition: SpeechRecognition | null = null;
let finalTranscript$ = '';
let lastDebounceTranscript = ''; // use this for prevent duplicate transcript (for mobile)

if (SpeechRecognition$) {
  recognition = new SpeechRecognition$();
}

const Paper = () => {
  const [isListening, setIsListening] = useState<boolean>(false);
  // this is for to ensure mic button was clicked to stop recording on mobile, else just start listening again
  const [micIsOn, setMicIsOn] = useState<boolean>(false);
  const [finalTranscript, setFinalTranscript] = useState<string>('');
  const [interimTranscript, setInterimTranscript] = useState<string>('');

  const startListening = useCallback(() => {
    if (recognition) {
      recognition.lang = 'en-UK';
      recognition[isListening ? 'stop' : 'start']();
    }

    setMicIsOn((isOn) => !isOn);
  }, [isListening]);

  const triggerEdit = useCallback((e: FormEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;

    finalTranscript$ = target.innerHTML || finalTranscript$;
    e.persist();
  }, []);

  const stillInProgress = useCallback(() => {
    alert('Feature still under construction.');
  }, []);

  useEffect(() => {
    if (recognition) {
      recognition.onend = () => {
        if (micIsOn) {
          recognition?.start();
        } else {
          setIsListening(false);
          setInterimTranscript('');
        }
      };
    }
  }, [micIsOn]);

  useEffect(() => {
    if (recognition) {
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setInterimTranscript('Listening...');

        if (finalTranscript$) {
          finalTranscript$ += ' ';
          setFinalTranscript(finalTranscript$);
        }
        setIsListening(true);
      };

      recognition.addEventListener('error', (e: Event) => {
        const ev = e as any;

        if (!/no-speech/i.test(ev.error)) {
          setIsListening(false);
          setMicIsOn(false);

          if (/network/i.test(ev.error)) {
            alert(
              !navigator.onLine
                ? "You're offline. Please, connect to the internet."
                : 'An unknown network error occurred.\n\nPlease, ensure you have an active internet connection.'
            );
          } else {
            console.error('An error occurred: ', e, (e as any).error);
          }
        }
      });

      recognition.onresult = (e: SpeechRecognitionEvent) => {
        const len = e.results.length;
        let interimTranscript = '';
        let i = e.resultIndex;

        for (; i < len; ++i) {
          const { transcript: t, confidence } = e.results[i][0];
          const { isFinal } = e.results[i];

          if (isFinal && confidence >= 0.5) {
            if (lastDebounceTranscript !== t || !finalTranscript$) {
              finalTranscript$ += t;
            }

            lastDebounceTranscript = t;
          } else {
            interimTranscript += t;
          }
        }

        setFinalTranscript(finalTranscript$);
        setInterimTranscript(interimTranscript);
        getSelectionRange(editorRef.current!, true);
      };
    }
  }, []);

  return (
    <Container className='Paper scale-in'>
      <Header stillInProgress={stillInProgress} />
      <TextArea
        interimTranscript={interimTranscript}
        finalTranscript={finalTranscript}
        triggerEdit={triggerEdit}
      />
      <Footer
        isListening={isListening}
        startListening={startListening}
        stillInProgress={stillInProgress}
      />
    </Container>
  );
};

export default Paper;
