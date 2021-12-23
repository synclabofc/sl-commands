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
} from 'discord.js';

import { ConnectOptions } from 'mongoose';
import BlueyCommands from './src';

/* SYSTEM */

export type HandlerOptions = {
	featuresDir?: string;
	commandsDir?: string;
	eventsDir?: string;
	botToken: string;
	testServers?: string | string[];
	botOwners?: string | string[];
	dbOptions?: ConnectOptions;
	showWarns?: boolean;
	testOnly?: boolean;
	mongoUri?: string;
	log?: boolean;
};

/* UTILS */

import permissions from './permissions.json';

export type PermString = keyof typeof permissions;

type BaseInteraction = {
	member: GuildMember;
	guild: Guild & {
		me: GuildMember;
	};
};

/* COMMANDS & CONTEXTS */

export type EContextInteraction = BaseInteraction & ContextMenuInteraction;
export type ECommandInteraction = BaseInteraction & CommandInteraction;

export type CommandType = ChatInputType | MessageType | UserType | SubType;
export type Callback = ChatInputCallback | MessageCallback | UserCallback;

export type SubType = {
	name: string;
	type: 'SUBCOMMAND';
	reference: string;
	callback?: (obj: {
		client: Client;
		handler: BlueyCommands;
		interaction: ECommandInteraction;
		options?: (number | string | boolean)[];
	}) => any;
};

export type ChatInputType = {
	type: 'CHAT_INPUT';
	sub?: boolean;
	callback: (obj: {
		client: Client;
		handler: BlueyCommands;
		interaction: ECommandInteraction;
		options?: (number | string | boolean)[];
	}) => any;
} & BaseType &
	ChatInputApplicationCommandData;

export type MessageType = {
	type: 'MESSAGE';
	callback: (obj: {
		client: Client;
		target: Message;
		handler: BlueyCommands;
		interaction: EContextInteraction;
	}) => any;
} & BaseType &
	MessageApplicationCommandData;

export type UserType = {
	type: 'USER';
	callback: (obj: {
		target: User;
		client: Client;
		handler: BlueyCommands;
		interaction: EContextInteraction;
	}) => any;
} & BaseType &
	UserApplicationCommandData;

type BaseType = {
	permissions?: PermString | PermString[];
	testOnly?: boolean;
	devsOnly?: boolean;
};

export type ChatInputCallback = ChatInputType['callback'];
export type MessageCallback = MessageType['callback'];
export type UserCallback = UserType['callback'];
