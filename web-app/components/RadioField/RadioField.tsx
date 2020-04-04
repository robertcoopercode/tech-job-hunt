import styled from '@emotion/styled';
import { useRef, ChangeEvent } from 'react';
import { MdCheck } from 'react-icons/md';
import { typography } from '../../utils/styles/theme';
import { customTheme } from '../../utils/styles/theme';

const CustomCheckboxField = styled.div`
    display: flex;
`;

const CheckboxWrapper = styled.div`
    position: relative;
`;

const StyledCustomCheckbox = styled.div`
    position: relative;
    height: 32px;
    width: 32px;
    background: none;
    border-radius: 32px;
    border: 1px solid ${customTheme.colors.gray[300]};
    margin-right: 20px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
        border-color: ${customTheme.colors.blue[400]};
    }
`;

const CheckboxLabel = styled.label`
    ${typography.captionMedium};
    margin-bottom: ${customTheme.space[1]};
    display: inline-block;
    cursor: pointer;
`;

const CheckboxDescription = styled.p`
    ${typography.description};
    margin: 0;
`;

const StyledCheckmarkSvg = styled(MdCheck)`
    display: none;
`;

const HiddenCheckbox = styled.input`
    opacity: 0;
    position: absolute;

    &:checked + ${StyledCustomCheckbox} {
        background: ${customTheme.colors.blue[400]};
        border-color: ${customTheme.colors.blue[400]};

        ${StyledCheckmarkSvg} {
            display: inline-block;
        }
    }

    &:disabled + ${StyledCustomCheckbox} {
        cursor: not-allowed;
    }

    &:focus + ${StyledCustomCheckbox} {
        box-shadow: 0 0 3px 3px ${customTheme.colors.blue[400]};
        border-color: ${customTheme.colors.blue[400]};
    }
`;

type Props = {
    id: string;
    className?: string;
    description: string;
    selectedValue: string;
    value: string;
    name: string;
    label: string;
    setSelectedValue: (v: string) => void;
};

const RadioField: React.FC<Props> = ({
    selectedValue,
    setSelectedValue,
    label,
    description,
    className,
    value,
    id,
    ...rest
}) => {
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
        <CustomCheckboxField className={className}>
            <CheckboxWrapper>
                <HiddenCheckbox
                    id={id}
                    ref={radioInputRef}
                    type="radio"
                    value={value}
                    checked={isSelected}
                    onChange={handleChange}
                    {...rest}
                />
                <StyledCustomCheckbox onClick={handleClick}>
                    <StyledCheckmarkSvg color={customTheme.colors.white} size={16} />
                </StyledCustomCheckbox>
            </CheckboxWrapper>
            <div>
                <CheckboxLabel htmlFor={id}>{label}</CheckboxLabel>
                <CheckboxDescription>{description}</CheckboxDescription>
            </div>
        </CustomCheckboxField>
    );
};

export default RadioField;
