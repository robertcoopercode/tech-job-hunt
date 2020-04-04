import { ChangeEvent } from 'react';
import { FormikHandlers, FormikHelpers } from 'formik';
import styled from '@emotion/styled';
import { Box } from '@robertcooper/chakra-ui-core';
import DropdownSearchField from '../DropdownSearchField/DropdownSearchField';
import InputField, { FormInputLabel } from '../InputField/InputField';
import Rating from '../Rating/Rating';
import { getError } from '../../utils/getError';
import ToggleWithLabel from '../Toggle/ToggleWithLabel';
import { useGooglePlacesService } from '../../utils/hooks/useGooglePlacesService';
import { mediaQueries } from '../../utils/styles/theme';
import Section from './Section';
import { DropdownSearchOption, FormSchema, SubGrid } from './ViewJobModal';

const DescriptionTextarea = styled(InputField)`
    ${mediaQueries.md} {
        grid-column: 1 / 3;
    }

    ${mediaQueries.lg} {
        grid-column: 1 / 4;
    }
`;

type BasicInfoSectionProps = {
    isLoadingCompanySearchResults: boolean;
    handleOptionSelection: (o: DropdownSearchOption | null) => void;
    handleCompanySearchQueryChange: (e: ChangeEvent<HTMLInputElement>) => void;
    companySearchQuery: string;
    company?: null | { name: string; id: string; imageUrl?: string | null };
    companyOptions: DropdownSearchOption[];
    position?: string;
    rating: number | null;
    setRating: (rating: number) => void;
    location: FormSchema['location'];
    onBlur: FormikHandlers['handleChange'];
    setFieldTouched: FormikHelpers<FormSchema>['setFieldTouched'];
    setFieldValue: FormikHelpers<FormSchema>['setFieldValue'];
    onChange: FormikHandlers['handleChange'];
    getError: ReturnType<typeof getError>;
    onAddNewCompany: () => void;
    link: string | null;
    notes: string | null;
    toggleIsRemote: () => void;
    isRemote: boolean;
};

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
    isLoadingCompanySearchResults,
    handleOptionSelection,
    handleCompanySearchQueryChange,
    companySearchQuery,
    company,
    companyOptions,
    location,
    position,
    onBlur,
    onChange,
    getError,
    rating,
    setRating,
    setFieldValue,
    setFieldTouched,
    onAddNewCompany,
    link,
    notes,
    toggleIsRemote,
    isRemote,
}) => {
    const [
        handleLocationSearchQueryChange,
        locationOptions,
        isLoadingLocationResults,
        searchQuery,
        setLocation,
    ] = useGooglePlacesService();

    return (
        <Section title="Basic Info">
            <SubGrid>
                <Box>
                    <DropdownSearchField
                        id="company"
                        label={'Company'}
                        helpText={"The company where you're submitting your application."}
                        onOptionSelection={handleOptionSelection}
                        onAddNew={onAddNewCompany}
                        onChange={handleCompanySearchQueryChange}
                        searchQuery={companySearchQuery}
                        selectedOption={company}
                        options={companyOptions}
                        isLoading={isLoadingCompanySearchResults}
                        error={getError(`company`)}
                        onBlur={(): void => setFieldTouched('company')}
                    />
                </Box>
                <InputField
                    isRequired
                    id="position"
                    label={'Position Title'}
                    helpText="The title of the job's position/role."
                    value={position}
                    placeholder="full-stack web developer"
                    name="position"
                    onChange={onChange}
                    onBlur={onBlur}
                    error={getError(`position`)}
                />
                <Box>
                    <FormInputLabel label="Location" id="location" />
                    {!isRemote && (
                        <DropdownSearchField
                            label="Location"
                            id="location"
                            onOptionSelection={(option: DropdownSearchOption | null): void => {
                                setLocation('');
                                setFieldValue('location', option);
                            }}
                            selectedOption={location}
                            onChange={handleLocationSearchQueryChange}
                            searchQuery={searchQuery}
                            options={locationOptions}
                            isLoading={isLoadingLocationResults}
                            error={getError('location')}
                            onBlur={(): void => {
                                setFieldTouched('location');
                            }}
                            isLabelHidden
                        />
                    )}
                    <ToggleWithLabel
                        id="isRemoteEditJob"
                        onChange={toggleIsRemote}
                        isChecked={isRemote}
                        label="Is remote?"
                    />
                </Box>
                <Rating
                    rating={rating}
                    setRating={setRating}
                    label="Desirability rating"
                    helpText="How desirable this job position is to have."
                />
                <InputField
                    id="link"
                    label={'Job listing link'}
                    helpText="The link to the webpage of the job listing."
                    name="jobListingLink"
                    value={link ?? ''}
                    onChange={onChange}
                    onBlur={onBlur}
                    error={getError('jobListingLink')}
                    placeholder="https://indeed.com/somejobposting"
                    type="url"
                />
                <DescriptionTextarea
                    id="description"
                    isTextEditor
                    helpText="A place to record information related to the job posting. Consider copy & pasting the job posting before the job listing gets taken down."
                    label="Description"
                    value={notes ?? ''}
                    onChange={(value): void => {
                        setFieldValue('jobListingNotes', value);
                    }}
                    error={getError('jobListingNotes')}
                />
            </SubGrid>
        </Section>
    );
};

export default BasicInfoSection;
