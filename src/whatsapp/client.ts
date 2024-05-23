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
                timeout: 120000,
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

        client.on("change_state", (state) => {
            console.log("Status: ", state);
        });

        client.on("message", async (message) => {
            const chatId = message.from;
            activeChats.add(chatId);
            clearInactivityTimer();
            console.log(`Received message from ${chatId}: ${message.body}`);
            await handleIncomingMessage(client, message); // Verificar se essa linha está correta
            startInactivityTimer();
        });

        await client.initialize();
        console.log("WhatsApp client initialized successfully!");
    } catch (error) {
        console.error("Error initializing WhatsApp client:", error);
        throw error;
    }
}

function startInactivityTimer() {
    inactivityTimer = setTimeout(() => {
        console.log("Inactivity timeout reached. Shutting down the bot...");
        sendInactivityMessages(); // Enviar mensagem de inatividade
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
