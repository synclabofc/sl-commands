import { SLEmbed, Command, Event } from './structures'
import { mongo, getMongoConnection } from './mongo'
import { HandlerOptions } from '../typings'
import { EventEmitter } from 'events'
import { Connection } from 'mongoose'
import { Client } from 'discord.js'
import { Logger } from './logger'

import CommandHandler from './CommandHandler'
import FeatureHandler from './FeatureHandler'
import EventHandler from './EventHandler'

class SLCommands extends EventEmitter {
	private _client: Client
	private _token: string = ''
	private _eventsDir: string = ''
	private _commandsDir: string = ''
	private _featuresDir: string = ''
	private _botOwners: string[] = []
	private _testServers: string[] = []
	private _showWarns: boolean = true
	private _testOnly: boolean = false
	private _language: 'pt-br' | 'en-us' = 'en-us'
	private _mongoConnection: Connection | null = null
	private _commandHandler: CommandHandler | null = null
	private _eventHandler: EventHandler | null = null

	/**
	 * @desc Sets up the handler
	 *
	 * @param {Client} client - Your DiscordJS Client
	 * @param {HandlerOptions} options - Options that will dictate how handler works
	 */
	constructor(client: Client, options: HandlerOptions) {
		super()

		this._client = client
		this.setUp(options)
	}

	public async setUp(options: HandlerOptions) {
		if (!this._client) {
			throw new Error('SLCommands > Please provide a DiscordJS Client.')
		}

		let {
			featuresDir = '',
			commandsDir = '',
			eventsDir = '',
			botToken = '',
			testServers,
			botOwners,
			dbOptions,
			mongoUri,
			language = 'en-us',
			showWarns = true,
			testOnly = false,
		} = options || {}

		if (!botToken) {
			throw new Error('SLCommands > Please provide your Bot Token.')
		}

		if (mongoUri) {
			await mongo(this, mongoUri, dbOptions)

			this._mongoConnection = getMongoConnection()
		} else {
			if (showWarns) {
				this.logger.warn('SLCommands > No MongoDB connection URI provided.')
			}
		}

		if (!['pt-br', 'en-us'].includes(language)) {
			throw new Error(
				'SLCommands > You must use one of the supported languages ("pt-br" and "en-us").'
			)
		}

		if (testServers) {
			if (typeof testServers == 'string') testServers = [testServers]
			this._testServers = testServers
		}

		if (botOwners) {
			if (typeof botOwners == 'string') botOwners = [botOwners]
			this._botOwners = botOwners
		}

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
				'testServers',
				'botOwners',
			]

			for (let prop of props) {
				if (options && !options[prop]) {
					this.logger.warn(`SLCommands > The property ${prop} is missing.`)
				}
			}
		}

		this._commandHandler = new CommandHandler(this, this._commandsDir)
		new FeatureHandler(this, this._featuresDir)
		this._eventHandler = new EventHandler(this, this._eventsDir)

		this._client.login(this._token)
	}

	public import(path: string) {
		let file = require(path)
		return file?.default ? file.default : file
	}

	/**
	 * @desc Add test servers to the handler (you can add it as a property when setting up the handler instead)
	 *
	 * @param {string[]} ...ids - The guilds' ids
	 */
	public addTestServers(...ids: string[]): this {
		this._testServers = [...this._testServers, ...ids]
		return this
	}

	/**
	 * @desc Add bot owners to the handler (you can add it as a property when setting up the handler instead)
	 *
	 * @param {string[]} ids - The users' ids
	 */
	public addBotOwners(...ids: string[]): this {
		this._botOwners = [...this._botOwners, ...ids]
		return this
	}

	/**
	 * @desc Wheter the provided database connection (if there is one) is already connected
	 */
	public isDBConnected(): boolean {
		const connection = this.mongoConnection
		return !!(connection && connection.readyState === 1)
	}

	/** @desc Gets the MongoDB connection */
	public get mongoConnection(): Connection | null {
		return this._mongoConnection
	}

	/** @desc  CommandHandler, you can access the commands collection through this */
	public get commandHandler(): CommandHandler {
		return this._commandHandler!
	}

	/** @desc The EventHandler, you can access the events collection through this */
	public get eventHandler(): EventHandler {
		return this._eventHandler!
	}

	/** @desc The provided test servers */
	public get testServers() {
		return this._testServers
	}

	/** @desc The provided bot owners */
	public get botOwners() {
		return this._botOwners
	}

	/** @desc If global testOnly is enabled */
	public get testOnly() {
		return this._testOnly
	}

	/** @desc If showWarns is enabled */
	public get showWarns() {
		return this._showWarns
	}

	/** @desc The default language for bot messages */
	public get language() {
		return this._language
	}

	/** @desc Your provided DiscordJS client */
	public get client() {
		return this._client
	}

	/** @desc Custom logs (beautier than the default ones) */
	public get logger() {
		return new Logger()
	}
}

export default SLCommands
export { Command, Event, SLEmbed }
module.exports = Object.assign(SLCommands, { Command, Event, SLEmbed })
