/** Banco de perguntas sobre phishing e engenharia social. Índice 0 é a correta antes do embaralhamento. */
const QUESTIONS = [
  {
    id: "b01",
    difficulty: "baixo",
    text: "O que é phishing?",
    options: [
      "Um golpe que engana a pessoa para entregar dados ou clicar em algo perigoso",
      "Um antivírus que protege o celular automaticamente",
      "Um tipo de senha mais longa e segura",
      "Um backup oficial feito pelo banco",
    ],
  },
  {
    id: "b02",
    difficulty: "baixo",
    text: "Chega um e-mail 'do banco' pedindo sua senha com urgência. O que você faz?",
    options: [
      "Não clica e entra no banco só pelo aplicativo ou site oficial",
      "Responde o e-mail com a senha para resolver logo",
      "Encaminha a senha para um amigo conferir",
      "Clica no link, porque o nome do banco aparece no assunto",
    ],
  },
  {
    id: "b03",
    difficulty: "baixo",
    text: "Qual conjunto é um sinal clássico de golpe?",
    options: [
      "Urgência, medo e um link de remetente desconhecido",
      "Uma mensagem calma vinda do aplicativo oficial",
      "Um boleto gerado dentro do site do banco",
      "Um aviso da escola publicado no mural da turma",
    ],
  },
  {
    id: "b04",
    difficulty: "baixo",
    text: "Engenharia social é, principalmente:",
    options: [
      "Manipular a confiança e o comportamento das pessoas para conseguir algo",
      "Consertar computadores quebrados na escola",
      "Criar senhas usando só números",
      "Instalar um programa de edição de fotos",
    ],
  },
  {
    id: "b05",
    difficulty: "baixo",
    text: "Um desconhecido manda um arquivo .exe 'importante'. A atitude segura é:",
    options: [
      "Não abrir e confirmar por outro canal se aquilo era esperado",
      "Abrir rápido para não perder o prazo",
      "Renomear o arquivo e executar mesmo assim",
      "Enviar o arquivo para toda a turma conferir juntos",
    ],
  },
  {
    id: "b06",
    difficulty: "baixo",
    text: "Qual cuidado ajuda contra contas invadidas?",
    options: [
      "Usar senha forte e diferente em cada serviço",
      "Usar a mesma senha em tudo para não esquecer",
      "Anotar a senha no perfil público da rede social",
      "Compartilhar a senha com quem disser ser suporte",
    ],
  },
  {
    id: "b07",
    difficulty: "baixo",
    text: "Você recebe um SMS: 'sua encomenda será cancelada, pague a taxa aqui'. Você:",
    options: [
      "Desconfia do link e confere o pedido no site ou app da loja",
      "Paga a taxa na hora para a encomenda não sumir",
      "Manda o código do cartão para liberar a entrega",
      "Clica porque a mensagem cita seu primeiro nome",
    ],
  },
  {
    id: "b08",
    difficulty: "baixo",
    text: "Um site mostra o cadeado de HTTPS. Isso significa que:",
    options: [
      "A conexão é criptografada, mas o site ainda pode ser falso",
      "O site com certeza pertence ao seu banco",
      "Nenhum golpe consegue usar cadeado",
      "Você pode digitar qualquer senha sem risco",
    ],
  },
  {
    id: "b09",
    difficulty: "baixo",
    text: "Alguém avisa que você ganhou um prêmio que nunca disputou. O mais seguro é:",
    options: [
      "Ignorar o pedido de dados e taxas para 'liberar' o prêmio",
      "Pagar uma taxa pequena para receber o prêmio",
      "Enviar foto do documento para provar que é você",
      "Passar o código que chegou por SMS",
    ],
  },
  {
    id: "b10",
    difficulty: "baixo",
    text: "Um suposto funcionário pede o código que chegou no seu celular. Você:",
    options: [
      "Não passa o código. Ele serve para provar que você está no controle da conta",
      "Dita o código, porque ele disse que é do suporte",
      "Publica o código no grupo da turma",
      "Envia o código se a pessoa falar seu nome",
    ],
  },
  {
    id: "b11",
    difficulty: "baixo",
    text: "Um perfil copia a foto de um amigo e pede dinheiro emprestado. Isso pode ser:",
    options: [
      "Um perfil falso usando a confiança entre amigos",
      "Uma função oficial de transferência da rede",
      "Um aviso automático da escola",
      "Um backup da conta verdadeira",
    ],
  },
  {
    id: "b12",
    difficulty: "baixo",
    text: "Aparece um pop-up: 'seu celular está infectado, ligue agora'. A melhor saída é:",
    options: [
      "Fechar o aviso e não ligar para o número mostrado",
      "Ligar e instalar o programa que pedirem",
      "Permitir acesso remoto para eles 'limparem' o aparelho",
      "Pagar o boleto da falsa taxa de limpeza",
    ],
  },
  {
    id: "m01",
    difficulty: "medio",
    text: "Phishing feito por mensagem de texto (SMS) é chamado de:",
    options: ["Smishing", "Vishing", "Whaling", "Tailgating"],
  },
  {
    id: "m02",
    difficulty: "medio",
    text: "Um golpe por telefone, em que a pessoa imita um banco ou suporte, é:",
    options: ["Vishing", "Smishing", "Quishing", "Typosquatting"],
  },
  {
    id: "m03",
    difficulty: "medio",
    text: "Spear phishing se diferencia do phishing genérico porque:",
    options: [
      "É dirigido a uma pessoa ou empresa, com detalhes que parecem pessoais",
      "Só acontece em computadores desligados",
      "Usa apenas cartas em papel",
      "Sempre vem de um amigo conhecido de verdade",
    ],
  },
  {
    id: "m04",
    difficulty: "medio",
    text: "Pretexting é quando o golpista:",
    options: [
      "Inventa uma história convincente para a vítima entregar informação",
      "Troca a senha do Wi-Fi da escola sem falar com ninguém",
      "Apaga fotos para liberar espaço",
      "Cria um antivírus gratuito oficial",
    ],
  },
  {
    id: "m05",
    difficulty: "medio",
    text: "Antes de clicar num link de e-mail, o passo útil é:",
    options: [
      "Passar o mouse (ou segurar o link) e conferir se o endereço é o oficial",
      "Clicar logo, se o texto do botão disser 'site seguro'",
      "Confiar apenas na cor do botão",
      "Encaminhar o link para todos os contatos",
    ],
  },
  {
    id: "m06",
    difficulty: "medio",
    text: "O endereço paypa1.com, com número no lugar da letra, é exemplo de:",
    options: [
      "Typosquatting, um domínio parecido com o de uma marca real",
      "Um certificado que prova que o site é do PayPal",
      "Uma verificação em duas etapas",
      "Um atalho oficial do banco",
    ],
  },
  {
    id: "m07",
    difficulty: "medio",
    text: "No golpe BEC, muito comum em empresas, o criminoso:",
    options: [
      "Se passa por chefe ou fornecedor para pedir pagamento ou dados",
      "Só invade a conta jogando um cabo de rede",
      "Entrega um antivírus de presente",
      "Corrige um boleto verdadeiro dentro do banco",
    ],
  },
  {
    id: "m08",
    difficulty: "medio",
    text: "Um QR Code colado por cima de outro, ou vindo de mensagem suspeita, pode ser:",
    options: [
      "Quishing, phishing escondido em um QR Code",
      "Uma vacina digital obrigatória",
      "A prova de que o site é do governo",
      "Um cadeado HTTPS mais forte",
    ],
  },
  {
    id: "m09",
    difficulty: "medio",
    text: "O nome exibido 'Banco do Brasil' no e-mail importa menos do que:",
    options: [
      "O endereço completo do remetente e o domínio real do link",
      "A quantidade de emojis na mensagem",
      "A cor do logotipo colado na imagem",
      "O horário em que o e-mail chegou",
    ],
  },
  {
    id: "m10",
    difficulty: "medio",
    text: "Alguém no direct diz ser o suporte da rede e pede sua senha para 'verificar um bug'. Isso é:",
    options: [
      "Falso suporte. O suporte de verdade não pede a sua senha",
      "Um procedimento normal de toda rede social",
      "Uma etapa da verificação em duas etapas",
      "Um backup automático da sua conta",
    ],
  },
  {
    id: "m11",
    difficulty: "medio",
    text: "Uma nota fiscal inesperada em anexo pede para 'ativar o conteúdo'. Você deve:",
    options: [
      "Não ativar macros nem abrir o arquivo se não esperava aquela nota",
      "Ativar o conteúdo para ver o boleto",
      "Encaminhar ao grupo e pedir que abram também",
      "Responder com os dados do cartão para cancelar a nota",
    ],
  },
  {
    id: "m12",
    difficulty: "medio",
    text: "Reutilizar a mesma senha em vários sites é arriscado porque:",
    options: [
      "Se um site vazar a senha, as outras contas com ela também caem",
      "A senha fica mais forte a cada site novo",
      "O navegador apaga a senha sozinho",
      "Os golpes de mensagem deixam de funcionar",
    ],
  },
  {
    id: "d01",
    difficulty: "dificil",
    text: "Whaling é um phishing dirigido especialmente a:",
    options: [
      "Executivos e pessoas com poder de aprovar dinheiro ou acessos",
      "Apenas baleias de aquário e lojas de animais",
      "Qualquer pessoa que use SMS",
      "Somente impressoras da escola",
    ],
  },
  {
    id: "d02",
    difficulty: "dificil",
    text: "No ataque de fadiga de MFA, o golpista:",
    options: [
      "Dispara vários pedidos de aprovação até a pessoa aceitar sem querer",
      "Desliga o celular para sempre",
      "Troca o idioma do teclado",
      "Remove o cadeado HTTPS de todos os sites",
    ],
  },
  {
    id: "d03",
    difficulty: "dificil",
    text: "Clone phishing consiste em:",
    options: [
      "Copiar um e-mail legítimo que você já recebeu e trocar o link ou o anexo",
      "Clonar o aparelho na assistência oficial da marca",
      "Duplicar fotos na galeria para economizar espaço",
      "Criar uma senha igual à do colega com permissão dele",
    ],
  },
  {
    id: "d04",
    difficulty: "dificil",
    text: "Tailgating, na engenharia social física, é:",
    options: [
      "Entrar num local restrito logo atrás de alguém autorizado",
      "Enviar muitos e-mails de uma vez só",
      "Usar duas senhas no mesmo site",
      "Atualizar o sistema pelo menu oficial",
    ],
  },
  {
    id: "d05",
    difficulty: "dificil",
    text: "No quid pro quo, o golpista costuma:",
    options: [
      "Oferecer uma ajuda ou vantagem em troca de acesso ou informação",
      "Devolver um objeto perdido sem pedir nada",
      "Pedir apenas que você ignore a mensagem",
      "Instalar uma atualização assinada pela própria empresa",
    ],
  },
  {
    id: "d06",
    difficulty: "dificil",
    text: "Um site watering hole funciona assim:",
    options: [
      "O criminoso infecta um site que o grupo alvo costuma visitar",
      "Ele oferece água grátis na recepção da empresa",
      "Ele apaga o histórico do navegador com permissão",
      "Ele cria uma senha mestra para toda a família",
    ],
  },
  {
    id: "d07",
    difficulty: "dificil",
    text: "Angler phishing acontece quando:",
    options: [
      "Um perfil falso de suporte responde uma reclamação pública e leva a vítima para fora do canal oficial",
      "Um pescador pede senha na beira do rio",
      "O antivírus faz uma varredura semanal",
      "A escola publica a lista de materiais",
    ],
  },
  {
    id: "d08",
    difficulty: "dificil",
    text: "Letras de outro alfabeto que parecem iguais (homoglyphs) servem para:",
    options: [
      "Montar um domínio visualmente idêntico ao verdadeiro",
      "Deixar a senha mais fácil de lembrar",
      "Ativar o cadeado verde antigo",
      "Provar que o e-mail passou no filtro",
    ],
  },
  {
    id: "d09",
    difficulty: "dificil",
    text: "Consent phishing (isca de permissão) tenta fazer você:",
    options: [
      "Autorizar um aplicativo falso a ler seu e-mail ou arquivos na nuvem",
      "Aceitar os termos do sistema operacional oficial",
      "Atualizar o navegador pela loja do próprio aparelho",
      "Ligar a verificação em duas etapas",
    ],
  },
  {
    id: "d10",
    difficulty: "dificil",
    text: "Uma voz muito parecida com a do seu chefe pede uma transferência sigilosa. A defesa é:",
    options: [
      "Confirmar por um canal que você já conhece, não pelo número que ligou",
      "Transferir na hora, porque a voz parece certa",
      "Pedir só o código SMS para completar",
      "Manter segredo e não consultar mais ninguém, como a ligação mandou",
    ],
  },
  {
    id: "d11",
    difficulty: "dificil",
    text: "Shoulder surfing é:",
    options: [
      "Observar por cima do ombro para ver senha, código ou tela",
      "Surfar em um site com cadeado",
      "Compartilhar a rede Wi-Fi da escola",
      "Usar óculos de realidade virtual",
    ],
  },
  {
    id: "d12",
    difficulty: "dificil",
    text: "Por que um boleto 'atualizado' enviado por e-mail pode ser golpe?",
    options: [
      "O código de barras pode apontar para a conta do golpista, não do credor",
      "Todo boleto em PDF é oficial por lei",
      "O valor mais alto sempre significa juros corretos",
      "O banco nunca emite boleto, então qualquer um serve",
    ],
  },
  {
    id: "i01",
    difficulty: "impossivel",
    text: "Um e-mail passa na checagem do domínio real (DMARC), mas ainda pode enganar porque:",
    options: [
      "O nome exibido pode ser forjado, e o texto pode vir de uma conta já invadida",
      "DMARC impede qualquer texto mentiroso dentro da mensagem",
      "DMARC troca a senha do leitor automaticamente",
      "Mensagens aprovadas nunca contêm links",
    ],
  },
  {
    id: "i02",
    difficulty: "impossivel",
    text: "Num ataque adversary-in-the-middle contra login, o código de SMS é roubado em tempo real. A proteção mais resistente é:",
    options: [
      "Passkey ou chave física FIDO2, presa ao site verdadeiro",
      "Receber o mesmo código por mais um SMS",
      "Usar uma senha mais curta para digitar rápido",
      "Desligar a verificação e confiar só na senha",
    ],
  },
  {
    id: "i03",
    difficulty: "impossivel",
    text: "Combosquatting é registrar um domínio como marca-segura.com. A diferença para o typosquatting clássico é:",
    options: [
      "Ele acrescenta palavras à marca, em vez de só errar uma letra",
      "Ele só funciona em cartas impressas",
      "Ele é um selo oficial de loja verificada",
      "Ele exige que o site não tenha HTTPS",
    ],
  },
  {
    id: "i04",
    difficulty: "impossivel",
    text: "Callback phishing (ou hybrid vishing) começa em geral com:",
    options: [
      "Um e-mail pedindo que você ligue para um número indicado pelo golpista",
      "Um cadeado extra ao lado do relógio do celular",
      "Uma atualização assinada dentro das configurações",
      "Um convite presencial da recepção da escola",
    ],
  },
  {
    id: "i05",
    difficulty: "impossivel",
    text: "SEO poisoning coloca o golpe na frente da vítima quando:",
    options: [
      "Um anúncio ou resultado manipulado imita o site oficial no topo da busca",
      "A pessoa digita o endereço oficial de memória, letra por letra",
      "O favorito antigo do navegador é aberto direto",
      "O aplicativo instalado da loja oficial é usado",
    ],
  },
  {
    id: "i06",
    difficulty: "impossivel",
    text: "Qual trio combina com o padrão clássico de fraude do falso diretor (CEO fraud)?",
    options: [
      "Autoridade, urgência e pedido de segredo",
      "Calma, canal oficial e dois aprovadores",
      "Boleto gerado dentro do banco e senha não compartilhada",
      "Reunião marcada e nota fiscal conferida no sistema",
    ],
  },
  {
    id: "i07",
    difficulty: "impossivel",
    text: "Pretexting e phishing se cruzam, mas o pretexting enfatiza:",
    options: [
      "O roteiro inventado para extrair informação, mesmo sem um link de isca",
      "Apenas o envio em massa de e-mails idênticos",
      "A troca física do computador da vítima",
      "O uso exclusivo de QR Code",
    ],
  },
  {
    id: "i08",
    difficulty: "impossivel",
    text: "Por que o princípio do menor privilégio reduz o estrago da engenharia social?",
    options: [
      "Mesmo que alguém ceda, a conta comprometida não acessa tudo",
      "Ele impede a pessoa de conversar com estranhos",
      "Ele torna todos os e-mails automaticamente verdadeiros",
      "Ele remove a necessidade de conferir links",
    ],
  },
  {
    id: "i09",
    difficulty: "impossivel",
    text: "Um convite de reunião traz um link 'zoom-reuniao-empresa.com' que pede o login da empresa. Isso explora:",
    options: [
      "A confiança num ritual diário, apontando para uma página clonada",
      "Um recurso interno que nunca pede senha fora da rede",
      "A prova de que o domínio principal da empresa mudou",
      "Uma exigência legal de colar a senha em sites novos",
    ],
  },
  {
    id: "i10",
    difficulty: "impossivel",
    text: "No golpe do falso funcionário de TI com acesso remoto, o prejuízo imediato costuma ser:",
    options: [
      "A pessoa instala um programa de controle e entrega a tela ao golpista",
      "O antivírus oficial da loja atualiza sozinho",
      "O Wi-Fi da escola fica mais rápido",
      "A senha é reforçada sem ninguém ver a tela",
    ],
  },
  {
    id: "i11",
    difficulty: "impossivel",
    text: "Um atacante registra banco-suporte.com.br enquanto o domínio verdadeiro é outro. Mesmo com HTTPS válido, o risco continua porque:",
    options: [
      "O certificado prova a criptografia, não a identidade da marca que você espera",
      "HTTPS válido significa que o banco autorizou aquele domínio",
      "O cadeado impede páginas copiadas",
      "Navegadores bloqueiam qualquer domínio novo",
    ],
  },
  {
    id: "i12",
    difficulty: "impossivel",
    text: "Uma campanha manda o mesmo texto a milhares de pessoas e outra pesquisa o alvo por semanas. A segunda descreve melhor:",
    options: [
      "Spear phishing, pela personalização depois da pesquisa",
      "Apenas spam sem nenhuma intenção de enganar",
      "Uma newsletter que a pessoa assinou",
      "Um teste de velocidade da rede",
    ],
  },
];

