import { Client, Chat, Message } from "whatsapp-web.js";

export const waitForUserChoice = (chat: Chat, client: Client): Promise<string> => {
    return new Promise((resolve) => {
        const messageListener = async (message: Message) => {
            if (message.from === chat.id._serialized) {
                // Verifica se a mensagem recebida é uma escolha válida (1, 2, 3 ou 4)
                if (["1", "2", "3", "4"].includes(message.body)) {
                    client.removeListener("message", messageListener);
                    resolve(message.body);
                }
            }
        };

        client.on("message", messageListener);
    });
};
