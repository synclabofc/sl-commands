import { EmbedBuilder, EmbedData } from 'discord.js';

export class SLEmbed extends EmbedBuilder {
  constructor(data?: EmbedData) {
    super(data);

    if (!data) {
      this.setColor('#2F3136');
    }
  }

  icons = {
    loading: 'https://i.imgur.com/7AFl5HE.gif',
    success: 'https://i.imgur.com/FGPKOSb.png',
    error: 'https://i.imgur.com/4Fpg691.png',
    arrow: 'https://i.imgur.com/jokNI5A.png',
  };

  setSuccess(name: string, footer?: string) {
    this.setAuthor({ name, iconURL: this.icons.success });

    if (footer) {
      this.setFooter({ text: footer, iconURL: this.icons.arrow });
    }

    return this;
  }

  setLoading(name: string, footer?: string) {
    this.setAuthor({ name, iconURL: this.icons.loading });

    if (footer) {
      this.setFooter({ text: footer, iconURL: this.icons.arrow });
    }

    return this;
  }

  setError(name: string, footer?: string) {
    this.setAuthor({ name, iconURL: this.icons.error });

    if (footer) {
      this.setFooter({ text: footer, iconURL: this.icons.arrow });
    }

    return this;
  }
}
