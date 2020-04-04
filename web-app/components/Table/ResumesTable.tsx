import React, { useRef } from 'react';
import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks';
import { Text, useDisclosure, useToast } from '@robertcooper/chakra-ui-core';
import {
    ResumesQuery,
    ResumesQueryVariables,
    ResumesQuery_resumesConnection_edges,
} from '../../graphql/generated/ResumesQuery';
import { formatDate } from '../../utils/formatDate';
import { QueryParamKeys } from '../../utils/constants';
import { DeleteResumeMutation, DeleteResumeMutationVariables } from '../../graphql/generated/DeleteResumeMutation';
import Loader from '../Loader/Loader';
import { deleteResumeMutation } from '../../graphql/mutations';
import { resumesQuery } from '../../graphql/queries';
import { useModalQuery } from '../../utils/hooks/useModalQuery';
import { ResumeOrderByInput } from '../../graphql/generated/graphql-global-types';
import { usePaginationQuery } from '../../utils/hooks/usePaginationQuery';
import { ConfirmDeleteResume } from '../ViewResumeModal/ViewResumeModal';
import Table, {
    Column,
    TableRow,
    handleTableRowAction,
    TableCell,
    handleTableRowKeyDown,
    previewPageSize,
} from './Table';
import { ActionsTableCell } from './ActionsCell';
import TableEmptyState from './TableEmptyState';

type Props = {
    isPreview?: boolean;
};

const ResumeTableRow: React.FC<{
    columns: Column[];
} & ResumesQuery_resumesConnection_edges> = ({ columns, ...item }) => {
    const actionButtons = useRef<HTMLDivElement>(null);
    const toast = useToast();
    const client = useApolloClient();

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { onOpen: onOpenView } = useModalQuery(QueryParamKeys.VIEW_RESUME, item.node.id);

    const [deleteResume, { loading: isLoadingDeleteResume }] = useMutation<
        DeleteResumeMutation,
        DeleteResumeMutationVariables
    >(deleteResumeMutation, {
        onError: () => {
            onClose();
            toast({
                title: `Error`,
                description: `Unable to deleted resume`,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top',
            });
        },
        onCompleted: () => {
            onClose();
            toast({
                title: 'Deleted',
                description: 'Successfully deleted resume',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top',
            });
            client.resetStore();
        },
        variables: { id: item.node.id },
    });

    return (
        <>
            <TableRow
                tabIndex={0}
                onClick={(e: React.MouseEvent<HTMLTableRowElement>): void =>
                    handleTableRowAction(e, () => onOpenView(), actionButtons)
                }
                onKeyPress={(e: React.KeyboardEvent<HTMLTableRowElement>): void =>
                    handleTableRowAction(e, () => onOpenView(), actionButtons)
                }
                onKeyDown={handleTableRowKeyDown}
                columns={columns}
            >
                <TableCell>
                    <Text as="span" fontWeight="medium" title={item.node.name}>
                        {item.node.name}
                    </Text>
                </TableCell>
                <TableCell>
                    <Text as="span" title={formatDate(item.node.updatedAt)}>
                        {formatDate(item.node.updatedAt)}
                    </Text>
                </TableCell>
                <ActionsTableCell containerRef={actionButtons} onDelete={onOpen} />
            </TableRow>
            <ConfirmDeleteResume
                isOpen={isOpen}
                resumeName={item.node.name}
                onDelete={deleteResume}
                isOnDeleteLoading={isLoadingDeleteResume}
                onClose={onClose}
            />
        </>
    );
};

const ResumesTable: React.FC<Props> = ({ isPreview = false }) => {
    const { page, orderBy, pageSize, setQuery } = usePaginationQuery({
        orderBy: ResumeOrderByInput.updatedAt_DESC,
    });
    const skip = (page - 1) * pageSize;
    const { data: resumes, loading, refetch } = useQuery<ResumesQuery, ResumesQueryVariables>(resumesQuery, {
        variables: {
            first: isPreview ? previewPageSize : pageSize,
            skip: isPreview ? 0 : skip,
            orderBy: orderBy as ResumeOrderByInput,
        },
    });
    const { onOpen: onOpenAddNewResume } = useModalQuery(QueryParamKeys.ADD_RESUME);

    const resumeColumns: Column[] = [
        {
            text: 'Name',
            columnSizeFraction: 2,
            order: {
                columnAscendingKey: ResumeOrderByInput.name_ASC,
                columnDescendingKey: ResumeOrderByInput.name_DESC,
            },
        },
        {
            text: 'Updated at',
            minWidth: '130px',
            order: {
                columnAscendingKey: ResumeOrderByInput.updatedAt_ASC,
                columnDescendingKey: ResumeOrderByInput.updatedAt_DESC,
            },
        },
        { text: 'Actions', minWidth: '100px', isLabelHidden: true },
    ];

    const totalNumberOfResults = resumes?.resumesTotal.aggregate.count ?? 0;

    return loading ? (
        <Loader />
    ) : (
        <>
            {resumes?.resumesTotal.aggregate.count === 0 ? (
                <TableEmptyState
                    onClick={(): void => {
                        onOpenAddNewResume();
                    }}
                    title="No Resumes"
                    description="Click the button below to add your first resume."
                />
            ) : (
                <Table
                    isPreview={isPreview}
                    page={page}
                    pageSize={pageSize}
                    orderBy={orderBy}
                    setQuery={setQuery}
                    totalNumberOfResults={totalNumberOfResults}
                    refetch={refetch}
                    columns={resumeColumns}
                    rows={resumes?.resumesConnection.edges?.map(
                        (item: any): JSX.Element => (
                            <ResumeTableRow key={item.node.id} columns={resumeColumns} {...item} />
                        )
                    )}
                />
            )}
        </>
    );
};

export default ResumesTable;
