import { Chat, Client, Message } from "whatsapp-web.js";

export async function waitForUserChoice(chat: Chat, client: Client): Promise<string> {
    return new Promise(async (resolve, reject) => {
        try {
            // Obter o ID da última mensagem
            const lastMessageId = (await chat.fetchMessages({ limit: 1 }))[0].id._serialized;
            console.log("Last message ID:", lastMessageId);

            const listener = async (message: Message) => {
                try {
                    // Verificar se a mensagem é do chat esperado e não é a última mensagem anteriormente obtida
                    if (message.from === chat.id._serialized && message.id._serialized !== lastMessageId) {
                        const userChoice: string = message.body?.trim();
                        // Verificar se a escolha do usuário é válida
                        if (userChoice && ["1", "2", "3", "4"].includes(userChoice)) {
                            client.removeListener("message", listener); // Remover o ouvinte após capturar a escolha
                            resolve(userChoice);
                        } else {
                            await client.sendMessage(message.from, "Opção Inválida. Por favor, selecione uma opção válida.");
                        }
                    }
                } catch (error) {
                    client.removeListener("message", listener); // Remover o ouvinte em caso de erro
                    reject(error);
                }
            };

            // Adicionar o ouvinte de mensagens
            client.on("message", listener);
        } catch (error) {
            reject(error);
        }
    });
}
