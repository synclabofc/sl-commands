import { Collection } from 'discord.js';
import { SLCommand } from './structures';
import SLHandler, { SubCommand } from '.';
declare type SCollection = Collection<string, SubCommand>;
declare type CCollection = Collection<string, SLCommand>;
declare class CommandListener {
    handler: SLHandler;
    constructor(handler: SLHandler, commands: CCollection, subcommands: SCollection);
    private isAvailable;
}
export = CommandListener;
