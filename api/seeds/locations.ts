import cuid from 'cuid';

export const locations = {
    newYork: {
        locationName: 'New York, NY',
        locationId: cuid(),
    },
    montreal: {
        locationName: 'Montreal, QC',
        locationId: cuid(),
    },
    sanFran: {
        locationName: 'San Francisco, CA',
        locationId: cuid(),
    },
    la: {
        locationName: 'Los Angeles, CA',
        locationId: cuid(),
    },
    seattle: {
        locationName: 'Seattle, WA',
        locationId: cuid(),
    },
    toronto: {
        locationName: 'Toronto, ON',
        locationId: cuid(),
    },
    remote: {
        locationName: undefined,
        locationId: undefined,
    },
};
