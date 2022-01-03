import {
	ChatInputApplicationCommandData,
	MessageApplicationCommandData,
	UserApplicationCommandData,
	ContextMenuInteraction,
	CommandInteraction,
	GuildMember,
	Message,
	Client,
	Guild,
	User,
	MessageContextMenuInteraction,
	UserContextMenuInteraction,
	CommandInteractionOptionResolver,
	CommandInteractionOption,
} from 'discord.js'

import { ConnectOptions } from 'mongoose'
import BlueyCommands from './src'

/* SYSTEM */

export type HandlerOptions = {
	featuresDir?: string
	commandsDir?: string
	eventsDir?: string
	botToken: string
	testServers?: string | string[]
	botOwners?: string | string[]
	dbOptions?: ConnectOptions
	showWarns?: boolean
	testOnly?: boolean
	mongoUri?: string
}

/* UTILS */

import permissions from './permissions.json'

export type PermString = keyof typeof permissions

type BaseInteraction = {
	member: GuildMember
	guild: Guild & {
		me: GuildMember
	}
}

/* COMMANDS & CONTEXTS */

export type ECommandInteraction = BaseInteraction & CommandInteraction
export type EContextInteraction<T extends 'MESSAGE' | 'USER'> =
	BaseInteraction &
		(T extends 'USER'
			? UserContextMenuInteraction
			: MessageContextMenuInteraction)

export type CommandType = ChatInputType | MessageType | UserType | SubType
export type Callback = ChatInputCallback | MessageCallback | UserCallback

export type SubType = {
	type: 'SUBCOMMAND'
	name: string
	reference: string
	callback: (obj: {
		client: Client
		handler: BlueyCommands
		interaction: ECommandInteraction
		options?: CommandInteractionOptionResolver
	}) => any
}

export type ChatInputType = {
	type: 'CHAT_INPUT'
	callback: (obj: {
		client: Client
		handler: BlueyCommands
		interaction: ECommandInteraction
		options?: CommandInteractionOptionResolver
	}) => any
} & BaseType &
	ChatInputApplicationCommandData

export type MessageType = {
	type: 'MESSAGE'
	callback: (obj: {
		client: Client
		target: Message
		handler: BlueyCommands
		interaction: EContextInteraction<'MESSAGE'>
	}) => any
} & BaseType &
	MessageApplicationCommandData

export type UserType = {
	type: 'USER'
	callback: (obj: {
		target: User
		client: Client
		handler: BlueyCommands
		interaction: EContextInteraction<'USER'>
	}) => any
} & BaseType &
	UserApplicationCommandData

interface BaseType {
	permissions?: PermString | PermString[]
	testOnly?: boolean
	devsOnly?: boolean
}

export type ChatInputCallback = ChatInputType['callback']
export type MessageCallback = MessageType['callback']
export type UserCallback = UserType['callback']
