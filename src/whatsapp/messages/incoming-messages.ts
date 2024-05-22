import { Client, Message } from 'whatsapp-web.js';
import handleUserFirstMessage from './first-message';

export async function handleIncomingMessage(client: Client, message: Message) {
    if (message.from === "status@broadcast" || message.type.toLocaleLowerCase() === "broadcast_notification") {
        return null;
    }

    if (message.body !== null && !message.from.includes('@c.us')) {
        return null;
    }

    handleUserFirstMessage(client, message);
}
