migrate(
  (app) => {
    const sections = app.findRecordsByFilter('sections', '1=1', '', 100, 0)
    const sec2 = sections.find((s) => s.get('order') === 2)
    const sec4 = sections.find((s) => s.get('order') === 4)
    const sec6 = sections.find((s) => s.get('order') === 6)

    if (!sec2 || !sec4 || !sec6) return

    const interactionsCol = app.findCollectionByNameOrId('interactions')

    // Update Quiz in Sec 2
    const quiz2List = app.findRecordsByFilter(
      'interactions',
      `section_id = '${sec2.id}' && type = 'quiz'`,
      '',
      10,
      0,
    )
    if (quiz2List.length > 0) {
      const q2 = quiz2List[0]
      const opts = q2.get('options') || {}
      opts.feedback = {
        a: 'Incorreto. Tremores e hipertonia são os sinais neurológicos mais frequentes da hiperatividade do SNC na SAN.',
        b: 'Correto! A SAN frequentemente causa hipertermia (febre) devido à hiperatividade autonômica. Hipotermia não é o padrão.',
        c: 'Incorreto. O choro estridente (high-pitched cry) é uma marca registrada da síndrome.',
        d: 'Incorreto. Diarreia e vômitos são achados gastrointestinais clássicos na abstinência de opióides.',
      }
      q2.set('options', opts)
      app.save(q2)
    }

    // Update Scenario in Sec 6
    const scen6List = app.findRecordsByFilter(
      'interactions',
      `section_id = '${sec6.id}' && type = 'scenario'`,
      '',
      10,
      0,
    )
    if (scen6List.length > 0) {
      const s6 = scen6List[0]
      const opts = s6.get('options') || {}
      opts.feedback = {
        fenobarbital:
          'Incorreto. O Fenobarbital atua na sedação global, mas não bloqueia a hiperatividade simpática aguda de forma tão eficaz quanto os alfa-2 agonistas neste contexto agudo.',
        clonidina:
          'Correto! A Clonidina atua nos receptores alfa-2 centrais, reduzindo a liberação de noradrenalina e controlando a hiperatividade autonômica e agitação.',
        gabapentina:
          'Incorreto. A Gabapentina carece de ensaios clínicos robustos como adjuvante de primeira linha na fase aguda do CTI neonatal.',
      }
      s6.set('options', opts)
      app.save(s6)
    }

    // Case 1: Identification
    const case1 = new Record(interactionsCol)
    case1.set('section_id', sec4.id)
    case1.set('type', 'quiz')
    case1.set(
      'question',
      'Caso Clínico 1 (Identificação): RN termo, 48h de vida, mãe usuária de opióides. Apresenta choro estridente contínuo, dorme apenas 1h após as mamadas, e tem tremores leves quando manuseado. Quais sintomas da escala de Finnegan estão presentes?',
    )
    case1.set('options', {
      choices: [
        { id: 'a', text: 'Choro estridente, sono < 1h, tremores leves ao manuseio' },
        { id: 'b', text: 'Choro normal, sono < 3h, hipertonia' },
        { id: 'c', text: 'Convulsões, febre, sudorese' },
      ],
      correct: 'a',
      feedback: {
        a: 'Correto. O RN apresenta choro estridente (critério SNC), sono diminuído para <1h e tremores associados ao manuseio (SNC). É essencial identificá-los sistematicamente.',
        b: 'Incorreto. O caso relata claramente choro estridente e sono < 1h, e não há menção à hipertonia.',
        c: 'Incorreto. Não foram observadas convulsões ou febre neste cenário inicial.',
      },
    })
    app.save(case1)

    // Case 2: Scoring
    const case2 = new Record(interactionsCol)
    case2.set('section_id', sec4.id)
    case2.set('type', 'quiz')
    case2.set(
      'question',
      'Caso Clínico 2 (Pontuação e Conduta): Aplicando a Escala de Finnegan no RN anterior: Choro estridente contínuo (Pontos: 3), Dorme < 1h (Pontos: 3), Tremores leves manuseado (Pontos: 1). Qual a pontuação total e a conduta correta?',
    )
    case2.set('options', {
      choices: [
        { id: 'a', text: 'Pontuação 5. Apenas observar.' },
        { id: 'b', text: 'Pontuação 7. Otimizar medidas não farmacológicas e reavaliar.' },
        { id: 'c', text: 'Pontuação 9. Iniciar farmacoterapia.' },
      ],
      correct: 'b',
      feedback: {
        a: 'Incorreto. A soma de 3 + 3 + 1 é 7, não 5.',
        b: 'Correto. A soma é 7. Pontuações < 8 indicam que devemos maximizar as medidas de conforto (ambiente escuro, swaddling, dieta livre) antes de considerar medicamentos, e manter avaliações frequentes.',
        c: 'Incorreto. A soma é 7. O tratamento farmacológico inicia geralmente com 3 escores consecutivos > 8 ou 2 escores > 12.',
      },
    })
    app.save(case2)

    // Case 3: Management
    const case3 = new Record(interactionsCol)
    case3.set('section_id', sec6.id)
    case3.set('type', 'quiz')
    case3.set(
      'question',
      'Caso Clínico 3 (Manejo): O mesmo RN evolui com piora clínica após 24h. Escores Finnegan: 10, 9, 11 (consecutivos). Apresenta diarreia profusa, hipertonia e não consegue mamar. Qual a medida farmacológica inicial padrão-ouro?',
    )
    case3.set('options', {
      choices: [
        { id: 'morfina', text: 'Morfina' },
        { id: 'fenobarbital', text: 'Fenobarbital' },
        { id: 'hidrata', text: 'Apenas Hidratação venosa' },
      ],
      correct: 'morfina',
      feedback: {
        morfina:
          'Correto. Escores altos consecutivos com manifestações GI (diarreia) e SNC (hipertonia) em abstinência de opióides indicam a Morfina como 1ª linha. Ela trata a hiperatividade SNC e retarda o trânsito intestinal simultaneamente.',
        fenobarbital:
          'Incorreto. Embora controle o SNC, o Fenobarbital tem pouco efeito na diarreia associada à retirada de opióides, não protegendo contra a perda nutricional GI.',
        hidrata:
          'Incorreto. Apenas hidratar não trata a causa base; a hiperatividade simpática continuará causando sintomas sistêmicos severos e sofrimento ao recém-nascido.',
      },
    })
    app.save(case3)
  },
  (app) => {},
)
