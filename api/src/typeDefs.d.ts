// A problem with typescript-eslint requires this to be ignored
// https://github.com/typescript-eslint/typescript-eslint/issues/1596
// https://github.com/typescript-eslint/typescript-eslint/issues/1856
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { User as PrismaClientUser } from '@prisma/client';

declare module 'amplitude' {
    type AmplitudeOptions =
        | {
              secretKey: string;
              userId: string;
              deviceId: string;
              sessionId: string;
          }
        | {
              secretKey: string;
              user_id: string;
              device_id: string;
              session_id: string;
          };
    type TrackData = {
        eventType: string;
        userId?: string;
        eventProperties?: {
            [key: string]: string;
        };
        userProperties?: {
            [key: string]: string;
        };
    };
    declare class Amplitude {
        constructor(token: string, options?: Partial<AmplitudeOptions>);

        track(data: TrackData): any;
    }

    export = Amplitude;
}

declare global {
    namespace Express {
        export interface Request {
            userId?: string;
            prismaClientUser?: PrismaClientUser | null;
            cookie: Response.cookie;
        }
    }
}
