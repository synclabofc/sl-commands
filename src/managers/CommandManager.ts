import {
	SLChatInputCommand,
	SLMessageCommand,
	SLUserCommand,
	SLSubCommand,
	SLCommand,
} from '../structures'

import { Collection } from 'discord.js'

class CommandManager {
	readonly commands = new Collection<string, SLCommand>()
	readonly subcommands = new Collection<string, SLSubCommand>()

	registerCommand(command: SLCommand | SLSubCommand) {
		if (
			command instanceof SLChatInputCommand ||
			command instanceof SLMessageCommand ||
			command instanceof SLUserCommand
		) {
			this.commands.set(command.name, command)
		} else if (command instanceof SLSubCommand) {
			this.subcommands.set(command.reference + ' ' + command.name, command)
		}
	}
}

export = new CommandManager()
