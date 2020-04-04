import React, { useRef } from 'react';
import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks';
import { Text, useDisclosure, useToast } from '@robertcooper/chakra-ui-core';
import {
    CompaniesQuery,
    CompaniesQueryVariables,
    CompaniesQuery_companiesConnection_edges,
} from '../../graphql/generated/CompaniesQuery';
import { DeleteCompanyMutation, DeleteCompanyMutationVariables } from '../../graphql/generated/DeleteCompanyMutation';
import Loader from '../Loader/Loader';
import { deleteCompanyMutation } from '../../graphql/mutations';
import { companiesQuery } from '../../graphql/queries';
import CompanyName from '../CompanyName/CompanyName';
import { QueryParamKeys } from '../../utils/constants';
import { useModalQuery } from '../../utils/hooks/useModalQuery';
import { usePaginationQuery } from '../../utils/hooks/usePaginationQuery';
import { CompanyOrderByInput } from '../../graphql/generated/graphql-global-types';
import { formatDate } from '../../utils/formatDate';
import { ConfirmDeleteCompany } from '../ViewCompanyModal/ViewCompanyModal';
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

const CompanyTableRow: React.FC<{
    columns: Column[];
} & CompaniesQuery_companiesConnection_edges> = ({ columns, ...item }) => {
    const actionButtons = useRef<HTMLDivElement>(null);
    const toast = useToast();
    const client = useApolloClient();

    const { isOpen: isOpenConfirmDelete, onOpen: onOpenConfirmDelete, onClose: onCloseConfirmDelete } = useDisclosure();
    const { onOpen: onOpenView } = useModalQuery(QueryParamKeys.VIEW_COMPANY, item.node.id);

    const [deleteCompany, { loading: isLoadingDeleteCompany }] = useMutation<
        DeleteCompanyMutation,
        DeleteCompanyMutationVariables
    >(deleteCompanyMutation, {
        variables: {
            id: item.node.id,
        },
        onError: () => {
            onCloseConfirmDelete();
            toast({
                title: `Error`,
                description: `Unable to deleted company`,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top',
            });
        },
        onCompleted: () => {
            onCloseConfirmDelete();
            toast({
                title: 'Deleted',
                description: 'Successfully deleted company',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top',
            });
            client.resetStore();
        },
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
                    <CompanyName imageUrl={item.node.image?.cloudfrontUrl} name={item.node.name} isBold />
                </TableCell>
                <TableCell>
                    <Text as="span" title={formatDate(item.node.updatedAt)}>
                        {formatDate(item.node.updatedAt)}
                    </Text>
                </TableCell>
                <TableCell>
                    <Text as="span" title={item.node.jobApplicationsCount?.toString()}>
                        {item.node.jobApplicationsCount}
                    </Text>
                </TableCell>
                <ActionsTableCell containerRef={actionButtons} onDelete={onOpenConfirmDelete} />
            </TableRow>
            <ConfirmDeleteCompany
                isOpen={isOpenConfirmDelete}
                companyName={item.node.name}
                jobApplicationsCount={item.node.jobApplicationsCount}
                onDelete={deleteCompany}
                isOnDeleteLoading={isLoadingDeleteCompany}
                onClose={onCloseConfirmDelete}
            />
        </>
    );
};

type Props = {
    isPreview?: boolean;
};

const CompaniesTable: React.FC<Props> = ({ isPreview = false }) => {
    const { page, orderBy, pageSize, setQuery } = usePaginationQuery({
        orderBy: CompanyOrderByInput.updatedAt_DESC,
    });
    const skip = isPreview ? 0 : (page - 1) * pageSize;
    const first = isPreview ? previewPageSize : pageSize;
    const { data: companies, loading, refetch } = useQuery<CompaniesQuery, CompaniesQueryVariables>(companiesQuery, {
        variables: { first, skip, orderBy: orderBy as CompanyOrderByInput },
    });
    const { onOpen: onOpenAddNewCompany } = useModalQuery(QueryParamKeys.ADD_COMPANY);

    const companyColumns: Column[] = [
        {
            text: 'Company',
            columnSizeFraction: 4,
            order: {
                columnAscendingKey: CompanyOrderByInput.name_ASC,
                columnDescendingKey: CompanyOrderByInput.name_DESC,
            },
        },
        {
            text: 'Updated at',
            minWidth: '160px',
            order: {
                columnAscendingKey: CompanyOrderByInput.updatedAt_ASC,
                columnDescendingKey: CompanyOrderByInput.updatedAt_DESC,
            },
        },
        {
            text: 'Jobs',
            minWidth: '80px',
            order: {
                columnAscendingKey: CompanyOrderByInput.jobApplicationsCount_ASC,
                columnDescendingKey: CompanyOrderByInput.jobApplicationsCount_DESC,
            },
        },
        { text: 'Actions', columnSizeFraction: 2, minWidth: '100px', isLabelHidden: true },
    ];

    const totalNumberOfResults = companies?.companiesTotal.aggregate.count ?? 0;

    return loading ? (
        <Loader />
    ) : (
        <>
            {companies?.companiesTotal.aggregate.count === 0 ? (
                <TableEmptyState
                    onClick={(): void => {
                        onOpenAddNewCompany();
                    }}
                    title="No Companies"
                    description="Click the button below to add your first job company."
                />
            ) : (
                <Table
                    page={page}
                    pageSize={pageSize}
                    refetch={refetch}
                    isPreview={isPreview}
                    orderBy={orderBy}
                    totalNumberOfResults={totalNumberOfResults}
                    columns={companyColumns}
                    setQuery={setQuery}
                    rows={companies?.companiesConnection.edges.map(
                        (item: any): JSX.Element => (
                            <CompanyTableRow key={item.node.id} columns={companyColumns} {...item} />
                        )
                    )}
                />
            )}
        </>
    );
};

export default CompaniesTable;
