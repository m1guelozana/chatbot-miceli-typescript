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
        await client.sendMessage(message.from, "Opção número 2.\n[1]3\n[2]4\n[3]Retornar ao início");

        const userChoice = await waitForUserChoice(chat, client);
        console.log(`User choice received in option 1: ${userChoice}`);

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
                userStates[chatId] = 'initial';
                await handleUserFirstMessage(client, message);
                break;
            default:
                await client.sendMessage(message.from, 'Opção Inválida');
                console.log("Sent invalid option message in option 1");
                return;
        }
    } catch (err) {
        console.error("Error handling option 1:", err);
    }
}

export default handleOption1;
