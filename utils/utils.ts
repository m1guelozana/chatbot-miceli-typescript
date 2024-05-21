import { Chat, Client, Message } from "whatsapp-web.js";

export async function waitForUserChoice(chat: Chat, client: Client): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const lastMessageId = (await chat.fetchMessages({ limit: 1 }))[0].id._serialized;
    console.log("Last message ID:", lastMessageId);

    const listener = async (message: Message) => {
      try {
        if (message.from === chat.id._serialized && message.id._serialized !== lastMessageId) {
          const userChoice: string = message.body?.trim();
          if (userChoice && ["1", "2", "3", "4"].includes(userChoice)) {
            client.removeListener("message", listener);
            resolve(userChoice);
          } else {
            await client.sendMessage(message.from, "Opção Inválida. Por favor, selecione uma opção válida.");
          }
        }
      } catch (error) {
        client.removeListener("message", listener);
        reject(error);
      }
    };

    client.on("message", listener);
  });
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
