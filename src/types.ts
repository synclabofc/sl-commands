import {
	MessageContextMenuCommandInteraction,
	UserContextMenuCommandInteraction,
	CommandInteractionOptionResolver,
	ChatInputCommandInteraction,
	TextBasedChannel,
	ClientOptions,
	GuildMember,
	Message,
	Client,
	Locale,
	Guild,
	User,
	PermissionsString,
} from 'discord.js'

import { Connection, ConnectOptions } from 'mongoose'
import permissions from './permissions.json'
import SLHandler from '.'

export type CommandType = keyof CommandTypes

interface CommandTypes {
	SUB_COMMAND: {
		callback: {
			options: CommandInteractionOptionResolver
			channel: TextBasedChannel
		}
		interaction: ChatInputCommandInteraction
	}
	CHAT_INPUT: {
		callback: {
			options: CommandInteractionOptionResolver
			channel: TextBasedChannel
		}
		interaction: ChatInputCommandInteraction
	}
	MESSAGE: {
		callback: {
			target: Message
			channel: TextBasedChannel
		}
		interaction: MessageContextMenuCommandInteraction
	}
	USER: {
		callback: { target: GuildMember }
		interaction: UserContextMenuCommandInteraction
	}
}

export type SLInteraction<T extends CommandType = CommandType> =
	CommandTypes[T]['interaction'] & {
		member: GuildMember
	}

export type CommandExecuteObject<T extends CommandType = CommandType> =
	CommandTypes[T]['callback'] & {
		interaction: CommandTypes[T]['interaction']
		handler: SLHandler
		member?: GuildMember
		client: Client
		locale: Locale
		guild?: Guild
		user: User
	}

export type CommandExecute<T extends CommandType = CommandType> = (
	object: CommandExecuteObject<T>
) => any

export type SLPermission = PermissionsString

export type SLLanguages = 'pt-br' | 'en-us'

export type HandlerEvents = {
	databaseConnected: (connection: Connection, state: string) => any
	commandDevsOnly: (interaction: SLInteraction) => any
	commandException: (
		commandName: string,
		error: Error,
		interaction: SLInteraction | undefined
	) => any
}

export interface HandlerOptions {
	/** The custom messages' json path */
	messagesPath?: string

	/** The features' directory path */
	featuresDir?: string

	/** The commands' directory path */
	commandsDir?: string

	/** The events' directory path */
	eventsDir?: string

	/** Your Discord Bot's authorization token */
	botToken: string

	/** The mongoUri for connecting to the database */
	mongoUri?: string

	/**
	 * Test only commands will be registered in the guild(s) listed heren
	 * - Defaults to `[]`
	 */
	testServersIds?: string | string[]

	/**
	 * Users in this list will be able to use `devsOnly` commands
	 * - Defaults to `[]`
	 */
	botDevsIds?: string | string[]

	/**
	 * The default language for your Bot
	 * - Defaults to `'en-us'`
	 */
	language?: SLLanguages

	/**
	 * The DiscordJS Client options
	 * - Defaults to `{ intents: ['Guilds'] }`
	 */
	clientOptions?: ClientOptions

	/**
	 * The Mongoose connection options
	 * - Defaults to `{}`
	 */
	dbOptions?: ConnectOptions

	/**
	 * Whether or not to use the default replies for DevsOnly & Permissions handlers.
	 * If it is disabled the event `commandDevsOnly` will be emitted instead of the default replying.
	 * - Defaults to `true`
	 */
	useDefaultMessages?: boolean

	/**
	 * Whether the handler should show warns or not
	 * - Defaults to `true`
	 */
	showWarns?: boolean

	/**
	 * The default testOnly value for commands
	 * - Defaults to `false`
	 */
	testOnly?: boolean
}
