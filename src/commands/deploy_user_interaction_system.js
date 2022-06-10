require("dotenv").config();
const fs = require("fs");
const { REST } = require("@discordjs/rest");
const user_interactions = [];

const userInteractionFilesWhisper = fs.readdirSync("./src/commands/userinteraction/").filter(file => file.endsWith(".js"));

userInteractionFilesWhisper.forEach(commandFile => {
    const userInteractionFilesWhisper = require(`./src/commands/userinteraction/${commandFile}`);
    user_interactions.push(userInteractionFilesWhisper.data.toJSON());
})

const restClient = new REST({version: "9"}).setToken(process.env.token);

restClient
    .put(Routes.applicationGuildCommands(process.env.application_id, '981418046335909918'), // guild_id used for programming. 
    // commands will be registered instantly on that guild, globally it can take up to 1 hour to be visible.
        {body: commands})
        .then(() => console.log(`Sucessfully registered ${user_interactions.size} user interactions!`))
        .catch(console.error);