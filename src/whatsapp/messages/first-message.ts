import { Client, Message } from "whatsapp-web.js";
import { waitForUserChoice } from "../../../utils/utils";
import handleOption1 from "./options/message-option-one";
import handleOption2 from "./options/message-option-two";
import handleOption3 from "./options/message-option-three";
import handleOption4 from "./options/message-option-four";

const handleUserFirstMessage = async (client: Client, message: Message) => {
    const chatId = message.from;
    const chat = await message.getChat();
    

    console.log("Handling user first message");

    try {
        await client.sendMessage(
            message.from,
            "Olá!\nObrigado por entrar em contato conosco. Escolha uma opção para continuarmos.\n[1]*Conversar com um Especialista*\n[2]*Conversar com setor Financeiro*\n[3]*Conversar com setor de RH*\n[4]*Conversar com setor Comercial*"
        );
        
        const userChoice = await waitForUserChoice(chat, client);
        console.log(`User choice received: ${userChoice}`);
        
        // Encaminhar para o tratamento da opção selecionada
        switch (userChoice) {
            case "1":
                await handleOption1(client, message)
                break;
            case "2":
                await handleOption2(client, message)
                break;
            case "3":
                await handleOption3(client, message)
                break;
            case "4":
                await handleOption4(client, message)
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
