const Discord = require('discord.js');
const {token} = require('./config.json');
const {send_allowed, messages} = require("./messages");
const Logger = require('./Logger.js');
const bot = new Discord.Client();

bot.on('ready', () =>
{
    Logger.info("Bot is ready (message mode)");

    bot.user.setStatus('online')
        .then(() =>
        {
            Logger.info("Bot is online");

            if (send_allowed)
            {
                messages.forEach(payload =>
                {
                    payload.channels.forEach(channel =>
                    {
                        bot.channels.get(channel).send(payload.message).then(() =>
                        {
                            Logger.info(`Msg send to channel id ${channel}`);
                        }).catch(err =>
                        {
                            Logger.fatal(`Error while sending msg to channel id ${channel}\n${err}`);
                        });
                    });
                });
                Logger.info(`Bot finished`);
            }
            else
            {
                Logger.warn(`Can not send. Sending disabled in messages.json.`);
                process.exit();
            }

        })
        .catch(err =>
        {
            Logger.fatal(`Error while setting bot status to online\n${err}`);
            process.exit(1);
        });
});

bot.login(token)
    .then()
    .catch(err =>
    {
        Logger.fatal(`Error on bot login with token!\n${err}`);
        process.exit(1);
    });
