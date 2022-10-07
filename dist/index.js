"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SLEmbed = exports.Util = exports.Event = exports.Feature = exports.SubCommand = exports.UserCommand = exports.MessageCommand = exports.ChatInputCommand = void 0;
const tslib_1 = require("tslib");
const structures_1 = require("./structures");
Object.defineProperty(exports, "ChatInputCommand", { enumerable: true, get: function () { return structures_1.ChatInputCommand; } });
Object.defineProperty(exports, "MessageCommand", { enumerable: true, get: function () { return structures_1.MessageCommand; } });
Object.defineProperty(exports, "UserCommand", { enumerable: true, get: function () { return structures_1.UserCommand; } });
Object.defineProperty(exports, "SubCommand", { enumerable: true, get: function () { return structures_1.SubCommand; } });
Object.defineProperty(exports, "Feature", { enumerable: true, get: function () { return structures_1.Feature; } });
Object.defineProperty(exports, "Event", { enumerable: true, get: function () { return structures_1.Event; } });
Object.defineProperty(exports, "SLEmbed", { enumerable: true, get: function () { return structures_1.SLEmbed; } });
const util_1 = tslib_1.__importStar(require("./util"));
exports.Util = util_1.default;
const LookForUpdates_1 = tslib_1.__importDefault(require("./LookForUpdates"));
const events_1 = require("events");
const discord_js_1 = require("discord.js");
const MessageHandler_1 = tslib_1.__importDefault(require("./MessageHandler"));
const CommandLoader_1 = tslib_1.__importDefault(require("./loaders/CommandLoader"));
const FeatureLoader_1 = tslib_1.__importDefault(require("./loaders/FeatureLoader"));
const EventLoader_1 = tslib_1.__importDefault(require("./loaders/EventLoader"));
class SLHandler extends events_1.EventEmitter {
    _client;
    _token = '';
    _eventsDir = '';
    _commandsDir = '';
    _featuresDir = '';
    _messagesPath = '';
    _botDevsIds = [];
    _testServersIds = [];
    _testOnly = false;
    _showWarns = true;
    _useDefaultMessages = true;
    _language = 'en-us';
    _mongoConnection = null;
    _messageHandler = undefined;
    _commandLoader = undefined;
    _featureLoader = undefined;
    _eventLoader = undefined;
    /**
     * This will handle commands (slash or context menu), features and events.
     *
     * @param {HandlerOptions} options - Options that will dictate how handler works
     */
    constructor(options) {
        super();
        this._client = new discord_js_1.Client(options.clientOptions ?? { intents: ['Guilds'] });
        util_1.Validators.handlerOptionsCheck(options);
        this.setUp(options);
    }
    async setUp(options) {
        let { messagesPath, featuresDir, commandsDir, eventsDir, botToken, testServersIds, botDevsIds, dbOptions, mongoUri, language, testOnly, showWarns, useDefaultMessages, } = options ?? {};
        if (testServersIds) {
            if (typeof testServersIds == 'string')
                testServersIds = [testServersIds];
            this._testServersIds = testServersIds;
        }
        if (botDevsIds) {
            if (typeof botDevsIds == 'string')
                botDevsIds = [botDevsIds];
            this._botDevsIds = botDevsIds;
        }
        this._messagesPath = messagesPath ?? '';
        this._featuresDir = featuresDir ?? '';
        this._commandsDir = commandsDir ?? '';
        this._eventsDir = eventsDir ?? '';
        this._testOnly = testOnly ?? false;
        this._showWarns = showWarns ?? true;
        this._useDefaultMessages = useDefaultMessages ?? true;
        this._language = language ?? 'en-us';
        this._token = botToken;
        if (this._showWarns) {
            let props = [
                'commandsDir',
                'featuresDir',
                'eventsDir',
                'mongoUri',
            ];
            for (let prop of props) {
                if (options && !options[prop]) {
                    util_1.Logger.warn(`SLCommands > The property ${prop} is missing.`);
                }
            }
        }
        this._messageHandler = new MessageHandler_1.default(this._messagesPath);
        this._commandLoader = new CommandLoader_1.default(this, this._commandsDir);
        this._featureLoader = new FeatureLoader_1.default(this, this._featuresDir);
        this._eventLoader = new EventLoader_1.default(this, this._eventsDir);
        if (mongoUri) {
            await new util_1.Mongo(this, mongoUri, dbOptions).connect();
            this._mongoConnection = util_1.Mongo.getConnection();
        }
        this._client.login(this._token).then(() => {
            this.emit('handlerReady');
        });
        (0, LookForUpdates_1.default)();
    }
    /**
     * Add bot developers to the handler (you can add it as a property when setting up the handler instead)
     *
     * @param ids - The users' ids
     */
    addBotDevs(...ids) {
        this._botDevsIds = [...this._botDevsIds, ...ids];
        return this;
    }
    /**
     * Add test servers to the handler (you can add it as a property when setting up the handler instead)
     *
     * @param ids - The guilds' ids
     */
    addTestServers(...ids) {
        this._testServersIds = [...this._testServersIds, ...ids];
        return this;
    }
    /**
     * Wheter the provided database connection (if there is one) is already connected
     */
    isDBConnected() {
        const connection = this.mongoConnection;
        return !!(connection && connection.readyState === 1);
    }
    /** Gets the MongoDB connection */
    get mongoConnection() {
        return this._mongoConnection;
    }
    /** The MessageHandler, this is used for built-in replies */
    get messageHandler() {
        return this._messageHandler;
    }
    /** The CommandLoader, you can access the commands through this */
    get commandLoader() {
        return this._commandLoader;
    }
    /** The FeatureLoader, you can acess the features' functions through this */
    get featureLoader() {
        return this._featureLoader;
    }
    /** The EventLoader, you can access the events through this */
    get eventLoader() {
        return this._eventLoader;
    }
    /** The provided test servers */
    get testServersIds() {
        return this._testServersIds;
    }
    /** The provided bot developers */
    get botDevsIds() {
        return this._botDevsIds;
    }
    /** If useDefaultMessages is enabled */
    get useDefaultMessages() {
        return this._useDefaultMessages;
    }
    /** If global testOnly is enabled */
    get testOnly() {
        return this._testOnly;
    }
    /** If showWarns is enabled */
    get showWarns() {
        return this._showWarns;
    }
    /** The default language for bot messages */
    get language() {
        return this._language;
    }
    /** The DiscordJS client */
    get client() {
        return this._client;
    }
}
exports.default = SLHandler;
