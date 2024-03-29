import React, {
  useState,
  useCallback,
  useEffect,
  useContext,
  FormEvent
} from 'react';

import Container from 'react-bootstrap/Container';

import Header from './Header';
import TextArea, { editorRef } from './TextArea';
import Footer from './Footer';

import { getSelectionRange } from '../utils/misc';
import { SnackbarContext } from './SnackBar';

const SpeechRecognition$ =
  window.SpeechRecognition || (window as any).webkitSpeechRecognition;
const synthesis =
  window.speechSynthesis || (window as any).webkitSpeechSynthesis;

let recognition: SpeechRecognition | null = null;
let finalTranscript$ = '';
let lastDebounceTranscript = ''; // use this for prevent duplicate transcript (for mobile)

if (SpeechRecognition$ && synthesis) {
  recognition = new SpeechRecognition$();
} else {
  alert(
    'Sorry, Speech Recognition/Synthesis is not supported on this browser. Please, use a supported browser like Chrome.'
  );
}

const Paper = () => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  // this is for to ensure mic button was clicked to stop recording on mobile, else just start listening again
  const [micIsOn, setMicIsOn] = useState<boolean>(false);
  const [finalTranscript, setFinalTranscript] = useState<string>(
    'Content here is editable... \n\nNB: Say "new line/paragraph" for a new line or paragraph; "full stop" for a full stop.'
  );
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const setSnackbarState = useContext(SnackbarContext);

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

    // if (finalTranscript$) setFinalTranscript(finalTranscript$);
  }, []);

  const playText = useCallback(() => {
    const utterance = new SpeechSynthesisUtterance(
      editorRef.current?.textContent || ''
    );

    utterance.voice = voice;
    utterance.rate = 0.9;
    setIsSpeaking((speaking) => {
      if (!speaking) {
        synthesis.speak(utterance);
      } else {
        synthesis.cancel();
      }

      return !speaking;
    });
  }, [voice]);

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
        setSnackbarState((prev) => ({
          ...prev,
          message: 'Listening... Say something.',
          open: true,
          severity: 'info',
          timeout: 2500
        }));

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
  }, [setSnackbarState]);

  useEffect(() => {
    setTimeout(() => {
      const voices = synthesis.getVoices();
      let voice: SpeechSynthesisVoice | undefined = voices[52];

      if (voice?.name !== 'Samantha') {
        voice = voices.find((voice) => voice.name === 'Samantha');
      }

      setVoice(voice || voices[0]);
    }, 200);
  }, []);

  return (
    <Container className='Paper scale-in'>
      <Header />
      <TextArea
        interimTranscript={interimTranscript}
        finalTranscript={finalTranscript}
        triggerEdit={triggerEdit}
      />
      <Footer
        isSpeaking={isSpeaking}
        isListening={isListening}
        finalTranscript={finalTranscript}
        startListening={startListening}
        setFinalTranscript={setFinalTranscript}
        playText={playText}
      />
    </Container>
  );
};

export default Paper;
