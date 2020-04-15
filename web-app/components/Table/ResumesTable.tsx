import React, { useRef } from 'react';
import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks';
import { Text, useDisclosure, useToast } from '@robertcooper/chakra-ui-core';
import { ResumesQuery, ResumesQueryVariables, ResumesQuery_resumes_nodes } from '../../graphql/generated/ResumesQuery';
import { formatDate } from '../../utils/formatDate';
import { QueryParamKeys } from '../../utils/constants';
import { DeleteResumeMutation, DeleteResumeMutationVariables } from '../../graphql/generated/DeleteResumeMutation';
import Loader from '../Loader/Loader';
import { deleteResumeMutation } from '../../graphql/mutations';
import { resumesQuery } from '../../graphql/queries';
import { useModalQuery } from '../../utils/hooks/useModalQuery';
import { OrderByArg } from '../../graphql/generated/graphql-global-types';
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

const ResumeTableRow: React.FC<
    {
        columns: Column[];
    } & ResumesQuery_resumes_nodes
> = ({ columns, id, name, updatedAt }) => {
    const actionButtons = useRef<HTMLDivElement>(null);
    const toast = useToast();
    const client = useApolloClient();

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { onOpen: onOpenView } = useModalQuery(QueryParamKeys.VIEW_RESUME, id);

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
            client.resetStore();
            onClose();
            toast({
                title: 'Deleted',
                description: 'Successfully deleted resume',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top',
            });
        },
        variables: { id },
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
                    <Text as="span" fontWeight="medium" title={name}>
                        {name}
                    </Text>
                </TableCell>
                <TableCell>
                    <Text as="span" title={formatDate(updatedAt)}>
                        {formatDate(updatedAt)}
                    </Text>
                </TableCell>
                <ActionsTableCell containerRef={actionButtons} onDelete={onOpen} />
            </TableRow>
            <ConfirmDeleteResume
                isOpen={isOpen}
                resumeName={name}
                onDelete={deleteResume}
                isOnDeleteLoading={isLoadingDeleteResume}
                onClose={onClose}
            />
        </>
    );
};

const ResumesTable: React.FC<Props> = ({ isPreview = false }) => {
    const { page, orderBy, pageSize, setQuery, direction } = usePaginationQuery({
        orderBy: 'updatedAt',
        direction: OrderByArg.desc,
    });
    const skip = (page - 1) * pageSize;
    const { data: resumes, loading, refetch } = useQuery<ResumesQuery, ResumesQueryVariables>(resumesQuery, {
        variables: {
            first: isPreview ? previewPageSize : pageSize,
            skip: isPreview ? 0 : skip,
            orderBy: {
                [orderBy]: direction,
            },
        },
    });
    const { onOpen: onOpenAddNewResume } = useModalQuery(QueryParamKeys.ADD_RESUME);

    const resumeColumns: Column[] = [
        {
            text: 'Name',
            columnSizeFraction: 2,
            orderBy: 'name',
        },
        {
            text: 'Updated at',
            minWidth: '130px',
            orderBy: 'updatedAt',
        },
        { text: 'Actions', minWidth: '100px', isLabelHidden: true },
    ];

    const totalNumberOfResults = resumes?.resumes.totalCount ?? 0;

    return loading ? (
        <Loader />
    ) : (
        <>
            {totalNumberOfResults === 0 ? (
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
                    direction={direction}
                    rows={resumes?.resumes.nodes.map(
                        (item): JSX.Element => (
                            <ResumeTableRow key={item.id} columns={resumeColumns} {...item} />
                        )
                    )}
                />
            )}
        </>
    );
};

export default ResumesTable;
