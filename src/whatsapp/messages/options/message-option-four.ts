import { Client, Message } from "whatsapp-web.js";
import { waitForUserChoice } from "../../../../utils/utils";
import handleUserFirstMessage from "../first-message";

async function handleOption4(client: Client, message: Message) {
  const chat = await message.getChat();
  
  await client.sendMessage(message.from, "Opção número 4. Oi\n[1]voltar");
  console.log("Sent option 4 message");

  try {
    const userChoice = await waitForUserChoice(chat, client);

    if (userChoice === "1") {
      await chat.sendStateTyping();
      await handleUserFirstMessage(client, message);
    } else {
      await chat.sendStateTyping();
      await client.sendMessage(message.from, "Opção inválida. Por favor, selecione uma opção válida");
      console.log("Sent invalid option message");
    }
  } catch (err) {
    console.error("Error handling option 4:", err);
  }
}

export default handleOption4;
