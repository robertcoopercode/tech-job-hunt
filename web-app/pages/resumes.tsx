import React from 'react';
import { Box } from '@robertcooper/chakra-ui-core';
import ResumesTable from '../components/Table/ResumesTable';
import AddButtons, { mainButtonSize } from '../components/AddButtons/AddButtons';
import { PageTitle } from '.';

type Props = {};

const Resumes: React.FC<Props> = () => {
    return (
        <Box pb={mainButtonSize}>
            <PageTitle>Resumes</PageTitle>
            <ResumesTable />
            <AddButtons />
        </Box>
    );
};

export default Resumes;
