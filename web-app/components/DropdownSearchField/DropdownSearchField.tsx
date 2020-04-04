import React, { useRef, useState, ChangeEvent, useEffect, useCallback } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { rgba } from 'polished';
import { Text, Box } from '@robertcooper/chakra-ui-core';
import { MdAdd } from 'react-icons/md';
import { RoundedImageIcon } from '../../utils/styles/general';
import ClearSvg from '../../assets/icons/clear.svg';
import InputField, { InputStyles, FormInputLabel, ErrorMessage } from '../InputField/InputField';
import { useOnClickOutside } from '../../utils/hooks/useOnClickOutside';
import { DropdownSearchOption } from '../ViewJobModal/ViewJobModal';
import { customTheme } from '../../utils/styles/theme';

type DropdownSearchInputProps<T> = {
    isLoading: boolean;
    label: string;
    id: string;
    onOptionSelection: (option: T | null) => void;
    onAddNew?: () => void;
    options: T[];
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    searchQuery: string;
    selectedOption?: T | null;
    helpText?: string;
    isRequired?: boolean;
    error?: string | { [key: string]: string };
    onBlur: () => void;
    isLabelHidden?: boolean;
};

const StyledDropdownSearchInput = styled.div`
    position: relative;
`;

const RoundedImage = styled.img`
    ${RoundedImageIcon};
    margin-right: 1rem;
`;

const DropdownOptions = styled.div<{ isOpen: boolean }>`
    position: absolute;
    bottom: 0;
    left: 0;
    border: 1px solid ${customTheme.colors.gray[300]};
    border-bottom: 0;
    transform: translateY(100%);
    width: 100%;
    background: ${customTheme.colors.white};
    display: ${({ isOpen }): any => (isOpen ? 'block' : 'none')};
    z-index: 1;
    border-radius: 5px;
`;

const OptionBox = css`
    display: flex;
    height: 40px;
    border: none;
    border-bottom: 1px solid ${customTheme.colors.gray[300]};
    align-items: center;
    padding: 0 10px;
    background-color: ${rgba(customTheme.colors.gray[300], 0.2)};
    width: 100%;
    line-height: 40px;
    text-align: left;
`;

const TruncatedText = styled(Text)`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

TruncatedText.defaultProps = { as: 'span' };

const PlaceholderOption = styled.div`
    ${OptionBox};
`;

const DropdownOption = styled.button`
    ${OptionBox};

    &:hover {
        background-color: ${customTheme.colors.gray[300]};
        cursor: pointer;
    }
`;

const AddIcon = styled.div`
    border: 1px solid ${customTheme.colors.gray[300]};
    border-radius: 13px;
    height: 26px;
    width: 26px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 10px;
`;

const SelectedItemWrapper = styled.div`
    display: flex;
    flex-direction: column;
`;

const SelectedItemContainer = styled.div`
    position: relative;
`;

const SelectedItem = styled.button`
    ${InputStyles};
    padding-top: 0;
    padding-bottom: 0;
    cursor: pointer;
`;

SelectedItem.defaultProps = { type: 'button' };

const StyledClear = styled(ClearSvg)`
    fill: ${customTheme.colors.gray[400]};
    height: 10px;
    width: 10px;
`;

const ClearButton = styled.button`
    background: none;
    border: none;
    padding: 0;
    margin-left: auto;
    height: 16px;
    width: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
