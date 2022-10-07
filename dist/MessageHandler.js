"use strict";
const tslib_1 = require("tslib");
const messages_json_1 = tslib_1.__importDefault(require("./messages.json"));
const util_1 = require("./util");
class MessageHandler {
    messagesPath;
    defaultMessages = messages_json_1.default;
    messages;
    constructor(messagesPath) {
        this.messagesPath = messagesPath || '';
        if (this.messagesPath) {
            this.messages = require(this.messagesPath);
            util_1.Validators.messagesCheck(this.messages);
        }
    }
    getMessage(index, language, keys) {
        const message = this.messages?.[index][language] || this.defaultMessages[index][language];
        return message.replaceAll(/\{\{|\}\}|\{([^}]+)\}/g, (m, name) => {
            if (m === '{{')
                return '{';
            if (m === '}}')
                return '}';
            return keys?.[name].toString() ?? m;
        });
    }
}
module.exports = MessageHandler;
