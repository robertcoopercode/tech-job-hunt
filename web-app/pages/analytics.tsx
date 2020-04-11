import { useQuery } from '@apollo/react-hooks';
import { Box, Text } from '@robertcooper/chakra-ui-core';
import styled from '@emotion/styled';
import 'chartjs-adapter-date-fns';
import {
    differenceInDays,
    eachWeekOfInterval,
    format,
    isSameWeek,
    parse,
    parseISO,
    subDays,
    subMonths,
} from 'date-fns';
import produce from 'immer';
import { rgba } from 'polished';
import React, { CSSProperties, useRef } from 'react';
import { Bar, defaults, Doughnut, HorizontalBar, Line } from 'react-chartjs-2';
import AddButtons, { mainButtonSize } from '../components/AddButtons/AddButtons';
import Loader from '../components/Loader/Loader';
import { AnalyticsQuery, AnalyticsQueryVariables } from '../graphql/generated/AnalyticsQuery';
import { ApplicationStatus } from '../graphql/generated/graphql-global-types';
import { analyticsQuery } from '../graphql/queries';
import { applicationStatusDetails, QueryParamKeys } from '../utils/constants';
import { customTheme, mediaQueries } from '../utils/styles/theme';
import EmptyState from '../components/EmptyState/EmptyState';
import { useModalQuery } from '../utils/hooks/useModalQuery';
import { PageTitle } from '.';

defaults.global.legend!.labels!.padding = 15;
defaults.global.legend!.position = 'top';
defaults.global.legend!.align = 'start';
defaults.global.tooltips!.backgroundColor = customTheme.colors.gray[800];
defaults.global.tooltips!.displayColors = false;
defaults.global.tooltips!.bodySpacing = 4;
defaults.global.tooltips!.cornerRadius = 2;
defaults.global.tooltips!.titleFontSize = 14;
defaults.global.tooltips!.bodyFontStyle = 'bold';
defaults.global.maintainAspectRatio = false;

const GraphTitleGroup: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
    <>
        <Text fontSize="xl" mb={0}>
            {title}
        </Text>
        {subtitle && (
            <Text fontSize="sm" mt={1} color="gray.500">
                {subtitle}
            </Text>
        )}
    </>
);

const GraphsWrapper = styled(Box)`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    overflow: hidden;
    ${mediaQueries.lg} {
        margin: -${customTheme.space[12]};
    }
`;

const GraphGroup = styled(Box)<{ fullWidth?: boolean }>`
    width: 100%;
    margin-bottom: ${customTheme.space[6]};

    ${mediaQueries.lg} {
        margin-bottom: unset;
        margin: ${customTheme.space[12]};
        width: ${(props): CSSProperties['width'] => {
            return props.fullWidth
                ? `calc(100% - 2 * ${customTheme.space[12]})`
                : `calc(50% - 2 * ${customTheme.space[12]})`;
        }};
    }
`;

// Wrapper to control the size of the graph: https://www.chartjs.org/docs/latest/general/responsive.html#important-note
const GraphWrapper = styled(Box)`
    position: relative;
    height: 100%;
    max-height: 300px;
`;

const backgroundColors = [
    customTheme.colors.purple[500],
    customTheme.colors.pink[500],
    customTheme.colors.yellow[500],
    customTheme.colors.blue[500],
    customTheme.colors.green[500],
];

type Props = {};

