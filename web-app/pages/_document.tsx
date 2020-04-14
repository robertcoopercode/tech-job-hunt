import Document, { Html, Head, Main, NextScript } from 'next/document';
import * as Sentry from '@sentry/browser';

process.on('unhandledRejection', (err) => {
    Sentry.captureException(err);
});

process.on('uncaughtException', (err) => {
    Sentry.captureException(err);
});

export default class MyDocument extends Document {
    render(): JSX.Element {
        return (
            <Html>
                <Head>
                    <link rel="shortcut icon" href="/static/favicon.png" />
                </Head>
                <body>
                    <Main />
                    <div id="modal" />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
