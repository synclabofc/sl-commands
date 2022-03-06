import { SLEmbed, Command, Event } from './structures'
import { mongo, getMongoConnection } from './mongo'
import { HandlerOptions } from '../typings'
import { EventEmitter } from 'events'
import { Connection } from 'mongoose'
import { Client } from 'discord.js'
import chalk from 'chalk'

import CommandHandler from './CommandHandler'
import FeatureHandler from './FeatureHandler'
import EventHandler from './EventHandler'

const { log } = console

export default class SLCommands extends EventEmitter {
	private _client: Client
	private _token: string = ''
	private _eventsDir: string = ''
	private _commandsDir: string = ''
	private _featuresDir: string = ''
	private _botOwners: string[] = []
	private _testServers: string[] = []
	private _showWarns: boolean = true
	private _testOnly: boolean = false
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

		this.setUp(client, options)
	}

	public async setUp(client: Client, options: HandlerOptions) {
		if (!client) {
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
			showWarns = true,
			testOnly = false,
		} = options || {}

		if (!botToken) {
			throw new Error('SLCommands > The botToken property is missing.')
		}

		if (mongoUri) {
			await mongo(this, mongoUri, dbOptions)

			this._mongoConnection = getMongoConnection()
		} else {
			if (showWarns) {
				this.logger.warn('SLCommands > No MongoDB connection URI provided.')
			}
		}

		this._featuresDir = featuresDir
		this._commandsDir = commandsDir
		this._eventsDir = eventsDir
		this._showWarns = showWarns
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
					this.logger.warn(`SLCommands > The property ${prop} is missing.`)
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
		 * @param {string} hex - The HEX code
		 */
		hex(hex: string) {
			return chalk.hex(hex)
		},
		/**
		 * @param {string} hex - The HEX code
		 */
		bgHex(hex: string) {
			return chalk.bgHex(hex)
		},
		/**
		 * @param {string} hex - The HEX code
		 * @param {string} prefix - The [PREFIX]
		 */
		create(hex: string, prefix: string) {
			return chalk.white('[') + this.hex(hex)(prefix) + chalk.white(']')
		},
		/**
		 * @param {string[]} ...args - Anything you want to log with warn as prefix
		 */
		warn(...args: any[]) {
			log(this.create('#ffffcc', 'WARN'), ...args)
		},
		/**
		 * @param {string[]} ...args - Anything you want to log with error as prefix
		 */
		error(...args: any[]) {
			log(this.create('#f64747', 'ERROR'), ...args)
		},
		/**
		 * @param {string[]} ...args - Anything you want to log with success as prefix
		 */
		success(...args: any[]) {
			log(this.create('#93faa5', 'SUCCESS'), ...args)
		},
		/**
		 * @param {string} tag - The [PREFIX], it can be whatever you want
		 * @param {string} hex - The HEX code
		 */
		custom(tag: string, hex: string, ...args: any[]) {
			log(this.create(hex, tag), ...args)
		},
		/**
		 * @param {string} tag - The [PREFIX], it can be whatever you want
		 * @param {string[]} ...args - Anything you want to log with the provided tag as prefix
		 */
		tag(tag: string, ...args: any[]) {
			log(this.create('#6bb9f0', tag), ...args)
		},
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

	/** @desc Your provided DiscordJS client */
	public get client() {
		return this._client
	}

	/** @desc If showWarns is enabled */
	public get showWarns() {
		return this._showWarns
	}
}

export { SLEmbed, Command, Event }
module.exports = SLCommands