import React from 'react';
import styled from '@emotion/styled';
import { FormikHandlers, FormikHelpers } from 'formik';
import { MdThumbUp, MdAssignmentTurnedIn, MdGroup, MdFolder } from 'react-icons/md';
import { Box } from '@robertcooper/chakra-ui-core';
import RadioField from '../RadioField/RadioField';
import Card from '../Card/Card';
import { JobDecision, ApplicationStatus } from '../../graphql/generated/graphql-global-types';
import { getError } from '../../utils/getError';
import { customTheme, mediaQueries } from '../../utils/styles/theme';
import { applicationStatusDetails } from '../../utils/constants';
import Section from './Section';
import { FormSchema } from './ViewJobModal';

const StyledRadioField = styled(RadioField)`
    margin-bottom: ${customTheme.space[4]};

    &:last-of-type {
        margin-bottom: 0;
    }
`;

const StatusOptions = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin: -${customTheme.space[3]};

    & > * {
        margin: ${customTheme.space[3]};
        width: calc(50% - 2 * ${customTheme.space[3]});
    }

    ${mediaQueries.sm} {
        & > * {
            width: calc(33.33% - 2 * ${customTheme.space[3]});
        }
    }

    ${mediaQueries.md} {
        & > * {
            width: calc(25% - 2 * ${customTheme.space[3]});
        }
    }

    ${mediaQueries.lg} {
        & > * {
            width: calc(20% - 2 * ${customTheme.space[3]});
        }
    }
`;

interface Props {
    applicationStatus: FormSchema['applicationStatus'];
    jobDecision: FormSchema['jobDecision'];
    onChange: FormikHandlers['handleChange'];
    onBlur: FormikHandlers['handleBlur'];
    setFieldValue: FormikHelpers<FormSchema>['setFieldValue'];
    getError: ReturnType<typeof getError>;
}

const ApplicationStatusSection: React.FC<Props> = ({ applicationStatus, jobDecision, setFieldValue }) => {
    return (
        <Section title="Application Status">
            <StatusOptions>
                <Card
                    selectedValue={applicationStatus}
                    value={ApplicationStatus.INTERESTED}
                    name="applicationStatus"
                    label={applicationStatusDetails[ApplicationStatus.INTERESTED].label}
                    icon={MdThumbUp}
                    setSelectedValue={(value): void => setFieldValue('applicationStatus', value)}
                />
                <Card
                    selectedValue={applicationStatus}
                    value={ApplicationStatus.APPLIED}
                    name="applicationStatus"
                    label={applicationStatusDetails[ApplicationStatus.APPLIED].label}
                    icon={MdAssignmentTurnedIn}
                    setSelectedValue={(value): void => setFieldValue('applicationStatus', value)}
                />
                <Card
                    selectedValue={applicationStatus}
                    value={ApplicationStatus.INTERVIEWING}
                    name="applicationStatus"
                    label={applicationStatusDetails[ApplicationStatus.INTERVIEWING].label}
                    icon={MdGroup}
                    setSelectedValue={(value): void => setFieldValue('applicationStatus', value)}
                />
                <Card
                    selectedValue={applicationStatus}
                    value={ApplicationStatus.OFFER}
                    name="applicationStatus"
                    label={applicationStatusDetails[ApplicationStatus.OFFER].label}
                    icon={MdGroup}
                    setSelectedValue={(value): void => setFieldValue('applicationStatus', value)}
                />
                <Card
                    selectedValue={applicationStatus}
                    value={ApplicationStatus.DECIDED}
                    name="applicationStatus"
                    label={applicationStatusDetails[ApplicationStatus.DECIDED].label}
                    icon={MdFolder}
                    setSelectedValue={(value): void => setFieldValue('applicationStatus', value)}
                />
            </StatusOptions>
            {applicationStatus === ApplicationStatus.DECIDED && (
                <Box mt={6}>
                    <StyledRadioField
                        description="The company has rejected your application."
                        id={'jobDecision-rejected'}
                        selectedValue={jobDecision}
                        value={JobDecision.REJECTED}
                        name="jobDecision"
                        label="Rejected"
                        setSelectedValue={(value): void => setFieldValue('jobDecision', value)}
                    />
                    <StyledRadioField
                        description="You've decided not to pursue the job application."
                        id={'jobDecision-declined'}
                        selectedValue={jobDecision}
                        value={JobDecision.DECLINED}
                        name="jobDecision"
                        label="Declined"
                        setSelectedValue={(value): void => setFieldValue('jobDecision', value)}
                    />
                    <StyledRadioField
                        description="You've decided to accept a job offer."
                        id={'jobDecision-accepted'}
                        selectedValue={jobDecision}
                        value={JobDecision.ACCEPTED}
                        name="jobDecision"
                        label="Declined"
                        setSelectedValue={(value): void => setFieldValue('jobDecision', value)}
                    />
                </Box>
            )}
        </Section>
    );
};

export default ApplicationStatusSection;
