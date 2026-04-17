migrate(
  (app) => {
    const users = [
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

    const col = app.findCollectionByNameOrId('users')

    for (const u of users) {
      try {
        let existing
        try {
          if (u.masp) {
            existing = app.findFirstRecordByData('users', 'masp', u.masp)
          } else {
            existing = app.findFirstRecordByData('users', 'name', u.name)
          }
        } catch (_) {}

        if (existing) {
          existing.set('name', u.name)
          existing.set('masp', u.masp)
          app.save(existing)
          continue
        }

        const record = new Record(col)
        record.set('name', u.name)
        record.set('masp', u.masp)

        const normalize = (str) => {
          return str
            .toLowerCase()
            .replace(/[áàãâä]/g, 'a')
            .replace(/[éèêë]/g, 'e')
            .replace(/[íìîï]/g, 'i')
            .replace(/[óòõôö]/g, 'o')
            .replace(/[úùûü]/g, 'u')
            .replace(/[ç]/g, 'c')
            .replace(/[^a-z0-9]/g, '')
        }

        const slug = normalize(u.name)
        let usernameBase = `${slug}_${u.masp}`.replace(/[^a-zA-Z0-9_-]/g, '')
        if (usernameBase.length < 3) usernameBase = usernameBase + '___'

        const email = `${usernameBase}@manejo.local`
        record.setEmail(email)
        record.set('username', usernameBase.slice(0, 150))
        record.setPassword('Skip@2026')
        record.setVerified(true)

        app.save(record)
      } catch (err) {
        console.log('Error seeding user ' + u.name + ': ' + err)
      }
    }
  },
  (app) => {
    // Safe down migration
  },
)
