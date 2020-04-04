import React, { useRef } from 'react';
import styled from '@emotion/styled';
import { customTheme } from '../../utils/styles/theme';

export type Props = {
    isSelected: boolean;
    toggle: () => void;
    id: string;
};

const StyledToggle = styled.div`
    display: inline-flex;
    align-items: center;
    margin: 5px 0;
`;

const ToggleDot = styled.span`
    position: relative;
    cursor: pointer;

    &::before,
    &::after {
        content: '';
        display: block;
        margin: 0 3px;
        transition: all 100ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    &::before {
        height: 20px;
        width: 36px;
        border-radius: 100px;
        opacity: 0.6;
        background: ${customTheme.colors.gray[500]};
    }

    &::after {
        position: absolute;
        top: 50%;
        transform: translate(2px, -50%);
        height: 16px;
        width: 16px;
        border-radius: 100px;
        background: ${customTheme.colors.white};
    }
`;

const ToggleInput = styled.input`
    position: absolute;
    opacity: 0;
    pointer-events: none;

    &:focus + ${ToggleDot} {
        outline: ${customTheme.colors.purple[400]} solid 1px;
        box-shadow: 0 0 8px ${customTheme.colors.purple[400]};
    }

    &:checked + ${ToggleDot}::before {
        background: ${customTheme.colors.green[400]};
    }

    &:checked + ${ToggleDot}::after {
        transform: translate(calc(36px - 100% - 2px), -50%);
    }
`;

const Toggle: React.FC<Props> = ({ toggle, isSelected, id }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClick = (): void => {
        if (inputRef.current) {
            inputRef.current.focus();
            toggle();
        }
    };

    return (
        <StyledToggle>
            <ToggleInput ref={inputRef} onChange={toggle} type="checkbox" checked={isSelected} id={id} />
            <ToggleDot onClick={handleClick} />
        </StyledToggle>
    );
};

export default Toggle;
