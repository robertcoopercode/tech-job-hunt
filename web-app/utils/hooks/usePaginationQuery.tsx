import { useRouter } from 'next/router';
import { QueryParamKeys, defaultNumberOfTableRows } from '../constants';
import { TableOrderBy } from '../../components/Table/Table';

export type PaginationQuery<OrderByType> = {
    page: number;
    pageSize: number;
    orderBy: OrderByType;
};

/**
 * Hook to be used to manage pagination related URL queries
 */
export const usePaginationQuery = ({
    page: defaultPage = 1,
    pageSize: defaultPageSize = defaultNumberOfTableRows,
    orderBy: defaultOrderBy,
}: Omit<Partial<PaginationQuery<TableOrderBy>>, 'orderBy'> & { orderBy: TableOrderBy }): PaginationQuery<
    TableOrderBy
> & {
    setQuery: ({ page, pageSize, orderBy }: Partial<PaginationQuery<TableOrderBy>>) => void;
} => {
    const router = useRouter();
    const page = parseInt(router.query[QueryParamKeys.PAGE] as string, 10) || defaultPage;
    const pageSize = parseInt(router.query[QueryParamKeys.PAGE_SIZE] as string, 10) || defaultPageSize;
    const orderBy = (router.query[QueryParamKeys.ORDER_BY] as TableOrderBy) || defaultOrderBy;

    const setQuery = (newQuery: Partial<PaginationQuery<TableOrderBy>>): void => {
        router.push({
            pathname: router.pathname,
            query: {
                ...router.query,
                ...newQuery,
            },
        });
    };

    return {
        page,
        orderBy,
        pageSize,
        setQuery,
    };
};
