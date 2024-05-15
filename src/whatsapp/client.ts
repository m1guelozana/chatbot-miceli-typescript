// src/whatsapp/index.ts
import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import handleUserFirstMessage from './messages/first-message';

export async function initializeWhatsAppClient() {
  const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
      headless: false,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox"
      ]
    }
  });

  client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
  });

  client.on('ready', () => {
    console.log('Client is ready!');
  });

  client.on('first_message', async (message) => {
    console.log(`Received message: ${message.body}`);
    if (!message.body || message.type.toLowerCase() == "e2e_notification" || message.type.toLowerCase() == "ciphertext") return null;
    await handleUserFirstMessage(client, message);
  });

  await client.initialize();
  return client;
}
