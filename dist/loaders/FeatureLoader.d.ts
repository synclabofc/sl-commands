import { FeatureFunction, TimedFunction } from '../structures';
import SLHandler from '..';
declare class FeatureHandler {
    initFunctions: FeatureFunction[];
    timedFunctions: TimedFunction[];
    constructor(handler: SLHandler, dir: string);
    private load;
}
export = FeatureHandler;
