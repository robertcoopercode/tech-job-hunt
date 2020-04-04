import React from 'react';
import { FormikHandlers, FormikHelpers } from 'formik';
import { PseudoBox } from '@robertcooper/chakra-ui-core';
import { ContactType } from '../../types';
import Contact from '../Contact/Contact';
import ChakraButton from '../ChakraButton/ChakraButton';
import { getError } from '../../utils/getError';
import Section from './Section';

interface Props {
    contacts: ContactType[] | null;
    onDelete: (index: number) => void;
    onAdd: () => void;
    onChange: FormikHandlers['handleChange'];
    onBlur: FormikHandlers['handleBlur'];
    setFieldValue: FormikHelpers<any>['setFieldValue'];
    getError: ReturnType<typeof getError>;
}

const ContactSection: React.FC<Props> = ({ contacts, onChange, onBlur, getError, onDelete, onAdd, setFieldValue }) => {
    return (
        <Section title="Contact Details">
            {contacts && contacts.length > 0 && (
                <PseudoBox mb={6}>
                    {contacts.map((contact, index) => (
                        <Contact
                            key={contact.id}
                            setFieldValue={setFieldValue}
                            contact={contact}
                            index={index}
                            onChange={onChange}
                            onBlur={onBlur}
                            onDelete={onDelete}
                            getError={getError}
                        />
                    ))}
                </PseudoBox>
            )}
            <ChakraButton onClick={onAdd} size="xs">
                Add contact
            </ChakraButton>
        </Section>
    );
};

export default ContactSection;
