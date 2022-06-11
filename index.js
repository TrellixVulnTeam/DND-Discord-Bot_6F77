require("dotenv").config();
const { Client, Collection, Intents, SelectMenuInteraction, GuildMember} = require("discord.js");
const fs = require("fs");
const sqlite = require("sqlite3").verbose();

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_MEMBERS
    ]});
client.commands = new Collection();

const commandFilesGeneral = fs.readdirSync("./src/commands/general").filter(file => file.endsWith(".js"));
const commandFilesVC = fs.readdirSync("./src/commands/voicechannel").filter(file => file.endsWith(".js"));
const commandFilesRoleMenu = fs.readdirSync("./src/commands/rolemenu").filter(file => file.endsWith(".js"));

// User Interaction/-Commands
const userInteractionFilesWhisper = fs.readdirSync("./src/commands/userinteraction").filter(file => file.endsWith(".js"));

// STRUGGLES WITH EMPTY FILES! CAREFUL
commandFilesGeneral.forEach(commandFile => {
    const commandGeneral = require(`./src/commands/general/${commandFile}`);
    client.commands.set(commandGeneral.data.name, commandGeneral);
});

commandFilesVC.forEach(commandFile => {
    const commandVC = require(`./src/commands/voicechannel/${commandFile}`);
    client.commands.set(commandVC.data.name, commandVC);
});

commandFilesRoleMenu.forEach(commandFile => {
    const commandRoleMenu = require(`./src/commands/rolemenu/${commandFile}`);
    client.commands.set(commandRoleMenu.data.name, commandRoleMenu);
})

// User Interaction Area
userInteractionFilesWhisper.forEach(commandFile => {
    const userWhisper = require(`./src/commands/userinteraction/${commandFile}`);
    client.commands.set(userWhisper.data.name, userWhisper);
})

// ADD HANDLER FOR COMMANDS

client.once("ready", () => {
    console.log(`Ready! Logged in as ${client.user.tag}! I'm on ${client.guilds.cache.size} guild(s)!`)
    client.user.setActivity({name: "the Adventurers", type: "WATCHING"})
    let db = new sqlite.Database('./database.db', sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE);
    switch (db) {
        case true:
            console.log("Database connection successfully established.");
        case false:
            console.log("Couldn't connect to Database, please check stability.");
            client.destroy();
            return;
    }
});

client.on("interactionCreate", async (interaction) => {
    if(interaction.isCommand()) {
        //await interaction.deferReply({ ephermal: false}).catch(() => {});

        let command = client.commands.get(interaction.commandName)
        
        try {
            await command.execute(interaction);
        } catch (error) {
            try {
                await command.execute(interaction);
            } catch (error) {
                if(interaction.deferred || interaction.replied) {
                    interaction.editReply({
                        content: "An error occured while executing this command!",
                        ephemeral: true
                    });
                    console.log(error);
                }else {
                    interaction.reply({
                        content: "An error occured while executing this command!",
                        ephemeral: true
                    });
                    console.log(error);
                }
                return
            }
            return
        }
    } else if(interaction.isSelectMenu()) {
        
        const { values, member } = interaction;

        if(interaction.customId === 'select' && member instanceof GuildMember) {

            let role;

            for(const id of values) {
                member.roles.remove(id);
                role = interaction.guild.roles.cache.find(r => r.id === id);
            }
            // ADD NICKNAME POSSIBILITY WITH IF STATEMENT
            interaction.channel.send(`Removed ${role.name} from ${interaction.member.user.username}`);
            interaction.message.delete();
        }
    }
});

client.login(process.env.token);