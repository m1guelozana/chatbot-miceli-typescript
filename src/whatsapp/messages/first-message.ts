import { Client, Message } from "whatsapp-web.js";
import { waitForUserChoice } from "../../../utils/utils";
import handleOption1 from "./options/message-option-one";
import handleOption2 from "./options/message-option-two";
import handleOption3 from "./options/message-option-three";
import handleOption4 from "./options/message-option-four";
import stateManager from "../../state";

const handleUserFirstMessage = async (client: Client, message: Message) => {
    const chatId = message.from;
    const chat = await message.getChat();
    console.log("Handling user first message");

    // Verifica se a mensagem já foi processada
    const lastMessageId = stateManager.getLastMessageId(chatId);
    if (lastMessageId === message.id._serialized) {
        console.log("Mensagem duplicada ignorada:", message.body);
        return;
    }
    stateManager.setLastMessageId(chatId, message.id._serialized);

    if (stateManager.getUserState(chatId) && stateManager.getUserState(chatId) !== 'initial') {
        return;
    }

    try {
        stateManager.setUserState(chatId, 'initial');
        await client.sendMessage(
            message.from,
            "Olá!\nObrigado por entrar em contato conosco. Escolha uma opção para continuarmos.\n[1]*Conversar com um Especialista*\n[2]*Conversar com setor Financeiro*\n[3]*Conversar com setor de RH*\n[4]*Conversar com setor Comercial*"
        );
        const userChoice = await waitForUserChoice(chat, client);
        console.log(`User choice received: ${userChoice}`);

        switch (userChoice) {
            case "1":
                stateManager.setUserState(chatId, 'option1');
                await handleOption1(client, message);
                break;
            case "2":
                stateManager.setUserState(chatId, 'option2');
                await handleOption2(client, message);
                break;
            case "3":
                stateManager.setUserState(chatId, 'option3');
                await handleOption3(client, message);
                break;
            case "4":
                stateManager.setUserState(chatId, 'option4');
                await handleOption4(client, message);
                break;
            default:
                await client.sendMessage(message.from, 'Opção Inválida. Por favor, selecione uma opção válida.');
                console.log("Sent invalid option message");
                break;
        }
    } catch (err) {
        console.error("Error handling user first message:", err);
    }
};

export default handleUserFirstMessage;
