const { SlashCommandBuilder } = require("@discordjs/builders");
const { execute } = require("../userinteraction/whisper");
const sqlite = require("sqlite3").verbose();
let database = new sqlite.Database('./database.db', sqlite.OPEN_READWRITE);

module.exports = {
    data: new SlashCommandBuilder().setName("database")
        .setDescription("Database configuration. [ADMIN ONLY]"),
        async execute(interaction) {

            const member = interaction.member;
            if(member.user.id !== "348781333839085569") {
                interaction.reply("No permissions.");
                return;
            } else {

            }
        }
}