import { Client, ClientEvents } from 'discord.js'
import SLHandler from '..'

export class SLEvent<K extends keyof ClientEvents> {
	constructor(
		public name: K,
		public callback: (
			client: Client,
			handler: SLHandler,
			...args: ClientEvents[K]
		) => any
	) {
		if (!name || !callback) {
			throw new TypeError(
				'SLHandler > You must provide name and callback for every event.'
			)
		}
	}
}
