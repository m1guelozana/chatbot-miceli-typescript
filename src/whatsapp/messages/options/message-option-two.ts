import { Client, Message } from "whatsapp-web.js";
import { waitForUserChoice } from "../../../../utils/utils";
import handleOption3 from "./message-option-three";
import handleOption4 from "./message-option-four";
import handleUserFirstMessage from "../first-message";

async function handleOption2(client: Client, message: Message) {
  const chat = await message.getChat();

  await client.sendMessage(message.from, "Opção número 2. Oi\n[1] 3\n[2] 4\n[3] Voltar");
  console.log("Sent option 2 message");

  try {
    const userChoice = await waitForUserChoice(chat, client);
    console.log(`User choice received: ${userChoice}`);

    switch (userChoice) {
      case "1":
        await chat.sendStateTyping();
        await handleOption3(client, message);
        break;
      case "2":
        await chat.sendStateTyping();
        await handleOption4(client, message);
        break;
      case "3":
        await chat.sendStateTyping();
        await handleUserFirstMessage(client, message);
        break;
      default:
        await client.sendMessage(message.from, 'Opção Inválida');
        console.log("Sent invalid option message");
        return;
    }
  } catch (err) {
    console.error("Error handling option 2:", err);
  }
}

export default handleOption2;
