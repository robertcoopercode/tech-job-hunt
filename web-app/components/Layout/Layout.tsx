import { css, SerializedStyles } from '@emotion/core';
import Link from 'next/link';
import { useMutation, useApolloClient } from '@apollo/react-hooks';
import { forwardRef, useState, useRef, CSSProperties } from 'react';
import { rgba } from 'polished';
import { useRouter, Router } from 'next/router';
import {
    MdInput,
    MdSettings,
    MdMenu,
    MdDomain,
    MdWork,
    MdInsertDriveFile,
    MdDashboard,
    MdShowChart,
} from 'react-icons/md';
import {
    Box,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    Text,
    AlertDialogBody,
    AlertDialogFooter,
    Button,
    useDisclosure,
    Link as ChakraLink,
    IconButton,
    ModalOverlay,
    AlertIcon,
    Alert,
    CloseButton,
    useToast,
} from '@robertcooper/chakra-ui-core';
import Logo from '../Logo/Logo';
import { mediaQueries, styled, customTheme } from '../../utils/styles/theme';
import logoPng from '../../assets/icons/logo.png';
import Tooltip from '../Tooltip/Tooltip';
import SettingsModal from '../SettingsModal/SettingsModal';
import { logoutMutation, requestVerifyEmailMutation } from '../../graphql/mutations';
import { LogoutMutation } from '../../graphql/generated/LogoutMutation';
import { CurrentUserQuery } from '../../graphql/generated/CurrentUserQuery';
import { RequestVerifyEmailMutation } from '../../graphql/generated/RequestVerifyEmailMutation';

const SkipToContent = styled(ChakraLink)<{ linkPosition: 'start' | 'end' }>`
    clip: rect(1px, 1px, 1px, 1px);
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    white-space: nowrap;
    padding: 4px;
    background: ${customTheme.colors.purple[500]};
    color: ${customTheme.colors.white};
    ${({ linkPosition }): SerializedStyles =>
        linkPosition === 'start'
            ? css`
                  top: 0;
                  left: 0;
              `
            : css`
                  bottom: 0;
                  right: 0;
              `}

    &:focus {
        z-index: 2;
        width: auto;
        height: auto;
        clip: auto;
    }
`;

const StyledMenuItems = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: ${customTheme.space[16]};
    align-items: center;
`;

const menuItemHeight = '54px';

const StyledMenuItem = styled.a<{ as?: string; isActive?: boolean }>`
    height: ${menuItemHeight};
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    color: ${customTheme.colors.gray[400]};
    position: relative;

    &:hover {
        background: ${rgba(customTheme.colors.blue[500], 0.1)};
    }

    ${({ isActive }): SerializedStyles | undefined | false =>
        isActive &&
        css`
            background: ${rgba(customTheme.colors.blue[500], 0.1)};
            &::before {
                content: '';
                background: ${customTheme.colors.blue[500]};
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                width: 2px;
            }
        `}

    ${mediaQueries.md} {
        padding-left: unset;
        justify-content: center;
    }
`;

const MenuIcon = styled(Box)`
    margin-left: ${customTheme.space[6]};
    margin-right: ${customTheme.space[5]};
`;

type MenuItemBase = { icon: any; name: string };

type LinkMenuItem = { route: string } & MenuItemBase;

type ButtonButtonItem = { onClick: () => void; isActive: boolean } & MenuItemBase;

type MenuItem = LinkMenuItem | ButtonButtonItem;

const sidebarWidth = 80;

const animationDuration = 125;

const StyledLayout = styled.div`
    min-height: 100vh;
    position: relative;
`;

const MobileMenuButton = styled(IconButton)`
    z-index: 1;
    position: absolute;
    top: ${customTheme.space[4]};
    left: ${customTheme.space[4]};
`;

const MobileMenuButtonInMenu = styled(IconButton)`
    margin: ${customTheme.space[4]};
`;

const MenuText = styled(Text)`
    ${mediaQueries.md} {
        display: none;
    }
`;

const MobileMenu = styled(Box)<{ show?: boolean; animateIn?: boolean }>`
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    overflow: scroll;
    display: ${(props): CSSProperties['display'] => (props.show ? 'flex' : 'none')};
    z-index: 1;

    &.show {
        display: flex;
    }

    &.animate-in {
        transform: translateX(0);
    }

    transition: transform ${animationDuration}ms ease-in-out;

    ${mediaQueries.md} {
        display: none;
    }
`;

const MobileMenuContents = styled(Box)`
    height: 100%;
    width: 200px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    background: ${customTheme.colors.white};
    z-index: ${customTheme.zIndices.modal};
