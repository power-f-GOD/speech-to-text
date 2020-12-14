import React, {
  useState,
  useCallback,
  useEffect,
  FormEvent,
  useRef
} from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import FormatBoldIcon from '@material-ui/icons/FormatBold';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import FormatUnderlinedIcon from '@material-ui/icons/FormatUnderlined';
import CopyIcon from '@material-ui/icons/FilterNone';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

type AppFontTypes =
  | 'Sans-serif'
  | 'Sans'
  | 'Quicksand'
  | 'Dancing Script'
  | 'Google Sans';

const fonts: AppFontTypes[] = [
  'Quicksand',
  'Sans-serif',
  'Sans',
  'Google Sans',
  'Dancing Script'
];

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
  const [selectedFont, setSelectedFont] = useState<AppFontTypes>('Quicksand');

  const editorRef = useRef<HTMLElement | null>(null);
  const interimTranscriptRef = useRef<HTMLElement | null>(null);

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

  const makeSelectionBold = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      document.execCommand('bold');
    },
    []
  );

  const makeSelectionItalic = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      document.execCommand('italic');
    },
    []
  );

  const makeSelectionUnderlined = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      document.execCommand('underline');
    },
    []
  );

  const handleFontSelect = useCallback(
    (font: AppFontTypes) => (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      const button = e.currentTarget as HTMLButtonElement;

      setSelectedFont(font);
      document.execCommand('fontName', false, font);
      button.blur();
    },
    []
  );

  const copyEditorTextToClipBoard = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
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
      <Container fluid as='header'>
        <h1>R Speech-to-Text App</h1>
        <Container className='mx-0 tool-bar justify-content-start my-2'>
          <IconButton
            className={`tool-bar__button mr-1`}
            onClick={makeSelectionBold}>
            <FormatBoldIcon />
          </IconButton>
          <IconButton
            className={`tool-bar__button mr-1`}
            onClick={makeSelectionItalic}>
            <FormatItalicIcon />
          </IconButton>
          <IconButton
            className={`tool-bar__button mr-1`}
            onClick={makeSelectionUnderlined}>
            <FormatUnderlinedIcon />
          </IconButton>
          <Container className='font-select-container mx-1'>
            <Button
              className='select-font__button justify-content-between'
              style={{ fontFamily: selectedFont }}>
              <span className='d-inline-block'>{selectedFont}</span>
              <ExpandMoreIcon />
            </Button>
            <Container className='fonts-container slide-in-bottom'>
              {fonts.map((font) => (
                <Button
                  onClick={handleFontSelect(font)}
                  className={`${font === selectedFont ? 'active' : ''}`}
                  style={{ fontFamily: font }}
                  key={font}>
                  {font}
                </Button>
              ))}
            </Container>
          </Container>
        </Container>
      </Container>
      <Container fluid className='text-area-container px-0'>
        <Row
          className='text-area'
          contentEditable={true}
          suppressContentEditableWarning={true}
          onInput={triggerEdit}
          onCut={triggerEdit}
          onPaste={triggerEdit}
          dangerouslySetInnerHTML={{
            __html: finalTranscript
              ? finalTranscript
              : interimTranscript
              ? ''
              : 'Content here is editable... \n\nNB: Say "new line/paragraph" for a new line or paragraph; "full stop" for a full stop.'
          }}
          ref={editorRef as any}></Row>
        <div className='interim-transcript' ref={interimTranscriptRef as any}>
          {interimTranscript ? interimTranscript : ''}
        </div>
      </Container>
      <Row as='footer' className='footer mx-0'>
        <Col className='px-1' xs={9}>
          <IconButton
            className={`tool-bar__button mr-1`}
            onClick={copyEditorTextToClipBoard}>
            <CopyIcon />
          </IconButton>
        </Col>
        <Col className='px-0'>
          <IconButton
            className={`mic-button ${isListening ? 'is-listening' : ''}`}
            onClick={startListening}>
            {isListening ? <MicOffIcon /> : <MicIcon />}
          </IconButton>
        </Col>
      </Row>
    </Container>
  );
};

function getSelectionRange(
  element: HTMLElement,
  collapseRange?: boolean
): Promise<Selection | null> {
  const range = document.createRange(); //Create a range (a range is a like the selection but invisible)
  const selection = window.getSelection(); //get the selection object (allows you to change selection);
  //Firefox, Chrome, Opera, Safari, IE 9+

  range.selectNodeContents(element); //Select the entire contents of the element with the range

  if (collapseRange) {
    range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
  }

  selection?.removeAllRanges(); //remove any selections already made
  selection?.addRange(range); //make the range you have just created the visible selection

  return Promise.resolve(selection);
}

export default Paper;
