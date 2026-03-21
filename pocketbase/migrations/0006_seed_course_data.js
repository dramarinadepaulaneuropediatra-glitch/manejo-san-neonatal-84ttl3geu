migrate(
  (app) => {
    // 1. Seed Medications
    const meds = [
      {
        name: 'Morfina',
        indication: '1ª Linha (Padrão-ouro)',
        initial_dose: '0.04 - 0.08 mg/kg/dose VO a cada 3-4h',
        maintenance_dose: 'Aumentos de 0.04 mg/kg. Desmame: 10% da dose máx a cada 24-48h',
        presentation: 'Sol. Oral 0.4 mg/mL',
        safety_efficacy: 'Alta eficácia. Reduz motilidade GI e hiperatividade do SNC.',
        references: 'AAP (2020); Pediatrics',
      },
      {
        name: 'Metadona',
        indication: '1ª Linha (Ação prolongada)',
        initial_dose: '0.05 - 0.1 mg/kg/dose VO a cada 6-12h',
        maintenance_dose: 'Ajuste fino guiado por sintomas. Desmame ambulatorial lento.',
        presentation: 'Sol. Oral 1 mg/mL',
        safety_efficacy: 'Meia-vida prolongada (reduz picos). Risco de prolongamento QT.',
        references: 'The Lancet (2019); AAP (2020)',
      },
      {
        name: 'Fenobarbital',
        indication: 'Adjuvante (Poliuso / SAN não-opióide)',
        initial_dose: 'Ataque: 16 mg/kg/dose EV/VO',
        maintenance_dose: 'Manutenção: 2-8 mg/kg/dia',
        presentation: 'Sol. Oral 4 mg/mL',
        safety_efficacy: 'Promove sedação global. Não resolve sintomas gastrointestinais.',
        references: 'SBP/SBN (2021)',
      },
      {
        name: 'Clonidina',
        indication: 'Adjuvante (Hiperatividade Autonômica)',
        initial_dose: '0.5 - 1 mcg/kg/dose VO a cada 6h',
        maintenance_dose: 'Aumentar até 1 mcg/kg/dose a cada 3-4h. Desmame gradual.',
        presentation: 'Suspensão manipulada / Comprimidos',
        safety_efficacy: 'Controla tônus simpático. Requer monitorização de pressão e FC.',
        references: 'JAMA Pediatrics (2021)',
      },
      {
        name: 'Dexmedetomidina',
        indication: 'Adjuvante (Resgate CTI severo)',
        initial_dose: '0.2 - 0.5 mcg/kg/h EV (Contínuo)',
        maintenance_dose: 'Titular infusão. Desmame: reduzir 0.1 mcg/kg/h ao dia',
        presentation: 'Ampola EV',
        safety_efficacy: 'Excelente sedação e analgesia sem depressão respiratória significativa.',
        references: 'Pediatrics (2022)',
      },
      {
        name: 'Lorazepam',
        indication: 'Adjuvante (Crises Agudas / Agitação)',
        initial_dose: '0.05 - 0.1 mg/kg/dose EV/VO',
        maintenance_dose: 'SN ou a cada 8-12h',
        presentation: 'Ampola / Sol. Oral',
        safety_efficacy:
          'Eficaz para agitação aguda. Evitar uso contínuo longo por neurotoxicidade.',
        references: 'NICE Guidelines',
      },
      {
        name: 'Clorpromazina',
        indication: 'Adjuvante (Histórico / Restrito)',
        initial_dose: '0.5 - 0.7 mg/kg/dose VO a cada 6h',
        maintenance_dose: 'Redução progressiva',
        presentation: 'Sol. Oral',
        safety_efficacy: 'Desuso crescente devido a fortes efeitos extrapiramidais.',
        references: 'WHO (2014)',
      },
      {
        name: 'Gabapentina',
        indication: 'Adjuvante (Neuropático / Poliuso refratário)',
        initial_dose: '5 mg/kg/dose VO a cada 8h',
        maintenance_dose: 'Aumentar até 15 mg/kg/dia',
        presentation: 'Suspensão manipulada',
        safety_efficacy: 'Uso off-label promissor, bem tolerada no trato gastrointestinal.',
        references: 'Neurology (2021)',
      },
    ]

    const medsCol = app.findCollectionByNameOrId('medications')

    // Wipe existing meds to ensure exact desired state
    try {
      const oldMeds = app.findRecordsByFilter('medications', '', '', 100, 0)
      oldMeds.forEach((m) => app.delete(m))
    } catch (e) {}

    meds.forEach((m) => {
      const rec = new Record(medsCol)
      rec.set('name', m.name)
      rec.set('indication', m.indication)
      rec.set('initial_dose', m.initial_dose || '')
      rec.set('maintenance_dose', m.maintenance_dose || '')
      rec.set('presentation', m.presentation || '')
      rec.set('safety_efficacy', m.safety_efficacy || '')
      rec.set('references', m.references || '')
      app.save(rec)
    })

    // 2. Seed Interactions
    const intCol = app.findCollectionByNameOrId('interactions')

    // Wipe existing interactions to ensure exact desired state
    try {
      const oldInts = app.findRecordsByFilter('interactions', '', '', 100, 0)
      oldInts.forEach((i) => app.delete(i))
    } catch (e) {}

    const sections = app.findRecordsByFilter('sections', '', 'order', 100, 0)
    const s1 = sections.find((s) => s.get('order') === 1)
    const s2 = sections.find((s) => s.get('order') === 2)
    const s3 = sections.find((s) => s.get('order') === 3)
    const s4 = sections.find((s) => s.get('order') === 4)
    const s5 = sections.find((s) => s.get('order') === 5)
    const s6 = sections.find((s) => s.get('order') === 6)
    const s7 = sections.find((s) => s.get('order') === 7)

    if (s1) {
      const i = new Record(intCol)
      i.set('section_id', s1.id)
      i.set('type', 'icebreaker')
      i.set('question', 'Qual a maior dificuldade ao lidar com SAN em sua prática no CTI?')
      app.save(i)
    }
    if (s2) {
      const i = new Record(intCol)
      i.set('section_id', s2.id)
      i.set('type', 'quiz')
      i.set('question', 'Qual sintoma NÃO é típico da Síndrome de Abstinência Neonatal?')
      i.set('options', {
        choices: [
          { id: 'a', text: 'Tremores e Hipertonia' },
          { id: 'b', text: 'Hipotermia' },
          { id: 'c', text: 'Choro estridente contínuo' },
          { id: 'd', text: 'Diarreia profusa e vômitos' },
        ],
        correct: 'b',
        feedback: {
          a: 'Sintomas clássicos neurológicos (hiperatividade do SNC).',
          b: 'Hipotermia não é o padrão esperado. A hiperatividade autonômica na SAN frequentemente leva à FEBRE e instabilidade térmica para cima.',
          c: 'Marca registrada neurológica da síndrome.',
          d: 'Achados gastrointestinais clássicos na abstinência de opióides.',
        },
      })
      app.save(i)
    }
    if (s3) {
      const i = new Record(intCol)
      i.set('section_id', s3.id)
      i.set('type', 'text')
      i.set(
        'question',
        'Como a poliuso materna (ex: opióides + tabaco + ISRS) complica o quadro e o manejo clínico do recém-nascido?',
      )
      app.save(i)
    }
    if (s4) {
      const i = new Record(intCol)
      i.set('section_id', s4.id)
      i.set('type', 'case_study')
      i.set(
        'question',
        'Simulação Finnegan: RN 48h, choro estridente contínuo, dorme < 1h após mamar, tremores ao manuseio. Selecione os critérios corretos:',
      )
      i.set('options', {
        symptoms: [
          { id: 'choro', text: 'Choro estridente contínuo (3 pts)' },
          { id: 'sono', text: 'Dorme < 1h após mamada (3 pts)' },
          { id: 'tremor', text: 'Tremores leves ao manuseio (1 pt)' },
          { id: 'convulsao', text: 'Convulsões generalizadas (5 pts) - Ausente no caso' },
        ],
        feedback:
          'Feedback Pedagógico: A pontuação total correta é 7. Estando < 8, o protocolo indica maximizar as medidas não-farmacológicas (ambiente calmo, swaddling, aleitamento adequado) e reavaliar de perto, em vez de introduzir farmacoterapia imediata.',
      })
      app.save(i)
    }
    if (s5) {
      const i = new Record(intCol)
      i.set('section_id', s5.id)
      i.set('type', 'poll')
      i.set(
        'question',
        'Qual medida não farmacológica é mais eficaz em sua prática clínica diária?',
      )
      i.set('options', {
        choices: [
          { id: 'amb', text: 'Penumbra e silêncio (Modulação ambiental)' },
          { id: 'swad', text: 'Swaddling (enrolamento contido)' },
          { id: 'dieta', text: 'Dieta hipercalórica fracionada' },
          { id: 'mae', text: 'Alojamento conjunto e Colo materno' },
        ],
      })
      app.save(i)
    }
    if (s6) {
      const i = new Record(intCol)
      i.set('section_id', s6.id)
      i.set('type', 'scenario')
      i.set(
        'question',
        'RN com poliuso materno e irritabilidade severa refratária à Morfina. Apresenta hiperatividade simpática grave (taquicardia, sudorese, hipertensão). Qual adjuvante é mais indicado?',
      )
      i.set('options', {
        choices: [
          { id: 'clonidina', text: 'Clonidina' },
          { id: 'fenobarbital', text: 'Fenobarbital' },
          { id: 'gabapentina', text: 'Gabapentina' },
        ],
        correct: 'clonidina',
        feedback: {
          clonidina:
            'Correto! A Clonidina é um agonista alfa-2 adrenérgico que atua diretamente inibindo o tônus simpático excessivo, controlando efetivamente a hiperatividade autonômica.',
          fenobarbital:
            'Incorreto. O Fenobarbital promove sedação global e controla convulsões, mas não atinge de forma direcionada a hiperatividade simpática autônoma.',
          gabapentina:
            'Incorreto. Embora tenha uso crescente off-label para dor e hiperatividade do SNC, não é a primeira escolha clássica para supressão simpática aguda.',
        },
      })
      app.save(i)
    }
    if (s7) {
      const i = new Record(intCol)
      i.set('section_id', s7.id)
      i.set('type', 'wordcloud')
      i.set('question', 'Resuma o manejo ideal da SAN em uma palavra:')
      app.save(i)
    }
  },
  (app) => {
    // Rollback
  },
)
