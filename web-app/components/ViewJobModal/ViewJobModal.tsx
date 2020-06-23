import { useApolloClient, useMutation, useQuery, useLazyQuery } from '@apollo/react-hooks';
import styled from '@emotion/styled';
import {
    Box,
    Button,
    IconButton,
    ModalBody,
    ModalFooter,
    PseudoBox,
    Switch,
    Text,
    useDisclosure,
    useToast,
} from '@robertcooper/chakra-ui-core';
import { ArrayHelpers, FieldArray, Form, Formik, FormikConfig, useFormikContext } from 'formik';
import debounce from 'lodash.debounce';
import React, { ChangeEvent, useCallback, useState, useEffect } from 'react';
import { MdRemoveCircle } from 'react-icons/md';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import {
    DeleteJobApplicationMutation,
    DeleteJobApplicationMutationVariables,
} from '../../graphql/generated/DeleteJobApplicationMutation';
import { ApplicationStatus, JobDecision } from '../../graphql/generated/graphql-global-types';
import { JobApplicationQuery, JobApplicationQuery_jobApplication } from '../../graphql/generated/JobApplicationQuery';
import { SuggestedCompanies } from '../../graphql/generated/SuggestedCompanies';
import {
    UpdateJobApplicationMutation,
    UpdateJobApplicationMutationVariables,
} from '../../graphql/generated/UpdateJobApplicationMutation';
import { deleteJobApplicationMutation, updateJobApplicationMutation } from '../../graphql/mutations';
import { suggestedCompaniesQuery, companyQuery } from '../../graphql/queries';
import { QueryParamKeys } from '../../utils/constants';
import { createNewContact } from '../../utils/createNewContact';
import { formateDateForInput as formatDateForInput } from '../../utils/formatDate';
import { getError } from '../../utils/getError';
import { customTheme, mediaQueries } from '../../utils/styles/theme';
import AddCompanyModal from '../AddCompanyModal/AddCompanyModal';
import AddResumeModal from '../AddResumeModal/AddResumeModal';
import ChakraButton from '../ChakraButton/ChakraButton';
import ConfirmDeleteModal from '../ConfirmDeleteModal/ConfirmDeleteModal';
import FileUploadField, { UploadedFileDetails } from '../FileUploadField/FileUploadField';
import InputField, { FormInput, FormInputLabel } from '../InputField/InputField';
import Loader from '../Loader/Loader';
import Modal from '../Modal/Modal';
import SelectResumeModal from '../SelectResumeModal/SelectResumeModal';
import UnsavedChangesModal from '../UnsavedChangesModal/UnsavedChangesModal';
import { StyledForm } from '../ViewCompanyModal/ViewCompanyModal';
import { useModalQuery } from '../../utils/hooks/useModalQuery';
import { CompanyQuery, CompanyQueryVariables } from '../../graphql/generated/CompanyQuery';
import { convertToOption } from '../AddJobModal/AddJobModal';
import ApplicationStatusSection from './ApplicationStatusSection';
import BasicInfoSection from './BasicInfoSection';
import ContactSection from './ContactSection';
import Section from './Section';

