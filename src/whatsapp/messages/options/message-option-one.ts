import { Client, Message } from "whatsapp-web.js";
import { waitForUserChoice } from "../../../../utils/utils";
import handleOption2 from "./message-option-two";
import handleOption3 from "./message-option-three";
import handleOption4 from "./message-option-four";
import handleUserFirstMessage from "../first-message";

async function handleOption1(client: Client, message: Message) {
  const chat = await message.getChat();
  await client.sendMessage(message.from, "Opção número 1. Oi\n[1]2[2]3[3]4[4]voltar");

  const userChoice = await waitForUserChoice(chat, client);

  switch (userChoice) {
    case "1":
      await chat.sendStateTyping();
      await handleOption2(client, message);
      break;
    case "2":
      await chat.sendStateTyping();
      await handleOption3(client, message);
      break;
    case "3":
      await chat.sendStateTyping();
      await handleOption4(client, message);
      break;
    case "4":
      await chat.sendStateTyping();
      await handleUserFirstMessage(client, message);
      break;
    default:
      await client.sendMessage(message.from, 'Opção Inválida');
  }
}

export default handleOption1;
