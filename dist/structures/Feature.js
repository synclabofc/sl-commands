"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Feature = void 0;
const tslib_1 = require("tslib");
const FeatureManager_1 = tslib_1.__importDefault(require("../managers/FeatureManager"));
const shapeshift_1 = require("@sapphire/shapeshift");
function checkNumber(value) {
    shapeshift_1.s.number.parse(value);
}
class Feature {
    /**
     * Will executed once when the handler starts
     *
     * @param initFunction - The function which will be executed
     */
    setInit(initFunction) {
        FeatureManager_1.default.registerFunction(initFunction);
        return this;
    }
    /**
     * Adds a new timed function which will be executed according to the provided interval
     *
     * @param timedFunction - The function which will be executed
     * @param interval - How much time to wait before running again in milliseconds
     */
    addTimed(timedFunction, interval) {
        checkNumber(interval);
        FeatureManager_1.default.registerFunction({ timedFunction, interval });
        return this;
    }
}
exports.Feature = Feature;
