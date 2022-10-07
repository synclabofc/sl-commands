import { Collection } from 'discord.js';
import { SubCommand, SLCommand } from '../structures';
import SLHandler from '..';
declare class CommandHandler {
    commands: Collection<string, SLCommand>;
    subcommands: Collection<string, SubCommand>;
    constructor(handler: SLHandler, dir: string);
    private load;
    private registerCommands;
}
export = CommandHandler;
