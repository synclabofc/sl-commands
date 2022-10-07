import { Event } from '../structures';
declare class EventManager {
    readonly events: Event[];
    registerEvent(event: Event): void;
}
declare const _default: EventManager;
export = _default;
