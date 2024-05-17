import { Client, Message } from "whatsapp-web.js";
import { waitForUserChoice } from "../../../utils/utils";
import handleOption1 from "./options/message-option-one";
import handleOption2 from "./options/message-option-two";
import handleOption3 from "./options/message-option-three";
import handleOption4 from "./options/message-option-four";

const handleUserFirstMessage = async (client: Client, message: Message) => {
  const chat = await message.getChat();
  console.log("Handling user first message");

  await client.sendMessage(
    message.from,
    "Olá!\nObrigado por entrar em contato conosco. Escolha uma opção para continuarmos.\n[1]\n[2]\n[3]\n[4]"
  );

  try {
    const userChoice = await waitForUserChoice(chat, client);
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
        console.log("Sent invalid option message");
        return;
    }
  } catch (err) {
    console.error("Error handling user first message:", err);
  }
}

export default handleUserFirstMessage;
