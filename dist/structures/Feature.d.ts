import { Client } from 'discord.js';
import SLHandler from '..';
export declare type FeatureFunction = (ctx: {
    client: Client;
    handler: SLHandler;
}) => any;
export declare type TimedFunction = {
    timedFunction: FeatureFunction;
    interval: number;
};
export declare class Feature {
    /**
     * Will executed once when the handler starts
     *
     * @param initFunction - The function which will be executed
     */
    setInit(initFunction: FeatureFunction): this;
    /**
     * Adds a new timed function which will be executed according to the provided interval
     *
     * @param timedFunction - The function which will be executed
     * @param interval - How much time to wait before running again in milliseconds
     */
    addTimed(timedFunction: FeatureFunction, interval: number): this;
}
