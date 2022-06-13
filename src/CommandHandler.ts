import { ApplicationCommandDataResolvable, Collection } from 'discord.js'
import { existsSync } from 'fs'
import { glob } from 'glob'

import CommandListener from './CommandListener'
import SLCommands, { Command } from '.'
import { ICommand } from '../typings'

class CommandHandler {
	private _subcommands = new Collection<string, Command>()
	private _commands = new Collection<string, Command>()

	constructor(handler: SLCommands, dir: string) {
		if (!dir) return

		if (!existsSync(dir)) {
			handler.logger.error(`The directory '${dir}' does not exists.`)
			return
		}

		try {
			this.load(handler, dir)
			new CommandListener().setUp(
				handler,
				this._commands as Collection<
					string,
					Command & { type: 'CHAT_INPUT' | 'MESSAGE' | 'USER' }
				>,
				this._subcommands
			)
		} catch (e) {
			handler.logger.error(`Ocurred an error while loading commands.\n`, e)
		}
	}

	private async load(handler: SLCommands, dir: string) {
		dir += '/**/*{.ts,.js}'
		const commandFiles = glob.sync(dir, { absolute: true })

		for (const file of commandFiles) {
			const command: Command = handler.import(file)
			if (!command || !(command instanceof Command)) {
				continue
			}

			if (command.type === 'SUB_COMMAND') {
				this._subcommands.set(command.reference + ' ' + command.name, command)
			} else {
				if (!('testOnly' in command)) {
					command.testOnly = handler.testOnly
				}

				this._commands.set(command.name, command)
			}
		}

		handler.logger.tag(
			'COMMANDS',
			`Loaded ${this.commands.size + this.subcommands.size} commands.`
		)

		handler.client.once('ready', () => this.registerCommands(handler))
	}

	private async registerCommands(handler: SLCommands) {
		const register = this.commandsArray as (ApplicationCommandDataResolvable &
			ICommand)[]

		const global = register.filter(c => !c.testOnly),
			test = register.filter(c => c.testOnly)

		handler.client.application?.commands.set(global)

		for (const id of handler.testServers)
			(await handler.client.guilds.fetch(id))?.commands.set(test)
	}

	/** @returns The commands collection */
	public get commands() {
		return this._commands
	}

	/** @returns The subcommands collection */
	public get subcommands() {
		return this._subcommands
	}

	/** @returns The commands array */
	public get commandsArray() {
		return Array.from(this._commands.values())
	}

	/** @returns The subcommands array */
	public get subcommandsArray() {
		return Array.from(this._subcommands.values())
	}
}

export = CommandHandler
