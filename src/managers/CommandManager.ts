import { Collection } from 'discord.js';
import { SLCommand, SubCommand } from '../structures';

class CommandManager {
  readonly commands = new Collection<string, SLCommand>();
  readonly subcommands = new Collection<string, SubCommand>();

  registerCommand(command: SLCommand | SubCommand) {
    if (command instanceof SubCommand) {
      this.subcommands.set(`${command.reference} ${command.name}`, command);
    } else {
      this.commands.set(command.name, command);
    }
  }
}

export default new CommandManager();
