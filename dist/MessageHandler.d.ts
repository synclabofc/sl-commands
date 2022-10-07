import messages from './messages.json';
declare class MessageHandler {
    private messagesPath;
    private defaultMessages;
    private messages?;
    constructor(messagesPath?: string);
    getMessage(index: keyof typeof messages, language: 'pt-br' | 'en-us', keys?: {
        [key: string]: string | number;
    }): string;
}
export = MessageHandler;
