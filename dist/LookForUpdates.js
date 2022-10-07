"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const latest_version_1 = tslib_1.__importDefault(require("latest-version"));
const semver_1 = tslib_1.__importDefault(require("semver"));
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const boxen_1 = tslib_1.__importDefault(require("boxen"));
const fs_1 = tslib_1.__importDefault(require("fs"));
async function lookForUpdates() {
    const { version } = JSON.parse(fs_1.default.readFileSync(__dirname + '/../package.json'));
    const currentVersion = version.replace(/[^0-9.]/g, '');
    const latestVersion = await (0, latest_version_1.default)('sl-commands');
    const updateAvailable = semver_1.default.lt(currentVersion, latestVersion);
    if (updateAvailable) {
        const msg = {
            updateAvailable: `Update available ${chalk_1.default.dim(currentVersion)} → ${chalk_1.default.green(latestVersion)}`,
            runUpdate: `Run ${chalk_1.default.cyan(`npm i sl-commands@latest`)} to update`,
        };
        console.log((0, boxen_1.default)(`${msg.updateAvailable}\n${msg.runUpdate}`, {
            borderColor: 'cyanBright',
            title: 'sl-commands',
            align: 'center',
            padding: 1,
            margin: 1,
        }));
    }
}
exports.default = lookForUpdates;
