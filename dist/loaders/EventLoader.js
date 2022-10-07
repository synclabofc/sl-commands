"use strict";
const tslib_1 = require("tslib");
const EventManager_1 = tslib_1.__importDefault(require("../managers/EventManager"));
const util_1 = require("../util");
const fs_1 = require("fs");
class EventHandler {
    events = [];
    constructor(handler, dir) {
        if (!dir)
            return;
        if (!(0, fs_1.existsSync)(dir)) {
            util_1.Logger.error(`The directory '${dir}' does not exists.`);
            return;
        }
        try {
            this.load(handler, dir);
        }
        catch (e) {
            util_1.Logger.error(`An error occured while loading events.\n`, e);
        }
    }
    load(handler, dir) {
        const eventFiles = util_1.FileManager.getAllFiles(dir);
        const { client } = handler;
        for (const file of eventFiles) {
            util_1.FileManager.import(file);
        }
        const { events } = EventManager_1.default;
        for (const event of events) {
            handler[event.once ? 'once' : 'on'](event.name, event.callback.bind(null, { client, handler }));
            client[event.once ? 'once' : 'on'](event.name, event.callback.bind(null, { client, handler }));
        }
        this.events = events;
        util_1.Logger.tag('EVENTS', `Loaded ${eventFiles.length} event files.`);
    }
}
module.exports = EventHandler;
