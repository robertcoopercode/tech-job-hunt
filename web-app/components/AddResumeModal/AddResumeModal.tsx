import React from 'react';
import { useMutation, useApolloClient } from '@apollo/react-hooks';
import styled from '@emotion/styled';
import { Formik, Form, setIn, FormikConfig } from 'formik';
import * as Yup from 'yup';
import { useToast, ModalBody, ModalFooter } from '@robertcooper/chakra-ui-core';
import Modal from '../Modal/Modal';
import FileUploadField from '../FileUploadField/FileUploadField';
import InputField from '../InputField/InputField';
import ChakraButton from '../ChakraButton/ChakraButton';
import { CreateResumeMutation, CreateResumeMutationVariables } from '../../graphql/generated/CreateResumeMutation';
import { customTheme } from '../../utils/styles/theme';
import { FormError } from '../../utils/getError';
import { createResume } from '../../graphql/mutations';

interface AddResumeModalProps {
    onClose: () => void;
    isOpen: boolean;
    onCompleted?: (data: CreateResumeMutation) => void;
}

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

const initialFormikValues: FormSchema = { name: '', resume: null };

const formSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    resume: Yup.mixed().nullable().required('Resume file is required'), // Note, we can use the .test() method for custom validation of the file: https://github.com/
});

type FormSchema = Yup.InferType<typeof formSchema>;

const AddResumeModal: React.FC<AddResumeModalProps> = ({ onClose, isOpen, onCompleted = onClose }) => {
    const toast = useToast();
    const client = useApolloClient();

    const [addResume] = useMutation<CreateResumeMutation, CreateResumeMutationVariables>(createResume, {
        onError: () => {
            toast({
                title: 'Error',
                description: `We were unable to add your resume`,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top',
            });
        },
        onCompleted: (data) => {
            client.resetStore();
            onCompleted(data);
        },
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

    const handleSubmit: FormikConfig<FormSchema>['onSubmit'] = (values, { setSubmitting }) => {
        addResume({
            variables: {
                name: values.name,
                file: values.resume,
            },
        }).finally(() => setSubmitting(false));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add resume" size="md">
            <Formik
                initialValues={initialFormikValues}
                validate={handleValidation}
                onSubmit={handleSubmit as any}
                validateOnMount
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    setFieldValue,
                    isSubmitting,
                    isValid,
                }): JSX.Element => (
                    <>
                        <ModalBody>
                            <Form id="add-resume-form">
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
                                    <FileUploadField
                                        file={values.resume as File | undefined}
                                        setFile={(resume: File | undefined): void => setFieldValue('resume', resume)}
                                        label="Resume"
                                        error={touched.resume ? (errors.resume as FormError) : undefined}
                                        id="resume-upload"
                                        accept=".pdf"
                                    />
                                </FormWrapper>
                            </Form>
                        </ModalBody>
                        <ModalFooter d="flex" flexDirection="column" alignItems="flex-end">
                            <ChakraButton
                                form="add-resume-form"
                                type="submit"
                                isLoading={isSubmitting}
                                isDisabled={!isValid}
                            >
                                Save
                            </ChakraButton>
                        </ModalFooter>
                    </>
                )}
            </Formik>
        </Modal>
    );
};

export default AddResumeModal;
