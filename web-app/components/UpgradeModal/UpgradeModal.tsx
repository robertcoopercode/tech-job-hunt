import React, { useState, useEffect } from 'react';
import { StripeProvider, injectStripe, Elements, CardElement } from 'react-stripe-elements';
import {
    Box,
    ModalBody,
    ModalFooter,
    Button,
    useToast,
    RadioButtonGroup,
    IRadio,
    Text,
} from '@robertcooper/chakra-ui-core';
import { useQuery, useMutation } from '@apollo/react-hooks';
import Modal from '../Modal/Modal';
import { useStripeScript } from '../../utils/hooks/useStripeScript';
import Loader from '../Loader/Loader';
import { CurrentUserQuery } from '../../graphql/generated/CurrentUserQuery';
import { currentUserQuery } from '../../graphql/queries';
import { UpgradeUserMutation, UpgradeUserMutationVariables } from '../../graphql/generated/UpgradeUserMutation';
import { upgradeUserMutation, checkSubscriptionPaymentHasSucceededMutation } from '../../graphql/mutations';
import { BillingFrequency } from '../../graphql/generated/graphql-global-types';
import { CheckSubscriptionPaymentHasSucceededMutation } from '../../graphql/generated/CheckSubscriptionPaymentHasSucceededMutation';

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

const CustomRadio: React.FC<IRadio> = React.forwardRef((props, ref) => {
    const { isChecked, isDisabled, value, ...rest } = props;

    return (
        <Button
            ref={ref}
            variantColor={isChecked ? 'blue' : 'gray'}
            size="xs"
            aria-checked={isChecked}
            role="radio"
            isDisabled={isDisabled}
            {...rest}
        >
            {value}
        </Button>
    );
});

CustomRadio.displayName = 'CustomRadio';

const pricingPlanDetails = {
    [BillingFrequency.YEARLY]: {
        id: process.env.COMMON_STRIPE_YEARLY_PLAN_ID as string,
        monthlyPrice: 4,
    },
    [BillingFrequency.MONTHLY]: {
        id: process.env.COMMON_STRIPE_MONTHLY_PLAN_ID as string,
        monthlyPrice: 8,
    },
};

const Checkout = injectStripe<{ onClose: () => void }>(({ stripe, onClose }) => {
    const toast = useToast();
    const [isValidatingStripePayment, setIsValidatingStripePayment] = useState(false);
    const [frequency, setFrequency] = useState(BillingFrequency.YEARLY);
    const { data: currentUser, loading } = useQuery<CurrentUserQuery>(currentUserQuery);
    const [upgradeUser, { loading: loadingUpgradeUser }] = useMutation<
        UpgradeUserMutation,
        UpgradeUserMutationVariables
    >(upgradeUserMutation, {
        refetchQueries: [
            {
                query: currentUserQuery,
            },
        ],
    });
    const [
        checkSubscriptionPaymentHasSucceeded,
        { loading: loadingCheckSubscriptionPaymentHasSucceeded },
    ] = useMutation<CheckSubscriptionPaymentHasSucceededMutation>(checkSubscriptionPaymentHasSucceededMutation, {
        refetchQueries: [
            {
                query: currentUserQuery,
            },
        ],
    });

    const displaySuccessToast = (): void => {
        toast({
            title: 'Payment successful',
            description: 'You successfully purchased a premium subscription.',
            status: 'success',
            duration: 2000,
            isClosable: true,
            position: 'top',
        });
        onClose();
    };

    const displayErrorToast = (): void => {
        toast({
            title: 'Payment failed',
            description: `There's was a problem with the payment.`,
            status: 'error',
            duration: 2000,
            isClosable: true,
            position: 'top',
        });
    };

    const handlePayment = async (): Promise<void> => {
        if (stripe && currentUser?.me?.email) {
            const { paymentMethod, error } = await stripe.createPaymentMethod('card', {
                billing_details: {
                    email: currentUser?.me?.email,
                },
            });
            if (error) {
                displayErrorToast();
                return;
            }
            if (paymentMethod) {
                upgradeUser({
                    variables: {
                        email: currentUser?.me?.email,
                        paymentMethodId: paymentMethod.id,
                        planId: pricingPlanDetails[frequency].id,
                        card: {
                            brand: paymentMethod.card?.brand,
                            expMonth: paymentMethod.card?.exp_month,
                            expYear: paymentMethod.card?.exp_year,
                            last4Digits: paymentMethod.card?.last4,
                        },
                    },
                })
                    .then(data => {
                        try {
                            if (
                                data.data?.upgradeUser.status === 'requires_action' &&
                                data.data?.upgradeUser.clientSecret
                            ) {
                                setIsValidatingStripePayment(true);
                                stripe.handleCardPayment(data.data?.upgradeUser.clientSecret).then(async result => {
                                    if (result.error) {
                                        setIsValidatingStripePayment(false);
                                        displayErrorToast();
                                    } else {
                                        const response = await checkSubscriptionPaymentHasSucceeded();
                                        if (response.data?.checkSubscriptionPaymentHasSucceeded) {
                                            displaySuccessToast();
                                        } else {
                                            displayErrorToast();
                                        }
                                        setIsValidatingStripePayment(false);
                                    }
                                });
                            } else {
                                displaySuccessToast();
                            }
                        } catch {
                            displayErrorToast();
                        }
                    })
                    .catch(() => {
                        displayErrorToast();
                    });
            }
        }
    };

    return (
        <>
            <ModalBody>
                {loading ? (
                    <Loader />
                ) : (
                    <Box>
                        <Box d="flex" justifyContent="center" mb={6}>
                            <RadioButtonGroup
                                defaultValue={frequency}
                                onChange={(val): void => setFrequency(val as BillingFrequency)}
                                isInline
                            >
                                <CustomRadio value={BillingFrequency.MONTHLY}>Monthly</CustomRadio>
                                <CustomRadio value={BillingFrequency.YEARLY}>Yearly</CustomRadio>
                            </RadioButtonGroup>
                        </Box>
                        <Text mb={6}>
                            {`You will be billed $${
                                frequency === BillingFrequency.MONTHLY
                                    ? pricingPlanDetails[frequency].monthlyPrice
                                    : pricingPlanDetails[frequency].monthlyPrice * 12
                            } per ${frequency === BillingFrequency.MONTHLY ? 'month' : 'year'}.`}
                        </Text>
                        <Box mb={6}>
                            <CardElement />
                        </Box>
                    </Box>
                )}
            </ModalBody>
            <ModalFooter>
                <Button size="sm" variant="ghost">
                    Cancel
                </Button>
                <Button
                    ml={4}
                    size="sm"
                    variantColor="purple"
                    isLoading={
                        loading ||
                        loadingUpgradeUser ||
                        loadingCheckSubscriptionPaymentHasSucceeded ||
                        isValidatingStripePayment
                    }
                    onClick={handlePayment}
                >
                    Pay
                </Button>
            </ModalFooter>
        </>
    );
});

const UpgradeModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const [stripeInstance, setStripeInstance] = useState<stripe.Stripe | null>(null);
    const [loaded] = useStripeScript();

    useEffect(() => {
        if (window.Stripe && loaded) {
            setStripeInstance(window.Stripe(process.env.WEB_APP_STRIPE_PUBLISHABLE_KEY as string));
        }
    }, [loaded]);

    return (
        <Modal isOpen={isOpen} title="Upgrade" size="md" onClose={onClose}>
            <StripeProvider stripe={stripeInstance}>
                <Elements>
                    <Checkout onClose={onClose} />
                </Elements>
            </StripeProvider>
        </Modal>
    );
};

export default UpgradeModal;
