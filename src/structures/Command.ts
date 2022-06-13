import { SLPermission, ICallback, ICommand, CommandType } from '../../typings'
import { ApplicationCommandOptionData } from 'discord.js'
import perms from '../../permissions.json'

export class Command {
	name: string
	type?: CommandType
	description?: string

	hasSub?: boolean
	testOnly?: boolean
	devsOnly?: boolean
	reference?: string
	permissions?: SLPermission[]
	callback: ICallback<CommandType>
	options?: ApplicationCommandOptionData[]

	constructor(obj: ICommand) {
		let { callback, name, type } = obj

		if (!['CHAT_INPUT', 'SUB_COMMAND', 'MESSAGE', 'USER'].includes(type)) {
			throw new TypeError(
				`SLCommands > Invalid type (Supported: 'SUB_COMMAND', 'CHAT_INPUT', 'MESSAGE' and 'USER'). [${name} command]`
			)
		}

		if (!callback) {
			throw new TypeError(`SLCommands > Missing callback. [${name} command]`)
		}

		if (obj.type !== 'SUB_COMMAND') {
			let { testOnly, devsOnly = false, permissions = [] } = obj

			this.testOnly = testOnly
			this.devsOnly = devsOnly

			if (typeof permissions == 'string') permissions = [permissions]
			this.permissions = permissions

			for (let perm of this.permissions) {
				if (!perms['en-us'][perm]) {
					throw new TypeError(
						`SLCommands > Invalid permissions. [${name} command]`
					)
				}
			}
		}

		if (obj.type === 'CHAT_INPUT') {
			let { description: desc, options } = obj
			this.options = options || []
			this.description = desc
		}

		if (this.options?.filter(c => c.type === 'SUB_COMMAND').length) {
			this.hasSub = true
		}

		if (obj.type === 'SUB_COMMAND') {
			let { reference } = obj
			this.reference = reference
		}

		this.name = name
		this.type = type
		this.callback = callback as ICallback<CommandType>
	}
}

function isMessage(command: ICommand) {}
