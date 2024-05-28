import { Client, LocalAuth, Message, WAState } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import handleUserFirstMessage from "./messages/first-message";

let client: Client;
let inactivityTimer: NodeJS.Timeout | null = null;
const activeChats: Set<string> = new Set();
let isReady = false;
let isInitializing = false; // Flag para evitar múltiplas inicializações

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function initializeWhatsAppClient(): Promise<void> {
  if (isInitializing) {
    return;
  }

  isInitializing = true;
    console.log("Step 1: Initializing WhatsApp client...");
    client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        executablePath:
          "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        timeout: 0,
      },
      webVersion: "2.2409.2",
      webVersionCache: {
        type: "remote",
        remotePath:
          "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2409.2.html",
      },
    });

    console.log("Step 2: Setting up event listeners...");

    client.on("ready", () => {
      console.log("WhatsApp Client is ready!");
      isReady = true; // Cliente está pronto
      startInactivityTimer();
    });

    client.on("authenticated", () => {
      console.log("WhatsApp Client authenticated successfully!");
    });

    client.on("auth_failure", (msg: string) => {
      console.error("Authentication failure:", msg);
    });

    client.on("disconnected", (reason: string) => {
      console.log("WhatsApp Client disconnected:", reason);
      clearInactivityTimer();
      isReady = false; // Cliente não está mais pronto
    });

    client.on("message", async (message: Message) => {
      const chatId = message.from;
      activeChats.add(chatId);
      clearInactivityTimer();
      console.log(`Received message from ${chatId}: ${message.body}`);
      if(chatId.endsWith("@g.us")){
          return;
      }
      await handleUserFirstMessage(client, message)
      startInactivityTimer();
    });

    console.log("Step 3: Initializing client...");
    await client.initialize();
    console.log("Page loaded and ready! Connected");

    client.on("qr", (qr: string) => {
      console.log("QR RECEIVED");
      qrcode.generate(qr, { small: true });
    });

function startInactivityTimer() {
  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
  }
  inactivityTimer = setTimeout(() => {
    console.log("Inactivity timeout reached. Sending messages...");
    sendInactivityMessages();
  }, 30000);
  inactivityMessageSent = false;
}

function clearInactivityTimer() {
  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
    inactivityTimer = null;
  }
}

let inactivityMessageSent = false; // Mantém controle se a mensagem de inatividade já foi enviada

async function sendInactivityMessages() {
    let state = await client?.getState();
    if (!client || state !== WAState.CONNECTED) {
      if (!inactivityMessageSent) {
        inactivityMessageSent = true;
        for (const chatId of activeChats) {
          try {
            const chat = await client.getChatById(chatId);
            if (!chat.isGroup) {
              const inactivityMessage =
                "Olá! Parece que não houve atividade por um tempo. Se precisar de ajuda, estou aqui para você. 😊";
              await client.sendMessage(chatId, inactivityMessage);
              console.log("Inactivity message sent successfully to:", chatId);
            }
          } catch (error) {
            console.error("Error sending inactivity messages:", error);
          }
        }
      }
    }
  }
}

initializeWhatsAppClient();
