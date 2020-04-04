import { useApolloClient, useMutation } from '@apollo/react-hooks';
import { Button, ModalBody, ModalFooter, Text, useToast } from '@robertcooper/chakra-ui-core';
import React, { ChangeEvent, useState } from 'react';
import { DeleteAccountMutation } from '../../graphql/generated/DeleteAccountMutation';
import { deleteAccountMutation } from '../../graphql/mutations';
import { currentUserQuery } from '../../graphql/queries';
import Modal from '../Modal/Modal';
import InputField from '../InputField/InputField';

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

const DeleteAccountModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const toast = useToast();
    const [confirmText, setConfirmText] = useState('');
    const client = useApolloClient();

    const displaySuccessToast = (): void => {
        toast({
            title: 'Deletion successful',
            description: 'Account successfully deleted.',
            status: 'success',
            duration: 2000,
            isClosable: true,
            position: 'top',
            onClose: () => client.resetStore(),
        });
        onClose();
    };

    const displayErrorToast = (): void => {
        toast({
            title: `There's been a problem`,
            description: 'Unable to delete your account.',
            status: 'error',
            duration: 2000,
            isClosable: true,
            position: 'top',
        });
        onClose();
    };

    const [deleteAccount, { loading: loadingDeleteAccountMutation }] = useMutation<DeleteAccountMutation>(
        deleteAccountMutation,
        {
            refetchQueries: [
                {
                    query: currentUserQuery,
                },
            ],
            onCompleted: displaySuccessToast,
            onError: displayErrorToast,
        }
    );

    return (
        <Modal isOpen={isOpen} title="Delete account" size="md" onClose={onClose}>
            <ModalBody>
                <Text>
                    Are you sure you want to cancel your subscription? Cancelling your subscription will allow you to
                    keep using premium features until the end of your current billing cycle: {'?'}
                </Text>
                <Text>Type &quot;confirm&quot; in order to proceed with the deletion.</Text>
                <InputField
                    value={confirmText}
                    onChange={(e: ChangeEvent<HTMLInputElement>): void => setConfirmText(e.target.value)}
                    placeholder="confirm"
                />
            </ModalBody>
            <ModalFooter>
                <Button size="sm" variant="ghost">
                    Cancel
                </Button>
                <Button
                    ml={4}
                    size="sm"
                    variantColor="red"
                    isDisabled={confirmText.toLowerCase() !== 'confirm'}
                    isLoading={loadingDeleteAccountMutation}
                    onClick={(): void => {
                        deleteAccount();
                    }}
                >
                    Delete
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default DeleteAccountModal;
