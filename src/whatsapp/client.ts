import { Client, LocalAuth } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import { handleIncomingMessage } from "./messages/incoming-messages";

export async function initializeWhatsAppClient() {
  const botTime = 20000;
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

    client.on('message', (message) => handleIncomingMessage(client, message));


    await client.initialize();
    console.log("WhatsApp client initialized successfully!");
    return client;
  } catch (error) {
    console.error("Error initializing WhatsApp client:", error);
    throw error;
  }
}
