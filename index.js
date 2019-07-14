const Discord = require('discord.js');
const {prefix, token} = require('./config.json');
const bot = new Discord.Client();
const sebbyTag = "sebby#3094"; // sebby#3094 // Horacy#9187
const SEBBY_ID = "368418440060600339";
// const SEBBY_ID = "383327335010664448"; // Horacy#9187 id
const SZYMON_ID = "411161414682804235";
const COOLDOWN_TIME = 10000;
let cooldown = false;
let lastChannelId = "0";

bot.on('ready', () =>
{
    console.log("===== BOT IS ONLINE =====");

    bot.user.setStatus('online')
        .then()
        .catch();
});

const joinBot = function (oldMember, newMember)
{
    let newVoiceCh = newMember.voiceChannel;
    console.log(`Dołączył ${newMember.user.username} (tag: ${newMember.user.tag}) (id: ${newMember.user.id})`);

    if (newMember.user.id === SEBBY_ID || newMember.user.id === SZYMON_ID)
    {
        if (newMember.voiceChannelID === null) lastChannelId = "0";
    }

    if (lastChannelId !== newMember.voiceChannelID && newVoiceCh)
    {
        lastChannelId = newMember.voiceChannelID;
        console.log(`Dołączył ${newMember.user.username} (tag: ${newMember.user.tag}) (id: ${newMember.user.id})`);
        if (newMember.user.id === SEBBY_ID || newMember.user.id === SZYMON_ID)
        {
            newMember.voiceChannel.join().then(connection =>
            {
                if(newMember.user.id === SEBBY_ID) connection.playFile(__dirname + '/media/sewa.m4a');
                if(newMember.user.id === SZYMON_ID) connection.playFile(__dirname + '/media/szymon.m4a');
                // const dispatcher = connection.playFile('/opt/nodejs/sewabot/media/sewa.m4a');

                bot.setTimeout(() =>
                {
                    (bot.voiceConnections).forEach(i =>
                    {
                        i.channel.leave();
                    });
                    console.log("TIME UP! Bot disconnected!");
                }, 5000);
            })
                .catch(() =>
                {
                    // don't handle errors
                });

            cooldown = true;

            bot.setTimeout(() =>
            {
                cooldown = false;
            }, COOLDOWN_TIME);
        }
    }
};

bot.on('voiceStateUpdate', (oldM, newM) =>
{
    if (!cooldown) joinBot(oldM, newM);
});

bot.login(token);
