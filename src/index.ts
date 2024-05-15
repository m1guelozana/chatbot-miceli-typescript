// src/index.ts
import express from 'express';
import { initializeWhatsAppClient } from './whatsapp/client';

const app = express();
const port = 3000;

initializeWhatsAppClient().then(client => {
  console.log('WhatsApp client initialized successfully!');
  app.listen(port, () => {
    console.log(`Server running on: http://localhost:${port}`);
  });
}).catch(error => {
  console.error('Error initializing WhatsApp client:', error);
});
