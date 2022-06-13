import { ClientEvents, Collection } from 'discord.js'
import SLCommands, { Event } from '.'
import { existsSync } from 'fs'
import { glob } from 'glob'

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
		const { client } = handler
		dir += '/**/*{.ts,.js}'

		const eventFiles = glob.sync(dir, { absolute: true })

		for (const file of eventFiles) {
			const event: Event<keyof ClientEvents> = handler.import(file)
			if (!event || !(event instanceof Event)) {
				continue
			}

			this._events.set(event.name, event)
			client.on(event.name, event.callback.bind(null, client, handler))
		}

		handler.logger.tag('EVENTS', `Loaded ${this.events.size} events.`)
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
