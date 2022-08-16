import {
	SLChatInputCommand,
	SLMessageCommand,
	SLUserCommand,
	SLSubCommand,
	SLCommand,
} from '../structures'

import CommandListener from '../CommandListener'
import { FileManager } from '../util/files'
import { Collection } from 'discord.js'
import { Logger } from '../util/logger'
import { existsSync } from 'fs'
import SLHandler from '..'

class CommandHandler {
	private _subcommands = new Collection<string, SLSubCommand>()
	private _commands = new Collection<string, SLCommand>()

	constructor(handler: SLHandler, dir: string) {
		if (!dir) return

		if (!existsSync(dir)) {
			Logger.error(`The directory '${dir}' does not exists.`)
			return
		}

		try {
			this.load(handler, dir)
			new CommandListener().setUp(handler, this._commands, this._subcommands)
		} catch (e) {
			Logger.error(`Ocurred an error while loading commands.\n`, e)
		}
	}

	private async load(handler: SLHandler, dir: string) {
		const commandFiles = FileManager.getAllFiles(dir)

		for (const file of commandFiles) {
			const command: SLCommand = FileManager.import(file)
			if (
				!command ||
				![
					SLSubCommand,
					SLUserCommand,
					SLMessageCommand,
					SLChatInputCommand,
				].some(c => command instanceof c)
			) {
				continue
			}

			if (command instanceof SLSubCommand) {
				this._subcommands.set(command.reference + ' ' + command.name, command)
			} else {
				if (!('testOnly' in command)) {
					Reflect.set(command, 'testOnly', handler.testOnly)
				}

				this._commands.set(command.name, command)
			}
		}

		Logger.tag(
			'COMMANDS',
			`Loaded ${this.commands.size + this.subcommands.size} commands.`
		)

		handler.client.once('ready', () => this.registerCommands(handler))
	}

	private async registerCommands(handler: SLHandler) {
		const register = this.commands.toJSON()

		const global = register.filter(c => !c.testOnly),
			test = register.filter(c => c.testOnly)

		handler.client.application?.commands.set(global)

		for (const id of handler.testServersIds)
			(await handler.client.guilds.fetch(id))?.commands.set(test)
	}

	/** The commands collection */
	public get commands() {
		return this._commands
	}

	/** The subcommands collection */
	public get subcommands() {
		return this._subcommands
	}
}

export = CommandHandler
