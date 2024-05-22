import { Client, Message } from "whatsapp-web.js";
import { waitForUserChoice } from "../../../../utils/utils";
import handleOption1 from "./message-option-one";
import handleOption2 from "./message-option-two";
import handleOption4 from "./message-option-four";


async function handleOption3(client: Client, message: Message) {
  const chat = await message.getChat();
  console.log("Handling option 3");

  let contact = await client.getContactById("5521979504616@c.us");
  await client.sendMessage(message.from, contact);

  await client.sendMessage(
    message.from,
    "Você deseja buscar algum outro contato?\n[1]*Conversar com um Especialista*\n[2]*Conversar com setor Financeiro*\n[3]*Conversar com setor Comercial*"
  );

  const userChoice = await waitForUserChoice(chat, client);
  console.log(`User choice received in option 1: ${userChoice}`);
  try {
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
        await handleOption4(client, message);
        break;
      default:
        await client.sendMessage(message.from, "Opção Inválida");
        console.log("Sent invalid option message in option 3");
        return;
    }
  } catch (err) {
    console.error("Error handling option 3:", err);
  }
}

export default handleOption3;
