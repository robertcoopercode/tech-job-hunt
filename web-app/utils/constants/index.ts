import { ApplicationStatus } from '../../graphql/generated/graphql-global-types';
import { customTheme } from '../styles/theme';

export const applicationStatusDetails: {
    [key in ApplicationStatus]: {
        label: string;
        color: string;
    };
} = {
    [ApplicationStatus.APPLIED]: { label: 'Applied', color: customTheme.colors.purple[500] },
    [ApplicationStatus.DECIDED]: { label: 'Decided', color: customTheme.colors.pink[500] },
    [ApplicationStatus.INTERESTED]: { label: 'Interested', color: customTheme.colors.yellow[500] },
    [ApplicationStatus.INTERVIEWING]: { label: 'Interviewing', color: customTheme.colors.blue[500] },
    [ApplicationStatus.OFFER]: { label: 'Offer', color: customTheme.colors.green[500] },
};

export enum QueryParamKeys {
    VIEW_JOB = 'viewJob',
    VIEW_COMPANY = 'viewCompany',
    VIEW_RESUME = 'viewResume',
    ADD_JOB = 'addJob',
    ADD_COMPANY = 'addCompany',
    ADD_RESUME = 'addResume',
    PAGE = 'page',
    ORDER_BY = 'orderBy',
    PAGE_SIZE = 'pageSize',
    COMPANY_NAME = 'name',
    SELECTED_COMPANY_ID = 'selectedCompany',
}

export enum pageSizes {
    level1 = '10',
    level2 = '25',
    level3 = '50',
    level4 = '100',
}

export const defaultNumberOfTableRows = parseInt(pageSizes.level2, 10);

export const freeTierJobLimit = 10;
