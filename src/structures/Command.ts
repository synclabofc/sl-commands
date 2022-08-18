import {
	ContextMenuCommandBuilder,
	ContextMenuCommandType,
	SlashCommandBuilder,
} from 'discord.js'

import { CommandCallback, SLPermission } from '../types'
import { Validators } from '../util'
import { mix } from 'ts-mixer'

export class SLBaseCommand {
	/**
	 * If this command will be registered only in test servers
	 */
	readonly testOnly?: boolean

	/**
	 * If this command will be usable only by its developers
	 */
	readonly devsOnly?: boolean

	/**
	 * The required server permissions for using this command
	 */
	readonly permissions: SLPermission[] = []

	/**
	 * Sets whether the command will be registered only in test servers or not
	 *
	 * @param enabled - If the test only feature is enabled
	 */
	setTestOnly(enabled: boolean | undefined | null) {
		Validators.booleanCheck(enabled)

		Reflect.set(this, 'testOnly', !!enabled)

		return this
	}

	/**
	 * Sets whether the command will be usable only by its developers or not
	 *
	 * @param enabled - If the devs only feature is enabled
	 */
	setDevsOnly(enabled: boolean | undefined | null) {
		Validators.booleanCheck(enabled)

		Reflect.set(this, 'devsOnly', !!enabled)

		return this
	}

	/**
	 * Sets the required permissions for using this command
	 *
	 * @param permissions - The permissions' names
	 */
	setRequiredPermissions(...permissions: SLPermission[] | SLPermission[][]) {
		permissions = permissions.flat(2)
		Validators.permissionsCheck(permissions)

		Reflect.set(this, 'permissions', permissions)

		return this
	}
}

@mix(SLBaseCommand, SlashCommandBuilder)
export class SLChatInputCommand {
	/**
	 * What is going to happen when someone use this command
	 */
	readonly callback: CommandCallback<'CHAT_INPUT'> = undefined!

	/**
	 * Sets what happens whenever the command is used by some user
	 *
	 * @param callback - The function which will be executed
	 */
	onExecute(callback: CommandCallback<'CHAT_INPUT'>) {
		Validators.functionCheck(callback)

		Reflect.set(this, 'callback', callback)

		return this
	}
}

@mix(SLBaseCommand, ContextMenuCommandBuilder)
export class SLMessageCommand {
	/**
	 * What is going to happen when someone use this command
	 */
	readonly callback: CommandCallback<'MESSAGE'> = undefined!

	/**
	 * The type of this context menu command
	 */
	readonly type: ContextMenuCommandType = 3

	/**
	 * Sets what happens whenever the command is used by some user
	 *
	 * @param callback - The function which will be executed
	 */
	onExecute(callback: CommandCallback<'MESSAGE'>) {
		Validators.functionCheck(callback)

		Reflect.set(this, 'callback', callback)

		return this
	}

	/**
	 * @deprecated
	 */
	setType() {
		return this
	}
}

@mix(SLBaseCommand, ContextMenuCommandBuilder)
export class SLUserCommand {
	/**
	 * What is going to happen when someone use this command
	 */
	readonly callback: CommandCallback<'USER'> = undefined!

	/**
	 * The type of this context menu command
	 */
	readonly type: ContextMenuCommandType = 2

	/**
	 * Sets what happens whenever the command is used by some user
	 *
	 * @param callback - The function which will be executed
	 */
	onExecute(callback: CommandCallback<'USER'>) {
		Validators.functionCheck(callback)

		Reflect.set(this, 'callback', callback)

		return this
	}

	/**
	 * @deprecated
	 */
	setType() {
		return this
	}
}

export class SLSubCommand {
	/**
	 * The name of this sub-command
	 */
	readonly name: string = undefined!

	/**
	 * The sub-command's main command name
	 */
	readonly reference: string = undefined!

	/**
	 * What is going to happen when someone use this command
	 */
	readonly callback: CommandCallback<'SUB_COMMAND'> = undefined!

	/**
	 * Sets the name
	 *
	 * @param name - The name
	 */
	public setName(name: string) {
		Validators.stringCheck(name)

		Reflect.set(this, 'name', name)

		return this
	}

	/**
	 * Sets the reference
	 *
	 * @param reference - The main command name
	 */
	public setReference(reference: string) {
		Validators.stringCheck(reference)

		Reflect.set(this, 'reference', reference)

		return this
	}

	/**
	 * Sets what happens whenever the command is used by some user
	 *
	 * @param callback - The function which will be executed
	 */
	onExecute(callback: CommandCallback<'CHAT_INPUT'>) {
		Validators.functionCheck(callback)

		Reflect.set(this, 'callback', callback)

		return this
	}
}

export interface SLChatInputCommand
	extends SLBaseCommand,
		SlashCommandBuilder {}

export interface SLMessageCommand
	extends SLBaseCommand,
		ContextMenuCommandBuilder {}

export interface SLUserCommand
	extends SLBaseCommand,
		ContextMenuCommandBuilder {}

export type SLCommand = SLChatInputCommand | SLMessageCommand | SLUserCommand
