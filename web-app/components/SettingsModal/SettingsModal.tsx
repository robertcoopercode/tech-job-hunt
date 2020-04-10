import {
    Button,
    Text,
    ModalBody,
    useDisclosure,
    Box,
    AlertIcon,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
    useToast,
    ModalFooter,
    Alert,
} from '@robertcooper/chakra-ui-core';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { format } from 'date-fns';
import { Elements, StripeProvider, injectStripe, CardElement } from 'react-stripe-elements';
import { useEffect, useRef, useState } from 'react';
import { CurrentUserQuery } from '../../graphql/generated/CurrentUserQuery';
import { currentUserQuery } from '../../graphql/queries';
import Loader from '../Loader/Loader';
import UpgradeModal from '../UpgradeModal/UpgradeModal';
import { BillingFrequency } from '../../graphql/generated/graphql-global-types';
import DeleteAccountModal from '../DeleteAccountModal/DeleteAccountModal';
import { styled, customTheme } from '../../utils/styles/theme';
import { CancelSubscriptionMutation } from '../../graphql/generated/CancelSubscriptionMutation';
import {
    cancelSubscriptionMutation,
    updateCreditCardMutation,
    requestVerifyEmailMutation,
} from '../../graphql/mutations';
import { useStripeScript } from '../../utils/hooks/useStripeScript';
import {
    UpdateCreditCardMutation,
    UpdateCreditCardMutationVariables,
} from '../../graphql/generated/UpdateCreditCardMutation';
import Modal from '../Modal/Modal';
import { RequestVerifyEmailMutation } from '../../graphql/generated/RequestVerifyEmailMutation';

const Section = styled(Box)`
    &:first-of-type {
        margin-top: 0;
    }
    &:last-of-type {
        margin-bottom: 0;
    }
`;

Section.defaultProps = {
    marginY: customTheme.space[6],
};

const SectionTitle = styled(Text)``;

SectionTitle.defaultProps = {
    mt: 0,
    fontWeight: 'semibold',
};

const ChangeCard = injectStripe<{ onClose: () => void; currentUserData: CurrentUserQuery }>(
    ({ stripe, onClose, currentUserData }) => {
        const toast = useToast();
        const [isCallingStripe, setIsCallingStripe] = useState(false);
        const [updateCreditCard, { loading: loadingUpdateCreditCardMutation }] = useMutation<
            UpdateCreditCardMutation,
            UpdateCreditCardMutationVariables
        >(updateCreditCardMutation, {
            refetchQueries: [
                {
                    query: currentUserQuery,
                },
            ],
        });

        const displaySuccessToast = (): void => {
            toast({
                title: 'Successfully updated',
                description: 'Your credit card has been successfully updated.',
                status: 'success',
                duration: 2000,
                isClosable: true,
                position: 'top',
            });
            onClose();
        };

        const displayErrorToast = (): void => {
            toast({
                title: 'Failed to update',
                description: `There's was a problem adding your credit card.`,
                status: 'error',
                duration: 2000,
                isClosable: true,
                position: 'top',
            });
        };

        const handleUpdateCardDetails = async (): Promise<void> => {
            if (stripe && currentUserData?.me?.email) {
                setIsCallingStripe(true);
                const { paymentMethod, error } = await stripe.createPaymentMethod('card', {
                    billing_details: {
                        email: currentUserData?.me?.email,
                    },
                });
                if (error) {
                    displayErrorToast();
                    return;
                }
                if (paymentMethod) {
                    try {
                        await updateCreditCard({
                            variables: {
                                card: {
                                    brand: paymentMethod.card?.brand,
                                    expMonth: paymentMethod.card?.exp_month,
                                    expYear: paymentMethod.card?.exp_year,
                                    last4Digits: paymentMethod.card?.last4,
                                    stripePaymentMethodId: paymentMethod.id,
                                },
                            },
                        });
                        displaySuccessToast();
                    } catch {
                        displayErrorToast();
                    }
                }
                setIsCallingStripe(false);
            }
            onClose();
        };

        return (
            <Box mt={6} mb={6}>
                <CardElement />
                <Box mt={4} d="flex" justifyContent="flex-end">
                    <Button size="xs" variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        ml={4}
                        size="xs"
                        variantColor="purple"
                        isLoading={isCallingStripe || loadingUpdateCreditCardMutation}
                        onClick={handleUpdateCardDetails}
                    >
                        Update
                    </Button>
                </Box>
            </Box>
        );
    }
);

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

const SettingsModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const { data: currentUserData, loading: currentUserLoading } = useQuery<CurrentUserQuery>(currentUserQuery);
    const { isOpen: isOpenUpgrade, onClose: onCloseUpgrade, onOpen: onOpenUpgrade } = useDisclosure();
    const { isOpen: isOpenDeleteAccount, onClose: onCloseDeleteAccount, onOpen: onOpenDeleteAccount } = useDisclosure();
    const toast = useToast();
    const [isOpenConfirmCancellation, setIsOpenConfirmCancellation] = useState(false);
    const [stripeInstance, setStripeInstance] = useState<stripe.Stripe | null>(null);
    const [isChangingPayment, setIsChangingPayment] = useState(false);
    const [cancelSubscription, { loading: loadingCancelSubscription }] = useMutation<CancelSubscriptionMutation>(
        cancelSubscriptionMutation,
        {
            refetchQueries: [
                {
                    query: currentUserQuery,
                },
            ],
        }
    );
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
    const cancelRef = useRef(null);
    const [loaded] = useStripeScript();

    useEffect(() => {
        if (window.Stripe && loaded) {
            setStripeInstance(window.Stripe(process.env.WEB_APP_STRIPE_PUBLISHABLE_KEY as string));
        }
    }, [loaded]);

    const getPremiumText = (): string => {
        return `Premium
        ${currentUserData?.me?.Billing?.billingFrequency === BillingFrequency.MONTHLY ? '(Monthly)' : '(Yearly)'}`;
    };

    const getFormattedRenewalDate = (): string => {
        return currentUserData?.me?.Billing?.endOfBillingPeriod
            ? `${format(new Date(currentUserData?.me?.Billing?.endOfBillingPeriod * 1000), 'MMMM do, yyyy')}`
            : '';
    };

    const getRenewalText = (): string => {
        return `${
            currentUserData?.me?.Billing?.willCancelAtEndOfPeriod ? 'Ends on ' : 'Automatically renews on '
        }${getFormattedRenewalDate()}`;
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} title={'Settings'} size="md">
                <ModalBody>
                    {currentUserLoading ? (
                        <Loader />
                    ) : (
                        <>
                            <Section>
                                <SectionTitle>Current User</SectionTitle>
                                <Text>{currentUserData?.me?.email}</Text>
                            </Section>
                            <Section>
                                <SectionTitle fontWeight="semibold">Plan</SectionTitle>
                                {currentUserData?.me?.Billing?.isPremiumActive ? (
                                    // User's that have been given free premium account status will not have a stripe customer ID
                                    currentUserData.me.Billing.stripeCustomerId === null ? (
                                        <>
                                            <Text mt={0} mb={1}>
                                                Premium for life 🚀
                                            </Text>
                                        </>
                                    ) : (
                                        <>
                                            <Text mt={0} mb={1}>
                                                {getPremiumText()}
                                            </Text>
                                            {currentUserData?.me?.Billing?.endOfBillingPeriod !== null && (
                                                <Text as="span" color="gray.400" d="block" mb={1} fontSize="xs">
                                                    {getRenewalText()}
                                                </Text>
                                            )}
                                            {!currentUserData?.me?.Billing?.willCancelAtEndOfPeriod && (
                                                <Button
                                                    onClick={(): void => setIsOpenConfirmCancellation(true)}
                                                    variant="link"
                                                    size="xs"
                                                    fontWeight="medium"
                                                    variantColor="gray"
                                                >
                                                    Cancel subscription
                                                </Button>
                                            )}
                                        </>
                                    )
                                ) : (
                                    <>
                                        <Text d="flex" alignItems="center">
                                            Free{' '}
                                            {currentUserData?.me?.hasVerifiedEmail !== false && (
                                                <Button
                                                    size="xs"
                                                    ml={2}
                                                    variant="link"
                                                    variantColor="purple"
                                                    onClick={onOpenUpgrade}
                                                >
                                                    (Upgrade)
                                                </Button>
                                            )}
                                        </Text>
                                        {currentUserData?.me?.hasVerifiedEmail === false && (
                                            <Alert status="warning" mb={6}>
                                                <AlertIcon />
                                                <Text marginY={0}>
                                                    {`You cannot upgrade to premium until you've verified your email. `}
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
                                                    to resend the verification email.
                                                </Text>
                                            </Alert>
                                        )}
                                    </>
                                )}
                            </Section>
                            {currentUserData?.me?.Billing?.isPremiumActive && currentUserData?.me?.Billing?.Card && (
                                <Section>
                                    <SectionTitle fontWeight="semibold">Billing Method</SectionTitle>
                                    <Text marginTop={0} marginBottom={1} fontWeight="medium">
                                        {currentUserData.me.Billing.Card?.brand?.[0]?.toUpperCase() +
                                            currentUserData.me.Billing.Card?.brand?.substring(1)}
                                    </Text>
                                    <Text mt={0} mb={1}>
                                        {currentUserData?.me?.Billing?.Card?.last4Digits} (Expires on{' '}
                                        {currentUserData?.me?.Billing?.Card?.expMonth}/
                                        {currentUserData?.me?.Billing?.Card?.expMonth})
                                    </Text>
                                    <Button
                                        variant="link"
                                        size="xs"
                                        fontWeight="medium"
                                        variantColor="gray"
                                        onClick={(): void => setIsChangingPayment(true)}
                                    >
                                        Change card
                                    </Button>
                                    {isChangingPayment && (
                                        <StripeProvider stripe={stripeInstance}>
                                            <Elements>
                                                <ChangeCard
                                                    onClose={(): void => setIsChangingPayment(false)}
                                                    currentUserData={currentUserData}
                                                />
                                            </Elements>
                                        </StripeProvider>
                                    )}
                                </Section>
                            )}
                            <Section>
                                <SectionTitle fontWeight="semibold">Account</SectionTitle>
                                <Button
                                    onClick={onOpenDeleteAccount}
                                    variant="link"
                                    size="xs"
                                    fontWeight="medium"
                                    variantColor="red"
                                >
                                    Delete account
                                </Button>
                            </Section>
                        </>
                    )}
                </ModalBody>
                <ModalFooter />
            </Modal>
            <UpgradeModal isOpen={isOpenUpgrade} onClose={onCloseUpgrade} />
            <DeleteAccountModal isOpen={isOpenDeleteAccount} onClose={onCloseDeleteAccount} />
            <AlertDialog
                isOpen={isOpenConfirmCancellation}
                leastDestructiveRef={cancelRef}
                onClose={(): void => setIsOpenConfirmCancellation(false)}
            >
                <AlertDialogOverlay />
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <Text as="span" fontSize="xl">
                            Cancel subscription
                        </Text>
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        <Text>
                            Are you sure you want to end your premium subscription? You will retain the premium
                            subscription benefits until the end of your current billing cycle which is on{' '}
                            {getFormattedRenewalDate()}.
                        </Text>
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button
                            size="sm"
                            ref={cancelRef}
                            onClick={(): void => setIsOpenConfirmCancellation(false)}
                            fontWeight={500}
                        >
                            Cancel
                        </Button>
                        <Button
                            size="sm"
                            variantColor="red"
                            isLoading={loadingCancelSubscription}
                            onClick={(): void => {
                                cancelSubscription();
                            }}
                            ml={3}
                            fontWeight={500}
                        >
                            Confirm
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default SettingsModal;
