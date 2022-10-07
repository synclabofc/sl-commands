import { Event } from '../structures';
import SLHandler from '..';
declare class EventHandler {
    events: Event[];
    constructor(handler: SLHandler, dir: string);
    private load;
}
export = EventHandler;
