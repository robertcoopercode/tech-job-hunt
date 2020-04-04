import React, { RefObject } from 'react';
import styled from '@emotion/styled';
import { Text, Select, Box } from '@robertcooper/chakra-ui-core';
import { MdArrowDownward, MdArrowUpward } from 'react-icons/md';
import { Button } from '@robertcooper/chakra-ui-core';
import { ApolloQueryResult } from 'apollo-client';
import { customTheme, typography, mediaQueries } from '../../utils/styles/theme';
import { JobApplicationsQuery } from '../../graphql/generated/JobApplicationsQuery';
import { PaginationQuery } from '../../utils/hooks/usePaginationQuery';
import {
    JobApplicationOrderByInput,
    CompanyOrderByInput,
    ResumeOrderByInput,
} from '../../graphql/generated/graphql-global-types';
import { CompaniesQuery } from '../../graphql/generated/CompaniesQuery';
import { ResumesQuery } from '../../graphql/generated/ResumesQuery';
import { pageSizes } from '../../utils/constants';
import Pagination from './Pagination';

export enum SortDirection {
    Ascending = 'ascending',
    Descending = 'descending',
}

export type TableOrderBy = CompanyOrderByInput | JobApplicationOrderByInput | ResumeOrderByInput;

export type ApolloQueries = CompaniesQuery | JobApplicationsQuery | ResumesQuery;

const StyledTable = styled.table`
    overflow-x: auto;
    overflow-y: hidden;
    width: 100%;
    display: grid;
    grid-row-gap: ${customTheme.space[3]};
`;

const StyledHead = styled.thead`
    display: contents;
`;

const StyledHeadRow = styled.tr`
    display: grid;
    grid-row-gap: ${customTheme.space[3]};
`;

const StyledBody = styled.tbody`
    display: contents;
`;

const ButtonHeading = styled(Button)`
    ${typography.captionMedium};
    height: auto;
`;

const StyledTableHeading = styled.th`
    ${typography.captionMedium};
    padding: ${customTheme.space[4]};
    text-align: left;
    padding-bottom: 0;
    text-overflow: ellipsis;
    white-space: nowrap;

    &:first-of-type {
        padding-left: ${customTheme.space[4]};
    }
    &:last-of-type {
        padding-right: ${customTheme.space[4]};
    }
`;

export const TableCell = styled.td`
    background: ${customTheme.colors.white};
    padding: ${customTheme.space[4]};
    font-size: ${customTheme.fontSizes.sm};
    height: 40px;
    line-height: 40px;
    display: flex;
    align-items: center;
    white-space: nowrap;

    * {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    &:first-of-type {
        padding-left: ${customTheme.space[4]};
    }
    &:last-of-type {
        padding-right: ${customTheme.space[4]};
    }
`;

const StyledTableRow = styled.tr`
    display: grid;
    grid-row-gap: ${customTheme.space[3]};

    &:hover,
    &:focus {
        cursor: pointer;
        outline: none;

        ${TableCell} {
            background: ${customTheme.colors.purple[100]};
        }
    }
`;

const PaginationWrapper = styled(Box)`
    display: flex;
    margin-top: ${customTheme.space[4]};
    align-items: center;
    flex-direction: column-reverse;

    & > * {
        margin-bottom: ${customTheme.space[4]};

        &:first-of-type {
            margin-bottom: 0;
        }
    }

    ${mediaQueries.sm} {
        flex-direction: row;

        & > * {
            margin-bottom: unset;
        }
    }
`;

function getColumnSizes<T extends TableOrderBy>(columns: Column[]): string {
    return columns.reduce((prev, curr) => {
        prev += ` minmax(${curr.minWidth ? curr.minWidth : '150px'}, ${
            curr.columnSizeFraction ? curr.columnSizeFraction : 1
        }fr)`;
        return prev;
    }, '');
}