`;

const SideBar = styled.div`
    position: fixed;
    overflow: scroll;
    height: 100%;
    min-height: 100vh;
    left: 0;
    top: 0;
    background: ${customTheme.colors.white};
    border-right: 1px solid ${customTheme.colors.gray[200]};
    flex-direction: column;
    align-items: center;
    padding-top: ${customTheme.space[20]};
    padding-bottom: ${customTheme.space[10]};
    width: ${sidebarWidth}px;
    z-index: 1;
    display: none;

    ${mediaQueries.md} {
        display: flex;
    }
`;

const Main = styled.main`
    position: relative;
    padding: ${customTheme.space[20]} ${customTheme.space[5]};

    ${mediaQueries.md} {
        padding: ${customTheme.space[20]} ${customTheme.space[16]};
        margin-left: ${sidebarWidth}px;
    }
`;

const LogoImageLink = styled.a`
    height: ${menuItemHeight};
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    padding-left: ${customTheme.space[6]};
    padding-right: ${customTheme.space[6]};

    ${mediaQueries.md} {
        padding-left: unset;
        padding-right: unset;
        justify-content: center;
    }
`;

const LogoImage = styled.img`
    width: 125px;
    object-fit: contain;

    ${mediaQueries.md} {
        width: 24px;
    }
