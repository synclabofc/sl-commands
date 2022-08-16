import {
	SLChatInputCommand,
	SLMessageCommand,
	SLUserCommand,
	SLSubCommand,
	SLCommand,
	SLFeature,
	SLEmbed,
	SLEvent,
} from './structures'

import { mongo, getMongoConnection } from './util/mongo'
import { HandlerEvents, HandlerOptions } from './types'
import { Client, IntentsBitField } from 'discord.js'
import { Validators } from './util/validators'
import TypedEventEmitter from 'typed-emitter'
import { FileManager } from './util/files'
import { Logger } from './util/logger'
import { EventEmitter } from 'events'
import { Connection } from 'mongoose'

import MessageHandler from './handlers/MessageHandler'
import CommandHandler from './handlers/CommandHandler'
import FeatureHandler from './handlers/FeatureHandler'
import EventHandler from './handlers/EventHandler'

class SLHandler extends (EventEmitter as new () => TypedEventEmitter<HandlerEvents>) {
	private _client: Client
	private _token: string = ''
	private _eventsDir: string = ''
	private _commandsDir: string = ''
	private _featuresDir: string = ''
	private _messagesPath: string = ''
	private _botDevsIds: string[] = []
	private _testServersIds: string[] = []
	private _showWarns: boolean = true
	private _testOnly: boolean = false
	private _language: 'pt-br' | 'en-us' = 'en-us'
	private _mongoConnection: Connection | null = null
	private _messageHandler: MessageHandler = undefined!
	private _commandHandler: CommandHandler = undefined!
	private _featureHandler: FeatureHandler = undefined!
	private _eventHandler: EventHandler = undefined!

	/**
	 * This will handle commands (slash or context menu), features and events.
	 *
	 * @param {HandlerOptions} options - Options that will dictate how handler works
	 */
	constructor(options: HandlerOptions) {
		super()

		this._client = new Client(
			options.clientOptions || { intents: [IntentsBitField.Flags.Guilds] }
		)

		Validators.handlerOptionsCheck(options)
		this.setUp(options)
	}

	private async setUp(options: HandlerOptions) {
		let {
			messagesPath = '',
			featuresDir = '',
			commandsDir = '',
			eventsDir = '',
			botToken = '',
			testServersIds,
			botDevsIds,
			dbOptions,
			mongoUri,
			language = 'en-us',
			showWarns = true,
			testOnly = false,
		} = options || {}

		if (mongoUri) {
			await mongo(this, mongoUri, dbOptions)

			this._mongoConnection = getMongoConnection()
		} else {
			if (showWarns) {
				Logger.warn('SLCommands > No MongoDB connection URI provided.')
			}
		}

		if (testServersIds) {
			if (typeof testServersIds == 'string') testServersIds = [testServersIds]
			this._testServersIds = testServersIds
		}

		if (botDevsIds) {
			if (typeof botDevsIds == 'string') botDevsIds = [botDevsIds]
			this._botDevsIds = botDevsIds
		}

		this._messagesPath = messagesPath
		this._featuresDir = featuresDir
		this._commandsDir = commandsDir
		this._eventsDir = eventsDir
		this._showWarns = showWarns
		this._testOnly = testOnly
		this._language = language
		this._token = botToken

		if (showWarns) {
			let props: (keyof HandlerOptions)[] = [
				'commandsDir',
				'featuresDir',
				'eventsDir',
			]

			for (let prop of props) {
				if (options && !options[prop]) {
					Logger.warn(`SLCommands > The property ${prop} is missing.`)
				}
			}
		}

		this._commandHandler = new CommandHandler(this, this._commandsDir)
		this._featureHandler = new FeatureHandler(this, this._featuresDir)
		this._messageHandler = new MessageHandler(this._messagesPath)
		this._eventHandler = new EventHandler(this, this._eventsDir)

		this._client.login(this._token)
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

	/** The CommandHandler, you can access the commands collection through this */
	public get commandHandler() {
		return this._commandHandler!
	}

	/** The FeatureHandler, you can access the features collection through this */
	public get featureHandler() {
		return this._featureHandler!
	}

	/** The EventHandler, you can access the events collection through this */
	public get eventHandler() {
		return this._eventHandler!
	}

	/** The provided test servers */
	public get testServersIds() {
		return this._testServersIds
	}

	/** The provided bot developers */
	public get botDevsIds() {
		return this._botDevsIds
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

export default SLHandler

export {
	SLChatInputCommand,
	SLMessageCommand,
	SLUserCommand,
	SLSubCommand,
	SLCommand,
	SLFeature,
	SLEmbed,
	SLEvent,
	Logger,
	Validators,
	FileManager,
}

module.exports = Object.assign(SLHandler, {
	SLChatInputCommand,
	SLMessageCommand,
	SLUserCommand,
	SLSubCommand,
	SLFeature,
	SLEmbed,
	SLEvent,
	Logger,
	Validators,
	FileManager,
})
