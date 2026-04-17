migrate(
  (app) => {
    const usersCol = app.findCollectionByNameOrId('_pb_users_auth_')

    // Prevent new signups (admin only) to fulfill Registration Removal requirement
    usersCol.createRule = null
    app.save(usersCol)

    const slugify = (str) => {
      return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '')
    }

    const doctors = [
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
      { name: 'Leticia de Fátima Ferreira Alves Araújo', masp: '14317499' },
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

    for (const doc of doctors) {
      const slug = slugify(doc.name)
      // Combine slugified name and MASP to ensure uniqueness and act as a dual verification payload
      const username = `${slug}_${doc.masp}`
      const email = `${username}@hjk.local`

      let userRecord
      try {
        // Find by generated unique username
        userRecord = app.findFirstRecordByData('_pb_users_auth_', 'username', username)
      } catch (_) {
        try {
          // Fallback: search by exact name to preserve progress of previously seeded users
          userRecord = app.findFirstRecordByData('_pb_users_auth_', 'name', doc.name)
        } catch (_) {
          // Not found, create new record
          userRecord = new Record(usersCol)
        }
      }

      userRecord.set('username', username)
      userRecord.setEmail(email)
      userRecord.setPassword('Skip@2026')
      userRecord.setVerified(true)
      userRecord.set('name', doc.name)
      userRecord.set('masp', doc.masp)

      app.save(userRecord)
    }
  },
  (app) => {
    // Revert createRule to open in case we downgrade
    const usersCol = app.findCollectionByNameOrId('_pb_users_auth_')
    usersCol.createRule = ''
    app.save(usersCol)
  },
)
