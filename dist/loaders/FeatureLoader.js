"use strict";
const tslib_1 = require("tslib");
const FeatureManager_1 = tslib_1.__importDefault(require("../managers/FeatureManager"));
const util_1 = require("../util");
const fs_1 = require("fs");
class FeatureHandler {
    initFunctions = [];
    timedFunctions = [];
    constructor(handler, dir) {
        if (!dir)
            return;
        if (!(0, fs_1.existsSync)(dir)) {
            util_1.Logger.error(`The directory '${dir}' does not exists.`);
            return;
        }
        try {
            this.load(handler, dir);
        }
        catch (e) {
            util_1.Logger.error(`An error occurred while loading features.\n`, e);
        }
    }
    load(handler, dir) {
        const featureFiles = util_1.FileManager.getAllFiles(dir);
        const { client } = handler;
        for (const file of featureFiles) {
            util_1.FileManager.import(file);
        }
        const { initFunctions, timedFunctions } = FeatureManager_1.default;
        const context = { handler, client };
        client.on('ready', () => {
            for (const initFunction of initFunctions) {
                initFunction(context);
            }
            for (const { timedFunction, interval } of timedFunctions) {
                setInterval(() => {
                    timedFunction(context);
                }, interval);
            }
        });
        this.initFunctions = initFunctions;
        this.timedFunctions = timedFunctions;
        util_1.Logger.tag('FEATURES', `Loaded ${featureFiles.length} feature files.`);
    }
}
module.exports = FeatureHandler;
