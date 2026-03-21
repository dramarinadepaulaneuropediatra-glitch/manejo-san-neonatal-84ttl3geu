migrate(
  (app) => {
    const medsCol = app.findCollectionByNameOrId('medications')

    let changed = false
    if (!medsCol.fields.getByName('initial_dose')) {
      medsCol.fields.add(new TextField({ name: 'initial_dose' }))
      changed = true
    }
    if (!medsCol.fields.getByName('maintenance_dose')) {
      medsCol.fields.add(new TextField({ name: 'maintenance_dose' }))
      changed = true
    }
    if (!medsCol.fields.getByName('references')) {
      medsCol.fields.add(new TextField({ name: 'references' }))
      changed = true
    }
    if (changed) {
      app.save(medsCol)
    }

    const sectionsCol = app.findCollectionByNameOrId('sections')
    let section8
    try {
      section8 = app.findFirstRecordByData('sections', 'order', 8)
    } catch (e) {
      section8 = new Record(sectionsCol)
      section8.set('title', 'Referências Bibliográficas e Links de Acesso Sugeridos (Validação)')
      section8.set('order', 8)
      app.save(section8)
    }

    const meds = app.findRecordsByFilter('medications', '1=1', '', 100, 0)
    for (const med of meds) {
      const name = med.get('name')
      if (name === 'Morfina') {
        med.set('initial_dose', '0.04-0.08 mg/kg/dose a cada 3-4h (VO/EV)')
        med.set('maintenance_dose', 'Desmame lento (10-20% ao dia)')
        med.set('references', 'Baseado nas diretrizes AAP (2020) e SBP (2021).')
      } else if (name === 'Metadona') {
        med.set('initial_dose', '0.05-0.1 mg/kg/dose a cada 6-12h (VO)')
        med.set('maintenance_dose', 'Escalonamento conforme resposta; desmame gradual.')
        med.set('references', 'Baseado nas diretrizes AAP (2020) e NICE.')
      } else if (name === 'Fenobarbital') {
        med.set('initial_dose', '2-8 mg/kg/dia div 12/12h')
        med.set('maintenance_dose', 'Manutenção até estabilização do SNC.')
        med.set('references', 'Baseado nas diretrizes SBP (2021) e AAP.')
      } else if (name === 'Clonidina') {
        med.set('initial_dose', '0.5-1 mcg/kg/dose a cada 3-6h')
        med.set('maintenance_dose', 'Ajuste fino; desmame de 0.25 mcg/kg/dose.')
        med.set('references', 'Baseado na AAP e publicações da Neurology.')
      } else if (name === 'Dexmedetomidina') {
        med.set('initial_dose', '0.2-0.5 mcg/kg/h (contínuo EV)')
        med.set('maintenance_dose', 'Titulação conforme sedação. Desmame em 24-48h.')
        med.set('references', 'Baseado na SBN e JAMA Pediatrics.')
      } else if (name === 'Lorazepam') {
        med.set('initial_dose', '0.05-0.1 mg/kg/dose (EV/VO)')
        med.set('maintenance_dose', 'Uso pontual; evitar manutenção prolongada.')
        med.set('references', 'Baseado nas diretrizes NICE e AAP.')
      } else if (name === 'Clorpromazina') {
        med.set('initial_dose', 'Varia; pouco usado')
        med.set('maintenance_dose', 'Não recomendado para manutenção na atualidade.')
        med.set('references', 'Histórico; contraindicado por protocolos SBP/AAP atuais.')
      } else if (name === 'Gabapentina') {
        med.set('initial_dose', 'Off-label (apenas pesquisa)')
        med.set('maintenance_dose', 'Titulação clínica experimental.')
        med.set('references', 'Estudos investigacionais da Neurology e Lancet.')
      }
      app.save(med)
    }

    let metadonaExists = false
    for (const med of meds) {
      if (med.get('name') === 'Metadona') metadonaExists = true
    }
    if (!metadonaExists) {
      const metadona = new Record(medsCol)
      metadona.set('name', 'Metadona')
      metadona.set('indication', '1ª linha (Alternativa à Morfina)')
      metadona.set('presentation', 'Solução oral')
      metadona.set(
        'safety_efficacy',
        'Meia-vida longa, menos picos/vales. Risco de acúmulo, monitorar QT.',
      )
      metadona.set('notes', 'Monitorar QT')
      metadona.set('initial_dose', '0.05-0.1 mg/kg/dose a cada 6-12h (VO)')
      metadona.set('maintenance_dose', 'Escalonamento conforme resposta; desmame gradual.')
      metadona.set('references', 'Baseado nas diretrizes AAP (2020) e NICE.')
      app.save(metadona)
    }
  },
  (app) => {
    // Graceful fallback / revert logic placeholder
  },
)
