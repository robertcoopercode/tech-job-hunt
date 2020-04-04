import { css } from '@emotion/core';
import { customTheme } from './theme';

export const RoundedImageIcon = css`
    width: 26px;
    height: 26px;
    border-radius: 13px;
    border: 1px solid ${customTheme.colors.gray[300]};
    object-fit: cover;
`;
