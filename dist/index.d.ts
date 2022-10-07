import { ChatInputCommand, MessageCommand, UserCommand, SubCommand, Feature, Event, SLEmbed } from './structures';
import { HandlerEvents, HandlerOptions } from './types';
import Util from './util';
import TypedEventEmitter from 'typed-emitter';
import { Connection } from 'mongoose';
import { Client } from 'discord.js';
import MessageHandler from './MessageHandler';
import CommandLoader from './loaders/CommandLoader';
import FeatureLoader from './loaders/FeatureLoader';
import EventLoader from './loaders/EventLoader';
declare const SLHandler_base: new () => TypedEventEmitter<HandlerEvents>;
export default class SLHandler extends SLHandler_base {
    private _client;
    private _token;
    private _eventsDir;
    private _commandsDir;
    private _featuresDir;
    private _messagesPath;
    private _botDevsIds;
    private _testServersIds;
    private _testOnly;
    private _showWarns;
    private _useDefaultMessages;
    private _language;
    private _mongoConnection;
    private _messageHandler;
    private _commandLoader;
    private _featureLoader;
    private _eventLoader;
    /**
     * This will handle commands (slash or context menu), features and events.
     *
     * @param {HandlerOptions} options - Options that will dictate how handler works
     */
    constructor(options: HandlerOptions);
    private setUp;
    /**
     * Add bot developers to the handler (you can add it as a property when setting up the handler instead)
     *
     * @param ids - The users' ids
     */
    addBotDevs(...ids: string[]): this;
    /**
     * Add test servers to the handler (you can add it as a property when setting up the handler instead)
     *
     * @param ids - The guilds' ids
     */
    addTestServers(...ids: string[]): this;
    /**
     * Wheter the provided database connection (if there is one) is already connected
     */
    isDBConnected(): boolean;
    /** Gets the MongoDB connection */
    get mongoConnection(): Connection | null;
    /** The MessageHandler, this is used for built-in replies */
    get messageHandler(): MessageHandler;
    /** The CommandLoader, you can access the commands through this */
    get commandLoader(): CommandLoader;
    /** The FeatureLoader, you can acess the features' functions through this */
    get featureLoader(): FeatureLoader;
    /** The EventLoader, you can access the events through this */
    get eventLoader(): EventLoader;
    /** The provided test servers */
    get testServersIds(): string[];
    /** The provided bot developers */
    get botDevsIds(): string[];
    /** If useDefaultMessages is enabled */
    get useDefaultMessages(): boolean;
    /** If global testOnly is enabled */
    get testOnly(): boolean;
    /** If showWarns is enabled */
    get showWarns(): boolean;
    /** The default language for bot messages */
    get language(): "en-us" | "pt-br";
    /** The DiscordJS client */
    get client(): Client<boolean>;
}
export { ChatInputCommand, MessageCommand, UserCommand, SubCommand, Feature, Event, Util, SLEmbed, };
