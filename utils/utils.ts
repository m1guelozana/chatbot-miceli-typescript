import { Chat, Message } from "whatsapp-web.js";

export async function waitForUserChoice(chat: Chat): Promise<string> {
  console.log("Waiting for user choice...");
  while (true) {
    const messages: Message[] = await chat.fetchMessages({ limit: 1 });
    const userChoice: string = messages[0]?.body?.trim();
    if (userChoice && ["1", "2", "3", "4"].includes(userChoice)) {
      console.log(`User choice: ${userChoice}`);
      return userChoice;
    }
    console.log("Invalid choice, waiting...");
    await sleep(1000);
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
