import React, { createRef, FormEvent } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

export const editorRef = createRef<HTMLElement | null>();
export const appStatusRef = createRef<HTMLElement | null>();

const TextArea = (props: {
  interimTranscript: string;
  finalTranscript: string;
  triggerEdit(e: FormEvent<HTMLDivElement>): void;
}) => {
  const { interimTranscript, finalTranscript, triggerEdit } = props;

  return (
    <Container fluid className='text-area-container custom-scroll-bar px-0'>
      <Row
        className='text-area'
        contentEditable={true}
        suppressContentEditableWarning={true}
        onInput={triggerEdit}
        onCut={triggerEdit}
        onPaste={triggerEdit}
        dangerouslySetInnerHTML={{
          __html: finalTranscript
            ? finalTranscript +
              `<span class='theme-secondary-lighter'>${interimTranscript}</span>`
            : interimTranscript
        }}
        ref={editorRef as any}
      />
    </Container>
  );
};

export default TextArea;
