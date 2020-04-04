import Router from 'next/router';
import { NextComponentType, NextPageContext } from 'next';
import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks';
import { useEffect } from 'react';
import { useToast } from '@robertcooper/chakra-ui-core';
import { PageProps } from '../../pages/_app';
import Layout from '../Layout/Layout';
import Loader from '../Loader/Loader';
import { CurrentUserQuery } from '../../graphql/generated/CurrentUserQuery';
import { currentUserQuery } from '../../graphql/queries';
import LoginLayout from '../LoginLayout/LoginLayout';
import { verifyEmailMutation } from '../../graphql/mutations';
import { VerifyEmailMutation, VerifyEmailMutationVariables } from '../../graphql/generated/VerifyEmailMutation';

type Props = {
    component: NextComponentType<any, any, any>;
    query: PageProps['query'];
    pathname: PageProps['pathname'];
    req?: NextPageContext['req'];
};

export type ComponentPageProps = Pick<Props, 'pathname' | 'query'> & {
    user: CurrentUserQuery['me'];
};

const unauthenticatedPathnames = ['/login', '/reset-password', '/signup'];

const App = ({ component: Component, query, pathname, ...props }: Props): JSX.Element | null => {
    const toast = useToast();
    const client = useApolloClient();
    const { data: currentUserData, loading: currentUserLoading } = useQuery<CurrentUserQuery>(currentUserQuery);
    const [verifyEmail, { loading: isLoadingVerifyEmail }] = useMutation<
        VerifyEmailMutation,
        VerifyEmailMutationVariables
    >(verifyEmailMutation, {
        onError: error => {
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
                title: 'Email verified',
                description: `Your email has been successfully verified`,
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top',
            });
            // Make sure to remove the emailToken from the URL
            Router.push('/');
            client.resetStore();
        },
    });

    const isAnUnauthenticatedPage = pathname !== undefined && unauthenticatedPathnames.includes(pathname);
    // Need to wrap calls of `Router.replace` in a use effect to prevent it being called on the server side
    // https://github.com/zeit/next.js/issues/6713
    useEffect(() => {
        // Redirect the user to the login page if not authenticated
        if (!isAnUnauthenticatedPage && currentUserData?.me === null) {
            Router.replace('/login');
        }
    }, [currentUserData, isAnUnauthenticatedPage, pathname]);

    useEffect(() => {
        const makeRequest = async (): Promise<void> => {
            if (query && query.emailToken) {
                await verifyEmail({
                    variables: {
                        emailToken: query.emailToken as string,
                    },
                });
            }
        };
        // Confirm a user's email address if emailToken is part of the query params in the URL
        if (query && query.emailToken) {
            makeRequest();
        }
    }, [query, verifyEmail]);

    if (currentUserLoading || isLoadingVerifyEmail) {
        return <Loader />;
    }

    if (!isAnUnauthenticatedPage && currentUserData?.me === null) {
        return null;
    }

    if (!currentUserData) {
        return null;
    }

    return pathname !== undefined && unauthenticatedPathnames.includes(pathname) ? (
        <LoginLayout>
            <Component query={query} pathname={pathname} {...props} />
        </LoginLayout>
    ) : (
        <Layout user={currentUserData.me}>
            <Component query={query} pathname={pathname} user={currentUserData.me} {...props} />
        </Layout>
    );
};

export default App;
