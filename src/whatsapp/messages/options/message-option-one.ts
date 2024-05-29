import { Client, Message } from "whatsapp-web.js";
import { waitForUserChoice } from "../../../../utils/utils";
import handleOption2 from "./message-option-two";
import handleOption3 from "./message-option-three";
import handleOption4 from "./message-option-four";

async function handleOption1(client: Client, message: Message) {
    const chat = await message.getChat();
    console.log("Handling option 1");

    try {
        // Obtém o contato do especialista
        let contact = await client.getContactById("5521986318960@c.us");
        await client.sendMessage(message.from, contact); // Certifique-se de que está enviando o ID ou a mensagem correta

        // Envia a nova mensagem com opções
        await client.sendMessage(
            message.from,
            "Você deseja buscar algum outro contato?\n[1]*Conversar com setor Financeiro*\n[2]*Conversar com RH*\n[3]*Conversar com setor Comercial*"
        );

        // Aguarda a escolha do usuário
        const userChoice = await waitForUserChoice(chat, client);
        console.log(`User choice received in option 1: ${userChoice}`);

        // Encaminha para o tratamento da opção selecionada
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
                await client.sendMessage(message.from, "Opção Inválida");
                console.log("Sent invalid option message in option 1");
                break;
        }
    } catch (err) {
        console.error("Error handling option 1:", err);
    }
}

export default handleOption1;
