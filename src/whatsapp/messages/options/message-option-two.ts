import { Client, Message } from "whatsapp-web.js";
import { waitForUserChoice} from "../../../../utils/utils";
import handleOption3 from "./message-option-three";
import handleOption4 from "./message-option-four";
import handleUserFirstMessage from "../first-message";

async function handleOption2(client: Client, message: Message) {
  const chat = await message.getChat();
  const userChoice:String = await waitForUserChoice(chat);

  await client.sendMessage(message.from, "Opção número 2. Oi\n[1]3[2]4[3]voltar")
  switch (userChoice) {
    case "1":
      await chat.sendStateTyping();
      await handleOption3(client, message);
      break;
    case "2":
      await chat.sendStateTyping();
      await handleOption4(client, message)
      break;
    case "3":
      await chat.sendStateTyping();
      await handleUserFirstMessage(client, message);
      break;
    default:
      await client.sendMessage(message.from, 'Opção Inválida')
      return;
  
  };
}

export default handleOption2;