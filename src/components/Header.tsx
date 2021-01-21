import React, { useState, useCallback, MouseEvent } from 'react';

import Container from 'react-bootstrap/Container';

import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import FormatColorTextRoundedIcon from '@material-ui/icons/FormatColorTextRounded';
import FormatColorFillRoundedIcon from '@material-ui/icons/FormatColorFillRounded';

import FAIcon from './Icon';

import { colorsArray } from '../utils/misc';

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

  const handleFontColorSelect = useCallback(
    (color: string) => (e: MouseEvent<HTMLButtonElement>) => {
      const button = e.currentTarget as HTMLButtonElement;

      // setSelectedFontColor(color);
      document.execCommand('foreColor', false, color);
      button.blur();
    },
    []
  );

  return (
    <Container fluid as='header'>
      <h1 className='text-ellipsis'>Ruth's Speech-to-Text App</h1>
      <Container className='tool-bar custom-scroll-bar mx-0 d-flex justify-content-start my-2'>
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
          <Container className='menu slide-in-bottom'>
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
        <Container className='font-color-select-container ml-1 mr-1'>
          <IconButton className={`tool-bar__button`} onClick={undefined}>
            <FormatColorTextRoundedIcon />
          </IconButton>
          <Container className='menu slide-in-bottom custom-scroll-bar'>
            {colorsArray.map((color) => (
              <IconButton
                className={`font-color p-1`}
                onClick={handleFontColorSelect(color)}
                key={color}>
                <FAIcon name='circle' fontSize='0.75em' color={color} />
              </IconButton>
            ))}
          </Container>
        </Container>
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
