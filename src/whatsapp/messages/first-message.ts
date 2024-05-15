import { Client, Message } from "whatsapp-web.js";
import { waitForUserChoice } from "../../../utils/utils";
import handleOption1 from "./options/message-option-one";
import handleOption2 from "./options/message-option-two";
import handleOption3 from "./options/message-option-three";
import handleOption4 from "./options/message-option-four";

const handleUserFirstMessage = async (client: Client, message: Message) => {
  const chat = await message.getChat();
  const userMessage = message.body.trim();

  console.log(`Handling message: ${userMessage}`);

  await client.sendMessage(
    message.from,
    "Olá!\n Obrigado por entrar em contato conosco. Escolha uma opção para continuarmos.\n[1]\n[2]\n[3]\n[4]"
  );

  const userChoice: String = await waitForUserChoice(chat);
  console.log(`User choice received: ${userChoice}`);
  switch (userChoice) {
    case "1":
      await chat.sendStateTyping();
      await handleOption1(client, message);
      break;
    case "2":
      await chat.sendStateTyping();
      await handleOption2(client, message);
      break;
    case "3":
      await chat.sendStateTyping();
      await handleOption3(client, message);
      break;
    case "4":
      await chat.sendStateTyping();
      await handleOption4(client, message);
      break;
    default:
      await client.sendMessage(message.from, 'Opção Inválida');
      return;
  }
}

export default handleUserFirstMessage;
