import React from 'react';
import { Box } from '@robertcooper/chakra-ui-core';
import JobApplicationTable from '../components/Table/JobApplicationTable';
import AddButtons, { mainButtonSize } from '../components/AddButtons/AddButtons';
import { PageTitle } from '.';

type Props = {};

const Jobs: React.FC<Props> = () => {
    return (
        <Box pb={mainButtonSize}>
            <PageTitle>Job Applications</PageTitle>
            <JobApplicationTable />
            <AddButtons />
        </Box>
    );
};

export default Jobs;
