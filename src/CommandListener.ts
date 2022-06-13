import {
	CommandInteractionOptionResolver,
	InteractionReplyOptions,
	GuildMember,
	Collection,
	Message,
} from 'discord.js'

import { ICallbackObject, SLInteraction, SLPermission } from '../typings'

import getMessage from './MessageHandler'
import SLCommands, { Command } from '.'
import perms from '../permissions.json'

type MissingTuple = [string[], 'USER' | 'BOT']
type Language = keyof typeof perms

type SCollection = Collection<string, Command>
type CCollection = Collection<
	string,
	Command & { type: 'CHAT_INPUT' | 'MESSAGE' | 'USER' }
>

class CommandListener {
	setUp(handler: SLCommands, commands: CCollection, subcommands: SCollection) {
		handler.client.on('interactionCreate', async raw => {
			if (!raw.isCommand() && !raw.isContextMenu()) return

			const command = commands.get(raw.commandName)
			const interaction = raw as SLInteraction

			if (!command) return

			const { member, guild, user, channel, locale, options } = interaction
			const { callback, hasSub } = command

			let check = this.isAvailable(interaction, command, handler)

			if (check) {
				interaction.reply(check)
				return
			}

			let cbObject: Partial<ICallbackObject> = {
				client: handler.client,
				interaction,
				handler,
				locale,
				member,
				guild,
				user,
			}

			if (interaction.isCommand() && hasSub) {
				let { name } = options.data[0]

				const subCommand = subcommands.find(
					s => s.name === interaction.commandName + ' ' + name
				)

				if (subCommand) {
					cbObject = {
						options: options as OptRsvlr,
						channel: channel!,
						...cbObject,
					}
				}
			} else if (interaction.isUserContextMenu()) {
				cbObject = {
					target: interaction.targetMember as GuildMember,
					...cbObject,
				}
			} else if (interaction.isMessageContextMenu()) {
				cbObject = {
					target: interaction.targetMessage as Message,
					channel: channel!,
					...cbObject,
				}
			} else {
				cbObject = {
					options: options as OptRsvlr,
					channel: channel!,
					...cbObject,
				}
			}

			try {
				await callback(cbObject as ICallbackObject)
			} catch (err) {
				handler.emit('commandException', command.name ?? 'unknown', err)
			}
		})
	}

	isAvailable(
		{ member, guild }: SLInteraction,
		{ devsOnly, permissions = [] }: Command,
		{ language, botOwners = [] }: SLCommands
	) {
		let response: InteractionReplyOptions | null = null

		if (devsOnly && !botOwners.includes(member.id)) {
			response = {
				content: getMessage('DEV_ONLY', language),
				ephemeral: true,
			}
		}

		if (!response && permissions.length) {
			response = this.missingPermissions(
				guild.me!,
				member,
				permissions,
				language
			)
		}

		return response
	}

	missingPermissions(
		bot: GuildMember,
		member: GuildMember,
		required: SLPermission[],
		language: Language
	) {
		const getMissing = (m: GuildMember) =>
			m.permissions
				.missing(required, true)
				.map(e => perms[language][e as SLPermission])

		let missing: MissingTuple = [getMissing(member), 'USER']
		let adminString = perms[language]['ADMINISTRATOR']

		if (!missing[0].length) {
			missing = [getMissing(bot), 'BOT']
		}

		if (missing[0].includes(adminString)) {
			missing[0] = [adminString]
		}

		const strings = this.getStrings(missing[0])

		return missing[0].length
			? {
					content: getMessage(`PERMS_${missing[1]}`, language, {
						PERMISSIONS: `${strings}`,
						S: strings.s,
						A: strings.a,
					}),
					ephemeral: true,
			  }
			: null
	}

	getStrings(array: string[]) {
		return {
			s: array.length > 1 ? 's' : '',
			a: array.length > 1 ? 'ões' : 'ão',
			toString: () => `\`${array.join(', ')}\``,
		}
	}
}

type OptRsvlr = CommandInteractionOptionResolver
export = CommandListener
