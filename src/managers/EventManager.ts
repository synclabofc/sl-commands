import { SLEvent } from '../structures'

class EventManager {
	readonly events: SLEvent[] = []

	registerEvent(event: SLEvent) {
		if (event instanceof SLEvent) {
			this.events.push(event)
		}
	}
}

export = new EventManager()
