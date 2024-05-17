import { Client, Message } from "whatsapp-web.js";
import { waitForUserChoice } from "../../../../utils/utils";
import handleOption4 from "./message-option-four";
import handleUserFirstMessage from "../first-message";

async function handleOption3(client: Client, message: Message) {
  const chat = await message.getChat();

  await client.sendMessage(message.from, "Opção número 3. Oi\n[1] 4\n[2] Voltar");
  console.log("Sent option 3 message");

  try {
    const userChoice = await waitForUserChoice(chat, client);
    console.log(`User choice received: ${userChoice}`);

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
        console.log("Sent invalid option message");
        return;
    }
  } catch (err) {
    console.error("Error handling option 3:", err);
  }
}

export default handleOption3;
