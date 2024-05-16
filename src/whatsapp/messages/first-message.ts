import { Client, Message } from "whatsapp-web.js";
import { waitForUserChoice } from "../../../utils/utils";
import handleOption1 from "./options/message-option-one";
import handleOption2 from "./options/message-option-two";
import handleOption3 from "./options/message-option-three";
import handleOption4 from "./options/message-option-four";

const handleUserFirstMessage = async (client: Client, message: Message) => {
  console.log("Handling user first message");
  const chat = await message.getChat();

  client.on("message", async (message) => {
    await client.sendMessage(
      message.from,
      "Olá!\n Obrigado por entrar em contato conosco. Escolha uma opção para continuarmos.\n[1]\n[2]\n[3]\n[4]"
    );
    console.log("Sent options to user");

    try {
      const userChoice: string = await waitForUserChoice(chat);
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
          await client.sendMessage(message.from, "Opção Inválida");
          console.log("Sent invalid option message to user");
          return;
      }
    } catch (err) {
      console.error("Error in user choice handling:", err);
    }
  });
};

// for test
// const handleUserFirstMessage = async (client: Client, message: Message) => {
//   console.log("Handling user first message");
//   await client.sendMessage(message.from, "Recebi sua mensagem!");
// }

export default handleUserFirstMessage;
