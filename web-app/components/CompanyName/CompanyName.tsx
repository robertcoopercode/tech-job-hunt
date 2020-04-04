import React from 'react';
import styled from '@emotion/styled';
import { Text, Box } from '@robertcooper/chakra-ui-core';
import { RoundedImageIcon } from '../../utils/styles/general';
import { customTheme } from '../../utils/styles/theme';

const RoundedImage = styled.img`
    ${RoundedImageIcon};
    margin-right: ${customTheme.space[2]};
`;

type Props = {
    imageUrl?: string | null;
    name: string;
    isBold?: boolean;
};

const CompanyName: React.FC<Props> = ({ imageUrl, name, isBold }) => {
    return (
        <Box d="flex" alignItems="center">
            {imageUrl && <RoundedImage src={`${imageUrl}&d=72x72`} crossOrigin="" />}
            <Text as="span" fontWeight={isBold ? 'medium' : undefined} title={name}>
                {name}
            </Text>
        </Box>
    );
};

export default CompanyName;
