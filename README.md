<div align="center">
	<a href="https://npmjs.com/package/sl-commands"><img src="https://cdn.discordapp.com/emojis/1009869462540918894.png?quality=lossless"></a>
  <h1><strong>SLCommands</strong></h1>
  <h3><strong>An advanced handler for Discord.js Bots with TypeScript and JavaScript support!</strong></h3><br>
	<img src="assets/made-with-typescript.svg"> <img src="assets/it-works.-why_.svg">
</div>
<br><br>

# **About**

SLCommands is a command, context, feature, and event handler made by **bluey#0012**. The goal of this package is to make your Discord Bot developer's life easier.

# **Documentation**

The official documentation can be found here: https://synclab.gitbook.io/sl-commands/

# **Installation**

<a href="https://npmjs.com/package/sl-commands"><img src="https://nodei.co/npm/sl-commands.png?mini=true"></a>

<a href="https://npmjs.com/package/discord.js"><img src="https://nodei.co/npm/discord.js.png?mini=true"></a><br>_required discord.js v14_


# **Simple Setup**

**JavaScript**
```js
const SLHandler = require('sl-commands').default
const path = require('path')

new SLHandler({
	botToken: 'YOUR_TOKEN_HERE',
	commandsDir: path.join(__dirname, 'commands')
})
```

**TypeScript**
```ts
import SLHandler from 'sl-commands'
import path from 'path'

new SLHandler({
	botToken: 'YOUR_TOKEN_HERE',
	commandsDir: path.join(__dirname, 'commands')
})
```

# **Support & Feature Requests**

This package is looking for feedback and ideas to help cover more use cases. If you have any ideas feel free to share them with the [GitHub](https://github.com/bluee-js/sl-commands) repository's issues.
