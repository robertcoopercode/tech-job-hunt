import React from 'react';
import { useMutation, useApolloClient } from '@apollo/react-hooks';
import styled from '@emotion/styled';
import { Formik, Form, setIn, FormikConfig } from 'formik';
import * as Yup from 'yup';
import { useToast, ModalBody, ModalFooter } from '@robertcooper/chakra-ui-core';
import { useRouter } from 'next/router';
import Modal from '../Modal/Modal';
import FileUploadField from '../FileUploadField/FileUploadField';
import InputField from '../InputField/InputField';
import ChakraButton from '../ChakraButton/ChakraButton';
import { customTheme } from '../../utils/styles/theme';
import { FormError } from '../../utils/getError';
import { createCompanyMutation } from '../../graphql/mutations';
import { CreateCompanyMutation, CreateCompanyMutationVariables } from '../../graphql/generated/CreateCompanyMutation';
import { QueryParamKeys } from '../../utils/constants';
import { useModalQuery } from '../../utils/hooks/useModalQuery';

type Props = {
    onCompleted?: (data: CreateCompanyMutation) => void;
    onClose: (additionalQuery?: { [key: string]: string }) => void;
    isOpen: boolean;
};

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

const formSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    image: Yup.mixed().notRequired(),
});

type FormSchema = Yup.InferType<typeof formSchema>;

const AddCompanyModal: React.FC<Props> = ({ onClose, isOpen, onCompleted }) => {
    const toast = useToast();
    const client = useApolloClient();
    const router = useRouter();

    const companyNameInQuery = router.query[QueryParamKeys.COMPANY_NAME] as string | undefined;

    const { onOpen: onOpenViewCompany } = useModalQuery(QueryParamKeys.VIEW_COMPANY);

    const [addCompany] = useMutation<CreateCompanyMutation, CreateCompanyMutationVariables>(createCompanyMutation, {
        onError: error => {
            let errorMessage = `We were unable to add the company`;
            if (/A unique constraint would be violated on Company/.test(error.message)) {
                errorMessage = `There is already a company with that name`;
            }
            toast({
                title: 'Error',
                description: errorMessage,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top',
            });
        },
        onCompleted: data => {
            client.resetStore();
            toast({
                title: 'Company added',
                description: 'The company has been created.',
                status: 'success',
                duration: 2000,
                isClosable: true,
                position: 'top',
            });
            if (router.query[QueryParamKeys.ADD_JOB] !== 'true') {
                onOpenViewCompany({
                    queryToExclude: QueryParamKeys.ADD_COMPANY,
                    newlyCreatedId: data.createCompany.id,
                });
            }
            if (
                router.query[QueryParamKeys.ADD_JOB] === 'true' ||
                router.query[QueryParamKeys.VIEW_JOB] !== undefined
            ) {
                onClose({
                    [QueryParamKeys.SELECTED_COMPANY_ID]: data.createCompany.id,
                });
                return;
            }
            if (onCompleted) {
                onCompleted(data);
                return;
            }
            onClose();
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
        addCompany({
            variables: {
                name: values.name,
                image: values.image,
            },
        }).finally(() => setSubmitting(false));
    };

    const initialFormikValues: FormSchema = { name: companyNameInQuery !== undefined ? companyNameInQuery : '' };

    return (
        <Modal
            isOpen={isOpen}
            onClose={(): void => {
                // Make sure to call onClose with no arguments to prevent unnecessary query params from being added to the URL
                onClose();
            }}
            title="Add company"
            size="md"
        >
            <Formik
                initialValues={initialFormikValues}
                validate={handleValidation}
                onSubmit={handleSubmit}
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
                            <Form id="add-company-form">
                                <FormWrapper>
                                    <InputField
                                        label="Name"
                                        name="name"
                                        id="company-name"
                                        placeholder="Facebook"
                                        value={values.name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.name ? errors.name : undefined}
                                        isRequired
                                    />
                                    <FileUploadField
                                        file={values.image as File | undefined}
                                        setFile={(image: File | undefined): void => setFieldValue('image', image)}
                                        label="Company logo"
                                        error={touched.image ? (errors.image as FormError) : undefined}
                                        id="company-image-upload"
                                        isImage
                                    />
                                </FormWrapper>
                            </Form>
                        </ModalBody>
                        <ModalFooter d="flex" flexDirection="column" alignItems="flex-end">
                            <ChakraButton
                                form="add-company-form"
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

export default AddCompanyModal;
