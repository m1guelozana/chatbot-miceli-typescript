// utils/utils.ts
import { Chat, Message } from "whatsapp-web.js";

export async function waitForUserChoice(chat: Chat): Promise<string> {
  while (true) {
    const messages: Message[] = await chat.fetchMessages({ limit: 1 });
    const userChoice: string = messages[0]?.body?.trim();
    if (userChoice && ["1", "2", "3", "4"].includes(userChoice)) {
      return userChoice;
    }
    await sleep(1000);
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
