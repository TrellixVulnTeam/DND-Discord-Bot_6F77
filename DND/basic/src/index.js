require("dotenv").config();
const {Client, Intents, Collection} = require("discord.js");
const config = require('../config.json');

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_MEMBERS
    ]
});
client.commands = new Collection();

client.once("ready", () => {
    console.log(`Ready! Logged in as ${client.user.tag}! I'm on ${client.guilds.cache.size} guild(s)!`)
    client.user.setActivity({name: "the Adventurers", type: "WATCHING"})
});

client.on("interactionCreate", async (interaction) => {
    if(interaction.isCommand()) {
        //await interaction.deferReply({ ephermal: false}).catch(() => {});

        const command = client.commands.get(interaction.commandName)
        
        try {
            await command.execute(interaction);
        } catch (error) {
            try {
                await command.execute(interaction);
            } catch (error) {
                if(interaction.deferred || interaction.replied) {
                    interaction.editReply("An error occured while executing this command!");
                    console.log(error);
                }else {
                    interaction.reply("An error occured while executing this command!");
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
            interaction.channel.send(`Removed ${role} from ${interaction.member.user.username}`);
            interaction.message.delete();
        }
    }
});

client.login(process.env.token);