const Analytics: React.FC<Props> = () => {
    // Store a variable for the current time so that all places that use Date.now() uses the same time. Exception is made for the
    // useEffect since that would cause endless rerenders
    const now = useRef(new Date());

    const { data: analyticsData, loading } = useQuery<AnalyticsQuery, AnalyticsQueryVariables>(analyticsQuery, {
        variables: {
            startDate: subMonths(now.current, 1),
        },
    });
    const { onOpen: onOpenAddNewJob } = useModalQuery(QueryParamKeys.ADD_JOB);

    const jobApplicationsUpdatedByStatus = analyticsData?.addedJobs.nodes.reduce(
        (
            prev: {
                [key in ApplicationStatus]?: {
                    count: number;
                    date: string;
                };
            },
            curr
        ): {
            [key in ApplicationStatus]?: {
                count: number;
                date: string;
            };
        } => {
            if (curr?.applicationStatus) {
                const status = curr.applicationStatus;
                const previouStatus = prev[status];
                if (previouStatus !== undefined) {
                    previouStatus.count = previouStatus.count + 1;
                    return prev;
                } else {
                    prev[status] = {
                        count: 1,
                        date: format(parseISO(curr.createdAt), 'yyyy-MM-dd'),
                    };
                }
            }
            return prev;
        },
        {}
    );

    const jobApplicationsStatusDoughnutChartData = {
        labels: Object.keys(jobApplicationsUpdatedByStatus ?? {}).map(
            (key) => applicationStatusDetails[key as ApplicationStatus].label
        ),
        datasets: [
            {
                data: Object.values(jobApplicationsUpdatedByStatus ?? {}).map((v) => v?.count),
                borderColor: Object.keys(jobApplicationsUpdatedByStatus ?? {}).map(
                    (key) => applicationStatusDetails[key as ApplicationStatus].color
                ),
                backgroundColor: Object.keys(jobApplicationsUpdatedByStatus ?? {}).map((key) =>
                    rgba(applicationStatusDetails[key as ApplicationStatus].color, 0.8)
                ),
                hoverBackgroundColor: Object.keys(jobApplicationsUpdatedByStatus ?? {}).map((key) =>
                    rgba(applicationStatusDetails[key as ApplicationStatus].color, 0.6)
                ),
            },
        ],
    };

    const weeks = eachWeekOfInterval({ start: subMonths(now.current, 1), end: now.current });

    const weeklyJobdsAddedData = analyticsData?.addedJobs.nodes.reduce((prev, curr): number[] => {
        weeks.some((week, index) => {
            if (isSameWeek(week, parseISO(curr.createdAt))) {
                prev[index] += 1;
                return true;
            }
            return false;
        });
        return prev;
    }, new Array(weeks.length).fill(0));

    const weeklyJobsAddedData = {
        labels: weeks.map((date) => `Week of ${format(date, 'LLL do')}`),
        datasets: [
            {
                data: weeklyJobdsAddedData,
                minBarLength: 5,
                maxBarThickness: 40,
                borderWidth: 2,
                borderColor: new Array(weeks.length)
                    .fill(null)
                    .map((_v, i) => backgroundColors[i % backgroundColors.length]),
                backgroundColor: new Array(weeks.length)
                    .fill(null)
                    .map((_v, i) => backgroundColors[i % backgroundColors.length])
                    .map((v) => rgba(v, 0.8)),
                hoverBackgroundColor: new Array(weeks.length)
                    .fill(null)
                    .map((_v, i) => backgroundColors[i % backgroundColors.length])
                    .map((v) => rgba(v, 0.6)),
            },
        ],
    };

    const companies = analyticsData?.addedJobs.nodes.reduce(
        (
            prev: {
                [id: string]: { name: string; count: number };
            },
            curr
        ): {
            [id: string]: { name: string; count: number };
        } => {
            const companyId = curr.Company?.id;
            const companyName = curr.Company?.name;
            if (companyId && companyName) {
                if (companyId in prev) {
                    prev[companyId].count = prev[companyId].count + 1;
                    return prev;
                }
                prev[companyId] = {
                    name: companyName,
                    count: 1,
                };
            }

            return prev;
        },
        {}
    );

    const jobsPerCompanyData = {
        labels: Object.values(companies ?? {}).map((c) => c.name),
        datasets: [
            {
                data: Object.values(companies ?? {}).map((c) => c.count),
                minBarLength: 5,
                maxBarThickness: 40,
                borderWidth: 2,
                borderColor: customTheme.colors.blue[500],
                backgroundColor: rgba(customTheme.colors.blue[500], 0.8),
                hoverBackgroundColor: rgba(customTheme.colors.blue[500], 0.6),
            },
        ],
    };

    const locations = analyticsData?.addedJobs.nodes.reduce(
        (
            prev: {
                [googlePlacesId: string]: {
                    name: string;
                    count: number;
                };
            },
            curr
        ): {
            [googlePlacesId: string]: {
                name: string;
                count: number;
            };
        } => {
            const { isRemote } = curr;
            if (isRemote) {
                if ('remote' in prev) {
                    prev['remote'].count = prev['remote'].count + 1;
                    return prev;
                }
                prev['remote'] = {
                    name: 'Remote',
                    count: 1,
                };
                return prev;
            }
            const googlePlacesId = curr.Location?.googlePlacesId;
            const locationName = curr.Location?.name;
            if (locationName && googlePlacesId) {
                if (googlePlacesId in prev) {
                    prev[googlePlacesId].count = prev[googlePlacesId].count + 1;
                    return prev;
                }
                prev[googlePlacesId] = {
                    name: locationName,
                    count: 1,
                };
            }
            return prev;
        },
        {}
    );

    const jobsPerLocationData = {
        labels: Object.values(locations ?? {}).map((c) => c.name),
        datasets: [
            {
                data: Object.values(locations ?? {}).map((c) => c.count),
                minBarLength: 5,
                maxBarThickness: 40,
                borderWidth: 2,
                borderColor: customTheme.colors.blue[500],
                backgroundColor: rgba(customTheme.colors.blue[500], 0.8),
                hoverBackgroundColor: rgba(customTheme.colors.blue[500], 0.6),
            },
        ],
    };

    const rangeOfDates = new Array(differenceInDays(now.current, subMonths(now.current, 1))).fill(0).reduce((p, c, i): {
        [date: string]: { count: 0 };
    } => {
        const formatttedDate = format(subDays(now.current, i), 'yyyy-MM-dd');
        p[formatttedDate] = {
            count: 0,
        };
        return p;
    }, {});

    const jobApplicationsByStatuses = Object.values(ApplicationStatus).map((status) => {
        return {
            name: status,
            dates: analyticsData?.addedJobs.nodes.reduce((prev: { [date: string]: { count: number } }, curr): {
                [date: string]: {
                    count: number;
                };
            } => {
                return produce(prev, (draft) => {
                    if (curr?.applicationStatus === status) {
                        const formatttedDate = format(parseISO(curr.createdAt), 'yyyy-MM-dd');
                        if (formatttedDate in draft) {
                            draft[formatttedDate].count += 1;
                            return draft;
                        }
                    }
                    return draft;
                });
            }, rangeOfDates),
        };
    });

    const jobApplicationsByStatusesData = {
        datasets: jobApplicationsByStatuses.map((set) => ({
            label: applicationStatusDetails[set.name].label,
            backgroundColor: rgba(applicationStatusDetails[set.name].color, 0.2),
            borderColor: applicationStatusDetails[set.name].color,
            pointBorderColor: applicationStatusDetails[set.name].color,
            pointHoverBackgroundColor: applicationStatusDetails[set.name].color,
            pointBackgroundColor: customTheme.colors.white,
            pointHoverBorderColor: applicationStatusDetails[set.name].color,
            pointBorderWidth: 2,
            pointHoverRadius: 8,
            pointHoverBorderWidth: 2,
            pointRadius: 5,
            pointHitRadius: 10,
            data: Object.entries(set.dates ?? {})
                .map(([key, value]) => ({
                    x: parse(key, 'yyyy-MM-dd', new Date()),
                    y: value.count,
                }))
                .sort(({ x: date1 }, { x: date2 }) => date2.getTime() - date1.getTime()),
        })),
    };

    const hasAnyAnalyticsToDisplay = analyticsData?.addedJobs.nodes && analyticsData?.addedJobs.nodes.length > 0;

    const pageSubtitle = `For the last month (${format(subMonths(now.current, 1), 'LLL do')} to ${format(
        now.current,
        'LLL do'
    )})`;

    return (
        <Box pb={mainButtonSize}>
            <PageTitle mb={0}>Analytics</PageTitle>
            <Text mt={1} mb={10} color="gray.500">
                {pageSubtitle}
            </Text>
            {loading ? (
                <Loader />
            ) : (
                <>
                    {!hasAnyAnalyticsToDisplay && (
                        <EmptyState
                            title="No analytics available"
                            description="You need to have at least added/updated 1 job application in the past month to see analytics."
                            ctaText="Add job application"
                            onClick={(): void => {
                                onOpenAddNewJob();
                            }}
                        />
                    )}
                    {hasAnyAnalyticsToDisplay && (
                        <GraphsWrapper>
                            <GraphGroup width="100%" fullWidth>
                                <GraphTitleGroup title="Jobs added" subtitle="by day" />
                                <GraphWrapper>
                                    <Line
                                        data={jobApplicationsByStatusesData}
                                        options={{
                                            maintainAspectRatio: false,
                                            elements: {
                                                line: {
                                                    fill: true,
                                                },
                                            },
                                            scales: {
                                                xAxes: [
                                                    {
                                                        type: 'time',
                                                        ticks: {
                                                            min: subMonths(now.current, 1),
                                                            fontStyle: 'bold',
                                                        },
                                                        time: {
                                                            minUnit: 'day',
                                                            tooltipFormat: 'LLL do',
                                                        },
                                                        gridLines: { display: true, drawOnChartArea: false },
                                                    },
                                                ],
                                                yAxes: [
                                                    {
                                                        ticks: {
                                                            min: 0,
                                                            stepSize: 1,
                                                        },
                                                        gridLines: { display: false },
                                                        display: false,
                                                    },
                                                ],
                                            },
                                        }}
                                    />
                                </GraphWrapper>
                            </GraphGroup>
                            <GraphGroup>
                                <GraphTitleGroup title="Jobs added" subtitle="by status" />
                                <GraphWrapper>
                                    <Doughnut
                                        data={jobApplicationsStatusDoughnutChartData}
                                        options={{ cutoutPercentage: 60 }}
                                    />
                                </GraphWrapper>
                            </GraphGroup>
                            <GraphGroup>
                                <GraphTitleGroup title="Jobs added" subtitle="by week" />
                                <GraphWrapper>
                                    <Bar
                                        data={weeklyJobsAddedData}
                                        options={{
                                            legend: { display: false },
                                            scales: {
                                                xAxes: [
                                                    {
                                                        gridLines: { display: false },
                                                        ticks: { fontStyle: 'bold' },
                                                    },
                                                ],
                                                yAxes: [
                                                    {
                                                        gridLines: { display: false },
                                                        ticks: { beginAtZero: true },
                                                        display: false,
                                                    },
                                                ],
                                            },
                                        }}
                                    />
                                </GraphWrapper>
                            </GraphGroup>
                            <GraphGroup>
                                <GraphTitleGroup title="Jobs added" subtitle="by company" />
                                <GraphWrapper>
                                    <HorizontalBar
                                        data={jobsPerCompanyData}
                                        options={{
                                            legend: { display: false },
                                            scales: {
                                                xAxes: [
                                                    {
                                                        gridLines: { display: false },
                                                        display: false,
                                                        ticks: { min: 0 },
                                                    },
                                                ],
                                                yAxes: [
                                                    {
                                                        gridLines: { display: false },
                                                        ticks: { min: 0, fontStyle: 'bold' },
                                                    },
                                                ],
                                            },
                                        }}
                                    />
                                </GraphWrapper>
                            </GraphGroup>
                            <GraphGroup>
                                <GraphTitleGroup title="Jobs added" subtitle="by location" />
                                <GraphWrapper>
                                    <HorizontalBar
                                        data={jobsPerLocationData}
                                        options={{
                                            legend: { display: false },
                                            scales: {
                                                xAxes: [
                                                    {
                                                        gridLines: { display: false },
                                                        display: false,
                                                        ticks: { min: 0 },
                                                    },
                                                ],
                                                yAxes: [
                                                    {
                                                        gridLines: { display: false },
                                                        ticks: { min: 0, fontStyle: 'bold' },
                                                    },
                                                ],
                                            },
                                        }}
                                    />
                                </GraphWrapper>
                            </GraphGroup>
                        </GraphsWrapper>
                    )}
                </>
            )}
            <AddButtons />
        </Box>
    );
};

export default Analytics;
