import React from 'react';
import { useMutation, useApolloClient } from '@apollo/react-hooks';
import styled from '@emotion/styled';
import { Formik, Form, setIn, FormikConfig } from 'formik';
import * as Yup from 'yup';
import { useToast, ModalBody, ModalFooter, Box, Text, useDisclosure } from '@robertcooper/chakra-ui-core';
import { MdCloudDownload } from 'react-icons/md';
import Modal from '../Modal/Modal';
import FileUploadField from '../FileUploadField/FileUploadField';
import InputField from '../InputField/InputField';
import ChakraButton from '../ChakraButton/ChakraButton';
import { customTheme, typography } from '../../utils/styles/theme';
import { UpdateResumeMutationVariables, UpdateResumeMutation } from '../../graphql/generated/UpdateResumeMutation';
import { ResumeQuery_resume } from '../../graphql/generated/ResumeQuery';
import { formatDate } from '../../utils/formatDate';
import { FormError } from '../../utils/getError';
import { updateResumeMutation, deleteResumeMutation } from '../../graphql/mutations';
import ConfirmDeleteModal from '../ConfirmDeleteModal/ConfirmDeleteModal';
import { DeleteResumeMutation, DeleteResumeMutationVariables } from '../../graphql/generated/DeleteResumeMutation';
import UnsavedChangesModal from '../UnsavedChangesModal/UnsavedChangesModal';

export const ConfirmDeleteResume: React.FC<{
    isOpen: boolean;
    resumeName: string;
    onDelete: () => void;
    isOnDeleteLoading: boolean;
    onClose: () => void;
}> = ({ isOpen, resumeName, onDelete, onClose, isOnDeleteLoading }) => (
    <ConfirmDeleteModal
        isOpen={isOpen}
        modalBodyContent={
            <>
                <Text>Are you sure you want to delete the following resume?</Text>
                <Text>
                    <Text as="span" fontWeight="semibold">
                        {resumeName}
                    </Text>
                </Text>
            </>
        }
        title="Delete resume"
        onDelete={onDelete}
        onClose={onClose}
        isOnDeleteLoading={isOnDeleteLoading}
    />
);

const FormWrapper = styled.div`
    display: flex;
    flex-direction: column;

    > * {
        margin-bottom: ${customTheme.space[6]};

        &:last-of-type {
            margin-bottom: 0;
        }
    }
`;

const Heading = styled(Text)`
    ${typography.captionMedium};
    margin: 0;
    margin-bottom: ${customTheme.space[2]};
`;

const ResumeVersionWrapper = styled(Box)`
    margin-bottom: ${customTheme.space[2]};

    &:last-of-type {
        margin-bottom: 0;
    }
`;

const ResumeVersion: React.FC<{ url: string; date: string }> = ({ url, date }) => (
    <ResumeVersionWrapper
        as="button"
        {...{ type: 'button' }}
        d="flex"
        alignItems="center"
        onClick={(): void => {
            window.open(url);
        }}
    >
        <Box as={MdCloudDownload} size="20px" mr={2} />
        <Text as="span">{formatDate(date)}</Text>
    </ResumeVersionWrapper>
);

const formSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    resume: Yup.mixed().notRequired(), // Note, we can use the .test() method for custom validation of the file: https://github.com/
});

type FormSchema = Yup.InferType<typeof formSchema>;

const convertToFormData = (data: ResumeQuery_resume | FormSchema): FormSchema => {
    return {
        name: data.name,
    };
};

interface Props {
    onClose: () => Promise<boolean>;
    isOpen: boolean;
    resume: ResumeQuery_resume;
}

