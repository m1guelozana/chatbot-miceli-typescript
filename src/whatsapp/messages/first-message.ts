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
    
    // Verifica se o usuário já está em uma conversa
    if (stateManager.isUserInConversation(chatId)) {
        console.log("User is already in a conversation. Skipping welcome message.");
        return;
    }

    console.log("Handling user first message");

    try {
        stateManager.setUserState(chatId, 'initial');
        await client.sendMessage(
            message.from,
            "Olá!\nObrigado por entrar em contato conosco. Escolha uma opção para continuarmos.\n[1]*Conversar com um Especialista*\n[2]*Conversar com setor Financeiro*\n[3]*Conversar com setor de RH*\n[4]*Conversar com setor Comercial*"
        );
        
        const userChoice = await waitForUserChoice(chat, client);
        console.log(`User choice received: ${userChoice}`);
        
        // Encaminhar para o tratamento da opção selecionada
        switch (userChoice) {
            case "1":
                stateManager.setUserState(chatId, 'option1');
                break;
            case "2":
                stateManager.setUserState(chatId, 'option2');
                break;
            case "3":
                stateManager.setUserState(chatId, 'option3');
                break;
            case "4":
                stateManager.setUserState(chatId, 'option4');
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
