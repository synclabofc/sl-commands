"use strict";
class FeatureManager {
    initFunctions = [];
    timedFunctions = [];
    registerFunction(featureFunction) {
        if (typeof featureFunction === 'function') {
            this.initFunctions.push(featureFunction);
        }
        else if ('timedFunction' in featureFunction) {
            this.timedFunctions.push(featureFunction);
        }
    }
}
module.exports = new FeatureManager();
