import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import {
    Text,
    Box,
    Link,
    Divider,
    Input,
    InputGroup,
    InputRightElement,
    Button,
    useToast,
} from '@robertcooper/chakra-ui-core';
import { Formik, Form, FormikConfig, FormikTouched, FormikErrors } from 'formik';
import * as Yup from 'yup';
import { useMutation, useApolloClient } from '@apollo/react-hooks';
import { PageProps } from '../../pages/_app';
import { styled, customTheme } from '../../utils/styles/theme';
import Google from '../../assets/icons/google.svg';
import { signupMutation, loginMutation } from '../../graphql/mutations';
import { LoginMutation, LoginMutationVariables } from '../../graphql/generated/LoginMutation';
import { SignupMutation, SignupMutationVariables } from '../../graphql/generated/SignupMutation';

const AuthLink = styled(Button)`
    background: black;
    color: white;
    border: none;
    display: flex;
    overflow: hidden;
    width: 100%;
    background-color: ${customTheme.colors.gray[600]};

    &:hover,
    &:focus {
        background-color: ${customTheme.colors.gray[500]};
    }
`;

const loginFormSchema = Yup.object().shape({
    email: Yup.string().email('Email is invalid').required('Email is required'),
    password: Yup.string().required('Password is required'),
});

type LoginFormSchema = Yup.InferType<typeof loginFormSchema>;

const initialLoginFormikValues: LoginFormSchema = { email: '', password: '' };

export const signupPasswordValidationSchema = Yup.object().shape({
    password: Yup.string()
        .test('passwordTooShort', 'Password must be at least 8 characters long', (value) => /^.{8,}$/.test(value))
        .test('passwordTooLong', 'Password must be less than 50 characters in length', (value) =>
            /^.{0,50}$/.test(value)
        )
        .required('Password is required'),
    // Validation code taken from here: https://github.com/jaredpalmer/formik/issues/90#issuecomment-444476296
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required'),
});

const signupFormSchema = Yup.object()
    .shape({
        email: Yup.string().email('Email is invalid').required('Email is required'),
    })
    .concat(signupPasswordValidationSchema);

type SignupFormSchema = Yup.InferType<typeof signupFormSchema>;

const initialSignupFormikValues: SignupFormSchema = { email: '', password: '', confirmPassword: '' };

type Props = {
    isAuthenticationError?: boolean;
    isLogin?: boolean;
} & PageProps;

