"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SLEmbed = void 0;
const discord_js_1 = require("discord.js");
class SLEmbed extends discord_js_1.EmbedBuilder {
    constructor(data) {
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
    setSuccess(name, footer) {
        this.setAuthor({ name, iconURL: this.icons.success });
        if (footer) {
            this.setFooter({ text: footer, iconURL: this.icons.arrow });
        }
        return this;
    }
    setLoading(name, footer) {
        this.setAuthor({ name, iconURL: this.icons.loading });
        if (footer) {
            this.setFooter({ text: footer, iconURL: this.icons.arrow });
        }
        return this;
    }
    setError(name, footer) {
        this.setAuthor({ name, iconURL: this.icons.error });
        if (footer) {
            this.setFooter({ text: footer, iconURL: this.icons.arrow });
        }
        return this;
    }
}
exports.SLEmbed = SLEmbed;
