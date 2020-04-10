import { useRouter } from 'next/router';
import { QueryParamKeys, defaultNumberOfTableRows } from '../constants';
import { OrderByQueryParamKeys } from '../../components/Table/Table';
import { OrderByArg } from '../../graphql/generated/graphql-global-types';

export type PaginationQuery = {
    page: number;
    pageSize: number;
    orderBy: OrderByQueryParamKeys;
    direction: OrderByArg;
};

/**
 * Hook to be used to manage pagination related URL queries
 */
export const usePaginationQuery = ({
    page: defaultPage = 1,
    pageSize: defaultPageSize = defaultNumberOfTableRows,
    orderBy: defaultOrderBy = 'updatedAt',
    direction: defaultDirection = OrderByArg.desc,
}: Partial<PaginationQuery>): PaginationQuery & {
    setQuery: ({ page, pageSize, orderBy }: Partial<PaginationQuery>) => void;
} => {
    const router = useRouter();
    const page = parseInt(router.query[QueryParamKeys.PAGE] as string, 10) || defaultPage;
    const pageSize = parseInt(router.query[QueryParamKeys.PAGE_SIZE] as string, 10) || defaultPageSize;
    const orderBy = (router.query[QueryParamKeys.ORDER_BY] as OrderByQueryParamKeys) || defaultOrderBy;
    const direction = (router.query[QueryParamKeys.DIRECTION] as OrderByArg) || defaultDirection;

    const setQuery = (newQuery: Partial<PaginationQuery>): void => {
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
        direction,
        pageSize,
        setQuery,
    };
};
