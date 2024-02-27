const { SlashCommandBuilder } = require('discord.js');
const OpenAI = require('openai');

// Command: /imagine [prompt]
const imagineCommand = new SlashCommandBuilder()
  .setName('imagine')
  .setDescription('Generate an image based on imaginations.')
  .addStringOption(option =>
    option.setName('prompt')
      .setDescription('The prompt for generating the image.')
      .setRequired(true));

// Replace 'YOUR_API_KEY' with your actual OpenAI API key
const openai = new OpenAI({ apiKey: 'YOUR_API_KEY' });

async function handleImagineCommand(interaction) {
    try {
        const prompt = interaction.options.getString('prompt');

        await interaction.deferReply();

        const image = await openai.images.generate({
            model: 'dall-e-3',
            prompt: prompt
        });

        console.log('OpenAI Image Response:', image);

        const imageUrl = image.data[0].url; 

        await interaction.followUp({ files: [{ attachment: imageUrl, name: 'image.png' }] });

    } catch (error) {
        console.error(error);
        await interaction.reply(`An error occurred: ${error.message}`);
    }
}

module.exports = {
  data: imagineCommand,
  execute: handleImagineCommand
};
