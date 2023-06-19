import { Event } from '../structures';

class EventManager {
  readonly events: Event[] = [];

  registerEvent(event: Event) {
    if (event instanceof Event) {
      this.events.push(event);
    }
  }
}

export = new EventManager();
