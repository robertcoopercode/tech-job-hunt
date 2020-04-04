import React from 'react';
import styled from '@emotion/styled';
import { Tooltip as ChakraTooltip, TooltipProps } from '@robertcooper/chakra-ui-core';

type Props = {} & TooltipProps;

const StyledTooltip = styled(ChakraTooltip)`
    padding: 6px;
    text-align: center;
    font-weight: normal;
    z-index: 1500; /* the modal z-index is 1400 */

    /* Gets rid of buggy arrow shadow */
    & [x-arrow]::before {
        display: none;
    }
`;

const Tooltip: React.FC<Props> = ({ children, ...props }) => {
    return <StyledTooltip {...props}>{children}</StyledTooltip>;
};

export default Tooltip;
