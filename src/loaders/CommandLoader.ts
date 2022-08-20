import { Collection, PermissionFlagsBits } from 'discord.js'
import { SLSubCommand, SLCommand } from '../structures'
import CommandManager from '../managers/CommandManager'
import CommandListener from '../CommandListener'
import { FileManager, Logger } from '../util'
import { existsSync } from 'fs'
import SLHandler from '..'

class CommandHandler {
	private _commands = new Collection<string, SLCommand>()
	private _subcommands = new Collection<string, SLSubCommand>()

	constructor(handler: SLHandler, dir: string) {
		if (!dir) return

		if (!existsSync(dir)) {
			Logger.error(`The directory '${dir}' does not exists.`)
			return
		}

		try {
			this.load(handler, dir)
			new CommandListener(handler, this._commands, this._subcommands)
		} catch (e) {
			Logger.error(`An error occurred while loading commands.\n`, e)
		}
	}

	private async load(handler: SLHandler, dir: string) {
		const commandFiles = FileManager.getAllFiles(dir)

		for (const file of commandFiles) {
			FileManager.import(file)
		}

		const { commands, subcommands } = CommandManager

		commands.map(command => {
			if (
				!command.executeFunction &&
				!subcommands.find(s => s.reference === command.name)
			) {
				throw new Error(
					'SLCommands > Commands without a subCommand must have an execute function.'
				)
			}

			if (!('testOnly' in command)) {
				Reflect.set(command, 'testOnly', handler.testOnly)
			}

			if (command.permissions.length) {
				command
					.setDMPermission(false)
					.setDefaultMemberPermissions(
						BigInt(
							command.permissions
								.map(Permission => PermissionFlagsBits[Permission])
								.reduce((a, b) => a | b)
						)
					)
			}
		})

		this._commands = commands
		this._subcommands = subcommands

		Logger.tag(
			'COMMANDS',
			`Loaded ${commandFiles.length} command files.`
		)

		handler.client.once('ready', () => this.registerCommands(handler))
	}

	private async registerCommands(handler: SLHandler) {
		const register = this._commands.toJSON()

		const global = register.filter(c => !c.testOnly),
			test = register.filter(c => c.testOnly)

		handler.client.application?.commands.set(global)

		for (const id of handler.testServersIds) {
			;(await handler.client.guilds.fetch(id))?.commands.set(test)
		}
	}
}

export = CommandHandler
