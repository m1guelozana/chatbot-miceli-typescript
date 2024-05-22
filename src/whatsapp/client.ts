import { Client, Message, LocalAuth } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import { handleIncomingMessage } from "./messages/incoming-messages";
import handleUserFirstMessage from "./messages/first-message";


let inactivityTimers: { [key: string]: NodeJS.Timeout } = {};
const INACTIVITY_TIMEOUT = 60000;

export async function shutDownByTime(client: Client, message: Message) {
    const chatId = message.from;
    clearTimeout(inactivityTimers[chatId]); 
    inactivityTimers[chatId] = setTimeout(() => {
        restartConversation(client, message);
    }, INACTIVITY_TIMEOUT);
}

export async function restartConversation(client: Client, message: Message) {
  const chatId = message.from;
  console.log(`Restarting conversation with ${chatId}`);
  try {
      clearTimeout(inactivityTimers[chatId]); 
      delete inactivityTimers[chatId]; 

      const chat = await client.getChatById(chatId);
      const pendingMessages = await chat.fetchMessages({ limit: 1 });
      await Promise.all(pendingMessages.map(msg => msg.delete()));

      await client.sendMessage(chatId, 'Oi, você está aí? Caso precise de nós novamente, nos envie uma mensagem e iremos atender você. Obrigado e tenha um bom dia ❤🤗');

      await new Promise(resolve => setTimeout(resolve, 2000));
  } catch (error) {
      console.error(`Error restarting conversation with ${chatId}:`, error);
  }
}


export async function initializeWhatsAppClient() {
  try {
    console.log("Initializing WhatsApp client...");
    const client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
      },
      webVersion: "2.2409.2",
      webVersionCache: {
        type: "remote",
        remotePath:
          "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2409.2.html",
      },
    });

    client.on("qr", (qr) => {
      console.log("QR RECEIVED");
      qrcode.generate(qr, { small: true });
    });

    client.on("ready", () => {
      console.log("WhatsApp Client is ready!");
    });

    client.on('change_state', state => {
      console.log('Status: ', state );
    }); 

    client.on('message', async (message) => {
      if (message.from !== client.info.wid.user) {
        await handleIncomingMessage(client, message);
      }
    });

    await client.initialize();
    console.log("WhatsApp client initialized successfully!");
    return client;
  } catch (error) {
    console.error("Error initializing WhatsApp client:", error);
    throw error;
  }
}
