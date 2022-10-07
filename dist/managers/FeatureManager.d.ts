import { FeatureFunction, TimedFunction } from '../structures';
declare class FeatureManager {
    readonly initFunctions: FeatureFunction[];
    readonly timedFunctions: TimedFunction[];
    registerFunction(featureFunction: FeatureFunction | TimedFunction): void;
}
declare const _default: FeatureManager;
export = _default;
