migrate(
  (app) => {
    // 1. Seed User
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    const user = new Record(users)
    user.setEmail('dramarinadepaulaneuropediatra@gmail.com')
    user.setPassword('securepassword123')
    user.setVerified(true)
    user.set('name', 'Dra. Marina')
    app.save(user)

    // 2. Seed Sections
    const sectionsCol = app.findCollectionByNameOrId('sections')
    const sectionData = [
      { title: 'Introdução à SAN', order: 1 },
      { title: 'Quadro Clínico e Desafios', order: 2 },
      { title: 'Fatores Predisponentes', order: 3 },
      { title: 'Avaliação da SAN (Escalas)', order: 4 },
      { title: 'Tratamento (Não Farmacológico)', order: 5 },
      { title: 'Principais Medicações', order: 6 },
      { title: 'Conclusão', order: 7 },
    ]

    const savedSections = []
    for (const data of sectionData) {
      const sec = new Record(sectionsCol)
      sec.set('title', data.title)
      sec.set('order', data.order)
      app.save(sec)
      savedSections.push(sec)
    }

    // 3. Seed Interactions
    const interactionsCol = app.findCollectionByNameOrId('interactions')

    // Section 1: Icebreaker
    const int1 = new Record(interactionsCol)
    int1.set('section_id', savedSections[0].id)
    int1.set('type', 'icebreaker')
    int1.set('question', 'Qual a sua maior dificuldade no manejo da SAN?')
    int1.set('options', null)
    app.save(int1)

    // Section 2: Quiz
    const int2 = new Record(interactionsCol)
    int2.set('section_id', savedSections[1].id)
    int2.set('type', 'quiz')
    int2.set('question', 'Qual dos seguintes sintomas NÃO é tipicamente associado à SAN?')
    int2.set('options', {
      choices: [
        { id: 'a', text: 'Tremores e hipertonia' },
        { id: 'b', text: 'Hipotermia persistente' },
        { id: 'c', text: 'Choro estridente contínuo' },
        { id: 'd', text: 'Diarreia e vômitos' },
      ],
      correct: 'b',
      feedback: {
        correct:
          'Correto! A SAN frequentemente causa hipertermia (febre) devido à hiperatividade autonômica, não hipotermia.',
        incorrect:
          'Incorreto. Revise os sintomas autonômicos. A SAN costuma cursar com instabilidade térmica tendendo à hipertermia.',
      },
    })
    app.save(int2)

    // Section 3: Critical Thinking
    const int3 = new Record(interactionsCol)
    int3.set('section_id', savedSections[2].id)
    int3.set('type', 'text')
    int3.set('question', 'Como a poliuso materna pode complicar o quadro clínico da SAN?')
    int3.set('options', null)
    app.save(int3)

    // Section 4: Case Study
    const int4 = new Record(interactionsCol)
    int4.set('section_id', savedSections[3].id)
    int4.set('type', 'case_study')
    int4.set(
      'question',
      'Avalie o RN baseado nos sintomas apresentados: Choro excessivo após alimentação, tremores finos ao ser manuseado e febre leve (37.8°C). Selecione as opções que se aplicam na escala ESC.',
    )
    int4.set('options', {
      symptoms: [
        { id: 'eat', text: 'Dificuldade para comer (Eat)' },
        { id: 'sleep', text: 'Dormindo < 1 hora (Sleep)' },
        { id: 'console', text: 'Inconsolável > 10 min (Console)' },
      ],
    })
    app.save(int4)

    // Section 5: Poll
    const int5 = new Record(interactionsCol)
    int5.set('section_id', savedSections[4].id)
    int5.set('type', 'poll')
    int5.set('question', 'Qual medida não farmacológica você considera mais eficaz na sua prática?')
    int5.set('options', {
      choices: [
        { id: 'env', text: 'Redução de Estímulos (Luz/Som)' },
        { id: 'swaddle', text: 'Swaddling (Enrolamento)' },
        { id: 'feed', text: 'Alimentação sob demanda' },
        { id: 'skin', text: 'Contato Pele a Pele' },
      ],
    })
    app.save(int5)

    // Section 6: Scenario
    const int6 = new Record(interactionsCol)
    int6.set('section_id', savedSections[5].id)
    int6.set('type', 'scenario')
    int6.set(
      'question',
      'RN em tratamento com Morfina apresenta agitação extrema refratária e sinais de abstinência polissubstância. Qual o adjuvante mais indicado?',
    )
    int6.set('options', {
      choices: [
        { id: 'fenobarbital', text: 'Fenobarbital' },
        { id: 'clonidina', text: 'Clonidina' },
        { id: 'gabapentina', text: 'Gabapentina' },
      ],
      correct: 'clonidina',
      feedback: {
        fenobarbital:
          'Embora útil, o Fenobarbital é mais indicado para sedação global e não atua diretamente na hiperatividade simpática aguda tão bem quanto os alfa-2 agonistas.',
        clonidina:
          'Correto! A Clonidina (alfa-2 agonista) é excelente adjuvante para hiperatividade autonômica refratária aos opioides.',
        gabapentina:
          'Ainda sem evidências robustas como primeira linha adjuvante no contexto agudo de CTI.',
      },
    })
    app.save(int6)

    // Section 7: Word Cloud
    const int7 = new Record(interactionsCol)
    int7.set('section_id', savedSections[6].id)
    int7.set('type', 'wordcloud')
    int7.set('question', 'Descreva o manejo da SAN em UMA palavra:')
    int7.set('options', null)
    app.save(int7)

    // 4. Seed Medications
    const medsCol = app.findCollectionByNameOrId('medications')
    const medsData = [
      {
        name: 'Morfina',
        indication: '1ª linha (Abstinência a Opióides)',
        dose: '0.04-0.08 mg/kg/dose a cada 3-4h',
        presentation: 'Solução oral',
        safety_efficacy: 'Padrão ouro, melhora escores GI e SNC',
        notes: 'Desmame lento (10-20% ao dia)',
      },
      {
        name: 'Metadona',
        indication: '1ª linha (Alternativa à Morfina)',
        dose: '0.05-0.1 mg/kg/dose a cada 6-12h',
        presentation: 'Solução oral',
        safety_efficacy: 'Meia-vida longa, menos picos/vales',
        notes: 'Risco de acúmulo, monitorar QT',
      },
      {
        name: 'Fenobarbital',
        indication: 'Adjuvante (Poliuso, SAN não-opióide)',
        dose: '2-8 mg/kg/dia div 12/12h',
        presentation: 'Solução oral',
        safety_efficacy: 'Bom para irritabilidade SNC, pouco efeito GI',
        notes: 'Sedação excessiva possível',
      },
      {
        name: 'Clonidina',
        indication: 'Adjuvante (Hiperatividade autonômica)',
        dose: '0.5-1 mcg/kg/dose a cada 3-6h',
        presentation: 'Comprimido diluído',
        safety_efficacy: 'Reduz necessidade de opióide, estabiliza FC/PA',
        notes: 'Monitorar bradicardia e hipotensão',
      },
      {
        name: 'Dexmedetomidina',
        indication: 'Adjuvante agudo (Resgate)',
        dose: '0.2-0.5 mcg/kg/h (contínuo)',
        presentation: 'IV',
        safety_efficacy: 'Excelente sedação sem depressão respiratória',
        notes: 'Uso restrito em CTI, alto custo',
      },
      {
        name: 'Lorazepam',
        indication: 'Sintomas específicos (Convulsão/Agitação)',
        dose: '0.05-0.1 mg/kg/dose',
        presentation: 'IV/Oral',
        safety_efficacy: 'Uso pontual, risco de acúmulo',
        notes: 'Evitar uso prolongado',
      },
      {
        name: 'Clorpromazina',
        indication: 'Histórico, pouco usado hoje',
        dose: 'Varia',
        presentation: 'Oral',
        safety_efficacy: 'Muitos efeitos colaterais extrapiramidais',
        notes: 'Não recomendado na prática atual',
      },
      {
        name: 'Gabapentina',
        indication: 'Investigacional (Adjuvante neurológico)',
        dose: 'Off-label',
        presentation: 'Oral',
        safety_efficacy: 'Faltam estudos robustos em neonatos',
        notes: 'Uso apenas em protocolos de pesquisa',
      },
    ]

    for (const data of medsData) {
      const med = new Record(medsCol)
      for (const [key, value] of Object.entries(data)) {
        med.set(key, value)
      }
      app.save(med)
    }
  },
  (app) => {
    // Revert is handled by collection deletion in migration 1
  },
)
