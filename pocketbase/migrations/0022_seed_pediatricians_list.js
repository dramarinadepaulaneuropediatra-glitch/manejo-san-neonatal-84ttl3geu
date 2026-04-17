migrate(
  (app) => {
    const usersToSeed = [
      'Ana Paula Diniz Gomes',
      'Bianca Camargos Marzano',
      'Larissa Leite Henrique',
      'Paula Antunes Souza de Morais',
      'Raquel Dias Duarte de Castro',
      'Andreia Gonçalves Cobucci',
      'Clara Balmant Letro',
      'Rebeca Vilaça Faria',
      'Lilian Dayrell de Moura',
      'Mariana Campos Linhares',
      'Tássia Coelho Schwanz',
      'Leticia de Fátima Ferreira Alves Araújo',
      'Mariana Lagazeta Garcia',
      'Carolina Cunha Cezário',
      'ANALICE CORREA MACHADO LOPES',
      'BRUNO MORAIS DAMIÃO',
      'CLARISSE SILVA FREITAS SOUZA',
      'ISABELA ALVES CAMPOS DE LACERDA',
      'IVANA PENIDO GIESBRECHT',
      'JULIANA PALHARES BAETA',
      'JULIANA SENRA COELHO',
      'KEILA FERREIRA FÉLIX SILVA',
      'LETICIA COELHO DE SOUZA',
      'MAGALI DAMASCENA CAMARA NUNES',
      'MARCIO FONSECA DOS REIS STHA',
      'SILVIA DE CARVALHO FERREIRA',
      'CINTIA CAVALVANTE FARINAZZO NEVES',
      'RAVENNA FERNANDES SILVA VARDIERI BOUZADA',
      'FLÁVIA ANDREIA GONÇALVES COBUCCI',
      'CYNTIA NAYARA DE JESUS',
      'CARLA NEIVA CHAVES',
      'LETÍCIA MARIA TRINDADE PIZA',
      'SOFIA TEIXEIRA SARANTOPOULOS SAMPAIO',
      'VIVIANE DISCACCIATI FONSECA MORAES',
      'Plantonista CTI',
    ]

    const normalize = (str) => {
      return str
        .toLowerCase()
        .replace(/[áàãâä]/g, 'a')
        .replace(/[éèêë]/g, 'e')
        .replace(/[íìîï]/g, 'i')
        .replace(/[óòõôö]/g, 'o')
        .replace(/[úùûü]/g, 'u')
        .replace(/[ç]/g, 'c')
        .replace(/[^a-z0-9 ]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
    }

    const col = app.findCollectionByNameOrId('users')

    const existingUsers = app.findRecordsByFilter('users', '1=1', '', 1000, 0)

    for (const name of usersToSeed) {
      const searchName = normalize(name)
      let exists = false

      for (let i = 0; i < existingUsers.length; i++) {
        const uName = normalize(existingUsers[i].getString('name'))
        if (uName === searchName) {
          exists = true
          break
        }
      }

      if (!exists) {
        const dummyEmail = normalize(name).replace(/\s+/g, '') + '@neo.san.local'
        try {
          const record = new Record(col)
          record.set('name', name)
          record.setEmail(dummyEmail)
          record.setPassword('Skip@2026')
          record.setVerified(true)
          app.save(record)
        } catch (e) {
          console.log('Error seeding user: ' + name)
        }
      }
    }
  },
  (app) => {
    // no-op, retain the seeded users to ensure they exist across rollbacks
  },
)
