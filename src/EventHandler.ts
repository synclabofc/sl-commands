import { ClientEvents, Collection } from 'discord.js'
import { existsSync } from 'fs'
import { glob } from 'glob'

import SLCommands, { Event } from '.'

class EventHandler {
	private _events = new Collection<string, Event<keyof ClientEvents>>()

	constructor(handler: SLCommands, dir: string) {
		if (!dir) return

		if (!existsSync(dir)) {
			handler.logger.error(`The directory '${dir}' does not exists.`)
			return
		}

		try {
			this.load(handler, dir)
		} catch (e) {
			handler.logger.error(`Ocurred an error while loading events.\n`, e)
		}
	}

	private load(handler: SLCommands, dir: string) {
		let { client } = handler
		dir += '/**/*{.ts,.js}'

		let eventFiles = glob.sync(dir, { absolute: true })

		for (let file of eventFiles) {
			let event: Event<keyof ClientEvents> = require(file)?.default
			if (!event) continue

			this._events.set(event.name, event)

			handler.client.on(event.name, event.callback.bind(null, client, handler))
		}

		handler.logger.tag('EVENTS', `Loaded ${this.eventsArray.length} events.`)
	}

	/** @returns The events collection */
	public get events() {
		return this._events
	}

	/** @returns The events array */
	public get eventsArray() {
		return Array.from(this._events.values())
	}
}

export = EventHandler
