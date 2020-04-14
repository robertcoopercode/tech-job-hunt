import React, { useState, useCallback } from 'react';
import styled from '@emotion/styled';
import { useDropzone, DropzoneOptions } from 'react-dropzone';
import { MdCloudUpload, MdRemoveCircle } from 'react-icons/md';
import { Box, Text, IconButton } from '@robertcooper/chakra-ui-core';
import { ErrorMessage, FormInputWrapper, FormInputLabel } from '../InputField/InputField';
import { FormError } from '../../utils/getError';
import { customTheme } from '../../utils/styles/theme';

export type ExistingFile = {
    name: string;
    url: string;
};

export const UploadedFileDetails: React.FC<{
    url: string;
    isImage: boolean;
    fileName: string;
    onRemove: () => void;
}> = ({ url, isImage, fileName, onRemove }) => {
    return (
        <UploadedFileWrapper>
            <FileLink href={url} target="_blank">
                {isImage && <UploadedImagePreview src={url} />}
                <FileUploadText>{fileName}</FileUploadText>
            </FileLink>
            <IconButton
                aria-label={'Remove'}
                icon={MdRemoveCircle}
                size="sm"
                variant="ghost"
                onClick={onRemove}
                ml={2}
            />
        </UploadedFileWrapper>
    );
};

const StyledFormInputWrapper = styled(FormInputWrapper)`
    min-width: 0;
`;

const UploadedFileWrapper = styled(Box)`
    height: 40px;
    display: flex;
    align-items: center;
`;

const UploadedImagePreview = styled.img`
    border-radius: 15px;
    height: 26px;
    width: 26px;
    border: 1px solid ${customTheme.colors.gray[400]};
    object-fit: cover;
    margin-right: 10px;
    flex-shrink: 0;
`;

const FileUploadText = styled.span`
    color: ${customTheme.colors.gray[400]};
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
`;

const FileLink = styled.a`
    display: flex;
    align-items: center;
    overflow: hidden;
`;

const supportedImageUploadTypes = ['png', 'jpg', 'jpeg'];

interface Props extends DropzoneOptions {
    file: File | undefined;
    /** Used if there is a file saved in the back-end that should be used as the default file shown in the component */
    existingFile?: ExistingFile | null;
    setFile: (file: File | undefined) => void;
    id: string;
    label: string;
    helpText?: string;
    isImage?: boolean;
    error?: FormError;
}

const FileUploadField: React.FC<Props> = ({
    label,
    file,
    id,
    setFile,
    helpText,
    error,
    existingFile,
    isImage: isImageProp = false,
    ...props
}) => {
    const [fileSrc, setFileSrc] = useState<string | null | undefined>();
    const [isImage, setIsImage] = useState(isImageProp);

    const onDrop = useCallback(
        (files) => {
            if (files.length === 1) {
                const imgSrc = URL.createObjectURL(files[0]);
                setFileSrc(imgSrc);
                setFile(files[0]);
                // Check if file type is an image
                if (
                    supportedImageUploadTypes.some((type) => {
                        return `image/${type}` === (files && files[0].type);
                    })
                ) {
                    setIsImage(true);
                }
            } else {
                setFileSrc(undefined);
            }
        },
        [setFile]
    );
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: supportedImageUploadTypes.map((type) => `.${type}`).join(','),
        maxSize: 10000000, // 10 MB
        ...props,
    });

    const handleRemoveUploadedImage = (): void => {
        setFile(undefined);
        setFileSrc(null);
    };

    const getFileUrl = (): string | undefined => {
        if (fileSrc) {
            return fileSrc;
        }
        if (existingFile && fileSrc !== null) {
            if (isImage) {
                return `${existingFile.url}&d=72x72`;
            }
            return existingFile.url;
        }
        return undefined;
    };

    const url = getFileUrl();
    const fileName = file?.name || existingFile?.name;

    return (
        <StyledFormInputWrapper>
            <FormInputLabel label={label} helpText={helpText} id={id} />
            {url && fileName ? (
                <UploadedFileDetails
                    url={url}
                    fileName={fileName}
                    isImage={isImage}
                    onRemove={handleRemoveUploadedImage}
                />
            ) : (
                <>
                    <Box {...getRootProps()} d="flex" alignItems="center" cursor="pointer">
                        <input {...getInputProps()} />
                        {isDragActive ? (
                            <Text as="span">Drop the image...</Text>
                        ) : (
                            <>
                                <Box as={MdCloudUpload} size="20px" mr={2} />
                                <Text as="span">Drag file here or click to select</Text>
                            </>
                        )}
                    </Box>
                </>
            )}
            {error && <ErrorMessage>{error}</ErrorMessage>}
        </StyledFormInputWrapper>
    );
};

export default FileUploadField;
