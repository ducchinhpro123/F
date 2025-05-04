const dotenv = require("dotenv");
const ProductController = require('../controller/ProductController');
const UserController = require('../controller/UserController');
const fs = require('fs');
const path = require('path');

const { GoogleGenAI } = require('@google/genai');
const Product = require('../models/Product');
const Category = require('../models/Category');


// load .env file
dotenv.config();

let isInit = false;
let ai = null;
let chat = null; // Chat gemini

class ChatController {
  static init() {
    const key = process.env.GOOGLE_GEMINI_KEY;
    if (!key) {
      throw new Error('Missing GOOGLE_GEMINI_KEY environment variable. Please set it in your .env file.');
    }
    ai = new GoogleGenAI({ vertexai: false, apiKey: key });

    if (!ai) {
      throw new Error('Could not initialize GoogleGenAI');
    }

    const docPath = path.join(__dirname, '../docs/architecture.md');
    if (!docPath) {
      throw new Error(`architecture.md is not exist`);
    }
    let docContent = '';
    try {
      docContent = fs.readFileSync(docPath, 'utf-8');
    } catch (e) {
      console.error('Error loading architecture documentation:', e);
      docContent = 'Documentation not available.';
    }
    console.debug(docContent);

    chat = ai.chats.create({
      model: 'gemini-2.0-flash',

      config: {
        systemInstruction: `
You are a friendly and knowledgeable virtual assistant for ReactJS Group: the members of this group include:
Tony Tèo
Tèo Em
Tèo Anh

, trained to provide excellent customer service. Your role is to help customers with all information about our shop's products, services, pricing, hours, and policies.

Please follow these guidelines:
- Always respond in Vietnamese with a warm, helpful tone
- Be precise and detailed when answering questions about our inventory, pricing, and policies
- Recommend products based on customer needs when appropriate
- If you don't know something, politely inform the customer you'll need to check with staff
- Use simple, easy-to-understand language while maintaining professionalism
- Include specific examples from our product catalog when relevant
- Prioritize customer satisfaction in all interactions

Your knowledge base includes our complete product catalog, business hours, location information, and company policies.

Here is the data that you will need:
${docContent}

        `
      },
    });
    isInit = true;
  }

  static async sendChat(req, res) {
    const content = req.body;
    if (!isInit) {
      ChatController.init();
    }
    if (!ai) {
      return res.status(500).json({ message: 'AI Service not initialized.' });
    }

    try {
      const response = await chat.sendMessage({
        message: content.message
      });

      // Log chat history for debugging
      // const history = chat.getHistory();
      // console.debug('Chat history length:', history.length);

      res.status(200).json({ message: response.text });
    } catch (err) {
      console.error('ChatController error:', err);
      res.status(500).json({ error: "Error processing your request", details: err.message });
    }
  }
}

module.exports = ChatController;