const DIFFICULTY_QUOTA = { baixo: 4, medio: 4, dificil: 4, impossivel: 3 };

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickQuestions(usage, count = 15) {
  const picked = [];
  const levels = Object.keys(DIFFICULTY_QUOTA);
  levels.forEach((level) => {
    const bucket = QUESTIONS.filter((question) => question.difficulty === level);
    const ranked = shuffle(bucket).sort(
      (a, b) => (usage.get(a.id) || 0) - (usage.get(b.id) || 0),
    );
    picked.push(...ranked.slice(0, DIFFICULTY_QUOTA[level]));
  });

  if (picked.length < count) {
    const ids = new Set(picked.map((question) => question.id));
    const rest = shuffle(QUESTIONS)
      .sort((a, b) => (usage.get(a.id) || 0) - (usage.get(b.id) || 0))
      .filter((question) => !ids.has(question.id));
    picked.push(...rest.slice(0, count - picked.length));
  }

  const selected = shuffle(picked).slice(0, count);
  selected.forEach((question) => {
    usage.set(question.id, (usage.get(question.id) || 0) + 1);
  });
  return selected;
}

function presentQuestion(question) {
  const options = shuffle(question.options.map((text, index) => ({ text, correct: index === 0 })));
  return {
    id: question.id,
    difficulty: question.difficulty,
    text: question.text,
    options: options.map((option) => option.text),
    answer: options.findIndex((option) => option.correct),
  };
}

module.exports = {
  QUESTIONS,
  DIFFICULTY_QUOTA,
  shuffle,
  pickQuestions,
  presentQuestion,
};
