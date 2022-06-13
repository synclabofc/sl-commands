import {
	Client,
	Message,
	Collection,
	Interaction,
	MessageEmbed,
	TextBasedChannel,
	CommandInteraction,
	ApplicationCommandType,
	CommandInteractionOption,
	UserApplicationCommandData,
	MessageApplicationCommandData,
	CommandInteractionOptionResolver,
	ChatInputApplicationCommandData,
	MessageContextMenuInteraction,
	UserContextMenuInteraction,
	ApplicationCommandData,
	ContextMenuInteraction,
	MessageEmbedOptions,
	ClientEvents,
	GuildMember,
	Locale,
	Guild,
	User,
} from 'discord.js'

import { Connection, ConnectOptions } from 'mongoose'
import permissions from './permissions.json'
import messages from './messages.json'
import { EventEmitter } from 'events'
import SLCommands from './src'

/* HANDLER */

export interface HandlerEvents {
	databaseConnected: [connection: Connection, state: string]
	commandException: [commandName: string, error: Error]
}

export interface HandlerOptions {
	featuresDir?: string
	commandsDir?: string
	eventsDir?: string
	botToken: string
	testServers?: string | string[]
	botOwners?: string | string[]
	language?: 'pt-br' | 'en-us'
	dbOptions?: ConnectOptions
	showWarns?: boolean
	testOnly?: boolean
	mongoUri?: string
}

export default class SLCommands extends EventEmitter {
	private _client: Client
	private _token: string
	private _eventsDir: string
	private _commandsDir: string
	private _featuresDir: string
	private _testOnly: boolean
	private _showWarns: boolean
	private _botOwners: string[]
	private _testServers: string[]
	private _language: 'pt-br' | 'en-us'
	private _mongoConnection: Connection | null
	private _commandHandler: CommandHandler | null
	private _eventHandler: EventHandler | null

	constructor(client: Client, options: HandlerOptions)

	public addTestServers(...ids: string[]): this
	public addBotOwners(...ids: string[]): this
	public isDBConnected(): boolean

	public get mongoConnection(): Connection | null
	public get commandHandler(): CommandHandler
	public get eventHandler(): EventHandler
	public get language(): 'pt-br' | 'en-us'
	public get testServers(): string[]
	public get botOwners(): string[]
	public get showWarns(): boolean
	public get testOnly(): boolean
	public get logger(): Logger
	public get client(): Client

	public on<K extends keyof HandlerEvents>(
		event: K,
		listener: (...args: HandlerEvents[K]) => Awaitable<void>
	)

	public once<K extends keyof HandlerEvents>(
		event: K,
		listener: (...args: HandlerEvents[K]) => Awaitable<void>
	)

	public emit<K extends keyof HandlerEvents>(
		event: K,
		...args: HandlerEvents[K]
	): boolean

	public removeAllListeners<K extends keyof HandlerEvents>(event?: K): this
}

export class Command {
	name: string
	description?: string
	type: ApplicationCommandType | 'SUBCOMMAND'
	hasSub?: boolean
	testOnly?: boolean
	devsOnly?: boolean
	callback: Callback
	reference?: string
	permissions?: SLPermission[]
	options?: ApplicationCommandOptionData[]

	constructor(obj: ICommand)
}

export class Event<K extends keyof ClientEvents> {
	constructor(
		public name: K,
		public callback: (
			client: Client,
			handler: SLCommands,
			...args: ClientEvents[K]
		) => any
	)
}

export class SLEmbed extends MessageEmbed {
	constructor(options?: MessageEmbedOptions)

	public icons: {
		loading: string
		success: string
		error: string
		arrow: string
	}

	setSuccess(name: string, footer?: string): this
	setLoading(name: string, footer?: string): this
	setError(name: string, footer?: string): this
}

class CommandHandler {
	private _subcommands: Collection<string, Command>
	private _commands: Collection<string, Command>

	constructor(handler: SLCommands, dir: string)
	private load(handler: SLCommands, dir: string)
	private async registerCommands(handler: SLCommands)

	public get commandsArray(): Command[]
	public get subcommandsArray(): Command[]
	public get commands(): Collection<string, Command>
	public get subcommands(): Collection<string, Command>
}

class EventHandler {
	private _events: Collection<string, Event<keyof ClientEvents>>

	constructor(handler: SLCommands, dir: string)
	private load(handler: SLCommands, dir: string)

	public get eventsArray(): Event<keyof ClientEvents>[]
	public get events(): Collection<string, Event<keyof ClientEvents>>
}

/* UTILS */

export type SLInteraction<T extends CommandType = CommandType> =
	CommandTypes[T]['interaction'] & {
		member: GuildMember
		guild: Guild & {
			me: GuildMember
		}
	}

export type SLPermission = keyof typeof permissions['en-us']

type Awaitable<T> = T | PromiseLike<T>
type Arrayable<T> = T | T[]
type Values<T> = T[keyof T]

/* COMMANDS & CONTEXTS */

export type CommandType = keyof CommandTypes

interface CommandTypes {
	SUB_COMMAND: {
		callback: {
			options: CommandInteractionOptionResolver
			channel: TextBasedChannel
		}
		data: {
			reference: string
			name: string
		}
		interaction: CommandInteraction
	}
	CHAT_INPUT: {
		callback: {
			options: CommandInteractionOptionResolver
			channel: TextBasedChannel
		}
		data: ChatInputApplicationCommandData
		interaction: CommandInteraction
	}
	MESSAGE: {
		callback: {
			target: Message
			channel: TextBasedChannel
		}
		data: MessageApplicationCommandData
		interaction: MessageContextMenuInteraction
	}
	USER: {
		callback: { target: GuildMember }
		data: UserApplicationCommandData
		interaction: UserContextMenuInteraction
	}
}

export type ICommand = {
	[T in keyof CommandTypes]: {
		type: T
		callback: ICallback<T>
	} & CommandTypes[T]['data'] &
		(T extends 'SUB_COMMAND'
			? {}
			: {
					permissions?: Arrayable<SLPermission>
					testOnly?: boolean
					devsOnly?: boolean
			  })
}[keyof CommandTypes]

export type ICallbackObject<T extends CommandType = CommandType> =
	CommandTypes[T]['callback'] & {
		interaction: CommandTypes[T]['interaction']
		handler: SLCommands
		member: GuildMember
		client: Client
		locale: Locale
		guild: Guild
		user: User
	}

export type ICallback<T extends CommandType> = (
	object: ICallbackObject<T>
) => any
