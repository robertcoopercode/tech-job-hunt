import styled from '@emotion/styled';
import { Box, PseudoBox } from '@robertcooper/chakra-ui-core';
import { MdDelete } from 'react-icons/md';
import { MdEdit } from 'react-icons/md';
import Link from 'next/link';
import React from 'react';
import Tooltip from '../Tooltip/Tooltip';
import { customTheme } from '../../utils/styles/theme';
import { TableCell } from './Table';

const ActionButton = styled.button<{ as?: string }>`
    display: inline-flex;

    &:focus {
        outline: none;

        & > * {
            color: ${customTheme.colors.purple[600]};
        }
    }
`;

const ActionButtonsContainer = styled(Box)`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    overflow: visible;
    width: 100%;

    > * {
        margin-right: 1rem;

        &:last-child {
            margin-right: 0;
        }
    }
`;

const Icon = styled(PseudoBox)``;

Icon.defaultProps = {
    size: '22px',
    color: 'gray.700',
    _hover: { color: 'purple.600' },
};

const ForwardedRefActionButton = React.forwardRef<HTMLButtonElement>((props, ref) => (
    <Tooltip aria-label="Edit" label="Edit" placement="top" hasArrow>
        <ActionButton as="a" ref={ref} {...props}>
            <Icon as={MdEdit} />
        </ActionButton>
    </Tooltip>
));

ForwardedRefActionButton.displayName = 'ForwardedRefActionButton';

export const ActionsTableCell: React.FC<{
    editLink?: string;
    onEdit?: () => void;
    onDelete: () => void;
    containerRef: React.Ref<HTMLDivElement>;
}> = ({ editLink, onEdit, onDelete, containerRef: buttonRef }) => {
    return (
        <TableCell>
            <ActionButtonsContainer ref={buttonRef}>
                {editLink && (
                    <Link href={editLink} passHref>
                        <ForwardedRefActionButton />
                    </Link>
                )}
                {onEdit && (
                    <Tooltip aria-label="Edit" label="Edit" placement="top" hasArrow>
                        <ActionButton onClick={onEdit}>
                            <Icon as={MdEdit} />
                        </ActionButton>
                    </Tooltip>
                )}
                <Tooltip aria-label="Delete" label="Delete" placement="top" hasArrow>
                    <ActionButton onClick={onDelete}>
                        <Icon as={MdDelete} />
                    </ActionButton>
                </Tooltip>
            </ActionButtonsContainer>
        </TableCell>
    );
};
