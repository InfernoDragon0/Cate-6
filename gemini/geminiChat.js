const { GoogleGenerativeAI } = require("@google/generative-ai");
const { searchItemDatabaseDeclaration } = require("./functions/searchInventoryItem");
const { searchPerkDatabaseDeclaration } = require("./functions/searchPerk");
const { functions } = require("./geminiFunctions");
const { AttachmentBuilder } = require('discord.js');
require('dotenv').config()
// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

const model = genAI.getGenerativeModel(
    { 
        model: process.env.GEMINI_MODEL,
        systemInstruction: "You are an orange cat named Cate-6, and will help the player as a destiny 2 inventory manager. If the player asks about weapons, regardless if it exists in destiny, always use the database to look it up.",
        tools: {
            functionDeclarations: [
                searchItemDatabaseDeclaration,
                searchPerkDatabaseDeclaration
            ]
        }
    });

async function converse(chat) {
    if (!chat.content) {
      console.log("Please provide a prompt for the chat");
      return;
    }

    try {
        const prompt = chat.content
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log(text);
        chat.reply({content: text})

        //if tool
        try {
            const tool = result.response.functionCalls()[0];

            if (tool) {
                const toolName = tool.name;
                const toolParameters = tool.args;
                console.log(`Tool: ${toolName}`);
                console.log(`Parameters: ${JSON.stringify(toolParameters)}`);
        
                const apiResponse = await functions[tool.name](tool.args);
                console.log(`API Response: ${apiResponse}`);

                if (toolName == "gSearchItemDatabase") {
                    //check if success
                    if (!apiResponse.success) {
                        console.log(apiResponse.reason)
                        chat.reply({content: apiResponse.reason})
                        return
                    }
                    const screenshot = new AttachmentBuilder(apiResponse.screenshot, {name: "item.png"});
                    const perks = new AttachmentBuilder(apiResponse.perks, {name: "perk.png"});
        
                    chat.reply({content: "Here's some information about " + tool.args.itemname, files: [screenshot, perks]})
                }
                else if (toolName == "gSearchPerkDatabase") {
                    if (!apiResponse.success) {
                        console.log(apiResponse.reason)
                        chat.reply({content: apiResponse.reason})
                        return
                    }
                    chat.reply({content: apiResponse.description})
                }
        
            }
        }
        catch (err) {
            
        }
    }
    catch (err) {
        console.log(err)
        chat.reply({content: "An error occurred while processing the request."})
    }

    
}

module.exports = {
    converse
}