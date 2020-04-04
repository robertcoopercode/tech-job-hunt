import React from 'react';
import EmptyState, { Props as EmptyStateProps } from '../EmptyState/EmptyState';

type Props = Omit<EmptyStateProps, 'ctaText'>;

const TableEmptyState: React.FC<Props> = ({ ...props }) => {
    return <EmptyState marginTop={10} marginBottom={16} ctaText="Add" {...props} />;
};

export default TableEmptyState;
