// messages/first-message.ts
import { Client, Message } from 'whatsapp-web.js';

const handleUserFirstMessage = async (client: Client, message: Message) => {
  const userMessage = message.body.trim();
  await client.sendMessage(message.from, 'Olá!\n Obrigado por entrar em contato conosco. Escolha uma opção para continuarmos.\n[1]\n[2]\n[3]\n[4]');

  switch(userMessage){
    case '1':
        await client.sendMessage(message.from, 'Opção 1');
        break;
      case '2':
        await client.sendMessage(message.from, 'Opção 2');
        break;
      case '3':
        await client.sendMessage(message.from, 'Opção 3');
        break;
      case '4':
        await client.sendMessage(message.from, 'Opção 4');
        break;
      default:
        await client.sendMessage(message.from, 'Opção inválida');
        break;
  }
};

export default handleUserFirstMessage;