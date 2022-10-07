"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validators = void 0;
const tslib_1 = require("tslib");
const permissions_json_1 = tslib_1.__importDefault(require("../permissions.json"));
const shapeshift_1 = require("@sapphire/shapeshift");
const messages_json_1 = tslib_1.__importDefault(require("../messages.json"));
class Validators {
    static stringCheck(value, errorMessage = `Expected a string, got ${value} instead.`, error = TypeError, allowEmpty = true) {
        if (typeof value !== 'string') {
            throw new error(errorMessage);
        }
        if (!allowEmpty && value.length === 0) {
            throw new error(errorMessage);
        }
    }
    static booleanCheck(value, errorMessage = `Expected a boolean, got ${value} instead.`, error = TypeError) {
        if (typeof value !== 'boolean') {
            throw new error(errorMessage);
        }
    }
    static permissionsCheck(value, errorMessage = `Expected a permission array, got ${value} instead.`, error = SyntaxError, allowEmpty = true) {
        if (!Array.isArray(value)) {
            throw new error(errorMessage);
        }
        if (!allowEmpty && value.length === 0) {
            throw new error(errorMessage);
        }
        if (!value.every(e => Object.keys(permissions_json_1.default['en-us']).includes(e))) {
            throw new error(errorMessage);
        }
    }
    static functionCheck(value, errorMessage = `Expected a function, got a ${value} instead.`, error = TypeError) {
        if (typeof value !== 'function') {
            throw new error(errorMessage);
        }
    }
    static handlerOptionsCheck(value) {
        try {
            shapeshift_1.s.object({
                messagesPath: shapeshift_1.s.string.optional,
                featuresDir: shapeshift_1.s.string.optional,
                commandsDir: shapeshift_1.s.string.optional,
                eventsDir: shapeshift_1.s.string.optional,
                botToken: shapeshift_1.s.string,
                testServersIds: shapeshift_1.s.string.or(shapeshift_1.s.array(shapeshift_1.s.string)).optional,
                botDevsIds: shapeshift_1.s.string.or(shapeshift_1.s.array(shapeshift_1.s.string)).optional,
                language: shapeshift_1.s.string.regex(new RegExp(`${Object.keys(permissions_json_1.default).join('|')}|auto`)).optional,
                clientOptions: shapeshift_1.s.object({}).passthrough.optional,
                dbOptions: shapeshift_1.s.object({}).passthrough.optional,
                showWarns: shapeshift_1.s.boolean.optional,
                testOnly: shapeshift_1.s.boolean.optional,
                mongoUri: shapeshift_1.s.string.optional,
            }).parse(value);
        }
        catch {
            throw new (class SLHandlerOptionsError extends Error {
            })(`SLCommands > Invalid provided handler options.`);
        }
    }
    static messagesCheck(value) {
        try {
            shapeshift_1.s.object(Object.fromEntries(Object.entries(messages_json_1.default).map(([key, value]) => [
                key,
                shapeshift_1.s.object({
                    'pt-br': shapeshift_1.s.string.optional,
                    'en-us': shapeshift_1.s.string.optional,
                }),
            ]))).parse(value);
        }
        catch {
            throw new (class SLHandlerOptionsError extends Error {
            })(`SLCommands > Invalid provided messages json.`);
        }
    }
}
exports.Validators = Validators;
