import React, { useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { FormikHandlers, FormikHelpers } from 'formik';
import InputField from '../InputField/InputField';
import { ContactType } from '../../types';
import ChakraButton from '../ChakraButton/ChakraButton';
import { getError } from '../../utils/getError';
import { customTheme, mediaQueries } from '../../utils/styles/theme';

interface ContactProps {
    contact: ContactType;
    index: number;
    onDelete: (index: number) => void;
    onChange: FormikHandlers['handleChange'];
    onBlur: FormikHandlers['handleBlur'];
    getError: ReturnType<typeof getError>;
    setFieldValue: FormikHelpers<any>['setFieldValue'];
}

const StyledContact = styled.div`
    display: grid;
    grid-gap: ${customTheme.space[6]};
    margin-bottom: ${customTheme.space[6]};

    &:last-of-type {
        margin-bottom: 0;
    }

    ${mediaQueries.sm} {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        grid-template-rows: repeat(3, minmax(min-content, max-content));
    }

    ${mediaQueries.lg} {
        grid-template-columns: repeat(3, minmax(0, 1fr));
        grid-template-rows: 1fr 1fr 1fr;
    }
`;

const ContactNotes = styled(InputField)`
    ${mediaQueries.sm} {
        grid-column: 1 / 3;
    }

    ${mediaQueries.lg} {
        grid-row: 2 / 4;
        grid-column: 2 / 4;
    }
`;

const ContactDelete = styled.div`
    display: flex;
    align-items: flex-end;
`;

const Contact: React.FC<ContactProps> = ({ contact, index, onDelete, onChange, onBlur, getError, setFieldValue }) => {
    const firstInputRef = useRef<HTMLInputElement>(null);

    // When a new contact is added, put focus to the first input
    useEffect(() => {
        firstInputRef.current?.focus();
    }, []);

    return (
        <StyledContact>
            <InputField
                inputRef={firstInputRef}
                isRequired
                label="Name"
                id={`contact-name-${index}`}
                placeholder="Mark Zuckerberg"
                value={contact.name}
                name={`contacts.${index}.name`}
                onChange={onChange}
                onBlur={onBlur}
                error={getError(`contacts.${index}.name`)}
            />
            <InputField
                label="Position"
                id={`contact-position-${index}`}
                placeholder="CEO"
                value={contact.position ?? ''}
                name={`contacts.${index}.position`}
                onChange={onChange}
                onBlur={onBlur}
                error={getError(`contacts.${index}.position`)}
            />
            <InputField
                label="Email"
                type="email"
                id={`contact-email-${index}`}
                placeholder="mark@facebook.com"
                value={contact.email ?? ''}
                name={`contacts.${index}.email`}
                onChange={onChange}
                onBlur={onBlur}
                error={getError(`contacts.${index}.email`)}
            />
            <InputField
                label="Phone"
                type="phone"
                id={`contact-phone-${index}`}
                placeholder="123-456-7891"
                value={contact.phone ?? ''}
                name={`contacts.${index}.phone`}
                onChange={onChange}
                onBlur={onBlur}
                error={getError(`contacts.${index}.phone`)}
            />
            <ContactNotes
                isTextEditor
                label="Notes"
                id={`contact-notes-${index}`}
                placeholder="He once invited me to his barbecue."
                value={contact.notes ?? ''}
                onChange={(value): void => setFieldValue(`contacts.${index}.notes`, value)}
                error={getError(`contacts.${index}.notes`)}
            />
            <ContactDelete>
                <ChakraButton
                    size="xs"
                    variantColor="red"
                    onClick={(): void => {
                        onDelete(index);
                    }}
                    variant="outline"
                >
                    Delete contact
                </ChakraButton>
            </ContactDelete>
        </StyledContact>
    );
};

export default Contact;
