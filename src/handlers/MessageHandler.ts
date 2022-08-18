import messages from '../messages.json'
import { Validators } from '../util'

class MessageHandler {
	private messagesPath: string
	private defaultMessages = messages
	private messages?: typeof messages

	constructor(messagesPath?: string) {
		this.messagesPath = messagesPath || ''

		if (this.messagesPath) {
			this.messages = require(this.messagesPath)

			Validators.messagesCheck(this.messages)
		}
	}

	getMessage(
		index: keyof typeof messages,
		language: 'pt-br' | 'en-us',
		keys?: { [key: string]: string | number }
	) {
		const message =
			this.messages?.[index][language] || this.defaultMessages[index][language]

		return message.replaceAll(
			/\{\{|\}\}|\{([^}]+)\}/g,
			(m: string, name: string): string => {
				if (m === '{{') return '{'
				if (m === '}}') return '}'

				return keys?.[name].toString() ?? m
			}
		)
	}
}

export = MessageHandler
