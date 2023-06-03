module.exports = {
  register: {
    welcome: () => `Olá! Seja bem vind@ ao MotiViva, sou o Bob, seu robô assistente motivacional diário. Estou aqui para inspirar e motivar você em sua jornada.\n\nPara começarmos, vamos realizar o seu cadastro no MotiViva. Dessa forma, você poderá receber diariamente mensagens motivacionais no horário que preferir. Basta fornecer algumas informações simples.\n\n*Vamos lá?!*\n\nPara começar, como gostaria de ser chamad@?`,
    askName: () => `Nos informe o seu *nome*:`,
    askSchedule: (name) => `Perfeito, ${name}!\n\nPor favor, me informe em qual horário você gostaria de receber suas mensagens diárias. Pode ser pela manhã, tarde ou noite. Estamos aqui para tornar o seu dia mais inspirador!\n\nEx: 9h30 ou 21h30\n\n_*Lembre-se que estamos comprometidos em respeitar sua privacidade e enviaremos as mensagens somente no horário selecionado._`,
    wrongSchedule: () => `O horário informado é inválido, tente novamente`,
    done: (name, schedule) => `Cadastro concluído com sucesso!!\n\nAgradecemos por finalizar seu cadastro no MotiViva! Estamos animados para fazer parte da sua jornada e trazer mensagens significativas para o seu dia a dia, ${name}`,
  },
  actionMenu: {
    description: (name) => `Olá, ${name}! Aqui estão algumas opções inspiradoras para interagir com o BOB:\n\n*Escolha uma das opções abaixo:*`,
    itemNotFound: () => `A opção enviada é inválida, tente novamente`,
    items: {
      1: {
        text: 'Explorar seu Perfil',
        action: 'view-profile',
      },
      2: {
        text: 'Alterar seu Perfil',
        action: 'update-profile',
      },
      3: {
        text: 'Se desinscrever do MotiViva',
        action: 'unsubscribe',
      },
    },
  },
  updateProfileMenu: {
    description: (name) => `Qual das opções abaixo você gostaria de alterar?\n\n*Escolha uma das opções abaixo:*`,
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
    askEvaluation: (name) => `${name}, espero que esteja se sentindo melhor com a frase recebida!\n\nNos ajude a melhorar a sua experiência conosco avaliando a frase recebida\n\n⭐⭐⭐⭐⭐\n\n*De 0 a 5*, qual nota você dá para a frase recebida?`,
    invalidGrade: () => `A nota enviada é inválida, tente novamente.`,
    tryAgain: (name) => `${name}, *de 0 a 5*, qual nota você dá para a frase recebida?`,
    success: () => `Obrigada pela sua avaliação, sua opinião vale muito!!`,
  },
  profile: (user) => `
  Aqui está o seu perfil:

*Nome*: ${user.name}
*Número de celular*: ${user.phoneNumber}
*Hora de envio*: ${user.messageSchedule}
  `,
  unsubscribe: () => `Sua inscrição no MotiViva foi cancelada. Volte quando quiser`,
  error: () => 'Ocorreu um erro inesperado, por gentileza, entre em contato conosco através do e-mail suporte@motiviva.com.br',
};
