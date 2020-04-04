import React, { useState } from 'react';
import styled from '@emotion/styled';
import { css, SerializedStyles } from '@emotion/core';
import StarUnfilledSvg from '../../assets/icons/star-unfilled.svg';
import { FormInputWrapper, FormInputLabel } from '../InputField/InputField';
import { customTheme } from '../../utils/styles/theme';

const Stars = styled.div`
    display: flex;
`;

const StyledStarUnfilledSvg = styled(StarUnfilledSvg)`
    margin-right: 5px;
    fill: ${customTheme.colors.blue[200]};
    stroke: ${customTheme.colors.blue[200]};
    stroke-width: 2;
    fill-opacity: 0.2;
    cursor: pointer;

    &:hover {
        stroke: ${customTheme.colors.blue[400]};
        fill-opacity: 1;
    }

    ${({ selected }): SerializedStyles =>
        selected &&
        css`
            stroke: ${customTheme.colors.blue[400]};
            fill-opacity: 1;
        `}

    &::last-child {
        margin-right: 0;
    }
`;

const StarButton = styled.button`
    padding: 0;
    background: none;
    border: none;
`;

type Props = {
    setRating: (rating: number) => void;
    rating: number | null;
    helpText?: string;
    label: string;
};

const Rating: React.FC<Props> = ({ setRating, rating, helpText, label }) => {
    const [hoveredStarIndex, setHoveredStarIndex] = useState<number | null>(null);
    const handleMouseOver = (index: number): void => setHoveredStarIndex(index);

    const handleMouseLeave = (): void => {
        setHoveredStarIndex(null);
    };

    const handleClick = (index: number): void => {
        setRating(index + 1);
    };

    return (
        <FormInputWrapper>
            <FormInputLabel label={label} helpText={helpText} />
            <Stars>
                {[...Array(5).keys()].map((_, index) => (
                    <StarButton
                        type="button"
                        onMouseOver={(): void => handleMouseOver(index)}
                        onMouseLeave={handleMouseLeave}
                        onClick={(): void => handleClick(index)}
                        key={index}
                    >
                        <StyledStarUnfilledSvg
                            selected={
                                (hoveredStarIndex && index <= hoveredStarIndex) ||
                                (hoveredStarIndex === null && rating && index <= rating - 1)
                            }
                        />
                    </StarButton>
                ))}
            </Stars>
        </FormInputWrapper>
    );
};

export default Rating;
