require("dotenv").config();
const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const commands = [];


// filter every .js file out of the directories to pass over to the functions below
// Commands
const commandFilesGeneral = fs.readdirSync("./src/commands/general").filter(file => file.endsWith(".js"));
const commandFilesVC = fs.readdirSync("./src/commands/voicechannel").filter(file => file.endsWith(".js"));
const commandFilesRoleMenu = fs.readdirSync("./src/commands/rolemenu").filter(file => file.endsWith(".js"));
const userInteractionFilesWhisper = fs.readdirSync("./src/commands/userinteraction").filter(file => file.endsWith(".js"));

// work on this project ON ANOTHER FILE
// const eventsystemFilesEventSystem = fs.readdirSync("./src/eventsystem/").filter(file => file.endsWith(".js"));

// Command Section

    commandFilesGeneral.forEach(commandFile => { // create input for each file in the directory 
        // for the commands array
        const commandGeneral = require(`./general/${commandFile}`);
        commands.push(commandGeneral.data.toJSON());
    });
    
    commandFilesVC.forEach(commandFile => { // create input for each file in the directory 
        // for the commands array
        const commandVC = require(`./voicechannel/${commandFile}`);
        commands.push(commandVC.data.toJSON());
    })
    
    commandFilesRoleMenu.forEach(commandFile => {
        const commandRoleMenu = require(`./rolemenu/${commandFile}`);
        commands.push(commandRoleMenu.data.toJSON());
    })
    
    // Event System Section
    
    // commandFilesEventSystem.forEach(commandFile => {
    //     const commandEventSystem = require(`./eventsystem/${commandFile}`);
    //     commands.push(commandEventSystem.data.toJSON());
    // })
    
    userInteractionFilesWhisper.forEach(commandFile => {
        const userWhisper = require(`./userinteraction/${commandFile}`);
        commands.push(userWhisper.data.toJSON());
    })
    
    const restClient = new REST({version: "9"}).setToken(process.env.token);
    
    
    restClient
        .put(Routes.applicationGuildCommands(process.env.application_id, process.env.guild_id), // guild_id used for programming. 
        // commands will be registered instantly on that guild, globally it can take up to 1 hour to be visible.
            {body: commands})
            .then(() => console.log(`Sucessfully registered ${commands.size} commands!`))
            .catch(console.error);
    
