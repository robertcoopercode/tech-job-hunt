import React from 'react';
import {
    Modal as ChakraModal,
    ModalContent,
    ModalOverlay,
    ModalHeader,
    ModalCloseButton,
    IModal,
} from '@robertcooper/chakra-ui-core';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    size?: IModal['size'];
}

const Modal: React.FC<ModalProps> = ({ isOpen, children, onClose, title, size = 'full' }) => {
    return (
        <ChakraModal isOpen={isOpen} onClose={onClose} size={size}>
            <ModalOverlay />
            <ModalContent {...(size === 'full' ? { maxWidth: '1100px' } : {})}>
                <ModalHeader fontWeight="normal">{title}</ModalHeader>
                <ModalCloseButton />
                {children}
            </ModalContent>
        </ChakraModal>
    );
};

export default Modal;
