import { SubCommand, SLCommand } from '../structures';
import { Collection } from 'discord.js';
declare class CommandManager {
    readonly commands: Collection<string, SLCommand>;
    readonly subcommands: Collection<string, SubCommand>;
    registerCommand(command: SLCommand | SubCommand): void;
}
declare const _default: CommandManager;
export = _default;