export const ConfirmDeleteJobApplication: React.FC<{
    isOpen: boolean;
    jobApplicationName: string;
    companyName: string;
    onDelete: () => void;
    isOnDeleteLoading: boolean;
    onClose: () => void;
}> = ({ isOpen, jobApplicationName, companyName, onDelete, isOnDeleteLoading, onClose }) => {
    return (
        <ConfirmDeleteModal
            isOpen={isOpen}
            modalBodyContent={
                <>
                    <Text>Are you sure you want to delete the following job application?</Text>
                    <Text>
                        <Text as="span" fontWeight="semibold">
                            {jobApplicationName}
                        </Text>{' '}
                        at{' '}
                        <Text as="span" fontWeight="semibold">
                            {companyName}
                        </Text>
                    </Text>
                </>
            }
            title="Delete job application"
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

export type DropdownSearchOption = {
    name: string;
    id: string;
    imageUrl?: string | null;
    [key: string]: any;
};

export const SubGrid = styled(Box)`
    display: grid;
    grid-gap: ${customTheme.space[6]};

    ${mediaQueries.md} {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    ${mediaQueries.lg} {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
`;

const formSchema = Yup.object().shape({
    company: Yup.object()
        .shape({
            name: Yup.string().required('Company is invalid'),
            id: Yup.string().required('Company is invalid'),
            imageUrl: Yup.string().notRequired().nullable(),
        })
        .typeError('Please select a company')
        .required('Please select a company'),
    position: Yup.string().required('Position is required'),
    location: Yup.object()
        .shape({
            id: Yup.string().required(),
            name: Yup.string().required(),
            googlePlacesId: Yup.string().required(),
        })
        .default(null)
        .nullable()
        .notRequired(),
    rating: Yup.number().nullable(),
    isRemote: Yup.boolean(),
    jobListingLink: Yup.string().url('Invalid URL').nullable(),
    jobListingNotes: Yup.string().nullable(),
    contacts: Yup.array()
        .of(
            Yup.object().shape({
                id: Yup.string().required(),
                name: Yup.string().required('Name is required'),
                position: Yup.string().nullable(),
                email: Yup.string().email('Invalid email').nullable(),
                phone: Yup.string().nullable(),
                notes: Yup.string().nullable(),
                order: Yup.number().required(),
            })
        )
        .nullable(),
    resume: Yup.object()
        .shape({
            resumeId: Yup.string().required('Resume is invalid'),
            name: Yup.string().required('Resume name is required'),
            selectedVersionId: Yup.string().required('Version is required'),
            versions: Yup.array(
                Yup.object().shape({
                    id: Yup.string(),
                    url: Yup.string(),
                    createdAt: Yup.string(),
                })
            ),
        })
        .default(null)
        .nullable()
        .notRequired(),
    /** File object or undefined */
    coverLetterFile: Yup.mixed().notRequired(),
    isApplicationActive: Yup.boolean(),
    jobDecision: Yup.mixed().oneOf([...Object.values(JobDecision), null]),
    applicationStatus: Yup.mixed().oneOf(Object.values(ApplicationStatus)),
    dateApplied: Yup.string().nullable(),
    dateInterviewing: Yup.array().of(Yup.string()).nullable(),
    dateOffered: Yup.string().nullable(),
    dateDecided: Yup.string().nullable(),
    notes: Yup.string().nullable(),
});

export type FormSchema = Yup.InferType<typeof formSchema>;

const handleDeleteContact = (arrayHelpers: ArrayHelpers) => (index: number): void => {
    arrayHelpers.remove(index);
};

const convertToFormData = (jobApplication: JobApplicationQuery['jobApplication'] | undefined): FormSchema => {
    return {
        isApplicationActive: jobApplication?.isApplicationActive ?? false,
        company: {
            id: jobApplication?.Company?.id ?? '',
            name: jobApplication?.Company?.name ?? '',
            imageUrl: jobApplication?.Company?.Image?.cloudfrontUrl,
        },
        position: jobApplication?.position ?? '',
        location: jobApplication?.Location,
        isRemote: jobApplication?.isRemote ?? false,
        rating: jobApplication?.rating ?? null,
        jobListingLink: jobApplication?.jobListingLink ?? null,
        jobListingNotes: jobApplication?.jobListingNotes ?? null,
        resume: jobApplication?.Resume?.Resume?.id
            ? {
                  resumeId: jobApplication?.Resume.Resume.id,
                  name: jobApplication?.Resume.Resume.name,
                  selectedVersionId: jobApplication.Resume.selectedVersionId,
                  versions:
                      jobApplication.Resume.Resume.Versions?.map((v): {
                          id: string;
                          url: string;
                          createdAt: string;
                      } => ({
                          id: v.id,
                          url: v.cloudfrontUrl,
                          createdAt: v.createdAt,
                      })) ?? [],
              }
            : undefined,
        coverLetterFile: undefined,
        contacts: jobApplication?.Contacts ?? null,
        applicationStatus: jobApplication?.applicationStatus ?? ApplicationStatus.INTERESTED,
        jobDecision: jobApplication?.jobDecision,
        dateApplied: formatDateForInput(jobApplication?.dateApplied),
        dateDecided: formatDateForInput(jobApplication?.dateDecided),
        dateInterviewing:
            jobApplication?.JobApplication_dateInterviewing.length !== 0
                ? jobApplication?.JobApplication_dateInterviewing.map((date): string =>
                      formatDateForInput(date.value)
                  ) ?? ['']
                : [''],
        dateOffered: formatDateForInput(jobApplication?.dateOffered),
        notes: jobApplication?.notes ?? null,
    };
};

type Props = {
    isOpen: boolean;
    onClose: () => Promise<boolean>;
    jobApplication: JobApplicationQuery_jobApplication;
};

const ViewJobModalContents: React.FC<
    Props & {
        hasFormBeenUpdated: boolean;
        setIsCoverLetterUpdated: React.Dispatch<React.SetStateAction<boolean>>;
    }
> = ({ isOpen, onClose, jobApplication, hasFormBeenUpdated, setIsCoverLetterUpdated }) => {
    const toast = useToast();
    const client = useApolloClient();
    const router = useRouter();
    const {
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        setFieldValue,
        isValid,
        setFieldTouched,
        isSubmitting,
        dirty,
        resetForm,
    } = useFormikContext<FormSchema>();
    const selectedCompanyQuery = router.query[QueryParamKeys.SELECTED_COMPANY_ID] as string | undefined;

    const { isOpen: isOpenConfirmDelete, onOpen: onOpenConfirmDelete, onClose: onCloseConfirmDelete } = useDisclosure();
    const { isOpen: isOpenAddResume, onOpen: onOpenAddResume, onClose: onCloseAddResume } = useDisclosure();
    const { isOpen: isOpenAddCompany, onOpen: onOpenAddCompany, onClose: onCloseAddCompany } = useModalQuery(
        QueryParamKeys.ADD_COMPANY
    );
    const { isOpen: isOpenSelectResume, onOpen: onOpenSelectResume, onClose: onCloseSelectResume } = useDisclosure();
    const {
        isOpen: isOpenUnsavedChanges,
        onOpen: onOpenUnsavedChanges,
        onClose: onCloseUnsavedChanges,
    } = useDisclosure();

    const [getCompany] = useLazyQuery<CompanyQuery, CompanyQueryVariables>(companyQuery, {
        onCompleted: (data) => {
            if (data.company !== null) {
                setFieldValue('company', convertToOption(data.company));
            }
        },
    });
    const [isLoadingCompanySearchResults, setIsLoadingCompanySearchResults] = useState(false);
    const [companySearchQuery, setCompanySearchQuery] = useState('');

    const {
        data: suggestedCompanies,
        loading: loadingSuggestedCompanies,
        refetch: refetchSuggestedCompanies,
    } = useQuery<SuggestedCompanies>(suggestedCompaniesQuery, {
        variables: { searchQuery: '' },
    });

    const [deleteJobApplication, { loading: isLoadingDeleteJobApplication }] = useMutation<
        DeleteJobApplicationMutation,
        DeleteJobApplicationMutationVariables
    >(deleteJobApplicationMutation, {
        onError: (): void => {
            onCloseConfirmDelete();
            toast({
                title: `Error`,
                description: `Unable to delete job application`,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top',
            });
        },
        onCompleted: async (): Promise<void> => {
            onCloseConfirmDelete();
            toast({
                title: 'Deleted',
                description: 'Successfully deleted job application',
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
        variables: { jobId: jobApplication.id },
    });

    useEffect(() => {
        if (selectedCompanyQuery) {
            setCompanySearchQuery('');
            getCompany({ variables: { id: selectedCompanyQuery } });
        }
    }, [getCompany, selectedCompanyQuery]);

    const debouncedCompanyRefetch = useCallback(
        debounce(async (variables: Parameters<typeof refetchSuggestedCompanies>[0]) => {
            await refetchSuggestedCompanies(variables);
            return setIsLoadingCompanySearchResults(false);
        }, 500),
        [refetchSuggestedCompanies]
    );

    const handleCompanySearchQueryChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setCompanySearchQuery(e.target.value);
        setIsLoadingCompanySearchResults(true);
        debouncedCompanyRefetch({
            searchQuery: e.target.value,
        });
    };

    const companyOptions: DropdownSearchOption[] = suggestedCompanies?.companies.nodes
        ? suggestedCompanies?.companies.nodes.map((company): DropdownSearchOption => convertToOption(company))
        : [];

    const handleAddContact = (arrayHelpers: ArrayHelpers, order: number): void => {
        arrayHelpers.push(createNewContact(order));
    };

    const handleClose = (dirty: boolean): void => {
        if (!dirty) {
            onClose();
        } else {
            onOpenUnsavedChanges();
        }
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={(): void => handleClose(dirty)} title={`Job details`}>
                {!jobApplication ? (
                    <ModalBody paddingY={24}>
                        <Loader />
                    </ModalBody>
                ) : (
                    <>
                        <ModalBody paddingY={4}>
                            <StyledForm as={Form} id="update-job-form">
                                <BasicInfoSection
                                    setFieldValue={setFieldValue}
                                    handleOptionSelection={(option: DropdownSearchOption | null): void => {
                                        setCompanySearchQuery('');
                                        setFieldValue('company', option);
                                    }}
                                    isLoadingCompanySearchResults={
                                        isLoadingCompanySearchResults || loadingSuggestedCompanies
                                    }
                                    companySearchQuery={companySearchQuery}
                                    handleCompanySearchQueryChange={handleCompanySearchQueryChange}
                                    company={values.company}
                                    companyOptions={companyOptions}
                                    position={values.position}
                                    location={values.location}
                                    rating={values.rating}
                                    setRating={(rating: number): void => setFieldValue('rating', rating)}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    setFieldTouched={setFieldTouched}
                                    getError={getError({ touched, errors })}
                                    onAddNewCompany={(): void => {
                                        onOpenAddCompany({
                                            additionalQueries: {
                                                [QueryParamKeys.COMPANY_NAME]: companySearchQuery,
                                            },
                                        });
                                    }}
                                    link={values.jobListingLink}
                                    notes={values.jobListingNotes}
                                    toggleIsRemote={(): void => {
                                        setFieldValue('isRemote', !values.isRemote);
                                    }}
                                    isRemote={values.isRemote}
                                />
                                <ApplicationStatusSection
                                    applicationStatus={values.applicationStatus}
                                    jobDecision={values.jobDecision}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    getError={getError({ touched, errors })}
                                    setFieldValue={setFieldValue}
                                />
                                <Section title="Dates">
                                    <SubGrid>
                                        <InputField
                                            value={values.dateApplied || ''}
                                            onChange={handleChange}
                                            id="dateApplied"
                                            name="dateApplied"
                                            label={'Date applied'}
                                            helpText="The date the application was submitted."
                                            type="date"
                                            onBlur={handleBlur}
                                            error={getError({ touched, errors })('dateApplied')}
                                        />
                                        <InputField
                                            value={values.dateOffered || ''}
                                            onChange={handleChange}
                                            id="dateOffered"
                                            name="dateOffered"
                                            label={'Offer received date'}
                                            helpText="The date the offer was received."
                                            type="date"
                                            onBlur={handleBlur}
                                            error={getError({ touched, errors })('dateOffered')}
                                        />
                                        <InputField
                                            value={values.dateDecided || ''}
                                            onChange={handleChange}
                                            id="dateDecided"
                                            name="dateDecided"
                                            label={'Decision date'}
                                            helpText="The date a decision was made."
                                            type="date"
                                            onBlur={handleBlur}
                                            error={getError({ touched, errors })('dateDecided')}
                                        />
                                        <Box>
                                            <FormInputLabel
                                                id="dateInterviewing"
                                                label="Interview dates"
                                                helpText="The dates of all interviews."
                                            />
                                            <FieldArray name="dateInterviewing">
                                                {(arrayHelpers: ArrayHelpers): JSX.Element => (
                                                    <>
                                                        {values.dateInterviewing?.map(
                                                            (date, index): JSX.Element => (
                                                                <PseudoBox
                                                                    key={index}
                                                                    d="flex"
                                                                    alignItems="center"
                                                                    mb={2}
                                                                >
                                                                    <FormInput
                                                                        id={`dateInterviewing${index}`}
                                                                        hiddenLabel={`Interview data ${index}`}
                                                                        value={date}
                                                                        type="date"
                                                                        onChange={handleChange}
                                                                        name={`dateInterviewing.${index}`}
                                                                        onBlur={handleBlur}
                                                                        error={getError({
                                                                            touched,
                                                                            errors,
                                                                        })(`dateInterviewing.${index}`)}
                                                                        wrapperStyles={{ flexGrow: 1 }}
                                                                    />
                                                                    {index !== 0 && (
                                                                        <IconButton
                                                                            aria-label={'Remove date'}
                                                                            icon={MdRemoveCircle}
                                                                            size="sm"
                                                                            onClick={(): void =>
                                                                                arrayHelpers.remove(index)
                                                                            }
                                                                            variant="ghost"
                                                                            ml={2}
                                                                        />
                                                                    )}
                                                                </PseudoBox>
                                                            )
                                                        )}
                                                        {(values.dateInterviewing?.length ?? 0) <= 5 && (
                                                            <Button
                                                                onClick={(): void => arrayHelpers.push('')}
                                                                size="xs"
                                                            >
                                                                Add date
                                                            </Button>
                                                        )}
                                                    </>
                                                )}
                                            </FieldArray>
                                        </Box>
                                    </SubGrid>
                                </Section>
                                <FieldArray name="contacts">
                                    {(arrayHelpers: ArrayHelpers): JSX.Element => (
                                        <ContactSection
                                            setFieldValue={setFieldValue}
                                            contacts={values.contacts}
                                            onAdd={(): void =>
                                                handleAddContact(arrayHelpers, values.contacts?.length ?? 0)
                                            }
                                            onDelete={handleDeleteContact(arrayHelpers)}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            getError={getError({ touched, errors })}
                                        />
                                    )}
                                </FieldArray>
                                <Section title="Submission Assets">
                                    <SubGrid>
                                        <Box>
                                            <FormInputLabel
                                                label="Resume"
                                                helpText="Select the resume used with this application."
                                                onClick={onOpenSelectResume}
                                            />
                                            {values.resume ? (
                                                <UploadedFileDetails
                                                    url={
                                                        values.resume.versions.find(
                                                            (v) => v.id === values.resume?.selectedVersionId
                                                        )?.url as string
                                                    }
                                                    fileName={values.resume.name}
                                                    isImage={false}
                                                    onRemove={(): void => setFieldValue('resume', null)}
                                                />
                                            ) : (
                                                <Button
                                                    variant="link"
                                                    variantColor="gray"
                                                    size="sm"
                                                    onClick={onOpenSelectResume}
                                                >
                                                    Select resume
                                                </Button>
                                            )}
                                        </Box>
                                        <FileUploadField
                                            id="cover-letter-upload"
                                            file={values.coverLetterFile}
                                            setFile={(coverLetter: File | undefined): void => {
                                                setIsCoverLetterUpdated(true);
                                                setFieldValue('coverLetterFile', coverLetter);
                                            }}
                                            existingFile={
                                                hasFormBeenUpdated
                                                    ? undefined
                                                    : jobApplication.CoverLetterFile && {
                                                          name: jobApplication.CoverLetterFile.fileName,
                                                          url: jobApplication.CoverLetterFile.cloudfrontUrl,
                                                      }
                                            }
                                            label="Cover letter"
                                            helpText="The cover letter you've submitted with the job application."
                                            accept=".pdf"
                                        />
                                    </SubGrid>
                                </Section>
                                <Section title="Other">
                                    <SubGrid>
                                        <Box gridColumn={{ base: '1 / 2', lg: '1 / 4' }}>
                                            <InputField
                                                id="job-notes"
                                                isTextEditor
                                                value={values.notes ?? ''}
                                                onChange={(value?: string): void => {
                                                    setFieldValue('notes', value);
                                                }}
                                                label="Notes"
                                            />
                                        </Box>
                                        <Box>
                                            <FormInputLabel
                                                id="activeApplication"
                                                label="Active application?"
                                                helpText="Keep this application marked as active if you expect to receive
                                                        a follow-up on your application."
                                            />
                                            <Switch
                                                id="activeApplication"
                                                onChange={(): void =>
                                                    setFieldValue('isApplicationActive', !values.isApplicationActive)
                                                }
                                                isChecked={values.isApplicationActive}
                                            />
                                        </Box>
                                    </SubGrid>
                                </Section>
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
                                form="update-job-form"
                                size="sm"
                                variantColor="purple"
                                isLoading={isSubmitting}
                                isDisabled={!isValid}
                            >
                                Save
                            </ChakraButton>
                        </ModalFooter>
                    </>
                )}
            </Modal>
            <ConfirmDeleteJobApplication
                isOpen={isOpenConfirmDelete}
                jobApplicationName={jobApplication?.position}
                companyName={jobApplication?.Company?.name ?? ''}
                onDelete={deleteJobApplication}
                isOnDeleteLoading={isLoadingDeleteJobApplication}
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
            <AddCompanyModal isOpen={isOpenAddCompany} onClose={onCloseAddCompany} />
            <AddResumeModal isOpen={isOpenAddResume} onClose={onCloseAddResume} />
            <SelectResumeModal
                isOpen={isOpenSelectResume}
                onClose={onCloseSelectResume}
                onOpenAddResume={onOpenAddResume}
                onSelect={(data: FormSchema['resume']): void => setFieldValue('resume', data)}
                selectedResume={values.resume}
                error={getError({ touched, errors })('resume')}
                onBlur={(): void => setFieldTouched('resume')}
            />
        </>
    );
};

const ViewJobModal: React.FC<Props> = (props) => {
    const toast = useToast();
    const client = useApolloClient();
    const [isCoverLetterUpdated, setIsCoverLetterUpdated] = useState(false);
    const [hasFormBeenUpdated, setHasFormBeenUpdated] = useState(false);
    const [updateJob] = useMutation<UpdateJobApplicationMutation, UpdateJobApplicationMutationVariables>(
        updateJobApplicationMutation,
        {
            onError: () => {
                toast({
                    title: 'Error',
                    description: `We were unable to update the job`,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'top',
                });
            },
            onCompleted: () => {
                client.resetStore();
                toast({
                    title: 'Job updated',
                    description: 'The job has been saved.',
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                    position: 'top',
                });
            },
        }
    );
    const handleSubmit: FormikConfig<FormSchema>['onSubmit'] = (values, { setSubmitting, resetForm }) => {
        updateJob({
            variables: {
                id: props.jobApplication?.id as string,
                companyId: values.company.id,
                position: values.position,
                location: values.location,
                rating: values.rating,
                jobListingLink: values.jobListingLink,
                jobListingNotes: values.jobListingNotes,
                isApplicationActive: values.isApplicationActive,
                contacts: values.contacts ?? [],
                resumeId: values.resume?.resumeId ?? (values.resume === null ? null : undefined),
                resumeVersionId: values.resume?.selectedVersionId ?? (values.resume === null ? null : undefined),
                coverLetterFile: values.coverLetterFile,
                isCoverLetterUpdated,
                applicationStatus: values.applicationStatus,
                dateApplied: values.dateApplied,
                dateDecided: values.dateDecided,
                dateInterviewing: values.dateInterviewing,
                dateOffered: values.dateOffered,
                isRemote: values.isRemote,
                jobDecision: values.jobDecision,
                notes: values.notes,
            },
        })
            .then(async () => {
                setHasFormBeenUpdated(true);
                resetForm({
                    values,
                });
            })
            .finally(() => setSubmitting(false));
    };
    return (
        <Formik
            initialValues={convertToFormData(props.jobApplication)}
            validationSchema={formSchema}
            onSubmit={handleSubmit}
        >
            <ViewJobModalContents
                {...props}
                hasFormBeenUpdated={hasFormBeenUpdated}
                setIsCoverLetterUpdated={setIsCoverLetterUpdated}
            />
        </Formik>
    );
};

export default ViewJobModal;