export function getSortDetails({
    columnAscendingKey,
    columnDescendingKey,
    currentOrderBy,
    setQuery,
}: {
    columnAscendingKey?: TableOrderBy;
    columnDescendingKey?: TableOrderBy;
    currentOrderBy?: TableOrderBy;
    setQuery: ({ page, pageSize, orderBy }: Partial<PaginationQuery<TableOrderBy>>) => void;
}): {
    sortDirection?: SortDirection;
    toggleSort: () => void;
} {
    let sortDirection;
    // Default to an order of descending when clicking on a table sort column
    let toggledSortValue = columnDescendingKey;
    if (currentOrderBy !== undefined) {
        if (columnAscendingKey === currentOrderBy) {
            sortDirection = SortDirection.Ascending;
        } else if (columnDescendingKey === currentOrderBy) {
            sortDirection = SortDirection.Descending;
            toggledSortValue = columnAscendingKey;
        }
    }
    return {
        sortDirection,
        toggleSort: (): void => setQuery({ orderBy: toggledSortValue }),
    };
}

export const previewPageSize = 10;

type TableRowProps = {
    columns: Column[];
    children: React.ReactNode;
    onClick: (e: React.MouseEvent<any>) => void;
    onKeyPress: (e: React.KeyboardEvent<any>) => void;
    onKeyDown: (e: React.KeyboardEvent<any>) => void;
    tabIndex?: number;
};

export function TableRow({ columns, children, onClick, ...rest }: TableRowProps): JSX.Element {
    return (
        <StyledTableRow style={{ gridTemplateColumns: getColumnSizes(columns) }} {...{ onClick }} {...rest}>
            {children}
        </StyledTableRow>
    );
}

const ConditionalWrapper: React.FC<{ condition: boolean; wrapper: (children: React.ReactNode) => JSX.Element }> = ({
    condition,
    wrapper,
    children,
}) => <>{condition ? wrapper(children) : children}</>;

type TableHeadingProps = {
    isPreview: boolean;
    currentOrder: TableOrderBy;
    order: Column['order'];
    setQuery: ({ page, pageSize, orderBy }: Partial<PaginationQuery<TableOrderBy>>) => void;
    children: React.ReactNode;
};

export function TableHeading({ children, order, currentOrder, setQuery, isPreview }: TableHeadingProps): JSX.Element {
    let SortIcon;

    const { sortDirection, toggleSort } = getSortDetails({
        columnAscendingKey: order?.columnAscendingKey,
        columnDescendingKey: order?.columnDescendingKey,
        currentOrderBy: currentOrder,
        setQuery,
    });

    if (sortDirection === SortDirection.Descending) {
        SortIcon = MdArrowDownward;
    }
    if (sortDirection === SortDirection.Ascending) {
        SortIcon = MdArrowUpward;
    }
    return (
        <StyledTableHeading>
            <ConditionalWrapper
                condition={Boolean(order) && !isPreview}
                wrapper={(childElements: React.ReactNode): JSX.Element => (
                    <ButtonHeading onClick={toggleSort} variant="unstyled">
                        {childElements}
                    </ButtonHeading>
                )}
            >
                {children}
                {SortIcon && <SortIcon />}
            </ConditionalWrapper>
        </StyledTableHeading>
    );
}

export type Column = {
    text: string;
    isLabelHidden?: boolean;
    /** The CSS grid fraction used to determine the columns size in proportion to other columns */
    columnSizeFraction?: number;
    minWidth?: string;
    order?: {
        columnAscendingKey: TableOrderBy;
        columnDescendingKey: TableOrderBy;
    };
    sortDirection?: SortDirection;
    toggleSort?: () => void;
};

type TableProps = {
    rows?: React.ReactNode[];
    columns: Column[];
    isPreview?: boolean;
    pageSize: number;
    page: number;
    totalNumberOfResults: number;
    orderBy: TableOrderBy;
    refetch: (variables?: any | undefined) => Promise<ApolloQueryResult<ApolloQueries>>;
    setQuery: ({ page, pageSize, orderBy }: Partial<PaginationQuery<TableOrderBy>>) => void;
};