`;

const DropdownSearchInput = <T extends DropdownSearchOption>({
    isLoading,
    id,
    label,
    options,
    onOptionSelection,
    onAddNew,
    onChange,
    searchQuery,
    selectedOption,
    helpText,
    isRequired,
    error,
    onBlur,
    isLabelHidden = false,
}: DropdownSearchInputProps<T>): JSX.Element | null => {
    const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);

    const companyDropdownRef = useRef<HTMLDivElement>(null);
    const optionsDropdownRef = useRef<HTMLDivElement>(null);
    const selectedOptionRef = useRef<HTMLDivElement>(null);
    const selectedItemRef = useRef<HTMLButtonElement>(null);
    const timeoutRef = useRef<number>();
    const inputRef = useRef<HTMLInputElement>(null);

    const handleAddNew = (): void => {
        setIsCompanyDropdownOpen(false);
        onAddNew && onAddNew();
    };

    const handleKeyPresses = useCallback(
        (event: KeyboardEvent): void => {
            if (event.key === 'Escape' && isCompanyDropdownOpen) {
                event.stopPropagation();
                setIsCompanyDropdownOpen(false);
                if (selectedOption) {
                    selectedItemRef.current?.focus();
                } else {
                    inputRef.current?.focus();
                }
            }
            if (event.key === 'ArrowDown' && isCompanyDropdownOpen) {
                if (
                    inputRef.current?.contains(event.target as Node) ||
                    selectedOptionRef.current?.contains(event.target as Node)
                ) {
                    event.preventDefault();
                    (optionsDropdownRef.current?.firstElementChild as HTMLElement)?.focus();
                }
                if (optionsDropdownRef.current?.contains(event.target as Node)) {
                    event.preventDefault();
                    ((event.target as HTMLElement)?.nextElementSibling as HTMLElement)?.focus();
                }
            }
            if (event.key === 'ArrowUp' && isCompanyDropdownOpen) {
                if (optionsDropdownRef.current?.contains(event.target as Node)) {
                    event.preventDefault();
                    if ((event.target as HTMLElement)?.previousElementSibling) {
                        ((event.target as HTMLElement)?.previousElementSibling as HTMLElement)?.focus();
                    } else {
                        if (selectedOption) {
                            selectedItemRef.current?.focus();
                        } else {
                            inputRef.current?.focus();
                        }
                    }
                }
            }
        },
        [isCompanyDropdownOpen, selectedOption]
    );

    useEffect(() => {
        companyDropdownRef.current?.addEventListener<'keydown'>('keydown', handleKeyPresses, { capture: true });
        optionsDropdownRef.current?.addEventListener<'keydown'>('keydown', handleKeyPresses, { capture: true });

        return (): void => {
            companyDropdownRef.current?.removeEventListener<'keydown'>('keydown', handleKeyPresses, {
                capture: true,
            });
            optionsDropdownRef.current?.removeEventListener<'keydown'>('keydown', handleKeyPresses, {
                capture: true,
            });
        };
    }, [handleKeyPresses]);

    const handleSelectedItemClick = (): void => {
        setIsCompanyDropdownOpen(!isCompanyDropdownOpen);
    };

    const handleOptionClick = (option: T): void => {
        onOptionSelection(option);
        setIsCompanyDropdownOpen(false);
    };

    const handleClear = (): void => {
        onOptionSelection(null);
    };

    const handleBlur = (_e: React.FocusEvent<HTMLDivElement>): void => {
        /**
         * We use the setTimeout(fn, 0) to delay the execution of the callback
         * to the next event loop tick in case the focus shifts to an element
         * within the component (in which case we will call the `handleFocus`
         * handler and the timeout will be cleared).
         */
        timeoutRef.current = window.setTimeout(() => {
            onBlur();
            setIsCompanyDropdownOpen(false);
        }, 0);
    };

    const handleFocus = (): void => {
        /**
         * Clears the timeout callback set in on blur events to prevent the on onBlur
         * prop from being executed when shifting focus WITHIN the component. We only
         * want the onBlur prop to be executed when focus leaves the component.
         **/
        window.clearTimeout(timeoutRef.current);
    };

    useOnClickOutside(
        companyDropdownRef,
        () => {
            setIsCompanyDropdownOpen(false);
        },
        true
    );

    const addNewOptionText = searchQuery.trim() !== '' ? `Add ${searchQuery}` : `Add new ${label.toLowerCase()}`;

    return (
        <Box>
            <StyledDropdownSearchInput
                ref={companyDropdownRef}
                onBlur={(e: React.FocusEvent<HTMLDivElement>): void => handleBlur(e)}
                onFocus={handleFocus}
            >
                {selectedOption ? (
                    <SelectedItemWrapper ref={selectedOptionRef}>
                        {!isLabelHidden && (
                            <FormInputLabel label={label} isRequired={isRequired} id={id} helpText={helpText} />
                        )}
                        <SelectedItemContainer>
                            <SelectedItem ref={selectedItemRef} onClick={handleSelectedItemClick}>
                                {selectedOption.imageUrl && (
                                    <RoundedImage
                                        alt={selectedOption.name}
                                        src={`${selectedOption.imageUrl}&d=72x72`}
                                    />
                                )}
                                <TruncatedText title={selectedOption.name}>{selectedOption.name}</TruncatedText>
                            </SelectedItem>
                            <ClearButton type="button" onClick={handleClear}>
                                <StyledClear />
                            </ClearButton>
                        </SelectedItemContainer>
                    </SelectedItemWrapper>
                ) : (
                    <InputField
                        inputRef={inputRef}
                        label={isLabelHidden ? undefined : label}
                        id={id}
                        name={id}
                        placeholder={`Select a ${label.toLowerCase()}`}
                        isDropdownOpen={isCompanyDropdownOpen}
                        isRequired={isRequired}
                        value={searchQuery}
                        onChange={onChange}
                        helpText={helpText}
                        setDropdownIsOpen={setIsCompanyDropdownOpen}
                    />
                )}
                <DropdownOptions
                    isOpen={
                        isCompanyDropdownOpen &&
                        (options.length > 0 || isLoading || (options.length === 0 && onAddNew !== undefined))
                    }
                    ref={optionsDropdownRef}
                >
                    {isLoading ? (
                        <PlaceholderOption>Loading...</PlaceholderOption>
                    ) : (
                        <>
                            {options.map(option => (
                                <DropdownOption
                                    type="button"
                                    key={option.id}
                                    onClick={(): void => handleOptionClick(option)}
                                >
                                    {option.imageUrl && (
                                        <RoundedImage alt={option.name} src={`${option.imageUrl}&d=72x72`} />
                                    )}
                                    <TruncatedText title={option.name}>{option.name}</TruncatedText>
                                </DropdownOption>
                            ))}
                            {onAddNew && (
                                <DropdownOption type="button" onClick={handleAddNew}>
                                    <AddIcon>
                                        <MdAdd size={20} color={customTheme.colors.gray[400]} />
                                    </AddIcon>
                                    <TruncatedText title={addNewOptionText}>{addNewOptionText}</TruncatedText>
                                </DropdownOption>
                            )}
                        </>
                    )}
                </DropdownOptions>
            </StyledDropdownSearchInput>
            {error && typeof error === 'string' && <ErrorMessage>{error}</ErrorMessage>}
        </Box>
    );
};

export default DropdownSearchInput;
