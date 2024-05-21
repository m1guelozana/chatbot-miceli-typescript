import { Client, Message } from "whatsapp-web.js";
import { waitForUserChoice } from "../../../../utils/utils";
import handleOption2 from "./message-option-two";
import handleOption3 from "./message-option-three";
import handleOption4 from "./message-option-four";
import handleUserFirstMessage from "../first-message";

const userStates: { [key: string]: string } = {};

async function handleOption1(client: Client, message: Message) {
    const chatId = message.from;
    const chat = await message.getChat();
    console.log("Handling option 1");

    try {
        await client.sendMessage(message.from, "Opção número 4.\n[1]Retornar ao início");

        const userChoice = await waitForUserChoice(chat, client);
        console.log(`User choice received in option 1: ${userChoice}`);


        if (userChoice === "1") {
          userStates[chatId] = 'initial';
          await handleUserFirstMessage(client, message);
        } else {
          await chat.sendStateTyping();
          await client.sendMessage(message.from, "Opção inválida. Por favor, selecione uma opção válida");
          console.log("Sent invalid option message");
        }
    } catch (err) {
        console.error("Error handling option 1:", err);
    }
}

export default handleOption1;
