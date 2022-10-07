import { Client, ClientEvents } from 'discord.js';
import { HandlerEvents } from '../types';
import SLHandler from '..';
declare type EventKey = keyof HandlerEvents | keyof ClientEvents;
export declare class Event<K extends EventKey = EventKey> {
    name: K;
    callback: (ctx: {
        client: Client;
        handler: SLHandler;
    }, ...args: K extends keyof HandlerEvents ? Parameters<HandlerEvents[K]> : K extends keyof ClientEvents ? ClientEvents[K] : never) => any;
    once?: boolean | undefined;
    /**
     * Creates a SLEvent
     *
     * @param name - The event name (key of DiscordJS ClientEvents)
     * @param callback - The function which will be executed when the event is emitted
     */
    constructor(name: K, callback: (ctx: {
        client: Client;
        handler: SLHandler;
    }, ...args: K extends keyof HandlerEvents ? Parameters<HandlerEvents[K]> : K extends keyof ClientEvents ? ClientEvents[K] : never) => any, once?: boolean | undefined);
}
export {};
