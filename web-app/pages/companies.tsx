import React from 'react';
import { Box } from '@robertcooper/chakra-ui-core';
import CompaniesTable from '../components/Table/CompaniesTable';
import AddButtons, { mainButtonSize } from '../components/AddButtons/AddButtons';
import { PageTitle } from '.';

type Props = {};

const Companies: React.FC<Props> = () => {
    return (
        <Box pb={mainButtonSize}>
            <PageTitle>Companies</PageTitle>
            <CompaniesTable />
            <AddButtons />
        </Box>
    );
};

export default Companies;
