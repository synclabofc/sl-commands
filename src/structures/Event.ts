import { Client, ClientEvents } from 'discord.js'
import SLCommands from '..'

export class Event<K extends keyof ClientEvents> {
	constructor(
		public name: K,
		public callback: (
			client: Client,
			handler: SLCommands,
			...args: ClientEvents[K]
		) => any
	) {
		if (!name || !callback) {
			throw new TypeError(
				'SLCommands > You must provide name and callback for every event.'
			)
		}
	}
}
