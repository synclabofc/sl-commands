import { ClientEvents, Collection } from 'discord.js'
import { FileManager, Logger } from '../util'
import { HandlerEvents } from '../types'
import SLHandler, { SLEvent } from '..'
import { existsSync } from 'fs'

class EventHandler {
	private _events: SLEvent<keyof ClientEvents | keyof HandlerEvents>[] = []

	constructor(handler: SLHandler, dir: string) {
		if (!dir) return

		if (!existsSync(dir)) {
			Logger.error(`The directory '${dir}' does not exists.`)
			return
		}

		try {
			this.load(handler, dir)
		} catch (e) {
			Logger.error(`Ocurred an error while loading events.\n`, e)
		}
	}

	private load(handler: SLHandler, dir: string) {
		const { client } = handler
		const eventFiles = FileManager.getAllFiles(dir)

		for (const file of eventFiles) {
			const event: SLEvent<keyof ClientEvents | keyof HandlerEvents> =
				FileManager.import(file)

			if (!event || !(event instanceof SLEvent)) {
				continue
			}

			this._events.push(event)

			handler[event.once ? 'once' : 'on'](
				event.name as keyof HandlerEvents,
				event.callback.bind(null, { client, handler })
			)

			client[event.once ? 'once' : 'on'](
				event.name as keyof ClientEvents,
				event.callback.bind(null, { client, handler })
			)
		}

		Logger.tag('EVENTS', `Loaded ${this.events.length} events.`)
	}

	/** The events array */
	public get events() {
		return this._events
	}
}

export = EventHandler
