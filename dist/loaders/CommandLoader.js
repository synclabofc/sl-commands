"use strict";
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const CommandManager_1 = tslib_1.__importDefault(require("../managers/CommandManager"));
const CommandListener_1 = tslib_1.__importDefault(require("../CommandListener"));
const util_1 = require("../util");
const fs_1 = require("fs");
class CommandHandler {
    commands = new discord_js_1.Collection();
    subcommands = new discord_js_1.Collection();
    constructor(handler, dir) {
        if (!dir)
            return;
        if (!(0, fs_1.existsSync)(dir)) {
            util_1.Logger.error(`The directory '${dir}' does not exists.`);
            return;
        }
        try {
            this.load(handler, dir);
            new CommandListener_1.default(handler, this.commands, this.subcommands);
        }
        catch (e) {
            util_1.Logger.error(`An error occurred while loading commands.\n`, e);
        }
    }
    async load(handler, dir) {
        const commandFiles = util_1.FileManager.getAllFiles(dir);
        for (const file of commandFiles) {
            util_1.FileManager.import(file);
        }
        const { commands, subcommands } = CommandManager_1.default;
        this.commands = commands.mapValues(command => {
            if (!command.executeFunction &&
                !subcommands.find(s => s.reference === command.name)) {
                throw new Error('SLCommands > Commands without a subCommand must have an execute function.');
            }
            if (command.testOnly === undefined) {
                command.setTestOnly(handler.testOnly);
            }
            if (command.permissions.length) {
                command
                    .setDMPermission(false)
                    .setDefaultMemberPermissions(BigInt(command.permissions
                    .map(Permission => discord_js_1.PermissionFlagsBits[Permission])
                    .reduce((a, b) => a | b)));
            }
            return command;
        });
        this.subcommands = subcommands;
        util_1.Logger.tag('COMMANDS', `Loaded ${commandFiles.length} command files.`);
        handler.client.once('ready', () => this.registerCommands(handler));
    }
    async registerCommands(handler) {
        const register = this.commands.toJSON();
        const global = register.filter(c => !c.testOnly), test = register.filter(c => c.testOnly);
        handler.client.application?.commands.set(global);
        for (const id of handler.testServersIds) {
            ;
            (await handler.client.guilds.fetch(id))?.commands.set(test);
        }
    }
}
module.exports = CommandHandler;
