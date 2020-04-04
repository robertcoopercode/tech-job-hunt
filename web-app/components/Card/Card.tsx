import React, { useRef, ChangeEvent } from 'react';
import styled from '@emotion/styled';
import { rgba } from 'polished';
import { IconType } from 'react-icons/lib/cjs';
import { MdCheck } from 'react-icons/md';
import { customTheme } from '../../utils/styles/theme';

interface Props {
    selectedValue: string | null;
    value: string;
    name: string;
    label: string;
    icon: IconType;
    setSelectedValue: (value: string) => void;
}

const IconContainer = styled.div`
    height: 16px;
    width: 16px;
`;

const Circle = styled.div`
    position: relative;
    height: 48px;
    width: 48px;
    border-radius: 48px;
    background-color: ${rgba(customTheme.colors.purple[500], 0.15)};
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 1.5rem;
    flex-shrink: 0;
`;

const SelectedCheckmarkCircle = styled.div`
    position: absolute;
    transform: translate(50%, -50%);
    border-radius: 9px;
    right: 0;
    top: 0;
    height: 18px;
    width: 18px;
    background: ${customTheme.colors.blue[400]};
    display: flex;
    align-items: center;
    justify-content: center;
    display: none;
`;

const StyledCard = styled.div`
    border: 1px solid ${customTheme.colors.gray[300]};
    border-radius: 5px;
    display: flex;
    width: 150px;
    height: 100%;
    flex-direction: column;
    align-items: center;
    padding: ${customTheme.space[5]};
    text-align: center;
    position: relative;
    cursor: pointer;
`;

const Label = styled.label`
    font-weight: 500;
`;

const HiddenRadio = styled.input`
    opacity: 0;
    position: absolute;

    &:checked + ${StyledCard} {
        border-color: ${customTheme.colors.blue[400]};

        ${SelectedCheckmarkCircle} {
            display: flex;
        }
    }

    &:focus + ${StyledCard} {
        border-color: ${customTheme.colors.blue[400]};
        box-shadow: 0 0 3px 3px ${customTheme.colors.blue[400]};
    }
`;

const StyledJobDecisionCard = styled.div``;

const Card: React.FC<Props> = ({ selectedValue, setSelectedValue, value, name, label, icon: Icon }) => {
    const radioInputRef = useRef<HTMLInputElement>(null);
    const isSelected = selectedValue === value;

    const handleClick = (): void => {
        if (radioInputRef.current) {
            radioInputRef.current.focus();
            setSelectedValue(value);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setSelectedValue(e.target.value);
    };

    return (
        <StyledJobDecisionCard>
            <HiddenRadio
                ref={radioInputRef}
                type="radio"
                name={name}
                value={value}
                checked={isSelected}
                onChange={handleChange}
            />
            <StyledCard onClick={handleClick}>
                <SelectedCheckmarkCircle>
                    <MdCheck size={12} color={customTheme.colors.white} />
                </SelectedCheckmarkCircle>
                <Circle>
                    <IconContainer>
                        <Icon color="purple" size="100%" />
                    </IconContainer>
                </Circle>
                <Label htmlFor="jobDecisionAccepted">{label}</Label>
            </StyledCard>
        </StyledJobDecisionCard>
    );
};

export default Card;
