import React, { useState } from 'react';
import { Text, Input, Button, useToast, InputGroup, InputRightElement } from '@robertcooper/chakra-ui-core';
import { Formik, Form, FormikConfig } from 'formik';
import * as Yup from 'yup';
import { useMutation } from '@apollo/react-hooks';
import { useRouter } from 'next/router';
import { signupPasswordValidationSchema } from '../components/LoginOrSignup/LoginOrSignup';
import { requestResetPasswordMutation, resetPasswordMutation } from '../graphql/mutations';
import { PageProps } from './_app';

type ResetPasswordFormSchema = Yup.InferType<typeof signupPasswordValidationSchema>;

const initialResetPasswordFormValues: ResetPasswordFormSchema = { password: '', confirmPassword: '' };

const requestPasswordResetFormSchema = Yup.object().shape({
    email: Yup.string().email('Email is invalid').required('Email is required'),
});

type RequestPasswordResetFormSchema = Yup.InferType<typeof requestPasswordResetFormSchema>;

const initialRequestPasswordResetFormValues: RequestPasswordResetFormSchema = { email: '' };

type Props = {} & PageProps;

const ResetPassword: React.FC<Props> = ({ query }) => {
    const toast = useToast();
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const shouldDisplayResetPassword = query && query.resetToken !== undefined;

    const [requestResetPassword, { loading: loadingRequestResetPassword }] = useMutation(requestResetPasswordMutation, {
        onError: (error) => {
            toast({
                title: 'Error',
                description: error.graphQLErrors[0].message,
                status: 'error',
                duration: 2000,
                isClosable: true,
                position: 'top',
            });
        },
        onCompleted: () => {
            toast({
                title: 'Password reset link sent',
                description: `You should receive a password reset link in your email`,
                status: 'success',
                duration: 2000,
                isClosable: true,
                position: 'top',
            });
        },
    });
    const [resetPassword, { loading: loadingResetPassword }] = useMutation(resetPasswordMutation, {
        onError: (error) => {
            toast({
                title: 'Error',
                description: error.graphQLErrors[0].message,
                status: 'error',
                duration: 2000,
                isClosable: true,
                position: 'top',
            });
        },
        onCompleted: () => {
            toast({
                title: 'Password reset',
                description: `Your password has been successfully updated`,
                status: 'success',
                duration: 2000,
                isClosable: true,
                position: 'top',
            });
            router.push('/login');
        },
    });

    const handleResetPassword: FormikConfig<ResetPasswordFormSchema>['onSubmit'] = async (
        values,
        { setSubmitting }
    ) => {
        await resetPassword({
            variables: {
                password: values.password,
                confirmPassword: values.confirmPassword,
                resetToken: query && query.resetToken,
            },
        });
        setSubmitting(false);
    };

    const handleResetPasswordRequest: FormikConfig<RequestPasswordResetFormSchema>['onSubmit'] = async (
        values,
        { setSubmitting }
    ) => {
        await requestResetPassword({
            variables: {
                email: values.email,
            },
        });
        setSubmitting(false);
    };

    return shouldDisplayResetPassword ? (
        <>
            <Text mb={5} fontSize="md" color="gray.500" lineHeight={1.3}>
                Set a new password for your account.
            </Text>
            <Formik
                initialValues={initialResetPasswordFormValues}
                onSubmit={handleResetPassword}
                validationSchema={signupPasswordValidationSchema}
            >
                {({ values, handleChange, handleBlur, errors, touched }): JSX.Element => (
                    <Form id={'reset-password'}>
                        <InputGroup mb={2}>
                            <Input
                                isInvalid={errors.password !== undefined && touched.password}
                                pr="4.5rem"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Password"
                            />
                            <InputRightElement width="4.5rem">
                                <Button h="1.75rem" size="sm" onClick={(): void => setShowPassword(!showPassword)}>
                                    {showPassword ? 'Hide' : 'Show'}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                        {errors.password !== undefined && touched.password && (
                            <Text color="red.500" mt={1} mb={2}>
                                {errors.password}
                            </Text>
                        )}
                        <InputGroup mb={2}>
                            <Input
                                isInvalid={errors.confirmPassword !== undefined && touched.confirmPassword}
                                pr="4.5rem"
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={values.confirmPassword}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Confirm password"
                            />
                            <InputRightElement width="4.5rem">
                                <Button
                                    h="1.75rem"
                                    size="sm"
                                    onClick={(): void => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? 'Hide' : 'Show'}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                        {errors.confirmPassword !== undefined && touched.confirmPassword && (
                            <Text color="red.500">{errors.confirmPassword}</Text>
                        )}
                        <Button
                            mt={4}
                            variantColor="purple"
                            width="100%"
                            type="submit"
                            isLoading={loadingResetPassword}
                        >
                            Reset password
                        </Button>
                    </Form>
                )}
            </Formik>
        </>
    ) : (
        <Formik
            initialValues={initialRequestPasswordResetFormValues}
            validationSchema={requestPasswordResetFormSchema}
            onSubmit={handleResetPasswordRequest}
        >
            {({ values, handleBlur, handleChange, errors, touched }): JSX.Element => (
                <Form id="request-reset-password">
                    <Text mb={5} fontSize="md" color="gray.500" lineHeight={1.3}>
                        Enter your email in order to receive a link to reset your password.
                    </Text>
                    <Input
                        type="text"
                        placeholder="Email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                    {errors.email !== undefined && touched.email && (
                        <Text color="red.500" mt={1}>
                            {errors.email}
                        </Text>
                    )}
                    <Button
                        mt={4}
                        type="submit"
                        variantColor="purple"
                        width="100%"
                        isLoading={loadingRequestResetPassword}
                    >
                        Reset password
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

export default ResetPassword;
