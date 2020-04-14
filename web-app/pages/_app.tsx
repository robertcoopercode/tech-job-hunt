import NextApp, { AppContext } from 'next/app';
import Head from 'next/head';
import { ApolloProvider as ApolloProviderHooks } from '@apollo/react-hooks';
import { WithApolloProps } from 'next-with-apollo';
import { NextPageContext } from 'next';
import { ErrorInfo } from 'react';
import * as Sentry from '@sentry/browser';
import emotionNormalize from 'emotion-normalize';
import { ThemeProvider } from '@robertcooper/chakra-ui-core';
import { Global, css } from '@emotion/core';
import withApollo from '../utils/withApollo';
import App from '../components/App/App';
import { fontFaceRules } from '../utils/styles/fonts';
import { customTheme } from '../utils/styles/theme';
import 'react-tippy/dist/tippy.css';
require('react-quill/dist/quill.snow.css');

// For more ideas on how to better configure Sentry with NextJS: https://github.com/zeit/next.js/blob/canary/examples/with-sentry/server.js
Sentry.init({
    dsn: process.env.WEB_APP_SENTRY_DSN,
    // Don't send Sentry events in development environments
    beforeSend: process.env.NODE_ENV === 'development' ? (): null => null : undefined,
});

const globalStyles = css`
    ${fontFaceRules};
    ${emotionNormalize}

    *,
    *::before,
    *::after {
        -webkit-font-smoothing: antialiased; /* Chrome, Safari */
        -moz-osx-font-smoothing: grayscale; /* Firefox */

        box-sizing: border-box;
        border-color: ${customTheme.colors.gray[200]};
    }

    html {
        font-size: 16px; /* 1 rem = 16px */
    }

    body {
        font-family: 'Rubik', sans-serif;
        font-size: ${customTheme.fontSizes.sm};
        color: ${customTheme.colors.gray[700]};
    }

    html,
    body,
    #__next {
        height: 100%;
        overflow: auto;
        background-color: ${customTheme.colors.gray[50]};
    }

    p {
        line-height: 1.2rem;
    }

    a {
        text-decoration: none;
        color: ${customTheme.colors.purple[500]};
        transition: all 0.125s ease-in-out;

        &:active {
            color: inherit;
        }
    }

    button {
        background: none;
        padding: 0;
        border: none;
        cursor: pointer;
    }
`;

export type PageProps = {
    query?: { resetToken?: string; emailToken?: string };
    pathname?: string;
    req?: NextPageContext['req'];
};

class MyApp extends NextApp<WithApolloProps<{}>> {
    static async getInitialProps({ Component, ctx }: AppContext): Promise<{ pageProps: PageProps }> {
        let pageProps: PageProps = {};

        if (Component.getInitialProps) {
            const componentInitialProps = await Component.getInitialProps(ctx);
            if (componentInitialProps) {
                pageProps = componentInitialProps;
            }
        }

        // Expose the URL query params as props
        pageProps.query = ctx.query;
        pageProps.pathname = ctx.pathname;

        return { pageProps };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        Sentry.withScope((scope) => {
            (Object.keys(errorInfo) as any).forEach((key: keyof typeof errorInfo): void => {
                scope.setExtra(key, errorInfo[key]);
            });

            Sentry.captureException(error);
        });

        super.componentDidCatch(error, errorInfo);
    }

    render(): JSX.Element {
        const { Component, pageProps, apollo } = this.props;

        return (
            <ApolloProviderHooks client={apollo}>
                <ThemeProvider theme={customTheme}>
                    <Head>
                        <title>Tech Job Hunt</title>
                    </Head>
                    <Global styles={globalStyles} />
                    <App component={Component} {...pageProps} />
                </ThemeProvider>
            </ApolloProviderHooks>
        );
    }
}

export default withApollo(MyApp);
