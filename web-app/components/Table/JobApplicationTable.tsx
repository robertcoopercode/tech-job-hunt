import React, { useRef } from 'react';
import { useDisclosure, Text } from '@robertcooper/chakra-ui-core';
import { useMutation, useQuery, useApolloClient } from '@apollo/react-hooks';
import { useToast } from '@robertcooper/chakra-ui-core';
import {
    DeleteJobApplicationMutation,
    DeleteJobApplicationMutationVariables,
} from '../../graphql/generated/DeleteJobApplicationMutation';
import { formatDate } from '../../utils/formatDate';
import { formatApplicationStatusText } from '../../utils/formatApplicationStatusText';
import {
    JobApplicationsQuery,
    JobApplicationsQueryVariables,
    JobApplicationsQuery_jobApplicationsConnection_edges_node,
} from '../../graphql/generated/JobApplicationsQuery';
import { ConfirmDeleteJobApplication } from '../ViewJobModal/ViewJobModal';
import Loader from '../Loader/Loader';
import { jobApplicationsQuery } from '../../graphql/queries';
import { deleteJobApplicationMutation } from '../../graphql/mutations';
import CompanyName from '../CompanyName/CompanyName';
import { QueryParamKeys } from '../../utils/constants';
import { useModalQuery } from '../../utils/hooks/useModalQuery';
import { JobApplicationOrderByInput } from '../../graphql/generated/graphql-global-types';
import { usePaginationQuery } from '../../utils/hooks/usePaginationQuery';
import TableEmptyState from './TableEmptyState';
import Table, {
    Column,
    TableRow,
    handleTableRowAction,
    TableCell,
    handleTableRowKeyDown,
    previewPageSize,
} from './Table';
import { ActionsTableCell } from './ActionsCell';

const JobApplicationTableRow: React.FC<{
    columns: Column[];
} & JobApplicationsQuery_jobApplicationsConnection_edges_node &
    JobApplicationsQueryVariables> = ({ columns, ...item }) => {
    const actionButtons = useRef<HTMLDivElement>(null);
    const toast = useToast();
    const client = useApolloClient();

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { onOpen: onOpenView } = useModalQuery(QueryParamKeys.VIEW_JOB, item.id);

    const [deleteJobApplication, { loading: isLoadingDeleteJobApplication }] = useMutation<
        DeleteJobApplicationMutation,
        DeleteJobApplicationMutationVariables
    >(deleteJobApplicationMutation, {
        onError: () => {
            onClose();
            toast({
                title: `Error`,
                description: `Unable to deleted job application`,
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
                description: 'Successfully deleted job application',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top',
            });
        },
        variables: { jobId: item.id },
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
                    <Text fontWeight="medium" as="span" title={item.position}>
                        {item.position}
                    </Text>
                </TableCell>
                <TableCell>
                    <CompanyName imageUrl={item.company?.image?.cloudfrontUrl} name={item.company.name} />
                </TableCell>
                <TableCell>
                    <Text as="span" title={item.updatedAt && formatDate(item.updatedAt)}>
                        {item.updatedAt && formatDate(item.updatedAt)}
                    </Text>
                </TableCell>
                <TableCell>
                    <Text as="span" title={item.location?.name ?? undefined}>
                        {item.isRemote ? 'Remote' : item.location?.name ?? ''}
                    </Text>
                </TableCell>
                <TableCell>
                    <Text as="span" title={item.applicationStatus}>
                        {formatApplicationStatusText(item.applicationStatus)}
                    </Text>
                </TableCell>
                <ActionsTableCell containerRef={actionButtons} onDelete={onOpen} />
            </TableRow>
            <ConfirmDeleteJobApplication
                isOpen={isOpen}
                jobApplicationName={item.position}
                companyName={item.company.name}
                onDelete={deleteJobApplication}
                isOnDeleteLoading={isLoadingDeleteJobApplication}
                onClose={onClose}
            />
        </>
    );
};

type Props = {
    /* True is only showing a condensed version of the table with no pagination */
    isPreview?: boolean;
};

const JobApplicationTable: React.FC<Props> = ({ isPreview }) => {
    const { page, orderBy, pageSize, setQuery } = usePaginationQuery({
        orderBy: JobApplicationOrderByInput.updatedAt_DESC,
    });
    const { onOpen: onOpenAddNewJob } = useModalQuery(QueryParamKeys.ADD_JOB);

    const skip = isPreview ? 0 : (page - 1) * pageSize;
    const first = isPreview ? previewPageSize : pageSize;

    const { data: jobApplications, loading, refetch } = useQuery<JobApplicationsQuery, JobApplicationsQueryVariables>(
        jobApplicationsQuery,
        {
            variables: { first, skip, orderBy: orderBy as JobApplicationOrderByInput },
        }
    );

    const jobApplicationColumns: Column[] = [
        {
            text: 'Position',
            columnSizeFraction: 3,
            order: {
                columnAscendingKey: JobApplicationOrderByInput.position_ASC,
                columnDescendingKey: JobApplicationOrderByInput.position_DESC,
            },
        },
        {
            text: 'Company',
            columnSizeFraction: 3,
            order: {
                columnAscendingKey: JobApplicationOrderByInput.companyName_ASC,
                columnDescendingKey: JobApplicationOrderByInput.companyName_DESC,
            },
        },
        {
            text: 'Updated at',
            columnSizeFraction: 1.5,
            order: {
                columnAscendingKey: JobApplicationOrderByInput.updatedAt_ASC,
                columnDescendingKey: JobApplicationOrderByInput.updatedAt_DESC,
            },
        },
        {
            text: 'Location',
            columnSizeFraction: 3,
            order: {
                columnAscendingKey: JobApplicationOrderByInput.locationName_ASC,
                columnDescendingKey: JobApplicationOrderByInput.locationName_DESC,
            },
        },
        {
            text: 'Status',
            columnSizeFraction: 1,
            minWidth: '80px',
            order: {
                columnAscendingKey: JobApplicationOrderByInput.applicationStatus_ASC,
                columnDescendingKey: JobApplicationOrderByInput.applicationStatus_DESC,
            },
        },
        { text: 'Actions', columnSizeFraction: 1, minWidth: '100px', isLabelHidden: true },
    ];

    const totalNumberOfResults = jobApplications?.jobsTotal.aggregate.count ?? 0;

    return loading ? (
        <Loader />
    ) : (
        <>
            {jobApplications?.jobsTotal.aggregate.count === 0 ? (
                <TableEmptyState
                    onClick={(): void => {
                        onOpenAddNewJob();
                    }}
                    title="No Job Applications"
                    description="Click the button below to add your first job application."
                />
            ) : (
                <>
                    <Table
                        setQuery={setQuery}
                        isPreview={isPreview}
                        pageSize={pageSize}
                        page={page}
                        orderBy={orderBy}
                        refetch={refetch}
                        totalNumberOfResults={totalNumberOfResults}
                        columns={jobApplicationColumns}
                        rows={jobApplications?.jobApplicationsConnection.edges.map(
                            (item: any): JSX.Element => (
                                <JobApplicationTableRow
                                    key={item.node.id}
                                    columns={jobApplicationColumns}
                                    {...item.node}
                                />
                            )
                        )}
                    />
                </>
            )}
        </>
    );
};

export default JobApplicationTable;
