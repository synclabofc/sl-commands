<div align="center">
	<img src="https://nodei.co/npm/bluey-commands.png" alt="bluey-commands">
	<br><br>
  <h1><strong>BlueyCommands</strong></h1>
  <h3><strong>An advanced handler for Discord.js Bots with TypeScript and JavaScript support!</strong></h3><br>
	<img src="assets/made-with-typescript.svg"> <img src="assets/it-works.-why_.svg">
</div>
<br><br>

# **About**

Bluey Commands is a command, context, and event handler made by **bluey#0012**. The goal of this package is to make your DiscordBot developer's life easier.

# **Instalation**

```bash
npm install bluey-commands
```

```bash
npm install discord.js@dev
```

_required discord.js@dev version_

# **Setup Handlers**

```js
import { Client, Intents } from 'discord.js';
import BlueyCommands from 'bluey-commands';
import { join } from 'path';

const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
	],
});

const handler = new BlueyCommands(client, {
	// The name of the local folder for your files (absolute)
	commandsDir: join(__dirname, 'commands'),
	featuresDir: join(__dirname, 'features'),
	eventsDir: join(__dirname, 'events'),

	// Test only commands will be registered in these guilds
	testServers: ['id1', 'id2'],
	// Owner only commands will only be able to be used by them
	botOwners: ['id1', 'id2'],
	// Default command's testOnly property
	testOnly: true,
	// If true you will receive logs from loaders
	log: true,
	// Your bot's token (required)
	botToken: 'YOUR TOKEN HERE',

	// Optional (connect to mongodb)
	mongoUri: 'YOUR MONGO URI',
	dbOptons: {},
})
.addTestServers('id3', 'id4')
.addBotOwners('id3', 'id4');

/*
  connection: The mongoose connection
  state: 'Connected' | 'Disconnected'
       'Conntecting' | 'Disconnecting' 
*/
handler.on('databaseConnected', (connection, state) => {});
```

# **Commands Structure**

## **Chat Input** (Slash Commands)

```js
import { Command } from 'bluey-commands';

export default new Command({
	// Self explanatory (required)
	name: 'ping',
	description: 'Shows my ping.',

	// Whether the command is owner only or not
	devsOnly: false,
	// If true the command will only be registeres for test servers
	testOnly: true,

	// Permissions required for this command
	permissions: ['ADMINISTRATOR'],
	// Slash Command's options
	options: [],
	// Required for typescript types
	type: 'CHAT_INPUT',

	/*
	  client: Your client
	  handler: Instance of BlueyCommands
	  interaction: CommandInteraction
	  options: Array of command options' values
	*/
	callback: async ({ client, handler, interaction, options }) => {
		interaction.reply('Hi!');
	},
});
```

## **Message** (Message Context Menu)

```js
import { Command } from 'bluey-commands';

export default new Command({
	// Same structure as Chat Input
	// description and options props are not required
	name: 'msg-info',
	type: 'MESSSAGE', // Required

	/*
	  client: Your client
	  handler: Instance of BlueyCommands
	  interaction: ContextMenuInteraction
	  target: The context menu's target (Message)
	*/
	callback: async ({ client, handler, interaction, target }) => {
		interaction.reply(target.content);
	},
});
```

## **User** (User Context Menu)

```js
import { Command } from 'bluey-commands';

export default new Command({
	// Same structure as Chat Input
	// description and options props are not required
	name: 'user-info',
	type: 'USER', // Required

	/*
	  client: Your client
	  handler: Instance of BlueyCommands
	  interaction: ContextMenuInteraction
	  target: The context menu's target (User)
	*/
	callback: async ({ client, handler, interaction, target }) => {
		interaction.reply(target.username);
	},
});
```

# **Event Structure**

```js
import { Event } from 'bluey-commands';

export default new Event(
	'message', // Key of ClientEvents - Event's name

	/*
	  client: Your client
	  handler: Instance of BlueyCommands

	  other args: The other params that you receive from the event:
	  *message, member, role, etc...

	  Full-typed*
	*/
	(client, handler, message) => {}
);
```

# **Feature Structure**

```js
/*
  client: Your client
  handler: Instance of BlueyCommands
*/
export default function (client, handler) {}
```

<br>
<p align="center"><strong>JavaScript examples soon!</strong></p>
<br>

# **Support & Feature Requests**

This package is looking for feedback and ideas to help cover more use cases. If you have any ideas feel free to share them with the GitHub repository's issues.