function Table({
    rows,
    columns,
    isPreview = false,
    pageSize,
    page,
    totalNumberOfResults,
    setQuery,
    refetch,
    orderBy,
}: TableProps): JSX.Element {
    const startingItemNumber = totalNumberOfResults > 0 ? pageSize * (page - 1) + 1 : 0;
    let endingItemNumber = pageSize * (page - 1) + (rows?.length ?? 0);
    endingItemNumber = endingItemNumber > totalNumberOfResults ? totalNumberOfResults : endingItemNumber;

    return (
        <>
            <StyledTable>
                <StyledHead>
                    <StyledHeadRow style={{ gridTemplateColumns: getColumnSizes(columns) }}>
                        {columns.map(({ text, isLabelHidden = false, order }, index) => (
                            <TableHeading
                                key={index}
                                order={order}
                                currentOrder={orderBy}
                                setQuery={setQuery}
                                isPreview={isPreview}
                            >
                                {!isLabelHidden && text}
                            </TableHeading>
                        ))}
                    </StyledHeadRow>
                </StyledHead>
                <StyledBody>{rows}</StyledBody>
            </StyledTable>
            {!isPreview && (
                <PaginationWrapper>
                    <Text as="span" mr={{ sm: 'auto' }}>
                        Showing {startingItemNumber} to {endingItemNumber} of {totalNumberOfResults}
                    </Text>
                    <Box d="flex" alignItems="center" ml={2} mr={2} width="fit-content">
                        <Text as="span" mr={2}>
                            Show:
                        </Text>
                        <Select
                            onChange={(event): void => setQuery({ pageSize: parseInt(event.target.value, 10) })}
                            value={pageSize}
                            size="sm"
                            width="100px"
                        >
                            {Object.values(pageSizes).map(size => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </Select>
                    </Box>
                    <Pagination
                        refetch={(page: number): void => {
                            refetch({ first: pageSize, skip: page * pageSize, orderBy });
                        }}
                        setQuery={setQuery}
                        currentPage={page}
                        numberOfPages={Math.ceil(totalNumberOfResults / pageSize)}
                    />
                </PaginationWrapper>
            )}
        </>
    );
}

export const handleTableRowAction = (
    event: React.KeyboardEvent<HTMLTableRowElement> | React.MouseEvent<HTMLTableRowElement>,
    handler: (event: React.KeyboardEvent<HTMLTableRowElement> | React.MouseEvent<HTMLTableRowElement>) => void,
    elementRefToIgnore: RefObject<HTMLElement>
): void => {
    const isClickEvent = event.type === 'click';
    const isEnterKeyPress = (event as React.KeyboardEvent<HTMLTableRowElement>).key === 'Enter';

    const isEventWithinIgnoredElement =
        elementRefToIgnore.current && elementRefToIgnore.current.contains(event.target as Node);
    if (isEventWithinIgnoredElement || (!isClickEvent && !isEnterKeyPress)) {
        return;
    }
    handler(event);
};

export const handleTableRowKeyDown = (
    event: React.KeyboardEvent<HTMLTableRowElement> | React.MouseEvent<HTMLTableRowElement>
): void => {
    const isDownKeyPress = (event as React.KeyboardEvent<HTMLTableRowElement>).key === 'ArrowDown';
    const isUpKeyPress = (event as React.KeyboardEvent<HTMLTableRowElement>).key === 'ArrowUp';
    if (isDownKeyPress) {
        event.preventDefault();
        if (event.currentTarget.nextElementSibling instanceof HTMLElement) {
            event.currentTarget.nextElementSibling.focus();
        }
    }
    if (isUpKeyPress) {
        event.preventDefault();
        if (event.currentTarget.previousElementSibling instanceof HTMLElement) {
            event.currentTarget.previousElementSibling.focus();
        }
    }
};

export default Table;
