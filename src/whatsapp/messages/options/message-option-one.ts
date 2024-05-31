import { Client, Message } from "whatsapp-web.js";
import { waitForUserChoice } from "../../../../utils/utils";
import handleOption2 from "./message-option-two";
import handleOption3 from "./message-option-three";
import handleOption4 from "./message-option-four";

const activeChats: Set<string> = new Set(); // Para rastrear chats ativos em atendimento humano

async function handleOption1(client: Client, message: Message) {
    const chat = await message.getChat();
    console.log("Handling option 1");

    try {
        // Pausar o bot para atendimento humano
        activeChats.add(message.from);
        await client.sendMessage(message.from, "Você foi transferido para um atendimento humano. Por favor, aguarde.");

        // Espera pelo atendimento humano finalizar
        await waitForHumanAssistanceEnd(client, message.from);

        // Após o atendimento humano finalizar
        await client.sendMessage(message.from, "Atendimento Finalizado. Posso te ajudar em mais alguma coisa?");

        // Envia a nova mensagem com opções
        await client.sendMessage(
            message.from,
            "Você deseja buscar algum outro contato?\n[1]*Conversar com setor Financeiro*\n[2]*Conversar com RH*\n[3]*Conversar com setor Comercial*"
        );

        // Aguarda a escolha do usuário
        const userChoice = await waitForUserChoice(chat, client);
        console.log(`User choice received in option 1: ${userChoice}`);

        // Remove o chat da lista de chats ativos em atendimento humano
        activeChats.delete(message.from);

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

async function waitForHumanAssistanceEnd(client: Client, chatId: string) {
    return new Promise<void>((resolve) => {
        const interval = setInterval(async () => {
            const messages = await client.getChatById(chatId).then(chat => chat.fetchMessages({ limit: 10 }));
            const humanEnded = messages.some(msg => msg.body.toLowerCase() === "atendimento encerrado");

            if (humanEnded) {
                clearInterval(interval);
                resolve();
            }
        }, 5000); // Verifica a cada 5 segundos
    });
}

export default handleOption1;
