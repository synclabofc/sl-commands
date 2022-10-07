import { SlashCommandSubcommandGroupBuilder, SlashCommandSubcommandsOnlyBuilder, SlashCommandSubcommandBuilder, ContextMenuCommandBuilder, ContextMenuCommandType, SlashCommandBuilder } from 'discord.js';
import { CommandExecute, SLPermission } from '../types';
export declare class BaseCommand {
    /**
     * If this command will be registered only in test servers
     */
    readonly testOnly?: boolean;
    /**
     * If this command will be usable only by its developers
     */
    readonly devsOnly?: boolean;
    /**
     * The required server permissions for using this command
     */
    readonly permissions: SLPermission[];
    /**
     * Sets whether the command will be registered only in test servers or not
     *
     * @param enabled - If the test only feature is enabled
     */
    setTestOnly(enabled: boolean | undefined | null): this;
    /**
     * Sets whether the command will be usable only by its developers or not
     *
     * @param enabled - If the devs only feature is enabled
     */
    setDevsOnly(enabled: boolean | undefined | null): this;
    /**
     * Sets the required permissions for using this commandHandler
     *
     * @param permissions - The permissions' names
     */
    setRequiredPermissions(...permissions: SLPermission[] | SLPermission[][]): this;
}
export declare class ChatInputCommand extends SlashCommandBuilder {
    /**
     * What is going to happen when someone use this command
     */
    readonly executeFunction: CommandExecute<'CHAT_INPUT'>;
    /**
     * Sets what happens whenever the command is used by some user
     *
     * @param executeFunction - The function which will be executed
     */
    onExecute(executeFunction: CommandExecute<'CHAT_INPUT'>): this;
}
export declare class MessageCommand {
    /**
     * What is going to happen when someone use this command
     */
    readonly executeFunction: CommandExecute<'MESSAGE'>;
    /**
     * The type of this context menu command
     */
    readonly type: ContextMenuCommandType;
    /**
     * Sets what happens whenever the command is used by some user
     *
     * @param executeFunction - The function which will be executed
     */
    onExecute(executeFunction: CommandExecute<'MESSAGE'>): this;
    /**
     * @deprecated
     */
    setType(): this;
}
export declare class UserCommand {
    /**
     * What is going to happen when someone use this command
     */
    readonly executeFunction: CommandExecute<'USER'>;
    /**
     * The type of this context menu command
     */
    readonly type: ContextMenuCommandType;
    /**
     * Sets what happens whenever the command is used by some user
     *
     * @param executeFunction - The function which will be executed
     */
    onExecute(executeFunction: CommandExecute<'USER'>): this;
    /**
     * @deprecated
     */
    setType(): this;
}
export declare class SubCommand {
    /**
     * The name of this sub-command
     */
    readonly name: string;
    /**
     * The sub-command's main command name
     */
    readonly reference: string;
    /**
     * What is going to happen when someone use this command
     */
    readonly executeFunction: CommandExecute<'SUB_COMMAND'>;
    /**
     * Sets the name
     *
     * @param name - The name
     */
    setName(name: string): this;
    /**
     * Sets the reference
     *
     * @param reference - The main command name
     */
    setReference(reference: string): this;
    /**
     * Sets what happens whenever the command is used by some user
     *
     * @param executeFunction - The function which will be executed
     */
    onExecute(executeFunction: CommandExecute<'CHAT_INPUT'>): this;
}
export interface SubCommandsOnly extends BaseCommand, Pick<ChatInputCommand, 'onExecute'> {
}
export interface ChatInputCommand extends BaseCommand, SlashCommandBuilder {
    /**
     * Adds a new subcommand group to this command
     *
     * @param input - A function that returns a subcommand group builder, or an already built builder
     */
    addSubcommandGroup(input: SlashCommandSubcommandGroupBuilder | ((subcommandGroup: SlashCommandSubcommandGroupBuilder) => SlashCommandSubcommandGroupBuilder)): SlashCommandSubcommandsOnlyBuilder & SubCommandsOnly;
    /**
     * Adds a new subcommand to this command
     *
     * @param input - A function that returns a subcommand builder, or an already built builder
     */
    addSubcommand(input: SlashCommandSubcommandBuilder | ((subcommandGroup: SlashCommandSubcommandBuilder) => SlashCommandSubcommandBuilder)): SlashCommandSubcommandsOnlyBuilder & SubCommandsOnly;
}
export interface MessageCommand extends BaseCommand, ContextMenuCommandBuilder {
}
export interface UserCommand extends BaseCommand, ContextMenuCommandBuilder {
}
export declare type SLCommand = ChatInputCommand | MessageCommand | UserCommand;
