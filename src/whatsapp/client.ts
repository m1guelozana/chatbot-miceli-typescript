// src/whatsapp/index.ts
import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import handleUserFirstMessage from './messages/first-message';

export async function initializeWhatsAppClient() {
  const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
      headless: false,
    }
  });

  client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
  });

  client.on('ready', () => {
    console.log('Client is ready!');
  });

  client.on('first_message', async (message) => {
    const chat = await message.getChat();
    await chat.sendStateTyping();
    console.log(`Received message: ${message.body}`);
    if (message.type.toLowerCase() == "e2e_notification") return null;
    else if (message.type.toLowerCase() == "ciphertext") return null;
    else if (message.body === "") return null;
    else if (message.body !== null) {
      await handleUserFirstMessage(client, message);
    }  
  });

  await client.initialize();
  return client;
}
