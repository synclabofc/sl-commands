import {
	ApplicationCommandOptionData,
	ApplicationCommandType,
} from 'discord.js'

import {
	ChatInputCommandType,
	MessageCommandType,
	UserCommandType,
	SubCommandType,
	CommandType,
	PermString,
	Callback,
} from '../../typings'

import perms from '../../permissions.json'

export class Command {
	name: string
	description?: string
	type?: ApplicationCommandType | 'SUBCOMMAND'

	hasSub?: boolean
	testOnly?: boolean
	devsOnly?: boolean
	callback: Callback
	reference?: string
	permissions?: PermString[]
	options?: ApplicationCommandOptionData[]

	constructor(obj: CommandType) {
		let { callback, name, type = 'CHAT_INPUT' } = obj

		if (!['CHAT_INPUT', 'SUBCOMMAND', 'MESSAGE', 'USER'].includes(type)) {
			throw new TypeError(
				`SLCommands > Command type must be one of these: 'CHAT_INPUT', 'SUB_COMMAND', 'MESSAGE' or 'USER'.`
			)
		}

		if (['CHAT_INPUT', 'MESSAGE', 'USER'].includes(type)) {
			let {
				testOnly,
				devsOnly = false,
				permissions = [],
			} = obj as ChatInputCommandType | MessageCommandType | UserCommandType

			this.testOnly = testOnly
			this.devsOnly = devsOnly

			if (typeof permissions == 'string') permissions = [permissions]
			this.permissions = permissions

			for (let perm of this.permissions) {
				if (!perms['en-us'][perm]) {
					throw new TypeError(
						`SLCommands > The provived permissions for ${name} command are invalid.`
					)
				}
			}
		}

		if (type === 'CHAT_INPUT') {
			obj = obj as ChatInputCommandType
			let { description: desc, options } = obj

			this.options = options || []
			this.description = desc
		}

		if (this.options?.filter(c => c.type === 'SUB_COMMAND').length) {
			this.hasSub = true
		}

		if (type === 'SUBCOMMAND') {
			obj = obj as SubCommandType
			this.reference = obj.reference
		}

		if (type === 'MESSAGE') {
			obj = obj as MessageCommandType
		}

		if (type === 'USER') {
			obj = obj as UserCommandType
		}

		if (!callback) {
			throw new TypeError(
				`SLCommands > Callback missing at ${name || 'unknown'} command.`
			)
		}

		this.name = name
		this.type = type
		this.callback = callback
	}
}
