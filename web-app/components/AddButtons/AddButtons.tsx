import React, { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { rgba } from 'polished';
import { css } from '@emotion/core';
import { Modal as ChakraModal, ModalOverlay } from '@robertcooper/chakra-ui-core';
import { Box, useToast } from '@robertcooper/chakra-ui-core';
import { MdInsertDriveFile, MdWork, MdBusiness } from 'react-icons/md';
import { useRouter } from 'next/router';
import { useLazyQuery } from '@apollo/react-hooks';
import { MdAdd } from 'react-icons/md';
import { customTheme, mediaQueries } from '../../utils/styles/theme';
import Tooltip from '../Tooltip/Tooltip';
import AddCompanyModal from '../AddCompanyModal/AddCompanyModal';
import AddResumeModal from '../AddResumeModal/AddResumeModal';
import AddJobModal from '../AddJobModal/AddJobModal';
import ViewCompanyModal from '../ViewCompanyModal/ViewCompanyModal';
import { QueryParamKeys } from '../../utils/constants';
import ViewJobModal from '../ViewJobModal/ViewJobModal';
import { CreateJobApplicationMutation } from '../../graphql/generated/CreateJobApplicationMutation';
import { CreateResumeMutation } from '../../graphql/generated/CreateResumeMutation';
import ViewResumeModal from '../ViewResumeModal/ViewResumeModal';
import { useModalQuery } from '../../utils/hooks/useModalQuery';
import { JobApplicationQuery, JobApplicationQueryVariables } from '../../graphql/generated/JobApplicationQuery';
import { jobApplicationQuery, companyQuery, resumeQuery } from '../../graphql/queries';
import Loader from '../Loader/Loader';
import { CompanyQueryVariables, CompanyQuery } from '../../graphql/generated/CompanyQuery';
import { ResumeQueryVariables, ResumeQuery } from '../../graphql/generated/ResumeQuery';

export const mainButtonSize = 70;
const ballHeight = 40;

const ActiveButtonsContainer = styled.div<{ isFocused: boolean }>`
    position: fixed;
    bottom: 50px;
    right: 50px;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    ${({ isFocused }): any =>
        isFocused &&
        css`
            width: ${mainButtonSize + ballHeight + (mainButtonSize / 2 - ballHeight / 2)}px;
            height: ${mainButtonSize + ballHeight + (mainButtonSize / 2 - ballHeight / 2)}px;
        `}

    ${mediaQueries.xl} {
        right: 100px;
    }
`;

const AddJobButton = styled.button`
    position: relative;
    z-index: 2;
    background: ${customTheme.colors.purple[500]};
    height: ${mainButtonSize}px;
    width: ${mainButtonSize}px;
    border: none;
    border-radius: 35px;
    box-shadow: ${rgba(customTheme.colors.purple[500], 0.4)} 0px 5px 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: box-shadow 0.125s ease-in-out, transform 0.125s ease-in-out;

    &:hover {
        box-shadow: ${rgba(customTheme.colors.purple[500], 0.6)} 0px 5px 25px;
        transform: scale(0.9);
    }

    svg path {
        fill: ${customTheme.colors.white};
    }
`;

const Ball = styled.button<{ shouldAnimate: boolean; as?: string; href?: string; index: number }>`
    height: ${ballHeight}px;
    width: ${ballHeight}px;
    border-radius: 100px;
    position: absolute;
    z-index: 1;
    transition: 0.2s ease-in-out transform;
    bottom: calc((${mainButtonSize}px - ${ballHeight}px) / 2);
    right: calc((${mainButtonSize}px - ${ballHeight}px) / 2);
    background: ${customTheme.colors.purple[400]};
    box-shadow: ${rgba(customTheme.colors.purple[500], 0.4)} 0px 5px 25px;
    transition: box-shadow 0.125s ease-in-out, transform 0.125s ease-in-out;
    color: ${customTheme.colors.white};
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        box-shadow: ${rgba(customTheme.colors.purple[500], 0.6)} 0px 5px 25px;
    }

    ${({ shouldAnimate, index }): any => {
        if (shouldAnimate) {
            switch (index) {
                case 1:
                    return css`
                        transform: translateX(-${mainButtonSize}px) translateY(${(mainButtonSize - ballHeight) / 2}px);

                        &:hover {
                            transform: translateX(-${mainButtonSize}px)
                                translateY(${(mainButtonSize - ballHeight) / 2}px) scale(0.95);
                        }
                    `;
                case 2:
                    return css`
                        transform: translateX(${Math.cos(Math.PI / 4) * mainButtonSize * -1}px)
                            translateY(${Math.cos(Math.PI / 4) * mainButtonSize * -1}px);

                        &:hover {
                            transform: translateX(${Math.cos(Math.PI / 4) * mainButtonSize * -1}px)
                                translateY(${Math.cos(Math.PI / 4) * mainButtonSize * -1}px) scale(0.95);
                        }
                    `;
                case 3:
                    return css`
                        transform: translateY(-${mainButtonSize}px) translateX(${(mainButtonSize - ballHeight) / 2}px);

                        &:hover {
                            transform: translateY(-${mainButtonSize}px)
                                translateX(${(mainButtonSize - ballHeight) / 2}px) scale(0.95);
                        }
                    `;
            }
        }
    }}
`;

type Props = {};

const AddButtons: React.FC<Props> = () => {
    const toast = useToast();
    const router = useRouter();
    const [isFocused, setIsFocused] = useState(false);

    const companyId = router.query[QueryParamKeys.VIEW_COMPANY] as string;
    const jobId = router.query[QueryParamKeys.VIEW_JOB] as string;
    const resumeId = router.query[QueryParamKeys.VIEW_RESUME] as string;

    const [shouldRenderButtons, setShouldRenderButtons] = useState(false);
    const [shouldAnimate, setShouldAnimate] = useState(isFocused);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const { isOpen: isOpenAddNewCompany, onOpen: onOpenAddNewCompany, onClose: onCloseAddNewCompany } = useModalQuery(
        QueryParamKeys.ADD_COMPANY
    );
    const { isOpen: isOpenAddNewResume, onOpen: onOpenAddNewResume, onClose: onCloseAddNewResume } = useModalQuery(
        QueryParamKeys.ADD_RESUME
    );
    const { isOpen: isOpenAddNewJob, onOpen: onOpenAddNewJob, onClose: onCloseAddNewJob } = useModalQuery(
        QueryParamKeys.ADD_JOB
    );
    const { isOpen: isOpenViewCompany, onClose: onCloseViewCompany } = useModalQuery(QueryParamKeys.VIEW_COMPANY);
    const { isOpen: isOpenViewJob, onOpen: onOpenViewJob, onClose: onCloseViewJob } = useModalQuery(
        QueryParamKeys.VIEW_JOB,
        jobId
    );
    const { isOpen: isOpenViewResume, onOpen: onOpenViewResume, onClose: onCloseViewResume } = useModalQuery(
        QueryParamKeys.VIEW_RESUME
    );

    const [getJob, { loading: loadingGetJobApplication, data: jobApplicationData }] = useLazyQuery<
        JobApplicationQuery,
        JobApplicationQueryVariables
    >(jobApplicationQuery, {
        onError: () => {
            toast({
                title: 'Error',
                description: `We were unable to load your job`,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top',
            });
            onCloseViewJob();
        },
    });

    const [getCompany, { loading: loadingGetCompany, data: companyData }] = useLazyQuery<
        CompanyQuery,
        CompanyQueryVariables
    >(companyQuery, {
        onError: () => {
            toast({
                title: 'Error',
                description: `We were unable to load your company`,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top',
            });
            onCloseViewCompany();
        },
    });

    const [getResume, { loading: loadingGetResume, data: resumeData }] = useLazyQuery<
        ResumeQuery,
        ResumeQueryVariables
    >(resumeQuery, {
        variables: { id: resumeId },
        onError: () => {
            toast({
                title: 'Error',
                description: `We were unable to load your resume`,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top',
            });
            onCloseViewResume();
        },
    });

    useEffect(() => {
        if (isOpenViewJob && jobId) {
            getJob({ variables: { id: jobId } });
        }
        if (isOpenViewCompany && companyId) {
            getCompany({ variables: { id: companyId } });
        }
        if (isOpenViewResume && resumeId) {
            getResume({ variables: { id: resumeId } });
        }
    }, [companyId, getCompany, getJob, getResume, isOpenViewCompany, isOpenViewJob, isOpenViewResume, jobId, resumeId]);

    const addButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (isFocused) {
            setShouldRenderButtons(true);
            requestAnimationFrame(() => {
                setTimeout(() => {
                    clearTimeout(timeoutRef.current as ReturnType<typeof setTimeout>);
                    setShouldAnimate(true);
                });
            });
        } else {
            timeoutRef.current = setTimeout(() => {
                setShouldRenderButtons(false);
            }, 500);
            setShouldAnimate(false);
        }
    }, [isFocused]);

    const handleFocus = (isFocused: boolean): void => {
        setIsFocused(isFocused);
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLButtonElement>): void => {
        if (event.key === 'Enter' || event.key === ' ') {
            handleFocus(!isFocused);
        }
    };

    return (
        <ActiveButtonsContainer
            className="action-button"
            onMouseLeave={(): void => handleFocus(false)}
            isFocused={isFocused}
        >
            <AddJobButton
                aria-label="Add new job application"
                onMouseEnter={(): void => handleFocus(true)}
                onKeyPress={handleKeyPress}
                ref={addButtonRef}
            >
                <MdAdd size={32} />
            </AddJobButton>
            {shouldRenderButtons && (
                <div>
                    <Tooltip aria-label="Add job" label="Add job" placement="top">
                        <Ball
                            onClick={(): void => {
                                onOpenAddNewJob();
                            }}
                            shouldAnimate={shouldAnimate}
                            index={1}
                        >
                            <Box as={MdWork} />
                        </Ball>
                    </Tooltip>
                    <Tooltip aria-label="Add resume" label="Add resume" placement="top">
                        <Ball
                            onClick={(): void => {
                                onOpenAddNewResume();
                            }}
                            shouldAnimate={shouldAnimate}
                            index={2}
                        >
                            <Box as={MdInsertDriveFile} />
                        </Ball>
                    </Tooltip>
                    <Tooltip aria-label="Add company" label="Add company" placement="top">
                        <Ball
                            onClick={(): void => {
                                onOpenAddNewCompany();
                            }}
                            shouldAnimate={shouldAnimate}
                            index={3}
                            type="button"
                        >
                            <Box as={MdBusiness} />
                        </Ball>
                    </Tooltip>
                </div>
            )}
            <AddJobModal
                isOpen={isOpenAddNewJob}
                onClose={onCloseAddNewJob}
                onCompleted={async (data: CreateJobApplicationMutation): Promise<void> => {
                    toast({
                        title: 'Job added',
                        description: 'The job application has been created.',
                        status: 'success',
                        duration: 2000,
                        isClosable: true,
                        position: 'top',
                    });
                    onOpenViewJob({
                        queryToExclude: QueryParamKeys.ADD_JOB,
                        newlyCreatedId: data.createJobApplication.id,
                    });
                }}
            />
            <AddCompanyModal isOpen={isOpenAddNewCompany} onClose={onCloseAddNewCompany} />
            <AddResumeModal
                isOpen={isOpenAddNewResume}
                onClose={onCloseAddNewResume}
                onCompleted={async (data: CreateResumeMutation): Promise<void> => {
                    toast({
                        title: 'Resume added',
                        description: 'The resume has been created.',
                        status: 'success',
                        duration: 2000,
                        isClosable: true,
                        position: 'top',
                    });
                    onOpenViewResume({
                        queryToExclude: QueryParamKeys.ADD_RESUME,
                        newlyCreatedId: data.createResume.id,
                    });
                }}
            />
            {(loadingGetJobApplication || loadingGetCompany || loadingGetResume) && (
                <ChakraModal isOpen={true}>
                    <ModalOverlay />
                    <Box
                        height="100%"
                        width="100%"
                        top={0}
                        left={0}
                        zIndex={customTheme.zIndices.modal}
                        position="fixed"
                    >
                        <Loader />
                    </Box>
                </ChakraModal>
            )}
            {companyData && companyData.company && (
                <ViewCompanyModal
                    onClose={onCloseViewCompany}
                    isOpen={isOpenViewCompany}
                    company={companyData.company}
                />
            )}
            {jobApplicationData && jobApplicationData.jobApplication && (
                <ViewJobModal
                    onClose={onCloseViewJob}
                    isOpen={isOpenViewJob}
                    jobApplication={jobApplicationData.jobApplication}
                />
            )}
            {resumeData && resumeData.resume && (
                <ViewResumeModal onClose={onCloseViewResume} isOpen={isOpenViewResume} resume={resumeData.resume} />
            )}
        </ActiveButtonsContainer>
    );
};

export default AddButtons;
