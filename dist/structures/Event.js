"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
const tslib_1 = require("tslib");
const EventManager_1 = tslib_1.__importDefault(require("../managers/EventManager"));
class Event {
    name;
    callback;
    once;
    /**
     * Creates a SLEvent
     *
     * @param name - The event name (key of DiscordJS ClientEvents)
     * @param callback - The function which will be executed when the event is emitted
     */
    constructor(name, callback, once) {
        this.name = name;
        this.callback = callback;
        this.once = once;
        if (!name || !callback) {
            throw new TypeError('SLHandler > You must provide name and callback for every event.');
        }
        EventManager_1.default.registerEvent(this);
    }
}
exports.Event = Event;
