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
        startInactivityCheck();
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
    
        // Se o atendente humano enviar "Atendimento encerrado", sair do modo sleep
        if (message.body.toLowerCase() === "atendimento encerrado") {
            isInSleepMode.set(chatId, false);
            await client.sendMessage(chatId, "Atendimento encerrado. Se precisar de mais ajuda, estou aqui.");
            return;
        }
    
        // Atualiza o momento da última interação
        lastInteractionTimes.set(chatId, currentTime);
    
        // Verifica se o chat está em modo sleep
        if (isInSleepMode.get(chatId)) {
            console.log("Bot is in sleep mode, sending initial message.");
            await handleUserFirstMessage(client, message);
            isInSleepMode.set(chatId, false); // Saindo do modo sleep
            return; // Retorna para evitar o processamento adicional
        }
    
        console.log("Handling User First Message. New interaction");
        await handleUserFirstMessage(client, message); // Enviando mensagem inicial
    });
    

    console.log("Step 3: Initializing client...");
    await client.initialize();
    console.log("Page loaded and ready! Connected");

    client.on("qr", (qr: string) => {
        console.log("QR RECEIVED");
        qrcode.generate(qr, { small: true });
    });
}

function startInactivityCheck() {
    const inactivityThreshold = 60000; // 1 minuto para teste, ajuste conforme necessário
    setInterval(async () => {
        const currentTime = new Date();

        for (const [chatId, lastInteractionTime] of lastInteractionTimes) {
            const timeSinceLastInteraction = currentTime.getTime() - lastInteractionTime.getTime();

            if (timeSinceLastInteraction >= inactivityThreshold) {
                if (!isInSleepMode.get(chatId)) {
                    console.log("Inactivity detected, sending inactivity message.");
                    const inactivityMessage = "Olá! Parece que não houve atividade por um tempo. Se precisar de ajuda, estou aqui para você. 😊";
                    await client.sendMessage(chatId, inactivityMessage);
                    isInSleepMode.set(chatId, true); // Entra no modo sleep
                }
            }
        }
    }, 30000); // Verifica a cada 30 segundos
}

initializeWhatsAppClient();