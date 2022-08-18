import { Client, ClientEvents } from 'discord.js'
import SLHandler from '..'
import { HandlerEvents } from '../types'

export class SLEvent<K extends keyof HandlerEvents | keyof ClientEvents> {
	/**
	 * Creates a SLEvent
	 *
	 * @param name - The event name (key of DiscordJS ClientEvents)
	 * @param callback - The function which will be executed when the event is emitted
	 */
	constructor(
		public name: K,
		public callback: (
			ctx: {
				client: Client
				handler: SLHandler
			},
			...args: K extends keyof HandlerEvents
				? Parameters<HandlerEvents[K]>
				: K extends keyof ClientEvents
				? ClientEvents[K]
				: never
		) => any,
		public once?: boolean
	) {
		if (!name || !callback) {
			throw new TypeError(
				'SLHandler > You must provide name and callback for every event.'
			)
		}
	}
}
