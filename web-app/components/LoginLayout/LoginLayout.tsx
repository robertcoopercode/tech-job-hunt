import React from 'react';
import { Box, Link } from '@robertcooper/chakra-ui-core';
import Logo from '../Logo/Logo';

type Props = {};

const LoginLayout: React.FC<Props> = ({ children }) => {
    return (
        <Box
            d="flex"
            flexDirection="column"
            width="100%"
            padding={10}
            minHeight={'100vh'}
            height="100%"
            alignItems="center"
        >
            <Box alignSelf="flex-start">
                <Link
                    href={process.env.WEB_APP_MARKETING_SITE ?? ''}
                    _hover={{
                        textDecoration: 'none',
                    }}
                    _focus={{
                        boxShadow: 'none',
                    }}
                >
                    <Logo />
                </Link>
            </Box>
            <Box width="320px" marginY={48}>
                {children}
            </Box>
        </Box>
    );
};

export default LoginLayout;
