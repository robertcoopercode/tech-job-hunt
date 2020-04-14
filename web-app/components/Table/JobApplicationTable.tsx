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
    JobApplicationsQuery_jobApplications_nodes,
} from '../../graphql/generated/JobApplicationsQuery';
import { ConfirmDeleteJobApplication } from '../ViewJobModal/ViewJobModal';
import Loader from '../Loader/Loader';
import { jobApplicationsQuery } from '../../graphql/queries';
import { deleteJobApplicationMutation } from '../../graphql/mutations';
import CompanyName from '../CompanyName/CompanyName';
import { QueryParamKeys } from '../../utils/constants';
import { useModalQuery } from '../../utils/hooks/useModalQuery';
import { usePaginationQuery } from '../../utils/hooks/usePaginationQuery';
import { OrderByArg } from '../../graphql/generated/graphql-global-types';
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

const JobApplicationTableRow: React.FC<
    {
        columns: Column[];
    } & JobApplicationsQuery_jobApplications_nodes &
        JobApplicationsQueryVariables
> = ({ columns, id, Company, updatedAt, Location, position, isRemote, applicationStatus }) => {
    const actionButtons = useRef<HTMLDivElement>(null);
    const toast = useToast();
    const client = useApolloClient();

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { onOpen: onOpenView } = useModalQuery(QueryParamKeys.VIEW_JOB, id);

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
        variables: { jobId: id },
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
                    <Text fontWeight="medium" as="span" title={position}>
                        {position}
                    </Text>
                </TableCell>
                <TableCell>
                    <CompanyName imageUrl={Company?.Image?.cloudfrontUrl} name={Company?.name ?? ''} />
                </TableCell>
                <TableCell>
                    <Text as="span" title={updatedAt && formatDate(updatedAt)}>
                        {updatedAt && formatDate(updatedAt)}
                    </Text>
                </TableCell>
                <TableCell>
                    <Text as="span" title={Location?.name ?? undefined}>
                        {isRemote ? 'Remote' : Location?.name ?? ''}
                    </Text>
                </TableCell>
                <TableCell>
                    <Text as="span" title={applicationStatus}>
                        {formatApplicationStatusText(applicationStatus)}
                    </Text>
                </TableCell>
                <ActionsTableCell containerRef={actionButtons} onDelete={onOpen} />
            </TableRow>
            <ConfirmDeleteJobApplication
                isOpen={isOpen}
                jobApplicationName={position}
                companyName={Company?.name ?? ''}
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
    const { page, orderBy, pageSize, setQuery, direction } = usePaginationQuery({
        orderBy: 'updatedAt',
        direction: OrderByArg.desc,
    });
    const { onOpen: onOpenAddNewJob } = useModalQuery(QueryParamKeys.ADD_JOB);

    const skip = isPreview ? 0 : (page - 1) * pageSize;
    const first = isPreview ? previewPageSize : pageSize;

    const { data: jobApplications, loading, refetch } = useQuery<JobApplicationsQuery, JobApplicationsQueryVariables>(
        jobApplicationsQuery,
        {
            variables: {
                first,
                skip,
                orderBy: {
                    [orderBy]: direction,
                },
            },
        }
    );

    const jobApplicationColumns: Column[] = [
        {
            text: 'Position',
            columnSizeFraction: 3,
            orderBy: 'position',
        },
        {
            text: 'Company',
            columnSizeFraction: 3,
            orderBy: 'companyName',
        },
        {
            text: 'Updated at',
            columnSizeFraction: 1.5,
            orderBy: 'updatedAt',
        },
        {
            text: 'Location',
            columnSizeFraction: 3,
            orderBy: 'locationName',
        },
        {
            text: 'Status',
            columnSizeFraction: 1,
            minWidth: '80px',
            orderBy: 'applicationStatus',
        },
        { text: 'Actions', columnSizeFraction: 1, minWidth: '100px', isLabelHidden: true },
    ];

    const totalNumberOfResults = jobApplications?.jobApplications.totalCount ?? 0;

    return loading ? (
        <Loader />
    ) : (
        <>
            {totalNumberOfResults === 0 ? (
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
                        direction={direction}
                        refetch={refetch}
                        totalNumberOfResults={totalNumberOfResults}
                        columns={jobApplicationColumns}
                        rows={jobApplications?.jobApplications.nodes?.map(
                            (item): JSX.Element => (
                                <JobApplicationTableRow key={item.id} columns={jobApplicationColumns} {...item} />
                            )
                        )}
                    />
                </>
            )}
        </>
    );
};

export default JobApplicationTable;
