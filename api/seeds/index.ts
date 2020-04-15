if (require.main === module) {
    // Only import the environment variables if executing this file directly: https://stackoverflow.com/a/6090287/8360496
    // The schema file gets executed directly when running the generate command: yarn generate
    // Without this check, we would be trying to load the environment variables twice and that causes warnings to be thrown in the console
    require('dotenv-flow').config();
}

import cuid from 'cuid';
import bcrypt from 'bcrypt';
import faker from 'faker';
import knex from 'knex';
import subDays from 'date-fns/subDays';
import format from 'date-fns/format';
import {
    JobApplicationCreateWithoutCompanyInput,
    CompanyContactCreateWithoutCompanyInput,
    ApplicationStatus,
    PrismaClient,
} from '@prisma/client';
import { companies } from './companies';
import { locations } from './locations';
import { createFileObject } from './utils';
import { resumes } from './resumes';

const prisma = new PrismaClient();

const knexInstance = knex({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: 'FH3xEXCBSZ1f7SXxus5Q',
        database: 'tech-job-hunt@local',
    },
});

const userEmail = `${faker.name.firstName().toLowerCase()}@piedpiper.com`;
const userPassword = 'tech';

// eslint-disable-next-line no-console
console.log(`Creating user '${userEmail}' with password '${userPassword}'`);

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
}: {
    companyName: string;
    domainName: string;
    locationName: string | undefined;
    locationId: string | undefined;
}): JobApplicationCreateWithoutCompanyInput[] => {
    const jobApplications: JobApplicationCreateWithoutCompanyInput[] = [];
    for (let i = 0; i < faker.random.arrayElement([0, 1, 2, 3, 4]); i++) {
        const aRandomResume = faker.random.arrayElement(resumes);
        jobApplications.push({
            position: faker.random.arrayElement(applicationJobTitles),
            companyName,
            rating: faker.random.arrayElement(ratingOptions),
            applicationStatus: faker.random.arrayElement(applicationStatuses),
            User: {
                connect: {
                    email: userEmail,
                },
            },
            notes: faker.lorem.paragraphs(2),
            Contacts: {
                create: createContacts({ domainName }),
            },
            isRemote: locationName === undefined,
            locationName: locationName,
            isApplicationActive: true,
            jobListingNotes: faker.lorem.paragraphs(2),
            jobListingLink: `https://${domainName}/careers?job=${cuid()}`,
            Location: locationName
                ? {
                      connect: { id: locationId },
                  }
                : undefined,
            CoverLetterFile: {
                create: createFileObject({
                    fileName: `${companyName}-cover-letter.pdf`,
                    key: 'seeds/robert-cooper-resume-2019.pdf',
                    versionId: 'qFn8Baoadz5811HZMj1diLSmHQHFQzhZ',
                }),
            },
            Resume: {
                create: {
                    selectedVersionId: aRandomResume.versionId,
                    Resume: {
                        connect: {
                            id: aRandomResume.id,
                        },
                    },
                },
            },
        });
    }
    return jobApplications;
};

async function main(): Promise<void> {
    const hashedPassword = await bcrypt.hash(userPassword, 10);
    const userCuid = cuid();

    // Create all locations in DB
    Object.entries(locations).forEach(async ([_key, value]) => {
        if (value.locationId) {
            await prisma.googleMapsLocation.create({
                data: {
                    name: value.locationName,
                    googlePlacesId: value.locationId,
                    id: value.locationId,
                },
            });
        }
    });

    // Create user
    await prisma.user.create({
        data: {
            email: userEmail,
            password: hashedPassword,
            id: userCuid,
            Billing: {
                create: {
                    isPremiumActive: true,
                },
            },
            hasVerifiedEmail: true,
        },
    });
    // eslint-disable-next-line no-console
    console.log(`Seeded user: ${userEmail}`);

    // Create companies
    for (let i = 0; i < companies.length; i++) {
        const { name, domainName, imageFile, id } = companies[i];
        await prisma.company.create({
            data: {
                id,
                name,
                User: {
                    connect: {
                        email: userEmail,
                    },
                },
                website: `https://www.${domainName}`,
                rating: faker.random.arrayElement(ratingOptions),
                jobApplicationsCount: faker.random.number({ min: 1, max: 5 }),
                notes: faker.lorem.paragraphs(2),
                Image: {
                    create: imageFile,
                },
                Contacts: {
                    create: createContacts({
                        domainName,
                    }),
                },
            },
        });
        const dayDate = subDays(new Date(), faker.random.number({ min: 1, max: 31 }));
        const formattedDate = format(dayDate, 'yyyy-MM-dd 00:00:00.000');
        await knexInstance.from('Company').where({ id }).update({ createdAt: formattedDate, updatedAt: formattedDate });
    }
    // eslint-disable-next-line no-console
    console.log(`Seeded ${companies.length} companies`);
    // Create resumes
    for (let i = 0; i < resumes.length; i++) {
        const { name, id, versionId } = resumes[i];
        await prisma.resume.create({
            data: {
                id,
                name,
                User: {
                    connect: {
                        email: userEmail,
                    },
                },
                Versions: {
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
            },
        });
        const dayDate = subDays(new Date(), faker.random.number({ min: 1, max: 31 }));
        const formattedDate = format(dayDate, 'yyyy-MM-dd 00:00:00.000');
        await knexInstance.from('Resume').where({ id }).update({ createdAt: formattedDate, updatedAt: formattedDate });
    }
    // eslint-disable-next-line no-console
    console.log(`Seeded ${resumes.length} resumes`);

    // Create jobs
    let jobApplicationCount = 0;
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
            jobApplicationCount++;
            const jobId = cuid();
            await prisma.jobApplication.create({
                data: {
                    id: jobId,
                    User: {
                        connect: {
                            email: userEmail,
                        },
                    },
                    Company: {
                        connect: {
                            id,
                        },
                    },
                    ...jobApplications[k],
                },
            });
            await knexInstance
                .from('JobApplication')
                .where({ id: jobId })
                .update({ createdAt: formattedDate, updatedAt: formattedDate });
        }
    }
    // eslint-disable-next-line no-console
    console.log(`Seeded a ${jobApplicationCount} jobs`);
    process.exit(0);
}

// eslint-disable-next-line no-console
main().catch((e) => console.error(e));
