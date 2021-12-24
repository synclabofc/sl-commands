import {
	CommandInteractionOptionResolver,
	MessageContextMenuInteraction,
	UserContextMenuInteraction,
	InteractionReplyOptions,
	GuildMember,
	Collection,
	Message,
	Guild,
} from 'discord.js'

import {
	ECommandInteraction,
	EContextInteraction,
	ChatInputCallback,
	MessageCallback,
	UserCallback,
	PermString,
	SubType,
} from '../typings'

import SLCommands, { SLEmbed, Command } from '.'
import perms from '../permissions.json'

type ICollection = Collection<string, Command>

class HandlerUtils {
	setUp(handler: SLCommands, commands: ICollection, subcommands: ICollection) {
		let { client, botOwners } = handler

		client.on('interactionCreate', async inter => {
			if (!inter.isCommand() && !inter.isContextMenu()) return

			let command = commands.get(inter.commandName)
			if (!command) return

			let int: ECommandInteraction | EContextInteraction<'MESSAGE' | 'USER'>
			let { permissions, devsOnly, callback, type, hasSub } = command

			if (type === 'CHAT_INPUT') int = inter as ECommandInteraction
			else if (type === 'USER') int = inter as EContextInteraction<'USER'>
			else int = inter as EContextInteraction<'MESSAGE'>

			let { member, guild } = int

			let verified = this.verify(
				permissions,
				botOwners,
				devsOnly,
				member,
				guild
			)

			if (verified) {
				int.reply(verified)
				return
			}

			if (type == 'CHAT_INPUT') {
				if (!int.isCommand()) return

				let subName = int.options.getSubcommand()
				let subCommand = subcommands.find(
					s => s.name === subName && s.reference === int.commandName
				)

				if (hasSub && subCommand) {
					let { callback } = subCommand as SubType

					await callback({
						options: int.options as OptRsvlr,
						interaction: int,
						handler,
						client,
					})
					return
				}
			} else if (!int.isContextMenu()) return

			try {
				if (type === 'CHAT_INPUT') {
					callback = callback as ChatInputCallback
					await callback({
						options: int.options as CommandInteractionOptionResolver,
						interaction: int as ECommandInteraction,
						handler,
						client,
					})
				} else if (type === 'MESSAGE') {
					callback = callback as MessageCallback
					await callback({
						target: (int as MessageContextMenuInteraction)
							.targetMessage as Message,
						interaction: int as EContextInteraction<'MESSAGE'>,
						handler,
						client,
					})
				} else {
					callback = callback as UserCallback
					await callback({
						target: (int as UserContextMenuInteraction).targetUser,
						interaction: int as EContextInteraction<'USER'>,
						handler,
						client,
					})
				}
			} catch (e) {
				handler.logger.error(`Error at ${int.commandName}:\n`, e)
				setTimeout(() => {
					int[int.replied ? 'followUp' : 'reply']({
						embeds: [new SLEmbed().setError(`Ocorreu um erro inesperado.`)],
					})
				}, 500)
			}
		})
	}

	verify(
		reqPerms: PermString[] = [],
		botOwners: string[] = [],
		devsOnly: boolean = false,
		target: GuildMember,
		guild: Guild
	): InteractionReplyOptions | null {
		if (devsOnly && !botOwners.includes(target.id)) {
			return {
				content: 'Este comando está reservado para os meus desenvolvedores.',
				ephemeral: true,
			}
		}

		if (reqPerms.length) {
			let missMe = missing(guild.me!, reqPerms)
			let missIt = missing(target, reqPerms)
			let str

			if (missIt.length) {
				str = strs(missIt)

				return {
					content: `Você precisa da${str.s} permiss${str.a} ${str} para utilizar este comando.`,
					ephemeral: true,
				}
			}

			if (missMe.length) {
				str = strs(missMe)

				return {
					content: `Eu preciso da${str.s} permiss${str.a} ${str} para executar este comando.`,
					ephemeral: true,
				}
			}
		}

		return null
	}
}

function missing(target: GuildMember, required: PermString[]) {
	let miss = target.permissions
		.missing(required, true)
		.map(e => perms[e as PermString])

	if (miss.includes('Administrador')) return ['Administrador']
	return miss
}

function strs(array: string[]) {
	return {
		s: array.length > 1 ? 's' : '',
		a: array.length > 1 ? 'ões' : 'ão',
		toString: () => `\`${array.join(', ')}\``,
	}
}

type OptRsvlr = CommandInteractionOptionResolver

export = HandlerUtils
