import { EmbedBuilder, EmbedData } from 'discord.js';
export declare class SLEmbed extends EmbedBuilder {
    constructor(data?: EmbedData);
    icons: {
        loading: string;
        success: string;
        error: string;
        arrow: string;
    };
    setSuccess(name: string, footer?: string): this;
    setLoading(name: string, footer?: string): this;
    setError(name: string, footer?: string): this;
}
