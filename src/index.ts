import {
	ChatInputCommand,
	MessageCommand,
	UserCommand,
	SubCommand,
	Feature,
	Event,
	SLEmbed,
} from './structures'

import { HandlerEvents, HandlerOptions, SLLanguages } from './types'
import Util, { Validators, Logger, Mongo } from './util'
import { lookForUpdates } from './LookForUpdates'
import TypedEventEmitter from 'typed-emitter'
import { EventEmitter } from 'events'
import { Connection } from 'mongoose'
import { Client } from 'discord.js'

import MessageHandler from './MessageHandler'
import CommandLoader from './loaders/CommandLoader'
import FeatureLoader from './loaders/FeatureLoader'
import EventLoader from './loaders/EventLoader'

export default class SLHandler extends (EventEmitter as new () => TypedEventEmitter<HandlerEvents>) {
	private _client: Client
	private _token: string = ''
	private _eventsDir: string = ''
	private _commandsDir: string = ''
	private _featuresDir: string = ''
	private _messagesPath: string = ''
	private _botDevsIds: string[] = []
	private _testServersIds: string[] = []
	private _testOnly: boolean = false
	private _showWarns: boolean = true
	private _useDefaultMessages: boolean = true
	private _language: SLLanguages = 'en-us'
	private _mongoConnection: Connection | null = null
	private _messageHandler: MessageHandler = undefined!
	private _commandLoader: CommandLoader = undefined!
	private _featureLoader: FeatureLoader = undefined!
	private _eventLoader: EventLoader = undefined!

	/**
	 * This will handle commands (slash or context menu), features and events.
	 *
	 * @param {HandlerOptions} options - Options that will dictate how handler works
	 */
	constructor(options: HandlerOptions) {
		super()

		this._client = new Client(options.clientOptions ?? { intents: ['Guilds'] })

		Validators.handlerOptionsCheck(options)
		this.setUp(options)
	}

	private async setUp(options: HandlerOptions) {
		let {
			messagesPath,
			featuresDir,
			commandsDir,
			eventsDir,
			botToken,
			testServersIds,
			botDevsIds,
			dbOptions,
			mongoUri,
			language,
			testOnly,
			showWarns,
			useDefaultMessages,
		} = options ?? {}

		if (testServersIds) {
			if (typeof testServersIds == 'string') testServersIds = [testServersIds]
			this._testServersIds = testServersIds
		}

		if (botDevsIds) {
			if (typeof botDevsIds == 'string') botDevsIds = [botDevsIds]
			this._botDevsIds = botDevsIds
		}

		this._messagesPath = messagesPath ?? ''
		this._featuresDir = featuresDir ?? ''
		this._commandsDir = commandsDir ?? ''
		this._eventsDir = eventsDir ?? ''
		this._testOnly = testOnly ?? false
		this._showWarns = showWarns ?? true
		this._useDefaultMessages = useDefaultMessages ?? true
		this._language = language ?? 'en-us'
		this._token = botToken

		if (this._showWarns) {
			let props: (keyof HandlerOptions)[] = [
				'commandsDir',
				'featuresDir',
				'eventsDir',
				'mongoUri',
			]

			for (let prop of props) {
				if (options && !options[prop]) {
					Logger.warn(`SLCommands > The property ${prop} is missing.`)
				}
			}
		}

		this._messageHandler = new MessageHandler(this._messagesPath)
		this._commandLoader = new CommandLoader(this, this._commandsDir)
		this._featureLoader = new FeatureLoader(this, this._featuresDir)
		this._eventLoader = new EventLoader(this, this._eventsDir)

		if (mongoUri) {
			await new Mongo(this, mongoUri, dbOptions).connect()

			console.log('mongo')

			this._mongoConnection = Mongo.getConnection()
		}

		this._client.login(this._token).then(() => {
			console.log('login')
			this.emit('handlerReady')
		})
		console.log('after login')

		if (this._showWarns) {
			console.log('look')

			lookForUpdates()
		}
	}

	/**
	 * Add bot developers to the handler (you can add it as a property when setting up the handler instead)
	 *
	 * @param ids - The users' ids
	 */
	public addBotDevs(...ids: string[]): this {
		this._botDevsIds = [...this._botDevsIds, ...ids]
		return this
	}

	/**
	 * Add test servers to the handler (you can add it as a property when setting up the handler instead)
	 *
	 * @param ids - The guilds' ids
	 */
	public addTestServers(...ids: string[]): this {
		this._testServersIds = [...this._testServersIds, ...ids]
		return this
	}

	/**
	 * Wheter the provided database connection (if there is one) is already connected
	 */
	public isDBConnected(): boolean {
		const connection = this.mongoConnection
		return !!(connection && connection.readyState === 1)
	}

	/** Gets the MongoDB connection */
	public get mongoConnection() {
		return this._mongoConnection
	}

	/** The MessageHandler, this is used for built-in replies */
	public get messageHandler() {
		return this._messageHandler
	}

	/** The CommandLoader, you can access the commands through this */
	public get commandLoader() {
		return this._commandLoader
	}

	/** The FeatureLoader, you can acess the features' functions through this */
	public get featureLoader() {
		return this._featureLoader
	}

	/** The EventLoader, you can access the events through this */
	public get eventLoader() {
		return this._eventLoader
	}

	/** The provided test servers */
	public get testServersIds() {
		return this._testServersIds
	}

	/** The provided bot developers */
	public get botDevsIds() {
		return this._botDevsIds
	}

	/** If useDefaultMessages is enabled */
	public get useDefaultMessages() {
		return this._useDefaultMessages
	}

	/** If global testOnly is enabled */
	public get testOnly() {
		return this._testOnly
	}

	/** If showWarns is enabled */
	public get showWarns() {
		return this._showWarns
	}

	/** The default language for bot messages */
	public get language() {
		return this._language
	}

	/** The DiscordJS client */
	public get client() {
		return this._client
	}
}

export {
	ChatInputCommand,
	MessageCommand,
	UserCommand,
	SubCommand,
	Feature,
	Event,
	Util,
	SLEmbed,
}
