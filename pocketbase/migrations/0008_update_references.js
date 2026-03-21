migrate(
  (app) => {
    const medsCol = app.findCollectionByNameOrId('medications')
    const meds = app.findRecordsByFilter('medications', '1=1', '', 100, 0)

    for (const med of meds) {
      const name = med.get('name')

      if (name === 'Morfina') {
        med.set(
          'references',
          'AAP Clinical Report: Neonatal Opioid Withdrawal Syndrome (2020). DOI: 10.1542/peds.2020-029074',
        )
      } else if (name === 'Metadona') {
        med.set(
          'references',
          'Davis JM et al. (2014) Pharmacotherapy of Neonatal Abstinence Syndrome. AAP (2020) Guidelines.',
        )
      } else if (name === 'Fenobarbital') {
        med.set(
          'references',
          'SBP/SBN (2021) - DocCient: Síndrome de Abstinência Neonatal. Tratamento adjuvante.',
        )
      } else if (name === 'Clonidina') {
        med.set(
          'references',
          'Bada HS et al. (2002). AAP (2020). Uso adjuvante para hiperatividade autonômica refratária.',
        )
      } else if (name === 'Dexmedetomidina') {
        med.set(
          'references',
          'JAMA Pediatrics (2021) - Protocolos off-label em CTI para casos severos.',
        )
      } else if (name === 'Lorazepam') {
        med.set(
          'references',
          'NICE Guidelines (CG110) / AAP. Uso restrito e agudo para agitação/convulsão.',
        )
      } else if (name === 'Clorpromazina') {
        med.set(
          'references',
          'Desuso histórico. Atualmente contraindicado pelos protocolos AAP (2020) devido a efeitos colaterais.',
        )
      } else if (name === 'Gabapentina') {
        med.set(
          'references',
          'Neurology Journals - Series de casos investigacionais (off-label) para dor neuropática e SAN.',
        )
      }

      app.save(med)
    }
  },
  (app) => {
    // Reverção não é estritamente necessária, pois os dados apenas voltariam ao estado menos informativo.
  },
)
