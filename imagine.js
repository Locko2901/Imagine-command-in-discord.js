const { SlashCommandBuilder } = require('discord.js');
const OpenAI = require('openai');

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

        if (!image.data || image.data.length === 0) {
            throw new Error('Empty response from OpenAI.');
        }

        const { url: imageUrl, revised_prompt: revisedPrompt } = image.data[0];
        await interaction.followUp({ files: [{ attachment: imageUrl, name: 'image.png' }] });
        await interaction.followUp({ ephemeral: true, content: `Prompt used: ${revisedPrompt}` });
      } catch (error) {
        console.error(error);
        if (error.status === 400 && error.error && error.error.code === 'content_policy_violation') {
            await interaction.followUp({ ephemeral: true, content: 'Sorry, the prompt was filtered by the safety system. Please try a different prompt.' });
        } else {
            await interaction.followUp({ ephemeral: true, content: 'Sorry, an error occurred while generating the image.' });
        }
    }
}

module.exports = {
  data: imagineCommand,
  execute: handleImagineCommand
};
