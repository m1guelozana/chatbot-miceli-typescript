import { Client, LocalAuth } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import { handleIncomingMessage } from "./messages/incoming-messages";

let inactivityTimers: { [key: string]: NodeJS.Timeout } = {};
const INACTIVITY_TIMEOUT = 60000;

async function shutDownByTime(client: Client, chatId: string) {
    clearTimeout(inactivityTimers[chatId]); 
    inactivityTimers[chatId] = setTimeout(() => {
        restartConversation(client, chatId);
    }, INACTIVITY_TIMEOUT);
    const chat = await client.getChatById(chatId);
    await client.sendMessage(chat.id._serialized, 'Oi, você está aí? Não detectei mais nenhuma atividade sua. Caso precise de mim novamente, envie uma mensagem.')
}

async function restartConversation(client: Client, chatId: string) {
    console.log(`Restarting conversation with ${chatId}`);
    try {
        await shutDownByTime(client, chatId);
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
        headless: false,
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
      clearTimeout(inactivityTimers[message.from]); 
      inactivityTimers[message.from] = setTimeout(() => {
          restartConversation(client, message.from);
      }, INACTIVITY_TIMEOUT);
      await handleIncomingMessage(client, message);
    });


    await client.initialize();
    console.log("WhatsApp client initialized successfully!");
    return client;
  } catch (error) {
    console.error("Error initializing WhatsApp client:", error);
    throw error;
  }
}
