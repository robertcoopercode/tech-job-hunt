import cuid from 'cuid';
import { locations } from './locations';
import { createFileObject } from './utils';

export const companies = [
    {
        id: cuid(),
        name: 'Netflix',
        domainName: 'netflix.com',
        imageFile: createFileObject({
            fileName: 'netflix.png',
            key: 'seeds/original/netflix.png',
            versionId: '6tGDAm8cz3erQUOyHJt3ykDA1pWVV_iW',
        }),
        ...locations.newYork,
    },
    {
        id: cuid(),
        name: 'Breather',
        domainName: 'breather.com',
        imageFile: createFileObject({
            fileName: 'breather.png',
            key: 'seeds/original/breather.png',
            versionId: '0WLYsIWJ57jw4V_dlNseEBihi4h_bbAy',
        }),
        ...locations.montreal,
    },
    {
        id: cuid(),
        name: 'Coveo',
        domainName: 'coveo.com',
        imageFile: createFileObject({
            fileName: 'coveo.png',
            key: 'seeds/original/coveo.png',
            versionId: '83EKnL92HMBzEZiepxwYtNMbRjCCjtDF',
        }),
        ...locations.montreal,
    },
    {
        id: cuid(),
        name: 'Dropbox',
        domainName: 'dropbox.com',
        imageFile: createFileObject({
            fileName: 'dropbox.png',
            key: 'seeds/original/dropbox.png',
            versionId: 'ZNJ_s3BlA0VLPrA00J_GmxsvDuGKmbM9',
        }),
        ...locations.sanFran,
    },
    {
        id: cuid(),
        name: 'Duolingo',
        domainName: 'duolingo.com',
        imageFile: createFileObject({
            fileName: 'duolingo.png',
            key: 'seeds/original/duolingo.png',
            versionId: 'tPoY4MPl_QPICd7dzbvZExliLtzfTRBd',
        }),
        ...locations.newYork,
    },
    {
        id: cuid(),
        name: 'Facebook',
        domainName: 'facebook.com',
        imageFile: createFileObject({
            fileName: 'facebook.png',
            key: 'seeds/original/facebook.png',
            versionId: 'YHB_WlzVVXfvy53quY4jOBX9p_WCz7LS',
        }),
        ...locations.seattle,
    },
    {
        id: cuid(),
        name: 'Gitlab',
        domainName: 'gitlab.com',
        imageFile: createFileObject({
            fileName: 'gitlab.png',
            key: 'seeds/original/gitlab.png',
            versionId: 'j0nftrfSeR25HM5QGo8CSMhZxoMAN2t6',
        }),
        ...locations.remote,
    },
    {
        id: cuid(),
        name: 'Google',
        domainName: 'google.com',
        imageFile: createFileObject({
            fileName: 'google.png',
            key: 'seeds/original/google.png',
            versionId: 'nRmlCdj.AKziJpNmRIsHiNjicGSWpHty',
        }),
        ...locations.sanFran,
    },
    {
        id: cuid(),
        name: 'Hinge',
        domainName: 'hinge.com',
        imageFile: createFileObject({
            fileName: 'hinge.jpg',
            key: 'seeds/original/hinge.jpg',
            versionId: 'fOn8hLTOcMIdcozlptnaihGOkIqutwR6',
        }),
        ...locations.newYork,
    },
    {
        id: cuid(),
        name: 'Honey',
        domainName: 'honey.com',
        imageFile: createFileObject({
            fileName: 'honey.jpg',
            key: 'seeds/original/honey.jpg',
            versionId: 'TXLcHvTV6fei2yVlttqDe.ITC3sKcOwk',
        }),
        ...locations.la,
    },
    {
        id: cuid(),
        name: 'Instacart',
        domainName: 'instacart.com',
        imageFile: createFileObject({
            fileName: 'instacart.jpg',
            key: 'seeds/original/instacart.jpg',
            versionId: 'lSHlYMH2pKHomylDzMzTGA3cushd8Nvf',
        }),
        ...locations.sanFran,
    },
    {
        id: cuid(),
        name: 'LANDR',
        domainName: 'landr.com',
        imageFile: createFileObject({
            fileName: 'landr.jpg',
            key: 'seeds/original/landr.jpg',
            versionId: 'vNsIADgvzLDAzUA6CmQvE6XROoKalElA',
        }),
        ...locations.montreal,
    },
    {
        id: cuid(),
        name: 'Lightspeed',
        domainName: 'lightspeed.com',
        imageFile: createFileObject({
            fileName: 'lightspeed.jpg',
            key: 'seeds/original/lightspeed.jpg',
            versionId: 'CCLY4LvL3rVUu2pXyiGG1FK2U_OyGQ1p',
        }),
        ...locations.montreal,
    },
    {
        id: cuid(),
        name: 'Medium',
        domainName: 'medium.com',
        imageFile: createFileObject({
            fileName: 'medium.jpg',
            key: 'seeds/original/medium.jpg',
            versionId: '1Be_kE5Qe0ddV5dE1Ga3qPA8_xzwQwTs',
        }),
        ...locations.sanFran,
    },
    {
        id: cuid(),
        name: 'Patreon',
        domainName: 'patreon.com',
        imageFile: createFileObject({
            fileName: 'patreon.jpg',
            key: 'seeds/original/patreon.jpg',
            versionId: 'xvfsmnCeIG8H9pgoq_rtDy9QqzMitGxp',
        }),
        ...locations.sanFran,
    },
    {
        id: cuid(),
        name: 'Twitch',
        domainName: 'twitch.com',
        imageFile: createFileObject({
            fileName: 'twitch.jpg',
            key: 'seeds/original/twitch.jpg',
            versionId: 'mpsCm1xomiYD699NrDXao6gHpKeklwRc',
        }),
        ...locations.sanFran,
    },
    {
        id: cuid(),
        name: 'Uber',
        domainName: 'uber.com',
        imageFile: createFileObject({
            fileName: 'uber.png',
            key: 'seeds/original/uber.png',
            versionId: 'plSiyOwTkqIsXp08zq_PnE60rn3UsuWn',
        }),
        ...locations.toronto,
    },
    {
        id: cuid(),
        name: 'Ubisoft',
        domainName: 'ubisoft.com',
        imageFile: createFileObject({
            fileName: 'ubisoft.png',
            key: 'seeds/original/ubisoft.png',
            versionId: 'iMUpQC2fakjpLa663wobAAmGUxbTMfP1',
        }),
        ...locations.montreal,
    },
    {
        id: cuid(),
        name: 'Wealthsimple',
        domainName: 'wealthsimple.com',
        imageFile: createFileObject({
            fileName: 'wealthsimple.png',
            key: 'seeds/original/wealthsimple.png',
            versionId: 'A0CS4aE98MY3aMdjuUfTz43Oy8fcHnZB',
        }),
        ...locations.toronto,
    },
];
