import {
	CommandInteractionOptionResolver,
	GuildMember,
	Collection,
	Message,
} from 'discord.js'

import {
	CommandCallbackObject,
	CommandCallback,
	SLInteraction,
	SLPermission,
	SLLanguages,
} from './types'

import SLHandler, { SLCommand, SLSubCommand } from '.'
import perms from './permissions.json'

type SCollection = Collection<string, SLSubCommand>
type CCollection = Collection<string, SLCommand>
type OptRsvlr = CommandInteractionOptionResolver
type MissingTuple = [string[], 'User' | 'Bot']

class CommandListener {
	constructor(
		public handler: SLHandler,
		commands: CCollection,
		subcommands: SCollection
	) {
		handler.client.on('interactionCreate', async raw => {
			if (!raw.isChatInputCommand() && !raw.isContextMenuCommand()) return

			const command = commands.get(raw.commandName)
			const interaction = raw as SLInteraction

			if (!command) return

			const { member, guild, user, channel, locale, options } = interaction

			let check = await this.isAvailable(interaction, command)

			if (check) {
				if (check !== true) {
					interaction.reply(check)
				}

				return
			}

			let cbObject: CommandCallbackObject = {
				client: handler.client,
				options: undefined!,
				channel: undefined!,
				guild: guild!,
				interaction,
				handler,
				locale,
				member,
				user,
			}

			if (interaction.isChatInputCommand()) {
				const subCommand = subcommands.find(s =>
					options.data.some(
						({ name }) => s.name === interaction.commandName + ' ' + name
					)
				)

				if (subCommand) {
					cbObject = Object.assign(cbObject, {
						options: options as OptRsvlr,
						channel: channel!,
					})
				}
			} else if (interaction.isUserContextMenuCommand()) {
				cbObject = Object.assign(cbObject, {
					target: interaction.targetMember as GuildMember,
				})
			} else if (interaction.isMessageContextMenuCommand()) {
				cbObject = Object.assign(cbObject, {
					target: interaction.targetMessage as Message,
					channel: channel!,
				})
			} else {
				cbObject = Object.assign(cbObject, {
					options: options as OptRsvlr,
					channel: channel!,
				})
			}

			try {
				const callback = command.callback as CommandCallback

				await callback(cbObject)
			} catch (err) {
				if (!(err instanceof Error)) {
					err = new Error(String(err))
				}

				handler.emit(
					'commandException',
					command.name ?? 'unknown',
					err as Error,
					interaction
				)
			}
		})
	}

	private async isAvailable(
		interaction: SLInteraction,
		{ devsOnly, permissions }: SLCommand
	) {
		let { language, botDevsIds, messageHandler, useDefaultMessages } =
			this.handler

		let { user, member, guild, commandName } = interaction

		if (devsOnly && !botDevsIds.includes(user.id)) {
			if (!useDefaultMessages) {
				this.handler.emit('commandDevsOnly', interaction)

				return true
			}

			return {
				content: messageHandler.getMessage('DevsOnly', language),
				ephemeral: true,
			}
		}

		if (guild && permissions.length) {
			return this.missingPermissions(
				await guild.members.fetchMe(),
				member,
				permissions,
				interaction,
				language
			)
		}

		return
	}

	private missingPermissions(
		bot: GuildMember,
		member: GuildMember,
		required: SLPermission[],
		interaction: SLInteraction,
		language: SLLanguages
	) {
		const getMissing = (m: GuildMember) =>
			m.permissions
				.missing(required, true)
				.map(e => perms[language][e as SLPermission])

		let missing: MissingTuple = [getMissing(member), 'User']
		let adminString = perms[language]['Administrator']

		if (!missing[0].length) {
			missing = [getMissing(bot), 'Bot']
		}

		if (missing[0].includes(adminString)) {
			missing[0] = [adminString]
		}

		if (!missing[0].length) {
			return
		}

		if (!this.handler.useDefaultMessages) {
			this.handler.emit('commandMissingPermissions', interaction, {
				translatedPermissions: missing[0],
				missingPermissions: missing[0].map(
					e => Object.entries(perms[language]).find(([k, v]) => v === e)![0]
				) as SLPermission[],
				member: missing[1] === 'User' ? member : undefined,
				bot: missing[1] === 'Bot' ? bot : undefined,
			})

			return true
		}

		const strings = this.getStrings(missing[0])

		return {
			content: this.handler.messageHandler.getMessage(
				`${missing[1]}Perms`,
				language,
				{
					PERMISSIONS: `${strings}`,
					S: strings.s,
					A: strings.a,
				}
			),
			ephemeral: true,
		}
	}

	private getStrings(array: string[]) {
		return {
			s: array.length > 1 ? 's' : '',
			a: array.length > 1 ? 'ões' : 'ão',
			toString: () => `\`${array.join(', ')}\``,
		}
	}
}

export = CommandListener
