"use strict";
const structures_1 = require("../structures");
class EventManager {
    events = [];
    registerEvent(event) {
        if (event instanceof structures_1.Event) {
            this.events.push(event);
        }
    }
}
module.exports = new EventManager();
