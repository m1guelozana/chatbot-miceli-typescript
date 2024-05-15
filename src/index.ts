// src/index.ts
import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

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

client.on('message', message => {
  console.log(`Received message: ${message.body}`);
  if (message.body === 'ping') {
    message.reply('pong');
  }
});

client.initialize();
