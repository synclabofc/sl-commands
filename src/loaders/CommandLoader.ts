import { Collection, PermissionFlagsBits } from 'discord.js';
import { existsSync } from 'fs';
import SLHandler from '..';
import CommandListener from '../CommandListener';
import CommandManager from '../managers/CommandManager';
import { SLCommand, SubCommand } from '../structures';
import { FileManager, Logger } from '../util';

class CommandHandler {
  commands = new Collection<string, SLCommand>();
  subcommands = new Collection<string, SubCommand>();

  constructor(handler: SLHandler, dir: string) {
    if (!dir) return;

    if (!existsSync(dir)) {
      Logger.error(`The directory '${dir}' does not exists.`);
      return;
    }

    try {
      new CommandListener(handler, this.commands, this.subcommands); // eslint-disable-line no-new
      this.load(handler, dir);
    } catch (e) {
      Logger.error(`An error occurred while loading commands.\n`, e);
    }
  }

  private async load(handler: SLHandler, dir: string) {
    const commandFiles = FileManager.getAllFiles(dir);

    for (const file of commandFiles) {
      FileManager.import(file);
    }

    const { commands, subcommands } = CommandManager;

    this.commands = commands.mapValues((command) => {
      if (
        !command.executeFunction &&
        !subcommands.find((s) => s.reference === command.name)
      ) {
        throw new Error(
          'SLCommands > Commands without a subCommand must have an execute function.',
        );
      }

      if (command.testOnly === undefined) {
        command.setTestOnly(handler.testOnly);
      }

      if (command.permissions.length) {
        command
          .setDMPermission(false)
          .setDefaultMemberPermissions(
            BigInt(
              command.permissions
                .map((Permission) => PermissionFlagsBits[Permission])
                .reduce((a, b) => a | b),
            ),
          );
      }

      return command;
    });

    this.subcommands = subcommands;

    Logger.tag('COMMANDS', `Loaded ${commandFiles.length} command files.`);

    handler.client.once('ready', () => this.registerCommands(handler));
  }

  private async registerCommands(handler: SLHandler) {
    const register = this.commands.toJSON();

    const global = register.filter((c) => !c.testOnly);
    const test = register.filter((c) => c.testOnly);

    handler.client.application?.commands.set(global);

    for (const id of handler.testServersIds) {
      (await handler.client.guilds.fetch(id))?.commands.set(test);
    }
  }
}

export = CommandHandler;
