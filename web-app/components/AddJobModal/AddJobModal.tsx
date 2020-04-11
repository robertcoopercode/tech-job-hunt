import React, { useState, useCallback, ChangeEvent, useEffect } from 'react';
import { useMutation, useQuery, useApolloClient, useLazyQuery } from '@apollo/react-hooks';
import styled from '@emotion/styled';
import { Formik, Form, FormikConfig, useFormikContext } from 'formik';
import * as Yup from 'yup';
import {
    useToast,
    ModalBody,
    ModalFooter,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
} from '@robertcooper/chakra-ui-core';
import debounce from 'lodash.debounce';
import { useRouter } from 'next/router';
import Modal from '../Modal/Modal';
import InputField from '../InputField/InputField';
import ChakraButton from '../ChakraButton/ChakraButton';
import {
    suggestedCompaniesQuery,
    currentUserQuery,
    jobApplicationsCountQuery,
    companyQuery,
} from '../../graphql/queries';
import { customTheme } from '../../utils/styles/theme';
import { getError } from '../../utils/getError';
import { createJobApplicationMutation } from '../../graphql/mutations';
import DropdownSearchField from '../DropdownSearchField/DropdownSearchField';
import {
    CreateJobApplicationMutation,
    CreateJobApplicationMutationVariables,
} from '../../graphql/generated/CreateJobApplicationMutation';
import { SuggestedCompanies } from '../../graphql/generated/SuggestedCompanies';
import { DropdownSearchOption } from '../ViewJobModal/ViewJobModal';
import ToggleWithLabel from '../Toggle/ToggleWithLabel';
import { useGooglePlacesService } from '../../utils/hooks/useGooglePlacesService';
import { useModalQuery } from '../../utils/hooks/useModalQuery';
import { QueryParamKeys, freeTierJobLimit } from '../../utils/constants';
import { CurrentUserQuery } from '../../graphql/generated/CurrentUserQuery';
import { JobApplicationsCountQuery } from '../../graphql/generated/JobApplicationsCountQuery';
import { CompanyQuery, CompanyQueryVariables } from '../../graphql/generated/CompanyQuery';

interface Props {
    onCompleted: (data: CreateJobApplicationMutation) => void;
    onClose: () => void;
    isOpen: boolean;
}

export const convertToOption = (company: {
    name: string;
    id: string;
    image?: { cloudfrontUrl: string } | null;
}): DropdownSearchOption => ({
    name: company.name,
    id: company.id,
    imageUrl: company.image?.cloudfrontUrl,
});

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
    company: Yup.object()
        .shape({
            name: Yup.string().required('Company is invalid'),
            id: Yup.string().required('Company is invalid'),
            imageUrl: Yup.string()
                .notRequired()
                .nullable(),
        })
        .nullable()
        .required('Please select a company'),
    position: Yup.string().required('Position is required'),
    location: Yup.object()
        .shape({
            id: Yup.string().required(),
            name: Yup.string(),
            googlePlacesId: Yup.string(),
        })
        .default(null)
        .nullable()
        .notRequired(),
    isRemote: Yup.boolean().required(),
});

type FormSchema = Yup.InferType<typeof formSchema>;

const initialFormikValues: FormSchema = { company: null, position: '', location: undefined, isRemote: false };

