import { Client, Message } from "whatsapp-web.js";
import { waitForUserChoice} from "../../../../utils/utils";
import handleUserFirstMessage from "../first-message";

async function handleOption4(client: Client, message: Message) {
  const chat = await message.getChat();
  const userChoice:String = await waitForUserChoice(chat);

  await client.sendMessage(message.from, "Opção número 4. Oi\n[1]voltar")
  if(userChoice === "1"){
    await chat.sendStateTyping();
    await handleUserFirstMessage(client, message);
  } else {
    await chat.sendStateTyping();
    await client.sendMessage(message.from, "Opção inválida. Por favor, selecione uma opção válida")
  }
  
}

export default handleOption4;