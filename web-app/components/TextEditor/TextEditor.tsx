import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@robertcooper/chakra-ui-core';

type Props = {
    id?: string;
    onChange: (v?: string) => void;
    onBlur?: () => void;
    placeholder?: string;
    value: string;
};

let ReactQuill: any;

const TextEditor: React.FC<Props> = ({ id, ...props }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const containerRef = useRef<HTMLDivElement>();
    const quillRef = useRef<HTMLDivElement>();

    useEffect(() => {
        if (document !== undefined) {
            // Must import this only if rendering on the client side since the library relies on the document
            // existing
            ReactQuill = require('react-quill');
            if (containerRef.current) {
                containerRef.current.addEventListener('click', e => {
                    e.stopPropagation();
                });
            }
            setIsLoaded(true);
        }
    }, []);

    // Add the id the the contenteditable div. Important for managing focus.
    useEffect(() => {
        if (isLoaded && quillRef.current && id) {
            const editorRef = containerRef.current?.querySelector('.ql-editor') as HTMLDivElement;
            editorRef.setAttribute('id', id);
        }
    }, [id, isLoaded]);

    return (
        <Box ref={containerRef}>
            {isLoaded ? (
                <ReactQuill
                    theme="snow"
                    modules={{
                        toolbar: ['bold', 'underline', 'italic', 'link'],
                        keyboard: { bindings: { tab: false } },
                    }}
                    ref={quillRef}
                    {...props}
                />
            ) : null}
        </Box>
    );
};

export default TextEditor;