const AddJobModalContents: React.FC<Props> = ({ onClose, isOpen }) => {
    const {
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        setFieldValue,
        isSubmitting,
        isValid,
        setFieldTouched,
    } = useFormikContext<FormSchema>();
    const { data: currentUserData } = useQuery<CurrentUserQuery>(currentUserQuery);
    const { onOpen: onOpenAddCompany } = useModalQuery(QueryParamKeys.ADD_COMPANY);
    const router = useRouter();
    const selectedCompanyQuery = router.query[QueryParamKeys.SELECTED_COMPANY_ID] as string | undefined;
    const [companySearchQuery, setCompanySearchQuery] = useState('');
    const [getCompany] = useLazyQuery<CompanyQuery, CompanyQueryVariables>(companyQuery, {
        onCompleted: data => {
            if (data.company !== null) {
                setFieldValue('company', convertToOption(data.company));
            }
        },
    });
    const [isLoadingCompanySearchResults, setIsLoadingCompanySearchResults] = useState(false);
    const [
        handleLocationSearchQueryChange,
        locationOptions,
        isLoadingLocationResults,
        location,
        setLocation,
    ] = useGooglePlacesService();

    const { data: jobApplicationsCount } = useQuery<JobApplicationsCountQuery>(jobApplicationsCountQuery);

    const {
        data: suggestedCompanies,
        loading: loadingSuggestedCompanies,
        refetch: refetchSuggestedCompanies,
    } = useQuery<SuggestedCompanies>(suggestedCompaniesQuery, {
        variables: { searchQuery: '' },
    });

    const debouncedCompanyRefetch = useCallback(
        debounce(async (variables: Parameters<typeof refetchSuggestedCompanies>[0]) => {
            await refetchSuggestedCompanies(variables);
            setIsLoadingCompanySearchResults(false);
        }, 500),
        [refetchSuggestedCompanies]
    );

    useEffect(() => {
        if (selectedCompanyQuery) {
            setCompanySearchQuery('');
            getCompany({ variables: { id: selectedCompanyQuery } });
        }
    }, [getCompany, selectedCompanyQuery]);

    const handleCompanySearchQueryChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setCompanySearchQuery(e.target.value);
        setIsLoadingCompanySearchResults(true);
        debouncedCompanyRefetch({
            searchQuery: e.target.value,
        });
    };

    const companyOptions: DropdownSearchOption[] =
        suggestedCompanies?.companies.nodes.map((company): DropdownSearchOption => convertToOption(company)) ?? [];

    const isFreeUser = !currentUserData?.me?.Billing?.isPremiumActive;
    const hasReachedFreeTierLimit =
        isFreeUser &&
        jobApplicationsCount?.jobApplications.totalCount !== undefined &&
        jobApplicationsCount?.jobApplications.totalCount >= freeTierJobLimit;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add job" size="md">
            <>
                <ModalBody>
                    {hasReachedFreeTierLimit && (
                        <Alert status="error" mb={8}>
                            <AlertIcon />
                            <AlertTitle mr={2}>Jobs limit reached!</AlertTitle>
                            <AlertDescription>Upgrade to premium.</AlertDescription>
                        </Alert>
                    )}
                    <Form id="add-job-form">
                        <FormWrapper>
                            <DropdownSearchField
                                label="Company"
                                isRequired
                                helpText="The company where you're submitting your application."
                                id="company"
                                onOptionSelection={(option: DropdownSearchOption | null): void => {
                                    setCompanySearchQuery('');
                                    setFieldValue('company', option);
                                }}
                                onAddNew={(): void => {
                                    onOpenAddCompany({
                                        additionalQueries: {
                                            [QueryParamKeys.COMPANY_NAME]: companySearchQuery,
                                        },
                                    });
                                }}
                                onChange={handleCompanySearchQueryChange}
                                searchQuery={companySearchQuery}
                                selectedOption={values.company}
                                options={companyOptions}
                                isLoading={isLoadingCompanySearchResults || loadingSuggestedCompanies}
                                error={getError({ touched, errors })(`company`)}
                                onBlur={(): void => {
                                    setFieldTouched('company');
                                }}
                            />
                            <InputField
                                label="Position"
                                name="position"
                                id="job-position"
                                placeholder="Full stack developer"
                                value={values.position}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.position ? errors.position : undefined}
                                isRequired
                            />
                            {!values.isRemote && (
                                <DropdownSearchField
                                    label="Location"
                                    id="location"
                                    onOptionSelection={(option: DropdownSearchOption | null): void => {
                                        setLocation('');
                                        setFieldValue('location', option);
                                    }}
                                    selectedOption={values.location}
                                    onChange={handleLocationSearchQueryChange}
                                    searchQuery={location}
                                    options={locationOptions}
                                    isLoading={isLoadingLocationResults}
                                    error={getError({ touched, errors })(`location`)}
                                    onBlur={(): void => {
                                        setFieldTouched('location');
                                    }}
                                />
                            )}
                            <ToggleWithLabel
                                id="isRemoteAddJob"
                                onChange={(): void => {
                                    setFieldValue('isRemote', !values.isRemote);
                                }}
                                isChecked={values.isRemote}
                                label="Is remote?"
                            />
                        </FormWrapper>
                    </Form>
                </ModalBody>
                <ModalFooter d="flex" flexDirection="column" alignItems="flex-end">
                    <ChakraButton
                        form="add-job-form"
                        type="submit"
                        isLoading={isSubmitting}
                        isDisabled={!isValid || hasReachedFreeTierLimit}
                    >
                        Save
                    </ChakraButton>
                </ModalFooter>
            </>
        </Modal>
    );
};

const AddJobModal: React.FC<Props> = props => {
    const client = useApolloClient();
    const toast = useToast();
    const [addJobApplication] = useMutation<CreateJobApplicationMutation, CreateJobApplicationMutationVariables>(
        createJobApplicationMutation,
        {
            onError: (): void => {
                toast({
                    title: 'Something went wrong',
                    description: `There's been a problem saving the job application`,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'top',
                });
            },
            onCompleted: data => {
                client.resetStore();
                props.onCompleted(data);
            },
        }
    );

    const handleSubmit: FormikConfig<FormSchema>['onSubmit'] = (values, { setSubmitting }) => {
        addJobApplication({
            variables: {
                companyId: values.company?.id as string,
                position: values.position,
                location: values.location,
                isRemote: values.isRemote,
            },
        }).finally(() => setSubmitting(false));
    };

    return (
        <Formik
            initialValues={initialFormikValues}
            validationSchema={formSchema}
            onSubmit={handleSubmit}
            validateOnMount
        >
            {(): JSX.Element => <AddJobModalContents {...props} />}
        </Formik>
    );
};

export default AddJobModal;
