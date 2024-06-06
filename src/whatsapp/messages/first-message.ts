import { Client, Message } from "whatsapp-web.js";
import { waitForUserChoice } from "../../../utils/utils";
import handleOption1 from "./options/message-option-one";
import handleOption2 from "./options/message-option-two";
import handleOption3 from "./options/message-option-three";
import handleOption4 from "./options/message-option-four";
import { activeChats } from "../../active-chats";
import { isInSleepMode } from "../client"; // Importa o estado do modo sleep

const handleUserFirstMessage = async (client: Client, message: Message | null) => {
    const chat = message ? await message.getChat() : null;
    console.log("Handling user first message");

    if (message && activeChats.has(message.from)) {
        return;
    }

    if (message) {
        activeChats.add(message.from);
    }

    try {
        if (message) {
            await client.sendMessage(
                message.from,
                "Olá!\nObrigado por entrar em contato conosco. Escolha uma opção para continuarmos.\n[1]*Conversar com um Especialista*\n[2]*Conversar com setor Financeiro*\n[3]*Conversar com setor de RH*\n[4]*Conversar com setor de Acordo*"
            );
        }
        
        if (message) {
            const userChoice = await waitForUserChoice(chat!, client);
            console.log(`User choice received: ${userChoice}`);
            
            // Adiciona lógica para verificar se a escolha do usuário é válida
            if (!["1", "2", "3", "4"].includes(userChoice)) {
                await client.sendMessage(message.from, 'Opção inválida. Por favor, selecione uma opção válida.');
                console.log("Sent invalid option message");
                activeChats.delete(message.from);
                return;
            }

            switch (userChoice) {
                case "1":
                    await handleOption1(client, message);
                    break;
                case "2":
                    await handleOption2(client, message);
                    break;
                case "3":
                    await handleOption3(client, message);
                    break;
                case "4":
                    await handleOption4(client, message);
                    break;
                default:
                    // Isso não deve acontecer devido à verificação anterior
                    break;
            }
        } else {
            // Lógica para lidar com o reinício da interação
            // Por exemplo, enviar a mensagem inicial novamente ou realizar outra ação necessária
            console.log("No message provided, restarting interaction...");
            // Implemente a lógica necessária aqui, como enviar a mensagem inicial novamente
        }
        
    } catch (err) {
        console.error("Error handling user first message:", err);
    } finally {
        if (message) {
            activeChats.delete(message.from); // Remove chat da lista de chats ativos após o processamento
        }
    }
};


export default handleUserFirstMessage;
