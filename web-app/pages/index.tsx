import Link from 'next/link';
import { Box, Text, useDisclosure, ModalBody, ModalFooter } from '@robertcooper/chakra-ui-core';
import { useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import ChakraButton from '../components/ChakraButton/ChakraButton';
import RightArrowSvg from '../assets/icons/rightArrow.svg';
import { RoundedImageIcon } from '../utils/styles/general';
import { mediaQueries, styled, customTheme, typography } from '../utils/styles/theme';
import JobApplicationTable from '../components/Table/JobApplicationTable';
import CompaniesTable from '../components/Table/CompaniesTable';
import ResumesTable from '../components/Table/ResumesTable';
import AddButtons from '../components/AddButtons/AddButtons';
import { mainButtonSize } from '../components/AddButtons/AddButtons';
import Modal from '../components/Modal/Modal';
import { CurrentUserQuery } from '../graphql/generated/CurrentUserQuery';
import { currentUserQuery } from '../graphql/queries';
import { completeOnboardingMutation } from '../graphql/mutations';
import { CompleteOnboardingMutation } from '../graphql/generated/CompleteOnboardingMutation';

export const PageTitle = styled(Text)`
    ${typography.pageTitle};
`;

PageTitle.defaultProps = {
    as: 'h1',
    mb: 10,
};

const Sections = styled.div`
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    grid-column-gap: ${customTheme.space[6]};
    grid-row-gap: ${customTheme.space[16]};
    grid-template-rows: repeat(3, auto);

    ${mediaQueries.xl} {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
`;

const FullPageSection = styled.div`
    ${mediaQueries.xl} {
        grid-column: 1 / 3;
    }
`;

const Section = styled.div``;

const SectionTitle = styled.h3`
    font-size: ${customTheme.fontSizes.md};
    font-weight: ${customTheme.fontWeights.medium};
    margin: 0;
    margin-bottom: ${customTheme.space[4]};
`;

const SectionHeader = styled.div`
    display: flex;
    justify-content: space-between;
`;

const ViewAll = styled.a`
    color: ${customTheme.colors.gray[400]};

    &:hover {
        color: ${customTheme.colors.gray[800]};
    }
`;

export const RoundedImage = styled.img`
    ${RoundedImageIcon};
    margin-right: ${customTheme.space[2]};
`;

type Props = {};

const Home: React.FC<Props> = () => {
    const {
        isOpen: isOnboardingModalOpen,
        onOpen: onOpenOnboardingModal,
        onClose: onCloseOnboardingModal,
    } = useDisclosure();

    const { data: currentUserData } = useQuery<CurrentUserQuery>(currentUserQuery);
    const [completeOnboarding] = useMutation<CompleteOnboardingMutation>(completeOnboardingMutation);

    useEffect((): void => {
        if (currentUserData?.me?.hasCompletedOnboarding === false) {
            onOpenOnboardingModal();
        }
    }, [currentUserData, onOpenOnboardingModal]);

    const handleOnboardingModalClose = (): void => {
        completeOnboarding();
        onCloseOnboardingModal();
    };

    return (
        <>
            <Box pb={mainButtonSize} className="dashboard-page">
                <PageTitle>Dashboard</PageTitle>
                <Sections>
                    <FullPageSection className="job-table">
                        <SectionHeader>
                            <SectionTitle>Job applications</SectionTitle>
                            <Link href={`/jobs`} passHref>
                                <ViewAll>
                                    View All <RightArrowSvg />
                                </ViewAll>
                            </Link>
                        </SectionHeader>
                        <JobApplicationTable isPreview />
                    </FullPageSection>
                    <Section className="company-table">
                        <SectionHeader>
                            <SectionTitle>Companies</SectionTitle>
                            <Link href={`/companies`} passHref>
                                <ViewAll>
                                    View All <RightArrowSvg />
                                </ViewAll>
                            </Link>
                        </SectionHeader>
                        <CompaniesTable isPreview />
                    </Section>
                    <Section className="resume-table">
                        <SectionHeader>
                            <SectionTitle>Resumes</SectionTitle>
                            <Link href={`/resumes`} passHref>
                                <ViewAll>
                                    View All <RightArrowSvg />
                                </ViewAll>
                            </Link>
                        </SectionHeader>
                        <ResumesTable isPreview />
                    </Section>
                </Sections>
                <AddButtons />
                {currentUserData?.me?.hasCompletedOnboarding === false && (
                    <Modal
                        isOpen={isOnboardingModalOpen}
                        onClose={handleOnboardingModalClose}
                        title="Welcome 👋🏼"
                        size="md"
                    >
                        <ModalBody>
                            <Text>
                                {`Welcome to Tech Job Hunt, the app that helps you track your job applications and analyze
                                your job application trends.`}
                            </Text>
                            <Text>
                                {`To get started, you can click the add button on the bottom right of the screen to add
                                your first job application.`}
                            </Text>
                            <Text>
                                {`Once you've added a few job applications, you will be able to see the statistics related
                                your job applications on the analytics page.`}
                            </Text>
                        </ModalBody>
                        <ModalFooter>
                            <ChakraButton onClick={handleOnboardingModalClose} variantColor="purple" size="sm">
                                Get started
                            </ChakraButton>
                        </ModalFooter>
                    </Modal>
                )}
            </Box>
        </>
    );
};

export default Home;
