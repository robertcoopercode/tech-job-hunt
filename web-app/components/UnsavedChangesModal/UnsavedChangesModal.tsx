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
    onLeave: () => void;
};

const UnsavedChangesModal: React.FC<Props> = ({ isOpen, onClose, onLeave }) => {
    const cancelRef = useRef<HTMLElement>(null);

    return (
        <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
            <AlertDialogOverlay />
            <AlertDialogContent>
                <AlertDialogHeader>
                    <Text as="span" fontSize="xl">
                        You have unsaved changes.
                    </Text>
                </AlertDialogHeader>

                <AlertDialogBody>
                    <Text>Are you sure you want to leave and discard any unsaved changes?</Text>
                </AlertDialogBody>

                <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onClose} fontWeight={500} size="sm">
                        Stay
                    </Button>
                    <Button
                        variantColor="red"
                        onClick={(): void => {
                            onLeave();
                            onClose();
                        }}
                        ml={3}
                        size="sm"
                        fontWeight={500}
                    >
                        Leave
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default UnsavedChangesModal;
