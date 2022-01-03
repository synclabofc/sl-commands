import { HandlerOptions } from '../typings'
import { EventEmitter } from 'events'
import { Connection } from 'mongoose'
import { Client } from 'discord.js'
import chalk from 'chalk'

import CommandHandler from './CommandHandler'
import FeatureHandler from './FeatureHandler'
import EventHandler from './EventHandler'

import { SLEmbed, Command, Event } from './structures'
import mongo, { getMongoConnection } from './mongo'

const { log } = console

class SLCommands extends EventEmitter {
	private _featuresDir: string = ''
	private _commandsDir: string = ''
	private _eventsDir: string = ''

	private _testServers: string[] = []
	private _botOwners: string[] = []
	private _testOnly: boolean = false

	private _showWarns: boolean = false
	private _token: string = ''
	private _client: Client

	private _mongoConnection: Connection | null = null
	private _commandHandler: CommandHandler | null = null
	private _eventHandler: EventHandler | null = null

	/**
	 * Sets up the handler
	 * 
	 * @param client - Your DiscordJS Client
	 * @param options - Options that will dictate how handler works
	 */
	constructor(client: Client, options?: HandlerOptions) {
		super()

		this._client = client

		this.setUp(client, options)
	}

	public async setUp(client: Client, options?: HandlerOptions) {
		if (!client) {
			throw new Error(`[HANDLER] Please provide a DiscordJS Client.`)
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
			showWarns = false,
			testOnly = false,
		} = options || {}

		if (!botToken) {
			throw new Error(`[HANDLER] The botToken property is missing.`)
		}

		if (mongoUri) {
			await mongo(this, mongoUri, dbOptions)

			this._mongoConnection = getMongoConnection()
		} else {
			if (showWarns) {
				this.logger.warn('No MongoDB connection URI provided.')
			}
		}

		this._featuresDir = featuresDir
		this._commandsDir = commandsDir
		this._eventsDir = eventsDir
		this._testOnly = testOnly
		this._token = botToken

		if (testServers) {
			if (typeof testServers == 'string') testServers = [testServers]
			this._testServers = testServers
		}

		if (botOwners) {
			if (typeof botOwners == 'string') botOwners = [botOwners]
			this._botOwners = botOwners
		}

		if (showWarns) {
			let properties: (keyof HandlerOptions)[] = [
				'commandsDir',
				'featuresDir',
				'eventsDir',
				'testServers',
				'botOwners',
			]

			for (let prop of properties) {
				if (options && !options[prop]) {
					this.logger.warn(`The property ${prop} is missing.`)
				}
			}
		}

		this._commandHandler = new CommandHandler(this, this._commandsDir)
		new FeatureHandler(this, this._featuresDir)
		this._eventHandler = new EventHandler(this, this._eventsDir)

		this._client.login(this._token)
	}

	public logger = {
		/**
		 * @param hex - The HEX code
		 */
		hex(hex: string) {
			return chalk.hex(hex)
		},
		/**
		 * @param hex - The HEX code
		 */
		bgHex(hex: string) {
			return chalk.bgHex(hex)
		},
		/**
		 * @param hex - The HEX code
		 * @param prefix - The [PREFIX]
		 */
		create(hex: string, prefix: string) {
			return chalk.white('[') + this.hex(hex)(prefix) + chalk.white(']')
		},
		/**
		 * @param args - Anything you want to log with warn as prefix
		 */
		warn(...args: any[]) {
			log(this.create('#ffffcc', 'WARN'), ...args)
		},
		/**
		 * @param args - Anything you want to log with error as prefix
		 */
		error(...args: any[]) {
			log(this.create('#f64747', 'ERROR'), ...args)
		},
		/**
		 * @param args - Anything you want to log with success as prefix
		 */
		success(...args: any[]) {
			log(this.create('#93faa5', 'SUCCESS'), ...args)
		},
		/**
		 * @param tag - The [PREFIX], it can be whatever you want
		 * @param hex - The HEX code
		 */
		custom(tag: string, hex: string, ...args: any[]) {
			log(this.create(hex, tag), ...args)
		},
		/**
		 * @param tag - The [PREFIX], it can be whatever you want
		 * @param args - Anything you want to log with the provided tag as prefix
		 */
		tag(tag: string, ...args: any[]) {
			log(this.create('#6bb9f0', tag), ...args)
		},
	}

	/**
	 * Add test servers to the handler (you can add it as a property when setting up the handler instead)
	 * 
	 * @param ids - The guilds' ids
	 */
	public addTestServers(...ids: string[]): this {
		this._testServers = [...this._testServers, ...ids]
		return this
	}

	/**
	 * Add bot owners to the handler (you can add it as a property when setting up the handler instead)
	 * 
	 * @param ids - The users' ids
	 */
	public addBotOwners(...ids: string[]): this {
		this._botOwners = [...this._botOwners, ...ids]
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
	public get mongoConnection(): Connection | null {
		return this._mongoConnection
	}

	/** The CommandHandler, you can access the commands collection through this */
	public get commandHandler(): CommandHandler {
		return this._commandHandler!
	}

	/** The EventHandler, you can access the events collection through this */
	public get eventHandler(): EventHandler {
		return this._eventHandler!
	}

	/** The provided test servers */
	public get testServers() {
		return this._testServers
	}

	/** The provided bot owners */
	public get botOwners() {
		return this._botOwners
	}

	/** If global testOnly is enabled */
	public get testOnly() {
		return this._testOnly
	}

	/** Your provided DiscordJS client */
	public get client() {
		return this._client
	}

	/** If showWarns is enabled */
	public get showWarns() {
		return this._showWarns
	}
}

export { SLEmbed, Command, Event }
export default SLCommands
