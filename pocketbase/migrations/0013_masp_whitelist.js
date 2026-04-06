migrate(
  (app) => {
    const maspWhitelist = new Collection({
      name: 'masp_whitelist',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: 'masp', type: 'text', required: true },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_masp_whitelist_masp ON masp_whitelist (masp)'],
    })
    app.save(maspWhitelist)

    const users = app.findCollectionByNameOrId('users')
    if (!users.fields.getByName('masp')) {
      users.fields.add(new TextField({ name: 'masp' }))
      app.save(users)
    }

    const masps = [
      '12924205',
      '12868733',
      '16140303',
      '13649462',
      '12412516',
      '11728433',
      '13087374',
      '12963963',
      '12867081',
      '10900173',
      '10878411',
      '10434447',
      '11460110',
      '12049938',
      '11578937',
      '11740057',
      '13104518',
      '16361297',
      '13605035',
      '16366841',
      '13010442',
      '10891034',
      '03686094',
      '10897817',
      '13433156',
      '10997247',
      '14668255',
      '13065339',
      '13452503',
      '12864922',
      '13696943',
      '13699889',
      '13139217',
      '13648860',
      '12896254',
      '12821294',
      '16367716',
      '12704987',
      '11251568',
      '13087226',
      '12822656',
      '13706171',
      '16361180',
      '12700480',
      '12868030',
      '12997029',
      '12866422',
      '12126082',
      '13643465',
      '9434010',
      '6156673',
      '12997045',
      '10903581',
      '13290846',
      '13069323',
      '13074695',
      '12924189',
      '12866158',
      '10879633',
      '12640322',
      '9482381',
      '12206363',
      '12769717',
      '10524619',
      '10524635',
      '13083019',
      '12279436',
      '10890333',
      '13681325',
      '13068440',
      '11774585',
      '13083548',
      '16369712',
      '13140611',
      '12150132',
      '12786943',
      '10885515',
      '13705538',
      '10893410',
      '12786992',
      '13650379',
      '13652391',
      '11040342',
      '10861706',
      '11776911',
      '10910628',
    ]

    for (const m of masps) {
      try {
        app.findFirstRecordByData('masp_whitelist', 'masp', m)
      } catch (_) {
        const record = new Record(maspWhitelist)
        record.set('masp', m)
        app.save(record)
      }
    }
  },
  (app) => {
    const users = app.findCollectionByNameOrId('users')
    users.fields.removeByName('masp')
    app.save(users)

    try {
      const maspWhitelist = app.findCollectionByNameOrId('masp_whitelist')
      app.delete(maspWhitelist)
    } catch (_) {}
  },
)
