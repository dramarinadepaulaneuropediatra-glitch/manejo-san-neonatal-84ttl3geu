migrate(
  (app) => {
    // 1. Add references to medications schema
    try {
      const medsCol = app.findCollectionByNameOrId('medications')
      if (!medsCol.fields.getByName('references')) {
        medsCol.fields.add(new TextField({ name: 'references' }))
        app.save(medsCol)
      }
    } catch (e) {
      console.log('Error adding references field:', e.message)
    }

    // 2. Add References section
    try {
      const sectionsCol = app.findCollectionByNameOrId('sections')
      const refSection = new Record(sectionsCol)
      refSection.set('title', 'Referências Bibliográficas')
      refSection.set('order', 8)
      app.save(refSection)
    } catch (e) {
      console.log('Error adding References section:', e.message)
    }

    // 3. Seed references for existing medications
    try {
      const refsMap = {
        Morfina: 'AAP (2020) Clinical Report: Neonatal Opioid Withdrawal Syndrome.',
        Metadona: 'AAP (2020) Clinical Report: Neonatal Opioid Withdrawal Syndrome.',
        Fenobarbital: 'WHO (2014) Guidelines for the management of substance use in pregnancy.',
        Clonidina: 'AAP (2020) Clinical Report: Neonatal Opioid Withdrawal Syndrome.',
      }

      const meds = app.findRecordsByFilter('medications', '', '', 100, 0)
      for (const med of meds) {
        const name = med.get('name')
        if (refsMap[name]) {
          med.set('references', refsMap[name])
          app.save(med)
        }
      }
    } catch (e) {
      console.log('Error updating medication references:', e.message)
    }
  },
  (app) => {
    try {
      const refs = app.findRecordsByFilter('sections', 'order = 8', '', 1, 0)
      if (refs && refs.length > 0) app.delete(refs[0])
    } catch (e) {}

    try {
      const medsCol = app.findCollectionByNameOrId('medications')
      if (medsCol.fields.getByName('references')) {
        medsCol.fields.removeByName('references')
        app.save(medsCol)
      }
    } catch (e) {}
  },
)
