import React, { useRef } from 'react';
import {
    Button,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
    Text,
} from '@robertcooper/chakra-ui-core';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onDelete: () => void;
    title: string;
    modalBodyContent: JSX.Element;
    isOnDeleteLoading: boolean;
};

const ConfirmDeleteModal: React.FC<Props> = ({
    isOpen,
    onClose,
    title,
    modalBodyContent,
    onDelete,
    isOnDeleteLoading,
}) => {
    const cancelRef = useRef<HTMLElement>(null);
    return (
        <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
            <AlertDialogOverlay />
            <AlertDialogContent>
                <AlertDialogHeader>
                    <Text as="span" fontSize="xl">
                        {title}
                    </Text>
                </AlertDialogHeader>

                <AlertDialogBody>{modalBodyContent}</AlertDialogBody>

                <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onClose} fontWeight={500} size="sm">
                        Cancel
                    </Button>
                    <Button
                        size="sm"
                        variantColor="red"
                        isLoading={isOnDeleteLoading}
                        onClick={(): void => {
                            onClose();
                            onDelete();
                        }}
                        ml={3}
                        fontWeight={500}
                    >
                        Delete
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default ConfirmDeleteModal;
