import { HandlerOptions } from '../typings';
import { EventEmitter } from 'events';
import { Connection } from 'mongoose';
import { Client } from 'discord.js';
import chalk from 'chalk';

import CommandHandler from './CommandHandler';
import FeatureHandler from './FeatureHandler';
import EventHandler from './EventHandler';

import { SLEmbed, Command, Event } from './structures';
import mongo, { getMongoConnection } from './mongo';

const { log } = console;

class BlueyCommands extends EventEmitter {
	private _featuresDir: string = '';
	private _commandsDir: string = '';
	private _eventsDir: string = '';

	private _testServers: string[] = [];
	private _botOwners: string[] = [];
	private _testOnly: boolean = false;

	private _showWarns: boolean = false;
	private _log: boolean = false;
	private _token: string = '';
	private _client: Client;

	private _mongoConnection: Connection | null = null;
	private _commandHandler: CommandHandler | null = null;
	private _eventHandler: EventHandler | null = null;

	constructor(client: Client, options?: HandlerOptions) {
		super();

		this._client = client;

		this.setUp(client, options);
	}

	public async setUp(client: Client, options?: HandlerOptions) {
		if (!client) {
			throw new Error(`[HANDLER] Please provide a Discord.JS Client.`);
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
			log = false,
		} = options || {};

		if (!botToken) {
			throw new Error(`[HANDLER] The botToken property is missing.`);
		}

		if (mongoUri) {
			await mongo(this, mongoUri, dbOptions);

			this._mongoConnection = getMongoConnection();
		} else {
			if (showWarns) {
				this.logger.warn('No MongoDB connection URI provided.');
			}
		}

		this._featuresDir = featuresDir;
		this._commandsDir = commandsDir;
		this._eventsDir = eventsDir;
		this._testOnly = testOnly;
		this._token = botToken;
		this._log = log;

		if (testServers) {
			if (typeof testServers == 'string') testServers = [testServers];
			this._testServers = testServers;
		}

		if (botOwners) {
			if (typeof botOwners == 'string') botOwners = [botOwners];
			this._botOwners = botOwners;
		}

		if (showWarns) {
			let properties: (keyof HandlerOptions)[] = [
				'commandsDir',
				'featuresDir',
				'eventsDir',
				'testServers',
				'botOwners',
			];

			for (let prop of properties) {
				if (options && !options[prop]) {
					this.logger.warn(`The property ${prop} is missing.`);
				}
			}
		}

		this._commandHandler = new CommandHandler(this, this._commandsDir);
		new FeatureHandler(this, this._featuresDir);
		this._eventHandler = new EventHandler(this, this._eventsDir);

		this._client.login(this._token);
	}

	public logger = {
		hex(hex: string) {
			return chalk.hex(hex);
		},
		bgHex(hex: string) {
			return chalk.bgHex(hex);
		},
		create(hex: string, prefix: string) {
			return chalk.white('[') + this.hex(hex)(prefix) + chalk.white(']');
		},
		warn(...args: any[]) {
			log(this.create('#ffffcc', 'WARN'), ...args);
		},
		error(...args: any[]) {
			log(this.create('#f64747', 'ERROR'), ...args);
		},
		success(...args: any[]) {
			log(this.create('#93faa5', 'SUCCESS'), ...args);
		},
		custom(tag: string, hex: string, ...args: any[]) {
			log(this.create(hex, tag), ...args);
		},
		tag(tag: string, ...args: any[]) {
			log(this.create('#6bb9f0', tag), ...args);
		},
	};

	public addTestServers(...ids: string[]): this {
		this._testServers = [...this._testServers, ...ids];
		return this;
	}

	public addBotOwners(...ids: string[]): this {
		this._botOwners = [...this._botOwners, ...ids];
		return this;
	}

	public get mongoConnection(): Connection | null {
		return this._mongoConnection;
	}

	public get commandHandler(): CommandHandler {
		return this._commandHandler!;
	}

	public get eventHandler(): EventHandler {
		return this._eventHandler!;
	}

	public get testServers() {
		return this._testServers;
	}

	public get botOwners() {
		return this._botOwners;
	}

	public get testOnly() {
		return this._testOnly;
	}

	public get client() {
		return this._client;
	}

	public get showWarns() {
		return this._showWarns;
	}

	public get log() {
		return this._log;
	}
}

export { SLEmbed, Command, Event };
export default BlueyCommands;
