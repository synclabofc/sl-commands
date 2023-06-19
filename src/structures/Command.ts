/* eslint-disable no-use-before-define */
/* eslint-disable no-redeclare */
import {
  SlashCommandSubcommandGroupBuilder,
  SlashCommandSubcommandsOnlyBuilder,
  SlashCommandSubcommandBuilder,
  ContextMenuCommandBuilder,
  ContextMenuCommandType,
  SlashCommandBuilder,
} from 'discord.js';

import CommandManager from '../managers/CommandManager';
import { CommandExecute, SLPermission } from '../types';
import { Validators } from '../util';
import { mix } from 'ts-mixer';

export class BaseCommand {
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
  readonly permissions: SLPermission[] = [];

  /**
   * Sets whether the command will be registered only in test servers or not
   *
   * @param enabled - If the test only feature is enabled
   */
  setTestOnly(enabled: boolean | undefined | null) {
    Validators.booleanCheck(enabled);

    Reflect.set(this, 'testOnly', !!enabled);

    return this;
  }

  /**
   * Sets whether the command will be usable only by its developers or not
   *
   * @param enabled - If the devs only feature is enabled
   */
  setDevsOnly(enabled: boolean | undefined | null) {
    Validators.booleanCheck(enabled);

    Reflect.set(this, 'devsOnly', !!enabled);

    return this;
  }

  /**
   * Sets the required permissions for using this commandHandler
   *
   * @param permissions - The permissions' names
   */
  setRequiredPermissions(...permissions: SLPermission[] | SLPermission[][]) {
    permissions = permissions.flat(2);
    Validators.permissionsCheck(permissions);

    Reflect.set(this, 'permissions', permissions);

    return this;
  }
}

@mix(BaseCommand, SlashCommandBuilder)
export class ChatInputCommand extends SlashCommandBuilder {
  /**
   * What is going to happen when someone use this command
   */
  readonly executeFunction: CommandExecute<'CHAT_INPUT'> = undefined!;

  /**
   * Sets what happens whenever the command is used by some user
   *
   * @param executeFunction - The function which will be executed
   */
  onExecute(executeFunction: CommandExecute<'CHAT_INPUT'>) {
    Validators.functionCheck(executeFunction);

    Reflect.set(this, 'executeFunction', executeFunction);

    CommandManager.registerCommand(this);

    return this;
  }

  /**
   * Adds a new subcommand group to this command
   *
   * @param input - A function that returns a subcommand group builder, or an already built builder
   */
  addSubcommandGroup(
    input:
      | SlashCommandSubcommandGroupBuilder
      | ((
          subcommandGroup: SlashCommandSubcommandGroupBuilder,
        ) => SlashCommandSubcommandGroupBuilder),
  ) {
    CommandManager.registerCommand(this);

    return super.addSubcommandGroup(
      input,
    ) as SlashCommandSubcommandsOnlyBuilder & SubCommandsOnly;
  }

  /**
   * Adds a new subcommand to this command
   *
   * @param input - A function that returns a subcommand builder, or an already built builder
   */
  addSubcommand(
    input:
      | SlashCommandSubcommandBuilder
      | ((
          subcommandGroup: SlashCommandSubcommandBuilder,
        ) => SlashCommandSubcommandBuilder),
  ) {
    CommandManager.registerCommand(this);

    return super.addSubcommand(input) as SlashCommandSubcommandsOnlyBuilder &
      SubCommandsOnly;
  }
}

@mix(BaseCommand, ContextMenuCommandBuilder)
export class MessageCommand {
  /**
   * What is going to happen when someone use this command
   */
  readonly executeFunction: CommandExecute<'MESSAGE'> = undefined!;

  /**
   * The type of this context menu command
   */
  readonly type: ContextMenuCommandType = 3;

  /**
   * Sets what happens whenever the command is used by some user
   *
   * @param executeFunction - The function which will be executed
   */
  onExecute(executeFunction: CommandExecute<'MESSAGE'>) {
    Validators.functionCheck(executeFunction);

    Reflect.set(this, 'executeFunction', executeFunction);

    CommandManager.registerCommand(this);

    return this;
  }

  /**
   * @deprecated
   */
  setType() {
    return this;
  }
}

@mix(BaseCommand, ContextMenuCommandBuilder)
export class UserCommand {
  /**
   * What is going to happen when someone use this command
   */
  readonly executeFunction: CommandExecute<'USER'> = undefined!;

  /**
   * The type of this context menu command
   */
  readonly type: ContextMenuCommandType = 2;

  /**
   * Sets what happens whenever the command is used by some user
   *
   * @param executeFunction - The function which will be executed
   */
  onExecute(executeFunction: CommandExecute<'USER'>) {
    Validators.functionCheck(executeFunction);

    Reflect.set(this, 'executeFunction', executeFunction);

    CommandManager.registerCommand(this);

    return this;
  }

  /**
   * @deprecated
   */
  setType() {
    return this;
  }
}

export class SubCommand {
  /**
   * The name of this sub-command
   */
  readonly name: string = undefined!;

  /**
   * The sub-command's main command name
   */
  readonly reference: string = undefined!;

  /**
   * What is going to happen when someone use this command
   */
  readonly executeFunction: CommandExecute<'SUB_COMMAND'> = undefined!;

  /**
   * Sets the name
   *
   * @param name - The name
   */
  public setName(name: string) {
    Validators.stringCheck(name);

    Reflect.set(this, 'name', name);

    return this;
  }

  /**
   * Sets the reference
   *
   * @param reference - The main command name
   */
  public setReference(reference: string) {
    Validators.stringCheck(reference);

    Reflect.set(this, 'reference', reference);

    return this;
  }

  /**
   * Sets what happens whenever the command is used by some user
   *
   * @param executeFunction - The function which will be executed
   */
  onExecute(executeFunction: CommandExecute<'CHAT_INPUT'>) {
    Validators.functionCheck(executeFunction);

    Reflect.set(this, 'executeFunction', executeFunction);

    CommandManager.registerCommand(this);

    return this;
  }
}

export interface SubCommandsOnly
  extends BaseCommand,
    Pick<ChatInputCommand, 'onExecute'> {}

export interface ChatInputCommand extends BaseCommand, SlashCommandBuilder {
  /**
   * Adds a new subcommand group to this command
   *
   * @param input - A function that returns a subcommand group builder, or an already built builder
   */
  addSubcommandGroup(
    input:
      | SlashCommandSubcommandGroupBuilder
      | ((
          subcommandGroup: SlashCommandSubcommandGroupBuilder,
        ) => SlashCommandSubcommandGroupBuilder),
  ): SlashCommandSubcommandsOnlyBuilder & SubCommandsOnly;

  /**
   * Adds a new subcommand to this command
   *
   * @param input - A function that returns a subcommand builder, or an already built builder
   */
  addSubcommand(
    input:
      | SlashCommandSubcommandBuilder
      | ((
          subcommandGroup: SlashCommandSubcommandBuilder,
        ) => SlashCommandSubcommandBuilder),
  ): SlashCommandSubcommandsOnlyBuilder & SubCommandsOnly;
}

export interface MessageCommand
  extends BaseCommand,
    ContextMenuCommandBuilder {}

export interface UserCommand extends BaseCommand, ContextMenuCommandBuilder {}

export type SLCommand = ChatInputCommand | MessageCommand | UserCommand;
