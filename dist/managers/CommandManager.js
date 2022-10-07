"use strict";
const structures_1 = require("../structures");
const discord_js_1 = require("discord.js");
class CommandManager {
    commands = new discord_js_1.Collection();
    subcommands = new discord_js_1.Collection();
    registerCommand(command) {
        if (command instanceof structures_1.ChatInputCommand ||
            command instanceof structures_1.MessageCommand ||
            command instanceof structures_1.UserCommand) {
            this.commands.set(command.name, command);
        }
        else if (command instanceof structures_1.SubCommand) {
            this.subcommands.set(command.reference + ' ' + command.name, command);
        }
    }
}
module.exports = new CommandManager();
