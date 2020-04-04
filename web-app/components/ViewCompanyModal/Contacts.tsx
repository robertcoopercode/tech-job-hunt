import React from 'react';
import { FormikHandlers, FormikHelpers } from 'formik';
import { Box, Button } from '@robertcooper/chakra-ui-core';
import { ContactType } from '../../types';
import Contact from '../Contact/Contact';
import { getError } from '../../utils/getError';

interface ContactsProps {
    contacts: ContactType[];
    onAdd: () => void;
    onDelete: (index: number) => void;
    onChange: FormikHandlers['handleChange'];
    onBlur: FormikHandlers['handleBlur'];
    getError: ReturnType<typeof getError>;
    setFieldValue: FormikHelpers<any>['setFieldValue'];
}

const Contacts: React.FC<ContactsProps> = ({
    contacts,
    onAdd,
    onDelete,
    onChange,
    onBlur,
    getError,
    setFieldValue,
}) => {
    return (
        <Box>
            {contacts.length > 0 && (
                <Box mb={4}>
                    {contacts.map((contact, index) => (
                        <Contact
                            key={index}
                            contact={contact}
                            index={index}
                            onDelete={onDelete}
                            onChange={onChange}
                            onBlur={onBlur}
                            getError={getError}
                            setFieldValue={setFieldValue}
                        />
                    ))}
                </Box>
            )}
            <Button size="xs" onClick={onAdd}>
                Add contact
            </Button>
        </Box>
    );
};

export default Contacts;
