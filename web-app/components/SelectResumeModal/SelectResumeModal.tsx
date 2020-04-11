import { useQuery } from '@apollo/react-hooks';
import { Box, ModalBody, ModalFooter, Radio, RadioGroup, Text } from '@robertcooper/chakra-ui-core';
import debounce from 'lodash.debounce';
import React, { ChangeEvent, useCallback, useState } from 'react';
import { parseISO } from 'date-fns';
import { SuggestedResumesQuery } from '../../graphql/generated/SuggestedResumesQuery';
import { suggestedResumesQuery } from '../../graphql/queries';
import { formatDate } from '../../utils/formatDate';
import { FormError } from '../../utils/getError';
import { FormInputLabel } from '../InputField/InputField';
import ChakraButton from '../ChakraButton/ChakraButton';
import DropdownSearchInput from '../DropdownSearchField/DropdownSearchField';
import Modal from '../Modal/Modal';
import { FormSchema } from '../ViewJobModal/ViewJobModal';

interface Props {
    onClose: () => void;
    isOpen: boolean;
    onSelect: (data: FormSchema['resume']) => void;
    onOpenAddResume: () => void;
    selectedResume: FormSchema['resume'];
    error: FormError;
    onBlur: () => void;
}

type Version = { id: string; url: string; createdAt: string };

type ResumeOption = { name: string; id: string; versions: Version[] };

const SelectResumeModal: React.FC<Props> = ({
    onClose,
    isOpen,
    onSelect,
    onOpenAddResume,
    selectedResume: selectedOption,
    error,
    onBlur,
}) => {
    const [isLoadingResumeSearchResults, setIsLoadingResumeSearchResults] = useState(false);
    const [resumeSearchQuery, setResumeSearchQuery] = useState('');
    const [selectedVersionId, setSelectedVersionId] = useState<string | undefined>(
        selectedOption ? selectedOption.selectedVersionId : undefined
    );
    const [selectedResume, setSelectedResume] = useState<ResumeOption | null | undefined>(
        selectedOption
            ? {
                  name: selectedOption.name,
                  id: selectedOption.resumeId,
                  versions: selectedOption.versions,
              }
            : undefined
    );

    const { data: suggestedResumes, loading: loadingSuggestedResumes, refetch: refetchSuggestedResumes } = useQuery<
        SuggestedResumesQuery
    >(suggestedResumesQuery, {
        variables: { searchQuery: '' },
    });

    const debouncedResumeRefetch = useCallback(
        debounce(async (variables: Parameters<typeof refetchSuggestedResumes>[0]) => {
            await refetchSuggestedResumes(variables);
            return setIsLoadingResumeSearchResults(false);
        }, 500),
        [refetchSuggestedResumes]
    );

    const handleResumeInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setResumeSearchQuery(e.target.value);
        setIsLoadingResumeSearchResults(true);
        debouncedResumeRefetch({
            searchQuery: e.target.value,
        });
    };

    const handleSave = (): void => {
        if (selectedResume?.name && selectedResume?.id && selectedVersionId && selectedResume?.versions) {
            onSelect({
                name: selectedResume.name,
                resumeId: selectedResume.id,
                selectedVersionId: selectedVersionId,
                versions: selectedResume.versions,
            });
        } else {
            onSelect(null);
        }
        onClose();
    };

    const resumeOptions =
        suggestedResumes?.resumes.nodes.map(
            (resume): ResumeOption => ({
                name: resume.name,
                id: resume.id,
                versions:
                    resume.Versions?.map(
                        (v): Version => ({
                            id: v.id,
                            url: v.cloudfrontUrl,
                            createdAt: v.createdAt,
                        })
                    ) ?? [],
            })
        ) ?? [];

    const resumeVersionOptions = selectedResume?.versions.sort((versionA, versionB): number => {
        return parseISO(versionB.createdAt).getTime() - parseISO(versionA.createdAt).getTime();
    });

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Select resume" size="md">
            <ModalBody>
                <DropdownSearchInput
                    isLoading={isLoadingResumeSearchResults || loadingSuggestedResumes}
                    label="Resume"
                    id="resume"
                    onOptionSelection={(option): void => {
                        setSelectedResume(option);
                        setSelectedVersionId(option ? option.versions[option.versions.length - 1].id : undefined);
                    }}
                    onAddNew={onOpenAddResume}
                    onChange={handleResumeInputChange}
                    searchQuery={resumeSearchQuery}
                    selectedOption={selectedResume}
                    options={resumeOptions}
                    error={error}
                    onBlur={onBlur}
                />
                {resumeVersionOptions && (
                    <Box marginTop={8}>
                        <FormInputLabel label="Select version" id="selectResumeVersion" />
                        <RadioGroup
                            onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                                setSelectedVersionId(e.target.value as string)
                            }
                            value={selectedVersionId}
                        >
                            {resumeVersionOptions.map((option, index) => (
                                <Radio value={option.id} key={option.id}>
                                    <Text as="span">{`Version ${resumeVersionOptions.length - index} (${formatDate(
                                        option.createdAt
                                    )})`}</Text>
                                </Radio>
                            ))}
                        </RadioGroup>
                    </Box>
                )}
            </ModalBody>
            <ModalFooter d="flex">
                <ChakraButton onClick={handleSave}>Save</ChakraButton>
            </ModalFooter>
        </Modal>
    );
};

export default SelectResumeModal;
