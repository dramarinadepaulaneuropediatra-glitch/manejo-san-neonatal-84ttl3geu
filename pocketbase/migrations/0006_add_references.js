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
      console.log('Error adding references field:', String(e))
    }

    // 2. Add References section
    try {
      const sectionsCol = app.findCollectionByNameOrId('sections')
      let refs = null
      try {
        refs = app.findRecordsByFilter('sections', 'order = 8', '', 1, 0)
      } catch (e) {}

      if (!refs || refs.length === 0) {
        const refSection = new Record(sectionsCol)
        refSection.set('title', 'Referências Bibliográficas')
        refSection.set('order', 8)
        app.save(refSection)
      }
    } catch (e) {
      console.log('Error adding References section:', String(e))
    }

    // 3. Seed references for existing medications
    try {
      const refsMap = {
        Morfina: 'AAP (2020) Clinical Report: Neonatal Opioid Withdrawal Syndrome.',
        Metadona: 'AAP (2020) Clinical Report: Neonatal Opioid Withdrawal Syndrome.',
        Fenobarbital: 'WHO (2014) Guidelines for the management of substance use in pregnancy.',
        Clonidina: 'AAP (2020) Clinical Report: Neonatal Opioid Withdrawal Syndrome.',
      }

      let meds = null
      try {
        meds = app.findRecordsByFilter('medications', '', '', 100, 0)
      } catch (e) {}

      if (meds) {
        for (let i = 0; i < meds.length; i++) {
          const med = meds[i]
          if (!med) continue

          const name = med.get('name')
          if (refsMap[name]) {
            med.set('references', refsMap[name])
            app.save(med)
          }
        }
      }
    } catch (e) {
      console.log('Error updating medication references:', String(e))
    }
  },
  (app) => {
    try {
      let refs = null
      try {
        refs = app.findRecordsByFilter('sections', 'order = 8', '', 1, 0)
      } catch (e) {}

      if (refs) {
        for (let i = 0; i < refs.length; i++) {
          app.delete(refs[i])
        }
      }
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
