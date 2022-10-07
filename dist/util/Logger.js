"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const { log } = console;
class Logger {
    /**
     * @param {string} hex - The HEX code
     */
    static hex(hex) {
        return chalk_1.default.hex(hex);
    }
    /**
     * @param {string} hex - The HEX code
     */
    static bgHex(hex) {
        return chalk_1.default.bgHex(hex);
    }
    /**
     * @param {string} hex - The HEX code
     * @param {string} prefix - The [PREFIX]
     */
    static create(hex, prefix) {
        return chalk_1.default.white('[') + Logger.hex(hex)(prefix) + chalk_1.default.white(']');
    }
    /**
     * @param {string[]} ...args - Anything you want to log with warn as prefix
     */
    static warn(...args) {
        log(Logger.create('#ffffcc', 'WARN'), ...args);
    }
    /**
     * @param {string[]} ...args - Anything you want to log with error as prefix
     */
    static error(...args) {
        log(Logger.create('#f64747', 'ERROR'), ...args);
    }
    /**
     * @param {string[]} ...args - Anything you want to log with success as prefix
     */
    static success(...args) {
        log(Logger.create('#93faa5', 'SUCCESS'), ...args);
    }
    /**
     * @param {string} tag - The [PREFIX], it can be whatever you want
     * @param {string} hex - The HEX code
     */
    static custom(tag, hex, ...args) {
        log(Logger.create(hex, tag), ...args);
    }
    /**
     * @param {string} tag - The [PREFIX], it can be whatever you want
     * @param {string[]} ...args - Anything you want to log with the provided tag as prefix
     */
    static tag(tag, ...args) {
        log(Logger.create('#6bb9f0', tag), ...args);
    }
}
exports.Logger = Logger;
