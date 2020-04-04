import { theme } from '@robertcooper/chakra-ui-core';
import { default as emotionStyled, CreateStyled } from '@emotion/styled';
import { css } from '@emotion/core';

export const customTheme = {
    ...theme,
    fonts: {
        body: 'Rubik, sans-serif',
        heading: 'Rubik, sans-serif',
        mono: 'Rubik, sans-serif',
    },
};

export const typography = {
    bodyLight: css`
        font-weight: 400;
        font-size: ${customTheme.fontSizes.md};
        color: ${customTheme.colors.gray[600]};
        letter-spacing: ${customTheme.letterSpacings.normal};
    `,
    caption: css`
        text-transform: uppercase;
        font-size: ${customTheme.fontSizes.sm};
        font-weight: ${customTheme.fontWeights.normal};
        letter-spacing: ${customTheme.letterSpacings.normal};
    `,
    captionMedium: css`
        text-transform: uppercase;
        font-size: ${customTheme.fontSizes.xs};
        font-weight: ${customTheme.fontWeights.medium};
        letter-spacing: ${customTheme.letterSpacings.wide};
        color: ${customTheme.colors.gray[400]};
    `,
    description: css`
        font-weight: ${customTheme.fontWeights.normal};
        font-size: ${customTheme.fontSizes.sm};
        letter-spacing: ${customTheme.letterSpacings.normal};
        color: ${customTheme.colors.gray[400]};
    `,
    pageTitle: css`
        font-size: ${customTheme.fontSizes['3xl']};
        font-weight: ${customTheme.fontWeights.light};
        margin-top: 0;
    `,
};

const mediaQueryPrefixes = [];

for (const breakpoint in customTheme.breakpoints) {
    if (isNaN(parseInt(breakpoint, 10))) {
        mediaQueryPrefixes.push(breakpoint);
    }
}

type MediaQueries = {
    sm: string;
    md: string;
    lg: string;
    xl: string;
};

export const mediaQueries = (mediaQueryPrefixes as (keyof MediaQueries)[]).reduce((prev, curr): MediaQueries => {
    prev[curr] = `@media (min-width: ${customTheme.breakpoints[curr as keyof typeof customTheme.breakpoints]})`;
    return prev;
}, {} as MediaQueries);

const styled = emotionStyled as CreateStyled<typeof customTheme>;

export { styled };
