import React from 'react';
import { Button, ButtonProps } from '@robertcooper/chakra-ui-core';

type Props = {
    /* HTML attribute to put on a submit button when the button is outside of it's form (https://til.hashrocket.com/posts/v2s2gxgifj-submit-a-form-with-a-button-outside-the-form) */
    form?: string;
} & ButtonProps;

const ChakraButton: React.FC<Props> = ({ children, ...props }) => {
    return (
        <Button fontWeight={'medium'} size="sm" variantColor="purple" {...props}>
            {children}
        </Button>
    );
};

export default ChakraButton;
