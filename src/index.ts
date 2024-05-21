import express from 'express';
import { initializeWhatsAppClient } from './whatsapp/client';

const app = express();
const port = 8000; 

initializeWhatsAppClient().then(client => {
    console.log('WhatsApp client initialized successfully!');
  
}).catch(error => { 
    console.error('Error initializing WhatsApp client:', error);
});

app.get('/', (req, res) => {
  res.send('WhatsApp Bot is running');
});

app.listen(port, () => {
  console.log(`Server running on: http://localhost:${port}`);
});
