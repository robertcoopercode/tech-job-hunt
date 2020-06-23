import { Button, Text, ModalBody, useDisclosure, Box, ModalFooter } from '@robertcooper/chakra-ui-core';
import { useQuery } from '@apollo/react-hooks';
import { CurrentUserQuery } from '../../graphql/generated/CurrentUserQuery';
import { currentUserQuery } from '../../graphql/queries';
import Loader from '../Loader/Loader';
import DeleteAccountModal from '../DeleteAccountModal/DeleteAccountModal';
import { styled, customTheme } from '../../utils/styles/theme';
import Modal from '../Modal/Modal';

const Section = styled(Box)`
    &:first-of-type {
        margin-top: 0;
    }
    &:last-of-type {
        margin-bottom: 0;
    }
`;

Section.defaultProps = {
    marginY: customTheme.space[6],
};

const SectionTitle = styled(Text)``;

SectionTitle.defaultProps = {
    mt: 0,
    fontWeight: 'semibold',
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

const SettingsModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const { data: currentUserData, loading: currentUserLoading } = useQuery<CurrentUserQuery>(currentUserQuery);
    const { isOpen: isOpenDeleteAccount, onClose: onCloseDeleteAccount, onOpen: onOpenDeleteAccount } = useDisclosure();

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} title={'Settings'} size="md">
                <ModalBody>
                    {currentUserLoading ? (
                        <Loader />
                    ) : (
                        <>
                            <Section>
                                <SectionTitle>Current User</SectionTitle>
                                <Text>{currentUserData?.me?.email}</Text>
                            </Section>
                            <Section>
                                <SectionTitle fontWeight="semibold">Account</SectionTitle>
                                <Button
                                    onClick={onOpenDeleteAccount}
                                    variant="link"
                                    size="xs"
                                    fontWeight="medium"
                                    variantColor="red"
                                >
                                    Delete account
                                </Button>
                            </Section>
                        </>
                    )}
                </ModalBody>
                <ModalFooter />
            </Modal>
            <DeleteAccountModal isOpen={isOpenDeleteAccount} onClose={onCloseDeleteAccount} />
        </>
    );
};

export default SettingsModal;
