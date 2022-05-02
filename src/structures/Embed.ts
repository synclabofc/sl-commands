import { MessageEmbed, MessageEmbedOptions } from 'discord.js'

export class SLEmbed extends MessageEmbed {
	constructor(options?: MessageEmbedOptions) {
		super(options)

		this.setColor('#2F3136')
	}

	icons = {
		loading: 'https://cdn.discordapp.com/emojis/906376863880998973.gif',
		success: 'https://cdn.discordapp.com/emojis/843197955532128296.png',
		error: 'https://cdn.discordapp.com/emojis/845705106674155561.png',
		arrow: 'https://cdn.discordapp.com/emojis/851206127471034378.png',
	}

	setSuccess(name: string, footer?: string): this {
		this.setAuthor({ name, iconURL: this.icons.success })

		if (footer) this.setFooter({ text: footer, iconURL: this.icons.arrow })

		return this
	}

	setLoading(name: string, footer?: string): this {
		this.setAuthor({ name, iconURL: this.icons.loading })

		if (footer) this.setFooter({ text: footer, iconURL: this.icons.arrow })

		return this
	}

	setError(name: string, footer?: string): this {
		this.setAuthor({ name, iconURL: this.icons.error })

		if (footer) this.setFooter({ text: footer, iconURL: this.icons.arrow })

		return this
	}
}
