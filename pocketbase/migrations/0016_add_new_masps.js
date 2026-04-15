migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId('masp_whitelist')
    const masps = [
      '14539365',
      '13881883',
      '11251139',
      '14801773',
      '16365140',
      '14649917',
      '15119571',
      '16389025',
      '16406076',
      '16417404',
      '14145551',
      '14317499',
      '16422818',
      '13857461',
      '12991204',
      '12059457',
      '14828859',
      '14874374',
      '10900371',
      '11011962',
      '10892412',
      '13605035',
      '14436406',
      '10831741',
      '11023496',
      '11507464',
      '13604467',
      '14376628',
      '14757199',
      '14145338',
      '12939187',
      'PENDENTE-CYNTIA',
    ]

    for (const masp of masps) {
      try {
        app.findFirstRecordByData('masp_whitelist', 'masp', masp)
      } catch (_) {
        const record = new Record(collection)
        record.set('masp', masp)
        app.save(record)
      }
    }
  },
  (app) => {
    const masps = [
      '14539365',
      '13881883',
      '11251139',
      '14801773',
      '16365140',
      '14649917',
      '15119571',
      '16389025',
      '16406076',
      '16417404',
      '14145551',
      '14317499',
      '16422818',
      '13857461',
      '12991204',
      '12059457',
      '14828859',
      '14874374',
      '10900371',
      '11011962',
      '10892412',
      '13605035',
      '14436406',
      '10831741',
      '11023496',
      '11507464',
      '13604467',
      '14376628',
      '14757199',
      '14145338',
      '12939187',
      'PENDENTE-CYNTIA',
    ]
    for (const masp of masps) {
      try {
        const record = app.findFirstRecordByData('masp_whitelist', 'masp', masp)
        app.delete(record)
      } catch (_) {}
    }
  },
)
