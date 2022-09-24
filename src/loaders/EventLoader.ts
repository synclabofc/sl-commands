import EventManager from '../managers/EventManager'
import { FileManager, Logger } from '../util'
import { ClientEvents } from 'discord.js'
import { HandlerEvents } from '../types'
import { Event } from '../structures'
import { existsSync } from 'fs'
import SLHandler from '..'

class EventHandler {
	events: Event[] = []

	constructor(handler: SLHandler, dir: string) {
		if (!dir) return

		if (!existsSync(dir)) {
			Logger.error(`The directory '${dir}' does not exists.`)
			return
		}

		try {
			this.load(handler, dir)
		} catch (e) {
			Logger.error(`An error occured while loading events.\n`, e)
		}
	}

	private load(handler: SLHandler, dir: string) {
		const eventFiles = FileManager.getAllFiles(dir)
		const { client } = handler

		for (const file of eventFiles) {
			FileManager.import(file)
		}

		const { events } = EventManager

		for (const event of events) {
			handler[event.once ? 'once' : 'on'](
				event.name as keyof HandlerEvents,
				event.callback.bind(null, { client, handler })
			)

			client[event.once ? 'once' : 'on'](
				event.name as keyof ClientEvents,
				event.callback.bind(null, { client, handler })
			)
		}

		this.events = events

		Logger.tag('EVENTS', `Loaded ${eventFiles.length} event files.`)
	}
}

export = EventHandler
