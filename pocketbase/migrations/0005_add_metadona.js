migrate(
  (app) => {
    try {
      const col = app.findCollectionByNameOrId('medications')

      // Check if Metadona already exists to avoid duplicates
      let existing = []
      try {
        existing = app.findRecordsByFilter('medications', "name='Metadona'", '', 1, 0)
      } catch (e) {
        // collection might be empty
      }

      if (!existing || existing.length === 0) {
        const record = new Record(col)
        record.set('name', 'Metadona')
        record.set('indication', 'Opióide de 1ª linha (alternativa)')
        record.set('dose', '0.05 a 0.1 mg/kg/dose a cada 6 a 12 horas')
        record.set('presentation', 'Solução oral 1 mg/mL')
        record.set(
          'safety_efficacy',
          'Apresenta meia-vida mais longa que a morfina, podendo resultar em um desmame mais regular.',
        )
        record.set(
          'notes',
          'Risco de prolongamento do intervalo QT. Monitorização eletrocardiográfica recomendada.',
        )
        app.save(record)
      }
    } catch (err) {
      console.log('Error in 0005 up:', err.message)
    }
  },
  (app) => {
    try {
      const existing = app.findRecordsByFilter('medications', "name='Metadona'", '', 10, 0)
      if (existing && existing.length > 0) {
        for (const record of existing) {
          app.delete(record)
        }
      }
    } catch (err) {
      console.log('Error in 0005 down:', err.message)
    }
  },
)
