import { Client, Message } from "whatsapp-web.js";
import handleUserFirstMessage from "./first-message";
import stateManager from "../../state";
import handleOption1 from "./options/message-option-one";
import handleOption2 from "./options/message-option-two";
import handleOption3 from "./options/message-option-three";
import handleOption4 from "./options/message-option-four";

// Array para armazenar IDs de mensagens processadas recentemente
const processedMessages: string[] = [];

export async function handleIncomingMessage(client: Client, message: Message) {
    console.log(`Received message from ${message.from}: ${message.body}`);

    const chatId = message.from;
    const userState = stateManager.getUserState(chatId);

    if(chatId.endsWith("@g.us")){
        return;
    }

    // Verificar se o usuário está em um estado inicial
    if (userState === 'initial') {
        await handleUserFirstMessage(client, message);
    } else if (userState === 'option1') {
        await handleOption1(client, message);
    } else if (userState === 'option2') {
        await handleOption2(client, message);
    } else if (userState === 'option3') {
        await handleOption3(client, message);
    } else if (userState === 'option4') {
        await handleOption4(client, message);
    }
}
