import {
	ApplicationCommandOptionData,
	ApplicationCommandType,
} from 'discord.js';

import {
	ChatInputType,
	CommandType,
	MessageType,
	PermString,
	Callback,
	UserType,
	SubType,
} from '../../typings';

import perms from '../../permissions.json';

export class Command {
	name: string;
	description?: string;
	type: ApplicationCommandType | 'SUBCOMMAND';

	sub?: boolean;
	hasSub?: boolean;
	testOnly?: boolean;
	devsOnly?: boolean;
	callback: Callback;
	reference?: string;
	permissions?: PermString[];
	options?: ApplicationCommandOptionData[];

	constructor(obj: CommandType) {
		let { callback, name, type } = obj;

		if (['CHAT_INPUT', 'MESSAGE', 'USER'].includes(type)) {
			let {
				testOnly,
				devsOnly = false,
				permissions = [],
			} = obj as ChatInputType | MessageType | UserType;

			this.testOnly = testOnly;
			this.devsOnly = devsOnly;

			if (typeof permissions == 'string') permissions = [permissions];
			this.permissions = permissions;

			for (let perm of this.permissions) {
				if (!perms[perm]) {
					throw new TypeError(
						`[COMMANDS] The provived permissions for ${name} are invalid.`
					);
				}
			}
		}

		if (type === 'CHAT_INPUT') {
			obj = obj as ChatInputType;
			let { description: desc, options } = obj;

			this.options = options || [];
			this.description = desc;
		}

		if (this.options?.filter(c => c.type === 'SUB_COMMAND').length) {
			this.hasSub = true;
		}

		if (type === 'SUBCOMMAND') {
			obj = obj as SubType;
			this.sub = true;
			this.reference = obj.reference;
		}

		if (type === 'MESSAGE') {
			obj = obj as MessageType;
		}

		if (type === 'USER') {
			obj = obj as UserType;
		}

		if (!callback || !type) {
			throw new TypeError(
				`[COMMANDS] Callback or type missing at command ${name || 'unknown'}.`
			);
		}

		this.name = name;
		this.type = type;
		this.callback = callback;
	}
}
