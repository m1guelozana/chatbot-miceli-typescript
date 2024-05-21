import { Client, Message } from "whatsapp-web.js";
import { waitForUserChoice } from "../../../../utils/utils";
import handleOption4 from "./message-option-four";
import handleUserFirstMessage from "../first-message";

async function handleOption3(client: Client, message: Message) {
  const chat = await message.getChat();
  console.log("Handling option 1");

  await client.sendMessage(message.from, "Opção número 1.\n[1]4\n[2]voltar");

  try {
    const userChoice = await waitForUserChoice(chat, client);
    console.log(`User choice received in option 1: ${userChoice}`);

    switch (userChoice) {
      case "1":
        await chat.sendStateTyping();
        await handleOption4(client, message);
        break;
      case "2":
        await chat.sendStateTyping();
        await handleUserFirstMessage(client, message);
        break;
      default:
        await client.sendMessage(message.from, 'Opção Inválida');
        console.log("Sent invalid option message in option 1");
        return;
    }
  } catch (err) {
    console.error("Error handling option 1:", err);
  }
}

export default handleOption3;
