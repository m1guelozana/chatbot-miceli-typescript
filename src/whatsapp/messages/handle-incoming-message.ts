import { Client, Message } from "whatsapp-web.js";
import handleUserFirstMessage from "./first-message"

export async function handleIncomingMessage(client: Client, message: Message) {
    console.log(`Received message from ${message.from}: ${message.body}`);
    await handleUserFirstMessage(client, message);
}
