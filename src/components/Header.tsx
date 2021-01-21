import React, {
  useState,
  useCallback,
  useEffect,
  FormEvent,
  useRef,
  MouseEvent
} from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import FormatColorTextRoundedIcon from '@material-ui/icons/FormatColorTextRounded';
import FormatColorFillRoundedIcon from '@material-ui/icons/FormatColorFillRounded';

import FAIcon from './Icon';
import { getSelectionRange } from '../utils/misc';

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

const Header = (props: {
  stillInProgress?(e: MouseEvent<HTMLButtonElement>): void;
}) => {
  const { stillInProgress } = props;

  const [selectedFont, setSelectedFont] = useState<AppFontTypes>('Quicksand');

  const makeSelectionBold = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    document.execCommand('bold');
  }, []);

  const makeSelectionItalic = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      document.execCommand('italic');
    },
    []
  );

  const makeSelectionUnderlined = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      document.execCommand('underline');
    },
    []
  );

  const handleFontSelect = useCallback(
    (font: AppFontTypes) => (e: MouseEvent<HTMLButtonElement>) => {
      const button = e.currentTarget as HTMLButtonElement;

      setSelectedFont(font);
      document.execCommand('fontName', false, font);
      button.blur();
    },
    []
  );

  return (
    <Container fluid as='header'>
      <h1>Ruth's Speech-to-Text App</h1>
      <Container className='mx-0 tool-bar justify-content-start my-2'>
        <IconButton
          className={`tool-bar__button mr-1`}
          onClick={makeSelectionBold}>
          <FAIcon name='bold' fontSize='0.75em' />
        </IconButton>
        <IconButton
          className={`tool-bar__button mr-1`}
          onClick={makeSelectionItalic}>
          <FAIcon name='italic' fontSize='0.75em' />
        </IconButton>
        <IconButton
          className={`tool-bar__button mr-1`}
          onClick={makeSelectionUnderlined}>
          <FAIcon name='underline' fontSize='0.75em' />
        </IconButton>
        <Container className='font-select-container mx-1'>
          <Button
            className='select-font__button justify-content-between'
            style={{ fontFamily: selectedFont }}>
            <span className='d-inline-block'>{selectedFont}</span>
            <FAIcon name='chevron-down' fontSize='0.75em' />
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
        <IconButton
          className={`tool-bar__button ml-1 mr-1`}
          onClick={stillInProgress}>
          <FormatColorTextRoundedIcon />
        </IconButton>
        <IconButton
          className={`tool-bar__button mr-1`}
          onClick={stillInProgress}>
          <FormatColorFillRoundedIcon />
        </IconButton>
        <IconButton
          className={`tool-bar__button mr-1`}
          onClick={stillInProgress}>
          <FAIcon name='list-ol' fontSize='0.75em' />
        </IconButton>
        <IconButton
          className={`tool-bar__button mr-1`}
          onClick={stillInProgress}>
          <FAIcon name='list-ul' fontSize='0.75em' />
        </IconButton>
        <IconButton
          className={`tool-bar__button mr-1`}
          onClick={stillInProgress}>
          <FAIcon name='image' fontSize='0.75em' />
        </IconButton>
        <IconButton
          className={`tool-bar__button mr-1`}
          onClick={stillInProgress}>
          <FAIcon name='link' fontSize='0.75em' />
        </IconButton>
      </Container>
    </Container>
  );
};

export default Header;
