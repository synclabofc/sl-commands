import { MessageEmbed, MessageEmbedOptions } from 'discord.js'

const icons = {
	loading: 'https://cdn.discordapp.com/emojis/906376863880998973.gif',
	success: 'https://cdn.discordapp.com/emojis/777567150180270111.png',
	error: 'https://cdn.discordapp.com/emojis/845705106674155561.png',
	arrow: 'https://cdn.discordapp.com/emojis/851206127471034378.png',
}

export class SLEmbed extends MessageEmbed {
	constructor(options?: MessageEmbedOptions) {
		super(options)

		this.setColor('#2F3136')
	}

	setSuccess(name: string, footer?: string): this {
		this.setAuthor({ name, iconURL: icons.success })

		if (footer) this.setFooter({ text: footer, iconURL: icons.arrow })

		return this
	}

	setLoading(name: string, footer?: string): this {
		this.setAuthor({ name, iconURL: icons.loading })

		if (footer) this.setFooter({ text: footer, iconURL: icons.arrow })

		return this
	}

	setError(name: string, footer?: string): this {
		this.setAuthor({ name, iconURL: icons.error })

		if (footer) this.setFooter({ text: footer, iconURL: icons.arrow })

		return this
	}
}
