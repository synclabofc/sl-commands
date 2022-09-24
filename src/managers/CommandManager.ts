import {
	ChatInputCommand,
	MessageCommand,
	UserCommand,
	SubCommand,
	SLCommand,
} from '../structures'

import { Collection } from 'discord.js'

class CommandManager {
	readonly commands = new Collection<string, SLCommand>()
	readonly subcommands = new Collection<string, SubCommand>()

	registerCommand(command: SLCommand | SubCommand) {
		if (
			command instanceof ChatInputCommand ||
			command instanceof MessageCommand ||
			command instanceof UserCommand
		) {
			this.commands.set(command.name, command)
		} else if (command instanceof SubCommand) {
			this.subcommands.set(command.reference + ' ' + command.name, command)
		}
	}
}

export = new CommandManager()
