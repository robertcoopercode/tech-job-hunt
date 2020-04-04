import React from 'react';
import { MdMoreHoriz, MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { Button, IconButton, Box } from '@robertcooper/chakra-ui-core';
import { PaginationQuery } from '../../utils/hooks/usePaginationQuery';
import { TableOrderBy } from './Table';

type Props<T> = {
    numberOfPages: number;
    currentPage: number;
    refetch: (page: number) => void;
    setQuery: ({ page, pageSize, orderBy }: Partial<PaginationQuery<T>>) => void;
};

function Pagination<T extends TableOrderBy>({ numberOfPages, currentPage, setQuery, refetch }: Props<T>): JSX.Element {
    const handleNextOrPrevButtonClick = (direction: 'next' | 'prev'): void => {
        const directionAdder = direction === 'next' ? 1 : -1;
        refetch(currentPage + directionAdder);
        setQuery({ page: currentPage + directionAdder });
    };

    return (
        <Box>
            <IconButton
                onClick={(): void => handleNextOrPrevButtonClick('prev')}
                isDisabled={currentPage === 1}
                aria-label="previous"
                icon={MdKeyboardArrowLeft}
                variant="ghost"
                fontSize="24px"
            />
            {Array(numberOfPages < 7 ? numberOfPages : 7)
                .fill(0)
                .map((_, index) => {
                    let pageNumber = index + 1;
                    if (index === 0) {
                        return (
                            <Button
                                key={pageNumber}
                                onClick={(): void => setQuery({ page: 1 })}
                                variant={1 === currentPage ? 'solid' : 'ghost'}
                            >
                                {1}
                            </Button>
                        );
                    }
                    if (numberOfPages <= 7) {
                        return (
                            <Button
                                key={pageNumber}
                                onClick={(): void => setQuery({ page: pageNumber })}
                                variant={pageNumber === currentPage ? 'solid' : 'ghost'}
                            >
                                {pageNumber}
                            </Button>
                        );
                    }
                    if (index === 1 && currentPage >= 5) {
                        return <IconButton aria-label="more" as={MdMoreHoriz} variant="ghost" />;
                    }
                    if (index === 5 && currentPage <= numberOfPages - 4) {
                        return <IconButton aria-label="more" as={MdMoreHoriz} variant="ghost" />;
                    }
                    if (index === 6) {
                        return (
                            <Button
                                key={numberOfPages}
                                onClick={(): void => setQuery({ page: numberOfPages })}
                                variant={numberOfPages === currentPage ? 'solid' : 'ghost'}
                            >
                                {numberOfPages}
                            </Button>
                        );
                    }
                    if (currentPage < 5) {
                        return (
                            <Button
                                key={pageNumber}
                                onClick={(): void => setQuery({ page: pageNumber })}
                                variant={pageNumber === currentPage ? 'solid' : 'ghost'}
                            >
                                {pageNumber}
                            </Button>
                        );
                    }
                    if (currentPage >= 5 && currentPage <= numberOfPages - 4) {
                        pageNumber = currentPage + index - 3;
                    } else {
                        pageNumber = numberOfPages - (6 - index);
                    }
                    return (
                        <Button
                            key={pageNumber}
                            onClick={(): void => setQuery({ page: pageNumber })}
                            variant={pageNumber === currentPage ? 'solid' : 'ghost'}
                        >
                            {pageNumber}
                        </Button>
                    );
                })}
            <IconButton
                aria-label="next"
                onClick={(): void => handleNextOrPrevButtonClick('next')}
                icon={MdKeyboardArrowRight}
                isDisabled={currentPage >= numberOfPages}
                variant="ghost"
                fontSize="24px"
            />
        </Box>
    );
}

export default Pagination;
