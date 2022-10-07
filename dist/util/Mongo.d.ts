import mongoose from 'mongoose';
import SLHandler from '..';
export declare class Mongo {
    handler: SLHandler;
    mongoUri: string;
    dbOptions: {};
    constructor(handler: SLHandler, mongoUri: string, dbOptions?: {});
    connect(): Promise<void>;
    static getConnection(): mongoose.Connection;
}
