import {
	Collection,
	CommandInteractionOptionResolver,
	GuildMember,
	Message,
} from 'discord.js'

import SLHandler, { SubCommand } from '.'
import { SLCommand } from './structures'
import { CommandExecute, CommandExecuteObject, SLInteraction } from './types'

type SCollection = Collection<string, SubCommand>
type CCollection = Collection<string, SLCommand>
type OptRsvlr = CommandInteractionOptionResolver

class CommandListener {
	constructor(
		private readonly handler: SLHandler,
		private readonly commands: CCollection,
		private readonly subcommands: SCollection
	) {
		this.handler.client.on('interactionCreate', int =>
			this.onInteractionCreate(<SLInteraction>int)
		)
	}

	private async onInteractionCreate(interaction: SLInteraction) {
		if (
			!interaction.isChatInputCommand() &&
			!interaction.isContextMenuCommand()
		) {
			return
		}

		const command = this.commands.get(interaction.commandName)

		if (!command) {
			return
		}

		const { member, guild, user, channel, locale, options } = interaction

		let check = await this.isAvailable(interaction, command)

		if (check) {
			if (check !== true) {
				interaction.reply(check)
			}

			return
		}

		let execute = <CommandExecute>command.executeFunction

		let cbObject: CommandExecuteObject = {
			client: this.handler.client,
			options: undefined!,
			channel: undefined!,
			guild: guild!,
			interaction,
			handler: this.handler,
			locale,
			member,
			user,
		}

		if (interaction.isChatInputCommand()) {
			const { commandName } = interaction

			const subCommand = this.subcommands.find(s =>
				options.data.some(
					({ name }) => s.name === name && s.reference === commandName
				)
			)

			if (subCommand) {
				execute = <CommandExecute>subCommand.executeFunction

				cbObject = {
					...cbObject,
					options: options as OptRsvlr,
					channel: channel!,
				}
			} else {
				cbObject = {
					...cbObject,
					options: options as OptRsvlr,
					channel: channel!,
				}
			}
		} else if (interaction.isUserContextMenuCommand()) {
			cbObject = {
				...cbObject,
				target: interaction.targetMember as GuildMember,
			}
		} else if (interaction.isMessageContextMenuCommand()) {
			cbObject = Object.assign(cbObject, {
				target: interaction.targetMessage as Message,
				channel: channel!,
			})
		}

		try {
			await execute(cbObject)
		} catch (err) {
			if (!(err instanceof Error)) {
				err = new Error(String(err))
			}

			this.handler.emit(
				'commandException',
				command.name ?? 'unknown',
				err as Error,
				interaction
			)
		}
	}

	private async isAvailable(
		interaction: SLInteraction,
		{ devsOnly }: SLCommand
	) {
		let { language, botDevsIds, messageHandler, useDefaultMessages } =
			this.handler

		let { user } = interaction

		if (!(devsOnly && !botDevsIds.includes(user.id))) {
			return
		}

		if (!useDefaultMessages) {
			this.handler.emit('commandDevsOnly', interaction)

			return true
		}

		return {
			content: messageHandler.getMessage('DevsOnly', language),
			ephemeral: true,
		}
	}
}

export = CommandListener
