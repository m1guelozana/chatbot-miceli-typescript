import { Client, Chat, Message } from "whatsapp-web.js";

export const waitForUserChoice = (chat: Chat, client: Client): Promise<string> => {
    return new Promise((resolve) => {
        const messageListener = async (message: Message) => {
            if (message.from === chat.id._serialized) {
                client.removeListener("message", messageListener);
                resolve(message.body);
            }
        };

        client.on("message", messageListener);
    });
};
