import { Ear, MapPin, AlertTriangle, Layers } from "lucide-react";

export interface EducationalArticle {
  slug: string;
  icon: React.ComponentType<any>;
  title: string;
  subtitle: string;
  desc: string;
  heroColor: string;
  sections: ArticleSection[];
}

export interface ArticleSection {
  type: "text" | "highlight" | "infographic" | "tips" | "comparison";
  title?: string;
  content?: string;
  items?: string[];
  left?: { title: string; items: string[] };
  right?: { title: string; items: string[] };
  metrics?: { label: string; value: string; desc: string }[];
}

export const educationalArticles: EducationalArticle[] = [
  {
    slug: "tratamento-vs-isolamento",
    icon: Ear,
    title: "Tratamento Acústico vs. Isolamento Acústico",
    subtitle: "Entenda a diferença fundamental entre absorver o som dentro do ambiente e bloquear o ruído externo.",
    desc: "Dois conceitos completamente diferentes que são frequentemente confundidos — e essa confusão pode custar caro no seu projeto.",
    heroColor: "hsl(25,80%,50%)",
    sections: [
      {
        type: "text",
        title: "O que é Tratamento Acústico?",
        content: "Tratamento acústico se refere ao controle do comportamento sonoro DENTRO de um ambiente. Quando você fala em uma sala vazia, o som se propaga em todas as direções, reflete nas paredes, teto e piso, e retorna aos seus ouvidos com atraso — isso é a reverberação. O tratamento acústico utiliza materiais absorvedores (como painéis de lã de rocha revestidos em tecido) e difusores (como painéis de madeira com relevos calculados) para controlar essas reflexões. O objetivo não é eliminar todo o som, mas sim criar um ambiente com o tempo de reverberação adequado para cada uso — seja um estúdio de gravação que precisa de alta precisão, uma sala de reunião que exige clareza na fala, ou uma igreja que necessita inteligibilidade sem perder a sensação de amplitude.",
      },
      {
        type: "infographic",
        title: "Como as ondas sonoras se comportam",
        metrics: [
          { label: "Reflexão Direta", value: "1ª", desc: "O som atinge a parede mais próxima e retorna — é o primeiro eco que chega ao ouvinte, em geral entre 5 e 20 ms após o som direto." },
          { label: "Reflexões Tardias", value: "2ª–5ª", desc: "Após a primeira reflexão, o som continua ricocheteando entre superfícies, perdendo energia a cada impacto. O acúmulo dessas reflexões forma a reverberação." },
          { label: "Ondas Estacionárias", value: "Graves", desc: "Em frequências baixas, o comprimento de onda é grande o suficiente para 'encaixar' entre duas paredes paralelas, criando acúmulo excessivo de graves nos cantos — os chamados modos da sala." },
          { label: "Flutter Echo", value: "Médios", desc: "Quando duas superfícies paralelas e reflexivas ficam próximas, o som fica 'pingando' entre elas rapidamente, criando um eco metálico característico." },
        ],
      },
      {
        type: "text",
        title: "O que é Isolamento Acústico?",
        content: "Isolamento acústico é o bloqueio da transmissão sonora entre ambientes. Diferente do tratamento, o isolamento lida com a passagem do som através de paredes, pisos, tetos, portas e janelas. O princípio fundamental é massa-mola-massa: quanto mais pesada e desacoplada for a estrutura, mais difícil será para a vibração sonora atravessá-la. Isso envolve paredes duplas com espaço de ar, mantas de alta densidade, portas maciças com vedação, janelas com vidro laminado duplo e tratamento de frestas. É um trabalho estrutural que geralmente exige obra civil e investimento significativamente maior que o tratamento acústico.",
      },
      {
        type: "comparison",
        title: "Comparativo Direto",
        left: {
          title: "Tratamento Acústico",
          items: [
            "Controla o som DENTRO do ambiente",
            "Usa painéis absorvedores e difusores",
            "Reduz reverberação e eco",
            "Instalação simples e reversível",
            "Investimento acessível",
            "Ideal para: estúdios, escritórios, igrejas, home theaters",
          ],
        },
        right: {
          title: "Isolamento Acústico",
          items: [
            "Bloqueia o som ENTRE ambientes",
            "Usa massa, desacoplamento e vedação",
            "Impede transmissão de ruído",
            "Exige obra civil e projeto estrutural",
            "Investimento elevado",
            "Ideal para: casas de show, clínicas, apartamentos",
          ],
        },
      },
      {
        type: "highlight",
        title: "Quando você precisa de cada um?",
        content: "Se o problema é 'o som fica embolado quando falo' ou 'não consigo mixar com precisão' → Tratamento Acústico. Se o problema é 'o barulho do vizinho me incomoda' ou 'preciso ensaiar sem atrapalhar quem está ao lado' → Isolamento Acústico. Na maioria dos projetos profissionais, a solução ideal combina os dois: primeiro isola-se o ambiente do exterior, depois trata-se o interior para o uso desejado.",
      },
    ],
  },
  {
    slug: "posicionamento-de-paineis",
    icon: MapPin,
    title: "Onde Posicionar os Painéis Acústicos",
    subtitle: "A posição dos painéis é tão importante quanto a qualidade do material.",
    desc: "Um guia técnico e visual sobre os pontos estratégicos de posicionamento para maximizar a performance acústica do seu ambiente.",
    heroColor: "hsl(205,70%,50%)",
    sections: [
      {
        type: "text",
        title: "O Princípio das Primeiras Reflexões",
        content: "Quando uma fonte sonora emite som, a energia se propaga em todas as direções. A primeira onda que chega ao ouvinte é o som direto — o mais puro e preciso. Logo em seguida chegam as primeiras reflexões: ondas que atingiram a parede, o teto ou o piso mais próximos antes de alcançar o ouvinte. Essas reflexões iniciais (entre 5 ms e 30 ms após o som direto) são as que mais interferem na percepção de clareza, localização estéreo e inteligibilidade da fala. Por isso, os PONTOS DE PRIMEIRA REFLEXÃO são sempre a prioridade número 1 no tratamento acústico. Para encontrá-los, use o 'truque do espelho': sente-se na posição de escuta e peça para alguém deslizar um espelho pela parede — onde você conseguir ver a caixa de som (ou a fonte sonora) refletida, ali é um ponto de primeira reflexão.",
      },
      {
        type: "infographic",
        title: "Mapa de Posicionamento Estratégico",
        metrics: [
          { label: "Paredes Laterais", value: "1º", desc: "Pontos de primeira reflexão — absorvedores broadband de pelo menos 50mm. Reduzem interferência na imagem estéreo e melhoram a clareza." },
          { label: "Teto (Cloud)", value: "2º", desc: "Nuvens acústicas ou painéis suspensos no teto controlam reflexões verticais e reduzem o tempo de reverberação geral do ambiente." },
          { label: "Cantos (Bass Traps)", value: "3º", desc: "Cantos acumulam energia de graves (ondas estacionárias). Bass traps de alta densidade nos cantos tri-edros são essenciais para controle de baixas frequências." },
          { label: "Parede Traseira", value: "4º", desc: "Difusores na parede traseira espalham a energia sonora sem absorvê-la totalmente, mantendo vivacidade no ambiente sem criar reflexões focadas." },
          { label: "Parede Frontal", value: "5º", desc: "Absorvedores ao redor dos monitores ou da fonte sonora controlam reflexões precoces que causam cancelamento e reforço de frequências (comb filtering)." },
        ],
      },
      {
        type: "tips",
        title: "Dicas Práticas de Instalação",
        items: [
          "Comece sempre pelas primeiras reflexões laterais — é onde o impacto é mais perceptível",
          "Painéis devem ter espaçamento de 2-5cm da parede para aumentar a absorção em médio-graves",
          "Em salas retangulares, evite deixar paredes paralelas completamente reflexivas",
          "Para graves, prefira painéis mais espessos (100mm+) e posicione nos cantos com maior acúmulo",
          "Altura dos painéis: centralize na altura do ouvido sentado (cerca de 1,20m do piso)",
          "Não exagere na absorção — ambientes muito 'secos' causam fadiga auditiva e são desconfortáveis",
          "Difusores funcionam melhor a partir de 1,5m de distância do ouvinte — nunca posicione perto demais",
          "Em ambientes grandes (igrejas, auditórios), forros acústicos no teto costumam ser a solução mais eficiente",
        ],
      },
      {
        type: "highlight",
        title: "Regra de Ouro",
        content: "O tratamento perfeito é aquele que você NÃO percebe. Um ambiente bem tratado não soa 'abafado' nem 'morto' — ele soa natural, claro e confortável. Se ao entrar no espaço a primeira coisa que você nota é o silêncio excessivo, provavelmente há absorção demais. O objetivo é equilíbrio entre absorção e difusão, mantendo a vivacidade e a naturalidade do som.",
      },
    ],
  },
  {
    slug: "erros-comuns",
    icon: AlertTriangle,
    title: "Erros Comuns em Projetos Acústicos",
    subtitle: "Evite os equívocos mais frequentes que comprometem o resultado.",
    desc: "Anos de experiência em campo nos mostraram os mesmos erros se repetindo. Conheça cada um deles e saiba como evitá-los.",
    heroColor: "hsl(0,70%,50%)",
    sections: [
      {
        type: "text",
        title: "Por que projetos acústicos falham?",
        content: "A acústica é uma ciência precisa, mas muitos projetos são executados com base em achismos, mitos da internet ou economia mal planejada. O resultado são ambientes que continuam com problemas — ou que desenvolvem novos problemas após o 'tratamento'. Conhecer os erros mais comuns é o primeiro passo para garantir que o seu investimento realmente funcione.",
      },
      {
        type: "tips",
        title: "❌ Erro 1: Usar apenas espuma",
        items: [
          "Espumas convencionais têm espessura de 25–35mm e absorvem apenas frequências altas (acima de 2kHz)",
          "O resultado é um ambiente que parece 'abafado' mas continua com problemas de reverberação e graves acumulados",
          "Espumas não possuem densidade suficiente para absorver médios e graves — que são as frequências que mais causam problemas",
          "Painéis de lã de rocha com 50mm+ e densidade controlada (32-96 kg/m³) absorvem de 250Hz a 8kHz — a faixa que realmente importa",
        ],
      },
      {
        type: "tips",
        title: "❌ Erro 2: Tratar apenas uma parede",
        items: [
          "O som se propaga em TODAS as direções — tratar apenas uma superfície resolve no máximo 15-20% do problema",
          "As reflexões das paredes não tratadas continuam interferindo no campo sonoro",
          "Pior: criar assimetria no tratamento pode causar desequilíbrio na resposta estéreo (em estúdios)",
          "A solução é tratar as superfícies de forma balanceada, priorizando os pontos de primeira reflexão",
        ],
      },
      {
        type: "tips",
        title: "❌ Erro 3: Ignorar os graves",
        items: [
          "Ondas estacionárias (modos da sala) se formam entre paredes paralelas e acumulam nos cantos",
          "Esse acúmulo de graves distorce a percepção tonal do ambiente e prejudica mixagens, gravações e inteligibilidade",
          "Bass traps nos cantos (especialmente nos cantos tri-edros — onde parede encontra parede e teto) são essenciais",
          "Para graves efetivos, os absorvedores devem ter pelo menos 100mm de espessura e alta densidade (64-96 kg/m³)",
        ],
      },
      {
        type: "tips",
        title: "❌ Erro 4: Confundir tratamento com isolamento",
        items: [
          "Colar espuma ou painéis nas paredes NÃO bloqueia o som que vem de fora",
          "Isolamento exige massa, desacoplamento e vedação — é um projeto estrutural",
          "Tratar o interior de um ambiente ruidoso sem isolar é como enxugar gelo: o problema continua vindo de fora",
          "Primeiro identifique a origem do problema (interna ou externa) antes de investir em qualquer solução",
        ],
      },
      {
        type: "tips",
        title: "❌ Erro 5: Excesso de absorção",
        items: [
          "Um ambiente totalmente absorvente ('câmara morta') é extremamente desconfortável para uso humano",
          "A falta de reflexões causa fadiga auditiva, sensação de pressão nos ouvidos e dificuldade de comunicação",
          "O ideal é combinar absorção com difusão — mantendo o ambiente vivo e natural, apenas controlando os excessos",
          "Tempo de reverberação ideal varia: estúdio (0.3-0.5s), escritório (0.5-0.8s), sala de aula (0.6-0.8s), igreja (1.0-1.8s)",
        ],
      },
      {
        type: "highlight",
        title: "Como evitar todos esses erros?",
        content: "A melhor forma é contar com diagnóstico profissional antes de investir. Na Sonar, oferecemos análise acústica gratuita: você envia fotos e dimensões do ambiente, e nossa equipe técnica identifica os problemas e recomenda a solução correta — sem achismos, sem desperdício.",
      },
    ],
  },
  {
    slug: "como-melhorar-acustica",
    icon: Layers,
    title: "Como Melhorar a Acústica do Seu Ambiente",
    subtitle: "Passo a passo para diagnóstico, escolha de materiais e verificação de resultado.",
    desc: "Um guia completo e prático para transformar qualquer espaço em um ambiente acusticamente confortável.",
    heroColor: "hsl(160,50%,45%)",
    sections: [
      {
        type: "text",
        title: "Passo 1: Diagnóstico do Ambiente",
        content: "Antes de comprar qualquer material, é fundamental entender o que está acontecendo no seu ambiente. Bata palmas no centro da sala e ouça: se o som 'reverbera' por mais de 1 segundo, há excesso de reflexões. Se você ouve um 'tictictictictc' rápido e metálico, é flutter echo entre paredes paralelas. Se os graves parecem excessivos em certas posições, há ondas estacionárias. Registre as dimensões do espaço (comprimento, largura, altura), os materiais das superfícies (concreto, gesso, vidro, madeira), e a finalidade do uso. Esses dados são a base para qualquer projeto acústico eficiente.",
      },
      {
        type: "infographic",
        title: "Indicadores de Problemas Acústicos",
        metrics: [
          { label: "Teste da Palma", value: "Clap", desc: "Bata palmas no centro da sala. Se o som reverberou por mais de 1 segundo, há excesso de reflexões que precisam ser controladas com absorvedores." },
          { label: "Teste de Voz", value: "Fala", desc: "Fale normalmente e peça feedback: 'está claro ou embolado?' Se há dificuldade de entendimento, o tempo de reverberação está alto demais para o espaço." },
          { label: "Teste de Graves", value: "Bass", desc: "Toque uma música com graves e caminhe pelo ambiente. Se os graves ficam muito fortes nos cantos e somem no centro, há ondas estacionárias." },
          { label: "Teste de Flutter", value: "Echo", desc: "Bata palmas entre duas paredes paralelas e lisas. Um eco rápido e repetitivo indica flutter echo — resolva com absorvedores ou difusores em uma das paredes." },
        ],
      },
      {
        type: "text",
        title: "Passo 2: Escolha dos Materiais",
        content: "Com o diagnóstico em mãos, a escolha dos materiais segue a lógica do problema identificado. Para reverberação excessiva, painéis absorvedores broadband (lã de rocha 50mm, densidade 32-48 kg/m³) são a solução mais versátil. Para acúmulo de graves nos cantos, bass traps de alta densidade (64-96 kg/m³, espessura 100mm+) são indispensáveis. Para ambientes que precisam de vivacidade controlada (como salas de ensaio e estúdios), difusores de madeira com perfil calculado distribuem a energia sonora sem absorvê-la. A combinação correta de absorção e difusão é o que separa um projeto amador de um profissional.",
      },
      {
        type: "text",
        title: "Passo 3: Posicionamento Estratégico",
        content: "Mesmo o melhor material perde eficácia se mal posicionado. A prioridade são os pontos de primeira reflexão (paredes laterais e teto entre a fonte sonora e o ouvinte), seguidos pelos cantos (bass traps), parede traseira (difusão) e teto (nuvens acústicas). Uma regra prática: comece com 20-30% de cobertura das superfícies e avalie o resultado. Aumente gradualmente se necessário — é muito mais fácil adicionar material do que remover o excesso.",
      },
      {
        type: "tips",
        title: "Passo 4: Verificação de Resultado",
        items: [
          "Após a instalação, repita os testes de diagnóstico (palma, voz, graves, flutter) e compare com o antes",
          "Use aplicativos de medição de tempo de reverberação (RT60) para ter dados objetivos",
          "Peça feedback de outras pessoas que usam o ambiente — a percepção coletiva é valiosa",
          "Se possível, grave um 'antes e depois' com o mesmo microfone na mesma posição para comparação direta",
          "Ajuste fino: mova painéis alguns centímetros, adicione espaçadores, ou reposicione difusores conforme necessário",
          "Lembre-se: o resultado ideal depende do uso — um estúdio tem critérios diferentes de uma sala de aula",
        ],
      },
      {
        type: "highlight",
        title: "Precisa de ajuda profissional?",
        content: "A Sonar oferece consultoria acústica gratuita. Envie fotos e dimensões do seu ambiente e nossa equipe técnica fará o diagnóstico completo, recomendando os materiais, quantidades e posições ideais para o seu caso específico. Sem custos, sem compromisso — apenas orientação técnica de quem já transformou mais de 700 ambientes.",
      },
    ],
  },
];
