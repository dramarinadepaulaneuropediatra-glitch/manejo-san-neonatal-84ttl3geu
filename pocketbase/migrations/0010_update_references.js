migrate(
  (app) => {
    try {
      const section8 = app.findFirstRecordByFilter('sections', 'order = 8')
      if (section8) {
        section8.set('title', 'Referências Clínicas e Científicas')
        app.save(section8)
      }
    } catch (err) {
      // collection might not exist or be empty
    }
  },
  (app) => {
    try {
      const section8 = app.findFirstRecordByFilter('sections', 'order = 8')
      if (section8) {
        section8.set('title', 'Referências Bibliográficas e Links de Acesso Sugeridos (Validação)')
        app.save(section8)
      }
    } catch (err) {
      // ignore
    }
  },
)
