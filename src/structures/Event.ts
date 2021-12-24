import { Client, ClientEvents } from 'discord.js'
import BlueyCommands from '..'

export class Event<K extends keyof ClientEvents> {
	constructor(
		public name: K,
		public callback: (
			client: Client,
			handler: BlueyCommands,
			...args: ClientEvents[K]
		) => any
	) {
		if (!name || !callback) {
			throw new TypeError(
				'[EVENTS] You must provide name and callback for every event.'
			)
		}
	}
}
