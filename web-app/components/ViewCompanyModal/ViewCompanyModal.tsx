import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Formik, Form, FormikConfig, FieldArray, ArrayHelpers, setIn } from 'formik';
import { useMutation, useApolloClient } from '@apollo/react-hooks';
import * as Yup from 'yup';
import { ValidationError } from 'yup';
import { useToast, ModalFooter, ModalBody, Box, useDisclosure, Text } from '@robertcooper/chakra-ui-core';
import InputField from '../InputField/InputField';
import Rating from '../Rating/Rating';
import FileUploadField from '../FileUploadField/FileUploadField';
import Modal from '../Modal/Modal';
import ChakraButton from '../ChakraButton/ChakraButton';
import { typography, customTheme } from '../../utils/styles/theme';
import { getError } from '../../utils/getError';
import { CompanyQuery_company } from '../../graphql/generated/CompanyQuery';
import { UpdateCompanyMutation, UpdateCompanyMutationVariables } from '../../graphql/generated/UpdateCompanyMutation';
import { updateCompanyMutation, deleteCompanyMutation } from '../../graphql/mutations';
import { createNewContact } from '../../utils/createNewContact';
import ConfirmDeleteModal from '../ConfirmDeleteModal/ConfirmDeleteModal';
import { DeleteCompanyMutation, DeleteCompanyMutationVariables } from '../../graphql/generated/DeleteCompanyMutation';
import UnsavedChangesModal from '../UnsavedChangesModal/UnsavedChangesModal';
import Contacts from './Contacts';

export const ConfirmDeleteCompany: React.FC<{
    isOpen: boolean;
    companyName: string;
    jobApplicationsCount: number;
    onDelete: () => void;
    isOnDeleteLoading: boolean;
    onClose: () => void;
}> = ({ isOpen, companyName, jobApplicationsCount, onDelete, isOnDeleteLoading, onClose }) => {
    return (
        <ConfirmDeleteModal
            isOpen={isOpen}
            modalBodyContent={
                <>
                    <Text>Are you sure you want to delete the following company?</Text>
                    <Text>
                        <Text as="span" fontWeight="semibold">
                            {companyName}
                        </Text>{' '}
                    </Text>
                    {jobApplicationsCount > 0 && (
                        <Text>
                            This will also delete {jobApplicationsCount} job application
                            {jobApplicationsCount === 1 ? '' : 's'} associated with this company.
                        </Text>
                    )}
                </>
            }
            title="Delete company"
            onDelete={onDelete}
            isOnDeleteLoading={isOnDeleteLoading}
            onClose={onClose}
        />
    );
};

export type RelevantLink = {
    description: string;
    link: string;
};

export const StyledForm = styled(Box)`
    display: grid;
    grid-gap: ${customTheme.space[8]};
`;

export const SectionTitle = styled.span`
    ${typography.captionMedium};
    display: block;
    margin-bottom: ${customTheme.space[2]};
`;

const formSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    website: Yup.string().url('Invalid URL'),
    contacts: Yup.array().of(
        Yup.object().shape({
            id: Yup.string().required(),
            name: Yup.string().required('Name is required'),
            position: Yup.string().nullable(),
            email: Yup.string()
                .email('Invalid email')
                .nullable(),
            phone: Yup.string().nullable(),
            notes: Yup.string().nullable(),
            order: Yup.number().required(),
        })
    ),
    image: Yup.mixed().notRequired(),
    rating: Yup.number().nullable(),
    notes: Yup.string().nullable(),
});

type FormSchema = Yup.InferType<typeof formSchema>;

const handleDeleteContact = (arrayHelpers: ArrayHelpers) => (index: number): void => {
    arrayHelpers.remove(index);
};

const convertToFormData = (companyData: CompanyQuery_company): FormSchema => {
    return {
        name: companyData.name,
        website: companyData.website ?? '',
        contacts: companyData.contacts ?? [],
        rating: companyData.rating,
        notes: companyData.notes,
    };
};

type Props = {
    isOpen: boolean;
    onClose: () => Promise<boolean>;
    onAddCompany?: () => void;
    company: CompanyQuery_company;
};

