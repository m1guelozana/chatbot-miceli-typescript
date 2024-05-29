import { Client, LocalAuth, Message } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import handleUserFirstMessage from "./messages/first-message";
import { lastInteractionTimes } from "../active-chats";

let client: Client;
let isReady = false;
let isInitializing = false;
let isInSleepMode = new Map<string, boolean>(); // Estado do modo sleep por chatId

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
        isReady = true;
    });

    client.on("authenticated", () => {
        console.log("WhatsApp Client authenticated successfully!");
    });

    client.on("auth_failure", (msg: string) => {
        console.error("Authentication failure:", msg);
    });

    client.on("disconnected", (reason: string) => {
        console.log("WhatsApp Client disconnected:", reason);
        isReady = false;
    });

    client.on("message", async (message: Message) => {
        const chatId = message.from;

        if (chatId.endsWith("@g.us")) {
            return;
        }

        const currentTime = new Date();
        const lastInteractionTime = lastInteractionTimes.get(chatId);

        if (lastInteractionTime) {
            const timeSinceLastInteraction = currentTime.getTime() - lastInteractionTime.getTime();
            const inactivityThreshold = 60000; // Limite de inatividade em milissegundos (1 minuto)

            if (timeSinceLastInteraction >= inactivityThreshold) {
                if (!isInSleepMode.get(chatId)) {
                    console.log("Inactivity detected, sending inactivity message.");
                    const inactivityMessage = "Olá! Parece que não houve atividade por um tempo. Se precisar de ajuda, estou aqui para você. 😊";
                    await client.sendMessage(chatId, inactivityMessage);
                    isInSleepMode.set(chatId, true); // Entra no modo sleep
                }
            }
        }

        lastInteractionTimes.set(chatId, currentTime); // Atualiza o momento da última interação

        if (isInSleepMode.get(chatId)) {
            console.log("Bot is in sleep mode, sending initial message.");
            await handleUserFirstMessage(client, message);
            isInSleepMode.set(chatId, false); // Saindo do modo sleep
        } else {
            console.log("Handling User First Message. New interaction");
            await handleUserFirstMessage(client, message); // Enviando mensagem inicial
        }
    });

    console.log("Step 3: Initializing client...");
    await client.initialize();
    console.log("Page loaded and ready! Connected");

    client.on("qr", (qr: string) => {
        console.log("QR RECEIVED");
        qrcode.generate(qr, { small: true });
    });
}

initializeWhatsAppClient();
