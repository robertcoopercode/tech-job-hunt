import React from 'react';
import { Text, Box, BoxProps } from '@robertcooper/chakra-ui-core';
import { typography, styled } from '../../utils/styles/theme';

const Title = styled(Text)`
    ${typography.caption};
    display: block;
`;

type Props = {
    title: string;
} & BoxProps;

const Section: React.FC<Props> = ({ children, title, ...props }) => {
    return (
        <Box {...props}>
            <Title as="span" mb={6}>
                {title}
            </Title>
            {children}
        </Box>
    );
};

export default Section;
