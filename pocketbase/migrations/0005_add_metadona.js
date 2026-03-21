migrate(
  (app) => {
    // 1. Insert Metadona into medications collection
    const medicationsCol = app.findCollectionByNameOrId('medications')
    const metadona = new Record(medicationsCol)
    metadona.set('name', 'Metadona')
    metadona.set(
      'indication',
      'Tratamento da Síndrome de Abstinência Neonatal (SAN), especialmente como alternativa à morfina ou para desmame prolongado.',
    )
    metadona.set(
      'dose',
      'Dose inicial de 0,05 a 0,1 mg/kg a cada 6 ou 12 horas, com desmame gradual conforme estabilização da pontuação na Escala de Finnegan.',
    )
    metadona.set('presentation', 'Solução oral (1mg/ml) ou ampolas para uso intravenoso.')
    metadona.set(
      'safety_efficacy',
      'Requer monitoramento rigoroso de depressão respiratória e sedação excessiva. Pode prolongar o intervalo QTc.',
    )
    metadona.set('notes', 'Medicamento com meia-vida longa, exigindo ajustes cautelosos.')
    app.save(metadona)

    // 2. Update Caso Clínico 3 (Manejo) to include Metadona
    const cases = app.findRecordsByFilter(
      'interactions',
      "question ~ 'Caso Clínico 3 (Manejo)'",
      '',
      10,
      0,
    )
    if (cases.length > 0) {
      const case3 = cases[0]
      const opts = case3.get('options') || {}

      if (opts.choices) {
        // Prevent duplication if migration is re-run
        if (!opts.choices.find((c) => c.id === 'metadona')) {
          opts.choices.push({ id: 'metadona', text: 'Metadona' })
        }
      }

      if (!opts.feedback) opts.feedback = {}

      // Add feedback specific to Metadona
      opts.feedback.metadona =
        'A Metadona é uma excelente alternativa opióide de 1ª linha, muito útil para desmame prolongado devido à sua meia-vida longa. Contudo, no manejo agudo clássico, a Morfina é frequentemente a escolha primária, mas sua utilidade clínica é indiscutível e segue o protocolo sequencial dependendo das pontuações da Escala de Finnegan. Exige monitoramento do intervalo QTc.'

      // Enhance the correct option (Morfina) to acknowledge Metadona and emphasize Finnegan
      opts.feedback.morfina =
        'Correto. Escores altos e persistentes na Escala de Finnegan com manifestações GI e SNC indicam intervenção opióide imediata (Morfina ou Metadona) como 1ª linha, visando o controle sequencial e padronizado. A Morfina tem ação mais curta, facilitando titulação rápida.'

      case3.set('options', opts)
      app.save(case3)
    }
  },
  (app) => {
    // 1. Revert Metadona insertion
    try {
      const meds = app.findRecordsByFilter('medications', "name = 'Metadona'", '', 1, 0)
      if (meds.length > 0) {
        app.delete(meds[0])
      }
    } catch (e) {
      // ignore
    }

    // 2. Revert Caso Clínico 3 (Manejo)
    try {
      const cases = app.findRecordsByFilter(
        'interactions',
        "question ~ 'Caso Clínico 3 (Manejo)'",
        '',
        10,
        0,
      )
      if (cases.length > 0) {
        const case3 = cases[0]
        const opts = case3.get('options') || {}

        if (opts.choices) {
          opts.choices = opts.choices.filter((c) => c.id !== 'metadona')
        }

        if (opts.feedback) {
          delete opts.feedback.metadona
          // Restore original feedback
          opts.feedback.morfina =
            'Correto. Escores altos consecutivos com manifestações GI (diarreia) e SNC (hipertonia) em abstinência de opióides indicam a Morfina como 1ª linha. Ela trata a hiperatividade SNC e retarda o trânsito intestinal simultaneamente.'
        }

        case3.set('options', opts)
        app.save(case3)
      }
    } catch (e) {
      // ignore
    }
  },
)
