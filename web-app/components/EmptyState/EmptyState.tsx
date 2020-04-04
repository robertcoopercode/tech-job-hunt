import React from 'react';
import { Text, BoxProps, Box, ButtonProps } from '@robertcooper/chakra-ui-core';
import ChakraButton from '../ChakraButton/ChakraButton';

export type Props = {
    title: string;
    description: string;
    onClick: ButtonProps['onClick'];
    ctaText: string;
} & BoxProps;

const EmptyState: React.FC<Props> = ({ onClick, title, description, ctaText, ...props }) => {
    return (
        <Box textAlign="center" {...props}>
            <Text fontSize="md" fontWeight="medium">
                {title}
            </Text>
            <Text color="gray.500" maxWidth={400} margin="auto" marginBottom={4} lineHeight={1.4}>
                {description}
            </Text>
            <ChakraButton onClick={onClick}>{ctaText}</ChakraButton>
        </Box>
    );
};

export default EmptyState;
