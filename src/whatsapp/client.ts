import { Client, LocalAuth } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import { handleIncomingMessage } from "./messages/handle-incoming-message";

let client: Client;
let inactivityTimer: NodeJS.Timeout | null = null;
const activeChats: Set<string> = new Set();

export async function initializeWhatsAppClient() {
    try {
        console.log("Initializing WhatsApp client...");
        client = new Client({
            authStrategy: new LocalAuth(),
            puppeteer: {
                headless: true,
                args: ["--no-sandbox", "--disable-setuid-sandbox"],
                executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
                timeout: 0,
            },
            webVersion: "2.2409.2",
            webVersionCache: {
                type: "remote",
                remotePath: "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2409.2.html",
            },
        });

        client.on("qr", (qr) => {
            console.log("QR RECEIVED");
            qrcode.generate(qr, { small: true });
        });

        client.on("ready", () => {
            console.log("WhatsApp Client is ready!");
        });

        client.on("authenticated", () => {
            console.log("WhatsApp Client authenticated successfully!");
        });

        client.on("auth_failure", (msg) => {
            console.error("Authentication failure:", msg);
        });

        client.on("disconnected", (reason) => {
            console.log("WhatsApp Client disconnected:", reason);
        });

        client.on("message", async (message) => {
            const chatId = message.from;
            activeChats.add(chatId);
            clearInactivityTimer();
            console.log(`Received message from ${chatId}: ${message.body}`);
            await handleIncomingMessage(client, message); 
            startInactivityTimer();
        });

        await client.initialize();
    } catch (error) {
        console.error("Error initializing WhatsApp client:", error);
        throw error;
    }
}

function startInactivityTimer() {
    inactivityTimer = setTimeout(() => {
        console.log("Inactivity timeout reached. Shutting down the bot...");
        sendInactivityMessages();
        client.destroy();
    }, 60000);
}

function clearInactivityTimer() {
    if (inactivityTimer) {
        clearTimeout(inactivityTimer);
        inactivityTimer = null;
    }
}

async function sendInactivityMessages() {
    try {
        const inactivityMessage = "Olá! Parece que não houve atividade por um tempo. Se precisar de ajuda, estou aqui para você. 😊";
        for (const chatId of activeChats) {
            await client.sendMessage(chatId, inactivityMessage);
        }
        console.log("Inactivity messages sent successfully!");
    } catch (error) {
        console.error("Error sending inactivity messages:", error);
    }
}

initializeWhatsAppClient();
