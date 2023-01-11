module.exports = {
  register: {
    welcome: () => `Seja bem vind@ ao BOT Motiva! Aqui você pode se cadastrar para receber frases motivadoras todos os dias no horário desejado. Assim, seu dia fica mais bonito.\n*Vamos iniciar?!*\n\nPara começar, como gostaria de ser chamad@?`,
    askName: () => `Nos informe o seu *nome*:`,
    askSchedule: (name) => `Quase pronto!!\nAgora para finalizar, ${name}, nos informe o melhor horário para receber as frases\nEx: 21h30 ou 21h00`,
    wrongSchedule: () => `O horário informado é inválido, tente novamente`,
    done: (name) => `Muito bom. Parabéns pelo cadastro!!\n\nObrigado por se cadastrar no BOT Motiva. Logo, logo a sua frase chegará para melhorar o seu dia, ${name}`,
  },
  actionMenu: {
    description: (name) => `Olá, ${name}. Você tem algumas opções para interagir com o BOT.\n\nEscolha uma:`,
    itemNotFound: () => `A opção enviada é inválida, tente novamente`,
    items: {
      1: {
        text: 'Ver perfil',
        action: 'view-profile',
      },
      2: {
        text: 'Alterar perfil',
        action: 'update-profile',
      },
      3: {
        text: 'Desinscrever do BOT',
        action: 'unsubscribe',
      },
    },
  },
  updateProfileMenu: {
    description: (name) => `Qual dos valores abaixo você gostaria de alterar.\n\nEscolha uma:`,
    itemNotFound: () => `A opção enviada é inválida, tente novamente`,
    askNewValue: () => `Digite o novo valor:`,
    success: () => `Perfil alterado com sucesso!`,
    fail: () => `Dados inválidos, tente novamente`,
    items: {
      1: {
        text: 'Nome',
        action: 'name',
      },
      2: {
        text: 'Horário da mensagem',
        action: 'messageSchedule',
      },
    },
  },
  evaluation: {
    askEvaluation: (name) => `${name}, espero que esteja se sentindo melhor com a frase recebida!\n\nNos ajude a melhorar a sua experiência e a de outros usuários avaliando está frase\n\n⭐⭐⭐⭐⭐\n\n*De 0 a 5*, qual nota você dá para a frase recebida?`,
    invalidGrade: () => `A nota enviada é inválida, tente novamente.`,
    tryAgain: (name) => `${name}, *de 0 a 5*, qual nota você dá para a frase recebida?`,
    success: () => `Obrigado pela sua avaliação, isso vale muito!!`,
  },
  profile: (user) => `
  Aqui está o seu perfil:

*Nome*: ${user.name}
*Número de celular*: ${user.phoneNumber}
*Hora de envio*: ${user.messageSchedule}
  `,
  unsubscribe: () => `Sua inscrição no BOT Motiva foi cancelada com sucesso`,
  error: () => 'Ocorreu um erro inesperado, por gentileza, entre em contato conosco através do e-mail viniciusmelo241@gmail.com',
};
