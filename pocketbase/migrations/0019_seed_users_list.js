migrate(
  (app) => {
    const usersToSeed = [
      { name: 'Ana Paula Diniz Gomes', masp: '14539365' },
      { name: 'Bianca Camargos Marzano', masp: '13881883' },
      { name: 'Larissa Leite Henrique', masp: '11251139' },
      { name: 'Paula Antunes Souza de Morais', masp: '14801773' },
      { name: 'Raquel Dias Duarte de Castro', masp: '16365140' },
      { name: 'Andreia Gonçalves Cobucci', masp: '14649917' },
      { name: 'Clara Balmant Letro', masp: '15119571' },
      { name: 'Rebeca Vilaça Faria', masp: '16389025' },
      { name: 'Lilian Dayrell de Moura', masp: '16406076' },
      { name: 'Mariana Campos Linhares', masp: '16417404' },
      { name: 'Tássia Coelho Schwanz', masp: '14145551' },
      { name: 'Leticia de fátima Ferreira Alves Araújo', masp: '14317499' },
      { name: 'Mariana Lagazeta Garcia', masp: '16422818' },
      { name: 'Carolina Cunha Cezário', masp: '13857461' },
      { name: 'ANALICE CORREA MACHADO LOPES', masp: '12991204' },
      { name: 'BRUNO MORAIS DAMIÃO', masp: '12059457' },
      { name: 'CLARISSE SILVA FREITAS SOUZA', masp: '14828859' },
      { name: 'ISABELA ALVES CAMPOS DE LACERDA', masp: '14874374' },
      { name: 'IVANA PENIDO GIESBRECHT', masp: '10900371' },
      { name: 'JULIANA PALHARES BAETA', masp: '11011962' },
      { name: 'JULIANA SENRA COELHO', masp: '10892412' },
      { name: 'KEILA FERREIRA FÉLIX SILVA', masp: '13605035' },
      { name: 'LETICIA COELHO DE SOUZA', masp: '14436406' },
      { name: 'MAGALI DAMASCENA CAMARA NUNES', masp: '10831741' },
      { name: 'MARCIO FONSECA DOS REIS STHA', masp: '11023496' },
      { name: 'SILVIA DE CARVALHO FERREIRA', masp: '11507464' },
      { name: 'CINTIA CAVALVANTE FARINAZZO NEVES', masp: '13604467' },
      { name: 'RAVENNA FERNANDES SILVA VARDIERI BOUZADA', masp: '14376628' },
      { name: 'FLÁVIA ANDREIA GONÇALVES COBUCCI', masp: '14649917' },
      { name: 'CYNTIA NAYARA DE JESUS', masp: '' },
      { name: 'CARLA NEIVA CHAVES', masp: '14757199' },
      { name: 'LETÍCIA MARIA TRINDADE PIZA', masp: '14317499' },
      { name: 'SOFIA TEIXEIRA SARANTOPOULOS SAMPAIO', masp: '14145338' },
      { name: 'VIVIANE DISCACCIATI FONSECA MORAES', masp: '12939187' },
    ]

    const usersCol = app.findCollectionByNameOrId('_pb_users_auth_')
    const whitelistCol = app.findCollectionByNameOrId('masp_whitelist')

    for (const u of usersToSeed) {
      // 1. Add to masp_whitelist if masp exists
      if (u.masp) {
        try {
          app.findFirstRecordByData('masp_whitelist', 'masp', u.masp)
        } catch (_) {
          try {
            const wlRecord = new Record(whitelistCol)
            wlRecord.set('masp', u.masp)
            app.save(wlRecord)
          } catch (err) {
            console.log('Failed to insert into whitelist:', u.masp, err)
          }
        }
      }

      // 2. Add to users
      // Normalize name to create a safe username fallback
      // e.g. "CYNTIA NAYARA DE JESUS" -> "cyntianayaradejesus"
      let safeName = u.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '')
      const username = u.masp || safeName
      const email = `${username}@hjk.local`

      try {
        app.findAuthRecordByEmail('_pb_users_auth_', email)
        // Exists, skip
      } catch (_) {
        try {
          // Try looking up by username just in case email is different but username is same
          app.findFirstRecordByData('_pb_users_auth_', 'username', username)
        } catch (_) {
          try {
            const record = new Record(usersCol)
            record.setEmail(email)
            record.set('username', username)
            record.setPassword('Skip@2026')
            record.setVerified(true)
            record.set('name', u.name)
            record.set('masp', u.masp)
            app.save(record)
          } catch (err) {
            console.log('Failed to seed user:', u.name, err)
          }
        }
      }
    }
  },
  (app) => {
    // Do nothing on revert
  },
)
