"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubCommand = exports.UserCommand = exports.MessageCommand = exports.ChatInputCommand = exports.BaseCommand = void 0;
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const CommandManager_1 = tslib_1.__importDefault(require("../managers/CommandManager"));
const util_1 = require("../util");
const ts_mixer_1 = require("ts-mixer");
class BaseCommand {
    /**
     * If this command will be registered only in test servers
     */
    testOnly;
    /**
     * If this command will be usable only by its developers
     */
    devsOnly;
    /**
     * The required server permissions for using this command
     */
    permissions = [];
    /**
     * Sets whether the command will be registered only in test servers or not
     *
     * @param enabled - If the test only feature is enabled
     */
    setTestOnly(enabled) {
        util_1.Validators.booleanCheck(enabled);
        Reflect.set(this, 'testOnly', !!enabled);
        return this;
    }
    /**
     * Sets whether the command will be usable only by its developers or not
     *
     * @param enabled - If the devs only feature is enabled
     */
    setDevsOnly(enabled) {
        util_1.Validators.booleanCheck(enabled);
        Reflect.set(this, 'devsOnly', !!enabled);
        return this;
    }
    /**
     * Sets the required permissions for using this commandHandler
     *
     * @param permissions - The permissions' names
     */
    setRequiredPermissions(...permissions) {
        permissions = permissions.flat(2);
        util_1.Validators.permissionsCheck(permissions);
        Reflect.set(this, 'permissions', permissions);
        return this;
    }
}
exports.BaseCommand = BaseCommand;
let ChatInputCommand = class ChatInputCommand extends discord_js_1.SlashCommandBuilder {
    /**
     * What is going to happen when someone use this command
     */
    executeFunction = undefined;
    /**
     * Sets what happens whenever the command is used by some user
     *
     * @param executeFunction - The function which will be executed
     */
    onExecute(executeFunction) {
        util_1.Validators.functionCheck(executeFunction);
        Reflect.set(this, 'executeFunction', executeFunction);
        CommandManager_1.default.registerCommand(this);
        return this;
    }
    /**
     * Adds a new subcommand group to this command
     *
     * @param input - A function that returns a subcommand group builder, or an already built builder
     */
    addSubcommandGroup(input) {
        CommandManager_1.default.registerCommand(this);
        return super.addSubcommandGroup(input);
    }
    /**
     * Adds a new subcommand to this command
     *
     * @param input - A function that returns a subcommand builder, or an already built builder
     */
    addSubcommand(input) {
        CommandManager_1.default.registerCommand(this);
        return super.addSubcommand(input);
    }
};
ChatInputCommand = tslib_1.__decorate([
    (0, ts_mixer_1.mix)(BaseCommand, discord_js_1.SlashCommandBuilder)
], ChatInputCommand);
exports.ChatInputCommand = ChatInputCommand;
let MessageCommand = class MessageCommand {
    /**
     * What is going to happen when someone use this command
     */
    executeFunction = undefined;
    /**
     * The type of this context menu command
     */
    type = 3;
    /**
     * Sets what happens whenever the command is used by some user
     *
     * @param executeFunction - The function which will be executed
     */
    onExecute(executeFunction) {
        util_1.Validators.functionCheck(executeFunction);
        Reflect.set(this, 'executeFunction', executeFunction);
        CommandManager_1.default.registerCommand(this);
        return this;
    }
    /**
     * @deprecated
     */
    setType() {
        return this;
    }
};
MessageCommand = tslib_1.__decorate([
    (0, ts_mixer_1.mix)(BaseCommand, discord_js_1.ContextMenuCommandBuilder)
], MessageCommand);
exports.MessageCommand = MessageCommand;
let UserCommand = class UserCommand {
    /**
     * What is going to happen when someone use this command
     */
    executeFunction = undefined;
    /**
     * The type of this context menu command
     */
    type = 2;
    /**
     * Sets what happens whenever the command is used by some user
     *
     * @param executeFunction - The function which will be executed
     */
    onExecute(executeFunction) {
        util_1.Validators.functionCheck(executeFunction);
        Reflect.set(this, 'executeFunction', executeFunction);
        CommandManager_1.default.registerCommand(this);
        return this;
    }
    /**
     * @deprecated
     */
    setType() {
        return this;
    }
};
UserCommand = tslib_1.__decorate([
    (0, ts_mixer_1.mix)(BaseCommand, discord_js_1.ContextMenuCommandBuilder)
], UserCommand);
exports.UserCommand = UserCommand;
class SubCommand {
    /**
     * The name of this sub-command
     */
    name = undefined;
    /**
     * The sub-command's main command name
     */
    reference = undefined;
    /**
     * What is going to happen when someone use this command
     */
    executeFunction = undefined;
    /**
     * Sets the name
     *
     * @param name - The name
     */
    setName(name) {
        util_1.Validators.stringCheck(name);
        Reflect.set(this, 'name', name);
        return this;
    }
    /**
     * Sets the reference
     *
     * @param reference - The main command name
     */
    setReference(reference) {
        util_1.Validators.stringCheck(reference);
        Reflect.set(this, 'reference', reference);
        return this;
    }
    /**
     * Sets what happens whenever the command is used by some user
     *
     * @param executeFunction - The function which will be executed
     */
    onExecute(executeFunction) {
        util_1.Validators.functionCheck(executeFunction);
        Reflect.set(this, 'executeFunction', executeFunction);
        CommandManager_1.default.registerCommand(this);
        return this;
    }
}
exports.SubCommand = SubCommand;