`;

const ForwardedRefMenuItem = forwardRef<
    HTMLAnchorElement,
    { name: string; pathname: string; route: string; Icon: React.ElementType; isActive?: boolean; onClick?: () => void }
>(({ name, pathname, route, Icon, isActive, ...props }, ref) => (
    <Tooltip aria-label={name} label={name} placement="right">
        <StyledMenuItem
            aria-label={name}
            isActive={isActive !== undefined ? isActive : pathname === route}
            ref={ref}
            {...props}
        >
            <MenuIcon as={Icon} size={'24px'} color="gray.400" />
            <MenuText>{name}</MenuText>
        </StyledMenuItem>
    </Tooltip>
));

const MenuItems: React.FC<{ pathname: Router['pathname']; menuItems: MenuItem[]; onClick?: () => void }> = ({
    pathname,
    menuItems,
    onClick,
}) => {
    return (
        <StyledMenuItems>
            {menuItems.map(({ icon: Icon, name, ...rest }) =>
                'onClick' in rest ? (
                    <Tooltip key={name} aria-label={name} label={name} placement="right">
                        <StyledMenuItem
                            as="button"
                            aria-label={name}
                            onClick={(): void => {
                                rest.onClick();
                                onClick && onClick();
                            }}
                            isActive={rest.isActive}
                        >
                            <MenuIcon as={MdSettings} size={'24px'} color="gray.400" />
                            <MenuText>{name}</MenuText>
                        </StyledMenuItem>
                    </Tooltip>
                ) : (
                    <Link key={name} href={rest.route} passHref>
                        <ForwardedRefMenuItem
                            name={name}
                            pathname={pathname}
                            route={rest.route}
                            Icon={Icon}
                            onClick={onClick}
                        />
                    </Link>
                )
            )}
        </StyledMenuItems>
    );
};

type Props = {
    user: CurrentUserQuery['me'];
};

const Layout: React.FC<Props> = ({ children, user }) => {
    const client = useApolloClient();
    const toast = useToast();
    const [showMenu, setShowMenu] = useState(false);
    const [isShowingEmailVerificationWarning, setIsShowingEmailVerificationWarning] = useState(true);
    const [requestVerifyEmail] = useMutation<RequestVerifyEmailMutation>(requestVerifyEmailMutation, {
        onCompleted: () => {
            toast({
                title: 'Email sent',
                description: `Click the link in your email to verify your email`,
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top',
            });
        },
        onError: () => {
            toast({
                title: 'Error',
                description: `Unable to send verification email`,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top',
            });
        },
    });
    const { isOpen: isOpenSettings, onClose: onCloseSettings, onOpen: onOpenSettings } = useDisclosure();
    const [isOpen, setIsOpen] = useState(false);
    const onClose = (): void => setIsOpen(false);
    const cancelRef = useRef(null);

    const [logout, { loading }] = useMutation<LogoutMutation>(logoutMutation, {
        onCompleted: () => client.resetStore(),
    });

    const router = useRouter();

    if (!router) {
        return null;
    }

    const menuItems: MenuItem[] = [
        {
            icon: MdDashboard,
            name: 'Dashboard',
            route: '/',
        },
        {
            icon: MdWork,
            name: 'Jobs',
            route: '/jobs',
        },
        {
            icon: MdDomain,
            name: 'Companies',
            route: '/companies',
        },
        {
            icon: MdInsertDriveFile,
            name: 'Resumes',
            route: '/resumes',
        },
        {
            icon: MdShowChart,
            name: 'Analytics',
            route: '/analytics',
        },
        {
            icon: MdSettings,
            name: 'Settings',
            onClick: onOpenSettings,
            isActive: false,
        },
    ];

    const handleToggleMenu = (): void => {
        setShowMenu(!showMenu);
    };

    return (
        <StyledLayout>
            <SkipToContent tabIndex={0} href="#main-content" linkPosition="start" id="skip-to-content">
                Skip to content
            </SkipToContent>
            <MobileMenuButton
                onClick={handleToggleMenu}
                variant="unstyled"
                fontSize="24px"
                d="flex"
                icon={(): any => <MdMenu color={customTheme.colors.gray[400]} />}
                aria-label={'Show menu'}
            />
            <MobileMenu show={showMenu}>
                <ModalOverlay onClick={handleToggleMenu} />
                <MobileMenuContents>
                    <MobileMenuButtonInMenu
                        onClick={handleToggleMenu}
                        variant="unstyled"
                        fontSize="24px"
                        d="flex"
                        icon={(): any => <MdMenu color={customTheme.colors.gray[400]} />}
                        aria-label="Hide menu"
                    />
                    <MenuItems
                        pathname={router.pathname}
                        menuItems={menuItems}
                        onClick={(): void => setShowMenu(false)}
                    />
                    <Box d="flex" flexDirection="column" width="100%" marginTop="auto">
                        <Tooltip aria-label={'Logout'} label={'Logout'} placement="right">
                            <StyledMenuItem as="button" aria-label={'Logout'} onClick={(): void => setIsOpen(true)}>
                                <MenuIcon as={MdInput} size={'24px'} color="gray.400" />
                                <MenuText>Logout</MenuText>
                            </StyledMenuItem>
                        </Tooltip>
                        <Tooltip label={'www.techjobhunt.com'} placement="right" aria-label="www.techjobhunt.com">
                            <LogoImageLink
                                href={process.env.WEB_APP_MARKETING_SITE}
                                aria-label="Go to www.techjobhunt.com"
                            >
                                <Logo />
                            </LogoImageLink>
                        </Tooltip>
                    </Box>
                </MobileMenuContents>
            </MobileMenu>
            <SideBar>
                <MenuItems pathname={router.pathname} menuItems={menuItems} />
                <Box d="flex" flexDirection="column" width="100%" marginTop="auto">
                    <Tooltip aria-label={'Logout'} label={'Logout'} placement="right">
                        <StyledMenuItem as="button" aria-label={'Logout'} onClick={(): void => setIsOpen(true)}>
                            <MenuIcon as={MdInput} size={'24px'} color="gray.400" />
                            <MenuText>Logout</MenuText>
                        </StyledMenuItem>
                    </Tooltip>
                    <Tooltip label={'www.techjobhunt.com'} placement="right" aria-label="www.techjobhunt.com">
                        <LogoImageLink key="www.techjobhunt.com" href={process.env.WEB_APP_MARKETING_SITE}>
                            <LogoImage src={logoPng} alt="Tech Job Hunt Logo" />
                        </LogoImageLink>
                    </Tooltip>
                </Box>
            </SideBar>
            <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
                <AlertDialogOverlay />
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <Text as="span" fontSize="xl">
                            Logout
                        </Text>
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        <Text>Are you sure you want to logout?</Text>
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button size="sm" ref={cancelRef} onClick={onClose} fontWeight={500}>
                            Cancel
                        </Button>
                        <Button
                            size="sm"
                            variantColor="red"
                            isLoading={loading}
                            onClick={(): void => {
                                logout();
                            }}
                            ml={3}
                            fontWeight={500}
                        >
                            Logout
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <SettingsModal isOpen={isOpenSettings} onClose={onCloseSettings} />
            <Main id="main-content">
                {user?.hasVerifiedEmail === false && isShowingEmailVerificationWarning && (
                    <Alert status="warning" mb={6}>
                        <AlertIcon />
                        <Text marginY={0}>
                            {`Your account email is not verified. Please click the verification link in your email to verify
                        your email. `}
                            <Button
                                ml={1}
                                mr={1}
                                height="auto"
                                fontWeight={600}
                                fontSize="inherit"
                                variant="unstyled"
                                onClick={(): void => {
                                    requestVerifyEmail();
                                }}
                            >
                                Click here
                            </Button>{' '}
                            to resend verification email.
                        </Text>
                        <CloseButton
                            onClick={(): void => setIsShowingEmailVerificationWarning(false)}
                            position="absolute"
                            right="8px"
                            top="6px"
                        />
                    </Alert>
                )}
                {children}
            </Main>
            <SkipToContent tabIndex={0} href="#skip-to-content" linkPosition="end">
                Go back to start
            </SkipToContent>
        </StyledLayout>
    );
};

export default Layout;