const ViewCompanyModal: React.FC<Props> = ({ isOpen, onClose, company }) => {
    const toast = useToast();
    const client = useApolloClient();
    const [hasFormBeenUpdated, setHasFormBeenUpdated] = useState(false);
    const [isCompanyImageUpdated, setIsCompanyImageUpdated] = useState(false);
    const { isOpen: isOpenConfirmDelete, onOpen: onOpenConfirmDelete, onClose: onCloseConfirmDelete } = useDisclosure();
    const {
        isOpen: isOpenUnsavedChanges,
        onOpen: onOpenUnsavedChanges,
        onClose: onCloseUnsavedChanges,
    } = useDisclosure();

    const [deleteCompany, { loading: isLoadingDeleteCompany }] = useMutation<
        DeleteCompanyMutation,
        DeleteCompanyMutationVariables
    >(deleteCompanyMutation, {
        onError: () => {
            onCloseConfirmDelete();
            toast({
                title: `Error`,
                description: `Unable to delete company`,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top',
            });
        },
        onCompleted: async () => {
            onCloseConfirmDelete();
            toast({
                title: 'Deleted',
                description: 'Successfully deleted company',
                status: 'success',
                duration: 2000,
                isClosable: true,
                position: 'top',
            });
            // Need to make sure to close the modal before resetting the store or another request will be made to fetch
            // the resume data
            await onClose();
            client.resetStore();
        },
        variables: { id: company?.id as string },
    });

    const [updateCompany] = useMutation<UpdateCompanyMutation, UpdateCompanyMutationVariables>(updateCompanyMutation, {
        onError: () => {
            toast({
                title: 'Error',
                description: `We were unable to update the company`,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top',
            });
        },
        onCompleted: () => {
            toast({
                title: 'Company updated',
                description: 'The company has been saved.',
                status: 'success',
                duration: 2000,
                isClosable: true,
                position: 'top',
            });
            client.resetStore();
        },
    });

    const handleAddContact = (arrayHelpers: ArrayHelpers, order: number): void => {
        arrayHelpers.push(createNewContact(order));
    };

    const handleValidation = async (values: FormSchema): Promise<{ [key: string]: string }> => {
        let errors: { [key: string]: string } = {};
        try {
            await formSchema.validate(values, { abortEarly: false });
        } catch (e) {
            e.inner.map(({ path, message }: ValidationError) => {
                errors = setIn(errors, path, message);
            });
        }
        return errors;
    };

    const handleClose = (dirty: boolean): void => {
        if (!dirty) {
            onClose();
        } else {
            onOpenUnsavedChanges();
        }
    };

    const handleSubmit: FormikConfig<FormSchema>['onSubmit'] = (values, { setSubmitting, resetForm }) => {
        updateCompany({
            variables: {
                id: company.id,
                name: values.name,
                website: values.website,
                rating: values.rating,
                contacts: values.contacts,
                file: values.image,
                notes: values.notes,
                isCompanyImageUpdated,
            },
        })
            .then(() => {
                setIsCompanyImageUpdated(false);
                setHasFormBeenUpdated(true);
                resetForm({
                    values,
                });
            })
            .finally(() => setSubmitting(false));
    };

    return (
        <Formik initialValues={convertToFormData(company)} validate={handleValidation} onSubmit={handleSubmit}>
            {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                setFieldValue,
                isValid,
                isSubmitting,
                dirty,
                resetForm,
            }): JSX.Element => (
                <>
                    <Modal isOpen={isOpen} onClose={(): void => handleClose(dirty)} title={`Company details`}>
                        <ModalBody paddingY={4}>
                            <StyledForm as={Form} id="update-company-form">
                                <Box
                                    d="grid"
                                    gridTemplateColumns={{
                                        sm: `repeat(2, minmax(0, 1fr))`,
                                        md: `repeat(3, minmax(0, 1fr))`,
                                    }}
                                    gridGap={`${customTheme.space[8]} ${customTheme.space[6]}`}
                                >
                                    <InputField
                                        isRequired
                                        label="Name"
                                        id="company-name"
                                        placeholder="Facebook"
                                        name="name"
                                        value={values.name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.name ? errors.name : undefined}
                                    />
                                    <InputField
                                        label="Website"
                                        id="company-website"
                                        placeholder="https://www.facebook.com"
                                        value={values.website}
                                        name="website"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.website ? errors.website : undefined}
                                    />
                                    <Rating
                                        rating={values.rating}
                                        setRating={(rating: number): void => setFieldValue('rating', rating)}
                                        label="Desirability rating"
                                        helpText="How desirable this company is to work for."
                                    />
                                    <FileUploadField
                                        file={values.image as File | undefined}
                                        id="company-image-upload"
                                        label="Image"
                                        setFile={(image: File | undefined): void => {
                                            setIsCompanyImageUpdated(true);
                                            setFieldValue('image', image);
                                        }}
                                        existingFile={
                                            hasFormBeenUpdated
                                                ? undefined
                                                : company?.image && {
                                                      name: company?.image.fileName,
                                                      url: company?.image.cloudfrontUrl,
                                                  }
                                        }
                                        isImage
                                    />
                                </Box>
                                <Box>
                                    <SectionTitle>Contacts</SectionTitle>
                                    <FieldArray name="contacts" validateOnChange={true}>
                                        {(arrayHelpers: ArrayHelpers): JSX.Element => (
                                            <Contacts
                                                setFieldValue={setFieldValue}
                                                contacts={values.contacts}
                                                onAdd={(): void =>
                                                    handleAddContact(arrayHelpers, values.contacts.length ?? 0)
                                                }
                                                onDelete={handleDeleteContact(arrayHelpers)}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                getError={getError({ touched, errors })}
                                            />
                                        )}
                                    </FieldArray>
                                </Box>
                                <Box>
                                    <InputField
                                        id="company-notes"
                                        isTextEditor
                                        value={values.notes ?? ''}
                                        onChange={(value?: string): void => {
                                            setFieldValue('notes', value);
                                        }}
                                        label="Notes"
                                    />
                                </Box>
                            </StyledForm>
                        </ModalBody>
                        <ModalFooter>
                            <ChakraButton
                                marginRight={2}
                                isLoading={false}
                                onClick={onOpenConfirmDelete}
                                variantColor="red"
                                variant="outline"
                            >
                                Delete
                            </ChakraButton>
                            <ChakraButton
                                type="submit"
                                form="update-company-form"
                                size="sm"
                                variantColor="purple"
                                isLoading={isSubmitting}
                                isDisabled={!isValid}
                            >
                                Save
                            </ChakraButton>
                        </ModalFooter>
                    </Modal>
                    <ConfirmDeleteCompany
                        isOpen={isOpenConfirmDelete}
                        companyName={company.name}
                        jobApplicationsCount={company.jobApplicationsCount}
                        onDelete={deleteCompany}
                        isOnDeleteLoading={isLoadingDeleteCompany}
                        onClose={onCloseConfirmDelete}
                    />
                    <UnsavedChangesModal
                        onClose={onCloseUnsavedChanges}
                        isOpen={isOpenUnsavedChanges}
                        onLeave={(): void => {
                            resetForm();
                            onClose();
                        }}
                    />
                </>
            )}
        </Formik>
    );
};

export default ViewCompanyModal;
