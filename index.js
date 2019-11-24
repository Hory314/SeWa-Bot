require('./Logger');
const Discord = require('discord.js');
const {token} = require('./config.json');
const members = require('./members');
const Logger = require('./Logger.js');
const logger = new Logger();
const bot = new Discord.Client();
const COOLDOWN_TIME = 10000;
let cooldown = false;


const joinBot = function (oldMember, newMember)
{
    if (newMember.user.id === getMemberDiscordIdByName("Sewa Bot")) return; // don't handle bot himself

    let newUserChannel = newMember.voiceChannel;
    let oldUserChannel = oldMember.voiceChannel;

    try
    {
        if (oldUserChannel === undefined && newUserChannel !== undefined) // user joins a voice channel
        {
            logger.append(`${newMember.user.username} (id: ${newMember.user.id}) przychodzi na kanał ${newMember.voiceChannel.name}: `);
            if (!cooldown)
            {
                // noinspection JSUnresolvedFunction
                let member = members.find(member => member['discord-id'] === newMember.user.id);

                if (member !== undefined)
                {
                    logger.append(`znaleziono jako ${member.name}: `);
                    let voiceChannel = newMember.voiceChannel;
                    voiceChannel.join()
                        .then(connection =>
                        {
                            let dispatcher = connection.playFile(__dirname + member['play-file']);
                            logger.info(`odtwarzam ${member['play-file']}`);
                            cooldown = true; // setting cooldown, if correctly played file

                            dispatcher.on("end", () =>
                            {
                                voiceChannel.leave();
                            });
                        })
                        .catch((err) =>
                        {
                            logger.error(`błąd odtwarzania\n${err}`);
                        });

                    bot.setTimeout(() =>
                    {
                        cooldown = false;
                    }, COOLDOWN_TIME);
                }
                else
                {
                    logger.info("nie znaleziono");
                }
            }
            else
            {
                logger.info(`cooldown aktywny`);
            }
        }
        else if (newUserChannel === undefined) // user leaves a voice channel
        {
            Logger.info(`${newMember.user.username} (id: ${newMember.user.id}) odchodzi z kanału ${oldMember.voiceChannel.name}`);
        }
        else // user switches a voice channel (or mute / unmute / mic-source-change todo: implement later)
        {
            let oldC = oldMember.voiceChannel.name;
            let newC = newMember.voiceChannel.name;
            if (oldC !== newC)
            {
                Logger.info(`${newMember.user.username} (id: ${newMember.user.id}) zmienia kanał ${oldC} -> ${newC}`);
            }
            else
            {
                Logger.info(`${newMember.user.username} (id: ${newMember.user.id}) mutuje/odmutowuje się (lub zmienił źródło nagrywania)`);
            }
        }
    }
    catch (e)
    {
        Logger.fatal(`General Exception while user join/leave/switch voice channel.\n${e}`);
        // to not exit, try to stay alive
    }
};

bot.on('voiceStateUpdate', (oldM, newM) =>
{
    joinBot(oldM, newM);
});

bot.on('ready', () =>
{
    Logger.info("Bot is ready");

    bot.user.setStatus('online')
        .then(() => Logger.info("Bot is online"))
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

function getMemberDiscordIdByName(name)
{
    // noinspection JSUnresolvedFunction
    let member = members.find(member => member['name'] === name);
    return member["discord-id"];
}
