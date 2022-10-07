"use strict";
class CommandListener {
    handler;
    constructor(handler, commands, subcommands) {
        this.handler = handler;
        handler.client.on('interactionCreate', async (raw) => {
            if (!raw.isChatInputCommand() && !raw.isContextMenuCommand())
                return;
            const command = commands.get(raw.commandName);
            const interaction = raw;
            if (!command)
                return;
            const { member, guild, user, channel, locale, options } = interaction;
            let check = await this.isAvailable(interaction, command);
            if (check) {
                if (check !== true) {
                    interaction.reply(check);
                }
                return;
            }
            let execute = command.executeFunction;
            let cbObject = {
                client: handler.client,
                options: undefined,
                channel: undefined,
                guild: guild,
                interaction,
                handler,
                locale,
                member,
                user,
            };
            if (interaction.isChatInputCommand()) {
                const { commandName } = interaction;
                const subCommand = subcommands.find(s => options.data.some(({ name }) => s.name === name && s.reference === commandName));
                if (subCommand) {
                    execute = subCommand.executeFunction;
                    cbObject = Object.assign(cbObject, {
                        options: options,
                        channel: channel,
                    });
                }
                else {
                    cbObject = Object.assign(cbObject, {
                        options: options,
                        channel: channel,
                    });
                }
            }
            else if (interaction.isUserContextMenuCommand()) {
                cbObject = Object.assign(cbObject, {
                    target: interaction.targetMember,
                });
            }
            else if (interaction.isMessageContextMenuCommand()) {
                cbObject = Object.assign(cbObject, {
                    target: interaction.targetMessage,
                    channel: channel,
                });
            }
            try {
                await execute(cbObject);
            }
            catch (err) {
                if (!(err instanceof Error)) {
                    err = new Error(String(err));
                }
                handler.emit('commandException', command.name ?? 'unknown', err, interaction);
            }
        });
    }
    async isAvailable(interaction, { devsOnly }) {
        let { language, botDevsIds, messageHandler, useDefaultMessages } = this.handler;
        let { user } = interaction;
        if (!(devsOnly && !botDevsIds.includes(user.id))) {
            return;
        }
        if (!useDefaultMessages) {
            this.handler.emit('commandDevsOnly', interaction);
            return true;
        }
        return {
            content: messageHandler.getMessage('DevsOnly', language),
            ephemeral: true,
        };
    }
}
module.exports = CommandListener;
