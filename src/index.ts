// src/index.ts
import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import handleUserFirstMessage from './messages/first-message'

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

client.on('message', async (message) => {
  console.log(`Received message: ${message.body}`);
  await handleUserFirstMessage(client, message);
});

client.initialize();
