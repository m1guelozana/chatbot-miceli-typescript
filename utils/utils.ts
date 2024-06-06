import { Client, Chat, Message } from "whatsapp-web.js";

export const waitForUserChoice = (chat: Chat, client: Client): Promise<string> => {
    return new Promise((resolve) => {
        const messageListener = async (message: Message) => {
            if (message.from === chat.id._serialized) {
                // Verifica se a mensagem recebida é uma escolha válida (1, 2, 3 ou 4)
                if (["1", "2", "3", "4"].includes(message.body)) {
                    console.log(`User choice ${message.body} received from chat ${message.from}`);
                    client.removeListener("message", messageListener);
                    resolve(message.body);
                } else {
                    console.log(`Invalid choice ${message.body} received from chat ${message.from}`);
                }
            }
        };

        console.log(`Waiting for user choice in chat ${chat.id._serialized}`);
        client.on("message", messageListener);
    });
};
