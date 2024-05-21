import { Client, Message } from "whatsapp-web.js";
import { waitForUserChoice } from "../../../../utils/utils";
import handleOption2 from "./message-option-two";
import handleOption3 from "./message-option-three";
import handleOption4 from "./message-option-four";

async function handleOption1(client: Client, message: Message) {
    const chat = await message.getChat();
    console.log("Handling option 1");

    try {
        await client.sendMessage(message.from, "Opção número 1.\n[1]2\n[2]3\n[3]4");

        const userChoice = await waitForUserChoice(chat, client);
        console.log(`User choice received in option 1: ${userChoice}`);

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