const ViewResumeModal: React.FC<Props> = ({ onClose, isOpen, resume }) => {
    const toast = useToast();
    const client = useApolloClient();

    const { isOpen: isOpenConfirmDelete, onOpen: onOpenConfirmDelete, onClose: onCloseConfirmDelete } = useDisclosure();
    const {
        isOpen: isOpenUnsavedChanges,
        onOpen: onOpenUnsavedChanges,
        onClose: onCloseUnsavedChanges,
    } = useDisclosure();

    const [updateResume] = useMutation<UpdateResumeMutation, UpdateResumeMutationVariables>(updateResumeMutation, {
        onError: () => {
            toast({
                title: 'Error',
                description: `We were unable to update your resume`,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top',
            });
        },
        onCompleted: () => {
            client.resetStore();
            toast({
                title: 'Resume added',
                description: 'Your resume has been saved.',
                status: 'success',
                duration: 2000,
                isClosable: true,
                position: 'top',
            });
        },
    });

    const [deleteResume, { loading: isLoadingDeleteResume }] = useMutation<
        DeleteResumeMutation,
        DeleteResumeMutationVariables
    >(deleteResumeMutation, {
        onError: () => {
            onCloseConfirmDelete();
            toast({
                title: `Error`,
                description: `Unable to delete resume`,
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
                description: 'Successfully deleted resume',
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
        variables: { id: resume?.id as string },
    });

    const handleValidation = async (values: FormSchema): Promise<{ [key: string]: string }> => {
        let errors: { [key: string]: string } = {};
        try {
            await formSchema.validate(values, { abortEarly: false });
        } catch (e) {
            e.inner.map(({ path, message }: Yup.ValidationError) => {
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
        updateResume({
            variables: {
                id: resume.id,
                name: values.name,
                file: values.resume,
            },
        })
            .then(() => {
                resetForm({
                    values,
                });
            })
            .finally(() => setSubmitting(false));
    };

    return (
        <Formik initialValues={convertToFormData(resume)} validate={handleValidation} onSubmit={handleSubmit}>
            {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                setFieldValue,
                isValid,
                isSubmitting,
                resetForm,
                dirty,
            }): JSX.Element => (
                <>
                    <Modal isOpen={isOpen} onClose={(): void => handleClose(dirty)} title="Resume details" size="md">
                        <ModalBody>
                            <Form id="update-resume-form">
                                <FormWrapper>
                                    <InputField
                                        label="Name"
                                        name="name"
                                        id="resume-name"
                                        placeholder="2019 Software Engineering Resume"
                                        value={values.name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.name ? errors.name : undefined}
                                        isRequired
                                    />
                                    {resume.Versions && (
                                        <Box>
                                            <Heading>Latest version</Heading>
                                            <ResumeVersion
                                                url={resume.Versions[0].cloudfrontUrl}
                                                date={resume.Versions[0].createdAt}
                                            />
                                        </Box>
                                    )}
                                    {resume.Versions && resume.Versions.slice(1).length > 0 && (
                                        <Box>
                                            <Heading>Previous versions</Heading>
                                            {resume.Versions.slice(1).map(version => (
                                                <ResumeVersion
                                                    key={version.VersionId}
                                                    url={version.cloudfrontUrl}
                                                    date={version.createdAt}
                                                />
                                            ))}
                                        </Box>
                                    )}
                                    <FileUploadField
                                        file={values.resume as File | undefined}
                                        setFile={(resume: File | undefined): void => setFieldValue('resume', resume)}
                                        label="Upload new version"
                                        error={touched.resume ? (errors.resume as FormError) : undefined}
                                        id="resume-version-upload"
                                        accept=".pdf"
                                    />
                                </FormWrapper>
                            </Form>
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
                                form="update-resume-form"
                                type="submit"
                                isLoading={isSubmitting}
                                isDisabled={!isValid}
                                variantColor="purple"
                                size="sm"
                            >
                                Save
                            </ChakraButton>
                        </ModalFooter>
                    </Modal>
                    <ConfirmDeleteResume
                        isOpen={isOpenConfirmDelete}
                        resumeName={resume.name}
                        onDelete={deleteResume}
                        isOnDeleteLoading={isLoadingDeleteResume}
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

export default ViewResumeModal;
