import {
	CommandInteractionOption,
	InteractionReplyOptions,
	ContextMenuInteraction,
	GuildMember,
	Collection,
	Message,
	Guild,
	User,
	Client,
} from 'discord.js';

import {
	ECommandInteraction,
	EContextInteraction,
	ChatInputCallback,
	MessageCallback,
	UserCallback,
	PermString,
} from '../typings';

import BlueyCommands, { SLEmbed, Command } from '.';
import perms from '../permissions.json';

type ICollection = Collection<string, Command>;

class HandlerUtils {
	setUp(
		handler: BlueyCommands,
		commands: ICollection,
		subcommands: ICollection
	) {
		let { client, botOwners } = handler;

		client.on('interactionCreate', async int => {
			if (!int.isCommand() && !int.isContextMenu()) return;

			let command = commands.get(int.commandName);
			if (!command) return;

			let { permissions, devsOnly, callback, type, hasSub } = command;
			let { member, guild } = int;
			let args;

			member = member as GuildMember;
			guild = guild as Guild;

			let verified = this.verify(
				permissions || [],
				botOwners,
				member,
				devsOnly || false,
				guild
			);

			if (verified) {
				int.reply(verified);
				return;
			}

			if (type == 'CHAT_INPUT') {
				if (!int.isCommand()) return;
				args = getArgs(int.options.data);

				let subName = args[0] as string;
				let subcommand = subcommands.find(
					({ name, reference }) =>
						name === subName && reference === int.commandName
				);
				if (hasSub && subcommand) {
					callback = subcommand.callback as ChatInputCallback;
					args.shift();

					await callback({
						options: args as (string | number | boolean)[],
						interaction: int as ECommandInteraction,
						handler: handler,
						client,
					});
					return;
				}
			} else {
				if (!int.isContextMenu()) return;
				args = await getTarget(client, int);
			}

			try {
				if (type === 'CHAT_INPUT') {
					callback = callback as ChatInputCallback;
					await callback({
						options: args as (string | number | boolean)[],
						interaction: int as ECommandInteraction,
						handler: handler,
						client,
					});
				} else {
					callback = callback as MessageCallback | UserCallback;
					await callback({
						interaction: int as EContextInteraction,
						target: args as Message & User,
						handler: handler,
						client,
					});
				}
			} catch (e) {
				handler.logger.error(`Error at ${int.commandName}:\n`, e);
				setTimeout(() => {
					int[int.replied ? 'followUp' : 'reply']({
						embeds: [
							new SLEmbed().setError(`Ocorreu um erro inesperado.`),
						],
					});
				}, 500);
			}
		});
	}

	verify(
		reqPerms: PermString[],
		botOwners: string[],
		target: GuildMember,
		devsOnly: boolean,
		guild: Guild
	): InteractionReplyOptions | null {
		if (devsOnly && !botOwners.includes(target.id)) {
			return {
				content: 'Este comando está reservado para os meus desenvolvedores.',
				ephemeral: true,
			};
		}

		if (reqPerms.length) {
			let missMe = missing(guild.me!, reqPerms);
			let missIt = missing(target, reqPerms);
			let str;

			if (missIt.length) {
				str = strs(missIt);

				return {
					content: `Você precisa da${str.s} permiss${str.a} ${str} para utilizar este comando.`,
					ephemeral: true,
				};
			}

			if (missMe.length) {
				str = strs(missMe);

				return {
					content: `Eu preciso da${str.s} permiss${str.a} ${str} para executar este comando.`,
					ephemeral: true,
				};
			}
		}

		return null;
	}
}

async function getTarget(
	client: Client,
	{ targetType, targetId, channel }: ContextMenuInteraction
) {
	let target;

	if (targetType == 'MESSAGE') target = await channel?.messages.fetch(targetId);
	else target = await client?.users.fetch(targetId);

	return target ?? targetId;
}

function getArgs(data: readonly CommandInteractionOption[]) {
	let args = [];
	for (let option of data) {
		if (option.type === 'SUB_COMMAND') {
			if (option.name) args.push(option.name);
			option.options?.forEach(x => {
				if (x.value) args.push(x.value);
			});
		} else if (option.value) args.push(option.value);
	}
	return args;
}

function missing(target: GuildMember, required: PermString[]) {
	let miss = target.permissions
		.missing(required, true)
		.map(e => perms[e as PermString]);

	if (miss.includes('Administrador')) return ['Administrador'];
	return miss;
}

function strs(array: string[]) {
	return {
		s: array.length > 1 ? 's' : '',
		a: array.length > 1 ? 'ões' : 'ão',
		toString: () => `\`${array.join(', ')}\``,
	};
}

export = HandlerUtils;
