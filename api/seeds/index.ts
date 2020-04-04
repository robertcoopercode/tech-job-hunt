// Used to seed the database with data
import cuid from 'cuid';
import bcrypt from 'bcrypt';
import faker from 'faker';
import knex from 'knex';
import subDays from 'date-fns/subDays';
import format from 'date-fns/format';
import {
    prisma,
    JobApplicationCreateWithoutCompanyInput,
    CompanyContactCreateWithoutCompanyInput,
    ApplicationStatus,
} from '../src/generated/prisma-client';
import { companies } from './companies';
import { locations } from './locations';
import { createFileObject } from './utils';
import { resumes } from './resumes';

const knexInstance = knex({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: 'FH3xEXCBSZ1f7SXxus5Q',
        database: 'tech-job-hunt@local',
    },
});

const userEmail = 'richard@piedpiper.com';
const userPassword = 'tech';

const ratingOptions = [3, 4, 5];
const contactJobTitles = [
    'Front-end Developer',
    'Engineering Manager',
    'Tech Lead',
    'Back-end Developer',
    'Software Engineer',
    'UI Engineer',
];
const applicationJobTitles = [
    'Front-end Developer',
    'Engineering Manager',
    'Tech Lead',
    'Software Engineer',
    'UI Engineer',
    'iOS Developer',
    'Full-stack Developer',
];
const applicationStatuses: ApplicationStatus[] = ['APPLIED', 'DECIDED', 'INTERESTED', 'INTERVIEWING', 'OFFER'];

const createContacts = ({ domainName }: { domainName: string }): CompanyContactCreateWithoutCompanyInput[] => {
    const contacts = [];
    for (let i = 0; i <= faker.random.arrayElement([2, 3, 4]); i++) {
        const firstName = faker.name.firstName();
        const lastName = faker.name.lastName();
        const position = faker.random.arrayElement(contactJobTitles);
        contacts.push({
            name: `${firstName} ${lastName}`,
            position,
            phone: faker.phone.phoneNumber(),
            email: `${firstName}.${lastName}@${domainName}`,
            order: i + 1,
            notes: faker.lorem.paragraphs(2),
        });
    }
    return contacts;
};

const createJobApplications = ({
    companyName,
    domainName,
    locationName,
    locationId,
}): JobApplicationCreateWithoutCompanyInput[] => {
    const jobApplications = [];
    for (let i = 0; i < faker.random.arrayElement([0, 1, 2, 3, 4]); i++) {
        const aRandomResume = faker.random.arrayElement(resumes);
        jobApplications.push({
            position: faker.random.arrayElement(applicationJobTitles),
            companyName,
            rating: faker.random.arrayElement(ratingOptions),
            applicationStatus: faker.random.arrayElement(applicationStatuses),
            user: {
                connect: {
                    email: userEmail,
                },
            },
            notes: faker.lorem.paragraphs(2),
            locationName,
            contacts: {
                create: createContacts({ domainName }),
            },
            isRemote: locationName === undefined,
            isApplicationActive: true,
            jobListingNotes: faker.lorem.paragraphs(2),
            jobListingLink: `https://${domainName}/careers?job=${cuid()}`,
            location: locationName
                ? {
                      connect: { id: locationId },
                  }
                : undefined,
            coverLetterFile: {
                create: createFileObject({
                    fileName: `${companyName}-cover-letter.pdf`,
                    key: 'seeds/robert-cooper-resume-2019.pdf',
                    versionId: 'qFn8Baoadz5811HZMj1diLSmHQHFQzhZ',
                }),
            },
            resume: {
                create: {
                    selectedVersionId: aRandomResume.versionId,
                    resume: {
                        connect: {
                            id: aRandomResume.id,
                        },
                    },
                },
            },
        } as JobApplicationCreateWithoutCompanyInput);
    }
    return jobApplications;
};

async function main(): Promise<void> {
    const hashedPassword = await bcrypt.hash(userPassword, 10);
    const userCuid = cuid();

    // Create all locations in DB
    Object.entries(locations).forEach(async ([_key, value]) => {
        if (value.locationId) {
            await prisma.createGoogleMapsLocation({
                name: value.locationName,
                googlePlacesId: value.locationId,
                id: value.locationId,
            });
        }
    });

    // Create user
    await prisma.createUser({
        email: userEmail,
        password: hashedPassword,
        id: userCuid,
        billing: {
            create: {
                isPremiumActive: true,
            },
        },
        hasVerifiedEmail: true,
    });
    // eslint-disable-next-line no-console
    console.log(`Seeded user: ${userEmail}`);

    // Create companies
    for (let i = 0; i < companies.length; i++) {
        const { name, domainName, imageFile, id } = companies[i];
        await prisma.createCompany({
            id,
            name,
            user: {
                connect: {
                    email: userEmail,
                },
            },
            website: `https://www.${domainName}`,
            rating: faker.random.arrayElement(ratingOptions),
            jobApplicationsCount: faker.random.number({ min: 1, max: 5 }),
            notes: faker.lorem.paragraphs(2),
            image: {
                create: imageFile,
            },
            contacts: {
                create: createContacts({
                    domainName,
                }),
            },
        });
        const dayDate = subDays(new Date(), faker.random.number({ min: 1, max: 31 }));
        const formattedDate = format(dayDate, 'yyyy-MM-dd 00:00:00.000');
        await knexInstance
            .from('Company')
            .where({ id })
            .update({ createdAt: formattedDate, updatedAt: formattedDate });
    }
    // eslint-disable-next-line no-console
    console.log(`Seeded ${companies.length} companies`);
    // Create resumes
    for (let i = 0; i < resumes.length; i++) {
        const { name, id, versionId } = resumes[i];
        await prisma.createResume({
            id,
            name,
            user: {
                connect: {
                    email: userEmail,
                },
            },
            versions: {
                create: [
                    {
                        ...createFileObject({
                            fileName: '2020-resume.pdf',
                            key: 'seeds/robert-cooper-resume-2019.pdf',
                            versionId: 'qFn8Baoadz5811HZMj1diLSmHQHFQzhZ',
                        }),
                        id: versionId,
                    },
                ],
            },
        });
        const dayDate = subDays(new Date(), faker.random.number({ min: 1, max: 31 }));
        const formattedDate = format(dayDate, 'yyyy-MM-dd 00:00:00.000');
        await knexInstance
            .from('Resume')
            .where({ id })
            .update({ createdAt: formattedDate, updatedAt: formattedDate });
    }
    // eslint-disable-next-line no-console
    console.log(`Seeded ${resumes.length} resumes`);
    // Create jobs
    for (let i = 0; i < 31; i++) {
        const dayDate = subDays(new Date(), i);
        const formattedDate = format(dayDate, 'yyyy-MM-dd 00:00:00.000');
        const { name, domainName, locationName, locationId, id } = faker.random.arrayElement(companies);
        const jobApplications = createJobApplications({
            companyName: name,
            domainName,
            locationName,
            locationId,
        });
        for (let k = 0; k < jobApplications.length; k++) {
            const jobId = cuid();
            await prisma.createJobApplication({
                id: jobId,
                user: {
                    connect: {
                        email: userEmail,
                    },
                },
                company: {
                    connect: {
                        id,
                    },
                },
                ...jobApplications[k],
            });
            await knexInstance
                .from('JobApplication')
                .where({ id: jobId })
                .update({ createdAt: formattedDate, updatedAt: formattedDate });
        }
    }
    // eslint-disable-next-line no-console
    console.log(`Seeded a shit ton of jobs`);
    process.exit(0);
}

// eslint-disable-next-line no-console
main().catch(e => console.error(e));
