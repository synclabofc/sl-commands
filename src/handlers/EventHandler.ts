import { ClientEvents, Collection } from 'discord.js'
import { FileManager } from '../util/files';
import SLHandler, { SLEvent } from '..'
import { existsSync } from 'fs'
import { Logger } from '../util/logger';

class EventHandler {
	private _events = new Collection<string, SLEvent<keyof ClientEvents>>()

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
			const event: SLEvent<keyof ClientEvents> = FileManager.import(file)
			if (!event || !(event instanceof Event)) {
				continue
			}

			this._events.set(event.name, event)
			client.on(event.name, event.callback.bind(null, client, handler))
		}

		Logger.tag('EVENTS', `Loaded ${this.events.size} events.`)
	}

	/** The events collection */
	public get events() {
		return this._events
	}
}

export = EventHandler
