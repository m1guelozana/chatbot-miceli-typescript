import { Client, LocalAuth } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import handleUserFirstMessage from "./messages/first-message";

export async function initializeWhatsAppClient() {
  try {
    console.log("Initializing WhatsApp client...");
    const client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\Chrome.exe'
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

    client.on("message", async (message) => {
      console.log(`Received message from ${message.from}: ${message.body}`);
      if (
        !message.body ||
        message.type.toLowerCase() == "e2e_notification" ||
        message.type.toLowerCase() == "ciphertext"
      ) {
        console.log("Ignored message type or empty message");
        return;
      }
      await handleUserFirstMessage(client, message);
    });

    await client.initialize();
    console.log("WhatsApp client initialized successfully!");
    return client;
  } catch (error) {
    console.error("Error initializing WhatsApp client:", error);
    throw error;
  }
}
