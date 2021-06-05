import React, { useState, useCallback, MouseEvent } from 'react';

import Container from 'react-bootstrap/Container';

import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import FormatColorTextRoundedIcon from '@material-ui/icons/FormatColorTextRounded';

import FAIcon from './Icon';

import { colorsArray } from '../utils/misc';
import { appStatusRef } from './TextArea';

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

const Header = () => {
  const [selectedFont, setSelectedFont] = useState<AppFontTypes>('Quicksand');

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

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

      document.execCommand('foreColor', false, color);
      button.blur();
    },
    []
  );

  const handleFontHilite = useCallback(
    (color: string) => (e: MouseEvent<HTMLButtonElement>) => {
      const button = e.currentTarget as HTMLButtonElement;

      document.execCommand('styleWithCSS', true);
      document.execCommand('hiliteColor', false, color);
      button.blur();
    },
    []
  );

  const handleListClick = useCallback(
    (ordered: boolean) => (e: MouseEvent<HTMLButtonElement>) => {
      document.execCommand(
        ordered ? 'insertOrderedList' : 'insertUnorderedList'
      );
    },
    []
  );

  const handleLinkifyClick = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    let selection = window.getSelection()?.toString();

    if (
      selection &&
      /[a-z0-9-_]+\.[a-z0-9-_]+/.test(selection) &&
      !/\s+/.test(selection)
    ) {
      if (!/^https?:\/\//.test(selection)) {
        selection = 'https://' + selection;
      }

      document.execCommand('createLink', false, selection);
    } else {
      appStatusRef.current!.textContent = 'Selection not a valid URI/URL!';
      setTimeout(() => {
        appStatusRef.current!.textContent = '';
      }, 3000);
    }
  }, []);

  const handleInsertImage = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log(e.currentTarget.files);

      if (e.currentTarget.files?.length) {
        document.execCommand(
          'insertImage',
          false,
          URL.createObjectURL(e.currentTarget.files[0])
        );
      }
    },
    []
  );

  const programmaticallyClickFileInput = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  return (
    <Container fluid as='header'>
      <h1 className='text-ellipsis'>Ruth's Speech-to-Text App</h1>
      <Container className='tool-bar px-1 custom-scroll-bar mx-0 d-flex align-items-center my-1'>
        {/* Bold */}
        <Tooltip title='Embolden text'>
          <IconButton
            className={`tool-bar__button mr-1`}
            onClick={makeSelectionBold}>
            <FAIcon name='bold' fontSize='0.75em' />
          </IconButton>
        </Tooltip>

        {/* Italic */}
        <Tooltip title='Italicize text'>
          <IconButton
            className={`tool-bar__button mr-1`}
            onClick={makeSelectionItalic}>
            <FAIcon name='italic' fontSize='0.75em' />
          </IconButton>
        </Tooltip>

        {/* Underline */}
        <Tooltip title='Underline text'>
          <IconButton
            className={`tool-bar__button mr-1`}
            onClick={makeSelectionUnderlined}>
            <FAIcon name='underline' fontSize='0.75em' />
          </IconButton>
        </Tooltip>

        {/* Font select */}
        <Container className='font-select-container mx-1'>
          <Tooltip title='Select Font'>
            <Button
              className='select-font__button justify-content-between'
              style={{ fontFamily: selectedFont }}>
              <span className='d-inline-block'>{selectedFont}</span>
              <FAIcon name='chevron-down' fontSize='0.75em' />
            </Button>
          </Tooltip>
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

        {/* Font Color select */}
        <Container className='color-select-container ml-1 mr-0'>
          <Tooltip title='Select Font Color'>
            <IconButton className={`tool-bar__button`}>
              <FormatColorTextRoundedIcon />
            </IconButton>
          </Tooltip>
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

        {/* Font Hilite Color select */}
        <Container className='color-select-container ml-1 mr-0'>
          <Tooltip title='Highlight text'>
            <IconButton className={`tool-bar__button mr-1`}>
              <FAIcon name='highlighter' fontSize='0.75em' />
            </IconButton>
          </Tooltip>
          <Container className='menu slide-in-bottom custom-scroll-bar'>
            {colorsArray.map((color) => (
              <IconButton
                className={`font-color p-1`}
                onClick={handleFontHilite(color)}
                key={color}>
                <FAIcon name='circle' fontSize='0.75em' color={color} />
              </IconButton>
            ))}
          </Container>
        </Container>

        {/* Ordered List */}
        <Tooltip title='Number List'>
          <IconButton
            className={`tool-bar__button mr-1`}
            onClick={handleListClick(true)}>
            <FAIcon name='list-ol' fontSize='0.75em' />
          </IconButton>
        </Tooltip>

        {/* Unordered List */}
        <Tooltip title='Bullet List'>
          <IconButton
            className={`tool-bar__button mr-1`}
            onClick={handleListClick(false)}>
            <FAIcon name='list-ul' fontSize='0.75em' />
          </IconButton>
        </Tooltip>

        {/* Insert Image */}
        <Tooltip title='Insert image'>
          <IconButton
            className={`tool-bar__button mr-1`}
            onClick={programmaticallyClickFileInput}>
            <FAIcon name='image' fontSize='0.75em' />
          </IconButton>
        </Tooltip>
        <input
          type='file'
          className='d-none'
          onChange={handleInsertImage}
          ref={fileInputRef}
        />
        {/* Linkify */}
        <Tooltip title='Linkify text'>
          <IconButton
            className={`tool-bar__button mr-1`}
            onClick={handleLinkifyClick}>
            <FAIcon name='link' fontSize='0.75em' />
          </IconButton>
        </Tooltip>
      </Container>
    </Container>
  );
};

export default Header;
