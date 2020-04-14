import React, { InputHTMLAttributes } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { rgba } from 'polished';
import { MdExpandMore } from 'react-icons/md';
import { Box, BoxProps } from '@robertcooper/chakra-ui-core';
import { typography, customTheme } from '../../utils/styles/theme';
import InfoSvg from '../../assets/icons/info.svg';
import Tooltip from '../Tooltip/Tooltip';
import { FormError } from '../../utils/getError';
import TextEditor from '../TextEditor/TextEditor';

interface SharedProps {
    inputRef?: React.RefObject<HTMLInputElement>;
    id?: string;
    label?: string;
    helpText?: string;
    htmlType?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
    isRequired?: boolean;
    className?: string;
    wrapperStyles?: BoxProps;
    /**
     * Used if no visible label should appear. Will use an aria-label on the HTMLInputElement
     */
    hiddenLabel?: string;
    error?: FormError;
    isDropdownOpen?: boolean;
    setDropdownIsOpen?: (isDropdownOpen: boolean) => void;
}

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    isTextEditor?: false;
}

interface TextEditorProps {
    isTextEditor: true;
    value: string;
    onChange: (v?: string) => void;
    onBlur?: () => void;
    placeholder?: string;
}

type Props = SharedProps & (InputFieldProps | TextEditorProps);

export const InputStyles = css`
    display: flex;
    align-items: center;
    border: 1px solid ${customTheme.colors.gray[300]};
    background-color: ${rgba(customTheme.colors.gray[100], 0.2)};
    padding: 0 10px;
    height: 40px;
    padding: 10px;
    border-radius: 5px;
    width: 100%;
    text-align: inherit;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
`;

export const Input = styled.input<{ htmlType?: any }>`
    ${InputStyles};

    &::placeholder {
        color: ${customTheme.colors.gray[400]};
    }

    ${({ htmlType }): any =>
        htmlType === 'textarea' &&
        css`
            height: 100%;
            min-height: 100px;
            line-height: ${customTheme.lineHeights.short};
        `}
`;

export const FormInputWrapper = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 100%;
`;

export const StyledFormInputLabel = styled.label`
    &,
    &:focus,
    &:active {
        ${typography.captionMedium};
        display: inline-block;
        margin-bottom: ${customTheme.space[2]};
        cursor: default;

        outline: none;
    }
`;

const InputWrapper = styled(Box)`
    position: relative;
`;

const LabelWrapper = styled.div`
    display: flex;
    align-items: flex-start;
`;

const iconSize = '22px';

const StyledCaret = styled(Box)`
    display: block;
`;

const CaretButton = styled.button`
    margin-left: 10px;
    position: absolute;
    right: 15px;
    top: calc(50% - ${iconSize} / 2);
`;

const InfoButton = styled.button`
    margin-left: 10px;
    transform: translateY(-2px);
`;

const StyledInfoSvg = styled(InfoSvg)`
    height: 16px;
    width: 16px;
`;

export const ErrorMessage = styled.span`
    color: ${customTheme.colors.red[400]};
    display: block;
    margin-top: 0.5rem;
`;

export const FormInputLabel: React.FC<
    Pick<Props, 'label' | 'id' | 'helpText' | 'isRequired' | 'isTextEditor'> & {
        onClick?: () => void;
    }
> = ({ label, helpText, id, isRequired, isTextEditor, onClick }) => (
    <LabelWrapper>
        <StyledFormInputLabel
            htmlFor={id}
            {...(isTextEditor ? { as: 'a', href: `#${id}`, tabIndex: -1 } : {})}
            onClick={onClick}
        >
            {label}
            {isRequired && ` *`}
        </StyledFormInputLabel>
        {helpText && (
            <Tooltip aria-label={helpText} label={helpText} placement="top">
                <InfoButton type="button">
                    <StyledInfoSvg />
                </InfoButton>
            </Tooltip>
        )}
    </LabelWrapper>
);

export const FormInput: React.FC<Partial<InputHTMLAttributes<HTMLInputElement> & SharedProps>> = ({
    id,
    htmlType,
    isDropdownOpen,
    hiddenLabel,
    setDropdownIsOpen,
    inputRef,
    wrapperStyles,
    ...props
}) => (
    <InputWrapper {...wrapperStyles}>
        <Input
            type="text"
            id={id}
            {...{ as: htmlType }}
            htmlType={htmlType}
            aria-label={hiddenLabel ? hiddenLabel : undefined}
            autoComplete="off"
            onFocus={(): void => {
                setDropdownIsOpen && setDropdownIsOpen(true);
            }}
            ref={inputRef}
            {...props}
        />
        {setDropdownIsOpen && (
            <CaretButton
                onClick={(): void => {
                    setDropdownIsOpen(!isDropdownOpen);
                }}
                type="button"
            >
                <StyledCaret aria-label="Expand" as={MdExpandMore} color="gray.400" size={iconSize} />
            </CaretButton>
        )}
    </InputWrapper>
);

const InputField: React.FC<Props> = (props) => {
    const { label, className, helpText, id, isRequired, error, isTextEditor } = props;

    const renderTextInput = (): JSX.Element => {
        if (props.isTextEditor) {
            const { id, ...rest } = props;
            return <TextEditor id={id} {...rest} />;
        } else {
            const { id, htmlType, ...rest } = props;
            return <FormInput id={id} htmlType={htmlType} {...rest} />;
        }
    };

    return (
        <FormInputWrapper className={className}>
            {label && (
                <FormInputLabel
                    label={label}
                    id={id}
                    helpText={helpText}
                    isRequired={isRequired}
                    isTextEditor={isTextEditor}
                />
            )}
            {renderTextInput()}
            {error && <ErrorMessage>{error}</ErrorMessage>}
        </FormInputWrapper>
    );
};

InputField.defaultProps = {
    isRequired: false,
};

export default InputField;
