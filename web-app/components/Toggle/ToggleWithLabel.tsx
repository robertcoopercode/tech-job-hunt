import React from 'react';
import { Box, Text, Switch, SwitchProps } from '@robertcooper/chakra-ui-core';

type Props = { label: string } & SwitchProps;

const ToggleWithLabel: React.FC<Props> = ({ label, ...props }) => {
    return (
        <Box d="flex" alignItems="center" mt={1}>
            <Switch {...props} />
            <Text as="label" {...{ htmlFor: props.id }} ml={2}>
                {label}
            </Text>
        </Box>
    );
};

export default ToggleWithLabel;
