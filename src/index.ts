// src/index.ts
import express from 'express';
import { initializeWhatsAppClient } from './whatsapp/client';

const app = express();
const port = 3000;

initializeWhatsAppClient().then(client => {
  console.log('WhatsApp client initialized successfully!');
  client.on('message', message => {
    console.log(`Received message from ${message.from}: ${message.body}`);
  });
}).catch(error => {
  console.error('Error initializing WhatsApp client:', error);
});

app.get('/', (req, res) =>{
  res.send('')
});

app.listen(port, () => {
  console.log(`Server running on: http://localhost:${port}`)
});