const LoginOrSignup: React.FC<Props> = ({ query, isAuthenticationError, pathname, isLogin = true }) => {
    const router = useRouter();
    const toast = useToast();
    const client = useApolloClient();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isErrorDisplayed, setIsErrorDisplayed] = useState(isAuthenticationError);
    const [login, { loading: isLoadingLogin }] = useMutation<LoginMutation, LoginMutationVariables>(loginMutation, {
        onError: (error) => {
            toast({
                title: 'Error',
                description: error.graphQLErrors[0].message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top',
            });
        },
        onCompleted: () => {
            client.resetStore();
            router.push('/');
        },
    });
    const [signup, { loading: isLoadingSignup }] = useMutation<SignupMutation, SignupMutationVariables>(
        signupMutation,
        {
            onError: (error) => {
                toast({
                    title: 'Error',
                    description: error.graphQLErrors[0].message,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'top',
                });
            },
            onCompleted: () => {
                toast({
                    title: 'Signup successful',
                    description: 'Click the link in your email to verify your account',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                    position: 'top',
                });
                client.resetStore();
                router.push('/');
            },
        }
    );

    if (isErrorDisplayed) {
        toast({
            title: 'Error',
            description: `There's an issue with your authentication`,
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'top',
        });
        setIsErrorDisplayed(false);
    }

    useEffect(() => {
        // If there are any URL query params, remove them by replacing the current route with one without query params
        // This is to avoid sharing login URLs with error query params
        if (query && Object.entries(query).length > 0) {
            // Shallow replace allows us to bypass the getInitialProps call for this component, which would
            // remove the login page error
            router.replace(pathname as string, pathname as string, { shallow: true });
        }
    }, [isErrorDisplayed, pathname, query, router]);

    const loginOrSignupText = isLogin ? 'Log in' : 'Sign up';
    const formId = isLogin ? 'loginForm' : 'signupForm';
    const formSchema = isLogin ? loginFormSchema : signupFormSchema;
    const initialFormikValues = isLogin ? initialLoginFormikValues : initialSignupFormikValues;

    const handleSubmit: FormikConfig<LoginFormSchema | SignupFormSchema>['onSubmit'] = async (
        values,
        { setSubmitting }
    ) => {
        if (!isLogin) {
            signup({
                variables: {
                    email: values.email,
                    password: values.password,
                    confirmPassword: (values as SignupFormSchema).confirmPassword,
                },
            });
        }
        if (isLogin) {
            login({
                variables: {
                    email: values.email,
                    password: values.password,
                },
            });
        }
        setSubmitting(false);
    };

    return (
        <>
            <Text fontSize="4xl" textAlign="left" mt={0} mb={1}>
                Welcome
            </Text>
            <Text mb={12} fontSize="md" color="gray.500" lineHeight={1.3}>
                {loginOrSignupText} in with Google or with an email and password.
            </Text>
            <AuthLink
                as="a"
                leftIcon={Google}
                {...{
                    href: `${process.env.COMMON_BACKEND_URL}/auth/google?redirectUrl=${process.env.COMMON_FRONTEND_URL}`,
                }}
            >
                {loginOrSignupText} with Google
            </AuthLink>
            <Box d="flex" alignItems="center" marginY={6}>
                <Divider flexGrow={1} />
                <Text marginX={4}>or</Text>
                <Divider flexGrow={1} />
            </Box>
            <Formik initialValues={initialFormikValues} onSubmit={handleSubmit} validationSchema={formSchema}>
                {({ values, handleChange, handleBlur, errors, touched }): JSX.Element => (
                    <Form id={formId}>
                        <Input
                            mb={2}
                            isInvalid={errors.email !== undefined && touched.email}
                            type="text"
                            name="email"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Email"
                        />
                        {errors.email !== undefined && touched.email && (
                            <Text color="red.500" mt={1} mb={2}>
                                {errors.email}
                            </Text>
                        )}
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
                        {!isLogin && (
                            <>
                                <InputGroup mb={2}>
                                    <Input
                                        isInvalid={
                                            (errors as SignupFormSchema).confirmPassword !== undefined &&
                                            (touched as FormikTouched<SignupFormSchema>).confirmPassword
                                        }
                                        pr="4.5rem"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={(values as SignupFormSchema).confirmPassword}
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
                                {(errors as FormikErrors<SignupFormSchema>).confirmPassword !== undefined &&
                                    (touched as FormikTouched<SignupFormSchema>).confirmPassword && (
                                        <Text color="red.500">
                                            {(errors as FormikErrors<SignupFormSchema>).confirmPassword}
                                        </Text>
                                    )}
                            </>
                        )}
                        {isLogin && (
                            <Box d="flex">
                                <NextLink href="reset-password" passHref>
                                    <Link ml="auto" color="gray.400">
                                        Forgot password?
                                    </Link>
                                </NextLink>
                            </Box>
                        )}
                        <Button
                            mt={4}
                            variantColor="purple"
                            width="100%"
                            type="submit"
                            isLoading={isLoadingLogin || isLoadingSignup}
                        >
                            {loginOrSignupText}
                        </Button>
                    </Form>
                )}
            </Formik>
            <Text textAlign="center">
                {isLogin ? (
                    <>
                        {`Don't have an account? `}
                        <NextLink href="signup" passHref>
                            <Link>Sign up</Link>
                        </NextLink>
                    </>
                ) : (
                    <>
                        Already have an account?{' '}
                        <NextLink href="login" passHref>
                            <Link>Log in</Link>
                        </NextLink>
                        .
                    </>
                )}
            </Text>
        </>
    );
};

export default LoginOrSignup;
